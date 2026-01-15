<?php
/**
 * @author Sarip Hidayat <hidayatsarip2210@gmail.com>
 * @copyright Sarip Hidayat 2024
 * @date 2026-01-13
 */


namespace App\Controllers\Api;

use App\Filters\SearchFilter;
use App\Models\SysUsersApppermission;

class SysUsersApppermissionController extends ApiController
{

    /**
     * List SysUsersApppermission Controller
     * @author Sarip Hidayat <hidayatsarip2210@gmail.com>
     * @return mixed|void
     *
     * @api {get} /api/v1/sys_users_apppermissions List SysUsersApppermission
     * @apiName List-SysUsersApppermission
     * @apiGroup SysUsersApppermission
     * @apiVersion 1.0.0
     * @apiHeader {String} key Token
     * @apiSuccess {Object[]} data List of SysUsersApppermission
     * @apiQuery {String} search Search
     * @apiQuery {String} filter Filter by column with value
     * @apiQuery {String} sort_by Sort by column
     * @apiQuery {String} fields Select column
     * @apiQuery {String} per_page Per page
     * @apiQuery {String} page Page
     *
     */
    public function index() {
        $Model = new SysUsersApppermission();

        // Define searchable column on this model
        $searchable_column = [
            'search' => ['perm_name'],
        ];

        // Execute search filter
        $output = SearchFilter::execute($Model, $searchable_column, 'sys_users_apppermissions', []);

        // Return output
        return $this->successOutput($output);
    }

    /**
     * Create SysUsersApppermission
     *
     * @author Sarip Hidayat <hidayatsarip2210@gmail.com>
     * @return mixed
     * @throws \ReflectionException
     *
     * @api {post} /api/v1/sysusersapppermission Create SysUsersApppermission
     * @apiName Create-SysUsersApppermission
     * @apiGroup SysUsersApppermission
     * @apiVersion 1.0.0
     * @apiHeader {String} key Token
     * @apiBody {String} perm_name perm_name
     * @apiBody {String} slug slug
     * @apiBody {String} description description

     *
     */
    public function create() {
        $SysUsersApppermission = new SysUsersApppermission();
        $create_data = [
            'perm_name' => $this->request->getJsonVar('perm_name'),
            'slug' => $this->request->getJsonVar('slug'),
            'description' => $this->request->getJsonVar('description')
        ];

        $perm_name = $SysUsersApppermission->insert($create_data);

        return $this->successOutput(['perm_name' => $perm_name], 201);
    }


    /**
     * Update SysUsersApppermission
     * @param $perm_name
     * @return mixed
     * @throws \ReflectionException
     *
     * @api {put} /api/v1/sysusersapppermission/:perm_name Update SysUsersApppermission
     * @apiName Update-SysUsersApppermission
     * @apiGroup SysUsersApppermission
     * @apiVersion 1.0.0
     * @apiHeader {String} key Token
     * @apiParam {Number} perm_name SysUsersApppermission perm_name
     * @apiBody {String} perm_name perm_name
     * @apiBody {String} slug slug
     * @apiBody {String} description description

     *
     */
    public function update($id) {
        $SysUsersApppermission = new SysUsersApppermission();
        $update_data = [
            'perm_name' => $this->request->getJsonVar('perm_name'),
            'slug' => $this->request->getJsonVar('slug'),
            'description' => $this->request->getJsonVar('description')
        ];

        $SysUsersApppermission->update($perm_name, $update_data);

        $data = $SysUsersApppermission->find($perm_name);

        return $this->successOutput(['sysusersapppermission' => $data]);
    }


    /**
     * Delete SysUsersApppermission
     *
     * @param $perm_name
     * @return mixed
     *
     * @api {delete} /api/v1/sysusersapppermission/:perm_name Delete SysUsersApppermission
     * @apiName Delete-SysUsersApppermission
     * @apiGroup SysUsersApppermission
     * @apiVersion 1.0.0
     * @apiHeader {String} key Token
     * @apiParam {Number} perm_name SysUsersApppermission perm_name
     */
    public function delete($perm_name) {
        $SysUsersApppermission = new SysUsersApppermission();
        $SysUsersApppermission->delete($perm_name);

        return $this->successOutput([], 200);
    }
}
