import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { NotificationItem, NotificationResponse, UnreadCountResponse } from "@/types/notification";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1";

export function useNotifications(token: string | null) {
    const [notifications, setNotifications] = useState<NotificationItem[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(false);

    const fetchNotifications = useCallback(async (limit: number = 20, unreadOnly: boolean = false) => {
        if (!token) return;

        setLoading(true);
        try {
            const response = await axios.get<NotificationResponse>(
                `${API_URL}/notifications`,
                {
                    params: { limit, unreadOnly },
                    headers: { 'key': token }
                }
            );
            setNotifications(response.data.notifications);
        } catch (error) {
            console.error("Failed to fetch notifications:", error);
        } finally {
            setLoading(false);
        }
    }, [token]);

    const fetchUnreadCount = useCallback(async () => {
        if (!token) return;

        try {
            const response = await axios.get<UnreadCountResponse>(
                `${API_URL}/notifications/unread-count`,
                {
                    headers: { 'key': token }
                }
            );

            setUnreadCount(response.data.unread_count);
        } catch (error) {
            console.error("Failed to fetch unread count:", error);
        }
    }, [token]);

    const markAsRead = useCallback(async (id: number) => {
        if (!token) return;

        try {
            await axios.post(
                `${API_URL}/notifications/${id}/read`,
                {},
                {
                    headers: { 'key': token }
                }
            );

            // Update local state
            setNotifications(prev =>
                prev.map(n => n.id === id ? { ...n, is_read: 1 } : n)
            );
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (error) {
            console.error("Failed to mark notification as read:", error);
        }
    }, [token]);

    const markAllAsRead = useCallback(async () => {
        if (!token) return;

        try {
            await axios.post(
                `${API_URL}/notifications/read-all`,
                {},
                {
                    headers: { 'key': token }
                }
            );

            // Update local state
            setNotifications(prev =>
                prev.map(n => ({ ...n, is_read: 1 }))
            );
            setUnreadCount(0);
        } catch (error) {
            console.error("Failed to mark all as read:", error);
        }
    }, [token]);

    const deleteNotification = useCallback(async (id: number) => {
        if (!token) return;

        try {
            await axios.delete(
                `${API_URL}/notifications/${id}`,
                {
                    headers: { 'key': token }
                }
            );

            // Update local state
            setNotifications(prev => prev.filter(n => n.id !== id));
            const wasUnread = notifications.find(n => n.id === id)?.is_read === 0;
            if (wasUnread) {
                setUnreadCount(prev => Math.max(0, prev - 1));
            }
        } catch (error) {
            console.error("Failed to delete notification:", error);
        }
    }, [token, notifications]);

    // Add new notification from real-time
    const addNotification = useCallback((notification: NotificationItem) => {
        setNotifications(prev => [notification, ...prev]);
        if (notification.is_read === 0) {
            setUnreadCount(prev => prev + 1);
        }
    }, []);

    // Initial fetch
    useEffect(() => {
        if (token) {
            fetchNotifications();
            fetchUnreadCount();
        }
    }, [token, fetchNotifications, fetchUnreadCount]);

    return {
        notifications,
        unreadCount,
        loading,
        fetchNotifications,
        fetchUnreadCount,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        addNotification
    };
}
