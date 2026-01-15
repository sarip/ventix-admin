<?php
/**
 * @author Sarip Hidayat <hidayatsarip2210@gmail.com>
 * @copyright Sarip Hidayat 2024
 * @date 2025-10-28
 */


namespace App\Controllers\Api;

use App\Filters\SearchFilter;
use App\Models\Certification;
use App\Models\ScheduleRun;
use App\Models\User;
use App\Models\WorkOrder;

class DashboardController extends ApiController
{

    public function maintenanceDashboard()
    {
        $start_current_month = date('Y-m-01 00:00:00');
        $end_current_month = date('Y-m-t 23:59:59');

        $ScheduleRun = new ScheduleRun();
        $WorkOrder = new WorkOrder();
        $summaries['preventive_maintenance'] = $ScheduleRun->where('created_at >=', $start_current_month)->where('created_at <=', $end_current_month)->countAllResults();
        $summaries['corrective_maintenance'] = $WorkOrder->where('scheduled_start >=', $start_current_month)->where('scheduled_end <=', $end_current_month)->countAllResults();
        $summaries['predictive_maintenance'] = 0;


        $output = [
            'summaries' => $summaries,
        ];
        return $this->successOutput($output);
    }
}
