<?php

/**
 * PM Notification Worker Command
 * Check and notify preventive maintenance schedules
 * 
 * Run: php spark notify:pm
 * 
 * @author Sarip Hidayat <hidayatsarip2210@gmail.com>
 * @date 2025-12-11
 */

namespace App\Commands;

use CodeIgniter\CLI\BaseCommand;
use CodeIgniter\CLI\CLI;
use App\Models\ScheduleMaintenance;
use App\Models\ScheduleRun;
use App\Models\MaintenanceScheduleUser;
use App\Libraries\RedisNotification;
use App\Libraries\NotificationService;
use DateTime;

class PmNotificationWorker extends BaseCommand
{
    protected $group = 'Notifications';
    protected $name = 'notify:pm';
    protected $description = 'Check and notify preventive maintenance schedules';
    protected $usage = 'notify:pm [--verbose]';
    protected $options = [
        '--verbose' => 'Show detailed output',
    ];

    public function run(array $params)
    {
        $verbose = array_key_exists('verbose', $params) || CLI::getOption('verbose');

        CLI::write('===========================================', 'green');
        CLI::write('PM Notification Worker - ' . date('Y-m-d H:i:s'), 'green');
        CLI::write('===========================================', 'green');
        CLI::newLine();

        $scheduleModel = new ScheduleMaintenance();
        $scheduleRunModel = new ScheduleRun();
        $scheduleUserModel = new MaintenanceScheduleUser();
        $redis = new RedisNotification('pm');
        $notificationService = new NotificationService();

        $notificationsSent = 0;
        $errors = 0;

        // 1. Check PM due soon (within 24 hours)
        CLI::write('Checking PM due soon...', 'cyan');
        $dueSoon = $scheduleModel
            ->where('next_run <=', date('Y-m-d H:i:s', strtotime('+1 day')))
            ->where('next_run >', date('Y-m-d H:i:s'))
            ->where('status', 'pending')
            ->findAll();

        foreach ($dueSoon as $schedule) {
            try {
                if ($verbose) {
                    CLI::write("  → PM #{$schedule->id} ({$schedule->schedule_name}) due soon", 'yellow');
                }

                // Get assigned technicians
                $users = $scheduleUserModel->where('schedule_id', $schedule->id)->findAll();

                foreach ($users as $user) {
                    // Create database notification
                    $notificationService->create(
                        $user->user_id,
                        'pm_due_soon',
                        'schedule',
                        $schedule->id,
                        'PM Mendekati Jatuh Tempo',
                        "Preventive Maintenance '{$schedule->schedule_name}' akan jatuh tempo besok pada " . date('d M Y H:i', strtotime($schedule->next_run))
                    );
                }

                // Publish to Redis
                $redis->publishPreventiveMaintenanceDue($schedule, 'due_soon', 'besok');
                $notificationsSent++;

            } catch (\Exception $e) {
                $errors++;
                CLI::write("  ERROR: {$e->getMessage()}", 'red');
                log_message('error', "PM notification error: {$e->getMessage()}");
            }
        }

        // 2. Check PM overdue
        CLI::write('Checking PM overdue...', 'cyan');
        $overdue = $scheduleModel
            ->where('next_run <', date('Y-m-d H:i:s'))
            ->whereIn('status', ['pending', 'in_progress'])
            ->findAll();

        foreach ($overdue as $schedule) {
            try {
                $overdueDate = new DateTime($schedule->next_run);
                $now = new DateTime();
                $diff = $now->diff($overdueDate);
                $overdueDays = $diff->days;

                if ($verbose) {
                    CLI::write("  → PM #{$schedule->id} ({$schedule->schedule_name}) overdue {$overdueDays} hari", 'red');
                }

                // Get assigned technicians
                $users = $scheduleUserModel->where('schedule_id', $schedule->id)->findAll();

                foreach ($users as $user) {
                    // Create database notification
                    $notificationService->create(
                        $user->user_id,
                        'pm_overdue',
                        'schedule',
                        $schedule->id,
                        'PM Terlambat!',
                        "Preventive Maintenance '{$schedule->schedule_name}' sudah terlambat {$overdueDays} hari"
                    );
                }

                // Publish to Redis
                $redis->publishPreventiveMaintenanceDue($schedule, 'overdue', "{$overdueDays} hari yang lalu");
                $notificationsSent++;

            } catch (\Exception $e) {
                $errors++;
                CLI::write("  ERROR: {$e->getMessage()}", 'red');
                log_message('error', "PM overdue notification error: {$e->getMessage()}");
            }
        }

        // 3. Check schedule runs waiting for approval
        CLI::write('Checking schedule runs waiting approval...', 'cyan');
        $waitingApproval = $scheduleRunModel
            ->where('status', 'waiting_for_approval')
            ->findAll();

        foreach ($waitingApproval as $scheduleRun) {
            try {
                if ($verbose) {
                    CLI::write("  → Schedule Run #{$scheduleRun->id} waiting approval", 'yellow');
                }

                // Get schedule info
                $schedule = $scheduleModel->find($scheduleRun->schedule_id);

                if ($schedule) {
                    // Notify supervisors/managers (assuming user_id = 1 is admin/supervisor)
                    // TODO: Get actual supervisor role from database
                    $supervisorIds = [1]; // Placeholder

                    foreach ($supervisorIds as $supervisorId) {
                        $notificationService->create(
                            $supervisorId,
                            'pm_approval_needed',
                            'schedule_run',
                            $scheduleRun->id,
                            'PM Perlu Approval',
                            "Hasil Preventive Maintenance '{$schedule->schedule_name}' menunggu persetujuan Anda"
                        );
                    }

                    // Publish to Redis
                    $redis->publishScheduleRunApproval($scheduleRun);
                    $notificationsSent++;
                }

            } catch (\Exception $e) {
                $errors++;
                CLI::write("  ERROR: {$e->getMessage()}", 'red');
                log_message('error', "Schedule run approval notification error: {$e->getMessage()}");
            }
        }

        // Summary
        CLI::newLine();
        CLI::write('===========================================', 'green');
        CLI::write('Summary:', 'white');
        CLI::write("  PM due soon: " . count($dueSoon), 'white');
        CLI::write("  PM overdue: " . count($overdue), 'white');
        CLI::write("  Waiting approval: " . count($waitingApproval), 'white');
        CLI::write("  Notifications sent: {$notificationsSent}", 'green');
        CLI::write("  Errors: {$errors}", $errors > 0 ? 'red' : 'green');
        CLI::write('===========================================', 'green');

        log_message('info', "PM Notification Worker completed: {$notificationsSent} sent, {$errors} errors");
    }
}
