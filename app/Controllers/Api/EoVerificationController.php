<?php
/**
 * EO Verification Controller
 * Handles admin moderation of Event Organizer and Facility Organizer verifications
 *
 * @author Sarip Hidayat <hidayatsarip2210@gmail.com>
 * @copyright Sarip Hidayat 2024
 * @date 2026-07-18
 */

namespace App\Controllers\Api;

use App\Filters\SearchFilter;
use App\Models\EventsOrganizer;
use App\Models\FacilitiesOrganizer;
use App\Models\User;
use App\Libraries\NotificationService;

class EoVerificationController extends ApiController
{
    protected NotificationService $notificationService;

    public function __construct()
    {
        parent::__construct();
        $this->notificationService = new NotificationService();
    }

    /**
     * List EO verification requests
     * Supports filtering by verification_status and searching by name/email/phone
     *
     * GET /api/v1/admin/eo/verifications
     */
    public function index()
    {
        $Model = new EventsOrganizer();

        $searchable_column = [
            'search' => ['eo_name', 'email', 'phone'],
        ];

        $where = [];

        // Filter by verification_status if provided
        $status = $this->request->getGet('status');
        if (!empty($status) && in_array($status, ['Pending', 'Approved', 'Rejected'])) {
            $where['verification_status'] = $status;
        }

        $output = SearchFilter::execute($Model, $searchable_column, 'events_organizer', $where);

        return $this->successOutput($output);
    }

    /**
     * Get single EO verification detail
     *
     * GET /api/v1/admin/eo/verifications/:id
     */
    public function show(?int $id = null)
    {
        $Model = new EventsOrganizer();
        $data = $Model->find($id);

        if (!$data) {
            return $this->failNotFound('Events Organizer not found');
        }

        return $this->successOutput([
            'events_organizer' => $data,
        ]);
    }

    /**
     * Approve an EO verification
     * Sets status to Approved, and sends in-app notification to EO user
     *
     * POST /api/v1/admin/eo/approve
     * Body: { "eo_id": 10 }
     */
    public function approve()
    {
        $json = $this->request->getJSON();
        $eoId = $json->eo_id ?? null;

        if (!$eoId) {
            return $this->errorOutput('eo_id is required');
        }

        $Model = new EventsOrganizer();
        $eo = $Model->find($eoId);

        if (!$eo) {
            return $this->failNotFound('Events Organizer not found');
        }

        $adminId = $this->request->id ?? null;

        $Model->update($eoId, [
            'verification_status' => 'Approved',
            'verification_note' => null,
            'verified_at' => date('Y-m-d H:i:s'),
            'verified_by' => $adminId,
        ]);

        // Activate the connected user account if inactive
        $userModel = new User();
        $user = $userModel->where('eo_id', $eoId)->first();
        if ($user && $user->status === 'Inactive') {
            $userModel->update($user->id, ['status' => 'Active']);
        }

        // Send in-app notification to EO user
        if ($user) {
            $this->notificationService->create(
                $user->id,
                'eo_verification',
                'eo_verification',
                $eoId,
                'EO Verification Approved',
                'Your EO verification has been approved.',
                ['eo_id' => $eoId]
            );
        }

        return $this->successOutput([
            'message' => 'Events Organizer Approved',
            'events_organizer' => $Model->find($eoId),
        ]);
    }

    /**
     * Reject an EO verification
     * Requires a verification_note. Sends in-app notification to EO user.
     *
     * POST /api/v1/admin/eo/reject
     * Body: { "eo_id": 10, "verification_note": "Document is invalid" }
     */
    public function reject()
    {
        $json = $this->request->getJSON();
        $eoId = $json->eo_id ?? null;
        $note = $json->verification_note ?? null;

        if (!$eoId) {
            return $this->errorOutput('eo_id is required');
        }

        if (empty(trim((string) $note))) {
            return $this->errorOutput('verification_note is required when rejecting');
        }

        $Model = new EventsOrganizer();
        $eo = $Model->find($eoId);

        if (!$eo) {
            return $this->failNotFound('Events Organizer not found');
        }

        $adminId = $this->request->id ?? null;

        $Model->update($eoId, [
            'verification_status' => 'Rejected',
            'verification_note' => $note,
            'verified_at' => date('Y-m-d H:i:s'),
            'verified_by' => $adminId,
        ]);

        // Send in-app notification to EO user
        $userModel = new User();
        $user = $userModel->where('eo_id', $eoId)->first();
        if ($user) {
            $this->notificationService->create(
                $user->id,
                'eo_verification',
                'eo_verification',
                $eoId,
                'EO Verification Rejected',
                'Your EO verification was rejected. Please re-upload required documents.',
                ['eo_id' => $eoId, 'note' => $note]
            );
        }

        return $this->successOutput([
            'message' => 'Events Organizer Rejected',
            'events_organizer' => $Model->find($eoId),
        ]);
    }

