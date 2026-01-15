<?php
/**
 * @author Sarip Hidayat <hidayatsarip2210@gmail.com>
 * @copyright Sarip Hidayat 2024
 * @date 2025-10-31
 */


namespace App\Controllers\Api;

use App\Filters\SearchFilter;
use App\Models\Module;

class ModuleController extends ApiController
{

    /**
     * List Module Controller
     * @author Sarip Hidayat <hidayatsarip2210@gmail.com>
     * @return mixed|void
     *
     * @api {get} /api/v1/modules List Module
     * @apiName List-Module
     * @apiGroup Module
     * @apiVersion 1.0.0
     * @apiHeader {String} key Token
     * @apiSuccess {Object[]} data List of Module
     * @apiQuery {String} search Search
     * @apiQuery {String} filter Filter by column with value
     * @apiQuery {String} sort_by Sort by column
     * @apiQuery {String} fields Select column
     * @apiQuery {String} per_page Per page
     * @apiQuery {String} page Page
     *
     */
    public function index() {
        $Model = new Module();

        // Define searchable column on this model
        $searchable_column = [
            'search' => ['name'],
        ];

        // Execute search filter
        $output['modules'] = SearchFilter::executeNoPagin($Model, $searchable_column, []);

        // Return output
        return $this->successOutput($output);
    }

    /**
     * Create Module
     *
     * @author Sarip Hidayat <hidayatsarip2210@gmail.com>
     * @return mixed
     * @throws \ReflectionException
     *
     * @api {post} /api/v1/module Create Module
     * @apiName Create-Module
     * @apiGroup Module
     * @apiVersion 1.0.0
     * @apiHeader {String} key Token
     * @apiBody {String} name name
     * @apiBody {String} directory directory
     * @apiBody {String} icon icon
     * @apiBody {String} parent_id parent_id
     * @apiBody {String} is_active is_active
     * @apiBody {String} sort_order sort_order

     *
     */
    public function create() {
        $Module = new Module();
        $create_data = [
            'name' => $this->request->getJsonVar('name'),
            'directory' => $this->request->getJsonVar('directory'),
            'icon' => $this->request->getJsonVar('icon'),
            'parent_id' => $this->request->getJsonVar('parent_id'),
            'is_active' => $this->request->getJsonVar('is_active'),
            'sort_order' => $this->request->getJsonVar('sort_order')
        ];

        $id = $Module->insert($create_data);

        return $this->successOutput(['id' => $id], 201);
    }


    /**
     * Update Module
     * @param $id
     * @return mixed
     * @throws \ReflectionException
     *
     * @api {put} /api/v1/module/:id Update Module
     * @apiName Update-Module
     * @apiGroup Module
     * @apiVersion 1.0.0
     * @apiHeader {String} key Token
     * @apiParam {Number} id Module id
     * @apiBody {String} name name
     * @apiBody {String} directory directory
     * @apiBody {String} icon icon
     * @apiBody {String} parent_id parent_id
     * @apiBody {String} is_active is_active
     * @apiBody {String} sort_order sort_order

     *
     */
    public function update($id) {
        $Module = new Module();
        $update_data = [
            'name' => $this->request->getJsonVar('name'),
            'directory' => $this->request->getJsonVar('directory'),
            'icon' => $this->request->getJsonVar('icon'),
            'parent_id' => $this->request->getJsonVar('parent_id'),
            'is_active' => $this->request->getJsonVar('is_active'),
            'sort_order' => $this->request->getJsonVar('sort_order')
        ];

        $Module->update($id, $update_data);

        $data = $Module->find($id);

        return $this->successOutput(['module' => $data]);
    }


    /**
     * Delete Module
     *
     * @param $id
     * @return mixed
     *
     * @api {delete} /api/v1/module/:id Delete Module
     * @apiName Delete-Module
     * @apiGroup Module
     * @apiVersion 1.0.0
     * @apiHeader {String} key Token
     * @apiParam {Number} id Module id
     */
    public function delete($id) {
        $Module = new Module();
        $Module->delete($id);

        return $this->successOutput([], 200);
    }
}
