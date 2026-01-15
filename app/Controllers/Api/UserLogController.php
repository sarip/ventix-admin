<?php
/**
 * @author Sarip Hidayat <hidayatsarip2210@gmail.com>
 * @copyright Sarip Hidayat 2024
 * @date 2024-08-05
 */


namespace App\Controllers\Api;

use App\Filters\SearchFilter;
use App\Models\UserLog;

class UserLogController extends ApiController
{

    /**
     * List UserLog Controller
     * @author Sarip Hidayat <hidayatsarip2210@gmail.com>
     * @return mixed|void
     *
     * @api {get} /api/v1/user_logs List UserLog
     * @apiName List-UserLog
     * @apiGroup UserLog
     * @apiVersion 1.0.0
     * @apiHeader {String} key Token
     * @apiSuccess {Object[]} data List of UserLog
     * @apiQuery {String} search Search
     * @apiQuery {String} filter Filter by column with value
     * @apiQuery {String} sort_by Sort by column
     * @apiQuery {String} fields Select column
     * @apiQuery {String} per_page Per page
     * @apiQuery {String} page Page
     *
     */
    public function index() {
        $Model = new UserLog();

        // Define searchable column on this model
        $searchable_column = [
            'search' => ['user_id', 'event_section'],
        ];

        // Execute search filter
        $output = SearchFilter::execute($Model, $searchable_column, 'user_logs', []);

        // Return output
        return $this->successOutput($output);
    }

    /**
     * Create UserLog
     *
     * @author Sarip Hidayat <hidayatsarip2210@gmail.com>
     * @return mixed
     * @throws \ReflectionException
     *
     * @api {post} /api/v1/userlog Create UserLog
     * @apiName Create-UserLog
     * @apiGroup UserLog
     * @apiVersion 1.0.0
     * @apiHeader {String} key Token
     * @apiBody {String} user_id user_id
     * @apiBody {String} event_section event_section
     * @apiBody {String} event_action event_action
     * @apiBody {String} event_note event_note
     * @apiBody {String} ip_address ip_address
     * @apiBody {String} data data

     *
     */
    public function create() {
        $UserLog = new UserLog();
        $create_data = [
            'user_id' => $this->request->getJsonVar('user_id'),
            'event_section' => $this->request->getJsonVar('event_section'),
            'event_action' => $this->request->getJsonVar('event_action'),
            'event_note' => $this->request->getJsonVar('event_note'),
            'ip_address' => $this->request->getJsonVar('ip_address'),
            'data' => $this->request->getJsonVar('data')
        ];

        $id = $UserLog->insert($create_data);

        return $this->successOutput(['id' => $id], 201);
    }


    /**
     * Update UserLog
     * @param $id
     * @return mixed
     * @throws \ReflectionException
     *
     * @api {put} /api/v1/userlog/:id Update UserLog
     * @apiName Update-UserLog
     * @apiGroup UserLog
     * @apiVersion 1.0.0
     * @apiHeader {String} key Token
     * @apiParam {Number} id UserLog id
     * @apiBody {String} user_id user_id
     * @apiBody {String} event_section event_section
     * @apiBody {String} event_action event_action
     * @apiBody {String} event_note event_note
     * @apiBody {String} ip_address ip_address
     * @apiBody {String} data data

     *
     */
    public function update($id) {
        $UserLog = new UserLog();
        $update_data = [
            'user_id' => $this->request->getJsonVar('user_id'),
            'event_section' => $this->request->getJsonVar('event_section'),
            'event_action' => $this->request->getJsonVar('event_action'),
            'event_note' => $this->request->getJsonVar('event_note'),
            'ip_address' => $this->request->getJsonVar('ip_address'),
            'data' => $this->request->getJsonVar('data')
        ];

        $UserLog->update($id, $update_data);

        $data = $UserLog->find($id);

        return $this->successOutput(['userlog' => $data]);
    }


    /**
     * Delete UserLog
     *
     * @param $id
     * @return mixed
     *
     * @api {delete} /api/v1/userlog/:id Delete UserLog
     * @apiName Delete-UserLog
     * @apiGroup UserLog
     * @apiVersion 1.0.0
     * @apiHeader {String} key Token
     * @apiParam {Number} id UserLog id
     */
    public function delete($id) {
        $UserLog = new UserLog();
        $UserLog->delete($id);

        return $this->successOutput([], 204);
    }
}
