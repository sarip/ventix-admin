<?php
/**
 * @author Sarip Hidayat <hidayatsarip2210@gmail.com>
 * @copyright Sarip Hidayat 2024
 */

namespace App\Controllers\Api;

use App\Filters\SearchFilter;
use App\Models\EventsOrganizer;
use App\Models\Facilitie;
use App\Models\FacilitiesOrganizer;
use App\Models\FacilityPricing;
use App\Models\FacilityAmenitie;
use App\Models\FacilityAmenity;
use App\Models\FacilityGallery;
use App\Models\FacilityHasAmenitie;
use App\Models\FacilityFeature;
use App\Models\FacilityOperatingHour;
use App\Models\FacilityRule;
use App\Models\User;
use App\Models\MemberFollow;
use App\Models\Notification;

class FacilitieController extends ApiController
{
    /**
     * List Facilities
     *
     * @api {get} /api/v1/facilities List Facilities
     * @apiName List-Facilitie
     * @apiGroup Facilitie
     * @apiVersion 1.0.0
     * @apiQuery {String} [search] Search by name, category, description
     * @apiQuery {String} [sort_by] Sort by column
     * @apiQuery {String} [per_page] Items per page
     * @apiQuery {String} [page] Page number
     */
    public function index()
    {
        $model = new Facilitie();

        $searchableColumns = [
            'search' => ['name', 'category', 'description', 'is_available'],
        ];

        $currentUser = $this->request->current_user;
        $whereEo = [];

        if ($currentUser['scope'] !== 'SUPERADMIN') {
            $foIds = $currentUser['fo_ids'] ?: [-1];
            $whereEo['group_or'] = ['facility_organizer_id' => $foIds];
        }

        $output = SearchFilter::execute($model, $searchableColumns, 'facilities', $whereEo);

        // Instantiate related models once (avoid N+1 in loop)
        $organizerModel = new FacilitiesOrganizer();
        $userModel = new User();
        $pricingModel = new FacilityPricing();

        array_walk($output['facilities'], function (&$item) use ($organizerModel, $userModel, $pricingModel) {
            $item->facility_organizer = $organizerModel->find($item->facility_organizer_id);
            $item->user_pic = $userModel->find($item->user_id_pic);
            $item->facility_pricing = $pricingModel->where('facility_id', $item->id)->findAll();


            $featureModel = new FacilityFeature();
            $item->facility_features = $featureModel->where('facility_id', $item->id)->orderBy('sort_order', 'ASC')->findAll();

            $galleryModel = new FacilityGallery();
            $item->facility_gallery = $galleryModel->where('facility_id', $item->id)->orderBy('sort_order', 'ASC')->findAll();

            $operatingHourModel = new FacilityOperatingHour();
            $item->facility_operating_hours = $operatingHourModel->where('facility_id', $item->id)->orderBy('day_of_week', 'ASC')->findAll();

            $ruleModel = new FacilityRule();
            $item->facility_rules = $ruleModel->where('facility_id', $item->id)->orderBy('sort_order', 'ASC')->findAll();

            $hasAmenityModel = new FacilityHasAmenitie();
            $item->facility_amenities = $hasAmenityModel->where('facility_id', $item->id)->findAll();

        });

        return $this->successOutput($output);
    }

