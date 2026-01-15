<?php

/**
 * Master Notification Worker Command
 * Run all notification workers sequentially
 * 
 * Run: php spark notify:all
 * 
 * @author Sarip Hidayat <hidayatsarip2210@gmail.com>
 * @date 2025-12-11
 */

namespace App\Commands;

use CodeIgniter\CLI\BaseCommand;
use CodeIgniter\CLI\CLI;

class MasterNotificationWorker extends BaseCommand
{
    protected $group = 'Notifications';
    protected $name = 'notify:all';
    protected $description = 'Run all notification workers';
    protected $usage = 'notify:all [--verbose]';
    protected $options = [
        '--verbose' => 'Show detailed output from all workers',
    ];

    public function run(array $params)
    {
        $verbose = array_key_exists('verbose', $params) || CLI::getOption('verbose');

        CLI::write('=====================================================', 'green');
        CLI::write('MASTER NOTIFICATION WORKER - ' . date('Y-m-d H:i:s'), 'green');
        CLI::write('=====================================================', 'green');
        CLI::newLine();

        $startTime = microtime(true);
        $workers = [
            'notify:pm' => 'Preventive Maintenance',
            'notify:wo' => 'Work Orders',
            'notify:inventory' => 'Inventory',
            'notify:vendor' => 'Vendor Contracts',
        ];

        $results = [];

        foreach ($workers as $command => $name) {
            CLI::write("Running {$name} Worker...", 'cyan');
            CLI::write('-----------------------------------------------------', 'dark_gray');

            try {
                $workerStartTime = microtime(true);

                // Run the worker command using service pattern
                $exitCode = 0;
                $argv = $verbose ? [$command, '--verbose'] : [$command];
                $_SERVER['argv'] = $argv;
                ob_start();

                // Create and run the command instance
                $commands = \Config\Services::commands();
                $exitCode = $commands->run($command, []);

                $output = ob_get_clean();

                $workerEndTime = microtime(true);
                $workerDuration = round($workerEndTime - $workerStartTime, 2);

                $results[$name] = [
                    'status' => 'success',
                    'duration' => $workerDuration
                ];

                CLI::write("✓ {$name} completed in {$workerDuration}s", 'green');

            } catch (\Exception $e) {
                $results[$name] = [
                    'status' => 'error',
                    'error' => $e->getMessage()
                ];

                CLI::write("✗ {$name} failed: {$e->getMessage()}", 'red');
                log_message('error', "Worker {$command} failed: {$e->getMessage()}");
            }

            CLI::newLine();
        }

        $endTime = microtime(true);
        $totalDuration = round($endTime - $startTime, 2);

        // Summary
        CLI::write('=====================================================', 'green');
        CLI::write('MASTER WORKER SUMMARY', 'white');
        CLI::write('=====================================================', 'green');

        $successCount = 0;
        $failCount = 0;

        foreach ($results as $workerName => $result) {
            if ($result['status'] === 'success') {
                CLI::write("  ✓ {$workerName}: {$result['duration']}s", 'green');
                $successCount++;
            } else {
                CLI::write("  ✗ {$workerName}: {$result['error']}", 'red');
                $failCount++;
            }
        }

        CLI::newLine();
        CLI::write("Total workers: " . count($workers), 'white');
        CLI::write("Successful: {$successCount}", 'green');
        CLI::write("Failed: {$failCount}", $failCount > 0 ? 'red' : 'green');
        CLI::write("Total duration: {$totalDuration}s", 'white');
        CLI::write('=====================================================', 'green');

        log_message('info', "Master Notification Worker completed: {$successCount} success, {$failCount} failed, {$totalDuration}s");
    }
}
