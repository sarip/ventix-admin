<?php

namespace App\Models;

use CodeIgniter\Model;

class FacilityGallery extends Model
{
    protected $DBGroup          = 'default';
    protected $table            = 'facility_gallery';
    protected $primaryKey       = 'id';
    protected $useAutoIncrement = true;
    protected $returnType       = 'object';
    protected $useSoftDeletes   = false;
    protected $protectFields    = true;
    protected $allowedFields    = [
        'facility_id', 'image', 'title', 'description', 'sort_order', 'is_featured'
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
     * Get featured image for a facility
     */
    public function getFeaturedImage($facilityId)
    {
        return $this->where('facility_id', $facilityId)
                    ->where('is_featured', 1)
                    ->first();
    }

    /**
     * Get all images for a facility ordered by sort_order
     */
    public function getFacilityImages($facilityId)
    {
        return $this->where('facility_id', $facilityId)
                    ->orderBy('sort_order', 'ASC')
                    ->orderBy('id', 'ASC')
                    ->findAll();
    }

    /**
     * Set featured image (unset others first)
     */
    public function setFeatured($id)
    {
        $image = $this->find($id);
        if (!$image) {
            return false;
        }

        // Unset current featured
        $this->where('facility_id', $image->facility_id)
             ->where('is_featured', 1)
             ->set(['is_featured' => 0])
             ->update();

        // Set new featured
        return $this->update($id, ['is_featured' => 1]);
    }
}
