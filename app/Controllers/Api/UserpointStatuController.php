<?php
/**
 * @author Sarip Hidayat <hidayatsarip2210@gmail.com>
 * @copyright Sarip Hidayat 2024
 * @date 2026-01-13
 */


namespace App\Controllers\Api;

use App\Filters\SearchFilter;
use App\Models\UserpointStatu;

class UserpointStatuController extends ApiController
{

    /**
     * List UserpointStatu Controller
     * @author Sarip Hidayat <hidayatsarip2210@gmail.com>
     * @return mixed|void
     *
     * @api {get} /api/v1/userpoint_status List UserpointStatu
     * @apiName List-UserpointStatu
     * @apiGroup UserpointStatu
     * @apiVersion 1.0.0
     * @apiHeader {String} key Token
     * @apiSuccess {Object[]} data List of UserpointStatu
     * @apiQuery {String} search Search
     * @apiQuery {String} filter Filter by column with value
     * @apiQuery {String} sort_by Sort by column
     * @apiQuery {String} fields Select column
     * @apiQuery {String} per_page Per page
     * @apiQuery {String} page Page
     *
     */
    public function index() {
        $Model = new UserpointStatu();

        // Define searchable column on this model
        $searchable_column = [
            'search' => ['name'],
        ];

        // Execute search filter
        $output = SearchFilter::execute($Model, $searchable_column, 'userpoint_status', []);

        // Return output
        return $this->successOutput($output);
    }

    /**
     * Create UserpointStatu
     *
     * @author Sarip Hidayat <hidayatsarip2210@gmail.com>
     * @return mixed
     * @throws \ReflectionException
     *
     * @api {post} /api/v1/userpointstatu Create UserpointStatu
     * @apiName Create-UserpointStatu
     * @apiGroup UserpointStatu
     * @apiVersion 1.0.0
     * @apiHeader {String} key Token
     * @apiBody {String} name name
     * @apiBody {String} description description

     *
     */
    public function create() {
        $UserpointStatu = new UserpointStatu();
        $create_data = [
            'name' => $this->request->getJsonVar('name'),
            'description' => $this->request->getJsonVar('description')
        ];

        $name = $UserpointStatu->insert($create_data);

        return $this->successOutput(['name' => $name], 201);
    }


    /**
     * Update UserpointStatu
     * @param $name
     * @return mixed
     * @throws \ReflectionException
     *
     * @api {put} /api/v1/userpointstatu/:name Update UserpointStatu
     * @apiName Update-UserpointStatu
     * @apiGroup UserpointStatu
     * @apiVersion 1.0.0
     * @apiHeader {String} key Token
     * @apiParam {Number} name UserpointStatu name
     * @apiBody {String} name name
     * @apiBody {String} description description

     *
     */
    public function update($id) {
        $UserpointStatu = new UserpointStatu();
        $update_data = [
            'name' => $this->request->getJsonVar('name'),
            'description' => $this->request->getJsonVar('description')
        ];

        $UserpointStatu->update($name, $update_data);

        $data = $UserpointStatu->find($name);

        return $this->successOutput(['userpointstatu' => $data]);
    }


    /**
     * Delete UserpointStatu
     *
     * @param $name
     * @return mixed
     *
     * @api {delete} /api/v1/userpointstatu/:name Delete UserpointStatu
     * @apiName Delete-UserpointStatu
     * @apiGroup UserpointStatu
     * @apiVersion 1.0.0
     * @apiHeader {String} key Token
     * @apiParam {Number} name UserpointStatu name
     */
    public function delete($name) {
        $UserpointStatu = new UserpointStatu();
        $UserpointStatu->delete($name);

        return $this->successOutput([], 200);
    }
}
