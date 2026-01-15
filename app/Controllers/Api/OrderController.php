<?php
/**
 * @author Sarip Hidayat <hidayatsarip2210@gmail.com>
 * @copyright Sarip Hidayat 2024
 * @date 2026-01-13
 */


namespace App\Controllers\Api;

use App\Filters\SearchFilter;
use App\Models\FacilitybookingStatu;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\OrdersStatu;
use App\Models\User;

class OrderController extends ApiController
{

    /**
     * List Order Controller
     * @author Sarip Hidayat <hidayatsarip2210@gmail.com>
     * @return mixed|void
     *
     * @api {get} /api/v1/orders List Order
     * @apiName List-Order
     * @apiGroup Order
     * @apiVersion 1.0.0
     * @apiHeader {String} key Token
     * @apiSuccess {Object[]} data List of Order
     * @apiQuery {String} search Search
     * @apiQuery {String} filter Filter by column with value
     * @apiQuery {String} sort_by Sort by column
     * @apiQuery {String} fields Select column
     * @apiQuery {String} per_page Per page
     * @apiQuery {String} page Page
     *
     */
    public function index() {
        $Model = new Order();

        // Define searchable column on this model
        $searchable_column = [
            'search' => ['user_id'],
        ];

        // Execute search filter
        $output = SearchFilter::execute($Model, $searchable_column, 'orders', []);
        array_walk($output['orders'], function(&$item) {
            $User = new User();
            $item->user = $User->find($item->user_id);
            $OrderItem = new OrderItem();
            $item->order_item = $OrderItem->where('order_id', $item->id)->findAll();

            $item->status_badge = status_badge(
                $item->status,
                OrdersStatu::class
            );
        });

        // Return output
        return $this->successOutput($output);
    }

    /**
     * Create Order
     *
     * @author Sarip Hidayat <hidayatsarip2210@gmail.com>
     * @return mixed
     * @throws \ReflectionException
     *
     * @api {post} /api/v1/order Create Order
     * @apiName Create-Order
     * @apiGroup Order
     * @apiVersion 1.0.0
     * @apiHeader {String} key Token
     * @apiBody {String} user_id user_id
     * @apiBody {String} order_code order_code
     * @apiBody {String} total_amount total_amount
     * @apiBody {String} status status
     * @apiBody {String} payment_method payment_method

     *
     */
    public function create() {
        $Order = new Order();
        $create_data = [
            'user_id' => $this->request->getJsonVar('user_id'),
            'order_code' => $this->request->getJsonVar('order_code'),
            'total_amount' => $this->request->getJsonVar('total_amount'),
            'status' => $this->request->getJsonVar('status'),
            'payment_method' => $this->request->getJsonVar('payment_method')
        ];

        $id = $Order->insert($create_data);

        return $this->successOutput(['id' => $id], 201);
    }


    /**
     * Update Order
     * @param $id
     * @return mixed
     * @throws \ReflectionException
     *
     * @api {put} /api/v1/order/:id Update Order
     * @apiName Update-Order
     * @apiGroup Order
     * @apiVersion 1.0.0
     * @apiHeader {String} key Token
     * @apiParam {Number} id Order id
     * @apiBody {String} user_id user_id
     * @apiBody {String} order_code order_code
     * @apiBody {String} total_amount total_amount
     * @apiBody {String} status status
     * @apiBody {String} payment_method payment_method

     *
     */
    public function update($id) {
        $Order = new Order();
        $update_data = [
            'user_id' => $this->request->getJsonVar('user_id'),
            'order_code' => $this->request->getJsonVar('order_code'),
            'total_amount' => $this->request->getJsonVar('total_amount'),
            'status' => $this->request->getJsonVar('status'),
            'payment_method' => $this->request->getJsonVar('payment_method')
        ];

        $Order->update($id, $update_data);

        $data = $Order->find($id);

        return $this->successOutput(['order' => $data]);
    }


    /**
     * Delete Order
     *
     * @param $id
     * @return mixed
     *
     * @api {delete} /api/v1/order/:id Delete Order
     * @apiName Delete-Order
     * @apiGroup Order
     * @apiVersion 1.0.0
     * @apiHeader {String} key Token
     * @apiParam {Number} id Order id
     */
    public function delete($id) {
        $Order = new Order();
        $Order->delete($id);

        return $this->successOutput([], 200);
    }
}
