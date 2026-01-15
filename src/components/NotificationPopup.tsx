import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import useRealtimeNotification from "@/hooks/useRealtimeNotification";
import { useNotifications } from "@/hooks/useNotifications";
import { NotificationMessage, NotificationItem } from "@/types/notification";

interface NotificationPopupProps {
    userId: number | null;
    token: string | null;
}

export default function NotificationPopup({ userId, token }: NotificationPopupProps) {
    const router = useRouter();
    const [toast, setToast] = useState<NotificationMessage | null>(null);

    const {
        notifications,
        unreadCount,
        loading,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        fetchNotifications
    } = useNotifications(token);

    // Handle real-time notifications
    const handleRealtimeNotification = useCallback((data: NotificationMessage) => {
        // Show toast popup
        setToast(data);
        setTimeout(() => setToast(null), 5000);

        // Play notification sound (optional)
        try {
            const audio = new Audio('/notification-sound.mp3');
            audio.play().catch(e => console.log('Audio play failed:', e));
        } catch (e) {
            // Ignore audio errors
        }

        // Refresh notifications list
        fetchNotifications();
    }, [fetchNotifications]);

    // Connect to WebSocket
    const { isConnected } = useRealtimeNotification(userId, handleRealtimeNotification);

    const getNotificationIcon = (type: string) => {
        if (type.includes('pm')) return '🔧';
        if (type.includes('wo')) return '📋';
        if (type.includes('ticket')) return '🎫';
        if (type.includes('inventory')) return '📦';
        if (type.includes('vendor') || type.includes('invoice')) return '💼';
        if (type.includes('sla') || type.includes('escalation')) return '⚠️';
        if (type.includes('incident')) return '🚨';
        return '🔔';
    };

    const formatTimeAgo = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

        if (seconds < 60) return 'Baru saja';
        if (seconds < 3600) return `${Math.floor(seconds / 60)}m yang lalu`;
        if (seconds < 86400) return `${Math.floor(seconds / 3600)}h yang lalu`;
        return `${Math.floor(seconds / 86400)}d yang lalu`;
    };

    const handleNotificationClick = (notification: NotificationItem) => {
        // Mark as read
        if (notification.is_read === 0) {
            markAsRead(notification.id);
        }

        // Navigate based on entity type to the main index page
        // These pages use card layouts or modals for details, not separate detail pages
        const { entity_type, entity_id } = notification;

        switch (entity_type) {
            case 'schedule':
            case 'pm':
            case 'preventive_maintenance':
                // Navigate to schedule maintenance page
                router.push(`/schedule_maintenance`);
                break;
            case 'schedule_run':
            case 'task_result':
                // Navigate to maintenance result page
                router.push(`/maintenance_result`);
                break;
            case 'work_order':
            case 'wo':
                // Navigate to work order page
                router.push(`/work_order`);
                break;
            case 'ticket':
                // Navigate to ticket page
                router.push(`/ticket`);
                break;
            case 'inventory':
                // Navigate to inventory page
                router.push(`/inventory`);
                break;
            case 'vendor':
            case 'vendor_contract':
                // Navigate to vendors page
                router.push(`/vendors`);
                break;
            case 'incident':
                // Navigate to incident page
                router.push(`/incident`);
                break;
            default:
                // For unknown types, log to console
                console.log('No navigation defined for type:', entity_type, 'ID:', entity_id);
        }
    };

    const handleToastClick = () => {
        if (toast?.entity_id) {
            const notification: NotificationItem = {
                id: 0, // Temporary, toast doesn't have id yet
                user_id: userId || 0,
                type: toast.type,
                entity_type: toast.entity_type || '',
                entity_id: toast.entity_id,
                title: toast.title || '',
                message: toast.message,
                is_read: 0,
                created_at: toast.timestamp,
                metadata: toast.data
            };
            handleNotificationClick(notification);
            setToast(null);
        }
    };

    return (
        <>
            {/* Notification Bell Dropdown - Bootstrap Style */}
            <li className="nav-item dropdown-notifications navbar-dropdown dropdown me-3 me-xl-2">
                <a
                    className="nav-link dropdown-toggle hide-arrow"
                    href="#"
                    data-bs-toggle="dropdown"
                    data-bs-auto-close="outside"
                    aria-expanded="false"
                >
                    <i className="bx bx-bell bx-sm"></i>
                    {/* {unreadCount > 0 && ( */}
                    <span className="badge bg-danger rounded-pill badge-notifications">
                        {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                    {/* )} */}
                </a>

                <ul className="dropdown-menu dropdown-menu-end py-0">
                    {/* Header */}
                    <li className="dropdown-menu-header border-bottom">
                        <div className="dropdown-header d-flex align-items-center py-3">
                            <h5 className="text-body mb-0 me-auto">
                                Notifikasi
                                {isConnected && (
                                    <i className="bx bx-wifi text-success ms-2" title="Connected"></i>
                                )}
                            </h5>
                            {unreadCount > 0 && (
                                <a
                                    href="javascript:void(0)"
                                    className="dropdown-notifications-all text-body"
                                    onClick={() => markAllAsRead()}
                                    data-bs-toggle="tooltip"
                                    data-bs-placement="top"
                                    title="Tandai semua sudah dibaca"
                                >
                                    <i className="bx fs-4 bx-envelope-open"></i>
                                </a>
                            )}
                        </div>
                    </li>

                    {/* Notification List */}
                    <li className="dropdown-notifications-list scrollable-container">
                        {loading ? (
                            <div className="text-center py-5">
                                <div className="spinner-border spinner-border-sm text-primary" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                            </div>
                        ) : notifications.length === 0 ? (
                            <div className="text-center py-5">
                                <i className="bx bx-bell bx-lg text-muted mb-2"></i>
                                <p className="text-muted mb-0">Tidak ada notifikasi</p>
                            </div>
                        ) : (
                            <ul className="list-group list-group-flush">
                                {notifications.map((notification) => (
                                    <li
                                        key={notification.id}
                                        className={`list-group-item list-group-item-action dropdown-notifications-item ${notification.is_read === 1 ? 'marked-as-read' : ''
                                            }`}
                                        onClick={() => handleNotificationClick(notification)}
                                    >
                                        <div className="d-flex">
                                            <div className="flex-shrink-0 me-3">
                                                <div className="avatar">
                                                    <span className="avatar-initial rounded-circle bg-label-primary">
                                                        {getNotificationIcon(notification.type)}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex-grow-1">
                                                <h6 className="mb-1">{notification.title}</h6>
                                                <p className="mb-0 small text-muted">
                                                    {notification.message}
                                                </p>
                                                <small className="text-muted">
                                                    {formatTimeAgo(notification.created_at)}
                                                </small>
                                            </div>
                                            <div className="flex-shrink-0 dropdown-notifications-actions">
                                                {notification.is_read === 0 && (
                                                    <a
                                                        href="javascript:void(0)"
                                                        className="dropdown-notifications-read"
                                                        onClick={() => markAsRead(notification.id)}
                                                        title="Tandai sudah dibaca"
                                                    >
                                                        <span className="badge badge-dot"></span>
                                                    </a>
                                                )}
                                                <a
                                                    href="javascript:void(0)"
                                                    className="dropdown-notifications-archive"
                                                    onClick={() => deleteNotification(notification.id)}
                                                    title="Hapus"
                                                >
                                                    <span className="bx bx-x"></span>
                                                </a>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </li>

                    {/* Footer - View All (Optional) */}
                    {notifications.length > 0 && (
                        <li className="dropdown-menu-footer border-top">
                            <a
                                href="javascript:void(0)"
                                className="dropdown-item d-flex justify-content-center p-3"
                            >
                                Lihat semua notifikasi
                            </a>
                        </li>
                    )}
                </ul>
            </li>

            {/* Toast Notification (Real-time) - Bootstrap Alert */}
            {toast && (
                <div
                    className="position-fixed top-0 end-0 p-3"
                    style={{ zIndex: 9999 }}
                    onClick={handleToastClick}
                >
                    <div className="toast show" role="alert" aria-live="assertive" aria-atomic="true">
                        <div className="toast-header bg-primary text-white">
                            <span className="me-2">{getNotificationIcon(toast.type)}</span>
                            <strong className="me-auto">Notifikasi Baru</strong>
                            <button
                                type="button"
                                className="btn-close btn-close-white"
                                onClick={() => setToast(null)}
                                aria-label="Close"
                            ></button>
                        </div>
                        <div className="toast-body">
                            {toast.message}
                        </div>
                    </div>
                </div>
            )}

            {/* Custom CSS untuk scrollable container */}
            <style dangerouslySetInnerHTML={{
                __html: `
                .scrollable-container {
                    max-height: 400px;
                    overflow-y: auto;
                }

                

                .dropdown-notifications-item {
                    cursor: pointer;
                    transition: background-color 0.2s ease;
                }

                .dropdown-notifications-item:hover {
                    background-color: rgba(0, 0, 0, 0.04);
                }

                .dropdown-notifications-item.marked-as-read {
                    opacity: 0.7;
                }

                .badge-notifications {
                    position: absolute;
                    top: 0.5rem;
                    right: 0.5rem;
                    font-size: 0.625rem;
                    padding: 0.25em 0.4em;
                }

                .toast.show {
                    min-width: 300px;
                    animation: slideInRight 0.3s ease-out;
                    cursor: pointer;
                }

                @keyframes slideInRight {
                    from {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
            `}} />
        </>
    );
}
