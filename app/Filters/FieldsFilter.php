<?php

/**
 *
 * @author : Herlangga Sefani <https://github.com/gaibz>
 * @since : 13-03-2020 1:32 PM
 * @package : api-server
 */


namespace App\Filters;


use CodeIgniter\Model;

class FieldsFilter
{
    public static function filter(Model &$Model, string $fields)
    {
        $fields = explode(",", $fields);
        if(count($fields) === 1) {
            // jika cuman 1 yaudah dibikin string aja
            $fields = $fields[0];
        }
        $Model->select($fields);
    }
}