<?php
/**
 * @author Sarip Hidayat <hidayatsarip2210@gmail.com>
 * @copyright Sarip Hidayat 2024
 * @date 2026-03-16
 */


namespace App\Controllers\Api;

use App\Filters\SearchFilter;
use App\Models\CommissionRule;

class CommissionRuleController extends ApiController
{

    /**
     * List CommissionRule Controller
     * @author Sarip Hidayat <hidayatsarip2210@gmail.com>
     * @return mixed|void
     *
     * @api {get} /api/v1/commission_rules List CommissionRule
     * @apiName List-CommissionRule
     * @apiGroup CommissionRule
     * @apiVersion 1.0.0
     * @apiHeader {String} key Token
     * @apiSuccess {Object[]} data List of CommissionRule
     * @apiQuery {String} search Search
     * @apiQuery {String} filter Filter by column with value
     * @apiQuery {String} sort_by Sort by column
     * @apiQuery {String} fields Select column
     * @apiQuery {String} per_page Per page
     * @apiQuery {String} page Page
     *
     */
    public function index() {
        $Model = new CommissionRule();

        // Define searchable column on this model
        $searchable_column = [
            'search' => ['module'],
        ];

        // Execute search filter
        $output = SearchFilter::execute($Model, $searchable_column, 'commission_rules', []);

        // Return output
        return $this->successOutput($output);
    }

    /**
     * Create CommissionRule
     *
     * @author Sarip Hidayat <hidayatsarip2210@gmail.com>
     * @return mixed
     * @throws \ReflectionException
     *
     * @api {post} /api/v1/commissionrule Create CommissionRule
     * @apiName Create-CommissionRule
     * @apiGroup CommissionRule
     * @apiVersion 1.0.0
     * @apiHeader {String} key Token
     * @apiBody {String} module module
     * @apiBody {String} rule_key rule_key
     * @apiBody {String} percentage percentage
     * @apiBody {String} fixed_amount fixed_amount
     * @apiBody {String} is_active is_active
     * @apiBody {String} created_at created_at
     * @apiBody {String} updated_at updated_at

     *
     */
    public function create() {
        $CommissionRule = new CommissionRule();
        $create_data = [
            'module' => $this->request->getJsonVar('module'),
            'rule_key' => $this->request->getJsonVar('rule_key'),
            'percentage' => $this->request->getJsonVar('percentage'),
            'fixed_amount' => $this->request->getJsonVar('fixed_amount'),
            'is_active' => $this->request->getJsonVar('is_active'),
            'created_at' => $this->request->getJsonVar('created_at'),
            'updated_at' => $this->request->getJsonVar('updated_at')
        ];

        $id = $CommissionRule->insert($create_data);

        return $this->successOutput(['id' => $id], 201);
    }


    /**
     * Update CommissionRule
     * @param $id
     * @return mixed
     * @throws \ReflectionException
     *
     * @api {put} /api/v1/commissionrule/:id Update CommissionRule
     * @apiName Update-CommissionRule
     * @apiGroup CommissionRule
     * @apiVersion 1.0.0
     * @apiHeader {String} key Token
     * @apiParam {Number} id CommissionRule id
     * @apiBody {String} module module
     * @apiBody {String} rule_key rule_key
     * @apiBody {String} percentage percentage
     * @apiBody {String} fixed_amount fixed_amount
     * @apiBody {String} is_active is_active
     * @apiBody {String} created_at created_at
     * @apiBody {String} updated_at updated_at

     *
     */
    public function update($id) {
        $CommissionRule = new CommissionRule();
        $update_data = [
            'module' => $this->request->getJsonVar('module'),
            'rule_key' => $this->request->getJsonVar('rule_key'),
            'percentage' => $this->request->getJsonVar('percentage'),
            'fixed_amount' => $this->request->getJsonVar('fixed_amount'),
            'is_active' => $this->request->getJsonVar('is_active'),
            'created_at' => $this->request->getJsonVar('created_at'),
            'updated_at' => $this->request->getJsonVar('updated_at')
        ];

        $CommissionRule->update($id, $update_data);

        $data = $CommissionRule->find($id);

        return $this->successOutput(['commissionrule' => $data]);
    }


    /**
     * Delete CommissionRule
     *
     * @param $id
     * @return mixed
     *
     * @api {delete} /api/v1/commissionrule/:id Delete CommissionRule
     * @apiName Delete-CommissionRule
     * @apiGroup CommissionRule
     * @apiVersion 1.0.0
     * @apiHeader {String} key Token
     * @apiParam {Number} id CommissionRule id
     */
    public function delete($id) {
        $CommissionRule = new CommissionRule();
        $CommissionRule->delete($id);

        return $this->successOutput([], 200);
    }
}
