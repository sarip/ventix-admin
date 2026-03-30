<?php
/**
 * @author Sarip Hidayat <hidayatsarip2210@gmail.com>
 * @copyright Sarip Hidayat 2024
 * @date 2026-01-13
 */


namespace App\Controllers\Api;

use App\Filters\SearchFilter;
use App\Models\Facilitie;
use App\Models\FacilityBooking;
use App\Models\FacilitybookingStatu;
use App\Models\User;
use App\Libraries\CommissionEngine;

class FacilityBookingController extends ApiController
{

    /**
     * List FacilityBooking Controller
     * @author Sarip Hidayat <hidayatsarip2210@gmail.com>
     * @return mixed|void
     *
     * @api {get} /api/v1/facility_bookings List FacilityBooking
     * @apiName List-FacilityBooking
     * @apiGroup FacilityBooking
     * @apiVersion 1.0.0
     * @apiHeader {String} key Token
     * @apiSuccess {Object[]} data List of FacilityBooking
     * @apiQuery {String} search Search
     * @apiQuery {String} filter Filter by column with value
     * @apiQuery {String} sort_by Sort by column
     * @apiQuery {String} fields Select column
     * @apiQuery {String} per_page Per page
     * @apiQuery {String} page Page
     *
     */
    public function index()
    {
        $Model = new FacilityBooking();

        // Define searchable column on this model
        $searchable_column = [
            'search' => ['facility_code', 'booking_date', 'start_time', 'end_time', 'total_hours', 'total_price', 'status'],
        ];

        $current_user = $this->request->current_user;
        $model_where = [];



        if (!empty($current_user['eo_id'])) {

            $Facilitie = new Facilitie();
            $facilities = $Facilitie->select('id')->where('events_organizer_id', $current_user['eo_id'])->findAll();

            $model_where['group_or'] = [
                'facility_id' => $facilities ? array_column($facilities, 'id') : [-1]
            ];
        }

        //        echo json_encode($model_where); die();

        // Execute search filter
        $output = SearchFilter::execute($Model, $searchable_column, 'facility_bookings', $model_where);
        array_walk($output['facility_bookings'], function (&$item) {
            $User = new User();
            $item->user = $User->find($item->user_id);

            $Facility = new Facilitie();
            $item->facility = $Facility->find($item->facility_id);

            $item->status_badge = status_badge(
                $item->status,
                FacilitybookingStatu::class
            );

        });

        // Return output
        return $this->successOutput($output);
    }

    /**
     * Create FacilityBooking
     *
     * @author Sarip Hidayat <hidayatsarip2210@gmail.com>
     * @return mixed
     * @throws \ReflectionException
     *
     * @api {post} /api/v1/facilitybooking Create FacilityBooking
     * @apiName Create-FacilityBooking
     * @apiGroup FacilityBooking
     * @apiVersion 1.0.0
     * @apiHeader {String} key Token
     * @apiBody {String} user_id user_id
     * @apiBody {String} facility_id facility_id
     * @apiBody {String} facility_code facility_code
     * @apiBody {String} booking_date booking_date
     * @apiBody {String} start_time start_time
     * @apiBody {String} end_time end_time
     * @apiBody {String} total_hours total_hours
     * @apiBody {String} total_price total_price
     * @apiBody {String} status status

     *
     */
    public function create()
    {
        $FacilityBooking = new FacilityBooking();
        $create_data = [
            'user_id' => $this->request->getJsonVar('user_id'),
            'facility_id' => $this->request->getJsonVar('facility_id'),
            'facility_code' => generate_order_facility_code(),
            'booking_date' => $this->request->getJsonVar('booking_date'),
            'start_time' => $this->request->getJsonVar('start_time'),
            'end_time' => $this->request->getJsonVar('end_time'),
            'total_hours' => $this->request->getJsonVar('total_hours'),
            'total_price' => $this->request->getJsonVar('total_price'),
            'status' => "Pending"
        ];

        $id = $FacilityBooking->insert($create_data);

        // Integrate Commission Engine
        $commissionEngine = new CommissionEngine();
        $commissions = $commissionEngine->processOrder($id, 'facility', $create_data['total_price']);

        // Adjust total_price if there's a guest fee
//        if (isset($commissions['guest_fee'])) {
//            $totalPriceWithFee = (float) $create_data['total_price'] + $commissions['guest_fee'];
//            $FacilityBooking->update($id, [
//                'total_price' => $totalPriceWithFee
//            ]);
//        }

        return $this->successOutput(['id' => $id, 'commissions' => $commissions], 201);
    }


