<?php
/**
 * @author Sarip Hidayat <hidayatsarip2210@gmail.com>
 * @copyright Sarip Hidayat 2024
 * @date 2026-01-13
 */


namespace App\Controllers\Frontend;

use App\Controllers\Api\ApiController;
use App\Filters\SearchFilter;
use App\Libraries\CommissionEngine;
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
    public function create()
    {
        $db = \Config\Database::connect();
        $db->transBegin();

        try {
            $Order       = new Order();
            $OrderItem   = new OrderItem();
            $EventTicket = new EventTicket();

            // 1. Create Order
            $orderData = [
                'user_id'        => $this->request->getJsonVar('user_id'),
                'order_code'     => generate_order_code(),
                'total_amount'   => 0,
                'status'         => 'Pending',
                'payment_method' => $this->request->getJsonVar('payment_method')
            ];

            $orderId = $Order->insert($orderData);
            if (!$orderId) {
                throw new \Exception('Failed create order');
            }

            $orderItems  = $this->request->getJsonVar('order_items') ?? [];
            $totalAmount = 0;

            foreach ($orderItems as $orderItem) {

                // 2. Lock ticket row
                $ticket = $db->query(
                    'SELECT * FROM event_ticket WHERE id = ? FOR UPDATE',
                    [$orderItem->event_ticket_id]
                )->getRow();


                if (!$ticket) {
                    throw new \Exception('Ticket not found');
                }

                // 3. Validate stock
                if ($ticket->total_capacity < $orderItem->quantity) {
                    throw new \Exception('Stock not enough for ticket ID ' . $ticket->id);
                }

                $subtotal = $ticket->final_price * $orderItem->quantity;
                $totalAmount += $subtotal;

                // 4. Insert order item
                $OrderItem->insert([
                    'order_id'        => $orderId,
                    'event_ticket_id' => $ticket->id,
                    'event_date'      => $orderItem->event_date,
                    'quantity'        => $orderItem->quantity,
                    'unit_price'      => $ticket->final_price,
                    'subtotal'        => $subtotal,
                ]);

                // 5. Update stock
                $EventTicket->update($ticket->id, [
                    'total_capacity' => $ticket->total_capacity - $orderItem->quantity
                ]);
            }

            // 6. Update order total
            $Order->update($orderId, [
                'total_amount' => $totalAmount
            ]);


            // Integrate Commission Engine
            $commissionEngine = new CommissionEngine();
            $commissions = $commissionEngine->processOrder($orderId, 'event', $totalAmount);

//            // Adjust total_amount if there's a guest fee
//            if (isset($commissions['guest_fee'])) {
//                $totalAmountWithFee = $totalAmount + $commissions['guest_fee'];
//                $Order->update($id, [
//                    'total_amount' => $totalAmountWithFee
//                ]);
//            }

            // 7. Commit
            $db->transCommit();


            $order = $Order->find($orderId);
            return $this->successOutput(['data' => $order], 201);

        } catch (\Throwable $e) {

            $db->transRollback();

            return $this->errorOutput($e->getMessage(), 400);
        }
    }

    public function uploadPayment($order_code)
    {
        $Order = new Order();
        $order = $Order->where('order_code', $order_code)->first();
        if(empty($order)) {
            return $this->errorOutput('order not found');
        }

        // Upload foto
        $file = $this->request->getFile('payment_proof');
        if ($file && $file->isValid() && !$file->hasMoved()) {
            $thumbnail_url = $file->getRandomName();
            $file->move(FCPATH . 'uploads/payment_proof', $thumbnail_url);
            $Order->update($order->id, ['payment_proof' => $thumbnail_url]);
        }

        return $this->successOutput(['data' => $order]);


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
