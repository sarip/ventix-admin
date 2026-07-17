<?php

namespace App\Models;

use CodeIgniter\Model;

class MemberFollow extends Model
{
    protected $table = 'member_follows';
    protected $primaryKey = 'id';
    protected $useAutoIncrement = true;
    protected $returnType = 'object';
    protected $useSoftDeletes = false;
    protected $protectFields = true;
    protected $allowedFields = [
        'follower_id',
        'following_id',
        'following_type',
    ];

    // Dates
    protected $useTimestamps = true;
    protected $dateFormat = 'datetime';
    protected $createdField = 'created_at';
    protected $updatedField = 'updated_at';

    /**
     * Get following details
     */
    public function getFollowingDetails($follower_id)
    {
        return $this->where('follower_id', $follower_id)->findAll();
    }

    /**
     * Get followers details
     */
    public function getFollowersDetails($following_id, $following_type)
    {
        return $this->where([
            'following_id' => $following_id,
            'following_type' => $following_type
        ])->findAll();
    }
}
