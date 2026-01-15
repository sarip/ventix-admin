<?php

/**
 * Shift Reminder Worker Command
 * 
 * Sends reminders to staff 30 minutes before their shift starts
 * Run: php spark shift:reminder
 * 
 * @author Sarip Hidayat <hidayatsarip2210@gmail.com>
 * @date 2025-12-12
 */

namespace App\Commands;

use CodeIgniter\CLI\BaseCommand;
use CodeIgniter\CLI\CLI;
use App\Models\UserShift;
use App\Libraries\NotificationService;

class ShiftReminderWorker extends BaseCommand
{
    protected $group = 'Notifications';
    protected $name = 'shift:reminder';
    protected $description = 'Send shift reminders 30 minutes before shift starts';
    protected $usage = 'shift:reminder [--verbose]';
    protected $options = [
        '--verbose' => 'Show detailed output',
    ];

    public function run(array $params)
    {
        $verbose = array_key_exists('verbose', $params) || CLI::getOption('verbose');

        CLI::write('===========================================', 'green');
        CLI::write('Shift Reminder Worker - ' . date('Y-m-d H:i:s'), 'green');
        CLI::write('===========================================', 'green');
        CLI::newLine();

        $userShiftModel = new \App\Models\UserShift();
        $notificationService = new NotificationService();

        $today = date('Y-m-d');
        $currentTime = date('H:i:s');

        // Calculate time 30 minutes from now (reminder window)
        $reminderTime = date('H:i:s', strtotime('+30 minutes'));
        $reminderTimeEnd = date('H:i:s', strtotime('+35 minutes')); // 5-minute window

        CLI::write("Checking for shifts starting between {$reminderTime} and {$reminderTimeEnd}...", 'cyan');

        // Get all active user shifts for today
        $userShifts = $userShiftModel
            ->select('user_shifts.*, users.fullname, users.email, shifts.name as shift_name, shifts.start_time, shifts.end_time')
            ->join('users', 'users.id = user_shifts.user_id')
            ->join('shifts', 'shifts.id = user_shifts.shift_id')
            ->where('user_shifts.start_date <=', $today)
            ->where('user_shifts.is_active', 1)
            ->groupStart()
            ->where('user_shifts.end_date >=', $today)
            ->orWhere('user_shifts.end_date IS NULL')
            ->groupEnd()
            ->findAll();

        $remindersSent = 0;

        foreach ($userShifts as $userShift) {
            // Check if shift starts in the reminder window
            if ($userShift->start_time >= $reminderTime && $userShift->start_time <= $reminderTimeEnd) {

                if ($verbose) {
                    CLI::write("  → Sending reminder to {$userShift->fullname} for shift '{$userShift->shift_name}' at {$userShift->start_time}", 'yellow');
                }

                // Send notification
                $notificationService->create(
                    $userShift->user_id,
                    'shift_reminder',
                    'user_shift',
                    $userShift->id,
                    'Shift Reminder',
                    "Shift Anda '{$userShift->shift_name}' akan dimulai dalam 30 menit pada {$userShift->start_time}. Jangan lupa clock-in!"
                );

                $remindersSent++;
            }
        }

        // Summary
        CLI::newLine();
        CLI::write('===========================================', 'green');
        CLI::write('Summary:', 'white');
        CLI::write("  Total shifts checked: " . count($userShifts), 'white');
        CLI::write("  Reminders sent: {$remindersSent}", 'green');
        CLI::write('===========================================', 'green');

        log_message('info', "Shift Reminder Worker completed: {$remindersSent} reminders sent");
    }
}
