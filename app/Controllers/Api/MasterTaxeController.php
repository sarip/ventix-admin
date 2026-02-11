<?php
/**
 * @author Sarip Hidayat <hidayatsarip2210@gmail.com>
 * @copyright Sarip Hidayat 2024
 * @date 2026-01-22
 */


namespace App\Controllers\Api;

use App\Filters\SearchFilter;
use App\Models\MasterTaxe;

class MasterTaxeController extends ApiController
{

    /**
     * List MasterTaxe Controller
     * @author Sarip Hidayat <hidayatsarip2210@gmail.com>
     * @return mixed|void
     *
     * @api {get} /api/v1/master_taxes List MasterTaxe
     * @apiName List-MasterTaxe
     * @apiGroup MasterTaxe
     * @apiVersion 1.0.0
     * @apiHeader {String} key Token
     * @apiSuccess {Object[]} data List of MasterTaxe
     * @apiQuery {String} search Search
     * @apiQuery {String} filter Filter by column with value
     * @apiQuery {String} sort_by Sort by column
     * @apiQuery {String} fields Select column
     * @apiQuery {String} per_page Per page
     * @apiQuery {String} page Page
     *
     */
    public function index() {
        $Model = new MasterTaxe();

        // Define searchable column on this model
        $searchable_column = [
            'search' => ['code'],
        ];

        // Execute search filter
        $output = SearchFilter::execute($Model, $searchable_column, 'master_taxes', []);

        // Return output
        return $this->successOutput($output);
    }

    /**
     * Create MasterTaxe
     *
     * @author Sarip Hidayat <hidayatsarip2210@gmail.com>
     * @return mixed
     * @throws \ReflectionException
     *
     * @api {post} /api/v1/mastertaxe Create MasterTaxe
     * @apiName Create-MasterTaxe
     * @apiGroup MasterTaxe
     * @apiVersion 1.0.0
     * @apiHeader {String} key Token
     * @apiBody {String} code code
     * @apiBody {String} name name
     * @apiBody {String} rate rate
     * @apiBody {String} is_active is_active

     *
     */
    public function create() {
        $MasterTaxe = new MasterTaxe();
        $create_data = [
            'code' => $this->request->getJsonVar('code'),
            'name' => $this->request->getJsonVar('name'),
            'rate' => $this->request->getJsonVar('rate'),
            'is_active' => $this->request->getJsonVar('is_active')
        ];

        $id = $MasterTaxe->insert($create_data);

        return $this->successOutput(['id' => $id], 201);
    }


    /**
     * Update MasterTaxe
     * @param $id
     * @return mixed
     * @throws \ReflectionException
     *
     * @api {put} /api/v1/mastertaxe/:id Update MasterTaxe
     * @apiName Update-MasterTaxe
     * @apiGroup MasterTaxe
     * @apiVersion 1.0.0
     * @apiHeader {String} key Token
     * @apiParam {Number} id MasterTaxe id
     * @apiBody {String} code code
     * @apiBody {String} name name
     * @apiBody {String} rate rate
     * @apiBody {String} is_active is_active

     *
     */
    public function update($id) {
        $MasterTaxe = new MasterTaxe();
        $update_data = [
            'code' => $this->request->getJsonVar('code'),
            'name' => $this->request->getJsonVar('name'),
            'rate' => $this->request->getJsonVar('rate'),
            'is_active' => $this->request->getJsonVar('is_active')
        ];

        $MasterTaxe->update($id, $update_data);

        $data = $MasterTaxe->find($id);

        return $this->successOutput(['mastertaxe' => $data]);
    }


    /**
     * Delete MasterTaxe
     *
     * @param $id
     * @return mixed
     *
     * @api {delete} /api/v1/mastertaxe/:id Delete MasterTaxe
     * @apiName Delete-MasterTaxe
     * @apiGroup MasterTaxe
     * @apiVersion 1.0.0
     * @apiHeader {String} key Token
     * @apiParam {Number} id MasterTaxe id
     */
    public function delete($id) {
        $MasterTaxe = new MasterTaxe();
        $MasterTaxe->delete($id);

        return $this->successOutput([], 200);
    }
}
