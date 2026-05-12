<?php
/**
 * @author Sarip Hidayat <hidayatsarip2210@gmail.com>
 * @copyright Sarip Hidayat 2024
 * @date 2026-01-13
 */


namespace App\Controllers\Frontend;

use App\Controllers\Api\ApiController;
use App\Filters\SearchFilter;
use App\Libraries\CommissionCal;
use App\Libraries\CommissionEngine;
use App\Libraries\EmailNotificationService;
use App\Models\EventsOrganizer;
use App\Models\Facilitie;
use App\Models\FacilityBooking;
use App\Models\FacilitybookingStatu;
use App\Models\FacilityPricing;
use App\Models\User;
use Config\Services;

class FacilitieController extends ApiController
{

    /**
     * List Facilitie Controller
     * @author Sarip Hidayat <hidayatsarip2210@gmail.com>
     * @return mixed|void
     *
     * @api {get} /api/v1/facilities List Facilitie
     * @apiName List-Facilitie
     * @apiGroup Facilitie
     * @apiVersion 1.0.0
     * @apiHeader {String} key Token
     * @apiSuccess {Object[]} data List of Facilitie
     * @apiQuery {String} search Search
     * @apiQuery {String} filter Filter by column with value
     * @apiQuery {String} sort_by Sort by column
     * @apiQuery {String} fields Select column
     * @apiQuery {String} per_page Per page
     * @apiQuery {String} page Page
     *
     */
    public function index() {
        $Model = new Facilitie();

        // Define searchable column on this model
        $searchable_column = [
            'search' => ['name', 'category', 'description', 'is_available'],
        ];

        // Execute search filter
        $output = SearchFilter::execute($Model, $searchable_column, 'data', []);
        array_walk($output['data'], function(&$item) {

            $EventOrganizer = new EventsOrganizer();
            $item->event_organizer = $EventOrganizer->find($item->events_organizer_id);

            $User = new User();
            $item->user_pic = $User->find($item->user_id_pic);

            $FacilityPricing = new FacilityPricing();
            $item->facility_pricing = $FacilityPricing->where('facility_id', $item->id)->findAll();

        });

        // Return output
        return $this->successOutput($output);
    }

    public function bookingStatus()
    {

        $Model = new FacilitybookingStatu();
        $data = $Model->findAll();
        return $this->successOutput(['data' => $data]);

    }


    public function find($id) {
        $Model = new Facilitie();

        // Define searchable column on this model
        $searchable_column = [
            'search' => ['name', 'category', 'description', 'is_available'],
        ];

        // Execute search filter
        SearchFilter::executeOnly($Model, $searchable_column, ['id' => $id]);

        // Execute search filter
        $facilities = $Model->first();
        if(empty($facilities)) {
            return $this->errorOutput("Facility not found");
        }

        $EventOrganizer = new EventsOrganizer();
        $facilities->event_organizer = $EventOrganizer->find($facilities->events_organizer_id);

        $User = new User();
        $facilities->user_pic = $User->find($facilities->user_id_pic);

        $FacilityPricing = new FacilityPricing();
        $facilities->facility_pricing = $FacilityPricing->where('facility_id', $facilities->id)->findAll();

        // Return output
        return $this->successOutput(['data' => $facilities]);
    }

    /**
     * Create Facilitie
     *
     * @author Sarip Hidayat <hidayatsarip2210@gmail.com>
     * @return mixed
     * @throws \ReflectionException
     *
     * @api {post} /api/v1/facilitie Create Facilitie
     * @apiName Create-Facilitie
     * @apiGroup Facilitie
     * @apiVersion 1.0.0
     * @apiHeader {String} key Token
     * @apiBody {String} events_organizer_id events_organizer_id
     * @apiBody {String} user_id_pic user_id_pic
     * @apiBody {String} name name
     * @apiBody {String} category category
     * @apiBody {String} description description
     * @apiBody {String} is_available is_available

     *
     */

    public function myBooking() {
        $Model = new FacilityBooking();
        $current_user = Services::request()->current_user ?? null;

        // Define searchable column on this model
        $searchable_column = [
            'search' => ['facility_code', 'booking_date', 'start_time', 'end_time', 'total_hours', 'total_price', 'status'],
        ];

        // Execute search filter
        $where = $current_user ?  ['user_id' => $current_user['id']] : [];
        $output = SearchFilter::execute($Model, $searchable_column, 'data', $where);
        array_walk($output['data'], function(&$item) {

            $Facility = new Facilitie();
            $item->facility = $Facility->find($item->facility_id);

            $EventOrganizer = new EventsOrganizer();
            $item->facility->event_organizer = $EventOrganizer->find($item->facility->events_organizer_id);

            $User = new User();
            $item->facility->user_pic = $User->find($item->facility->user_id_pic);

            $FacilityPricing = new FacilityPricing();
            $item->facility->facility_pricing = $FacilityPricing->where('facility_id', $item->facility->id)->findAll();

        });

        // Return output
        return $this->successOutput($output);
    }

