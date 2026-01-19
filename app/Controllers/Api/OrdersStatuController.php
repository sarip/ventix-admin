<?php
/**
 * @author Sarip Hidayat <hidayatsarip2210@gmail.com>
 * @copyright Sarip Hidayat 2024
 * @date 2026-01-15
 */


namespace App\Controllers\Api;

use App\Filters\SearchFilter;
use App\Models\OrdersStatu;

class OrdersStatuController extends ApiController
{

    /**
     * List OrdersStatu Controller
     * @author Sarip Hidayat <hidayatsarip2210@gmail.com>
     * @return mixed|void
     *
     * @api {get} /api/v1/orders_status List OrdersStatu
     * @apiName List-OrdersStatu
     * @apiGroup OrdersStatu
     * @apiVersion 1.0.0
     * @apiHeader {String} key Token
     * @apiSuccess {Object[]} data List of OrdersStatu
     * @apiQuery {String} search Search
     * @apiQuery {String} filter Filter by column with value
     * @apiQuery {String} sort_by Sort by column
     * @apiQuery {String} fields Select column
     * @apiQuery {String} per_page Per page
     * @apiQuery {String} page Page
     *
     */
    public function index() {
        $Model = new OrdersStatu();

        // Define searchable column on this model
        $searchable_column = [
            'search' => ['name'],
        ];

        // Execute search filter
        $output = SearchFilter::execute($Model, $searchable_column, 'orders_status', []);

        // Return output
        return $this->successOutput($output);
    }

    /**
     * Create OrdersStatu
     *
     * @author Sarip Hidayat <hidayatsarip2210@gmail.com>
     * @return mixed
     * @throws \ReflectionException
     *
     * @api {post} /api/v1/ordersstatu Create OrdersStatu
     * @apiName Create-OrdersStatu
     * @apiGroup OrdersStatu
     * @apiVersion 1.0.0
     * @apiHeader {String} key Token
     * @apiBody {String} name name
     * @apiBody {String} display_name display_name
     * @apiBody {String} description description
     * @apiBody {String} color_code color_code

     *
     */
    public function create() {
        $OrdersStatu = new OrdersStatu();
        $create_data = [
            'name' => $this->request->getJsonVar('name'),
            'display_name' => $this->request->getJsonVar('display_name'),
            'description' => $this->request->getJsonVar('description'),
            'color_code' => $this->request->getJsonVar('color_code')
        ];

        $name = $OrdersStatu->insert($create_data);

        return $this->successOutput(['name' => $name], 201);
    }


    /**
     * Update OrdersStatu
     * @param $name
     * @return mixed
     * @throws \ReflectionException
     *
     * @api {put} /api/v1/ordersstatu/:name Update OrdersStatu
     * @apiName Update-OrdersStatu
     * @apiGroup OrdersStatu
     * @apiVersion 1.0.0
     * @apiHeader {String} key Token
     * @apiParam {Number} name OrdersStatu name
     * @apiBody {String} name name
     * @apiBody {String} display_name display_name
     * @apiBody {String} description description
     * @apiBody {String} color_code color_code

     *
     */
    public function update($id) {
        $OrdersStatu = new OrdersStatu();
        $update_data = [
            'name' => $this->request->getJsonVar('name'),
            'display_name' => $this->request->getJsonVar('display_name'),
            'description' => $this->request->getJsonVar('description'),
            'color_code' => $this->request->getJsonVar('color_code')
        ];

        $OrdersStatu->update($name, $update_data);

        $data = $OrdersStatu->find($name);

        return $this->successOutput(['ordersstatu' => $data]);
    }


    /**
     * Delete OrdersStatu
     *
     * @param $name
     * @return mixed
     *
     * @api {delete} /api/v1/ordersstatu/:name Delete OrdersStatu
     * @apiName Delete-OrdersStatu
     * @apiGroup OrdersStatu
     * @apiVersion 1.0.0
     * @apiHeader {String} key Token
     * @apiParam {Number} name OrdersStatu name
     */
    public function delete($name) {
        $OrdersStatu = new OrdersStatu();
        $OrdersStatu->delete($name);

        return $this->successOutput([], 200);
    }
}
