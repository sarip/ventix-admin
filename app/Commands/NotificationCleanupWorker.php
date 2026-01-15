<?php

/**
 * Notification Cleanup Worker Command
 * Delete old notifications to maintain database performance
 * 
 * Run: php spark notify:cleanup [--days=90]
 * 
 * @author Sarip Hidayat <hidayatsarip2210@gmail.com>
 * @date 2025-12-11
 */

namespace App\Commands;

use CodeIgniter\CLI\BaseCommand;
use CodeIgniter\CLI\CLI;
use App\Libraries\NotificationService;

class NotificationCleanupWorker extends BaseCommand
{
    protected $group = 'Notifications';
    protected $name = 'notify:cleanup';
    protected $description = 'Delete old notifications';
    protected $usage = 'notify:cleanup [--days=90]';
    protected $options = [
        '--days' => 'Number of days to keep (default: 90)',
    ];

    public function run(array $params)
    {
        $days = CLI::getOption('days') ?? 90;

        CLI::write('===========================================', 'green');
        CLI::write('Notification Cleanup Worker - ' . date('Y-m-d H:i:s'), 'green');
        CLI::write('===========================================', 'green');
        CLI::newLine();

        CLI::write("Deleting notifications older than {$days} days...", 'cyan');

        $notificationService = new NotificationService();
        $deletedCount = $notificationService->deleteOldNotifications($days);

        CLI::newLine();
        CLI::write('===========================================', 'green');
        CLI::write("Deleted {$deletedCount} old notifications", 'green');
        CLI::write('===========================================', 'green');

        log_message('info', "Notification Cleanup completed: {$deletedCount} notifications deleted");
    }
}
