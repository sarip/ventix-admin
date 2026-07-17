<?php

namespace App\Models;

use CodeIgniter\Model;

class FacilityOperatingHour extends Model
{
    protected $DBGroup          = 'default';
    protected $table            = 'facility_operating_hours';
    protected $primaryKey       = 'id';
    protected $useAutoIncrement = true;
    protected $returnType       = 'object';
    protected $useSoftDeletes   = false;
    protected $protectFields    = true;
    protected $allowedFields    = [
        'facility_id', 'day_of_week', 'open_time', 'close_time', 'is_closed', 'is_holiday_schedule'
    ];

    protected $useTimestamps = true;
    protected $dateFormat    = 'datetime';
    protected $createdField  = 'created_at';
    protected $updatedField  = 'updated_at';

    protected $validationRules      = [];
    protected $validationMessages   = [];
    protected $skipValidation       = false;
    protected $cleanValidationRules = true;

    protected $allowCallbacks = true;
    protected $beforeInsert   = [];
    protected $beforeUpdate   = [];
    protected $beforeFind     = [];
    protected $afterFind      = [];
    protected $beforeDelete   = [];
    protected $afterInsert    = [];
    protected $afterUpdate    = [];
    protected $afterDelete    = [];

    /**
     * Get all operating hours for a facility
     */
    public function getFacilityHours($facilityId)
    {
        return $this->where('facility_id', $facilityId)
                    ->where('is_holiday_schedule', 0)
                    ->orderBy('day_of_week', 'ASC')
                    ->findAll();
    }

    /**
     * Get operating hours for a specific day
     */
    public function getDayHours($facilityId, $dayOfWeek)
    {
        return $this->where('facility_id', $facilityId)
                    ->where('day_of_week', $dayOfWeek)
                    ->where('is_holiday_schedule', 0)
                    ->first();
    }

    /**
     * Sync weekly operating hours for a facility
     */
    public function syncWeeklyHours($facilityId, array $hoursData)
    {
        // Delete existing non-holiday hours
        $this->where('facility_id', $facilityId)
             ->where('is_holiday_schedule', 0)
             ->delete();

        // Insert new hours
        if (!empty($hoursData)) {
            $data = [];
            foreach ($hoursData as $day => $hours) {
                $data[] = [
                    'facility_id' => $facilityId,
                    'day_of_week' => $day,
                    'open_time' => $hours['open_time'] ?? null,
                    'close_time' => $hours['close_time'] ?? null,
                    'is_closed' => $hours['is_closed'] ?? 0,
                    'is_holiday_schedule' => 0,
                    'created_at' => date('Y-m-d H:i:s')
                ];
            }
            $this->insertBatch($data);
        }

        return true;
    }

    /**
     * Copy hours from one day to other days
     */
    public function copyHours($facilityId, $fromDay, array $toDays)
    {
        $sourceHours = $this->getDayHours($facilityId, $fromDay);

        if (!$sourceHours) {
            return false;
        }

        foreach ($toDays as $toDay) {
            $existing = $this->getDayHours($facilityId, $toDay);

            $data = [
                'facility_id' => $facilityId,
                'day_of_week' => $toDay,
                'open_time' => $sourceHours->open_time,
                'close_time' => $sourceHours->close_time,
                'is_closed' => $sourceHours->is_closed,
                'is_holiday_schedule' => 0,
            ];

            if ($existing) {
                $this->update($existing->id, $data);
            } else {
                $this->insert($data);
            }
        }

        return true;
    }
}
