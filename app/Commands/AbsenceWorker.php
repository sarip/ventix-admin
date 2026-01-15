<?php

/**
 * Absence Worker Command
 * 
 * Detects absent staff and automatically assigns replacements
 * Run: php spark absence:check
 * 
 * @author Sarip Hidayat <hidayatsarip2210@gmail.com>
 * @date 2025-12-12
 */

namespace App\Commands;

use CodeIgniter\CLI\BaseCommand;
use CodeIgniter\CLI\CLI;
use App\Libraries\RotationService;
use App\Libraries\AttendanceService;

class AbsenceWorker extends BaseCommand
{
    protected $group = 'Notifications';
    protected $name = 'absence:check';
    protected $description = 'Detect absent staff and assign replacements';
    protected $usage = 'absence:check [--verbose]';
    protected $options = [
        '--verbose' => 'Show detailed output',
    ];

    public function run(array $params)
    {
        $verbose = array_key_exists('verbose', $params) || CLI::getOption('verbose');

        CLI::write('===========================================', 'green');
        CLI::write('Absence Detection Worker - ' . date('Y-m-d H:i:s'), 'green');
        CLI::write('===========================================', 'green');
        CLI::newLine();

        $rotationService = new RotationService();
        $attendanceService = new AttendanceService();

        // Step 1: Detect absent staff
        CLI::write('Detecting absent staff...', 'cyan');
        $absentStaff = $attendanceService->detectAbsentStaff();

        CLI::write("Found " . count($absentStaff) . " absent staff", 'yellow');

        if (empty($absentStaff)) {
            CLI::write('No absent staff found. All good!', 'green');
            return;
        }

        // Step 2: Process each absent staff and find replacement
        $replacementsFound = 0;
        $replacementsFailed = 0;

        foreach ($absentStaff as $absent) {
            if ($verbose) {
                CLI::write("  → Processing: {$absent['fullname']} (User ID: {$absent['user_id']})", 'yellow');
            }

            $result = $rotationService->findReplacement($absent['user_id']);

            if ($result['success']) {
                $replacementsFound++;

                if ($verbose) {
                    CLI::write("    ✓ Replacement found: {$result['replacement_name']}", 'green');
                }
            } else {
                $replacementsFailed++;

                if ($verbose) {
                    CLI::write("    ✗ No replacement found: {$result['message']}", 'red');
                }
            }
        }

        // Summary
        CLI::newLine();
        CLI::write('===========================================', 'green');
        CLI::write('Summary:', 'white');
        CLI::write("  Total absent staff: " . count($absentStaff), 'white');
        CLI::write("  Replacements found: {$replacementsFound}", 'green');
        CLI::write("  Replacements failed: {$replacementsFailed}", $replacementsFailed > 0 ? 'red' : 'white');
        CLI::write('===========================================', 'green');

        log_message('info', "Absence Worker completed: {$replacementsFound} replacements found, {$replacementsFailed} failed");
    }
}
