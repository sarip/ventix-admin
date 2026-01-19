<?php
/**
 * @author Sarip Hidayat <hidayatsarip2210@gmail.com>
 * @copyright Sarip Hidayat 2024
 * @date 2026-01-13
 */


namespace App\Controllers\Api;

use App\Filters\SearchFilter;
use App\Models\SysUsersRole;
use App\Models\SysUsersRolePermission;

class SysUsersRoleController extends ApiController
{

    /**
     * List SysUsersRole Controller
     * @author Sarip Hidayat <hidayatsarip2210@gmail.com>
     * @return mixed|void
     *
     * @api {get} /api/v1/sys_users_role List SysUsersRole
     * @apiName List-SysUsersRole
     * @apiGroup SysUsersRole
     * @apiVersion 1.0.0
     * @apiHeader {String} key Token
     * @apiSuccess {Object[]} data List of SysUsersRole
     * @apiQuery {String} search Search
     * @apiQuery {String} filter Filter by column with value
     * @apiQuery {String} sort_by Sort by column
     * @apiQuery {String} fields Select column
     * @apiQuery {String} per_page Per page
     * @apiQuery {String} page Page
     *
     */
    public function index() {
        $Model = new SysUsersRole();

        // Define searchable column on this model
        $searchable_column = [
            'search' => ['role_name'],
        ];

        // Execute search filter
        $output = SearchFilter::execute($Model, $searchable_column, 'sys_users_role', []);
//        array_walk($output['sys_users_role'], function(&$item) {
//            $RolePermission = new SysUsersRolePermission();
//
//            $item->sys_users_role_permission = $RolePermission->where('role_name', $item->role_name)->findAll();
//
//        });

        // Return output
        return $this->successOutput($output);
    }

    /**
     * Create SysUsersRole
     *
     * @author Sarip Hidayat <hidayatsarip2210@gmail.com>
     * @return mixed
     * @throws \ReflectionException
     *
     * @api {post} /api/v1/sysusersrole Create SysUsersRole
     * @apiName Create-SysUsersRole
     * @apiGroup SysUsersRole
     * @apiVersion 1.0.0
     * @apiHeader {String} key Token
     * @apiBody {String} role_name role_name
     * @apiBody {String} role_slug role_slug
     * @apiBody {String} description description

     *
     */
    public function create() {
        $SysUsersRole = new SysUsersRole();
        $create_data = [
            'role_name' => $this->request->getJsonVar('role_name'),
            'role_slug' => $this->request->getJsonVar('role_slug'),
            'description' => $this->request->getJsonVar('description')
        ];

        $role_name = $SysUsersRole->insert($create_data);

        return $this->successOutput(['role_name' => $role_name], 201);
    }


    /**
     * Update SysUsersRole
     * @param $role_name
     * @return mixed
     * @throws \ReflectionException
     *
     * @api {put} /api/v1/sysusersrole/:role_name Update SysUsersRole
     * @apiName Update-SysUsersRole
     * @apiGroup SysUsersRole
     * @apiVersion 1.0.0
     * @apiHeader {String} key Token
     * @apiParam {Number} role_name SysUsersRole role_name
     * @apiBody {String} role_name role_name
     * @apiBody {String} role_slug role_slug
     * @apiBody {String} description description

     *
     */
    public function update($id) {
        $SysUsersRole = new SysUsersRole();
        $update_data = [
            'role_name' => $this->request->getJsonVar('role_name'),
            'role_slug' => $this->request->getJsonVar('role_slug'),
            'description' => $this->request->getJsonVar('description')
        ];

        $SysUsersRole->update($role_name, $update_data);

        $data = $SysUsersRole->find($role_name);

        return $this->successOutput(['sysusersrole' => $data]);
    }


    /**
     * Delete SysUsersRole
     *
     * @param $role_name
     * @return mixed
     *
     * @api {delete} /api/v1/sysusersrole/:role_name Delete SysUsersRole
     * @apiName Delete-SysUsersRole
     * @apiGroup SysUsersRole
     * @apiVersion 1.0.0
     * @apiHeader {String} key Token
     * @apiParam {Number} role_name SysUsersRole role_name
     */
    public function delete($role_name) {
        $SysUsersRole = new SysUsersRole();
        $SysUsersRole->delete($role_name);

        return $this->successOutput([], 200);
    }
}
