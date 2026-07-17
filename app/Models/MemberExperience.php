<?php

namespace App\Models;

use CodeIgniter\Model;

class MemberExperience extends Model
{
    protected $table = 'member_experiences';
    protected $primaryKey = 'id';
    protected $useAutoIncrement = true;
    protected $returnType = 'object';
    protected $useSoftDeletes = false;
    protected $protectFields = true;
    protected $allowedFields = [
        'user_id',
        'title',
        'description',
        'date',
        'type',
        'reference_id',
        'is_public',
    ];

    // Dates
    protected $useTimestamps = true;
    protected $dateFormat = 'datetime';
    protected $createdField = 'created_at';
    protected $updatedField = 'updated_at';

    /**
     * Get public experiences for a user
     */
    public function getPublicByUserId($user_id)
    {
        return $this->where(['user_id' => $user_id, 'is_public' => 1])
            ->orderBy('date', 'DESC')
            ->findAll();
    }
}
