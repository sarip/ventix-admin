<?php

namespace App\Controllers\Api;

use App\Libraries\NotificationService;
use CodeIgniter\API\ResponseTrait;

class NotificationController extends ApiController
{
    use ResponseTrait;

    protected $notificationService;

    public function __construct()
    {
        parent::__construct();
        $this->notificationService = new NotificationService();
    }

    /**
     * Get user notifications
     * GET /api/v1/notifications
     */
    public function index()
    {
        $userId = $this->getUserIdFromRequest();
        if (!$userId) {
            return $this->errorOutput('Unauthorized', 401);
        }

        $limit = $this->request->getGet('limit') ?? 20;
        $unreadOnly = $this->request->getGet('unreadOnly') === 'true';

        $notifications = $this->notificationService->getUserNotifications($userId, $limit, $unreadOnly);

        return $this->successOutput([
            'notifications' => $notifications
        ]);
    }

    /**
     * Get unread notification count
     * GET /api/v1/notifications/unread-count
     */
    public function unreadCount()
    {
        $userId = $this->getUserIdFromRequest();
        if (!$userId) {
            return $this->errorOutput('Unauthorized', 401);
        }

        $count = $this->notificationService->getUnreadCount($userId);

        return $this->successOutput([
            'unread_count' => $count
        ]);
    }

    /**
     * Mark notification as read
     * POST /api/v1/notifications/(:num)/read
     */
    public function markAsRead($id)
    {
        $userId = $this->getUserIdFromRequest();
        if (!$userId) {
            return $this->errorOutput('Unauthorized', 401);
        }

        if (!$this->notificationService->userOwnsNotification($id, $userId)) {
            return $this->errorOutput('Access denied', 403);
        }

        $this->notificationService->markAsRead($id);

        return $this->successOutput(['message' => 'Notification marked as read']);
    }

    /**
     * Mark all notifications as read
     * POST /api/v1/notifications/read-all
     */
    public function markAllAsRead()
    {
        $userId = $this->getUserIdFromRequest();
        if (!$userId) {
            return $this->errorOutput('Unauthorized', 401);
        }

        $this->notificationService->markAllAsRead($userId);

        return $this->successOutput(['message' => 'All notifications marked as read']);
    }

    /**
     * Delete notification
     * DELETE /api/v1/notifications/(:num)
     */
    public function delete($id)
    {
        $userId = $this->getUserIdFromRequest();
        if (!$userId) {
            return $this->errorOutput('Unauthorized', 401);
        }

        if (!$this->notificationService->userOwnsNotification($id, $userId)) {
            return $this->errorOutput('Access denied', 403);
        }

        $this->notificationService->delete($id);

        return $this->successOutput(['message' => 'Notification deleted']);
    }

    /**
     * Helper to get user ID from request (from tokenFilter)
     */
    private function getUserIdFromRequest()
    {
        // The tokenFilter sets the user ID in the request object or global
        // Based on useNotifications.ts sending 'key' header
        // We'll use the ID from the cookies or key if available, 
        // but normally filters handle this.
        // Assuming the base ApiController or filter already validated it.
        return $this->request->id ?? null;
    }
}
