<?php
/**
 * @author Sarip Hidayat <hidayatsarip2210@gmail.com>
 * @copyright Sarip Hidayat 2024
 * @date 2026-01-13
 */


namespace App\Controllers\Frontend;

use App\Controllers\Api\ApiController;
use App\Filters\SearchFilter;
use App\Libraries\CommissionCal;
use App\Libraries\CommissionEngine;
use App\Libraries\EmailNotificationService;
use App\Models\Event;
use App\Models\EventsSponsor;
use App\Models\EventTicket;
use App\Models\FacilitybookingStatu;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\OrdersStatu;
use App\Models\User;
use App\Models\UserTicket;
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
        $current_user = $this->request->current_user;
        $id = "";
        $name = "";
        $phone = "";
        $email = "";
        $admin_fee_amount = 0;
        if($current_user) {
            $id = $current_user['id'];
            $name = $current_user['name'];
            $phone = $current_user['phone'];
            $email = $current_user['email'];
        } else {
            $name = $this->request->getJsonVar('guest_name');
            $email = $this->request->getJsonVar('guest_email');
            $phone = $this->request->getJsonVar('guest_phone');
        }


        if(empty($name) || empty($email) || empty($phone)) {
            return $this->errorOutput('Guest name, email, and phone are required for guest checkout', 400);
        }

        $isMember = !empty($current_user);


        try {
            $Order       = new Order();
            $OrderItem   = new OrderItem();
            $EventTicket = new EventTicket();
            // 1. Create Order
            $orderData = [
                'user_id'        => $id,
                'order_source' => $current_user ? 'MEMBER' : 'GUEST',
                'guest_name' => $name,
                'guest_email' => $email,
                'guest_phone' => $phone,
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

            $adminFeeAmount = 0;
            $grandTotal = $totalAmount;

            if (!$isMember) {

                $adminFeeAmount = CommissionCal::total(
                    $totalAmount,
                    'event',
                    'guest_admin_fee'
                );

                $grandTotal = $totalAmount + $adminFeeAmount;
            }

            $updateOrder = [
                'subtotal_amount' => $totalAmount,
                'admin_fee_amount' => $adminFeeAmount,
                'total_amount' => $grandTotal,
            ];

            // 6. Update order total
            $Order->update($orderId, $updateOrder);


            // Integrate Commission Engine
            $commissionEngine = new CommissionEngine();
            $commissions = $commissionEngine->processOrder($orderId, 'event', $grandTotal);

//            // Adjust total_amount if there's a guest fee
//            if (isset($commissions['guest_fee'])) {
//                $totalAmountWithFee = $totalAmount + $commissions['guest_fee'];
//                $Order->update($id, [
//                    'total_amount' => $totalAmountWithFee
//                ]);
//            }

            // 7. Commit


            $order = $Order->find($orderId);
            $User = new User();

            if($current_user) {
                $buyer = $User->find($order->user_id);
            } else {
                $buyer = (object)[
                    'id' => null,
                    'name' => $order->guest_name,
                    'email' => $order->guest_email,
                    'phone' => $order->guest_phone,
                ];
            }
            

            $emailSvc = new EmailNotificationService();
            if($totalAmount == 0 ){
                $Order->update($orderId, [
                    'status' => 'paid',
                    'payment_method' => ''
                ]);

                foreach ($orderItems as $orderItem) {
                   $this->_generateTicket($buyer, $orderId, $orderItem->event_ticket_id);
                }

                $ticketModel = new UserTicket();
                $tickets = $ticketModel
                    ->select('
                                user_tickets.*,
                                event_ticket.name as ticket_type,
                                events.title as event_name,
                                events.id as event_id,
                                events.event_category as event_category,
                                order_items.event_date as event_date
                            ')
                    ->join('order_items', 'order_items.event_ticket_id = user_tickets.event_ticket_id')
                    ->join('event_ticket', 'event_ticket.id = user_tickets.event_ticket_id')
                    ->join('events', 'events.id = event_ticket.event_id')
                    ->where('order_items.order_id', $orderId)
                    ->findAll();
                    // ->where('user_tickets.user_id', $current_user['id'])
                $emailSvc->sendOrderPaymentAccepted($order, $buyer, array_values($tickets), 'order_payment_accepted_free');
            }else{
                $allItems = (new OrderItem())->where('order_id', $orderId)->findAll();
                (new EmailNotificationService())->sendOrderCreated($order, $buyer, $allItems);
            }
            $db->transCommit();

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
            $Order->update($order->id, [
                'payment_proof' => $thumbnail_url,
                'status'        => 'waiting_verification'
            ]);


            $emailSvc = new EmailNotificationService();
            $buyer = (object)[
                'name' => $order->guest_name,
                'email' => $order->guest_email,
                'phone' => $order->guest_phone,
            ];
            $emailSvc->sendOrderPaymentSubmitted($order, $buyer);
        }



        return $this->successOutput(['data' => $order]);


    }


    private function _generateTicket($buyer, $order_id, $event_ticket_id)
    {
        $UserTicket = new UserTicket();
        return $UserTicket->insert([
            'user_id' => $buyer->id,
            'guest_name' => $buyer->name,
            'guest_email' => $buyer->email,
            'guest_phone' => $buyer->phone,
            'event_ticket_id' => $event_ticket_id,
            'ticket_code' => generate_ticket_code($order_id, $event_ticket_id),
            'status' => 'VALID'
        ]);


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
