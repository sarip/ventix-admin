<?php

namespace App\Controllers\Api;

use App\Models\FacilityAmenity;
use App\Models\Facilitie;

class FacilityAmenityController extends ApiController
{
    /**
     * List Master Amenities
     *
     * @api {get} /api/v1/amenities List Amenities
     * @apiName List-Amenities
     * @apiGroup Facility-Amenities
     */
    public function index()
    {
        $FacilityAmenity = new FacilityAmenity();

        $amenities = $FacilityAmenity->getActiveAmenities();

        return $this->successOutput(['amenities' => $amenities]);
    }

    /**
     * Get Facility Amenities
     *
     * @api {get} /api/v1/facilities/:facility_id/amenities Get Facility Amenities
     * @apiName Get-Facility-Amenities
     * @apiGroup Facility-Amenities
     */
    public function getFacilityAmenities($facility_id)
    {
        $Facilitie = new Facilitie();
        $FacilityAmenity = new FacilityAmenity();

        // Check if facility exists
        $facility = $Facilitie->find($facility_id);
        if (!$facility) {
            return $this->failNotFound('Facility not found');
        }

        $amenities = $FacilityAmenity->getFacilityAmenities($facility_id);

        return $this->successOutput(['amenities' => $amenities]);
    }

    /**
     * Create Amenity (Master)
     *
     * @api {post} /api/v1/amenities Create Amenity
     * @apiName Create-Amenity
     * @apiGroup Facility-Amenities
     */
    public function create()
    {
        $FacilityAmenity = new FacilityAmenity();

        $data = [
            'name' => $this->request->getJsonVar('name'),
            'icon' => $this->request->getJsonVar('icon'),
            'description' => $this->request->getJsonVar('description'),
            'is_active' => 1,
        ];

        $id = $FacilityAmenity->insert($data);

        return $this->successOutput(['id' => $id], 201);
    }

    /**
     * Update Amenity (Master)
     *
     * @api {put} /api/v1/amenities/:id Update Amenity
     * @apiName Update-Amenity
     * @apiGroup Facility-Amenities
     */
    public function update($id)
    {
        $FacilityAmenity = new FacilityAmenity();

        $amenity = $FacilityAmenity->find($id);
        if (!$amenity) {
            return $this->failNotFound('Amenity not found');
        }

        $data = [
            'name' => $this->request->getJsonVar('name'),
            'icon' => $this->request->getJsonVar('icon'),
            'description' => $this->request->getJsonVar('description'),
        ];

        // Filter null values
        $data = array_filter($data, function($value) {
            return $value !== null;
        });

        $FacilityAmenity->update($id, $data);

        return $this->successOutput(['amenity' => $FacilityAmenity->find($id)]);
    }

    /**
     * Sync Facility Amenities
     *
     * @api {post} /api/v1/facilities/:facility_id/amenities/sync Sync Amenities
     * @apiName Sync-Facility-Amenities
     * @apiGroup Facility-Amenities
     */
    public function sync($facility_id)
    {
        $Facilitie = new Facilitie();
        $FacilityAmenity = new FacilityAmenity();

        // Check if facility exists
        $facility = $Facilitie->find($facility_id);
        if (!$facility) {
            return $this->failNotFound('Facility not found');
        }

        $amenityIds = $this->request->getJsonVar('amenity_ids');

        if (!is_array($amenityIds)) {
            return $this->failValidationError('amenity_ids must be an array');
        }

        $FacilityAmenity->syncFacilityAmenities($facility_id, $amenityIds);

        return $this->successOutput(['message' => 'Amenities synced successfully']);
    }

    /**
     * Delete Amenity (Master)
     *
     * @api {delete} /api/v1/amenities/:id Delete Amenity
     * @apiName Delete-Amenity
     * @apiGroup Facility-Amenities
     */
    public function delete($id)
    {
        $FacilityAmenity = new FacilityAmenity();

        $amenity = $FacilityAmenity->find($id);
        if (!$amenity) {
            return $this->failNotFound('Amenity not found');
        }

        $FacilityAmenity->delete($id);

        return $this->successOutput(['message' => 'Amenity deleted successfully']);
    }
}
