<?php

namespace App\Services;

class EventStatusService
{
    public function getDashboardStatus(object $event): ?string
    {

        $now = time();

        // hanya launch tampil public
        if (($event->events_status ?? null) === 'draft') {
            return 'draft';
        }

        if (($event->events_status ?? null) === 'closed') {
            return 'closed';
        }

        // finished
        if ($now > strtotime($event->end_date)) {
            return 'finished';
        }

        // sold out
        if ($this->isSoldOut($event->id)) {
            return 'sold_out';
        }

        // upcoming
        if ($now < strtotime($event->start_date)) {
            return 'upcoming';
        }

        // ongoing
        if (
            $now >= strtotime($event->start_date) &&
            $now <= strtotime($event->end_date)
        ) {
            return 'ongoing';
        }

        return null;
    }

    public function isSoldOut(int $eventId): bool
    {
        $db = db_connect();

        $availableTicket = $db->table('event_ticket')
            ->where('event_id', $eventId)
            ->where('is_active', 1)
            ->where('remaining_capacity >', 0)
            ->countAllResults();

        return $availableTicket === 0;
    }
}