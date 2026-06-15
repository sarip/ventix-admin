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
use App\Models\FacilityPricing;
use App\Libraries\CommissionEngine;
use App\Libraries\CommissionCal;
use App\Libraries\EmailNotificationService;

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



        if($current_user['scope'] !== 'SUPERADMIN') {

            $Facilitie = new Facilitie();
            $facilities = $Facilitie->select('id')->whereIn('facility_organizer_id', $current_user['fo_ids'] ?? [-1])->findAll();

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
        $Facilitie = new Facilitie();
        $User = new User();
        $booking_date = $this->request->getJsonVar('booking_date');
        $start_time = $this->request->getJsonVar('start_time');
        $end_time = $this->request->getJsonVar('end_time');
        $booking_source = $this->request->getJsonVar('booking_source');

        $user_id = $this->request->getJsonVar('user_id');
        $id = "";
        $name = "";
        $phone = "";
        $email = "";
        if($booking_source === 'MEMBER') {
            $current_user = $User->find($user_id);
            $name = $current_user->name;
            $phone = $current_user->phone;
            $email = $current_user->email;
        } else {
            $name = $this->request->getJsonVar('guest_name');
            $email = $this->request->getJsonVar('guest_email');
            $phone = $this->request->getJsonVar('guest_phone');
        }


        if(empty($name) || empty($email) || empty($phone)) {
            return $this->errorOutput('Guest name, email, and phone are required for guest checkout', 400);
        }



        $create_data = [
            'facility_id' => $this->request->getJsonVar('facility_id'),
            'booking_date' => $booking_date,
            'start_time' => $start_time,
            'end_time' => $end_time,
            'facility_code' => generate_order_facility_code(),
            'user_id'       => $user_id,
            'guest_name' => $name,
            'guest_email' => $email,
            'guest_phone' => $phone,
            'booking_source' => $booking_source,
            'status'        => 'Pending'
        ];

        $facility = $Facilitie->find($create_data['facility_id']);
        if(empty($facility)) {
            return $this->errorOutput("Facility not found");
        }

        // Gabungkan date + time
        $start = strtotime($create_data['booking_date'] . ' ' . $create_data['start_time']);
        $end   = strtotime($create_data['booking_date'] . ' ' . $create_data['end_time']);

        if ($end <= $start) {
            return $this->errorOutput("End time must be greater than start time");
        }

        $dayType = $this->getDayType($create_data['booking_date']);

        $pricingModel = new FacilityPricing();

        $pricings = $pricingModel
            ->where('facility_id', $create_data['facility_id'])
            ->where('day_type', $dayType)
            ->orderBy('start_time', 'ASC')
            ->findAll();


        $bookingStart = strtotime("$booking_date $start_time");
        $bookingEnd   = strtotime("$booking_date $end_time");

        $totalHours = 0;
        $totalPrice = 0;

        foreach ($pricings as $price) {

            $priceStart = strtotime("$booking_date {$price->start_time}");
            $priceEnd   = strtotime("$booking_date {$price->end_time}");

            // Cari irisan waktu
            $start = max($bookingStart, $priceStart);
            $end   = min($bookingEnd, $priceEnd);

            if ($start < $end) {
                $hours = ($end - $start) / 3600;

                $totalHours += $hours;
                $totalPrice += $hours * $price->price_per_hour;
            }
        }

        $create_data['total_price'] = $totalPrice;
        $create_data['total_hours'] = $totalHours;


        $adminFeeAmount = 0;
        $grandTotal = $totalPrice;

        if ($booking_source !== 'MEMBER') {

            $adminFeeAmount = CommissionCal::total(
                $totalPrice,
                'event',
                'guest_admin_fee'
            );

            $grandTotal = $totalPrice + $adminFeeAmount;
        }

        
        $create_data['subtotal_amount'] = $totalPrice;
        $create_data['admin_fee_amount'] = $adminFeeAmount;
        $create_data['total_price'] = $grandTotal;

        $FacilityBooking = new FacilityBooking();
        $id = $FacilityBooking->insert($create_data);

        $commissionEngine = new CommissionEngine();
        $commissions = $commissionEngine->processOrder($id, 'facility', $totalPrice);


        // Send Facility Booking Created email
        $User = new User();
        if($booking_source === 'MEMBER') {
            $buyer = $User->find($user_id);
        } else {
            $facilityBooking = $FacilityBooking->find($id);
            $buyer = (object)[
                'id' => null,
                'name' => $facilityBooking->guest_name,
                'email' => $facilityBooking->guest_email,
                'phone' => $facilityBooking->guest_phone,
            ];
        }
        if ($buyer) {
            $freshBooking = $FacilityBooking->find($id);
            $Facilitie = new Facilitie();
            $facility = $Facilitie->find($create_data['facility_id']);
            if ($facility) {
                (new EmailNotificationService())->sendFacilityBookingCreated($freshBooking, $buyer, $facility);
            }
        }

        $data = $FacilityBooking->find($id);

        return $this->successOutput(['id' => $id, 'data' => $data], 201);
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
        $Facilitie = new Facilitie();
        $booking_date = $this->request->getJsonVar('booking_date');
        $start_time = $this->request->getJsonVar('start_time');
        $end_time = $this->request->getJsonVar('end_time');
        $booking_source = $this->request->getJsonVar('booking_source');

        $user_id = $this->request->getJsonVar('user_id');
        $name = "";
        $phone = "";
        $email = "";
        
        // Check if booking exists
        $FacilityBooking = new FacilityBooking();
        $existingBooking = $FacilityBooking->find($id);
        if (empty($existingBooking)) {
            return $this->errorOutput("Booking not found", 404);
        }

        $User = new User();
        if($booking_source === 'MEMBER') {
            $current_user = $User->find($user_id);
            $name = $current_user->name;
            $phone = $current_user->phone;
            $email = $current_user->email;
        } else {
            $name = $this->request->getJsonVar('guest_name');
            $email = $this->request->getJsonVar('guest_email');
            $phone = $this->request->getJsonVar('guest_phone');
        }

        if(empty($name) || empty($email) || empty($phone)) {
            return $this->errorOutput('Guest name, email, and phone are required', 400);
        }

        $update_data = [
            'facility_id' => $this->request->getJsonVar('facility_id'),
            'booking_date' => $booking_date,
            'start_time' => $start_time,
            'end_time' => $end_time,
            'user_id'       => $user_id,
            'guest_name' => $name,
            'guest_email' => $email,
            'guest_phone' => $phone,
            'booking_source' => $booking_source,
        ];

        // Keep facility_code from existing booking
        if (!empty($existingBooking->facility_code)) {
            $update_data['facility_code'] = $existingBooking->facility_code;
        }

        $facility = $Facilitie->find($update_data['facility_id']);
        if(empty($facility)) {
            return $this->errorOutput("Facility not found", 404);
        }

        // Gabungkan date + time
        $start = strtotime($update_data['booking_date'] . ' ' . $update_data['start_time']);
        $end   = strtotime($update_data['booking_date'] . ' ' . $update_data['end_time']);

        if ($end <= $start) {
            return $this->errorOutput("End time must be greater than start time", 400);
        }

        $dayType = $this->getDayType($update_data['booking_date']);

        $pricingModel = new FacilityPricing();

        $pricings = $pricingModel
            ->where('facility_id', $update_data['facility_id'])
            ->where('day_type', $dayType)
            ->orderBy('start_time', 'ASC')
            ->findAll();


        $bookingStart = strtotime("$booking_date $start_time");
        $bookingEnd   = strtotime("$booking_date $end_time");

        $totalHours = 0;
        $totalPrice = 0;

        foreach ($pricings as $price) {

            $priceStart = strtotime("$booking_date {$price->start_time}");
            $priceEnd   = strtotime("$booking_date {$price->end_time}");

            // Cari irisan waktu
            $start = max($bookingStart, $priceStart);
            $end   = min($bookingEnd, $priceEnd);

            if ($start < $end) {
                $hours = ($end - $start) / 3600;

                $totalHours += $hours;
                $totalPrice += $hours * $price->price_per_hour;
            }
        }

        $update_data['total_price'] = $totalPrice;
        $update_data['total_hours'] = $totalHours;


        $adminFeeAmount = 0;
        $grandTotal = $totalPrice;

        if ($booking_source !== 'MEMBER') {

            $adminFeeAmount = CommissionCal::total(
                $totalPrice,
                'event',
                'guest_admin_fee'
            );

            $grandTotal = $totalPrice + $adminFeeAmount;
        }

        
        $update_data['subtotal_amount'] = $totalPrice;
        $update_data['admin_fee_amount'] = $adminFeeAmount;
        $update_data['total_price'] = $grandTotal;

        $FacilityBooking->update($id, $update_data);

        // Integrate Commission Engine
        $commissionEngine = new CommissionEngine();
        // Clear old commissions first
        $orderCommissionModel = new \App\Models\OrderCommission();
        $orderCommissionModel->where('order_id', $id)->where('module', 'facility')->delete();

        $commissions = $commissionEngine->processOrder($id, 'facility', $totalPrice);

        $data = $FacilityBooking->find($id);

        return $this->successOutput(['booking' => $data, 'commissions' => $commissions]);
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
        // $updated->user = $User->find($updated->user_id);

        $Facility = new Facilitie();
        $updated->facility = $Facility->find($updated->facility_id);

        $updated->status_badge = status_badge(
            $updated->status,
            FacilitybookingStatu::class
        );


        $User = new User();
        $facilityBooking = $FacilityBooking->find($id);
        $facility = $Facility->find($booking->facility_id);
        if($booking->booking_source === 'MEMBER') {
            $buyer = $User->find($booking->user_id);
        } else {
            $buyer = (object)[
                'id' => null,
                'name' => $facilityBooking->guest_name,
                'email' => $facilityBooking->guest_email,
                'phone' => $facilityBooking->guest_phone,
            ];
        }
        if ($buyer) {
            $emailSvc = new EmailNotificationService();
            $freshBooking = $FacilityBooking->find($id);
           if (strtolower($status) === 'pending') {
                $emailSvc->sendFacilityPaymentSubmitted($freshBooking, $buyer, $facility);
            } elseif (strtolower($status) === 'confirmed') {
                $emailSvc->sendFacilityPaymentAccepted($freshBooking, $buyer, $facility);
            }
        }

        return $this->successOutput(['booking' => $updated]);
    }

    /**
     * Get Day Type
     * Determine if date is weekday or weekend
     *
     * @param string $date
     * @return string
     */
    private function getDayType(string $date): string
    {
        $day = date('N', strtotime($date)); // 1=Mon, 7=Sun

        if ($day >= 6) {
            return 'Weekend';
        }

        // kalau ada tabel hari libur → cek di sini
        return 'Weekday';
    }
}
