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
    public function index() {
        $Model = new FacilityBooking();

        // Define searchable column on this model
        $searchable_column = [
            'search' => ['user_id'],
        ];

        // Execute search filter
        $output = SearchFilter::execute($Model, $searchable_column, 'facility_bookings', []);
        array_walk($output['facility_bookings'], function(&$item) {
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
    public function create() {
        $FacilityBooking = new FacilityBooking();
        $create_data = [
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

        $id = $FacilityBooking->insert($create_data);

        return $this->successOutput(['id' => $id], 201);
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
    public function update($id) {
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

        $data = $FacilityBooking->find($id);

        return $this->successOutput(['facilitybooking' => $data]);
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
    public function delete($id) {
        $FacilityBooking = new FacilityBooking();
        $FacilityBooking->delete($id);

        return $this->successOutput([], 200);
    }
}
