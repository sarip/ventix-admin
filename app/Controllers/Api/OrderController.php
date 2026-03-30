<?php
/**
 * @author Sarip Hidayat <hidayatsarip2210@gmail.com>
 * @copyright Sarip Hidayat 2024
 * @date 2026-01-13
 */


namespace App\Controllers\Api;

use App\Filters\SearchFilter;
use App\Models\Event;
use App\Models\EventTicket;
use App\Models\FacilitybookingStatu;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\OrdersStatu;
use App\Models\User;
use App\Models\UserTicket;
use App\Libraries\CommissionEngine;

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
    public function index()
    {
        $Model = new Order();

        // Define searchable column on this model
        $searchable_column = [
            'search' => ['user_id', 'order_code', 'total_amount', 'status', 'payment_method'],
        ];

        $current_user = $this->request->current_user;
        $where_eo = [];

        if (!empty($current_user['eo_id'])) {

            $db = \Config\Database::connect();

            $orderIds = $db->table('order_items oi')
                ->select('oi.order_id')
                ->join('event_ticket et', 'et.id = oi.event_ticket_id')
                ->join('events e', 'e.id = et.event_id')
                ->where('e.events_organizer_id', $current_user['eo_id'])
                ->groupBy('oi.order_id')
                ->get()
                ->getResultArray();


            $where_eo['group_or'] = [
                'orders.id' => $orderIds ? array_column($orderIds, 'order_id') : [-1]
            ];
        }

        // Execute search filter
        $output = SearchFilter::execute($Model, $searchable_column, 'orders', $where_eo);
        array_walk($output['orders'], function (&$item) {
            $User = new User();
            $item->user = $User->find($item->user_id);
            $OrderItem = new OrderItem();
            $item->order_item = $OrderItem->where('order_id', $item->id)->findAll();

            array_walk($item->order_item, function (&$item2) {
                $EventTicket = new EventTicket();
                $item2->event_ticket = $EventTicket->find($item2->event_ticket_id);


                if ($item2->event_ticket) {
                    $Event = new Event();
                    $item2->event_ticket->event = $Event->find($item2->event_ticket->event_id);
                }

            });

            $item->status_badge = status_badge(
                $item->status,
                OrdersStatu::class
            );

            // Fetch commissions
            $OrderCommission = new \App\Models\OrderCommission();
            $item->commissions = $OrderCommission->where('order_id', $item->id)->findAll();
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
    public function create()
    {
        $Order = new Order();
        $EventTicket = new EventTicket();
        $create_data = [
            'user_id' => $this->request->getJsonVar('user_id'),
            'order_code' => generate_order_code(),
            'total_amount' => $this->request->getJsonVar('total_amount'),
            'status' => $this->request->getJsonVar('status'),
            'payment_method' => $this->request->getJsonVar('payment_method')
        ];
        $id = $Order->insert($create_data);
        $order_items = $this->request->getJsonVar('order_items') ?? [];
        $OrderItem = new OrderItem();
        $totalAmount = 0;
        foreach ($order_items as $order_item) {
            $OrderItem->insert([
                'order_id' => $id,
                'event_ticket_id' => $order_item->event_ticket_id,
                'event_date' => $order_item->event_date,
                'quantity' => $order_item->quantity,
                'unit_price' => $order_item->unit_price,
                'subtotal' => $order_item->subtotal,
            ]);


            $eventTicket = $EventTicket->find($order_item->event_ticket_id);
            $subtotal = $eventTicket->final_price * $order_item->quantity;
            $totalAmount += $subtotal;


            $EventTicket->update($eventTicket->id, [
                'total_capacity' => $eventTicket->total_capacity - $order_item->quantity
            ]);

            $this->_generateTicket($create_data, $id, $order_item->event_ticket_id);
        }

        $Order->update($id, [
            'total_amount' => $totalAmount
        ]);

        // Integrate Commission Engine
        $commissionEngine = new CommissionEngine();
        $commissions = $commissionEngine->processOrder($id, 'event', $totalAmount);

        // Adjust total_amount if there's a guest fee
//        if (isset($commissions['guest_fee'])) {
//            $totalAmountWithFee = $totalAmount + $commissions['guest_fee'];
//            $Order->update($id, [
//                'total_amount' => $totalAmountWithFee
//            ]);
//        }

        return $this->successOutput(['id' => $id, 'commissions' => $commissions], 201);
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
    public function update($id)
    {

        $Order = new Order();
        $UserTicket = new UserTicket();
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
        foreach ($order_items as $order_item) {
            $OrderItem->insert([
                'order_id' => $id,
                'event_ticket_id' => $order_item->event_ticket_id,
                'event_date' => $order_item->event_date,
                'quantity' => $order_item->quantity,
                'unit_price' => $order_item->unit_price,
                'subtotal' => $order_item->subtotal,
            ]);

            $this->_generateTicket($update_data, $id, $order_item->event_ticket_id);
        }

        $Order->update($id, $update_data);

        // Integrate Commission Engine
        $commissionEngine = new CommissionEngine();
        // Clear old commissions first
        $orderCommissionModel = new \App\Models\OrderCommission();
        $orderCommissionModel->where('order_id', $id)->delete();

        $commissions = $commissionEngine->processOrder($id, 'event', $update_data['total_amount']);

        // Adjust total_amount if there's a guest fee
//        if (isset($commissions['guest_fee'])) {
//            $totalAmountWithFee = (float) $update_data['total_amount'] + $commissions['guest_fee'];
//            $Order->update($id, [
//                'total_amount' => $totalAmountWithFee
//            ]);
//        }

        $data = $Order->find($id);

        return $this->successOutput(['order' => $data, 'commissions' => $commissions]);
    }

    private function _generateTicket($data, $order_id, $event_ticket_id)
    {
        $UserTicket = new UserTicket();
        if ($data['status'] === 'paid') {
            return $UserTicket->insert([
                'user_id' => $data['user_id'],
                'event_ticket_id' => $event_ticket_id,
                'ticket_code' => generate_ticket_code($order_id, $event_ticket_id),
                'status' => 'VALID'
            ]);
        } else {
            return $UserTicket
                ->builder()
                ->where('user_id', $data['user_id'])
                ->where('event_ticket_id', $event_ticket_id)
                ->delete();
        }


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
    public function delete($id)
    {
        $Order = new Order();
        $OrderItem = new OrderItem();
        $order = $Order->find($id);
        $order_items = $Order->where('order_id', $id)->findAll();
        $OrderItem
            ->builder()
            ->where('order_id', $id)
            ->delete();
        $Order->delete($id);

        $UserTicket = new UserTicket();
        foreach ($order_items as $order_item) {
            $UserTicket
                ->builder()
                ->where('user_id', $order->user_id)
                ->where('event_ticket_id', $order_item->event_ticket_id)
                ->delete();
        }
    }

    /**
     * Preview Commission Calculation
     * 
     * @api {post} /api/v1/order/preview-commission Preview Commission
     */
    public function previewCommission()
    {
        $module = $this->request->getJsonVar('module') ?? 'event';
        $baseAmount = (float) ($this->request->getJsonVar('base_amount') ?? 0);

        $engine = new \App\Libraries\CommissionEngine();
        $calculations = $engine->previewCommission($module, $baseAmount);

        return $this->successOutput([
            'base_amount' => $baseAmount,
            'module' => $module,
            'calculations' => $calculations
        ]);
    }
}
