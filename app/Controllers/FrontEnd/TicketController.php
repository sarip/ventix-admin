<?php
/**
 * @author Sarip Hidayat <hidayatsarip2210@gmail.com>
 * @copyright Sarip Hidayat 2024
 * @date 2026-01-12
 */


namespace App\Controllers\Frontend;

use App\Controllers\Api\ApiController;
use App\Filters\SearchFilter;
use App\Models\EventsCat;
use App\Models\EventsSponsor;
use App\Models\EventTicket;
use App\Models\SysUserticketStatu;
use App\Models\User;
use App\Models\UserTicket;

class TicketController extends ApiController
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
    public function index()
    {
        $Model = new UserTicket();

        // Define searchable column on this model
        $searchable_column = [
            'search' => ['ticket_code', 'status', 'check_in_at', 'check_in_by'],
        ];

        // Execute search filter
        $output = SearchFilter::execute($Model, $searchable_column, 'data', []);
        array_walk($output['data'], function (&$item) {
            $User = new User();
            $item->user = $User->find($item->user_id);

            $EventTicket = new EventTicket();
            $item->ticket = $EventTicket->find($item->event_ticket_id);

            $item->status_badge = status_badge(
                $item->status,
                SysUserticketStatu::class
            );



            // Map logo_url to full URL for frontend preview
            if ($item->ticket) {
                $EventSponsor = new EventsSponsor();
                $item->ticket->events_sponsors = $EventSponsor->where('events_id', $item->ticket->event_id)->findAll();
                array_walk($item->ticket->events_sponsors, function (&$sponsor) {
                    $sponsor->url = base_url('uploads/sponsor/' . $sponsor->logo_url);
                });
            }

        });

        // Return output
        return $this->successOutput($output);
    }

}
