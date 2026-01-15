<?php
/**
 * @author Sarip Hidayat <hidayatsarip2210@gmail.com>
 * @copyright Sarip Hidayat 2024
 * @date 2025-10-27
 */


namespace App\Controllers\Api;

use App\Filters\SearchFilter;
use App\Models\Cobaa;

class CobaaController extends ApiController
{

    /**
     * List Cobaa Controller
     * @author Sarip Hidayat <hidayatsarip2210@gmail.com>
     * @return mixed|void
     *
     * @api {get} /api/v1/cobaa List Cobaa
     * @apiName List-Cobaa
     * @apiGroup Cobaa
     * @apiVersion 1.0.0
     * @apiHeader {String} key Token
     * @apiSuccess {Object[]} data List of Cobaa
     * @apiQuery {String} search Search
     * @apiQuery {String} filter Filter by column with value
     * @apiQuery {String} sort_by Sort by column
     * @apiQuery {String} fields Select column
     * @apiQuery {String} per_page Per page
     * @apiQuery {String} page Page
     *
     */
    public function index() {
        $Model = new Cobaa();

        // Define searchable column on this model
        $searchable_column = [
            'search' => ['nama'],
        ];

        // Execute search filter
        $output = SearchFilter::execute($Model, $searchable_column, 'cobaa', []);

        // Return output
        return $this->successOutput($output);
    }

    /**
     * Create Cobaa
     *
     * @author Sarip Hidayat <hidayatsarip2210@gmail.com>
     * @return mixed
     * @throws \ReflectionException
     *
     * @api {post} /api/v1/cobaa Create Cobaa
     * @apiName Create-Cobaa
     * @apiGroup Cobaa
     * @apiVersion 1.0.0
     * @apiHeader {String} key Token
     * @apiBody {String} nama nama

     *
     */
    public function create() {
        $Cobaa = new Cobaa();
        $create_data = [
            'nama' => $this->request->getJsonVar('nama')
        ];

        $id = $Cobaa->insert($create_data);

        return $this->successOutput(['id' => $id], 201);
    }


    /**
     * Update Cobaa
     * @param $id
     * @return mixed
     * @throws \ReflectionException
     *
     * @api {put} /api/v1/cobaa/:id Update Cobaa
     * @apiName Update-Cobaa
     * @apiGroup Cobaa
     * @apiVersion 1.0.0
     * @apiHeader {String} key Token
     * @apiParam {Number} id Cobaa id
     * @apiBody {String} nama nama

     *
     */
    public function update($id) {
        $Cobaa = new Cobaa();
        $update_data = [
            'nama' => $this->request->getJsonVar('nama')
        ];

        $Cobaa->update($id, $update_data);

        $data = $Cobaa->find($id);

        return $this->successOutput(['cobaa' => $data]);
    }


    /**
     * Delete Cobaa
     *
     * @param $id
     * @return mixed
     *
     * @api {delete} /api/v1/cobaa/:id Delete Cobaa
     * @apiName Delete-Cobaa
     * @apiGroup Cobaa
     * @apiVersion 1.0.0
     * @apiHeader {String} key Token
     * @apiParam {Number} id Cobaa id
     */
    public function delete($id) {
        $Cobaa = new Cobaa();
        $Cobaa->delete($id);

        return $this->successOutput([], 200);
    }
}
