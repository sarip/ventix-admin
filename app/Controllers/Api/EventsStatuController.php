<?php
/**
 * @author Sarip Hidayat <hidayatsarip2210@gmail.com>
 * @copyright Sarip Hidayat 2024
 * @date 2026-01-12
 */


namespace App\Controllers\Api;

use App\Filters\SearchFilter;
use App\Models\EventsStatu;

class EventsStatuController extends ApiController
{

    /**
     * List EventsStatu Controller
     * @author Sarip Hidayat <hidayatsarip2210@gmail.com>
     * @return mixed|void
     *
     * @api {get} /api/v1/events_status List EventsStatu
     * @apiName List-EventsStatu
     * @apiGroup EventsStatu
     * @apiVersion 1.0.0
     * @apiHeader {String} key Token
     * @apiSuccess {Object[]} data List of EventsStatu
     * @apiQuery {String} search Search
     * @apiQuery {String} filter Filter by column with value
     * @apiQuery {String} sort_by Sort by column
     * @apiQuery {String} fields Select column
     * @apiQuery {String} per_page Per page
     * @apiQuery {String} page Page
     *
     */
    public function index() {
        $Model = new EventsStatu();

        // Define searchable column on this model
        $searchable_column = [
            'search' => ['name'],
        ];

        // Execute search filter
        $output = SearchFilter::execute($Model, $searchable_column, 'events_status', []);

        // Return output
        return $this->successOutput($output);
    }

    /**
     * Create EventsStatu
     *
     * @author Sarip Hidayat <hidayatsarip2210@gmail.com>
     * @return mixed
     * @throws \ReflectionException
     *
     * @api {post} /api/v1/eventsstatu Create EventsStatu
     * @apiName Create-EventsStatu
     * @apiGroup EventsStatu
     * @apiVersion 1.0.0
     * @apiHeader {String} key Token
     * @apiBody {String} name name
     * @apiBody {String} description description

     *
     */
    public function create() {
        $EventsStatu = new EventsStatu();
        $create_data = [
            'name' => $this->request->getJsonVar('name'),
            'description' => $this->request->getJsonVar('description')
        ];

        $name = $EventsStatu->insert($create_data);

        return $this->successOutput(['name' => $name], 201);
    }


    /**
     * Update EventsStatu
     * @param $name
     * @return mixed
     * @throws \ReflectionException
     *
     * @api {put} /api/v1/eventsstatu/:name Update EventsStatu
     * @apiName Update-EventsStatu
     * @apiGroup EventsStatu
     * @apiVersion 1.0.0
     * @apiHeader {String} key Token
     * @apiParam {Number} name EventsStatu name
     * @apiBody {String} name name
     * @apiBody {String} description description

     *
     */
    public function update($name) {
        $EventsStatu = new EventsStatu();
        $update_data = [
            'name' => $this->request->getJsonVar('name'),
            'description' => $this->request->getJsonVar('description')
        ];


        $EventsStatu
            ->set($update_data)
            ->where('name', $name)
            ->update();


        return $this->successOutput(['eventsstatu' => $update_data]);
    }


    /**
     * Delete EventsStatu
     *
     * @param $name
     * @return mixed
     *
     * @api {delete} /api/v1/eventsstatu/:name Delete EventsStatu
     * @apiName Delete-EventsStatu
     * @apiGroup EventsStatu
     * @apiVersion 1.0.0
     * @apiHeader {String} key Token
     * @apiParam {Number} name EventsStatu name
     */
    public function delete($name) {
        $EventsStatu = new EventsStatu();
        $EventsStatu->where('name', $name)->delete();

        return $this->successOutput([], 200);
    }
}
