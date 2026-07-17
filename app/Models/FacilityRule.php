<?php

namespace App\Models;

use CodeIgniter\Model;

class FacilityRule extends Model
{
    protected $DBGroup          = 'default';
    protected $table            = 'facility_rules';
    protected $primaryKey       = 'id';
    protected $useAutoIncrement = true;
    protected $returnType       = 'object';
    protected $useSoftDeletes   = false;
    protected $protectFields    = true;
    protected $allowedFields    = ['facility_id', 'rule_text', 'sort_order'];

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
     * Get all rules for a facility ordered by sort_order
     */
    public function getFacilityRules($facilityId)
    {
        return $this->where('facility_id', $facilityId)
                    ->orderBy('sort_order', 'ASC')
                    ->orderBy('id', 'ASC')
                    ->findAll();
    }

    /**
     * Update sort orders for rules
     */
    public function updateSortOrders(array $orders)
    {
        foreach ($orders as $id => $sortOrder) {
            $this->update($id, ['sort_order' => $sortOrder]);
        }
        return true;
    }
}