    /**
     * List Facility verification requests
     * Supports filtering by verification_status and searching by name/email/phone
     *
     * GET /api/v1/admin/facility/verifications
     */
    public function facilityIndex()
    {
        $Model = new FacilitiesOrganizer();

        $searchable_column = [
            'search' => ['facility_name', 'email', 'phone'],
        ];

        $where = [];

        // Filter by verification_status if provided
        $status = $this->request->getGet('status');
        if (!empty($status) && in_array($status, ['Pending', 'Approved', 'Rejected'])) {
            $where['verification_status'] = $status;
        }

        $output = SearchFilter::execute($Model, $searchable_column, 'facilities_organizer', $where);

        return $this->successOutput($output);
    }

    /**
     * Get single Facility verification detail
     *
     * GET /api/v1/admin/facility/verifications/:id
     */
    public function facilityShow(?int $id = null)
    {
        $Model = new FacilitiesOrganizer();
        $data = $Model->find($id);

        if (!$data) {
            return $this->failNotFound('Facilities Organizer not found');
        }

        return $this->successOutput([
            'facilities_organizer' => $data,
        ]);
    }

    /**
     * Approve a Facility verification
     * Sets status to Approved, and sends in-app notification to Facility user
     *
     * POST /api/v1/admin/facility/approve
     * Body: { "facility_id": 10 }
     */
    public function facilityApprove()
    {
        $json = $this->request->getJSON();
        $facilityId = $json->facility_id ?? null;

        if (!$facilityId) {
            return $this->errorOutput('facility_id is required');
        }

        $Model = new FacilitiesOrganizer();
        $facility = $Model->find($facilityId);

        if (!$facility) {
            return $this->failNotFound('Facilities Organizer not found');
        }

        $adminId = $this->request->id ?? null;

        $Model->update($facilityId, [
            'verification_status' => 'Approved',
            'verification_note' => null,
            'verified_at' => date('Y-m-d H:i:s'),
            'verified_by' => $adminId,
        ]);

        // Activate the connected user account if inactive
        $userModel = new User();
        $user = $userModel->where('facility_id', $facilityId)->first();
        if ($user && $user->status === 'Inactive') {
            $userModel->update($user->id, ['status' => 'Active']);
        }

        // Send in-app notification to Facility user
        if ($user) {
            $this->notificationService->create(
                $user->id,
                'facility_verification',
                'facility_verification',
                $facilityId,
                'Facility Verification Approved',
                'Your Facility verification has been approved.',
                ['facility_id' => $facilityId]
            );
        }

        return $this->successOutput([
            'message' => 'Facilities Organizer Approved',
            'facilities_organizer' => $Model->find($facilityId),
        ]);
    }

    /**
     * Reject a Facility verification
     * Requires a verification_note. Sends in-app notification to Facility user.
     *
     * POST /api/v1/admin/facility/reject
     * Body: { "facility_id": 10, "verification_note": "Document is invalid" }
     */
    public function facilityReject()
    {
        $json = $this->request->getJSON();
        $facilityId = $json->facility_id ?? null;
        $note = $json->verification_note ?? null;

        if (!$facilityId) {
            return $this->errorOutput('facility_id is required');
        }

        if (empty(trim((string) $note))) {
            return $this->errorOutput('verification_note is required when rejecting');
        }

        $Model = new FacilitiesOrganizer();
        $facility = $Model->find($facilityId);

        if (!$facility) {
            return $this->failNotFound('Facilities Organizer not found');
        }

        $adminId = $this->request->id ?? null;

        $Model->update($facilityId, [
            'verification_status' => 'Rejected',
            'verification_note' => $note,
            'verified_at' => date('Y-m-d H:i:s'),
            'verified_by' => $adminId,
        ]);

        // Send in-app notification to Facility user
        $userModel = new User();
        $user = $userModel->where('facility_id', $facilityId)->first();
        if ($user) {
            $this->notificationService->create(
                $user->id,
                'facility_verification',
                'facility_verification',
                $facilityId,
                'Facility Verification Rejected',
                'Your Facility verification was rejected. Please re-upload required documents.',
                ['facility_id' => $facilityId, 'note' => $note]
            );
        }

        return $this->successOutput([
            'message' => 'Facilities Organizer Rejected',
            'facilities_organizer' => $Model->find($facilityId),
        ]);
    }
}
