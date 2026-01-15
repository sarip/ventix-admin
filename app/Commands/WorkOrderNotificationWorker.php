<?php

/**
 * Work Order Notification Worker Command
 * Check and notify work order events
 * 
 * Run: php spark notify:wo
 * 
 * @author Sarip Hidayat <hidayatsarip2210@gmail.com>
 * @date 2025-12-11
 */

namespace App\Commands;

use CodeIgniter\CLI\BaseCommand;
use CodeIgniter\CLI\CLI;
use App\Models\WorkOrder;
use App\Libraries\RedisNotification;
use App\Libraries\NotificationService;
use DateTime;

class WorkOrderNotificationWorker extends BaseCommand
{
    protected $group = 'Notifications';
    protected $name = 'notify:wo';
    protected $description = 'Check and notify work order events';
    protected $usage = 'notify:wo [--verbose]';
    protected $options = [
        '--verbose' => 'Show detailed output',
    ];

    public function run(array $params)
    {
        $verbose = array_key_exists('verbose', $params) || CLI::getOption('verbose');

        CLI::write('===========================================', 'green');
        CLI::write('Work Order Notification Worker - ' . date('Y-m-d H:i:s'), 'green');
        CLI::write('===========================================', 'green');
        CLI::newLine();

        $workOrderModel = new WorkOrder();
        $redis = new RedisNotification('wo');
        $notificationService = new NotificationService();

        $notificationsSent = 0;
        $errors = 0;

        // 1. Check newly assigned work orders (last 5 minutes)
        CLI::write('Checking newly assigned work orders...', 'cyan');
        $recentlyAssigned = $workOrderModel
            ->where('assigned_to IS NOT NULL')
            ->where('created_at >=', date('Y-m-d H:i:s', strtotime('-5 minutes')))
            ->findAll();

        foreach ($recentlyAssigned as $wo) {
            try {
                // Check if notification already sent
                // Simple check: if created within last 5 minutes, assume it's new
                $timeDiff = time() - strtotime($wo->created_at);

                if ($timeDiff <= 300 && $wo->assigned_to) { // 5 minutes = 300 seconds
                    if ($verbose) {
                        CLI::write("  → WO #{$wo->wo_code} assigned to user #{$wo->assigned_to}", 'yellow');
                    }

                    // Create database notification
                    $notificationService->create(
                        $wo->assigned_to,
                        'wo_assigned',
                        'work_order',
                        $wo->id,
                        'Work Order Baru',
                        "Work Order #{$wo->wo_code} telah ditugaskan kepada Anda. Priority: {$wo->priority}"
                    );

                    $notificationsSent++;
                }

            } catch (\Exception $e) {
                $errors++;
                CLI::write("  ERROR: {$e->getMessage()}", 'red');
                log_message('error', "WO assignment notification error: {$e->getMessage()}");
            }
        }

        // 2. Check overdue work orders
        CLI::write('Checking overdue work orders...', 'cyan');
        $overdue = $workOrderModel
            ->where('scheduled_end <', date('Y-m-d H:i:s'))
            ->whereNotIn('status', ['done', 'completed', 'closed'])
            ->findAll();

        foreach ($overdue as $wo) {
            try {
                $overdueDate = new DateTime($wo->scheduled_end);
                $now = new DateTime();
                $diff = $now->diff($overdueDate);

                $overdueDuration = '';
                if ($diff->days > 0) {
                    $overdueDuration = "{$diff->days} hari";
                } elseif ($diff->h > 0) {
                    $overdueDuration = "{$diff->h} jam";
                } else {
                    $overdueDuration = "{$diff->i} menit";
                }

                if ($verbose) {
                    CLI::write("  → WO #{$wo->wo_code} overdue {$overdueDuration}", 'red');
                }

                // Notify assigned technician
                if ($wo->assigned_to) {
                    $notificationService->create(
                        $wo->assigned_to,
                        'wo_overdue',
                        'work_order',
                        $wo->id,
                        'Work Order Terlambat!',
                        "Work Order #{$wo->wo_code} sudah terlambat {$overdueDuration}"
                    );
                }

                // Notify dispatcher if exists
                if ($wo->dispatcher_id && $wo->dispatcher_id != $wo->assigned_to) {
                    $notificationService->create(
                        $wo->dispatcher_id,
                        'wo_overdue',
                        'work_order',
                        $wo->id,
                        'Work Order Terlambat!',
                        "Work Order #{$wo->wo_code} yang Anda dispatch sudah terlambat {$overdueDuration}"
                    );
                }

                // Publish to Redis
                $redis->publishWorkOrderOverdue($wo, $overdueDuration);
                $notificationsSent++;

            } catch (\Exception $e) {
                $errors++;
                CLI::write("  ERROR: {$e->getMessage()}", 'red');
                log_message('error', "WO overdue notification error: {$e->getMessage()}");
            }
        }

        // Summary
        CLI::newLine();
        CLI::write('===========================================', 'green');
        CLI::write('Summary:', 'white');
        CLI::write("  Recently assigned: " . count($recentlyAssigned), 'white');
        CLI::write("  Overdue WOs: " . count($overdue), 'white');
        CLI::write("  Notifications sent: {$notificationsSent}", 'green');
        CLI::write("  Errors: {$errors}", $errors > 0 ? 'red' : 'green');
        CLI::write('===========================================', 'green');

        log_message('info', "WO Notification Worker completed: {$notificationsSent} sent, {$errors} errors");
    }
}
