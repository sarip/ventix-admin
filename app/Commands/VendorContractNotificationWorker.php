<?php

/**
 * Vendor Contract Notification Worker Command
 * Check and notify expiring vendor contracts
 * 
 * Run: php spark notify:vendor
 * 
 * @author Sarip Hidayat <hidayatsarip2210@gmail.com>
 * @date 2025-12-11
 */

namespace App\Commands;

use CodeIgniter\CLI\BaseCommand;
use CodeIgniter\CLI\CLI;
use App\Models\VendorContract;
use App\Libraries\RedisNotification;
use App\Libraries\NotificationService;
use DateTime;

class VendorContractNotificationWorker extends BaseCommand
{
    protected $group = 'Notifications';
    protected $name = 'notify:vendor';
    protected $description = 'Check and notify expiring vendor contracts';
    protected $usage = 'notify:vendor [--verbose]';
    protected $options = [
        '--verbose' => 'Show detailed output',
    ];

    public function run(array $params)
    {
        $verbose = array_key_exists('verbose', $params) || CLI::getOption('verbose');

        CLI::write('===========================================', 'green');
        CLI::write('Vendor Contract Notification Worker - ' . date('Y-m-d H:i:s'), 'green');
        CLI::write('===========================================', 'green');
        CLI::newLine();

        $contractModel = new VendorContract();
        $redis = new RedisNotification('vendor');
        $notificationService = new NotificationService();

        $notificationsSent = 0;
        $errors = 0;

        // 1. Check contracts expiring within 30 days
        CLI::write('Checking contracts expiring within 30 days...', 'cyan');
        $expiringSoon = $contractModel
            ->where('end_date <=', date('Y-m-d', strtotime('+30 days')))
            ->where('end_date >', date('Y-m-d'))
            ->findAll();

        foreach ($expiringSoon as $contract) {
            try {
                $endDate = new DateTime($contract->end_date);
                $now = new DateTime();
                $diff = $now->diff($endDate);
                $daysRemaining = (int) $diff->format('%a');

                if ($verbose) {
                    CLI::write("  → Contract: {$contract->title} expires in {$daysRemaining} days", 'yellow');
                }

                // TODO: Get manager user IDs from database
                // For now, notify admin (user_id = 1)
                $managerIds = [1]; // Placeholder

                $urgency = $daysRemaining <= 7 ? 'MENDESAK!' : '';

                foreach ($managerIds as $userId) {
                    // Create database notification
                    $notificationService->create(
                        $userId,
                        'vendor_contract_expiry',
                        'vendor_contract',
                        $contract->id,
                        $urgency ? "Kontrak Vendor {$urgency}" : "Kontrak Vendor Akan Berakhir",
                        "Kontrak '{$contract->title}' (ID: {$contract->contract_id}) akan berakhir dalam {$daysRemaining} hari pada " . date('d M Y', strtotime($contract->end_date))
                    );
                }

                // Publish to Redis
                $redis->publishVendorContractExpiry($contract, $daysRemaining);
                $notificationsSent++;

            } catch (\Exception $e) {
                $errors++;
                CLI::write("  ERROR: {$e->getMessage()}", 'red');
                log_message('error', "Vendor contract notification error: {$e->getMessage()}");
            }
        }

        // Summary
        CLI::newLine();
        CLI::write('===========================================', 'green');
        CLI::write('Summary:', 'white');
        CLI::write("  Contracts expiring soon: " . count($expiringSoon), 'white');
        CLI::write("  Notifications sent: {$notificationsSent}", 'green');
        CLI::write("  Errors: {$errors}", $errors > 0 ? 'red' : 'green');
        CLI::write('===========================================', 'green');

        log_message('info', "Vendor Contract Notification Worker completed: {$notificationsSent} sent, {$errors} errors");
    }
}
