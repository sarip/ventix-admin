<?php
/**
 * @author Sarip Hidayat <hidayatsarip2210@gmail.com>
 * @copyright Sarip Hidayat 2024
 * @date 2026-01-13
 */


namespace App\Controllers\Api;

use App\Filters\SearchFilter;
use App\Models\EventsOrganizer;
use App\Models\Facilitie;
use App\Models\FacilitiesOrganizer;
use App\Models\FacilityPricing;
use App\Models\User;

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

        $current_user = $this->request->current_user;
        $where_eo = [];

        if($current_user['scope'] !== 'SUPERADMIN') {
            $where_eo['group_or'] = ['facility_organizer_id' => $current_user['fo_ids'] ? $current_user['fo_ids'] : [-1]];
        }

        // Execute search filter
        $output = SearchFilter::execute($Model, $searchable_column, 'facilities', $where_eo);
        array_walk($output['facilities'], function(&$item) {

            $FacilitiesOrganizer = new FacilitiesOrganizer();
            $item->facility_organizer = $FacilitiesOrganizer->find($item->facility_organizer_id);

            $User = new User();
            $item->user_pic = $User->find($item->user_id_pic);

            $FacilityPricing = new FacilityPricing();
            $item->facility_pricing = $FacilityPricing->where('facility_id', $item->id)->findAll();

        });

        // Return output
        return $this->successOutput($output);
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
    public function create() {
        $Facilitie = new Facilitie();
        $create_data = [
            'events_organizer_id' => $this->request->getJsonVar('events_organizer_id'),
            'user_id_pic' => $this->request->getJsonVar('user_id_pic'),
            'name' => $this->request->getJsonVar('name'),
            'category' => $this->request->getJsonVar('category'),
            'description' => $this->request->getJsonVar('description'),
            'is_available' => $this->request->getJsonVar('is_available')
        ];

        $id = $Facilitie->insert($create_data);

        return $this->successOutput(['id' => $id], 201);
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
