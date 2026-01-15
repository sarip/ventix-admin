<?php

/**
 * Notification Service
 * Manages database notifications for users
 * 
 * @author Sarip Hidayat <hidayatsarip2210@gmail.com>
 * @copyright Sarip Hidayat 2024
 * @date 2025-12-11
 */

namespace App\Libraries;

use App\Models\Notification;
use App\Models\User;

class NotificationService
{
    protected $notificationModel;

    public function __construct()
    {
        $this->notificationModel = new Notification();
    }

    /**
     * Create a new notification
     * 
     * @param int $userId User ID to receive notification
     * @param string $type Notification type
     * @param string $entityType Entity type (schedule, ticket, work_order, etc)
     * @param int $entityId Entity ID
     * @param string $title Notification title
     * @param string $message Notification message
     * @param array $metadata Additional metadata (optional)
     * @return int|false Notification ID or false on failure
     */
    public function create($userId, $type, $entityType, $entityId, $title, $message, $metadata = [])
    {
        try {
            $data = [
                'user_id' => $userId,
                'type' => $type,
                'entity_type' => $entityType,
                'entity_id' => $entityId,
                'title' => $title,
                'message' => $message,
                'metadata' => !empty($metadata) ? json_encode($metadata) : null,
                'is_read' => 0,
                'sent_at' => date('Y-m-d H:i:s'),
            ];

            $notificationId = $this->notificationModel->insert($data);

            if ($notificationId) {
                log_message('info', "Notification created: ID={$notificationId}, UserId={$userId}, Type={$type}");
                return $notificationId;
            }

            log_message('error', "Failed to create notification for user {$userId}");
            return false;

        } catch (\Exception $e) {
            log_message('error', "Notification creation error: {$e->getMessage()}");
            return false;
        }
    }

    /**
     * Get user notifications
     * 
     * @param int $userId User ID
     * @param int $limit Number of notifications to retrieve
     * @param bool $unreadOnly Only get unread notifications
     * @return array Array of notification objects
     */
    public function getUserNotifications($userId, $limit = 50, $unreadOnly = false)
    {
        try {
            $query = $this->notificationModel->where('user_id', $userId);

            if ($unreadOnly) {
                $query->where('is_read', 0);
            }

            $notifications = $query
                ->orderBy('created_at', 'DESC')
                ->limit($limit)
                ->findAll();

            return $notifications ?? [];

        } catch (\Exception $e) {
            log_message('error', "Get notifications error: {$e->getMessage()}");
            return [];
        }
    }

    /**
     * Get unread notification count for user
     * 
     * @param int $userId User ID
     * @return int Unread count
     */
    public function getUnreadCount($userId)
    {
        try {
            $count = $this->notificationModel
                ->where('user_id', $userId)
                ->where('is_read', 0)
                ->countAllResults();

            return $count;

        } catch (\Exception $e) {
            log_message('error', "Get unread count error: {$e->getMessage()}");
            return 0;
        }
    }

    /**
     * Mark a notification as read
     * 
     * @param int $notificationId Notification ID
     * @return bool Success status
     */
    public function markAsRead($notificationId)
    {
        try {
            $result = $this->notificationModel->update($notificationId, [
                'is_read' => 1
            ]);

            if ($result) {
                log_message('info', "Notification {$notificationId} marked as read");
                return true;
            }

            return false;

        } catch (\Exception $e) {
            log_message('error', "Mark as read error: {$e->getMessage()}");
            return false;
        }
    }

    /**
     * Mark all user notifications as read
     * 
     * @param int $userId User ID
     * @return bool Success status
     */
    public function markAllAsRead($userId)
    {
        try {
            $result = $this->notificationModel
                ->where('user_id', $userId)
                ->where('is_read', 0)
                ->set(['is_read' => 1])
                ->update();

            log_message('info', "All notifications marked as read for user {$userId}");
            return true;

        } catch (\Exception $e) {
            log_message('error', "Mark all as read error: {$e->getMessage()}");
            return false;
        }
    }

    /**
     * Delete a notification
     * 
     * @param int $notificationId Notification ID
     * @return bool Success status
     */
    public function delete($notificationId)
    {
        try {
            $result = $this->notificationModel->delete($notificationId);

            if ($result) {
                log_message('info', "Notification {$notificationId} deleted");
                return true;
            }

            return false;

        } catch (\Exception $e) {
            log_message('error', "Delete notification error: {$e->getMessage()}");
            return false;
        }
    }

    /**
     * Delete old notifications
     * Cleanup utility to remove notifications older than specified days
     * 
     * @param int $daysOld Number of days old (default: 90)
     * @return int Number of deleted notifications
     */
    public function deleteOldNotifications($daysOld = 90)
    {
        try {
            $cutoffDate = date('Y-m-d H:i:s', strtotime("-{$daysOld} days"));

            $builder = $this->notificationModel->builder();
            $builder->where('created_at <', $cutoffDate);
            $count = $builder->countAllResults(false);

            $builder->delete();

            log_message('info', "Deleted {$count} old notifications (older than {$daysOld} days)");
            return $count;

        } catch (\Exception $e) {
            log_message('error', "Delete old notifications error: {$e->getMessage()}");
            return 0;
        }
    }

    /**
     * Get notification by ID
     * 
     * @param int $notificationId Notification ID
     * @return object|null Notification object or null
     */
    public function getNotification($notificationId)
    {
        try {
            return $this->notificationModel->find($notificationId);
        } catch (\Exception $e) {
            log_message('error', "Get notification error: {$e->getMessage()}");
            return null;
        }
    }

    /**
     * Check if user owns notification
     * 
     * @param int $notificationId Notification ID
     * @param int $userId User ID
     * @return bool True if user owns the notification
     */
    public function userOwnsNotification($notificationId, $userId)
    {
        try {
            $notification = $this->notificationModel->find($notificationId);
            return $notification && $notification->user_id == $userId;
        } catch (\Exception $e) {
            log_message('error', "Check ownership error: {$e->getMessage()}");
            return false;
        }
    }
}
