<?php
/**
 * @author Sarip Hidayat <hidayatsarip2210@gmail.com>
 * @copyright Sarip Hidayat 2024
 * @date 2026-01-13
 */


namespace App\Controllers\Api;

use App\Filters\SearchFilter;
use App\Models\EventTicket;
use App\Models\User;
use App\Models\UserTicket;

class UserTicketController extends ApiController
{

    /**
     * List UserTicket Controller
     * @author Sarip Hidayat <hidayatsarip2210@gmail.com>
     * @return mixed|void
     *
     * @api {get} /api/v1/user_tickets List UserTicket
     * @apiName List-UserTicket
     * @apiGroup UserTicket
     * @apiVersion 1.0.0
     * @apiHeader {String} key Token
     * @apiSuccess {Object[]} data List of UserTicket
     * @apiQuery {String} search Search
     * @apiQuery {String} filter Filter by column with value
     * @apiQuery {String} sort_by Sort by column
     * @apiQuery {String} fields Select column
     * @apiQuery {String} per_page Per page
     * @apiQuery {String} page Page
     *
     */
    public function index() {
        $Model = new UserTicket();

        // Define searchable column on this model
        $searchable_column = [
            'search' => ['user_id'],
        ];

        // Execute search filter
        $output = SearchFilter::execute($Model, $searchable_column, 'user_tickets', []);
        array_walk($output['user_tickets'], function(&$item) {
            $User = new User();
            $item->user = $User->find($item->user_id);

            $EventTicket = new EventTicket();
            $item->ticket = $EventTicket->find($item->event_ticket_id);
        });

        // Return output
        return $this->successOutput($output);
    }

    /**
     * Create UserTicket
     *
     * @author Sarip Hidayat <hidayatsarip2210@gmail.com>
     * @return mixed
     * @throws \ReflectionException
     *
     * @api {post} /api/v1/userticket Create UserTicket
     * @apiName Create-UserTicket
     * @apiGroup UserTicket
     * @apiVersion 1.0.0
     * @apiHeader {String} key Token
     * @apiBody {String} user_id user_id
     * @apiBody {String} event_ticket_id event_ticket_id
     * @apiBody {String} ticket_code ticket_code
     * @apiBody {String} status status
     * @apiBody {String} check_in_at check_in_at
     * @apiBody {String} check_in_by check_in_by

     *
     */
    public function create() {
        $UserTicket = new UserTicket();
        $create_data = [
            'user_id' => $this->request->getJsonVar('user_id'),
            'event_ticket_id' => $this->request->getJsonVar('event_ticket_id'),
            'ticket_code' => $this->request->getJsonVar('ticket_code'),
            'status' => $this->request->getJsonVar('status'),
            'check_in_at' => $this->request->getJsonVar('check_in_at'),
            'check_in_by' => $this->request->getJsonVar('check_in_by')
        ];

        $id = $UserTicket->insert($create_data);

        return $this->successOutput(['id' => $id], 201);
    }


    /**
     * Update UserTicket
     * @param $id
     * @return mixed
     * @throws \ReflectionException
     *
     * @api {put} /api/v1/userticket/:id Update UserTicket
     * @apiName Update-UserTicket
     * @apiGroup UserTicket
     * @apiVersion 1.0.0
     * @apiHeader {String} key Token
     * @apiParam {Number} id UserTicket id
     * @apiBody {String} user_id user_id
     * @apiBody {String} event_ticket_id event_ticket_id
     * @apiBody {String} ticket_code ticket_code
     * @apiBody {String} status status
     * @apiBody {String} check_in_at check_in_at
     * @apiBody {String} check_in_by check_in_by

     *
     */
    public function update($id) {
        $UserTicket = new UserTicket();
        $update_data = [
            'user_id' => $this->request->getJsonVar('user_id'),
            'event_ticket_id' => $this->request->getJsonVar('event_ticket_id'),
            'ticket_code' => $this->request->getJsonVar('ticket_code'),
            'status' => $this->request->getJsonVar('status'),
            'check_in_at' => $this->request->getJsonVar('check_in_at'),
            'check_in_by' => $this->request->getJsonVar('check_in_by')
        ];

        $UserTicket->update($id, $update_data);

        $data = $UserTicket->find($id);

        return $this->successOutput(['userticket' => $data]);
    }


    /**
     * Delete UserTicket
     *
     * @param $id
     * @return mixed
     *
     * @api {delete} /api/v1/userticket/:id Delete UserTicket
     * @apiName Delete-UserTicket
     * @apiGroup UserTicket
     * @apiVersion 1.0.0
     * @apiHeader {String} key Token
     * @apiParam {Number} id UserTicket id
     */
    public function delete($id) {
        $UserTicket = new UserTicket();
        $UserTicket->delete($id);

        return $this->successOutput([], 200);
    }
}
