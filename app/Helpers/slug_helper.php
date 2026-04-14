<?php

if (!function_exists('generate_slug')) {
    function generate_slug(string $string): string
    {
        $slug = strtolower(trim($string));
        $slug = preg_replace('/[^a-z0-9]+/i', '-', $slug);
        $slug = trim($slug, '-');

        return $slug;
    }
}

if (!function_exists('deslugify')) {
    /**
     * Convert slug back to readable text
     */
    function deslugify($slug)
    {
        // ganti dash jadi spasi
        $text = str_replace('-', ' ', $slug);

        // optional: uppercase setiap kata
        $text = ucwords($text);

        return $text;
    }
}
