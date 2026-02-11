<?php
/**
 * @author Sarip Hidayat <hidayatsarip2210@gmail.com>
 * @copyright Sarip Hidayat 2024
 * @date 2026-02-04
 */


namespace App\Controllers\Frontend;

use App\Controllers\Api\ApiController;
use App\Filters\SearchFilter;
use App\Models\RegProvince;

class RegProvinceController extends ApiController
{

    /**
     * List RegProvince Controller
     * @author Sarip Hidayat <hidayatsarip2210@gmail.com>
     * @return mixed|void
     *
     * @api {get} /api/v1/reg_provinces List RegProvince
     * @apiName List-RegProvince
     * @apiGroup RegProvince
     * @apiVersion 1.0.0
     * @apiHeader {String} key Token
     * @apiSuccess {Object[]} data List of RegProvince
     * @apiQuery {String} search Search
     * @apiQuery {String} filter Filter by column with value
     * @apiQuery {String} sort_by Sort by column
     * @apiQuery {String} fields Select column
     * @apiQuery {String} per_page Per page
     * @apiQuery {String} page Page
     *
     */
    public function index() {
        $Model = new RegProvince();

        // Define searchable column on this model
        $searchable_column = [
            'search' => ['name'],
        ];

        // Execute search filter
        $output['reg_provinces'] = SearchFilter::executeNoPagin($Model, $searchable_column, []);

        // Return output
        return $this->successOutput($output);
    }

    /**
     * Create RegProvince
     *
     * @author Sarip Hidayat <hidayatsarip2210@gmail.com>
     * @return mixed
     * @throws \ReflectionException
     *
     * @api {post} /api/v1/regprovince Create RegProvince
     * @apiName Create-RegProvince
     * @apiGroup RegProvince
     * @apiVersion 1.0.0
     * @apiHeader {String} key Token
     * @apiBody {String} name name

     *
     */
    public function create() {
        $RegProvince = new RegProvince();
        $create_data = [
            'name' => $this->request->getJsonVar('name')
        ];

        $id = $RegProvince->insert($create_data);

        return $this->successOutput(['id' => $id], 201);
    }


    /**
     * Update RegProvince
     * @param $id
     * @return mixed
     * @throws \ReflectionException
     *
     * @api {put} /api/v1/regprovince/:id Update RegProvince
     * @apiName Update-RegProvince
     * @apiGroup RegProvince
     * @apiVersion 1.0.0
     * @apiHeader {String} key Token
     * @apiParam {Number} id RegProvince id
     * @apiBody {String} name name

     *
     */
    public function update($id) {
        $RegProvince = new RegProvince();
        $update_data = [
            'name' => $this->request->getJsonVar('name')
        ];

        $RegProvince->update($id, $update_data);

        $data = $RegProvince->find($id);

        return $this->successOutput(['regprovince' => $data]);
    }


    /**
     * Delete RegProvince
     *
     * @param $id
     * @return mixed
     *
     * @api {delete} /api/v1/regprovince/:id Delete RegProvince
     * @apiName Delete-RegProvince
     * @apiGroup RegProvince
     * @apiVersion 1.0.0
     * @apiHeader {String} key Token
     * @apiParam {Number} id RegProvince id
     */
    public function delete($id) {
        $RegProvince = new RegProvince();
        $RegProvince->delete($id);

        return $this->successOutput([], 200);
    }
}
