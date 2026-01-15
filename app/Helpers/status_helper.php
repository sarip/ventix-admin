<?php

if (!function_exists('status_badge')) {

    /**
     * Render bootstrap badge from status table
     *
     * @param string $status
     * @param string $modelClass  Example: FacilityBookingStatusModel::class
     * @param array  $options
     */
    function status_badge(
        string $status,
        string $modelClass,
        array $options = []
    ): string {

        static $cache = [];

        // cache per model
        if (!isset($cache[$modelClass])) {
            $rows = (new $modelClass())->findAll();
            $cache[$modelClass] = [];

            foreach ($rows as $row) {
                $cache[$modelClass][strtolower($row->name)] = $row;
            }
        }

        $key = strtolower($status);

        // default fallback
        $label = ucfirst($status);
        $color = '#6C757D'; // bootstrap secondary
        $class = $options['class'] ?? 'badge rounded-pill';

        if (isset($cache[$modelClass][$key])) {
            $label = $cache[$modelClass][$key]->display_name;
            $color = $cache[$modelClass][$key]->color_code;
        }

        return sprintf(
            '<span class="%s" style="background-color:%s">%s</span>',
            esc($class),
            esc($color),
            esc($label)
        );
    }
}
