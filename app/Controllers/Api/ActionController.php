<?php
/**
 * @author Sarip Hidayat <hidayatsarip2210@gmail.com>
 * @copyright Sarip Hidayat 2024
 * @date 2024-07-31
 */


namespace App\Controllers\Api;

use App\Filters\SearchFilter;
use App\Models\Action;

class ActionController extends ApiController
{

    /**
     * List Action Controller
     * @author Sarip Hidayat <hidayatsarip2210@gmail.com>
     * @return mixed|void
     *
     * @api {get} /api/v1/actions List Action
     * @apiName List-Action
     * @apiGroup Action
     * @apiVersion 1.0.0
     * @apiHeader {String} key Token
     * @apiSuccess {Object[]} data List of Action
     * @apiQuery {String} search Search
     * @apiQuery {String} filter Filter by column with value
     * @apiQuery {String} sort_by Sort by column
     * @apiQuery {String} fields Select column
     * @apiQuery {String} per_page Per page
     * @apiQuery {String} page Page
     *
     */
    public function index() {
        $Model = new Action();

        // Define searchable column on this model
        $searchable_column = [
            'search' => ['endpoint'],
        ];

        // Execute search filter
        $output = SearchFilter::execute($Model, $searchable_column, 'actions', []);

        // Return output
        return $this->successOutput($output);
    }

    public function scope() {
        $Model = new Action();


        $scope = $Model->select('scope')->groupBy('scope')->findAll();

        // Return output
        return $this->successOutput(['scope' => $scope]);
    }

    /**
     * Create Action
     *
     * @author Sarip Hidayat <hidayatsarip2210@gmail.com>
     * @return mixed
     * @throws \ReflectionException
     *
     * @api {post} /api/v1/action Create Action
     * @apiName Create-Action
     * @apiGroup Action
     * @apiVersion 1.0.0
     * @apiHeader {String} key Token
     * @apiBody {String} endpoint endpoint
     * @apiBody {String} scope scope
     * @apiBody {String} label label
     * @apiBody {String} title title

     *
     */
    public function create() {
        $Action = new Action();
        $create_data = [
            'endpoint' => $this->request->getJsonVar('endpoint'),
            'scope' => $this->request->getJsonVar('scope'),
            'label' => $this->request->getJsonVar('label'),
            'title' => $this->request->getJsonVar('title')
        ];

        $id = $Action->insert($create_data);

        return $this->successOutput(['id' => $id], 201);
    }


    /**
     * Update Action
     * @param $id
     * @return mixed
     * @throws \ReflectionException
     *
     * @api {put} /api/v1/action/:id Update Action
     * @apiName Update-Action
     * @apiGroup Action
     * @apiVersion 1.0.0
     * @apiHeader {String} key Token
     * @apiParam {Number} id Action id
     * @apiBody {String} endpoint endpoint
     * @apiBody {String} scope scope
     * @apiBody {String} label label
     * @apiBody {String} title title

     *
     */
    public function update($id) {
        $Action = new Action();
        $update_data = [
            'endpoint' => $this->request->getJsonVar('endpoint'),
            'scope' => $this->request->getJsonVar('scope'),
            'label' => $this->request->getJsonVar('label'),
            'title' => $this->request->getJsonVar('title')
        ];

        $Action->update($id, $update_data);

        $data = $Action->find($id);

        return $this->successOutput(['action' => $data]);
    }


    /**
     * Delete Action
     *
     * @param $id
     * @return mixed
     *
     * @api {delete} /api/v1/action/:id Delete Action
     * @apiName Delete-Action
     * @apiGroup Action
     * @apiVersion 1.0.0
     * @apiHeader {String} key Token
     * @apiParam {Number} id Action id
     */
    public function delete($id) {
        $Action = new Action();
        $Action->delete($id);

        return $this->successOutput([], 204);
    }
}
