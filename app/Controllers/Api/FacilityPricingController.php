<?php
/**
 * @author Sarip Hidayat <hidayatsarip2210@gmail.com>
 * @copyright Sarip Hidayat 2024
 * @date 2026-01-16
 */


namespace App\Controllers\Api;

use App\Filters\SearchFilter;
use App\Models\FacilityPricing;

class FacilityPricingController extends ApiController
{

    /**
     * List FacilityPricing Controller
     * @author Sarip Hidayat <hidayatsarip2210@gmail.com>
     * @return mixed|void
     *
     * @api {get} /api/v1/facility_pricing List FacilityPricing
     * @apiName List-FacilityPricing
     * @apiGroup FacilityPricing
     * @apiVersion 1.0.0
     * @apiHeader {String} key Token
     * @apiSuccess {Object[]} data List of FacilityPricing
     * @apiQuery {String} search Search
     * @apiQuery {String} filter Filter by column with value
     * @apiQuery {String} sort_by Sort by column
     * @apiQuery {String} fields Select column
     * @apiQuery {String} per_page Per page
     * @apiQuery {String} page Page
     *
     */
    public function index()
    {
        $Model = new FacilityPricing();

        // Define searchable column on this model
        $searchable_column = [
            'search' => ['facility_id'],
        ];

        // Execute search filter
        $output = SearchFilter::execute($Model, $searchable_column, 'facility_pricing', []);

        // Return output
        return $this->successOutput($output);
    }

    /**
     * Create FacilityPricing
     *
     * @author Sarip Hidayat <hidayatsarip2210@gmail.com>
     * @return mixed
     * @throws \ReflectionException
     *
     * @api {post} /api/v1/facilitypricing Create FacilityPricing
     * @apiName Create-FacilityPricing
     * @apiGroup FacilityPricing
     * @apiVersion 1.0.0
     * @apiHeader {String} key Token
     * @apiBody {String} facility_id facility_id
     * @apiBody {String} day_type day_type
     * @apiBody {String} start_time start_time
     * @apiBody {String} end_time end_time
     * @apiBody {String} price_per_hour price_per_hour

     *
     */
    public function create()
    {
        $FacilityPricing = new FacilityPricing();
        $create_data = [
            'facility_id' => $this->request->getJsonVar('facility_id'),
            'day_type' => $this->request->getJsonVar('day_type'),
            'start_time' => $this->request->getJsonVar('start_time'),
            'end_time' => $this->request->getJsonVar('end_time'),
            'price_per_hour' => $this->request->getJsonVar('price_per_hour')
        ];

        $id = $FacilityPricing->insert($create_data);

        return $this->successOutput(['id' => $id], 201);
    }


    /**
     * Update FacilityPricing
     * @param $id
     * @return mixed
     * @throws \ReflectionException
     *
     * @api {put} /api/v1/facilitypricing/:id Update FacilityPricing
     * @apiName Update-FacilityPricing
     * @apiGroup FacilityPricing
     * @apiVersion 1.0.0
     * @apiHeader {String} key Token
     * @apiParam {Number} id FacilityPricing id
     * @apiBody {String} facility_id facility_id
     * @apiBody {String} day_type day_type
     * @apiBody {String} start_time start_time
     * @apiBody {String} end_time end_time
     * @apiBody {String} price_per_hour price_per_hour

     *
     */
    public function update($id)
    {
        $FacilityPricing = new FacilityPricing();
        $update_data = [
            'facility_id' => $this->request->getJsonVar('facility_id'),
            'day_type' => $this->request->getJsonVar('day_type'),
            'start_time' => $this->request->getJsonVar('start_time'),
            'end_time' => $this->request->getJsonVar('end_time'),
            'price_per_hour' => $this->request->getJsonVar('price_per_hour')
        ];

        $FacilityPricing->update($id, $update_data);

        $data = $FacilityPricing->find($id);

        return $this->successOutput(['facilitypricing' => $data]);
    }


    /**
     * Delete FacilityPricing
     *
     * @param $id
     * @return mixed
     *
     * @api {delete} /api/v1/facilitypricing/:id Delete FacilityPricing
     * @apiName Delete-FacilityPricing
     * @apiGroup FacilityPricing
     * @apiVersion 1.0.0
     * @apiHeader {String} key Token
     * @apiParam {Number} id FacilityPricing id
     */
    public function delete($id)
    {
        $FacilityPricing = new FacilityPricing();
        $FacilityPricing->delete($id);

        return $this->successOutput([], 200);
    }

    /**
     * Check Overlap
     * Check if pricing time range overlaps with existing rules
     *
     * @return mixed
     *
     * @api {post} /api/v1/facility_pricing/check_overlap Check Pricing Overlap
     * @apiName Check-Pricing-Overlap
     * @apiGroup FacilityPricing
     * @apiVersion 1.0.0
     * @apiHeader {String} key Token
     * @apiBody {Number} facility_id Facility ID
     * @apiBody {String} day_type Day type (Weekday/Weekend/Holiday)
     * @apiBody {String} start_time Start time
     * @apiBody {String} end_time End time
     * @apiBody {Number} [id] Pricing ID (for update, exclude self)
     */
    public function checkOverlap()
    {
        $FacilityPricing = new FacilityPricing();

        $facility_id = $this->request->getJsonVar('facility_id');
        $day_type = $this->request->getJsonVar('day_type');
        $start_time = $this->request->getJsonVar('start_time');
        $end_time = $this->request->getJsonVar('end_time');
        $exclude_id = $this->request->getJsonVar('id');

        // Build query to check for overlaps
        $builder = $FacilityPricing->where('facility_id', $facility_id)
            ->where('day_type', $day_type)
            ->groupStart()
            ->groupStart()
            ->where('start_time <=', $start_time)
            ->where('end_time >', $start_time)
            ->groupEnd()
            ->orGroupStart()
            ->where('start_time <', $end_time)
            ->where('end_time >=', $end_time)
            ->groupEnd()
            ->orGroupStart()
            ->where('start_time >=', $start_time)
            ->where('end_time <=', $end_time)
            ->groupEnd()
            ->groupEnd();

        // Exclude current pricing when updating
        if ($exclude_id) {
            $builder->where('id !=', $exclude_id);
        }

        $has_overlap = $builder->countAllResults() > 0;

        return $this->successOutput(['has_overlap' => $has_overlap]);
    }
}
