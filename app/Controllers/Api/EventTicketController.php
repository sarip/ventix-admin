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
use App\Models\User;

class EventTicketController extends ApiController
{

    /**
     * List EventTicket Controller
     * @author Sarip Hidayat <hidayatsarip2210@gmail.com>
     * @return mixed|void
     *
     * @api {get} /api/v1/event_ticket List EventTicket
     * @apiName List-EventTicket
     * @apiGroup EventTicket
     * @apiVersion 1.0.0
     * @apiHeader {String} key Token
     * @apiSuccess {Object[]} data List of EventTicket
     * @apiQuery {String} search Search
     * @apiQuery {String} filter Filter by column with value
     * @apiQuery {String} sort_by Sort by column
     * @apiQuery {String} fields Select column
     * @apiQuery {String} per_page Per page
     * @apiQuery {String} page Page
     *
     */
    public function index() {
        $Model = new EventTicket();

        // Define searchable column on this model
        $searchable_column = [
            'search' => ['event_id'],
        ];

        // Execute search filter
        $output = SearchFilter::execute($Model, $searchable_column, 'event_ticket', []);
        array_walk($output['event_ticket'], function(&$item) {
            $Event = new Event();
            $item->event = $Event->find($item->event_id);
        });

        // Return output
        return $this->successOutput($output);
    }

    /**
     * Create EventTicket
     *
     * @author Sarip Hidayat <hidayatsarip2210@gmail.com>
     * @return mixed
     * @throws \ReflectionException
     *
     * @api {post} /api/v1/eventticket Create EventTicket
     * @apiName Create-EventTicket
     * @apiGroup EventTicket
     * @apiVersion 1.0.0
     * @apiHeader {String} key Token
     * @apiBody {String} event_id event_id
     * @apiBody {String} name name
     * @apiBody {String} description description
     * @apiBody {String} price price
     * @apiBody {String} total_capacity total_capacity
     * @apiBody {String} remaining_capacity remaining_capacity
     * @apiBody {String} max_per_order max_per_order
     * @apiBody {String} sales_start_date sales_start_date
     * @apiBody {String} sales_end_date sales_end_date
     * @apiBody {String} is_active is_active
     * @apiBody {String} sort_order sort_order

     *
     */
    public function create() {
        $EventTicket = new EventTicket();
        $create_data = [
            'event_id' => $this->request->getJsonVar('event_id'),
            'name' => $this->request->getJsonVar('name'),
            'description' => $this->request->getJsonVar('description'),
            'price' => $this->request->getJsonVar('price'),
            'total_capacity' => $this->request->getJsonVar('total_capacity'),
            'remaining_capacity' => $this->request->getJsonVar('remaining_capacity'),
            'max_per_order' => $this->request->getJsonVar('max_per_order'),
            'sales_start_date' => $this->request->getJsonVar('sales_start_date'),
            'sales_end_date' => $this->request->getJsonVar('sales_end_date'),
            'is_active' => $this->request->getJsonVar('is_active'),
            'sort_order' => $this->request->getJsonVar('sort_order')
        ];

        $id = $EventTicket->insert($create_data);

        return $this->successOutput(['id' => $id], 201);
    }


    /**
     * Update EventTicket
     * @param $id
     * @return mixed
     * @throws \ReflectionException
     *
     * @api {put} /api/v1/eventticket/:id Update EventTicket
     * @apiName Update-EventTicket
     * @apiGroup EventTicket
     * @apiVersion 1.0.0
     * @apiHeader {String} key Token
     * @apiParam {Number} id EventTicket id
     * @apiBody {String} event_id event_id
     * @apiBody {String} name name
     * @apiBody {String} description description
     * @apiBody {String} price price
     * @apiBody {String} total_capacity total_capacity
     * @apiBody {String} remaining_capacity remaining_capacity
     * @apiBody {String} max_per_order max_per_order
     * @apiBody {String} sales_start_date sales_start_date
     * @apiBody {String} sales_end_date sales_end_date
     * @apiBody {String} is_active is_active
     * @apiBody {String} sort_order sort_order

     *
     */
    public function update($id) {
        $EventTicket = new EventTicket();
        $update_data = [
            'event_id' => $this->request->getJsonVar('event_id'),
            'name' => $this->request->getJsonVar('name'),
            'description' => $this->request->getJsonVar('description'),
            'price' => $this->request->getJsonVar('price'),
            'total_capacity' => $this->request->getJsonVar('total_capacity'),
            'remaining_capacity' => $this->request->getJsonVar('remaining_capacity'),
            'max_per_order' => $this->request->getJsonVar('max_per_order'),
            'sales_start_date' => $this->request->getJsonVar('sales_start_date'),
            'sales_end_date' => $this->request->getJsonVar('sales_end_date'),
            'is_active' => $this->request->getJsonVar('is_active'),
            'sort_order' => $this->request->getJsonVar('sort_order')
        ];

        $EventTicket->update($id, $update_data);

        $data = $EventTicket->find($id);

        return $this->successOutput(['eventticket' => $data]);
    }


    /**
     * Delete EventTicket
     *
     * @param $id
     * @return mixed
     *
     * @api {delete} /api/v1/eventticket/:id Delete EventTicket
     * @apiName Delete-EventTicket
     * @apiGroup EventTicket
     * @apiVersion 1.0.0
     * @apiHeader {String} key Token
     * @apiParam {Number} id EventTicket id
     */
    public function delete($id) {
        $EventTicket = new EventTicket();
        $EventTicket->delete($id);

        return $this->successOutput([], 200);
    }
}
