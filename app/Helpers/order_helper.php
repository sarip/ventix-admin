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

