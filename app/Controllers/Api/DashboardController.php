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
use Config\Database;

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

    private function applyFacilityEoFilter($builder, array $facilityIds)
    {
        if (!empty($facilityIds)) {
            $builder->whereIn('facility_id', $facilityIds);
        }
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
        $current_user = $this->request->current_user;
        $where_eo = [];
        $db = \Config\Database::connect();
        $facilityIds = [];
        if (!empty($current_user['fo_ids']) && count($current_user['fo_ids']) > 0 ) {
            $rows = $db->table('facilities')
                ->select('id')
                ->whereIn('facility_organizer_id', $current_user['fo_ids'])
                ->get()
                ->getResultArray();

            $facilityIds = array_column($rows, 'id');


            // jika EO tidak punya facility → force empty
            if (empty($facilityIds)) {
                $facilityIds = [-1];
            }
        }

        // 1. BOOKING STATISTICS
        $bookingStats = [];

        // Total bookings this month
        $builder = $FacilityBooking
            ->where('created_at >=', $start_current_month)
            ->where('created_at <=', $end_current_month);

        $this->applyFacilityEoFilter($builder, $facilityIds);
        $bookingStats['total_this_month'] = $builder->countAllResults();

        // Bookings by status this month
        $builder = $FacilityBooking
            ->where('created_at >=', $start_current_month)
            ->where('created_at <=', $end_current_month)
            ->where('status', 'Pending');
        $this->applyFacilityEoFilter($builder, $facilityIds);
        $bookingStats['pending'] = $builder->countAllResults();

        $builder = $FacilityBooking
            ->where('created_at >=', $start_current_month)
            ->where('created_at <=', $end_current_month)
            ->where('status', 'confirmed');
            $this->applyFacilityEoFilter($builder, $facilityIds);
        $bookingStats['confirmed'] = $builder->countAllResults();

        $builder = $FacilityBooking
            ->where('created_at >=', $start_current_month)
            ->where('created_at <=', $end_current_month)
            ->where('status', 'completed');
        $this->applyFacilityEoFilter($builder, $facilityIds);
        $bookingStats['completed'] = $builder->countAllResults();

        $builder = $FacilityBooking
            ->where('created_at >=', $start_current_month)
            ->where('created_at <=', $end_current_month)
            ->where('status', 'cancelled');
        $bookingStats['cancelled'] = $builder->countAllResults();

        // 2. REVENUE STATISTICS
        $revenueStats = [];

        // Total revenue this month (completed bookings only)
        $builder = $FacilityBooking
            ->select('SUM(total_price) as revenue')
            ->where('booking_date >=', $start_current_month)
            ->where('booking_date <=', $end_current_month)
            ->where('status', 'completed');

        $this->applyFacilityEoFilter($builder, $facilityIds);
        $completedBookings = $builder->first();
        $revenueStats['this_month'] = $completedBookings ? (float) $completedBookings->revenue : 0;

        // Potential revenue (pending + confirmed)
        $builder = $FacilityBooking
            ->select('SUM(total_price) as revenue')
            ->where('booking_date >=', $start_current_month)
            ->where('booking_date <=', $end_current_month)
            ->whereIn('status', ['Pending', 'confirmed']);
        $this->applyFacilityEoFilter($builder, $facilityIds);
        $potentialBookings = $builder->first();
        $revenueStats['potential'] = $potentialBookings ? (float) $potentialBookings->revenue : 0;


        // Total revenue to date
        $builder = $FacilityBooking
            ->select('SUM(total_price) as revenue')
            ->where('status', 'completed');
        $this->applyFacilityEoFilter($builder, $facilityIds);
        $allRevenue = $builder->first();

        $revenueStats['total_all_time'] = $allRevenue ? (float) $allRevenue->revenue : 0;

        // 3. FACILITY STATISTICS
        $facilityStats = [];
        $facilityStats['total_facilities'] = !empty($current_user['fo_ids']) && count($current_user['fo_ids']) > 0
            ? $Facility->whereIn('facility_organizer_id', $current_user['fo_ids'])->countAllResults()
            : $Facility->countAllResults();

        $facilityStats['available_facilities'] = !empty($current_user['fo_ids']) && count($current_user['fo_ids']) > 0
            ? $Facility->whereIn('facility_organizer_id', $current_user['fo_ids'])
                ->where('is_available', 1)
                ->countAllResults()
            : $Facility->where('is_available', 1)->countAllResults();

        $facilityStats['unavailable_facilities'] = !empty($current_user['fo_ids']) && count($current_user['fo_ids']) > 0
            ? $Facility->whereIn('facility_organizer_id', $current_user['fo_ids'])
                ->where('is_available', 0)
                ->countAllResults()
            : $Facility->where('is_available', 0)->countAllResults();

        // 4. TODAY'S BOOKINGS
        $builder = $FacilityBooking
            ->select('facility_bookings.*, facilities.name as facility_name, users.name as user_name')
            ->join('facilities', 'facilities.id = facility_bookings.facility_id', 'left')
            ->join('users', 'users.id = facility_bookings.user_id', 'left')
            ->where('facility_bookings.booking_date', $today)
            ->whereNotIn('facility_bookings.status', ['cancelled'])
            ->orderBy('facility_bookings.start_time', 'ASC');

        $this->applyFacilityEoFilter($builder, $facilityIds);

        $todayBookings = $builder
            ->orderBy('facility_bookings.start_time', 'ASC')
            ->findAll();

        // 5. UPCOMING BOOKINGS (next 7 days)
        $builder = $FacilityBooking
            ->select('facility_bookings.*, facilities.name as facility_name, users.name as user_name')
            ->join('facilities', 'facilities.id = facility_bookings.facility_id', 'left')
            ->join('users', 'users.id = facility_bookings.user_id', 'left')
            ->where('facility_bookings.booking_date >=', $today)
            ->where('facility_bookings.booking_date <=', date('Y-m-d', strtotime('+7 days')))
            ->whereIn('lower(facility_bookings.status)', ['pending', 'confirmed'])
            ->orderBy('facility_bookings.booking_date', 'ASC')
            ->orderBy('facility_bookings.start_time', 'ASC')
            ->limit(10);
        $this->applyFacilityEoFilter($builder, $facilityIds);
        $upcomingBookings = $builder->findAll();

        // 6. TOP FACILITIES (by booking count this month)
        $db = Database::connect();
        $topFacilitiesQuery = $db->table('facility_bookings')
            ->select('
        facilities.id,
        facilities.name,
        facilities.category,
        COUNT(*) AS booking_count,
        COALESCE(SUM(facility_bookings.total_price), 0) AS total_revenue
    ')
            ->join(
                'facilities',
                "facilities.id = facility_bookings.facility_id"
            )
            ->where('facility_bookings.booking_date >=', $start_current_month)
            ->where('facility_bookings.booking_date <=', $end_current_month);
        if (!empty($facilityIds)) {
            $topFacilitiesQuery->whereIn('facilities.id', $facilityIds);
        }
        $topFacilities = $topFacilitiesQuery->groupBy('facilities.id')
            ->orderBy('booking_count', 'DESC')
            ->limit(5)
            ->get()
            ->getResultArray();

        // 7. MONTHLY TREND (last 6 months)
        $monthlyTrend = [];
        for ($i = 5; $i >= 0; $i--) {
            $month_start = date('Y-m-01', strtotime("-$i month"));
            $month_end = date('Y-m-t', strtotime("-$i month"));
            $month_name = date('M Y', strtotime("-$i month"));

            $builder = $FacilityBooking
                ->where('booking_date >=', $month_start)
                ->where('booking_date <=', $month_end)
                ->where('status', 'completed');
            $this->applyFacilityEoFilter($builder, $facilityIds);
            $count = $builder->countAllResults();

            $builder = $FacilityBooking
                ->select('SUM(total_price) as revenue')
                ->where('booking_date >=', $month_start)
                ->where('booking_date <=', $month_end)
                ->where('status', 'completed');
            $this->applyFacilityEoFilter($builder, $facilityIds);
            $revenue = $builder->first();

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