    public function findMyBook($id)
    {
        $Model = new FacilityBooking();
        $item = $Model->find($id);

        if(empty($item)) {
            $item  = $Model->where('facility_code', $id)->first();
            if(empty($item)) {
                return $this->errorOutput("Booking not found");
            }
        }

        $Facility = new Facilitie();
        $item->facility = $Facility->find($item->facility_id);

        $item->status_badge = status_badge(
            $item->status,
            FacilitybookingStatu::class
        );

        $EventOrganizer = new EventsOrganizer();
        $item->facility->event_organizer = $EventOrganizer->find($item->facility->events_organizer_id);

        $User = new User();
        $item->facility->user_pic = $User->find($item->facility->user_id_pic);

        $FacilityPricing = new FacilityPricing();
        $item->facility->facility_pricing = $FacilityPricing->where('facility_id', $item->facility->id)->findAll();

        return $this->successOutput(['data' => $item]);

    }
    public function booking() {
        $Facilitie = new Facilitie();
        $booking_date = $this->request->getVar('date');
        $start_time = $this->request->getVar('start_time');
        $end_time = $this->request->getVar('end_time');

        $current_user = $this->request->current_user;
        $id = "";
        $name = "";
        $phone = "";
        $email = "";
        $bookingSource = 'MEMBER';
        if($current_user) {
            $id = $current_user['id'];
            $name = $current_user['name'];
            $phone = $current_user['phone'];
            $email = $current_user['email'];
        } else {
            $name = $this->request->getJsonVar('guest_name');
            $email = $this->request->getJsonVar('guest_email');
            $phone = $this->request->getJsonVar('guest_phone');
            $bookingSource = 'GUEST';
        }


        if(empty($name) || empty($email) || empty($phone)) {
            return $this->errorOutput('Guest name, email, and phone are required for guest checkout', 400);
        }

        $isMember = !empty($current_user);



        $create_data = [
            'facility_id' => $this->request->getJsonVar('facility_id'),
            'booking_date' => $booking_date,
            'start_time' => $start_time,
            'end_time' => $end_time,
            'facility_code' => generate_order_facility_code(),
            'user_id'       => $id,
            'guest_name' => $name,
            'guest_email' => $email,
            'guest_phone' => $phone,
            'booking_source' => $bookingSource,
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

        if (!$isMember) {

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
        if($current_user) {
            $buyer = $User->find($current_user['id']);
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


    public function uploadPayment($booking_id)
    {

        $FacilityBooking = new FacilityBooking();
        $facility_booking = $FacilityBooking->find($booking_id);
        if(empty($facility_booking)) {
            return $this->errorOutput("Booking not found");
        }

        // Upload foto
        $file = $this->request->getFile('payment_proof');
        if ($file && $file->isValid() && !$file->hasMoved()) {
            $thumbnail_url = $file->getRandomName();
            $file->move(FCPATH . 'uploads/payment_proof', $thumbnail_url);
            $FacilityBooking->update($booking_id, ['payment_proof' => $thumbnail_url]);
        }


        return $this->successOutput([]);




    }
    function getDayType(string $date): string
    {
        $day = date('N', strtotime($date)); // 1=Mon, 7=Sun

        if ($day >= 6) {
            return 'Weekend';
        }

        // kalau ada tabel hari libur → cek di sini
        return 'Weekday';
    }



    /**
     * Update Facilitie
     * @param $id
     * @return mixed
     * @throws \ReflectionException
     *
     * @api {put} /api/v1/facilitie/:id Update Facilitie
     * @apiName Update-Facilitie
     * @apiGroup Facilitie
     * @apiVersion 1.0.0
     * @apiHeader {String} key Token
     * @apiParam {Number} id Facilitie id
     * @apiBody {String} events_organizer_id events_organizer_id
     * @apiBody {String} user_id_pic user_id_pic
     * @apiBody {String} name name
     * @apiBody {String} category category
     * @apiBody {String} description description
     * @apiBody {String} is_available is_available

     *
     */
    public function update($id) {
        $Facilitie = new Facilitie();
        $update_data = [
            'events_organizer_id' => $this->request->getJsonVar('events_organizer_id'),
            'user_id_pic' => $this->request->getJsonVar('user_id_pic'),
            'name' => $this->request->getJsonVar('name'),
            'category' => $this->request->getJsonVar('category'),
            'description' => $this->request->getJsonVar('description'),
            'is_available' => $this->request->getJsonVar('is_available')
        ];

        $Facilitie->update($id, $update_data);

        $data = $Facilitie->find($id);

        return $this->successOutput(['facilitie' => $data]);
    }


    /**
     * Delete Facilitie
     *
     * @param $id
     * @return mixed
     *
     * @api {delete} /api/v1/facilitie/:id Delete Facilitie
     * @apiName Delete-Facilitie
     * @apiGroup Facilitie
     * @apiVersion 1.0.0
     * @apiHeader {String} key Token
     * @apiParam {Number} id Facilitie id
     */
    public function delete($id) {
        $Facilitie = new Facilitie();
        $Facilitie->delete($id);

        return $this->successOutput([], 200);
    }
}
