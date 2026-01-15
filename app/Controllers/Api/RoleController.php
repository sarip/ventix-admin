<?php
/**
 * @author Sarip Hidayat <hidayatsarip2210@gmail.com>
 * @copyright Sarip Hidayat 2024
 * @date 2024-08-07
 */


namespace App\Controllers\Api;

use App\Filters\SearchFilter;
use App\Libraries\Validate;
use App\Models\Role;
use App\Models\RoleAction;
use App\Models\User;

class RoleController extends ApiController
{

    /**
     * List Role Controller
     * @author Sarip Hidayat <hidayatsarip2210@gmail.com>
     * @return mixed|void
     *
     * @api {get} /api/v1/roles List Role
     * @apiName List-Role
     * @apiGroup Role
     * @apiVersion 1.0.0
     * @apiHeader {String} key Token
     * @apiSuccess {Object[]} data List of Role
     * @apiQuery {String} search Search
     * @apiQuery {String} filter Filter by column with value
     * @apiQuery {String} sort_by Sort by column
     * @apiQuery {String} fields Select column
     * @apiQuery {String} per_page Per page
     * @apiQuery {String} page Page
     *
     */
    public function index() {
        $Model = new Role();

        // Define searchable column on this model
        $searchable_column = [
            'search' => ['name'],
        ];

        // Execute search filter
        $output = SearchFilter::execute($Model, $searchable_column, 'roles', []);

        array_walk($output['roles'], function(&$item) {
            $item->total_users = (new User())->where('role_id', $item->id)->countAllResults();
        });

        // Return output
        return $this->successOutput($output);
    }

    /**
     * Create Role
     *
     * @author Sarip Hidayat <hidayatsarip2210@gmail.com>
     * @return mixed
     * @throws \ReflectionException
     *
     * @api {post} /api/v1/role Create Role
     * @apiName Create-Role
     * @apiGroup Role
     * @apiVersion 1.0.0
     * @apiHeader {String} key Token
     * @apiBody {String} name name
     * @apiBody {String} scope scope

     *
     */
    public function create() {
        $Role = new Role();
        $create_data = [
            'name' => $this->request->getJsonVar('name'),
            'description' => $this->request->getJsonVar('description'),
        ];


        $rules = [
            'name'          => 'required',
        ];

        $validate = Validate::run($create_data, $rules);
        if($validate !== true) {
            return $this->errorOutput($validate, 400);
        }

        $id = $Role->insert($create_data);

        $permissions = $this->request->getJsonVar('permissions') ?? [];
        $RoleAction = new RoleAction();
        foreach($permissions as $permission) {
            $RoleAction->insert([
               'role_id' => $id,
                'label' => $permission->label,
                'scope' => 'GLOBAL',
                'endpoint' => $permission->endpoint,
                'can_create' => $permission->can_create,
                'can_delete' => $permission->can_delete,
                'can_read' => $permission->can_read,
                'can_update' => $permission->can_update,
                'module_id' => $permission->module_id,
            ]);
        }

        return $this->successOutput(['id' => $id], 201);
    }


    /**
     * Update Role
     * @param $id
     * @return mixed
     * @throws \ReflectionException
     *
     * @api {put} /api/v1/role/:id Update Role
     * @apiName Update-Role
     * @apiGroup Role
     * @apiVersion 1.0.0
     * @apiHeader {String} key Token
     * @apiParam {Number} id Role id
     * @apiBody {String} name name
     * @apiBody {String} scope scope

     *
     */
    public function update($id) {
        $Role = new Role();
        $update_data = [
            'name' => $this->request->getJsonVar('name'),
            'description' => $this->request->getJsonVar('description'),
        ];

        $Role->update($id, $update_data);

        $data = $Role->find($id);

        // ROLE ACTION
        $RoleAction = new RoleAction();
        $db = \Config\Database::connect();
        $db->table('role_actions')->where('role_id', $id)->delete();
        $permissions = $this->request->getJsonVar('permissions');
        if(!empty($permissions) && is_array($permissions)) {
            foreach ($permissions as $permission) {
                $permission->role_id = $id;
                $RoleAction->insert($permission);
            }
        }
        
        return $this->successOutput(['role' => $data]);
    }


    /**
     * Delete Role
     *
     * @param $id
     * @return mixed
     *
     * @api {delete} /api/v1/role/:id Delete Role
     * @apiName Delete-Role
     * @apiGroup Role
     * @apiVersion 1.0.0
     * @apiHeader {String} key Token
     * @apiParam {Number} id Role id
     */
    public function delete($id) {
        $Role = new Role();
        $Role->delete($id);

        return $this->successOutput([], 200);
    }
}
