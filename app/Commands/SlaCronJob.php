<?php

/**
 * SLA Cron Job Command
 * Periodic background job to check SLA compliance and trigger escalations
 * 
 * Run every 5-10 minutes via system cron:
 * Example: php spark sla:check
 * 
 * @author Sarip Hidayat <hidayatsarip2210@gmail.com>
 * @copyright Sarip Hidayat 2024  
 * @date 2025-12-10
 */

namespace App\Commands;

use CodeIgniter\CLI\BaseCommand;
use CodeIgniter\CLI\CLI;
use App\Libraries\SlaService;
use App\Libraries\EscalationService;
use App\Models\Ticket;
use App\Models\SlaTracking;
use DateTime;

class SlaCronJob extends BaseCommand
{
    protected $group = 'SLA';
    protected $name = 'sla:check';
    protected $description = 'Check SLA compliance for all active tickets and trigger escalations';
    protected $usage = 'sla:check [--verbose]';
    protected $arguments = [];
    protected $options = [
        '--verbose' => 'Show detailed output',
    ];

    public function run(array $params)
    {
        $verbose = array_key_exists('verbose', $params) || CLI::getOption('verbose');

        CLI::write('===========================================', 'green');
        CLI::write('SLA Compliance Checker - ' . date('Y-m-d H:i:s'), 'green');
        CLI::write('===========================================', 'green');
        CLI::newLine();

        $slaService = new SlaService();
        $escalationService = new EscalationService();
        $ticketModel = new Ticket();
        $trackingModel = new SlaTracking();

        // Get all open/active tickets
        $activeTickets = $ticketModel
            ->whereIn('status', ['new', 'open', 'assigned', 'in_progress', 'on_hold'])
            ->findAll();

        if (empty($activeTickets)) {
            CLI::write('No active tickets found.', 'yellow');
            return;
        }

        $totalChecked = 0;
        $slaBreached = 0;
        $escalated = 0;
        $errors = 0;

        foreach ($activeTickets as $ticket) {
            try {
                $totalChecked++;

                if ($verbose) {
                    CLI::write("Checking ticket #{$ticket->ticket_code}...", 'cyan');
                }

                // Skip tickets without SLA tracking
                if (empty($ticket->sla_deadline)) {
                    if ($verbose) {
                        CLI::write("  ⚪ No SLA assigned - skipping", 'light_gray');
                    }
                    continue;
                }

                // Check SLA compliance
                $compliance = $slaService->checkCompliance($ticket->id);

                if (isset($compliance['error'])) {
                    if ($verbose) {
                        CLI::write("  ERROR: {$compliance['error']}", 'red');
                    }
                    $errors++;
                    continue;
                }

                // Check if SLA is breached
                $now = new DateTime();
                $deadline = new DateTime($ticket->sla_deadline);

                if ($now > $deadline && $compliance['is_met'] === false) {
                    // SLA breached
                    $slaService->updateTrackingStatus($ticket->id, 0);
                    $slaBreached++;

                    if ($verbose) {
                        CLI::write("  ⚠ SLA BREACHED - {$compliance['breach_duration']} overdue", 'red');
                    }

                    // Check if escalation is needed
                    $needsEscalation = $escalationService->checkEscalationNeeded($ticket->id);

                    if ($needsEscalation) {
                        $escalationResult = $escalationService->escalateTicket($ticket->id);

                        if ($escalationResult && !isset($escalationResult['error'])) {
                            $escalated++;

                            if ($verbose) {
                                CLI::write("  ↑ ESCALATED to level {$escalationResult['escalated_to_level']}", 'yellow');
                            }
                        } elseif (isset($escalationResult['error'])) {
                            if ($verbose) {
                                CLI::write("  ! Escalation note: {$escalationResult['error']}", 'light_gray');
                            }
                        }
                    }
                } elseif ($now <= $deadline) {
                    // SLA still on track
                    if ($verbose) {
                        CLI::write("  ✓ On track - {$compliance['time_remaining']} remaining", 'green');
                    }
                }

            } catch (\Exception $e) {
                echo json_encode($e->getMessage(), JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
                $errors++;
                CLI::write("  ERROR processing ticket #{$ticket->ticket_code}: {$e->getMessage()}", 'red');
                log_message('error', "SLA Cron Job error for ticket #{$ticket->id}: {$e->getMessage()}");
            }
        }

        // Summary
        CLI::newLine();
        CLI::write('===========================================', 'green');
        CLI::write('Summary:', 'white');
        CLI::write("  Total tickets checked: {$totalChecked}", 'white');
        CLI::write("  SLA breaches found: {$slaBreached}", $slaBreached > 0 ? 'red' : 'green');
        CLI::write("  Tickets escalated: {$escalated}", $escalated > 0 ? 'yellow' : 'white');
        CLI::write("  Errors: {$errors}", $errors > 0 ? 'red' : 'green');
        CLI::write('===========================================', 'green');

        log_message('info', "SLA Cron Job completed: {$totalChecked} checked, {$slaBreached} breached, {$escalated} escalated");
    }
}