    /**
     * Show Facility Detail
     *
     * @api {get} /api/v1/facilities/:id Show Facility Detail
     * @apiParam {Number} id Facility ID
     */
    public function detail($id)
    {
        $facilityModel = new Facilitie();
        $facility = $facilityModel->find($id);

        if (!$facility) {
            return $this->errorOutput('Facility not found', 404);
        }

        // Related data
        $facility->facility_organizer = (new FacilitiesOrganizer())->find($facility->facility_organizer_id);
        $facility->user_pic = (new User())->find($facility->user_id_pic);

        // Profiling data
        $facility->facility_gallery = (new FacilityGallery())
            ->where('facility_id', $id)
            ->orderBy('sort_order', 'ASC')
            ->findAll();

        $amenityRelations = (new FacilityHasAmenitie())
            ->where('facility_id', $id)
            ->findAll();

        $amenityIds = array_column($amenityRelations, 'amenity_id');
        $facility->facility_amenities = [];
        if (!empty($amenityIds)) {
            $facility->facility_amenities = (new FacilityAmenity())
                ->whereIn('id', $amenityIds)
                ->findAll();
        }

        $facility->facility_features = (new FacilityFeature())
            ->where('facility_id', $id)
            ->orderBy('sort_order', 'ASC')
            ->findAll();

        $facility->facility_operating_hours = (new FacilityOperatingHour())
            ->where('facility_id', $id)
            ->orderBy('day_of_week', 'ASC')
            ->findAll();

        $facility->facility_rules = (new FacilityRule())
            ->where('facility_id', $id)
            ->orderBy('sort_order', 'ASC')
            ->findAll();

        $facility->facility_pricing = (new FacilityPricing())
            ->where('facility_id', $id)
            ->findAll();

        return $this->successOutput(['facility' => $facility]);
    }

