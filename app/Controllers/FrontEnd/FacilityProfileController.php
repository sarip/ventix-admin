<?php
/**
 * @author Sarip Hidayat <hidayatsarip2210@gmail.com>
 * @copyright Sarip Hidayat 2024
 * @date 2026-07-06
 */

namespace App\Controllers\FrontEnd;

use App\Controllers\Api\ApiController;
use App\Models\Facilitie;
use App\Models\FacilityGallery;
use App\Models\FacilityAmenity;
use App\Models\FacilityFeature;
use App\Models\FacilityOperatingHour;
use App\Models\FacilityRule;
use App\Models\FacilityStatistic;
use App\Models\FacilityPricing;
use App\Models\EventsOrganizer;
use App\Models\User;
use App\Models\MemberFollow;
use App\Models\MemberRating;
use App\Models\FacilityBooking;
use Config\Services;

class FacilityProfileController extends ApiController
{
    protected $facilityModel;
    protected $galleryModel;
    protected $amenityModel;
    protected $featureModel;
    protected $operatingHourModel;
    protected $ruleModel;
    protected $statisticModel;
    protected $pricingModel;
    protected $followModel;
    protected $ratingModel;
    protected $bookingModel;

    public function __construct()
    {
        $this->facilityModel = new Facilitie();
        $this->galleryModel = new FacilityGallery();
        $this->amenityModel = new FacilityAmenity();
        $this->featureModel = new FacilityFeature();
        $this->operatingHourModel = new FacilityOperatingHour();
        $this->ruleModel = new FacilityRule();
        $this->statisticModel = new FacilityStatistic();
        $this->pricingModel = new FacilityPricing();
        $this->followModel = new MemberFollow();
        $this->ratingModel = new MemberRating();
        $this->bookingModel = new FacilityBooking();
    }

    /**
     * Find facility by slug or ID
     *
     * @param string $slug
     * @return object|null
     */
    protected function findFacility($slug)
    {
        // First try to find by slug if it's numeric
        if (is_numeric($slug)) {
            return $this->facilityModel->find($slug);
        }

        // Try to find by slug field (if exists)
        $facility = $this->facilityModel->where('slug', $slug)->first();

        // If no slug field exists, fall back to ID
        if (!$facility && is_numeric($slug)) {
            return $this->facilityModel->find($slug);
        }

        return $facility;
    }

    /**
     * Get complete facility profile
     *
     * @api {get} /facilities/profile/{slug} Get complete facility profile
     * @apiName Get-Facility-Profile
     * @apiGroup Facility-Profile
     * @apiVersion 1.0.0
     * @apiHeader {String} key Token
     * @apiParam {String} slug Facility slug or ID
     * @apiSuccess {Object} data Complete facility profile with all details
     */
    public function show($slug)
    {
        $facility = $this->findFacility($slug);

        if (!$facility) {
            return $this->errorOutput("Facility not found", 404);
        }

        // Get facility organizer
        $eventOrganizer = new EventsOrganizer();
        $facility->event_organizer = $eventOrganizer->find($facility->facility_organizer_id);

        // Get user PIC
        $user = new User();
        $facility->user_pic = $user->find($facility->user_id_pic);

        // Get gallery images
        $facility->gallery = $this->galleryModel->getFacilityImages($facility->id);
        $facility->featured_image = $this->galleryModel->getFeaturedImage($facility->id);

        // Get amenities
        $facility->amenities = $this->amenityModel->getFacilityAmenities($facility->id);

        // Get features
        $facility->features = $this->featureModel->where('facility_id', $facility->id)
            ->orderBy('sort_order', 'ASC')
            ->findAll();

        // Get operating hours
        $facility->operating_hours = $this->operatingHourModel->where('facility_id', $facility->id)
            ->orderBy('day_of_week', 'ASC')
            ->findAll();

        // Get rules
        $facility->rules = $this->ruleModel->where('facility_id', $facility->id)
            ->orderBy('sort_order', 'ASC')
            ->findAll();

        // Get pricing
        $facility->pricing = $this->pricingModel->where('facility_id', $facility->id)
            ->orderBy('day_type', 'ASC')
            ->orderBy('start_time', 'ASC')
            ->findAll();

        // Get statistics
        $facility->statistics = $this->statisticModel->getFacilityStatistics($facility->id);

        // Get current user's follow status
        $current_user = Services::request()->current_user ?? null;
        $facility->is_following = false;
        if ($current_user) {
            $follow = $this->followModel->where([
                'follower_id' => $current_user['id'],
                'following_id' => $facility->id,
                'following_type' => 'FACILITY'
            ])->first();
            $facility->is_following = !empty($follow);
        }

        return $this->successOutput(['data' => $facility]);
    }

    /**
     * Get facility reviews
     *
     * @api {get} /facilities/profile/{slug}/reviews Get facility reviews
     * @apiName Get-Facility-Reviews
     * @apiGroup Facility-Profile
     * @apiVersion 1.0.0
     * @apiHeader {String} key Token
     * @apiParam {String} slug Facility slug or ID
     * @apiSuccess {Object[]} data List of reviews
     */
    public function reviews($slug)
    {
        $facility = $this->findFacility($slug);

        if (!$facility) {
            return $this->errorOutput("Facility not found", 404);
        }

        $reviews = $this->ratingModel->where([
            'target_id' => $facility->id,
            'target_type' => 'FACILITY',
            'is_public' => 1
        ])->orderBy('created_at', 'DESC')
          ->findAll();

        // Enrich reviews with user data
        foreach ($reviews as &$review) {
            $user = new User();
            $review->user = $user->find($review->user_id);

            // Remove sensitive data
            if ($review->user) {
                unset($review->user->password);
                unset($review->user->token);
            }
        }

        return $this->successOutput(['data' => $reviews]);
    }

