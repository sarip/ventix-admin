<?php

namespace App\Models;

use CodeIgniter\Model;

class FacilityAmenity extends Model
{
    protected $DBGroup          = 'default';
    protected $table            = 'facility_amenities';
    protected $primaryKey       = 'id';
    protected $useAutoIncrement = true;
    protected $returnType       = 'object';
    protected $useSoftDeletes   = false;
    protected $protectFields    = true;
    protected $allowedFields    = ['name', 'icon', 'description', 'is_active'];

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
     * Get all active amenities
     */
    public function getActiveAmenities()
    {
        return $this->where('is_active', 1)->orderBy('name', 'ASC')->findAll();
    }

    /**
     * Get amenities for a specific facility
     */
    public function getFacilityAmenities($facilityId)
    {
        $db = \Config\Database::connect();

        return $db->table('facility_amenities fa')
                   ->join('facility_has_amenities fha', 'fa.id = fha.amenity_id')
                   ->where('fha.facility_id', $facilityId)
                   ->where('fa.is_active', 1)
                   ->orderBy('fa.name', 'ASC')
                   ->get()
                   ->getResultObject();
    }

    /**
     * Sync amenities for a facility (remove old, add new)
     */
    public function syncFacilityAmenities($facilityId, array $amenityIds)
    {
        $db = \Config\Database::connect();
        $builder = $db->table('facility_has_amenities');

        // Delete existing amenities
        $builder->where('facility_id', $facilityId)->delete();

        // Add new amenities
        if (!empty($amenityIds)) {
            $data = [];
            foreach ($amenityIds as $amenityId) {
                $data[] = [
                    'facility_id' => $facilityId,
                    'amenity_id' => $amenityId,
                    'created_at' => date('Y-m-d H:i:s')
                ];
            }
            $builder->insertBatch($data);
        }

        return true;
    }
}