    /**
     * Update FacilityBooking
     * @param $id
     * @return mixed
     * @throws \ReflectionException
     *
     * @api {put} /api/v1/facilitybooking/:id Update FacilityBooking
     * @apiName Update-FacilityBooking
     * @apiGroup FacilityBooking
     * @apiVersion 1.0.0
     * @apiHeader {String} key Token
     * @apiParam {Number} id FacilityBooking id
     * @apiBody {String} user_id user_id
     * @apiBody {String} facility_id facility_id
     * @apiBody {String} facility_code facility_code
     * @apiBody {String} booking_date booking_date
     * @apiBody {String} start_time start_time
     * @apiBody {String} end_time end_time
     * @apiBody {String} total_hours total_hours
     * @apiBody {String} total_price total_price
     * @apiBody {String} status status

     *
     */
    public function update($id)
    {
        $FacilityBooking = new FacilityBooking();
        $update_data = [
            'user_id' => $this->request->getJsonVar('user_id'),
            'facility_id' => $this->request->getJsonVar('facility_id'),
            'facility_code' => $this->request->getJsonVar('facility_code'),
            'booking_date' => $this->request->getJsonVar('booking_date'),
            'start_time' => $this->request->getJsonVar('start_time'),
            'end_time' => $this->request->getJsonVar('end_time'),
            'total_hours' => $this->request->getJsonVar('total_hours'),
            'total_price' => $this->request->getJsonVar('total_price'),
            'status' => $this->request->getJsonVar('status')
        ];

        $FacilityBooking->update($id, $update_data);

        // Integrate Commission Engine
        $commissionEngine = new CommissionEngine();
        // Clear old commissions first
        $orderCommissionModel = new \App\Models\OrderCommission();
        $orderCommissionModel->where('order_id', $id)->where('module', 'facility')->delete();

        $commissions = $commissionEngine->processOrder($id, 'facility', $update_data['total_price']);

        // Adjust total_price if there's a guest fee
        if (isset($commissions['guest_fee'])) {
            $totalPriceWithFee = (float) $update_data['total_price'] + $commissions['guest_fee'];
            $FacilityBooking->update($id, [
                'total_price' => $totalPriceWithFee
            ]);
        }

        $data = $FacilityBooking->find($id);

        return $this->successOutput(['facilitybooking' => $data, 'commissions' => $commissions]);
    }


    /**
     * Delete FacilityBooking
     *
     * @param $id
     * @return mixed
     *
     * @api {delete} /api/v1/facilitybooking/:id Delete FacilityBooking
     * @apiName Delete-FacilityBooking
     * @apiGroup FacilityBooking
     * @apiVersion 1.0.0
     * @apiHeader {String} key Token
     * @apiParam {Number} id FacilityBooking id
     */
    public function delete($id)
    {
        $FacilityBooking = new FacilityBooking();
        $FacilityBooking->delete($id);

        return $this->successOutput([], 200);
    }

    /**
     * Check Availability
     * Check if facility is available for the requested time slot
     *
     * @return mixed
     *
     * @api {post} /api/v1/facility_booking/check_availability Check Availability
     * @apiName Check-Availability
     * @apiGroup FacilityBooking
     * @apiVersion 1.0.0
     * @apiHeader {String} key Token
     * @apiBody {Number} facility_id Facility ID
     * @apiBody {String} booking_date Booking date
     * @apiBody {String} start_time Start time
     * @apiBody {String} end_time End time
     * @apiBody {Number} [id] Booking ID (for update, exclude self)
     */
    public function checkAvailability()
    {
        $FacilityBooking = new FacilityBooking();

        $facility_id = $this->request->getJsonVar('facility_id');
        $booking_date = $this->request->getJsonVar('booking_date');
        $start_time = $this->request->getJsonVar('start_time');
        $end_time = $this->request->getJsonVar('end_time');
        $exclude_id = $this->request->getJsonVar('id');

        // Build query to check for overlapping bookings
        $builder = $FacilityBooking->where('facility_id', $facility_id)
            ->where('booking_date', $booking_date)
            ->whereNotIn('status', ['cancelled']) // Exclude cancelled bookings (status_id = 4)
            ->groupStart()
            ->groupStart()
            ->where('start_time <=', $start_time)
            ->where('end_time >', $start_time)
            ->groupEnd()
            ->orGroupStart()
            ->where('start_time <', $end_time)
            ->where('end_time >=', $end_time)
            ->groupEnd()
            ->orGroupStart()
            ->where('start_time >=', $start_time)
            ->where('end_time <=', $end_time)
            ->groupEnd()
            ->groupEnd();

        // Exclude current booking when updating
        if ($exclude_id) {
            $builder->where('id !=', $exclude_id);
        }

        $has_conflict = $builder->countAllResults() > 0;

        if ($has_conflict) {
            return $this->successOutput([
                'available' => false,
                'message' => 'Time slot is already booked'
            ]);
        }

        return $this->successOutput(['available' => true]);
    }

