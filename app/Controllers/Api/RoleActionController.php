<?php
/**
 * @author Sarip Hidayat <hidayatsarip2210@gmail.com>
 * @copyright Sarip Hidayat 2024
 * @date 2024-08-07
 */


namespace App\Controllers\Api;

use App\Filters\SearchFilter;
use App\Libraries\Validate;
use App\Models\Module;
use App\Models\Role;
use App\Models\RoleAction;
use App\Models\User;

class RoleActionController extends ApiController
{

    /**
     * List RoleAction Controller
     * @author Sarip Hidayat <hidayatsarip2210@gmail.com>
     * @return mixed|void
     *
     * @api {get} /api/v1/role_actions List RoleAction
     * @apiName List-RoleAction
     * @apiGroup RoleAction
     * @apiVersion 1.0.0
     * @apiHeader {String} key Token
     * @apiSuccess {Object[]} data List of RoleAction
     * @apiQuery {String} search Search
     * @apiQuery {String} filter Filter by column with value
     * @apiQuery {String} sort_by Sort by column
     * @apiQuery {String} fields Select column
     * @apiQuery {String} per_page Per page
     * @apiQuery {String} page Page
     *
     */
    public function index() {
        $Model = new RoleAction();

        // Define searchable column on this model
        $searchable_column = [
            'search' => ['role_id'],
        ];

        // Execute search filter
        $output = SearchFilter::execute($Model, $searchable_column, 'role_actions', []);
        array_walk($output['role_actions'], function(&$item) {
            $Role = new Role();
            $item->role = $Role->find($item->role_id);
        });

        // Return output
        return $this->successOutput($output);
    }

    /**
     * Create RoleAction
     *
     * @author Sarip Hidayat <hidayatsarip2210@gmail.com>
     * @return mixed
     * @throws \ReflectionException
     *
     * @api {post} /api/v1/roleaction Create RoleAction
     * @apiName Create-RoleAction
     * @apiGroup RoleAction
     * @apiVersion 1.0.0
     * @apiHeader {String} key Token
     * @apiBody {String} role_id role_id
     * @apiBody {String} label label
     * @apiBody {String} scope scope
     * @apiBody {String} endpoint endpoint
     * @apiBody {String} can_read can_read
     * @apiBody {String} can_create can_create
     * @apiBody {String} can_update can_update
     * @apiBody {String} can_delete can_delete

     *
     */
    public function create() {
        $RoleAction = new RoleAction();
        $create_data = [
            'role_id' => $this->request->getJsonVar('role_id'),
            'label' => $this->request->getJsonVar('label'),
            'scope' => $this->request->getJsonVar('scope'),
            'endpoint' => $this->request->getJsonVar('endpoint'),
            'can_read' => $this->request->getJsonVar('can_read'),
            'can_create' => $this->request->getJsonVar('can_create'),
            'can_update' => $this->request->getJsonVar('can_update'),
            'can_delete' => $this->request->getJsonVar('can_delete')
        ];
        $rules = [
            'role_id'  => 'required',
            'label'    => 'required',
            'scope'     => 'required',
            'endpoint'  => 'required',
            'can_read'  => 'in_list[Y,N]',
            'can_create' => 'required',
            'can_update' => 'required',
            'can_delete' => 'required',
        ];

        $validate = Validate::run($create_data, $rules);
        if($validate !== true) {
            return $this->errorOutput($validate, 400);
        }

        $id = $RoleAction->insert($create_data);

        return $this->successOutput(['id' => $id], 201);
    }


    /**
     * Update RoleAction
     * @param $id
     * @return mixed
     * @throws \ReflectionException
     *
     * @api {put} /api/v1/roleaction/:id Update RoleAction
     * @apiName Update-RoleAction
     * @apiGroup RoleAction
     * @apiVersion 1.0.0
     * @apiHeader {String} key Token
     * @apiParam {Number} id RoleAction id
     * @apiBody {String} role_id role_id
     * @apiBody {String} label label
     * @apiBody {String} scope scope
     * @apiBody {String} endpoint endpoint
     * @apiBody {String} can_read can_read
     * @apiBody {String} can_create can_create
     * @apiBody {String} can_update can_update
     * @apiBody {String} can_delete can_delete

     *
     */
    public function update($id) {
        $RoleAction = new RoleAction();
        $update_data = [
            'role_id' => $this->request->getJsonVar('role_id'),
            'label' => $this->request->getJsonVar('label'),
            'scope' => $this->request->getJsonVar('scope'),
            'endpoint' => $this->request->getJsonVar('endpoint'),
            'can_read' => $this->request->getJsonVar('can_read'),
            'can_create' => $this->request->getJsonVar('can_create'),
            'can_update' => $this->request->getJsonVar('can_update'),
            'can_delete' => $this->request->getJsonVar('can_delete')
        ];

        $RoleAction->update($id, $update_data);

        $data = $RoleAction->find($id);



        return $this->successOutput(['roleaction' => $data]);
    }


    /**
     * Delete RoleAction
     *
     * @param $id
     * @return mixed
     *
     * @api {delete} /api/v1/roleaction/:id Delete RoleAction
     * @apiName Delete-RoleAction
     * @apiGroup RoleAction
     * @apiVersion 1.0.0
     * @apiHeader {String} key Token
     * @apiParam {Number} id RoleAction id
     */
    public function delete($id) {
        $RoleAction = new RoleAction();
        $RoleAction->delete($id);

        return $this->successOutput([], 204);
    }

    public function truncate($role_id) {
        $RoleAction = new RoleAction();
        $RoleAction->where('role_id', $role_id)->delete();

        return $this->successOutput([], 204);
    }
}
