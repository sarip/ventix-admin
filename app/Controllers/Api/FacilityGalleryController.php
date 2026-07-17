<?php

namespace App\Controllers\Api;

use App\Models\FacilityGallery;
use App\Models\Facilitie;

class FacilityGalleryController extends ApiController
{
    /**
     * List Facility Gallery
     *
     * @api {get} /api/v1/facilities/:facility_id/gallery List Gallery
     * @apiName List-Facility-Gallery
     * @apiGroup Facility-Gallery
     */
    public function index($facility_id)
    {
        $FacilityGallery = new FacilityGallery();
        $Facilitie = new Facilitie();

        // Check if facility exists
        $facility = $Facilitie->find($facility_id);
        if (!$facility) {
            return $this->failNotFound('Facility not found');
        }

        $images = $FacilityGallery->getFacilityImages($facility_id);

        return $this->successOutput(['gallery' => $images]);
    }

    /**
     * Create Gallery Image
     *
     * @api {post} /api/v1/facilities/:facility_id/gallery Create Gallery Image
     * @apiName Create-Facility-Gallery
     * @apiGroup Facility-Gallery
     */
    public function create($facility_id)
    {
        $FacilityGallery = new FacilityGallery();
        $Facilitie = new Facilitie();

        // Check if facility exists
        $facility = $Facilitie->find($facility_id);
        if (!$facility) {
            return $this->failNotFound('Facility not found');
        }

        // Check if max 50 images reached
        $count = $FacilityGallery->where('facility_id', $facility_id)->countAllResults();
        if ($count >= 50) {
            return $this->failValidationError('Maximum 50 images allowed');
        }

        // Handle file upload
        $image = $this->request->getFile('image');
        if (!$image || !$image->isValid()) {
            return $this->failValidationError('Invalid image file');
        }

        // Validate file size (max 10MB)
        if ($image->getSizeByUnit('mb') > 10) {
            return $this->failValidationError('Maximum file size is 10MB');
        }

        // Validate file extension
        $allowedExt = ['jpg', 'jpeg', 'png', 'webp'];
        $ext = $image->getClientExtension();
        if (!in_array(strtolower($ext), $allowedExt)) {
            return $this->failValidationError('Allowed file types: jpg, jpeg, png, webp');
        }

        // Generate unique filename
        $newName = $image->getRandomName();
        $image->move(WRITEPATH . 'uploads/facility_gallery', $newName);

        $data = [
            'facility_id' => $facility_id,
            'image' => 'facility_gallery/' . $newName,
            'title' => $this->request->getPost('title'),
            'description' => $this->request->getPost('description'),
            'sort_order' => $this->request->getPost('sort_order') ?? $count,
            'is_featured' => $this->request->getPost('is_featured') ?? 0,
        ];

        $id = $FacilityGallery->insert($data);

        return $this->successOutput(['id' => $id], 201);
    }

    /**
     * Update Gallery Image
     *
     * @api {put} /api/v1/facilities/:facility_id/gallery/:id Update Gallery Image
     * @apiName Update-Facility-Gallery
     * @apiGroup Facility-Gallery
     */
    public function update($facility_id, $id)
    {
        $FacilityGallery = new FacilityGallery();

        $image = $FacilityGallery->where('facility_id', $facility_id)->where('id', $id)->first();
        if (!$image) {
            return $this->failNotFound('Gallery image not found');
        }

        $data = [
            'title' => $this->request->getJsonVar('title'),
            'description' => $this->request->getJsonVar('description'),
            'sort_order' => $this->request->getJsonVar('sort_order'),
        ];

        // Filter null values
        $data = array_filter($data, function($value) {
            return $value !== null;
        });

        $FacilityGallery->update($id, $data);

        return $this->successOutput(['gallery' => $FacilityGallery->find($id)]);
    }

    /**
     * Set Featured Image
     *
     * @api {put} /api/v1/facilities/:facility_id/gallery/:id/featured Set Featured
     * @apiName Set-Featured-Image
     * @apiGroup Facility-Gallery
     */
    public function setFeatured($facility_id, $id)
    {
        $FacilityGallery = new FacilityGallery();

        $image = $FacilityGallery->where('facility_id', $facility_id)->where('id', $id)->first();
        if (!$image) {
            return $this->failNotFound('Gallery image not found');
        }

        $FacilityGallery->setFeatured($id);

        return $this->successOutput(['message' => 'Featured image set successfully']);
    }

    /**
     * Reorder Images
     *
     * @api {post} /api/v1/facilities/:facility_id/gallery/reorder Reorder Images
     * @apiName Reorder-Gallery-Images
     * @apiGroup Facility-Gallery
     */
    public function reorder($facility_id)
    {
        $FacilityGallery = new FacilityGallery();

        $orders = $this->request->getJsonVar('orders');

        if (!is_array($orders)) {
            return $this->failValidationError('Invalid orders data');
        }

        foreach ($orders as $order) {
            if (isset($order['id']) && isset($order['sort_order'])) {
                $FacilityGallery->update($order['id'], ['sort_order' => $order['sort_order']]);
            }
        }

        return $this->successOutput(['message' => 'Images reordered successfully']);
    }

    /**
     * Delete Gallery Image
     *
     * @api {delete} /api/v1/facilities/:facility_id/gallery/:id Delete Gallery Image
     * @apiName Delete-Facility-Gallery
     * @apiGroup Facility-Gallery
     */
    public function delete($facility_id, $id)
    {
        $FacilityGallery = new FacilityGallery();

        $image = $FacilityGallery->where('facility_id', $facility_id)->where('id', $id)->first();
        if (!$image) {
            return $this->failNotFound('Gallery image not found');
        }

        // Delete file
        $filePath = WRITEPATH . 'uploads/' . $image->image;
        if (file_exists($filePath)) {
            unlink($filePath);
        }

        $FacilityGallery->delete($id);

        return $this->successOutput(['message' => 'Gallery image deleted successfully']);
    }
}
