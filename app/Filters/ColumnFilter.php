<?php

/**
 *
 * @author : Herlangga Sefani <https://github.com/gaibz>
 * @since : 12-03-2020 1:14 PM
 * @package : api-server
 */


namespace App\Filters;


use CodeIgniter\Model;

class ColumnFilter
{
    public static function parse(Model &$Model, string $filter) : void
    {
        $filter = explode(';', $filter);
        $fields = array_filter($filter, [__CLASS__, 'filter']);
        foreach($fields as $field) {
            $field = explode(":", $field);
            $field[0] = trim($field[0]);
            $field[1] = trim($field[1]);

            if(empty($field[1])) continue;

            if(strpos($field[1], ',') !== false) {
                $wherein = explode(",", $field[1]);
                $Model->whereIn($field[0], $wherein);
            }

            else if(strpos($field[1], '|') !== false || strpos($field[1], '@') !== false) {
                $field[1] = str_replace("@","",$field[1]);
                $likes = explode("|", $field[1]);
                $Model->groupStart();
                foreach($likes as $like) {
                    $Model->like($field[0], $like, 'both');
                }
                $Model->groupEnd();
            }

            else if(strpos($field[1], ">") !== false) {
                if(strpos($field[1], '>=') !== false) {
                    $where = explode(">=", $field[1]);
                    if(!isset($where[1])) {
                        continue; //
                    }
                    $Model->where($field[0].'>=', $where[1]);
                }
                else {
                    $where = explode(">", $field[1]);
                    if(!isset($where[1])) {
                        continue; //
                    }
                    $Model->where($field[0].'>', $where[1]);
                }
            }

            else if(strpos($field[1], "<") !== false) {
                if(strpos($field[1], '<=') !== false) {
                    $where = explode("<=", $field[1]);
                    if(!isset($where[1])) {
                        continue; //
                    }
                    $Model->where($field[0].'<=', $where[1]);
                }
                else {
                    $where = explode("<", $field[1]);
                    if(!isset($where[1])) {
                        continue; //
                    }
                    $Model->where($field[0].'<', $where[1]);
                }
            }

            else if(strpos($field[1], '-') !== false) {
                $whererange = explode('-', $field[1]);
                $whererange[0] = trim($whererange[0]);
                $whererange[1] = trim($whererange[1]);
                if($whererange[0] === '' || $whererange[1] === '' ){
                    continue; // invalid format
                }

                // created_at format datetime
                if($Model->dateFormat === 'datetime') {
                    if (is_numeric($whererange[0]) && is_numeric($whererange[1])) {
                        $whererange[0] = date('Y-m-d H:i:s', $whererange[0]);
                        $whererange[1] = date('Y-m-d H:i:s', $whererange[1]);
                    }
                }

                $Model->groupStart()
                    ->where($field[0].">=", $whererange[0])
                    ->where($field[0]."<=", $whererange[1])
                    ->groupEnd();

            }

            else {
                $Model->where($field[0], $field[1]);
            }

        }


//        die($Model->getLastQuery());
    }

    protected static function filter($item)
    {
        return strpos($item, ":") !== FALSE;
    }

}
