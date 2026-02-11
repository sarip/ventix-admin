<?php
/**
 * @author Sarip Hidayat <hidayatsarip2210@gmail.com>
 * @copyright Sarip Hidayat 2024
 * @date 2026-01-13
 */


namespace App\Controllers\Frontend;

use App\Controllers\Api\ApiController;
use App\Filters\SearchFilter;
use App\Models\Event;
use App\Models\EventsSponsor;
use App\Models\EventTicket;
use App\Models\FacilitybookingStatu;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\OrdersStatu;
use App\Models\User;
use Config\Services;

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
        $current_user = Services::request()->current_user ?? null;

        // Define searchable column on this model
        $searchable_column = [
            'search' => ['user_id', 'order_code', 'total_amount', 'status', 'payment_method'],
        ];


        // Execute search filter
        $output = SearchFilter::execute($Model, $searchable_column, 'orders', ['user_id' => $current_user['id']]);
        array_walk($output['orders'], function(&$item) {
            $User = new User();
            $item->user = $User->find($item->user_id);
            $OrderItem = new OrderItem();
            $item->order_item = $OrderItem->where('order_id', $item->id)->findAll();

            array_walk($item->order_item, function(&$item2) {
                $EventTicket = new EventTicket();
                $item2->event_ticket = $EventTicket->find($item2->event_ticket_id);


                if($item2->event_ticket) {
                    $Event = new Event();
                    $item2->event_ticket->event = $Event->find($item2->event_ticket->event_id);
                }

                $EventSponsor = new EventsSponsor();
                $item2->events_sponsors = $EventSponsor->where('events_id', $item2->event_ticket->event_id)->findAll();

            });

            $item->status_badge = status_badge(
                $item->status,
                OrdersStatu::class
            );
        });

        // Return output
        return $this->successOutput($output);
    }

    public function findByOrderCode($order_code) {
        $Model = new Order();
        $data = $Model->where('order_code', $order_code)->first();
        if(empty($data)) {
            return $this->errorOutput('order not found');
        }

        $OrderItem = new OrderItem();
        $data->order_item = $OrderItem->where('order_id', $data->id)->findAll();

        $User = new User();
        $data->user = $User->find($data->user_id);

        array_walk($data->order_item, function(&$item) {
            $EventTicket = new EventTicket();
            $item->event_ticket = $EventTicket->find($item->event_ticket_id);

            if($item->event_ticket) {
                $Event = new Event();
                $item->event_ticket->event = $Event->find($item->event_ticket->event_id);
            }
        });
        return $this->successOutput(['data' => $data]);

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
            'user_id' => $this->request->getJsonVar('user_id') ?? 1,
            'order_code' => generate_order_code(),
            'total_amount' => 0,
            'status' => 'Pending',
            'payment_method' => $this->request->getJsonVar('payment_method')
        ];

        $id = $Order->insert($create_data);
        $order_items = $this->request->getJsonVar('order_items') ?? [];
        $OrderItem = new OrderItem();
        $EventTicket = new EventTicket();
        $total_amount = 0;
        foreach($order_items as $order_item) {
            $item = $EventTicket->find($order_item->event_ticket_id);
            $subtotal = $order_item->quantity * $item->price;
            $total_amount += $subtotal;
            $OrderItem->insert([
                'order_id'          => $id,
                'event_ticket_id'   => $order_item->event_ticket_id,
                'event_date'        => $order_item->event_date,
                'quantity'          => $order_item->quantity,
                'unit_price'        => $item->final_price,
                'subtotal'         => $subtotal,
            ]);
        }

        $Order->update($id, ['total_amount' => $total_amount]);



        $order = $Order->find($id);
        return $this->successOutput(['id' => $id, 'data' => $order], 201);
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

        $order_items = $this->request->getJsonVar('order_items') ?? [];
        $OrderItem = new OrderItem();
        $OrderItem
            ->builder()
            ->where('order_id', $id)
            ->delete();
        foreach($order_items as $order_item) {
            $OrderItem->insert([
                'order_id'          => $id,
                'event_ticket_id'   => $order_item->event_ticket_id,
                'event_date'        => $order_item->event_date,
                'quantity'          => $order_item->quantity,
                'unit_price'        => $order_item->unit_price,
                'subtotal'         => $order_item->subtotal,
            ]);
        }

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
        $OrderItem = new OrderItem();
        $OrderItem
            ->builder()
            ->where('order_id', $id)
            ->delete();
        $Order->delete($id);

        return $this->successOutput([], 200);
    }
}
