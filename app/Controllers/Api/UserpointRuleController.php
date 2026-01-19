<?php
/**
 * @author Sarip Hidayat <hidayatsarip2210@gmail.com>
 * @copyright Sarip Hidayat 2024
 * @date 2026-01-19
 */


namespace App\Controllers\Api;

use App\Filters\SearchFilter;
use App\Models\UserpointRule;

class UserpointRuleController extends ApiController
{

    /**
     * List UserpointRule Controller
     * @author Sarip Hidayat <hidayatsarip2210@gmail.com>
     * @return mixed|void
     *
     * @api {get} /api/v1/userpoint_rules List UserpointRule
     * @apiName List-UserpointRule
     * @apiGroup UserpointRule
     * @apiVersion 1.0.0
     * @apiHeader {String} key Token
     * @apiSuccess {Object[]} data List of UserpointRule
     * @apiQuery {String} search Search
     * @apiQuery {String} filter Filter by column with value
     * @apiQuery {String} sort_by Sort by column
     * @apiQuery {String} fields Select column
     * @apiQuery {String} per_page Per page
     * @apiQuery {String} page Page
     *
     */
    public function index() {
        $Model = new UserpointRule();

        // Define searchable column on this model
        $searchable_column = [
            'search' => ['activity_name'],
        ];

        // Execute search filter
        $output = SearchFilter::execute($Model, $searchable_column, 'userpoint_rules', []);

        // Return output
        return $this->successOutput($output);
    }

    /**
     * Create UserpointRule
     *
     * @author Sarip Hidayat <hidayatsarip2210@gmail.com>
     * @return mixed
     * @throws \ReflectionException
     *
     * @api {post} /api/v1/userpointrule Create UserpointRule
     * @apiName Create-UserpointRule
     * @apiGroup UserpointRule
     * @apiVersion 1.0.0
     * @apiHeader {String} key Token
     * @apiBody {String} activity_name activity_name
     * @apiBody {String} description description
     * @apiBody {String} points points
     * @apiBody {String} is_active is_active
     * @apiBody {String} min_transaction_amount min_transaction_amount
     * @apiBody {String} max_times_per_day max_times_per_day
     * @apiBody {String} cooldown_minutes cooldown_minutes
     * @apiBody {String} start_date start_date
     * @apiBody {String} end_date end_date
     * @apiBody {String} point_expiry_days point_expiry_days

     *
     */
    public function create() {
        $UserpointRule = new UserpointRule();
        $create_data = [
            'activity_name' => $this->request->getJsonVar('activity_name'),
            'description' => $this->request->getJsonVar('description'),
            'points' => $this->request->getJsonVar('points'),
            'is_active' => $this->request->getJsonVar('is_active'),
            'min_transaction_amount' => $this->request->getJsonVar('min_transaction_amount'),
            'max_times_per_day' => $this->request->getJsonVar('max_times_per_day'),
            'cooldown_minutes' => $this->request->getJsonVar('cooldown_minutes'),
            'start_date' => $this->request->getJsonVar('start_date'),
            'end_date' => $this->request->getJsonVar('end_date'),
            'point_expiry_days' => $this->request->getJsonVar('point_expiry_days')
        ];

        $activity_name = $UserpointRule->insert($create_data);

        return $this->successOutput(['activity_name' => $activity_name], 201);
    }


    /**
     * Update UserpointRule
     * @param $activity_name
     * @return mixed
     * @throws \ReflectionException
     *
     * @api {put} /api/v1/userpointrule/:activity_name Update UserpointRule
     * @apiName Update-UserpointRule
     * @apiGroup UserpointRule
     * @apiVersion 1.0.0
     * @apiHeader {String} key Token
     * @apiParam {Number} activity_name UserpointRule activity_name
     * @apiBody {String} activity_name activity_name
     * @apiBody {String} description description
     * @apiBody {String} points points
     * @apiBody {String} is_active is_active
     * @apiBody {String} min_transaction_amount min_transaction_amount
     * @apiBody {String} max_times_per_day max_times_per_day
     * @apiBody {String} cooldown_minutes cooldown_minutes
     * @apiBody {String} start_date start_date
     * @apiBody {String} end_date end_date
     * @apiBody {String} point_expiry_days point_expiry_days

     *
     */
    public function update($id) {
        $UserpointRule = new UserpointRule();
        $update_data = [
            'activity_name' => $this->request->getJsonVar('activity_name'),
            'description' => $this->request->getJsonVar('description'),
            'points' => $this->request->getJsonVar('points'),
            'is_active' => $this->request->getJsonVar('is_active'),
            'min_transaction_amount' => $this->request->getJsonVar('min_transaction_amount'),
            'max_times_per_day' => $this->request->getJsonVar('max_times_per_day'),
            'cooldown_minutes' => $this->request->getJsonVar('cooldown_minutes'),
            'start_date' => $this->request->getJsonVar('start_date'),
            'end_date' => $this->request->getJsonVar('end_date'),
            'point_expiry_days' => $this->request->getJsonVar('point_expiry_days')
        ];

        $UserpointRule->update($activity_name, $update_data);

        $data = $UserpointRule->find($activity_name);

        return $this->successOutput(['userpointrule' => $data]);
    }


    /**
     * Delete UserpointRule
     *
     * @param $activity_name
     * @return mixed
     *
     * @api {delete} /api/v1/userpointrule/:activity_name Delete UserpointRule
     * @apiName Delete-UserpointRule
     * @apiGroup UserpointRule
     * @apiVersion 1.0.0
     * @apiHeader {String} key Token
     * @apiParam {Number} activity_name UserpointRule activity_name
     */
    public function delete($activity_name) {
        $UserpointRule = new UserpointRule();
        $UserpointRule->delete($activity_name);

        return $this->successOutput([], 200);
    }
}
