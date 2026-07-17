<?php

namespace App\Controllers\Api;

use App\Models\FacilityRule;
use App\Models\Facilitie;

class FacilityRuleController extends ApiController
{
    /**
     * List Facility Rules
     *
     * @api {get} /api/v1/facilities/:facility_id/rules List Rules
     * @apiName List-Facility-Rules
     * @apiGroup Facility-Rules
     */
    public function index($facility_id)
    {
        $FacilityRule = new FacilityRule();
        $Facilitie = new Facilitie();

        // Check if facility exists
        $facility = $Facilitie->find($facility_id);
        if (!$facility) {
            return $this->failNotFound('Facility not found');
        }

        $rules = $FacilityRule->getFacilityRules($facility_id);

        return $this->successOutput(['rules' => $rules]);
    }

    /**
     * Create Facility Rule
     *
     * @api {post} /api/v1/facilities/:facility_id/rules Create Rule
     * @apiName Create-Facility-Rule
     * @apiGroup Facility-Rules
     */
    public function create($facility_id)
    {
        $FacilityRule = new FacilityRule();
        $Facilitie = new Facilitie();

        // Check if facility exists
        $facility = $Facilitie->find($facility_id);
        if (!$facility) {
            return $this->failNotFound('Facility not found');
        }

        // Get current max sort_order
        $maxOrder = $FacilityRule->selectMax('sort_order')
                                  ->where('facility_id', $facility_id)
                                  ->first();
        $nextOrder = $maxOrder ? $maxOrder->sort_order + 1 : 0;

        $data = [
            'facility_id' => $facility_id,
            'rule_text' => $this->request->getJsonVar('rule_text'),
            'sort_order' => $this->request->getJsonVar('sort_order') ?? $nextOrder,
        ];

        // Validate rule_text
        if (empty($data['rule_text'])) {
            return $this->failValidationError('rule_text is required');
        }

        $id = $FacilityRule->insert($data);

        return $this->successOutput(['id' => $id], 201);
    }

    /**
     * Update Facility Rule
     *
     * @api {put} /api/v1/facilities/:facility_id/rules/:id Update Rule
     * @apiName Update-Facility-Rule
     * @apiGroup Facility-Rules
     */
    public function update($facility_id, $id)
    {
        $FacilityRule = new FacilityRule();

        $rule = $FacilityRule->where('facility_id', $facility_id)->where('id', $id)->first();
        if (!$rule) {
            return $this->failNotFound('Rule not found');
        }

        $data = [
            'rule_text' => $this->request->getJsonVar('rule_text'),
            'sort_order' => $this->request->getJsonVar('sort_order'),
        ];

        // Filter null values
        $data = array_filter($data, function($value) {
            return $value !== null;
        });

        $FacilityRule->update($id, $data);

        return $this->successOutput(['rule' => $FacilityRule->find($id)]);
    }

    /**
     * Reorder Rules
     *
     * @api {post} /api/v1/facilities/:facility_id/rules/reorder Reorder Rules
     * @apiName Reorder-Facility-Rules
     * @apiGroup Facility-Rules
     */
    public function reorder($facility_id)
    {
        $FacilityRule = new FacilityRule();

        $orders = $this->request->getJsonVar('orders');

        if (!is_array($orders)) {
            return $this->failValidationError('Invalid orders data');
        }

        foreach ($orders as $order) {
            if (isset($order['id']) && isset($order['sort_order'])) {
                // Verify rule belongs to this facility
                $rule = $FacilityRule->where('facility_id', $facility_id)
                                     ->where('id', $order['id'])
                                     ->first();
                if ($rule) {
                    $FacilityRule->update($order['id'], ['sort_order' => $order['sort_order']]);
                }
            }
        }

        return $this->successOutput(['message' => 'Rules reordered successfully']);
    }

    /**
     * Delete Facility Rule
     *
     * @api {delete} /api/v1/facilities/:facility_id/rules/:id Delete Rule
     * @apiName Delete-Facility-Rule
     * @apiGroup Facility-Rules
     */
    public function delete($facility_id, $id)
    {
        $FacilityRule = new FacilityRule();

        $rule = $FacilityRule->where('facility_id', $facility_id)->where('id', $id)->first();
        if (!$rule) {
            return $this->failNotFound('Rule not found');
        }

        $FacilityRule->delete($id);

        return $this->successOutput(['message' => 'Rule deleted successfully']);
    }
}