    /**
     * Calculate Price
     * Calculate booking price based on facility pricing rules
     *
     * @return mixed
     *
     * @api {post} /api/v1/facility_booking/calculate_price Calculate Price
     * @apiName Calculate-Price
     * @apiGroup FacilityBooking
     * @apiVersion 1.0.0
     * @apiHeader {String} key Token
     * @apiBody {Number} facility_id Facility ID
     * @apiBody {String} booking_date Booking date
     * @apiBody {String} start_time Start time
     * @apiBody {String} end_time End time
     */
    public function calculatePrice()
    {
        $facility_id = $this->request->getJsonVar('facility_id');
        $booking_date = $this->request->getJsonVar('booking_date');
        $start_time = $this->request->getJsonVar('start_time');
        $end_time = $this->request->getJsonVar('end_time');

        // Calculate hours
        $start = strtotime($start_time);
        $end = strtotime($end_time);
        $total_hours = ($end - $start) / 3600;

        // Determine day type
        $dayOfWeek = date('N', strtotime($booking_date)); // 1=Monday, 7=Sunday
        $day_type = ($dayOfWeek >= 6) ? 'Weekend' : 'Weekday';

        // Get pricing from facility_pricing table
        $FacilityPricing = new \App\Models\FacilityPricing();
        $pricing = $FacilityPricing->where('facility_id', $facility_id)
            ->where('day_type', $day_type)
            ->where('start_time <=', $start_time)
            ->where('end_time >=', $end_time)
            ->first();

        if (!$pricing) {
            return $this->errorOutput('No pricing rule found for this time slot', 400);
        }

        $price_per_hour = $pricing->price_per_hour;
        $total_price = $total_hours * $price_per_hour;

        return $this->successOutput([
            'total_hours' => $total_hours,
            'total_price' => $total_price,
            'breakdown' => [
                [
                    'day_type' => $day_type,
                    'hours' => $total_hours,
                    'price_per_hour' => $price_per_hour,
                    'subtotal' => $total_price
                ]
            ]
        ]);
    }

    /**
     * Update Status
     * Update booking status
     *
     * @param $id
     * @return mixed
     *
     * @api {put} /api/v1/facility_booking/:id/status Update Booking Status
     * @apiName Update-Booking-Status
     * @apiGroup FacilityBooking
     * @apiVersion 1.0.0
     * @apiHeader {String} key Token
     * @apiParam {Number} id Booking ID
     * @apiBody {String} status Status name (Pending/confirmed/completed/cancelled)
     */
    public function updateStatus($id)
    {
        $FacilityBooking = new FacilityBooking();
        $status = $this->request->getJsonVar('status');

        // Validate booking exists
        $booking = $FacilityBooking->find($id);
        if (!$booking) {
            return $this->errorOutput('Booking not found', 404);
        }

        // Validate status exists in facilitybooking_status table
        $StatusModel = new FacilitybookingStatu();
        $statusData = $StatusModel->where('name', $status)->first();

        if (!$statusData) {
            return $this->errorOutput('Invalid status', 400);
        }

        // Update status
        $update_data = ['status' => $status];
        $FacilityBooking->update($id, $update_data);

        // Get updated booking with relations
        $updated = $FacilityBooking->find($id);

        $User = new User();
        $updated->user = $User->find($updated->user_id);

        $Facility = new Facilitie();
        $updated->facility = $Facility->find($updated->facility_id);

        $updated->status_badge = status_badge(
            $updated->status,
            FacilitybookingStatu::class
        );

        return $this->successOutput(['booking' => $updated]);
    }
}
