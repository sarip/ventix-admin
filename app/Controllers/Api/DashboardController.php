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

    /**
     * Facility Dashboard
     * Get comprehensive facility booking statistics and metrics
     *
     * @return mixed
     *
     * @api {get} /api/v1/dashboard/facility Facility Dashboard
     * @apiName Facility-Dashboard
     * @apiGroup Dashboard
     * @apiVersion 1.0.0
     * @apiHeader {String} key Token
     */
    public function facilityDashboard()
    {
        $start_current_month = date('Y-m-01 00:00:00');
        $end_current_month = date('Y-m-t 23:59:59');
        $today = date('Y-m-d');

        // Import models
        $FacilityBooking = new \App\Models\FacilityBooking();
        $Facility = new \App\Models\Facilitie();
        $FacilityPricing = new \App\Models\FacilityPricing();

        // 1. BOOKING STATISTICS
        $bookingStats = [];

        // Total bookings this month
        $bookingStats['total_this_month'] = $FacilityBooking
            ->where('created_at >=', $start_current_month)
            ->where('created_at <=', $end_current_month)
            ->countAllResults();

        // Bookings by status this month
        $bookingStats['pending'] = $FacilityBooking
            ->where('created_at >=', $start_current_month)
            ->where('created_at <=', $end_current_month)
            ->where('status', 'Pending')
            ->countAllResults();

        $bookingStats['confirmed'] = $FacilityBooking
            ->where('created_at >=', $start_current_month)
            ->where('created_at <=', $end_current_month)
            ->where('status', 'confirmed')
            ->countAllResults();

        $bookingStats['completed'] = $FacilityBooking
            ->where('created_at >=', $start_current_month)
            ->where('created_at <=', $end_current_month)
            ->where('status', 'completed')
            ->countAllResults();

        $bookingStats['cancelled'] = $FacilityBooking
            ->where('created_at >=', $start_current_month)
            ->where('created_at <=', $end_current_month)
            ->where('status', 'cancelled')
            ->countAllResults();

        // 2. REVENUE STATISTICS
        $revenueStats = [];

        // Total revenue this month (completed bookings only)
        $completedBookings = $FacilityBooking
            ->select('SUM(total_price) as revenue')
            ->where('booking_date >=', $start_current_month)
            ->where('booking_date <=', $end_current_month)
            ->where('status', 'completed')
            ->first();
        $revenueStats['this_month'] = $completedBookings ? (float) $completedBookings->revenue : 0;

        // Potential revenue (pending + confirmed)
        $potentialBookings = $FacilityBooking
            ->select('SUM(total_price) as revenue')
            ->where('booking_date >=', $start_current_month)
            ->where('booking_date <=', $end_current_month)
            ->whereIn('status', ['Pending', 'confirmed'])
            ->first();
        $revenueStats['potential'] = $potentialBookings ? (float) $potentialBookings->revenue : 0;

        // Total revenue to date
        $allRevenue = $FacilityBooking
            ->select('SUM(total_price) as revenue')
            ->where('status', 'completed')
            ->first();
        $revenueStats['total_all_time'] = $allRevenue ? (float) $allRevenue->revenue : 0;

        // 3. FACILITY STATISTICS
        $facilityStats = [];
        $facilityStats['total_facilities'] = $Facility->countAllResults();
        $facilityStats['available_facilities'] = $Facility->where('is_available', 1)->countAllResults();
        $facilityStats['unavailable_facilities'] = $Facility->where('is_available', 0)->countAllResults();

        // 4. TODAY'S BOOKINGS
        $todayBookings = $FacilityBooking
            ->select('facility_bookings.*, facilities.name as facility_name, users.name as user_name')
            ->join('facilities', 'facilities.id = facility_bookings.facility_id', 'left')
            ->join('users', 'users.id = facility_bookings.user_id', 'left')
            ->where('facility_bookings.booking_date', $today)
            ->whereNotIn('facility_bookings.status', ['cancelled'])
            ->orderBy('facility_bookings.start_time', 'ASC')
            ->findAll();

        // 5. UPCOMING BOOKINGS (next 7 days)
        $upcomingBookings = $FacilityBooking
            ->select('facility_bookings.*, facilities.name as facility_name, users.name as user_name')
            ->join('facilities', 'facilities.id = facility_bookings.facility_id', 'left')
            ->join('users', 'users.id = facility_bookings.user_id', 'left')
            ->where('facility_bookings.booking_date >', $today)
            ->where('facility_bookings.booking_date <=', date('Y-m-d', strtotime('+7 days')))
            ->whereIn('facility_bookings.status', ['Pending', 'confirmed'])
            ->orderBy('facility_bookings.booking_date', 'ASC')
            ->orderBy('facility_bookings.start_time', 'ASC')
            ->limit(10)
            ->findAll();

        // 6. TOP FACILITIES (by booking count this month)
        $topFacilities = $FacilityBooking
            ->select('facilities.id, facilities.name, facilities.category, COUNT(facility_bookings.id) as booking_count, SUM(facility_bookings.total_price) as total_revenue')
            ->join('facilities', 'facilities.id = facility_bookings.facility_id', 'left')
            ->where('facility_bookings.booking_date >=', $start_current_month)
            ->where('facility_bookings.booking_date <=', $end_current_month)
            ->groupBy('facilities.id')
            ->orderBy('booking_count', 'DESC')
            ->limit(5)
            ->findAll();

        // 7. MONTHLY TREND (last 6 months)
        $monthlyTrend = [];
        for ($i = 5; $i >= 0; $i--) {
            $month_start = date('Y-m-01', strtotime("-$i month"));
            $month_end = date('Y-m-t', strtotime("-$i month"));
            $month_name = date('M Y', strtotime("-$i month"));

            $count = $FacilityBooking
                ->where('booking_date >=', $month_start)
                ->where('booking_date <=', $month_end)
                ->countAllResults();

            $revenue = $FacilityBooking
                ->select('SUM(total_price) as revenue')
                ->where('booking_date >=', $month_start)
                ->where('booking_date <=', $month_end)
                ->where('status', 'completed')
                ->first();

            $monthlyTrend[] = [
                'month' => $month_name,
                'bookings' => $count,
                'revenue' => $revenue ? (float) $revenue->revenue : 0
            ];
        }

        // Compile output
        $output = [
            'booking_stats' => $bookingStats,
            'revenue_stats' => $revenueStats,
            'facility_stats' => $facilityStats,
            'today_bookings' => $todayBookings,
            'upcoming_bookings' => $upcomingBookings,
            'top_facilities' => $topFacilities,
            'monthly_trend' => $monthlyTrend
        ];

        return $this->successOutput($output);
    }
}
