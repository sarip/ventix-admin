<?php
/**
 * @author Sarip Hidayat <hidayatsarip2210@gmail.com>
 * @copyright Sarip Hidayat 2024
 * @date 2026-01-12
 */


namespace App\Controllers\Frontend;

use App\Controllers\Api\ApiController;
use App\Filters\SearchFilter;
use App\Libraries\EventStatusService;
use App\Models\Event;
use App\Models\EventsAd;
use App\Models\EventsAgenda;
use App\Models\EventsGuest;
use App\Models\EventsOrganizer;
use App\Models\EventsSponsor;
use App\Models\EventTicket;
use App\Models\OrderItem;
use App\Models\User;

class EventController extends ApiController
{

    public function index()
    {
        $Model = new Event();
        $statusService = new \App\Services\EventStatusService();
        // Define searchable column on this model
        $searchable_column = [
            'search' => ['events_organizer_id', 'title'],
        ];

        $status = $this->request->getGet('status');
        $now = date('Y-m-d H:i:s');

        if ($status == 'upcoming') {

            $Model
                ->where('events_status', 'launch')
                ->where('start_date >', $now);

        } elseif ($status == 'ongoing') {

            $Model
                ->where('events_status', 'launch')
                ->where('start_date <=', $now)
                ->where('end_date >=', $now);

        } elseif ($status == 'finished') {

            $Model
                ->where('events_status', 'launch')
                ->where('end_date <', $now);

        } elseif ($status == 'sold_out') {

            $Model
                ->where('events_status', 'launch')
                ->where("
            NOT EXISTS (
                SELECT 1
                FROM event_ticket t
                WHERE t.event_id = events.id
                AND t.remaining_capacity > 0
            )
        ");

        }

        // Landing page ONLY shows events with DB status = 'Launch'
        // Draft and Closed events must NOT appear
        $where = ['events_status' => 'launch'];
        $output = SearchFilter::execute($Model, $searchable_column, 'events', $where);
        $db = \Config\Database::connect();
        array_walk($output['events'], function (&$item) use ($db, $statusService) {
            $EventTicket = new EventTicket();
            $item->dashboard_status = $statusService->getDashboardStatus($item);
            $summary = $EventTicket
                ->selectSum('total_capacity')
                ->selectSum('remaining_capacity')
                ->where('event_id', $item->id)
                ->first();

            $total = (int) ($summary->total_capacity ?? 0);
            $remaining = (int) ($summary->remaining_capacity ?? 0);

            $registered = $db->query("
                        SELECT COALESCE(SUM(oi.quantity), 0) AS registered
                        FROM order_items oi
                        JOIN orders o ON oi.order_id = o.id
                        JOIN event_ticket et ON oi.event_ticket_id = et.id
                        WHERE o.status NOT IN ('cancelled', 'expired', 'failed', 'refunded')
                        AND et.event_id = ?
                    ", [$item->id])->getRow()->registered;

            $item->ticket_summary = [
                'total_capacity' => $total,
                'remaining_capacity' => $remaining,
                'registered' => $registered,
            ];


        });

        return $this->successOutput($output);
    }


    public function find($id)
    {
        $Model = new Event();

        // Define searchable column on this model
        $searchable_column = [
            'search' => ['events_organizer_id', 'title'],
        ];

        // Execute search filter
        SearchFilter::executeOnly($Model, $searchable_column, ['id' => $id]);
        $event = $Model->first();
        if (empty($event)) {
            return $this->errorOutput("event not found");
        }

        $statusService = new \App\Services\EventStatusService();
        $event->dashboard_status = $statusService->getDashboardStatus($event);

        $EventTicket = new EventTicket();
        $event->event_tickets = $EventTicket->where('event_id', $id)->findAll();


        $EventsAgenda = new EventsAgenda();
        $event->event_agendas = $EventsAgenda->where('events_id', $id)->findAll();

        $EventsOrganizer = new EventsOrganizer();
        $event->event_organizer = $EventsOrganizer->find($event->events_organizer_id);


        $EventsSponsor = new EventsSponsor();
        $event->event_sponsor = $EventsSponsor->limit(5)->findAll();

        $summary = $EventTicket
            ->selectSum('total_capacity')
            ->selectSum('remaining_capacity')
            ->where('event_id', $event->id)
            ->first();

        $total = (int) ($summary->total_capacity ?? 0);
        $remaining = (int) ($summary->remaining_capacity ?? 0);

        $db = \Config\Database::connect();
        $registered = $db->query("
                        SELECT COALESCE(SUM(oi.quantity), 0) AS registered
                        FROM order_items oi
                        JOIN orders o ON oi.order_id = o.id
                        JOIN event_ticket et ON oi.event_ticket_id = et.id
                        WHERE o.status NOT IN ('cancelled', 'expired', 'failed', 'refunded')
                        AND et.event_id = ?
                    ", [$id])->getRow()->registered;

        $event->ticket_summary = [
            'total_capacity' => $total,
            'remaining_capacity' => $remaining,
            'registered' => $registered
        ];


        $EventAd = new EventsAd();
        $event->events_ads = $EventAd->where('events_id', $id)->orderBy('sort_order', 'ASC')->findAll();
        array_walk($event->events_ads, function (&$ad) {
            $ad->preview_url = base_url('uploads/ads/' . $ad->image_url);
        });


        return $this->successOutput(['event' => $event]);
    }

    public function findSlug($slug)
    {
        $Model = new Event();
        $title = deslugify($slug);
        $event = $Model->where("LOWER(REGEXP_REPLACE(title, '[^a-zA-Z0-9]+', '-')) =",$slug)->first();
        if (empty($event)) {
            return $this->errorOutput("event not found");
        }

        $id = $event->id;

        $statusService = new \App\Services\EventStatusService();
        $event->dashboard_status = $statusService->getDashboardStatus($event);

        $EventTicket = new EventTicket();
        $event->event_tickets = $EventTicket->where('event_id', $id)->findAll();


        $EventsAgenda = new EventsAgenda();
        $event->event_agendas = $EventsAgenda->where('events_id', $id)->findAll();

        $EventsOrganizer = new EventsOrganizer();
        $event->event_organizer = $EventsOrganizer->find($event->events_organizer_id);


        $EventsSponsor = new EventsSponsor();
        $event->event_sponsor = $EventsSponsor->limit(5)->findAll();

        $summary = $EventTicket
            ->selectSum('total_capacity')
            ->selectSum('remaining_capacity')
            ->where('event_id', $event->id)
            ->first();

        $total = (int) ($summary->total_capacity ?? 0);
        $remaining = (int) ($summary->remaining_capacity ?? 0);

        $db = \Config\Database::connect();
        $registered = $db->query("
                        SELECT COALESCE(SUM(oi.quantity), 0) AS registered
                        FROM order_items oi
                        JOIN orders o ON oi.order_id = o.id
                        JOIN event_ticket et ON oi.event_ticket_id = et.id
                        WHERE o.status NOT IN ('cancelled', 'expired', 'failed', 'refunded')
                        AND et.event_id = ?
                    ", [$id])->getRow()->registered;

        $event->ticket_summary = [
            'total_capacity' => $total,
            'remaining_capacity' => $remaining,
            'registered' => $registered
        ];


        $EventAd = new EventsAd();
        $event->events_ads = $EventAd->where('events_id', $id)->orderBy('sort_order', 'ASC')->findAll();
        array_walk($event->events_ads, function (&$ad) {
            $ad->preview_url = base_url('uploads/ads/' . $ad->image_url);
        });


        return $this->successOutput(['event' => $event]);
    }

}
