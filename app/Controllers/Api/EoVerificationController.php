<?php
/**
 * EO Verification Controller
 * Handles admin moderation of Event Organizer verifications
 *
 * @author Sarip Hidayat <hidayatsarip2210@gmail.com>
 * @copyright Sarip Hidayat 2024
 * @date 2026-05-08
 */

namespace App\Controllers\Api;

use App\Filters\SearchFilter;
use App\Models\EventsOrganizer;
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
    public function show($id)
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
}
