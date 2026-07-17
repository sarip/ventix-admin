<?php

namespace App\Controllers\Api;

use App\Models\FacilityOperatingHour;
use App\Models\Facilitie;

class FacilityOperatingHourController extends ApiController
{
    /**
     * List Facility Operating Hours
     *
     * @api {get} /api/v1/facilities/:facility_id/operating-hours List Operating Hours
     * @apiName List-Facility-Operating-Hours
     * @apiGroup Facility-Operating-Hours
     */
    public function index($facility_id)
    {
        $FacilityOperatingHour = new FacilityOperatingHour();
        $Facilitie = new Facilitie();

        // Check if facility exists
        $facility = $Facilitie->find($facility_id);
        if (!$facility) {
            return $this->failNotFound('Facility not found');
        }

        $hours = $FacilityOperatingHour->getFacilityHours($facility_id);

        return $this->successOutput(['operating_hours' => $hours]);
    }

    /**
     * Create Operating Hour
     *
     * @api {post} /api/v1/facilities/:facility_id/operating-hours Create Operating Hour
     * @apiName Create-Facility-Operating-Hour
     * @apiGroup Facility-Operating-Hours
     */
    public function create($facility_id)
    {
        $FacilityOperatingHour = new FacilityOperatingHour();
        $Facilitie = new Facilitie();

        // Check if facility exists
        $facility = $Facilitie->find($facility_id);
        if (!$facility) {
            return $this->failNotFound('Facility not found');
        }

        $data = [
            'facility_id' => $facility_id,
            'day_of_week' => $this->request->getJsonVar('day_of_week'),
            'open_time' => $this->request->getJsonVar('open_time'),
            'close_time' => $this->request->getJsonVar('close_time'),
            'is_closed' => $this->request->getJsonVar('is_closed') ?? 0,
            'is_holiday_schedule' => $this->request->getJsonVar('is_holiday_schedule') ?? 0,
        ];

        // Validate day_of_week
        if ($data['day_of_week'] < 1 || $data['day_of_week'] > 7) {
            return $this->failValidationError('day_of_week must be between 1 (Monday) and 7 (Sunday)');
        }

        $id = $FacilityOperatingHour->insert($data);

        return $this->successOutput(['id' => $id], 201);
    }

    /**
     * Update Operating Hour
     *
     * @api {put} /api/v1/facilities/:facility_id/operating-hours/:id Update Operating Hour
     * @apiName Update-Facility-Operating-Hour
     * @apiGroup Facility-Operating-Hours
     */
    public function update($facility_id, $id)
    {
        $FacilityOperatingHour = new FacilityOperatingHour();

        $hour = $FacilityOperatingHour->where('facility_id', $facility_id)->where('id', $id)->first();
        if (!$hour) {
            return $this->failNotFound('Operating hour not found');
        }

        $data = [
            'open_time' => $this->request->getJsonVar('open_time'),
            'close_time' => $this->request->getJsonVar('close_time'),
            'is_closed' => $this->request->getJsonVar('is_closed'),
        ];

        // Filter null values
        $data = array_filter($data, function($value) {
            return $value !== null;
        });

        $FacilityOperatingHour->update($id, $data);

        return $this->successOutput(['operating_hour' => $FacilityOperatingHour->find($id)]);
    }

    /**
     * Sync Weekly Operating Hours
     *
     * @api {post} /api/v1/facilities/:facility_id/operating-hours/sync Sync Weekly Hours
     * @apiName Sync-Facility-Operating-Hours
     * @apiGroup Facility-Operating-Hours
     */
    public function sync($facility_id)
    {
        $Facilitie = new Facilitie();
        $FacilityOperatingHour = new FacilityOperatingHour();

        // Check if facility exists
        $facility = $Facilitie->find($facility_id);
        if (!$facility) {
            return $this->failNotFound('Facility not found');
        }

        $hoursData = $this->request->getJsonVar('hours');

        if (!is_array($hoursData)) {
            return $this->failValidationError('hours must be an array');
        }

        // Validate each day
        foreach ($hoursData as $day => $hours) {
            if (!is_numeric($day) || $day < 1 || $day > 7) {
                return $this->failValidationError('Invalid day_of_week: ' . $day);
            }
        }

        $FacilityOperatingHour->syncWeeklyHours($facility_id, $hoursData);

        return $this->successOutput(['message' => 'Operating hours synced successfully']);
    }

    /**
     * Copy Operating Hours
     *
     * @api {post} /api/v1/facilities/:facility_id/operating-hours/copy Copy Hours
     * @apiName Copy-Facility-Operating-Hours
     * @apiGroup Facility-Operating-Hours
     */
    public function copy($facility_id)
    {
        $FacilityOperatingHour = new FacilityOperatingHour();

        $fromDay = $this->request->getJsonVar('from_day');
        $toDays = $this->request->getJsonVar('to_days');

        if (!$fromDay || !is_array($toDays) || empty($toDays)) {
            return $this->failValidationError('from_day and to_days are required');
        }

        // Validate day
        if ($fromDay < 1 || $fromDay > 7) {
            return $this->failValidationError('Invalid from_day');
        }

        foreach ($toDays as $day) {
            if ($day < 1 || $day > 7) {
                return $this->failValidationError('Invalid day in to_days');
            }
        }

        $FacilityOperatingHour->copyHours($facility_id, $fromDay, $toDays);

        return $this->successOutput(['message' => 'Operating hours copied successfully']);
    }

    /**
     * Delete Operating Hour
     *
     * @api {delete} /api/v1/facilities/:facility_id/operating-hours/:id Delete Operating Hour
     * @apiName Delete-Facility-Operating-Hour
     * @apiGroup Facility-Operating-Hours
     */
    public function delete($facility_id, $id)
    {
        $FacilityOperatingHour = new FacilityOperatingHour();

        $hour = $FacilityOperatingHour->where('facility_id', $facility_id)->where('id', $id)->first();
        if (!$hour) {
            return $this->failNotFound('Operating hour not found');
        }

        $FacilityOperatingHour->delete($id);

        return $this->successOutput(['message' => 'Operating hour deleted successfully']);
    }
}
