<?php

namespace App\Models;

use CodeIgniter\Model;

class MemberRating extends Model
{
    protected $table = 'member_ratings';
    protected $primaryKey = 'id';
    protected $useAutoIncrement = true;
    protected $returnType = 'object';
    protected $useSoftDeletes = false;
    protected $protectFields = true;
    protected $allowedFields = [
        'user_id',
        'target_id',
        'target_type',
        'rating',
        'comment',
        'is_public',
    ];

    // Dates
    protected $useTimestamps = true;
    protected $dateFormat = 'datetime';
    protected $createdField = 'created_at';
    protected $updatedField = 'updated_at';

    /**
     * Get public ratings for a user
     */
    public function getPublicByUserId($user_id)
    {
        return $this->where(['user_id' => $user_id, 'is_public' => 1])
            ->orderBy('created_at', 'DESC')
            ->findAll();
    }
}
