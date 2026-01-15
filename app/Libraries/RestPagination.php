<?php

/**
 *
 * @author : Herlangga Sefani <https://github.com/gaibz>
 * @since : 10-03-2020 6:34 PM
 * @package : KeyOS
 */


namespace App\Libraries;


use CodeIgniter\Model;

class RestPagination
{

    /**
     * Build pagination
     *
     * @param array $request
     * @param Model $Model
     * @param string $data_name
     * @param array $model_where
     * @return array
     */
    public static function build(array $request, Model &$Model, string $data_name, array $model_where)
    {
        

        // ADD FILTER 3 MONTH
        $todayStart = (new \DateTime())->setTime(0, 0, 0);
        $todayEnd   = (new \DateTime())->setTime(23, 59, 59);

        $startTimestamp = $todayStart->getTimestamp();
        $endTimestamp   = $todayEnd->getTimestamp();


        $limit = 10;
        if (!empty($request['per_page'])) {
            if (is_numeric($request['per_page'])) {
                $limit = (int)$request['per_page'];
            }

            if ($limit > 1000) {
                $limit = 1000; // set max limit allowed
            }
        }

        if($Model->isTransaction){
            if(!empty($request['created_at'])){
                $parts = explode(":", $request['created_at']);
                if (count($parts) == 2) {
                    list($startTimestamp, $endTimestamp) = explode("-", $parts[1]);

                    if($Model->dateFormat === 'datetime') {
                        if (is_numeric($startTimestamp) && is_numeric($endTimestamp)) {
                            $startTimestamp = date('Y-m-d H:i:s', $startTimestamp);
                            $endTimestamp = date('Y-m-d H:i:s', $endTimestamp);
                        }
                    }

                    $Model->where('created_at >=', $startTimestamp)->where('created_at <=', $endTimestamp);
                }else{
                    $Model->where('created_at >=', $startTimestamp)->where('created_at <=', $endTimestamp);
                }
            }
        }

        self::compileWhere($Model, $model_where);

        $data = $Model->paginate($limit);
        $pager = $Model->pager;

        self::compileWhere($Model, $model_where);
//        $total = $Model->countAllResults(true);
        $total = $Model->selectCount('*', 'n');

        if($Model->isTransaction){
            if(!empty($request['created_at'])){
                $parts = explode(":", $request['created_at']);
                if (count($parts) == 2) {
                    list($startTimestamp, $endTimestamp) = explode("-", $parts[1]);

                    if($Model->dateFormat === 'datetime') {
                        if (is_numeric($startTimestamp) && is_numeric($endTimestamp)) {
                            $startTimestamp = date('Y-m-d H:i:s', $startTimestamp);
                            $endTimestamp = date('Y-m-d H:i:s', $endTimestamp);
                        }
                    }

                    $Model->where('created_at >=', $startTimestamp)->where('created_at <=', $endTimestamp);
                }else{
                    $Model->where('created_at >=', $startTimestamp)->where('created_at <=', $endTimestamp);
                }
            }
        }
        $pagin = (object)$pager->getDetails();
        return [
            $data_name => $data,
            'pagination' => [
                'total' => $total->get(null, 0, true)->getFirstRow()->n,
//                'has_more' => $pagin->hasMore, // has some bugs, return always false
                'filtered_total' => $pagin->total,
                'per_page' => $pagin->perPage,
                'page_count' => $pagin->pageCount,
                'current_page' => $pagin->currentPage,
                // 'next_link' => $pagin->next,
                // 'previous_link' => $pagin->previous,
            ]
        ];
    }


    /**
     * Compile Where queries
     *
     * @param Model $Model
     * @param array $where
     */
    public static function compileWhere(Model &$Model, array $where)
    {
        foreach ($where as $key => $val) {
            if (is_array($val)) {
                // so this is a group lets check the key
                if($key === 'group_and') {
                    $Model->groupStart();
                    foreach($val as $column => $value) {
                        $Model->where($column, $value);
                    }
                    $Model->groupEnd();
                }
                else if($key === 'group_or') {
                    $Model->groupStart();
                    foreach($val as $column => $value) {
                        if(is_array($value)) {
                            // fungsi ini ngebug kalo misalkan ada null nya
                            // $Model->whereIn($column, $value);
                            // ganti jadi begini biar ga ngebug kalo ada null nya
                            // overall lebih safe aja sih
                            foreach($value as $v) {
                                $Model->orWhere($column, $v);
                            }
                        }
                        else
                        {
                            $Model->orWhere($column, $value);
                        }
                    }
                    $Model->groupEnd();
                }
            }
            else {
                $Model->where($key, $val);
            }
        }
    }
}
