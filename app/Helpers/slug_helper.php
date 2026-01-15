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
