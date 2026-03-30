<?php

namespace App\Models;

use CodeIgniter\Model;

class CommissionRule extends Model
{
    protected $table = 'commission_rules';
    protected $primaryKey = 'id';
    protected $useAutoIncrement = true;
    protected $returnType = 'object';
    protected $useSoftDeletes = false;
    protected $protectFields = true;
    protected $allowedFields = [
        'module',
        'rule_key',
        'percentage',
        'fixed_amount',
        'is_active',
        'created_at',
        'updated_at'
    ];

    // Dates
    protected $useTimestamps = true;
    protected $dateFormat = 'datetime';
    protected $createdField = 'created_at';
    protected $updatedField = 'updated_at';

    /**
     * Get rules by module
     */
    public function getRulesByModule(string $module)
    {
        return $this->where('module', $module)
            ->where('is_active', 1)
            ->findAll();
    }
}
