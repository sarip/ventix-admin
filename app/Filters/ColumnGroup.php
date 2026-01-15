<?php

/**
 *
 * @author : Herlangga Sefani <https://github.com/gaibz>
 * @since : 24-03-2020 12:47 PM
 * @package : api-server
 */


namespace App\Filters;


use CodeIgniter\Model;

class ColumnGroup
{
    /**
     * Group Model
     *
     * @param Model $Model
     * @param string $groups
     */
    public static function group(Model &$Model, string $groups) {
        $groups = explode(",", $groups);
        $Model->groupBy($groups);
    }
}