<?php

namespace App\Controllers\Api;

use App\Models\FacilityStatistic;
use App\Models\Facilitie;

class FacilityStatisticController extends ApiController
{
    /**
     * Get Facility Statistics
     *
     * @api {get} /api/v1/facilities/:facility_id/statistics Get Statistics
     * @apiName Get-Facility-Statistics
     * @apiGroup Facility-Statistics
     */
    public function index($facility_id)
    {
        $FacilityStatistic = new FacilityStatistic();
        $Facilitie = new Facilitie();

        // Check if facility exists
        $facility = $Facilitie->find($facility_id);
        if (!$facility) {
            return $this->failNotFound('Facility not found');
        }

        $statistics = $FacilityStatistic->getFacilityStatistics($facility_id);

        // If no statistics exist, create initial record
        if (!$statistics) {
            $FacilityStatistic->calculateStatistics($facility_id);
            $statistics = $FacilityStatistic->getFacilityStatistics($facility_id);
        }

        return $this->successOutput(['statistics' => $statistics]);
    }

    /**
     * Calculate/Refresh Facility Statistics
     *
     * @api {post} /api/v1/facilities/:facility_id/statistics/calculate Calculate Statistics
     * @apiName Calculate-Facility-Statistics
     * @apiGroup Facility-Statistics
     */
    public function calculate($facility_id)
    {
        $Facilitie = new Facilitie();
        $FacilityStatistic = new FacilityStatistic();

        // Check if facility exists
        $facility = $Facilitie->find($facility_id);
        if (!$facility) {
            return $this->failNotFound('Facility not found');
        }

        $FacilityStatistic->calculateStatistics($facility_id);

        $statistics = $FacilityStatistic->getFacilityStatistics($facility_id);

        return $this->successOutput(['statistics' => $statistics]);
    }

    /**
     * Increment Counter (for realtime updates)
     *
     * @api {post} /api/v1/facilities/:facility_id/statistics/increment Increment Counter
     * @apiName Increment-Facility-Statistics
     * @apiGroup Facility-Statistics
     */
    public function increment($facility_id)
    {
        $Facilitie = new Facilitie();
        $FacilityStatistic = new FacilityStatistic();

        // Check if facility exists
        $facility = $Facilitie->find($facility_id);
        if (!$facility) {
            return $this->failNotFound('Facility not found');
        }

        $field = $this->request->getJsonVar('field');
        $amount = $this->request->getJsonVar('amount') ?? 1;

        // Valid fields
        $validFields = ['total_bookings', 'total_visitors', 'total_events', 'total_followers', 'total_reviews'];
        if (!in_array($field, $validFields)) {
            return $this->failValidationError('Invalid field. Valid fields: ' . implode(', ', $validFields));
        }

        $FacilityStatistic->incrementCounter($facility_id, $field, $amount);

        $statistics = $FacilityStatistic->getFacilityStatistics($facility_id);

        return $this->successOutput(['statistics' => $statistics]);
    }
}
