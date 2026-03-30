<?php

namespace App\Models;

use CodeIgniter\Model;

class OrderCommission extends Model
{
    protected $table = 'order_commissions';
    protected $primaryKey = 'id';
    protected $useAutoIncrement = true;
    protected $returnType = 'object';
    protected $useSoftDeletes = false;
    protected $protectFields = true;
    protected $allowedFields = [
        'order_id',
        'module',
        'rule_key',
        'base_amount',
        'calculated_amount',
        'created_at'
    ];

    // Dates
    protected $useTimestamps = true;
    protected $dateFormat = 'datetime';
    protected $createdField = 'created_at';
    protected $updatedField = '';

    /**
     * Get commissions by order id
     */
    public function getByOrderId(int $orderId)
    {
        return $this->where('order_id', $orderId)->findAll();
    }
}
