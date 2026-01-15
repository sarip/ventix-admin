<?php

/**
 *
 * @author : Herlangga Sefani <https://github.com/gaibz>
 * @since : 12-03-2020 1:34 PM
 * @package : api-server
 */


namespace App\Filters;

use App\Libraries\RestPagination;
use CodeIgniter\Model;
use Config\Services;

class SearchFilter
{

    const NO_FILTER = 0;


    public static function buildSearchModel(Model &$Model, $searchable_column)
    {
        $requestservice = Services::request();
        $request = $requestservice->getGet();
        $db = \Config\Database::connect();

        if(!empty($searchable_column)) {
            foreach($searchable_column as $search => $group) {
                if(empty($request[$search])) continue;

                $Model->groupStart();
                foreach($group as $column) {
                    if(strpos($column, '%s') !== false) {
                        // mungkin ini custom function call
                        $column = str_replace('%s', $db->escape($request[$search]), $column);
                        $Model->orWhere($column, null, true);
                    }
                    else
                    {
                        $Model->orLike($column, $request[$search]);
                    }
                }
                $Model->groupEnd();
            }
        }
    }

    /**
     * Handle request from $_GET
     *
     * @param Model $Model
     * @param $searchable_column
     * @param int $use_filter
     * @param null $request_content
     * @return mixed
     */
    public static function handleRequest(Model &$Model, $searchable_column, int $use_filter=1, $request_content = null)
    {

        if(empty($request_content)) {
            $requestservice = Services::request();
            $request = $requestservice->getGet();
        }
        else
        {
            $request = $request_content;
        }


        if($use_filter === self::NO_FILTER) {
            // Ok done, gausah difilter
            return $request;
        }

        self::buildSearchModel($Model, $searchable_column);

        if(!empty($request['sort_by'])) {
            ColumnSort::parse($Model, $request['sort_by']);
        }

        if(!empty($request['filter'])) {
            ColumnFilter::parse($Model, $request['filter']);
        }

        if(!empty($request['fields'])) {
            FieldsFilter::filter($Model, $request['fields']);
        }

        if(!empty($request['group_by'])) {
            ColumnGroup::group($Model, $request['group_by']);
        }

        if(!empty($request['created_at'])) {
            ColumnFilter::parse($Model, $request['created_at']);
        }
        return $request;
    }


    /**
     * This function will execute Request from GET Request into model
     * This can be really helpful for REST Index / Listing
     *
     * @param Model $Model
     * @param array $searchable_column grouping like [ ['column', 'column2' ], ['anothercolumn'] ]
     * @param string $dataname
     * @param array $modelwhere
     * @param mixed $request_content if set then request will search with this
     * @return array
     */
    public static function execute(Model &$Model, array $searchable_column = [], string $dataname = '', array $modelwhere = [], $request_content=null)
    {
        $request = self::handleRequest($Model, $searchable_column,1,$request_content);

        return RestPagination::build($request,$Model,$dataname,$modelwhere);
    }


    /**
     * This function will execute request from GET into model
     * without pagination, so all result will be forced, make sure limit is set or known
     *
     * @param Model $Model
     * @param array $searchable_column
     * @param array $modelwhere
     * @param int $use_filter
     * @return array|null
     */
    public static function executeNoPagin(Model &$Model, array $searchable_column = [], array $modelwhere = [], int $use_filter=1)
    {
        self::handleRequest($Model, $searchable_column, $use_filter);

        $Model->where($modelwhere);
        return $Model->findAll();
    }

    /**
     * Execute only without returning result, you can proceed later with $Model
     *
     * @param Model $Model
     * @param array $searchable_column
     * @param array $modelwhere
     * @param int $use_filter
     */
    public static function executeOnly(Model &$Model, array $searchable_column=[], array $modelwhere=[], int $use_filter=1) : void
    {
        self::handleRequest($Model, $searchable_column, $use_filter);
        $Model->where($modelwhere);
    }
}
