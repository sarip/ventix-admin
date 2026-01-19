<?php
/**
 * @author Sarip Hidayat <hidayatsarip2210@gmail.com>
 * @copyright Sarip Hidayat 2024
 * @date 2026-01-19
 */


namespace App\Controllers\Api;

use App\Filters\SearchFilter;
use App\Models\User;
use App\Models\UserPoint;
use App\Models\UserpointLog;

class UserPointController extends ApiController
{

    /**
     * List UserPoint Controller
     * @author Sarip Hidayat <hidayatsarip2210@gmail.com>
     * @return mixed|void
     *
     * @api {get} /api/v1/user_points List UserPoint
     * @apiName List-UserPoint
     * @apiGroup UserPoint
     * @apiVersion 1.0.0
     * @apiHeader {String} key Token
     * @apiSuccess {Object[]} data List of UserPoint
     * @apiQuery {String} search Search
     * @apiQuery {String} filter Filter by column with value
     * @apiQuery {String} sort_by Sort by column
     * @apiQuery {String} fields Select column
     * @apiQuery {String} per_page Per page
     * @apiQuery {String} page Page
     *
     */
    public function index() {
        $Model = new UserPoint();

        // Define searchable column on this model
        $searchable_column = [
            'search' => ['user_id'],
        ];

        // Execute search filter
        $output = SearchFilter::execute($Model, $searchable_column, 'user_points', []);
        array_walk($output['user_points'], function(&$item) {
            $User = new User();
            $item->user = $User->find($item->user_id);

            $UserPointLog = new UserpointLog();
            $item->point_logs = $UserPointLog->where('user_id', $item->user_id)->findAll();



        });

        // Return output
        return $this->successOutput($output);
    }

    /**
     * Create UserPoint
     *
     * @author Sarip Hidayat <hidayatsarip2210@gmail.com>
     * @return mixed
     * @throws \ReflectionException
     *
     * @api {post} /api/v1/userpoint Create UserPoint
     * @apiName Create-UserPoint
     * @apiGroup UserPoint
     * @apiVersion 1.0.0
     * @apiHeader {String} key Token
     * @apiBody {String} user_id user_id
     * @apiBody {String} current_balance current_balance
     * @apiBody {String} total_earned total_earned
     * @apiBody {String} last_updated last_updated

     *
     */
    public function create() {
        $UserPoint = new UserPoint();
        $create_data = [
            'user_id' => $this->request->getJsonVar('user_id'),
            'current_balance' => $this->request->getJsonVar('current_balance'),
            'total_earned' => $this->request->getJsonVar('total_earned'),
            'last_updated' => $this->request->getJsonVar('last_updated')
        ];

        $user_id = $UserPoint->insert($create_data);

        return $this->successOutput(['user_id' => $user_id], 201);
    }


    /**
     * Update UserPoint
     * @param $user_id
     * @return mixed
     * @throws \ReflectionException
     *
     * @api {put} /api/v1/userpoint/:user_id Update UserPoint
     * @apiName Update-UserPoint
     * @apiGroup UserPoint
     * @apiVersion 1.0.0
     * @apiHeader {String} key Token
     * @apiParam {Number} user_id UserPoint user_id
     * @apiBody {String} user_id user_id
     * @apiBody {String} current_balance current_balance
     * @apiBody {String} total_earned total_earned
     * @apiBody {String} last_updated last_updated

     *
     */
    public function update($id) {
        $UserPoint = new UserPoint();
        $update_data = [
            'user_id' => $this->request->getJsonVar('user_id'),
            'current_balance' => $this->request->getJsonVar('current_balance'),
            'total_earned' => $this->request->getJsonVar('total_earned'),
            'last_updated' => $this->request->getJsonVar('last_updated')
        ];

        $UserPoint->update($user_id, $update_data);

        $data = $UserPoint->find($user_id);

        return $this->successOutput(['userpoint' => $data]);
    }


    /**
     * Delete UserPoint
     *
     * @param $user_id
     * @return mixed
     *
     * @api {delete} /api/v1/userpoint/:user_id Delete UserPoint
     * @apiName Delete-UserPoint
     * @apiGroup UserPoint
     * @apiVersion 1.0.0
     * @apiHeader {String} key Token
     * @apiParam {Number} user_id UserPoint user_id
     */
    public function delete($user_id) {
        $UserPoint = new UserPoint();
        $UserPoint->delete($user_id);

        return $this->successOutput([], 200);
    }
}
