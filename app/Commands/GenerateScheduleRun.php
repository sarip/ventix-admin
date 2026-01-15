<?php

namespace App\Commands;

use CodeIgniter\CLI\BaseCommand;
use CodeIgniter\CLI\CLI;
use App\Models\ScheduleMaintenance;
use App\Models\ScheduleRun;
use App\Models\MaintenanceStatusLog;

class GenerateScheduleRun extends BaseCommand
{
    protected $group       = 'System';
    protected $name        = 'schedule:generate';
    protected $description = 'Generate schedule runs for today';

    public function run(array $params)
    {
        $CURRENT_DATE = date("Y-m-d");

        $ScheduleMaintenance = new ScheduleMaintenance();
        $schedule_maintenances = $ScheduleMaintenance
            ->where('status', 'completed')
//            ->where('next_run', $CURRENT_DATE)
            ->findAll();

        $ScheduleRun = new ScheduleRun();
        $MaintenanceStatusLog = new MaintenanceStatusLog();

        foreach ($schedule_maintenances as $schedule_maintenance) {
            $ScheduleRun->insert([
                'schedule_id' => $schedule_maintenance->id,
                'run_date'    => $CURRENT_DATE,
                'status'      => 'not_started'
            ]);


            $scheduleRunId = $ScheduleRun->insertID();

            $MaintenanceStatusLog->insert([
                'entity_type' => 'schedule',
                'entity_id'   => $schedule_maintenance->id,
                'old_status'  => null,
                'new_status'  => 'not_started',
                'note'        => 'New Schedule Created',
                'changed_by'  => -1
            ]);

            $next_run = date(
                "Y-m-d",
                strtotime("+" . $schedule_maintenance->repeat_interval_days . " days", strtotime($CURRENT_DATE))
            );
            $ScheduleMaintenance->update($schedule_maintenance->id, [
                'last_run'  => $CURRENT_DATE,
                'next_run'  => $next_run,
                'status'    => 'pending',
            ]);

            CLI::write("✅ ScheduleRun created for Schedule ID {$schedule_maintenance->id}", 'green');
        }
    }
}
