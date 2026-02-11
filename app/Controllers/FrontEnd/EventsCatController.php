<?php
/**
 * @author Sarip Hidayat <hidayatsarip2210@gmail.com>
 * @copyright Sarip Hidayat 2024
 * @date 2026-01-12
 */


namespace App\Controllers\Frontend;

use App\Controllers\Api\ApiController;
use App\Filters\SearchFilter;
use App\Models\EventsCat;

class EventsCatController extends ApiController
{

    /**
     * List EventsCat Controller
     * @author Sarip Hidayat <hidayatsarip2210@gmail.com>
     * @return mixed|void
     *
     * @api {get} /api/v1/events_cat List EventsCat
     * @apiName List-EventsCat
     * @apiGroup EventsCat
     * @apiVersion 1.0.0
     * @apiHeader {String} key Token
     * @apiSuccess {Object[]} data List of EventsCat
     * @apiQuery {String} search Search
     * @apiQuery {String} filter Filter by column with value
     * @apiQuery {String} sort_by Sort by column
     * @apiQuery {String} fields Select column
     * @apiQuery {String} per_page Per page
     * @apiQuery {String} page Page
     *
     */
    public function index() {
        $Model = new EventsCat();

        // Define searchable column on this model
        $searchable_column = [
            'search' => ['name'],
        ];

        // Execute search filter
        $output = SearchFilter::execute($Model, $searchable_column, 'events_cat', []);

        // Return output
        return $this->successOutput($output);
    }

    /**
     * Create EventsCat
     *
     * @author Sarip Hidayat <hidayatsarip2210@gmail.com>
     * @return mixed
     * @throws \ReflectionException
     *
     * @api {post} /api/v1/eventscat Create EventsCat
     * @apiName Create-EventsCat
     * @apiGroup EventsCat
     * @apiVersion 1.0.0
     * @apiHeader {String} key Token
     * @apiBody {String} name name
     * @apiBody {String} description description

     *
     */
    public function create() {
        $EventsCat = new EventsCat();
        $create_data = [
            'name' => $this->request->getJsonVar('name'),
            'description' => $this->request->getJsonVar('description')
        ];

        $name = $EventsCat->insert($create_data);

        return $this->successOutput(['name' => $name], 201);
    }


    /**
     * Update EventsCat
     * @param $name
     * @return mixed
     * @throws \ReflectionException
     *
     * @api {put} /api/v1/eventscat/:name Update EventsCat
     * @apiName Update-EventsCat
     * @apiGroup EventsCat
     * @apiVersion 1.0.0
     * @apiHeader {String} key Token
     * @apiParam {Number} name EventsCat name
     * @apiBody {String} name name
     * @apiBody {String} description description

     *
     */
    public function update($name)
    {
        $EventsCat = new EventsCat();

        $update_data = [
            'description' => $this->request->getJSON()->description ?? null
        ];

        $EventsCat
            ->set($update_data)
            ->where('name', $name)
            ->update();

        return $this->successOutput([
            'eventscat' => $update_data
        ]);
    }



    /**
     * Delete EventsCat
     *
     * @param $name
     * @return mixed
     *
     * @api {delete} /api/v1/eventscat/:name Delete EventsCat
     * @apiName Delete-EventsCat
     * @apiGroup EventsCat
     * @apiVersion 1.0.0
     * @apiHeader {String} key Token
     * @apiParam {Number} name EventsCat name
     */
    public function delete($name) {
        $EventsCat = new EventsCat();
        $EventsCat->where('name', $name)->delete();

        return $this->successOutput([], 200);
    }
}
