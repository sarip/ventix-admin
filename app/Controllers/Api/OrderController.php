<?php
/**
 * @author Sarip Hidayat <hidayatsarip2210@gmail.com>
 * @copyright Sarip Hidayat 2024
 * @date 2026-01-13
 */


namespace App\Controllers\Api;

use App\Filters\SearchFilter;
use App\Libraries\CommissionCal;
use App\Libraries\CommissionEngine;
use App\Libraries\EmailNotificationService;
use App\Models\Event;
use App\Models\EventTicket;
use App\Models\FacilitybookingStatu;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\OrdersStatu;
use App\Models\User;
use App\Models\UserTicket;

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
            'order_source' => $this->request->getJsonVar('order_source'),
            'total_amount' => $this->request->getJsonVar('total_amount'),
            'status' => $this->request->getJsonVar('status'),
            'payment_method' => $this->request->getJsonVar('payment_method')
        ];
        if($create_data['order_source'] ==='MEMBER'){ 
            $User = new User();
            $current_user = $User->find($create_data['user_id']);
            $create_data['guest_name'] = $current_user['name'];
            $create_data['guest_email'] = $current_user['email'];
            $create_data['guest_phone'] = $current_user['phone'];
        } else {
            $create_data['guest_name'] = $this->request->getJsonVar('guest_name');
            $create_data['guest_email'] = $this->request->getJsonVar('guest_email');
            $create_data['guest_phone'] = $this->request->getJsonVar('guest_phone');
        }


        
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

            $this->_generateTicket($create_data, $id, $order_item);
        }

        $adminFeeAmount = 0;
        $grandTotal = $totalAmount;

        if ($create_data['order_source'] === 'GUEST') {
            $adminFeeAmount = CommissionCal::total(
                $totalAmount,
                'event',
                'guest_admin_fee'
            );

            $grandTotal = $totalAmount + $adminFeeAmount;
        }


        $Order->update($id, [
            'subtotal_amount' => $totalAmount,
            'admin_fee_amount' => $adminFeeAmount,
            'total_amount' => $grandTotal,
        ]);

        // Integrate Commission Engine
        $commissionEngine = new CommissionEngine();
        $commissions = $commissionEngine->processOrder($id, 'event', $totalAmount);

        // Send Order Created email
        $User = new User();
        $order = $Order->find($id);
        if($create_data['order_source'] === 'MEMBER'){
            $buyer = $User->find($order->user_id);
        } else {
            $buyer = (object)[
                'id' => null,
                'name' => $order->guest_name,
                'email' => $order->guest_email,
                'phone' => $order->guest_phone,
            ];
        }
        if ($buyer) {
            $freshOrder = $Order->find($id);
            $allItems = (new OrderItem())->where('order_id', $id)->findAll();
            (new EmailNotificationService())->sendOrderCreated($freshOrder, $buyer, $allItems);
        }

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
        $db = \Config\Database::connect();
        $db->transBegin();

        try {
            $Order = new Order();
            $UserTicket = new UserTicket();

            // 1. Get existing order for comparison
            $existingOrder = $Order->find($id);
            if (!$existingOrder) {
                throw new \Exception('Order not found');
            }

            $oldStatus = $existingOrder->status;

            // 2. Prepare update data
            $update_data = [
                'user_id' => $this->request->getJsonVar('user_id'),
                'order_code' => $this->request->getJsonVar('order_code'),
                'order_source' => $this->request->getJsonVar('order_source'),
                'total_amount' => $this->request->getJsonVar('total_amount'),
                'status' => $this->request->getJsonVar('status'),
                'payment_method' => $this->request->getJsonVar('payment_method')
            ];

            $isMember = $update_data['order_source'] === 'MEMBER';

            // 3. Set guest data based on order source
            if ($isMember) {
                $User = new User();
                $memberData = $User->find($update_data['user_id']);
                if (!$memberData) {
                    throw new \Exception('Member user not found');
                }
                $update_data['guest_name'] = $memberData->name;
                $update_data['guest_email'] = $memberData->email;
                $update_data['guest_phone'] = $memberData->phone;
            } else {
                $update_data['guest_name'] = $this->request->getJsonVar('guest_name');
                $update_data['guest_email'] = $this->request->getJsonVar('guest_email');
                $update_data['guest_phone'] = $this->request->getJsonVar('guest_phone');
            }

            // 4. Process order items
            $order_items = $this->request->getJsonVar('order_items') ?? [];
            $OrderItem = new OrderItem();

            // Delete old order items
            $OrderItem->builder()->where('order_id', $id)->delete();

            // Delete old tickets
            $UserTicket->builder()->where('order_id', $id)->delete();

            $totalAmount = 0;
            $generatedTickets = [];
            $EventTicket = new EventTicket();

            foreach ($order_items as $order_item) {
                // Insert new order item
                $OrderItem->insert([
                    'order_id' => $id,
                    'event_ticket_id' => $order_item->event_ticket_id,
                    'event_date' => $order_item->event_date,
                    'quantity' => $order_item->quantity,
                    'unit_price' => $order_item->unit_price,
                    'subtotal' => $order_item->subtotal,
                ]);

                $subtotal = $order_item->unit_price * $order_item->quantity;
                $totalAmount += $subtotal;

                // Generate tickets based on status
                if (strtolower($update_data['status']) === 'paid' || strtolower($update_data['status']) === 'sukses') {
                    // $this->_generateTicket($update_data, $id, $order_item->event_ticket_id);
                    $tickets = $this->_generateTicket(
                        $update_data,
                        $id,
                        $order_item
                    );

                    $generatedTickets = array_merge(
                        $generatedTickets,
                        $tickets
                    );
                }
            }

            // 5. Update total amount if changed
            $adminFeeAmount = 0;
            $grandTotal = $totalAmount;

            if ($update_data['order_source'] === 'GUEST') {
                $adminFeeAmount = CommissionCal::total(
                    $totalAmount,
                    'event',
                    'guest_admin_fee'
                );

                $grandTotal = $totalAmount + $adminFeeAmount;
            }

            $update_data['subtotal_amount'] = $totalAmount;
            $update_data['admin_fee_amount'] = $adminFeeAmount;
            $update_data['total_amount'] = $grandTotal;


            $Order->update($id, $update_data);
            // 7. Process commissions
            $commissionEngine = new CommissionEngine();
            $orderCommissionModel = new \App\Models\OrderCommission();
            $orderCommissionModel->where('order_id', $id)->delete();
            $commissions = $commissionEngine->processOrder($id, 'event', $update_data['total_amount']);

            // 8. Send email notifications based on status change
            $newStatus = $update_data['status'] ?? null;
            if ($newStatus && strtolower($newStatus) !== strtolower($oldStatus)) {
                $freshOrder = $Order->find($id);

                // Prepare buyer data
                if ($isMember) {
                    $UserModel = new User();
                    $buyer = $UserModel->find($update_data['user_id']);
                } else {
                    $buyer = (object)[
                        'id' => null,
                        'name' => $update_data['guest_name'],
                        'email' => $update_data['guest_email'],
                        'phone' => $update_data['guest_phone'],
                    ];
                }

                if ($buyer && $freshOrder) {
                    $emailSvc = new EmailNotificationService();

                    if (strtolower($newStatus) === 'waiting_verification') {
                        // Send payment submitted email
                        $emailSvc->sendOrderPaymentSubmitted($freshOrder, $buyer);
                    } elseif (strtolower($newStatus) === 'paid' || strtolower($newStatus) === 'sukses') {
                        $emailSvc->sendOrderPaymentAccepted(
                            $freshOrder,
                            $buyer,
                            array_values($generatedTickets)
                        );
                        // Get tickets for this order
                        // $ticketModel = new UserTicket();

                        // $tickets = $ticketModel
                        //         ->select('
                        //                 user_tickets.*,
                        //                 event_ticket.name as ticket_type,
                        //                 events.title as event_name,
                        //                 events.id as event_id,
                        //                 events.event_category as event_category,
                        //                 order_items.event_date as event_date
                        //             ')
                        //         ->join('order_items', 'order_items.event_ticket_id = user_tickets.event_ticket_id')
                        //         ->join('event_ticket', 'event_ticket.id = user_tickets.event_ticket_id')
                        //         ->join('events', 'events.id = event_ticket.event_id')
                        //         ->where('order_items.order_id', $id)
                        //         ->findAll();

                        // // Send payment accepted email with tickets
                        // $emailSvc->sendOrderPaymentAccepted($freshOrder, $buyer, array_values($tickets));
                    }
                }
            }

            $db->transCommit();

            $data = $Order->find($id);
            return $this->successOutput(['order' => $data, 'commissions' => $commissions]);

        } catch (\Throwable $e) {
            $db->transRollback();
              return $this->respond([
        'message' => $e->getMessage(),
        'file' => $e->getFile(),
        'line' => $e->getLine(),
        'trace' => $e->getTraceAsString(),
    ], 500);
            return $this->errorOutput($e->getMessage(), 400);
        }
    }

   private function _generateTicket($data, $order_id, $order_item)
    {
        $UserTicket = new UserTicket();

        $generatedTickets = [];

        if (
            strtolower($data['status']) === 'paid' ||
            strtolower($data['status']) === 'sukses'
        ) {

            for ($i = 0; $i < $order_item->quantity; $i++) {

                $ticketCode = generate_ticket_code(
                    $order_id,
                    $order_item->event_ticket_id
                );

                $ticketData = [
                    'user_id' => $data['user_id'],
                    'guest_name' => $data['guest_name'],
                    'guest_email' => $data['guest_email'],
                    'guest_phone' => $data['guest_phone'],
                    'event_ticket_id' => $order_item->event_ticket_id,
                    'ticket_code' => $ticketCode,
                    'status' => 'VALID'
                ];

                $UserTicket->insert($ticketData);

                $insertedId = $UserTicket->getInsertID();

                $ticket = $UserTicket
                    ->select('
                        user_tickets.*,
                        event_ticket.name as ticket_type,
                        events.title as event_name,
                        events.id as event_id,
                        events.event_category as event_category
                    ')
                    ->join(
                        'event_ticket',
                        'event_ticket.id = user_tickets.event_ticket_id'
                    )
                    ->join(
                        'events',
                        'events.id = event_ticket.event_id'
                    )
                    ->find($insertedId);

                $ticket->event_date = $order_item->event_date;

                $generatedTickets[] = $ticket;
            }

            return $generatedTickets;

        } else {

            return $UserTicket
                ->builder()
                ->where('user_id', $data['user_id'])
                ->where('event_ticket_id', $order_item->event_ticket_id)
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
