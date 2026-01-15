<?php

namespace App\Commands;

use CodeIgniter\CLI\BaseCommand;
use CodeIgniter\CLI\CLI;
use App\Models\ScheduleRun;
use App\Models\MaintenanceStatusLog;

class GenerateCompleteScheduleRun extends BaseCommand
{
    protected $group       = 'System';
    protected $name        = 'schedule:complete';
    protected $description = 'Mark schedule runs as completed for today';

    public function run(array $params)
    {
        $CURRENT_DATE = date("Y-m-d");

        $ScheduleRun = new ScheduleRun();
        $MaintenanceStatusLog = new MaintenanceStatusLog();

        // Ambil semua schedule_run yang belum selesai untuk hari ini
        $schedule_runs = $ScheduleRun
            ->where('run_date', $CURRENT_DATE)
            ->where('status', 'approve')
            ->findAll();

        if (empty($schedule_runs)) {
            CLI::write("ℹ️  No approve schedule runs found for {$CURRENT_DATE}.", 'yellow');
            return;
        }

        foreach ($schedule_runs as $run) {
            $oldStatus = $run->status;
            $newStatus = 'completed';

            // Update status schedule_run
            $ScheduleRun->update($run->id, [
                'status'     => $newStatus
            ]);

            // Simpan ke log status
            $MaintenanceStatusLog->insert([
                'entity_type' => 'schedule',
                'entity_id'   => $run->schedule_id,
                'old_status'  => $oldStatus,
                'new_status'  => $newStatus,
                'note'        => 'Schedule run completed automatically',
                'changed_by'  => -1 // system user
            ]);

            CLI::write("✅ ScheduleRun ID {$run->id} updated to 'completed'", 'green');
        }

        CLI::write("🎉 All pending schedule runs for {$CURRENT_DATE} marked as completed.", 'light_green');
    }
}
