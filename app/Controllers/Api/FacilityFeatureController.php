<?php

namespace App\Controllers\Api;

use App\Models\FacilityFeature;
use App\Models\Facilitie;

class FacilityFeatureController extends ApiController
{
    /**
     * List Facility Features
     *
     * @api {get} /api/v1/facilities/:facility_id/features List Features
     * @apiName List-Facility-Features
     * @apiGroup Facility-Features
     */
    public function index($facility_id)
    {
        $FacilityFeature = new FacilityFeature();
        $Facilitie = new Facilitie();

        // Check if facility exists
        $facility = $Facilitie->find($facility_id);
        if (!$facility) {
            return $this->failNotFound('Facility not found');
        }

        $features = $FacilityFeature->getFacilityFeatures($facility_id);

        return $this->successOutput(['features' => $features]);
    }

    /**
     * Create Facility Feature
     *
     * @api {post} /api/v1/facilities/:facility_id/features Create Feature
     * @apiName Create-Facility-Feature
     * @apiGroup Facility-Features
     */
    public function create($facility_id)
    {
        $FacilityFeature = new FacilityFeature();
        $Facilitie = new Facilitie();

        // Check if facility exists
        $facility = $Facilitie->find($facility_id);
        if (!$facility) {
            return $this->failNotFound('Facility not found');
        }

        // Get current max sort_order
        $maxOrder = $FacilityFeature->selectMax('sort_order')
                                     ->where('facility_id', $facility_id)
                                     ->first();
        $nextOrder = $maxOrder ? $maxOrder->sort_order + 1 : 0;

        $data = [
            'facility_id' => $facility_id,
            'feature_name' => $this->request->getJsonVar('feature_name'),
            'feature_value' => $this->request->getJsonVar('feature_value'),
            'sort_order' => $this->request->getJsonVar('sort_order') ?? $nextOrder,
        ];

        $id = $FacilityFeature->insert($data);

        return $this->successOutput(['id' => $id], 201);
    }

    /**
     * Update Facility Feature
     *
     * @api {put} /api/v1/facilities/:facility_id/features/:id Update Feature
     * @apiName Update-Facility-Feature
     * @apiGroup Facility-Features
     */
    public function update($facility_id, $id)
    {
        $FacilityFeature = new FacilityFeature();

        $feature = $FacilityFeature->where('facility_id', $facility_id)->where('id', $id)->first();
        if (!$feature) {
            return $this->failNotFound('Feature not found');
        }

        $data = [
            'feature_name' => $this->request->getJsonVar('feature_name'),
            'feature_value' => $this->request->getJsonVar('feature_value'),
            'sort_order' => $this->request->getJsonVar('sort_order'),
        ];

        // Filter null values
        $data = array_filter($data, function($value) {
            return $value !== null;
        });

        $FacilityFeature->update($id, $data);

        return $this->successOutput(['feature' => $FacilityFeature->find($id)]);
    }

    /**
     * Reorder Features
     *
     * @api {post} /api/v1/facilities/:facility_id/features/reorder Reorder Features
     * @apiName Reorder-Facility-Features
     * @apiGroup Facility-Features
     */
    public function reorder($facility_id)
    {
        $FacilityFeature = new FacilityFeature();

        $orders = $this->request->getJsonVar('orders');

        if (!is_array($orders)) {
            return $this->failValidationError('Invalid orders data');
        }

        foreach ($orders as $order) {
            if (isset($order['id']) && isset($order['sort_order'])) {
                // Verify feature belongs to this facility
                $feature = $FacilityFeature->where('facility_id', $facility_id)
                                          ->where('id', $order['id'])
                                          ->first();
                if ($feature) {
                    $FacilityFeature->update($order['id'], ['sort_order' => $order['sort_order']]);
                }
            }
        }

        return $this->successOutput(['message' => 'Features reordered successfully']);
    }

    /**
     * Delete Facility Feature
     *
     * @api {delete} /api/v1/facilities/:facility_id/features/:id Delete Feature
     * @apiName Delete-Facility-Feature
     * @apiGroup Facility-Features
     */
    public function delete($facility_id, $id)
    {
        $FacilityFeature = new FacilityFeature();

        $feature = $FacilityFeature->where('facility_id', $facility_id)->where('id', $id)->first();
        if (!$feature) {
            return $this->failNotFound('Feature not found');
        }

        $FacilityFeature->delete($id);

        return $this->successOutput(['message' => 'Feature deleted successfully']);
    }
}
