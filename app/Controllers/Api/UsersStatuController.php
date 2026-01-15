<?php
/**
 * @author Sarip Hidayat <hidayatsarip2210@gmail.com>
 * @copyright Sarip Hidayat 2024
 * @date 2026-01-13
 */


namespace App\Controllers\Api;

use App\Filters\SearchFilter;
use App\Models\UsersStatu;

class UsersStatuController extends ApiController
{

    /**
     * List UsersStatu Controller
     * @author Sarip Hidayat <hidayatsarip2210@gmail.com>
     * @return mixed|void
     *
     * @api {get} /api/v1/users_status List UsersStatu
     * @apiName List-UsersStatu
     * @apiGroup UsersStatu
     * @apiVersion 1.0.0
     * @apiHeader {String} key Token
     * @apiSuccess {Object[]} data List of UsersStatu
     * @apiQuery {String} search Search
     * @apiQuery {String} filter Filter by column with value
     * @apiQuery {String} sort_by Sort by column
     * @apiQuery {String} fields Select column
     * @apiQuery {String} per_page Per page
     * @apiQuery {String} page Page
     *
     */
    public function index() {
        $Model = new UsersStatu();

        // Define searchable column on this model
        $searchable_column = [
            'search' => ['name'],
        ];

        // Execute search filter
        $output = SearchFilter::execute($Model, $searchable_column, 'users_status', []);

        // Return output
        return $this->successOutput($output);
    }

    /**
     * Create UsersStatu
     *
     * @author Sarip Hidayat <hidayatsarip2210@gmail.com>
     * @return mixed
     * @throws \ReflectionException
     *
     * @api {post} /api/v1/usersstatu Create UsersStatu
     * @apiName Create-UsersStatu
     * @apiGroup UsersStatu
     * @apiVersion 1.0.0
     * @apiHeader {String} key Token
     * @apiBody {String} name name
     * @apiBody {String} description description

     *
     */
    public function create() {
        $UsersStatu = new UsersStatu();
        $create_data = [
            'name' => $this->request->getJsonVar('name'),
            'description' => $this->request->getJsonVar('description')
        ];

        $name = $UsersStatu->insert($create_data);

        return $this->successOutput(['name' => $name], 201);
    }


    /**
     * Update UsersStatu
     * @param $name
     * @return mixed
     * @throws \ReflectionException
     *
     * @api {put} /api/v1/usersstatu/:name Update UsersStatu
     * @apiName Update-UsersStatu
     * @apiGroup UsersStatu
     * @apiVersion 1.0.0
     * @apiHeader {String} key Token
     * @apiParam {Number} name UsersStatu name
     * @apiBody {String} name name
     * @apiBody {String} description description

     *
     */
    public function update($id) {
        $UsersStatu = new UsersStatu();
        $update_data = [
            'name' => $this->request->getJsonVar('name'),
            'description' => $this->request->getJsonVar('description')
        ];

        $UsersStatu->update($name, $update_data);

        $data = $UsersStatu->find($name);

        return $this->successOutput(['usersstatu' => $data]);
    }


    /**
     * Delete UsersStatu
     *
     * @param $name
     * @return mixed
     *
     * @api {delete} /api/v1/usersstatu/:name Delete UsersStatu
     * @apiName Delete-UsersStatu
     * @apiGroup UsersStatu
     * @apiVersion 1.0.0
     * @apiHeader {String} key Token
     * @apiParam {Number} name UsersStatu name
     */
    public function delete($name) {
        $UsersStatu = new UsersStatu();
        $UsersStatu->delete($name);

        return $this->successOutput([], 200);
    }
}