    /**
     * Create Facility (basic info only)
     *
     * @api {post} /api/v1/facilities Create Facility
     * @apiBody {Number} events_organizer_id Facility organizer ID
     * @apiBody {Number} user_id_pic PIC user ID
     * @apiBody {String} name Facility name
     * @apiBody {String} category Category
     * @apiBody {String} [description] Description
     * @apiBody {Number} [is_available=1] Availability
     */
    public function create()
    {
        $db = \Config\Database::connect();
        $db->transStart();

        try {
            $facilityModel = new Facilitie();
            $createData = [
                'facility_organizer_id' => $this->request->getJsonVar('events_organizer_id'),
                'user_id_pic' => $this->request->getJsonVar('user_id_pic'),
                'name' => $this->request->getJsonVar('name'),
                'category' => $this->request->getJsonVar('category'),
                'description' => $this->request->getJsonVar('description'),
                'is_available' => $this->request->getJsonVar('is_available') ?? 1,
            ];

            $facilityModel->insert($createData);
            $id = $facilityModel->getInsertID();

            // Notify followers
            $eoId = $createData['facility_organizer_id'];
            if ($eoId) {
                $eo = (new EventsOrganizer())->find($eoId);
                $eoName = $eo ? $eo->eo_name : 'Facility Organizer';

                $followers = (new MemberFollow())
                    ->where(['following_id' => $eoId, 'following_type' => 'EO'])
                    ->findAll();

                $notificationModel = new Notification();
                foreach ($followers as $follower) {
                    $notificationModel->insert([
                        'user_id' => $follower->follower_id,
                        'type' => 'FACILITY_NEW',
                        'entity_type' => 'FACILITY',
                        'entity_id' => $id,
                        'title' => 'Fasilitas Baru dari ' . $eoName,
                        'message' => 'Organizer yang Anda ikuti telah menambahkan fasilitas baru: ' . $createData['name'],
                        'metadata' => json_encode(['facility_id' => $id, 'eo_id' => $eoId]),
                        'is_read' => 0,
                        'sent_at' => date('Y-m-d H:i:s'),
                    ]);
                }
            }

            $db->transComplete();

            if ($db->transStatus() === false) {
                return $this->errorOutput('Failed to create facility', 500);
            }

            return $this->successOutput(['id' => $id], 201);

        } catch (\Exception $e) {
            $db->transRollback();
            log_message('error', 'Facility create error: ' . $e->getMessage());
            return $this->errorOutput('An error occurred: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Update Facility basic info
     *
     * @api {put} /api/v1/facilities/:id Update Facility
     * @apiParam {Number} id Facility ID
     */
    public function update($id)
    {
        $facilityModel = new Facilitie();

        if (!$facilityModel->find($id)) {
            return $this->errorOutput('Facility not found', 404);
        }

        $updateData = array_filter([
            'facility_organizer_id' => $this->request->getJsonVar('events_organizer_id'),
            'user_id_pic' => $this->request->getJsonVar('user_id_pic'),
            'name' => $this->request->getJsonVar('name'),
            'category' => $this->request->getJsonVar('category'),
            'description' => $this->request->getJsonVar('description'),
            'is_available' => $this->request->getJsonVar('is_available'),
        ], fn($v) => $v !== null);

        $facilityModel->update($id, $updateData);

        return $this->successOutput(['facility' => $facilityModel->find($id)]);
    }

    /**
     * Delete Facility
     *
     * @api {delete} /api/v1/facilities/:id Delete Facility
     * @apiParam {Number} id Facility ID
     */
    public function delete($id)
    {
        $facilityModel = new Facilitie();

        if (!$facilityModel->find($id)) {
            return $this->errorOutput('Facility not found', 404);
        }

        $facilityModel->delete($id);

        return $this->successOutput([], 200);
    }

    /**
     * Save Facility with All Profiling Data (multipart/form-data)
     *
     * On create: POST /api/v1/facilities  (id = null)
     * On update: PUT  /api/v1/facilities/:id
     *
     * @api {post|put} /api/v1/facilities Save Facility with Profiling
     * @apiParam  {Number}  [id]             Facility ID (for update)
     * @apiParam  {File}    [gallery_images[]] Gallery image files
     * @apiParam  {String}  [gallery_info]   Gallery metadata JSON
     * @apiParam  {String}  [amenities]      Amenity IDs JSON
     * @apiParam  {String}  [features]       Features JSON
     * @apiParam  {String}  [operating_hours] Operating hours JSON
     * @apiParam  {String}  [rules]          Rules JSON
     */
    public function saveComplete($id = null)
    {
        $db = \Config\Database::connect();
        $facilityModel = new Facilitie();
        $existingFacility = $id ? $facilityModel->find($id) : null;

        $db->transStart();
        try {
            $basicData = [
                'facility_organizer_id' => $this->request->getPost('facility_organizer_id'),
                'user_id_pic' => $this->request->getPost('user_id_pic'),
                'name' => $this->request->getPost('name'),
                'category' => $this->request->getPost('category'),
                'description' => $this->request->getPost('description'),
                'email' => $this->request->getPost('email'),
                'phone' => $this->request->getPost('phone'),
                'address' => $this->request->getPost('address'),
                'latitude' => $this->request->getPost('latitude'),
                'longitude' => $this->request->getPost('longitude'),
                'is_available' => $this->request->getPost('is_available') ?? '1',
            ];

            $bannerFile = $this->request->getFile('banner_image');
            if ($bannerFile && $bannerFile->isValid() && !$bannerFile->hasMoved()) {
                if ($bannerFile->getSize() > 5 * 1024 * 1024)
                    throw new \Exception('Banner image size must be less than 5MB');
                $allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
                if (!in_array($bannerFile->getClientMimeType(), $allowedTypes))
                    throw new \Exception('Banner image must be JPG, PNG, or WEBP format');

                $uploadPath = FCPATH . 'uploads/facility/';
                if (!is_dir($uploadPath))
                    mkdir($uploadPath, 0777, true);

                $newName = 'banner_' . $bannerFile->getRandomName();
                $bannerFile->move($uploadPath, $newName);

                if ($existingFacility && !empty($existingFacility->banner_image)) {
                    $oldPath = FCPATH . $existingFacility->banner_image;
                    if (file_exists($oldPath))
                        @unlink($oldPath);
                }
                $basicData['banner_image'] = 'uploads/facility/' . $newName;
            }

            $basicData = array_filter($basicData, fn($v) => $v !== null && $v !== '');

            if (empty($basicData['name']))
                throw new \Exception('Facility name is required');
            if (empty($basicData['facility_organizer_id']))
                throw new \Exception('Facility organizer is required');
            if (empty($basicData['user_id_pic']))
                throw new \Exception('PIC user is required');

            if (!(new FacilitiesOrganizer())->find($basicData['facility_organizer_id']))
                throw new \Exception('Facility organizer not found (ID: ' . $basicData['facility_organizer_id'] . ')');
            if (!(new User())->find($basicData['user_id_pic']))
                throw new \Exception('PIC user not found (ID: ' . $basicData['user_id_pic'] . ')');

            $slug = strtolower(preg_replace('/[^a-z0-9]+/i', '-', trim($basicData['name'])));
            $slug = trim($slug, '-');
            $exists = $facilityModel->where('slug', $slug)->where('id !=', (int) $id)->first();
            if ($exists)
                $slug .= '-' . substr(uniqid(), -4);
            $basicData['slug'] = $slug;

            if ($id) {
                if (!$existingFacility)
                    throw new \Exception('Facility not found', 404);
                $facilityModel->update($id, $basicData);
                $facilityId = (int) $id;
            } else {
                $facilityModel->insert($basicData);
                $facilityId = $facilityModel->getInsertID();
            }

            $galleryInfoJson = $this->request->getPost('gallery_info');
            if ($galleryInfoJson !== null) {
                $galleryData = json_decode($galleryInfoJson, true);
                if (json_last_error() !== JSON_ERROR_NONE)
                    throw new \Exception('Invalid JSON in gallery_info: ' . json_last_error_msg());
                $galleryData = $galleryData ?: [];
                $galleryModel = new FacilityGallery();

                // Step 1: Delete items marked for deletion
                foreach ($galleryData as $item) {
                    if (!empty($item['_isDeleted']) && !empty($item['id']))
                        $galleryModel->delete((int) $item['id']);
                }

                // Step 2: Handle new file uploads; track which existing IDs get a new image
                $uploadedItemIds = [];
                $files = $this->request->getFiles();
                $galleryImages = $files['gallery_images'] ?? [];
                if (!is_array($galleryImages))
                    $galleryImages = [$galleryImages];
                $uploadableItems = array_values(array_filter($galleryData, fn($item) => empty($item['_isDeleted'])));
                foreach ($galleryImages as $fileIndex => $file) {
                    if (!$file->isValid() || $file->hasMoved())
                        continue;
                    $uploadPath = FCPATH . 'uploads/facility/';
                    if (!is_dir($uploadPath))
                        mkdir($uploadPath, 0777, true);
                    $newName = $file->getRandomName();
                    $file->move($uploadPath, $newName);
                    $infoItem = $uploadableItems[$fileIndex] ?? null;
                    $data = [
                        'facility_id' => $facilityId,
                        'image' => 'uploads/facility/' . $newName,
                        'title' => $infoItem['title'] ?? null,
                        'description' => $infoItem['description'] ?? null,
                        'sort_order' => $infoItem['sort_order'] ?? 0,
                        'is_featured' => $infoItem['is_featured'] ?? false,
                    ];
                    if ($infoItem && !empty($infoItem['id'])) {
                        $galleryModel->update((int) $infoItem['id'], $data);
                        $uploadedItemIds[] = (int) $infoItem['id'];
                    } else {
                        $galleryModel->insert($data);
                    }
                }

                // Step 3: Update metadata for existing items that did NOT get a new file
                foreach ($galleryData as $item) {
                    if (
                        !empty($item['id']) && empty($item['_isDeleted']) && empty($item['_isNew'])
                        && !in_array((int) $item['id'], $uploadedItemIds)
                    ) {
                        $galleryModel->update((int) $item['id'], [
                            'title' => $item['title'] ?? null,
                            'description' => $item['description'] ?? null,
                            'sort_order' => $item['sort_order'] ?? 0,
                            'is_featured' => $item['is_featured'] ?? false,
                        ]);
                    }
                }
            }

            $amenitiesJson = $this->request->getPost('amenities');
            if ($amenitiesJson !== null) {
                $amenities = json_decode($amenitiesJson, true);
                $amenityModel = new FacilityHasAmenitie();
                $amenityModel->builder()->where('facility_id', $facilityId)->delete();
                foreach ($amenities as $amenity) {
                    if (empty($amenity['_isDeleted']) && !empty($amenity['id'])) {
                        $amenityModel->insert(['facility_id' => $facilityId, 'amenity_id' => (int) $amenity['id']]);
                    }
                }
            }

            $featuresJson = $this->request->getPost('features');
            if ($featuresJson !== null) {
                $features = json_decode($featuresJson, true);
                $featureModel = new FacilityFeature();
                foreach ($features as $feature) {
                    if (!empty($feature['_isDeleted']) && !empty($feature['id']))
                        $featureModel->delete((int) $feature['id']);
                    elseif (!empty($feature['_isNew']))
                        $featureModel->insert(['facility_id' => $facilityId, 'feature_name' => $feature['feature_name'], 'feature_value' => $feature['feature_value'], 'sort_order' => $feature['sort_order'] ?? 0]);
                    elseif (!empty($feature['id']))
                        $featureModel->update((int) $feature['id'], ['feature_name' => $feature['feature_name'], 'feature_value' => $feature['feature_value'], 'sort_order' => $feature['sort_order'] ?? 0]);
                }
            }

            $hoursJson = $this->request->getPost('operating_hours');
            if ($hoursJson !== null) {
                $hours = json_decode($hoursJson, true);
                $hourModel = new FacilityOperatingHour();
                $hourModel->builder()->where('facility_id', $facilityId)->delete();
                foreach ($hours as $hour) {
                    $hourModel->insert(['facility_id' => $facilityId, 'day_of_week' => $hour['day_of_week'], 'open_time' => $hour['open_time'] ?? null, 'close_time' => $hour['close_time'] ?? null, 'is_closed' => $hour['is_closed'] ?? false, 'is_holiday_schedule' => $hour['is_holiday_schedule'] ?? false]);
                }
            }

            $rulesJson = $this->request->getPost('rules');
            if ($rulesJson !== null) {
                $rules = json_decode($rulesJson, true);
                $ruleModel = new FacilityRule();
                foreach ($rules as $rule) {
                    if (!empty($rule['_isDeleted']) && !empty($rule['id']))
                        $ruleModel->delete((int) $rule['id']);
                    elseif (!empty($rule['_isNew']))
                        $ruleModel->insert(['facility_id' => $facilityId, 'rule_text' => $rule['rule_text'], 'sort_order' => $rule['sort_order'] ?? 0]);
                    elseif (!empty($rule['id']))
                        $ruleModel->update((int) $rule['id'], ['rule_text' => $rule['rule_text'], 'sort_order' => $rule['sort_order'] ?? 0]);
                }
            }

            if (!$id && !empty($basicData['facility_organizer_id'])) {
                $eo = (new EventsOrganizer())->find($basicData['facility_organizer_id']);
                $eoName = $eo ? $eo->eo_name : 'Facility Organizer';
                $followers = (new MemberFollow())->where(['following_id' => $basicData['facility_organizer_id'], 'following_type' => 'EO'])->findAll();
                $notificationModel = new Notification();
                foreach ($followers as $follower) {
                    $notificationModel->insert(['user_id' => $follower->follower_id, 'type' => 'FACILITY_NEW', 'entity_type' => 'FACILITY', 'entity_id' => $facilityId, 'title' => 'Fasilitas Baru dari ' . $eoName, 'message' => 'Organizer yang Anda ikuti telah menambahkan fasilitas baru: ' . $basicData['name'], 'metadata' => json_encode(['facility_id' => $facilityId, 'eo_id' => $basicData['facility_organizer_id']]), 'is_read' => 0, 'sent_at' => date('Y-m-d H:i:s')]);
                }
            }

            $db->transComplete();
            if ($db->transStatus() === false)
                throw new \Exception('Database transaction failed');
            return $this->successOutput(['facility' => $facilityModel->find($facilityId)], $id ? 200 : 201);
        } catch (\Exception $e) {
            $db->transRollback();
            return $this->errorOutput($e->getMessage(), (int) $e->getCode() ?: 500);
        }
    }
}
