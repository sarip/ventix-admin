<?php
/**
 * @author Sarip Hidayat <hidayatsarip2210@gmail.com>
 * @copyright Sarip Hidayat 2024
 * @date 2026-01-13
 */


namespace App\Controllers\Api;

use App\Filters\SearchFilter;
use App\Models\FacilitybookingStatu;

class FacilitybookingStatuController extends ApiController
{

    /**
     * List FacilitybookingStatu Controller
     * @author Sarip Hidayat <hidayatsarip2210@gmail.com>
     * @return mixed|void
     *
     * @api {get} /api/v1/facilitybooking_status List FacilitybookingStatu
     * @apiName List-FacilitybookingStatu
     * @apiGroup FacilitybookingStatu
     * @apiVersion 1.0.0
     * @apiHeader {String} key Token
     * @apiSuccess {Object[]} data List of FacilitybookingStatu
     * @apiQuery {String} search Search
     * @apiQuery {String} filter Filter by column with value
     * @apiQuery {String} sort_by Sort by column
     * @apiQuery {String} fields Select column
     * @apiQuery {String} per_page Per page
     * @apiQuery {String} page Page
     *
     */
    public function index() {
        $Model = new FacilitybookingStatu();

        // Define searchable column on this model
        $searchable_column = [
            'search' => ['name'],
        ];

        // Execute search filter
        $output = SearchFilter::execute($Model, $searchable_column, 'facilitybooking_status', []);

        // Return output
        return $this->successOutput($output);
    }

    /**
     * Create FacilitybookingStatu
     *
     * @author Sarip Hidayat <hidayatsarip2210@gmail.com>
     * @return mixed
     * @throws \ReflectionException
     *
     * @api {post} /api/v1/facilitybookingstatu Create FacilitybookingStatu
     * @apiName Create-FacilitybookingStatu
     * @apiGroup FacilitybookingStatu
     * @apiVersion 1.0.0
     * @apiHeader {String} key Token
     * @apiBody {String} name name
     * @apiBody {String} display_name display_name
     * @apiBody {String} description description
     * @apiBody {String} color_code color_code

     *
     */
    public function create() {
        $FacilitybookingStatu = new FacilitybookingStatu();
        $create_data = [
            'name' => $this->request->getJsonVar('name'),
            'display_name' => $this->request->getJsonVar('display_name'),
            'description' => $this->request->getJsonVar('description'),
            'color_code' => $this->request->getJsonVar('color_code')
        ];

        $name = $FacilitybookingStatu->insert($create_data);

        return $this->successOutput(['name' => $name], 201);
    }


    /**
     * Update FacilitybookingStatu
     * @param $name
     * @return mixed
     * @throws \ReflectionException
     *
     * @api {put} /api/v1/facilitybookingstatu/:name Update FacilitybookingStatu
     * @apiName Update-FacilitybookingStatu
     * @apiGroup FacilitybookingStatu
     * @apiVersion 1.0.0
     * @apiHeader {String} key Token
     * @apiParam {Number} name FacilitybookingStatu name
     * @apiBody {String} name name
     * @apiBody {String} display_name display_name
     * @apiBody {String} description description
     * @apiBody {String} color_code color_code

     *
     */
    public function update($id) {
        $FacilitybookingStatu = new FacilitybookingStatu();
        $update_data = [
            'name' => $this->request->getJsonVar('name'),
            'display_name' => $this->request->getJsonVar('display_name'),
            'description' => $this->request->getJsonVar('description'),
            'color_code' => $this->request->getJsonVar('color_code')
        ];

        $FacilitybookingStatu->update($name, $update_data);

        $data = $FacilitybookingStatu->find($name);

        return $this->successOutput(['facilitybookingstatu' => $data]);
    }


    /**
     * Delete FacilitybookingStatu
     *
     * @param $name
     * @return mixed
     *
     * @api {delete} /api/v1/facilitybookingstatu/:name Delete FacilitybookingStatu
     * @apiName Delete-FacilitybookingStatu
     * @apiGroup FacilitybookingStatu
     * @apiVersion 1.0.0
     * @apiHeader {String} key Token
     * @apiParam {Number} name FacilitybookingStatu name
     */
    public function delete($name) {
        $FacilitybookingStatu = new FacilitybookingStatu();
        $FacilitybookingStatu->delete($name);

        return $this->successOutput([], 200);
    }
}
