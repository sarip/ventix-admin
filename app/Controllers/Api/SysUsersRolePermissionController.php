<?php
/**
 * @author Sarip Hidayat <hidayatsarip2210@gmail.com>
 * @copyright Sarip Hidayat 2024
 * @date 2026-01-13
 */


namespace App\Controllers\Api;

use App\Filters\SearchFilter;
use App\Models\SysUsersRolePermission;

class SysUsersRolePermissionController extends ApiController
{

    /**
     * List SysUsersRolePermission Controller
     * @author Sarip Hidayat <hidayatsarip2210@gmail.com>
     * @return mixed|void
     *
     * @api {get} /api/v1/sys_users_role_permission List SysUsersRolePermission
     * @apiName List-SysUsersRolePermission
     * @apiGroup SysUsersRolePermission
     * @apiVersion 1.0.0
     * @apiHeader {String} key Token
     * @apiSuccess {Object[]} data List of SysUsersRolePermission
     * @apiQuery {String} search Search
     * @apiQuery {String} filter Filter by column with value
     * @apiQuery {String} sort_by Sort by column
     * @apiQuery {String} fields Select column
     * @apiQuery {String} per_page Per page
     * @apiQuery {String} page Page
     *
     */
    public function index() {
        $Model = new SysUsersRolePermission();

        // Define searchable column on this model
        $searchable_column = [
            'search' => ['role_name'],
        ];

        // Execute search filter
        $output = SearchFilter::execute($Model, $searchable_column, 'sys_users_role_permission', []);

        // Return output
        return $this->successOutput($output);
    }

    /**
     * Create SysUsersRolePermission
     *
     * @author Sarip Hidayat <hidayatsarip2210@gmail.com>
     * @return mixed
     * @throws \ReflectionException
     *
     * @api {post} /api/v1/sysusersrolepermission Create SysUsersRolePermission
     * @apiName Create-SysUsersRolePermission
     * @apiGroup SysUsersRolePermission
     * @apiVersion 1.0.0
     * @apiHeader {String} key Token
     * @apiBody {String} role_name role_name
     * @apiBody {String} perm_name perm_name

     *
     */
    public function create() {
        $SysUsersRolePermission = new SysUsersRolePermission();
        $create_data = [
            'role_name' => $this->request->getJsonVar('role_name'),
            'perm_name' => $this->request->getJsonVar('perm_name')
        ];

        $perm_name = $SysUsersRolePermission->insert($create_data);

        return $this->successOutput(['perm_name' => $perm_name], 201);
    }


    /**
     * Update SysUsersRolePermission
     * @param $perm_name
     * @return mixed
     * @throws \ReflectionException
     *
     * @api {put} /api/v1/sysusersrolepermission/:perm_name Update SysUsersRolePermission
     * @apiName Update-SysUsersRolePermission
     * @apiGroup SysUsersRolePermission
     * @apiVersion 1.0.0
     * @apiHeader {String} key Token
     * @apiParam {Number} perm_name SysUsersRolePermission perm_name
     * @apiBody {String} role_name role_name
     * @apiBody {String} perm_name perm_name

     *
     */
    public function update($id) {
        $SysUsersRolePermission = new SysUsersRolePermission();
        $update_data = [
            'role_name' => $this->request->getJsonVar('role_name'),
            'perm_name' => $this->request->getJsonVar('perm_name')
        ];

        $SysUsersRolePermission->update($perm_name, $update_data);

        $data = $SysUsersRolePermission->find($perm_name);

        return $this->successOutput(['sysusersrolepermission' => $data]);
    }


    /**
     * Delete SysUsersRolePermission
     *
     * @param $perm_name
     * @return mixed
     *
     * @api {delete} /api/v1/sysusersrolepermission/:perm_name Delete SysUsersRolePermission
     * @apiName Delete-SysUsersRolePermission
     * @apiGroup SysUsersRolePermission
     * @apiVersion 1.0.0
     * @apiHeader {String} key Token
     * @apiParam {Number} perm_name SysUsersRolePermission perm_name
     */
    public function delete($perm_name) {
        $SysUsersRolePermission = new SysUsersRolePermission();
        $SysUsersRolePermission->delete($perm_name);

        return $this->successOutput([], 200);
    }
}