    /**
     * Get related facilities
     *
     * @api {get} /facilities/profile/{slug}/related Get related facilities
     * @apiName Get-Related-Facilities
     * @apiGroup Facility-Profile
     * @apiVersion 1.0.0
     * @apiHeader {String} key Token
     * @apiParam {String} slug Facility slug or ID
     * @apiSuccess {Object[]} data List of related facilities
     */
    public function related($slug)
    {
        $facility = $this->findFacility($slug);

        if (!$facility) {
            return $this->errorOutput("Facility not found", 404);
        }

        // Get related facilities by same category
        $related = $this->facilityModel->where('category', $facility->category)
            ->where('id !=', $facility->id)
            ->where('is_available', 1)
            ->limit(6)
            ->findAll();

        // Enrich related facilities
        foreach ($related as &$item) {
            $eventOrganizer = new EventsOrganizer();
            $item->event_organizer = $eventOrganizer->find($item->facility_organizer_id);

            $user = new User();
            $item->user_pic = $user->find($item->user_id_pic);

            $item->featured_image = $this->galleryModel->getFeaturedImage($item->id);

            // Get statistics
            $item->statistics = $this->statisticModel->getFacilityStatistics($item->id);
        }

        return $this->successOutput(['data' => $related]);
    }

    /**
     * Follow/unfollow facility
     *
     * @api {post} /facilities/profile/{slug}/follow Follow/unfollow facility
     * @apiName Follow-Facility
     * @apiGroup Facility-Profile
     * @apiVersion 1.0.0
     * @apiHeader {String} key Token
     * @apiParam {String} slug Facility slug or ID
     * @apiSuccess {Object} data Follow status
     */
    public function follow($slug)
    {
        $facility = $this->findFacility($slug);

        if (!$facility) {
            return $this->errorOutput("Facility not found", 404);
        }

        $current_user = Services::request()->current_user ?? null;

        if (!$current_user) {
            return $this->errorOutput("Authentication required", 401);
        }

        // Check if already following
        $existingFollow = $this->followModel->where([
            'follower_id' => $current_user['id'],
            'following_id' => $facility->id,
            'following_type' => 'FACILITY'
        ])->first();

        if ($existingFollow) {
            // Unfollow
            $this->followModel->delete($existingFollow->id);

            // Decrement follower count
            $this->statisticModel->incrementCounter($facility->id, 'total_followers', -1);

            return $this->successOutput([
                'data' => [
                    'is_following' => false,
                    'message' => 'Successfully unfollowed the facility'
                ]
            ]);
        } else {
            // Follow
            $followId = $this->followModel->insert([
                'follower_id' => $current_user['id'],
                'following_id' => $facility->id,
                'following_type' => 'FACILITY'
            ]);

            // Increment follower count
            $this->statisticModel->incrementCounter($facility->id, 'total_followers', 1);

            return $this->successOutput([
                'data' => [
                    'is_following' => true,
                    'message' => 'Successfully followed the facility'
                ]
            ], 201);
        }
    }

    /**
     * Get facility statistics
     *
     * @api {get} /facilities/profile/{slug}/statistics Get facility statistics
     * @apiName Get-Facility-Statistics
     * @apiGroup Facility-Profile
     * @apiVersion 1.0.0
     * @apiHeader {String} key Token
     * @apiParam {String} slug Facility slug or ID
     * @apiSuccess {Object} data Facility statistics
     */
    public function statistics($slug)
    {
        $facility = $this->findFacility($slug);

        if (!$facility) {
            return $this->errorOutput("Facility not found", 404);
        }

        $statistics = $this->statisticModel->getFacilityStatistics($facility->id);

        if (!$statistics) {
            // Return default statistics if none exist
            return $this->successOutput([
                'data' => [
                    'facility_id' => $facility->id,
                    'total_bookings' => 0,
                    'total_revenue' => 0,
                    'total_visitors' => 0,
                    'total_events' => 0,
                    'total_followers' => 0,
                    'total_reviews' => 0,
                    'average_rating' => 0.00,
                    'last_calculated_at' => null
                ]
            ]);
        }

        return $this->successOutput(['data' => $statistics]);
    }

    /**
     * Check follow status
     *
     * @api {get} /facilities/profile/{slug}/follow-status Check follow status
     * @apiName Get-Follow-Status
     * @apiGroup Facility-Profile
     * @apiVersion 1.0.0
     * @apiHeader {String} key Token
     * @apiParam {String} slug Facility slug or ID
     * @apiSuccess {Object} data Follow status
     */
    public function followStatus($slug)
    {
        $facility = $this->findFacility($slug);

        if (!$facility) {
            return $this->errorOutput("Facility not found", 404);
        }

        $current_user = Services::request()->current_user ?? null;
        $is_following = false;
        $follow_data = null;

        if ($current_user) {
            $follow = $this->followModel->where([
                'follower_id' => $current_user['id'],
                'following_id' => $facility->id,
                'following_type' => 'FACILITY'
            ])->first();

            $is_following = !empty($follow);
            $follow_data = $follow;
        }

        return $this->successOutput([
            'data' => [
                'is_following' => $is_following,
                'follow_data' => $follow_data,
                'facility_id' => $facility->id
            ]
        ]);
    }
}