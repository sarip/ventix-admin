<?php

/**
 *
 * @author : Herlangga Sefani <https://github.com/gaibz>
 * @since : 12-03-2020 1:28 PM
 * @package : api-server
 */


namespace App\Filters;


use CodeIgniter\Model;

class ColumnSort
{
    public static function parse(Model &$Model, string $sort_string) : void
    {
        $sort_by = explode(":", $sort_string);
        $sort = $sort_by[0];
        $direction = $sort_by[1] ?? 'asc';
        $direction = strtolower($direction);
        if($direction !== 'asc' && $direction !== 'desc') {
            $direction = 'asc';
        }

        $sort = preg_replace('/[^a-zA-Z0-9_\-.]/', '', $sort);

        $Model->orderBy($sort, $direction, true);
    }
   }