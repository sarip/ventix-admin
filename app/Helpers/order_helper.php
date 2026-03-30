<?php

use Config\Database;

if (!function_exists('generate_order_code')) {

    function generate_order_code(): string
    {
        $db = Database::connect();

        $year = date('Y');
        $prefix = "ORD-{$year}-";

        // ambil order terakhir di tahun ini
        $row = $db->table('orders')
            ->select('order_code')
            ->like('order_code', $prefix, 'after')
            ->orderBy('order_code', 'DESC')
            ->get()
            ->getRow();

        if (!$row) {
            return $prefix . '001';
        }

        // ambil nomor urut terakhir
        $lastNumber = (int) substr($row->order_code, -3);
        $nextNumber = str_pad($lastNumber + 1, 3, '0', STR_PAD_LEFT);

        return $prefix . $nextNumber;
    }
}


if (!function_exists('generate_order_facility_code')) {

    /**
     * Generate facility booking code
     * Example: FAC-2026-015
     */
    function generate_order_facility_code(): string
    {
        $db = Database::connect();

        $table  = 'facility_bookings';
        $field  = 'facility_code';
        $prefix = 'FAC';
        $year   = date('Y');

        // Ambil kode terakhir di tahun berjalan
        $row = $db->table($table)
            ->select($field)
            ->like($field, "{$prefix}-{$year}", 'after')
            ->orderBy($field, 'DESC')
            ->limit(1)
            ->get()
            ->getRow();

        $lastNumber = 0;

        if ($row && isset($row->{$field})) {
            // FAC-2026-015 → 015
            $parts = explode('-', $row->{$field});
            $lastNumber = (int) end($parts);
        }

        $nextNumber = str_pad($lastNumber + 1, 3, '0', STR_PAD_LEFT);

        return "{$prefix}-{$year}-{$nextNumber}";
    }
}

if (!function_exists('generate_ticket_code')) {

    /**
     * Generate ticket code
     * Example: TIX-ORD1-TK1-01
     *
     * @param string $orderCode      Example: ORD1
     * @param string $ticketType    Example: TK1
     * @return string
     */
    function generate_ticket_code(int $orderId, int $eventTicketId): string
    {
        $db = \Config\Database::connect();

        $prefix = "TIX-ORD{$orderId}-TK{$eventTicketId}-";

        $row = $db->table('user_tickets')
            ->select('ticket_code')
            ->like('ticket_code', $prefix, 'after')
            ->orderBy('ticket_code', 'DESC')
            ->limit(1)
            ->get()
            ->getRow();

        $lastNumber = 0;

        if ($row) {
            $lastNumber = (int) substr(
                $row->ticket_code,
                strrpos($row->ticket_code, '-') + 1
            );
        }

        $next = str_pad($lastNumber + 1, 2, '0', STR_PAD_LEFT);

        return $prefix . $next;
    }
}

