<?php
/**
 * @author Sarip Hidayat <hidayatsarip2210@gmail.com>
 * @copyright Sarip Hidayat 2024
 * @date 2026-01-14
 */


namespace App\Controllers\Api;

use App\Filters\SearchFilter;
use App\Models\User;

class UserController extends ApiController
{

    /**
     * List User Controller
     * @author Sarip Hidayat <hidayatsarip2210@gmail.com>
     * @return mixed|void
     *
     * @api {get} /api/v1/users List User
     * @apiName List-User
     * @apiGroup User
     * @apiVersion 1.0.0
     * @apiHeader {String} key Token
     * @apiSuccess {Object[]} data List of User
     * @apiQuery {String} search Search
     * @apiQuery {String} filter Filter by column with value
     * @apiQuery {String} sort_by Sort by column
     * @apiQuery {String} fields Select column
     * @apiQuery {String} per_page Per page
     * @apiQuery {String} page Page
     *
     */
    public function index() {
        $Model = new User();

        // Define searchable column on this model
        $searchable_column = [
            'search' => ['eo_id'],
        ];

        // Execute search filter
        $output = SearchFilter::execute($Model, $searchable_column, 'users', []);

        // Return output
        return $this->successOutput($output);
    }

    /**
     * Create User
     *
     * @author Sarip Hidayat <hidayatsarip2210@gmail.com>
     * @return mixed
     * @throws \ReflectionException
     *
     * @api {post} /api/v1/user Create User
     * @apiName Create-User
     * @apiGroup User
     * @apiVersion 1.0.0
     * @apiHeader {String} key Token
     * @apiBody {String} eo_id eo_id
     * @apiBody {String} username username
     * @apiBody {String} name name
     * @apiBody {String} email email
     * @apiBody {String} password password
     * @apiBody {String} phone phone
     * @apiBody {String} role role
     * @apiBody {String} profile_picture profile_picture
     * @apiBody {String} refferalcode refferalcode
     * @apiBody {String} status status
     * @apiBody {String} last_login last_login

     *
     */
    public function create() {
        $User = new User();
        $create_data = [
            'eo_id' => $this->request->getJsonVar('eo_id'),
            'username' => $this->request->getJsonVar('username'),
            'name' => $this->request->getJsonVar('name'),
            'email' => $this->request->getJsonVar('email'),
            'password' => $this->request->getJsonVar('password'),
            'phone' => $this->request->getJsonVar('phone'),
            'role' => $this->request->getJsonVar('role'),
            'profile_picture' => $this->request->getJsonVar('profile_picture'),
            'refferalcode' => $this->request->getJsonVar('refferalcode'),
            'status' => $this->request->getJsonVar('status'),
            'last_login' => $this->request->getJsonVar('last_login')
        ];

        $id = $User->insert($create_data);

        return $this->successOutput(['id' => $id], 201);
    }


    /**
     * Update User
     * @param $id
     * @return mixed
     * @throws \ReflectionException
     *
     * @api {put} /api/v1/user/:id Update User
     * @apiName Update-User
     * @apiGroup User
     * @apiVersion 1.0.0
     * @apiHeader {String} key Token
     * @apiParam {Number} id User id
     * @apiBody {String} eo_id eo_id
     * @apiBody {String} username username
     * @apiBody {String} name name
     * @apiBody {String} email email
     * @apiBody {String} password password
     * @apiBody {String} phone phone
     * @apiBody {String} role role
     * @apiBody {String} profile_picture profile_picture
     * @apiBody {String} refferalcode refferalcode
     * @apiBody {String} status status
     * @apiBody {String} last_login last_login

     *
     */
    public function update($id) {
        $User = new User();
        $update_data = [
            'eo_id' => $this->request->getJsonVar('eo_id'),
            'username' => $this->request->getJsonVar('username'),
            'name' => $this->request->getJsonVar('name'),
            'email' => $this->request->getJsonVar('email'),
            'password' => $this->request->getJsonVar('password'),
            'phone' => $this->request->getJsonVar('phone'),
            'role' => $this->request->getJsonVar('role'),
            'profile_picture' => $this->request->getJsonVar('profile_picture'),
            'refferalcode' => $this->request->getJsonVar('refferalcode'),
            'status' => $this->request->getJsonVar('status'),
            'last_login' => $this->request->getJsonVar('last_login')
        ];

        $User->update($id, $update_data);

        $data = $User->find($id);

        return $this->successOutput(['user' => $data]);
    }


    /**
     * Delete User
     *
     * @param $id
     * @return mixed
     *
     * @api {delete} /api/v1/user/:id Delete User
     * @apiName Delete-User
     * @apiGroup User
     * @apiVersion 1.0.0
     * @apiHeader {String} key Token
     * @apiParam {Number} id User id
     */
    public function delete($id) {
        $User = new User();
        $User->delete($id);

        return $this->successOutput([], 200);
    }
}
