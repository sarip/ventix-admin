<?php
/**
 * @author Sarip Hidayat <hidayatsarip2210@gmail.com>
 * @copyright Sarip Hidayat 2024
 * @date 2026-01-12
 */


namespace App\Controllers\Frontend;

use App\Controllers\Api\ApiController;
use App\Filters\SearchFilter;
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

        // Define searchable column on this model
        $searchable_column = [
            'search' => ['events_organizer_id', 'title'],
        ];

        // Execute search filter
        $Model->whereIn('events_status', ['ongoing', 'upcoming', 'closed']);
        $output = SearchFilter::execute($Model, $searchable_column, 'events', []);
        $db = \Config\Database::connect();
        array_walk($output['events'], function (&$item) use ($db) {
            $EventTicket = new EventTicket();
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
                'total_capacity'     => $total,
                'remaining_capacity' => $remaining,
                'registered'         => $registered,
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
        if(empty($event)) {
            return $this->errorOutput("event not found");
        }

        $EventTicket = new EventTicket();
        $event->event_tickets = $EventTicket->where('event_id', $id)->findAll();


        $EventsAgenda = new EventsAgenda();
        $event->event_agendas = $EventsAgenda->where('events_id', $id)->findAll();

        $EventsOrganizer = new EventsOrganizer();
        $event->event_organizer = $EventsOrganizer->find($event->events_organizer_id);


        $EventsSponsor = new EventsSponsor();
//        $event->event_sponsor = $EventsSponsor->where('events_id', $id)->findAll();
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
            'total_capacity'     => $total,
            'remaining_capacity' => $remaining,
            'registered'            => $registered
        ];


        $EventAd = new EventsAd();
        $event->events_ads = $EventAd->where('events_id', $id)->orderBy('sort_order', 'ASC')->findAll();
        // Map image_url to full URL for frontend preview
        array_walk($event->events_ads, function (&$ad) {
            $ad->preview_url = base_url('uploads/ads/' . $ad->image_url);
        });


        return $this->successOutput(['event' => $event]);
    }

    public function findSlug($slug)
    {
        $Model = new Event();
        $title = deslugify($slug);
        $event = $Model->like('title', $title)->first();
        if(empty($event)) {
            return $this->errorOutput("event not found");
        }

        $id = $event->id;

        $EventTicket = new EventTicket();
        $event->event_tickets = $EventTicket->where('event_id', $id)->findAll();


        $EventsAgenda = new EventsAgenda();
        $event->event_agendas = $EventsAgenda->where('events_id', $id)->findAll();

        $EventsOrganizer = new EventsOrganizer();
        $event->event_organizer = $EventsOrganizer->find($event->events_organizer_id);


        $EventsSponsor = new EventsSponsor();
//        $event->event_sponsor = $EventsSponsor->where('events_id', $id)->findAll();
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
            'total_capacity'     => $total,
            'remaining_capacity' => $remaining,
            'registered'            => $registered
        ];


        $EventAd = new EventsAd();
        $event->events_ads = $EventAd->where('events_id', $id)->orderBy('sort_order', 'ASC')->findAll();
        // Map image_url to full URL for frontend preview
        array_walk($event->events_ads, function (&$ad) {
            $ad->preview_url = base_url('uploads/ads/' . $ad->image_url);
        });


        return $this->successOutput(['event' => $event]);
    }

}
