<?php

namespace App\Models;

use CodeIgniter\Model;

class FacilityFeature extends Model
{
    protected $DBGroup          = 'default';
    protected $table            = 'facility_features';
    protected $primaryKey       = 'id';
    protected $useAutoIncrement = true;
    protected $returnType       = 'object';
    protected $useSoftDeletes   = false;
    protected $protectFields    = true;
    protected $allowedFields    = [
        'facility_id', 'feature_name', 'feature_value', 'sort_order'
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
     * Get all features for a facility ordered by sort_order
     */
    public function getFacilityFeatures($facilityId)
    {
        return $this->where('facility_id', $facilityId)
                    ->orderBy('sort_order', 'ASC')
                    ->orderBy('id', 'ASC')
                    ->findAll();
    }

    /**
     * Update sort orders for features
     */
    public function updateSortOrders(array $orders)
    {
        foreach ($orders as $id => $sortOrder) {
            $this->update($id, ['sort_order' => $sortOrder]);
        }
        return true;
    }
}
