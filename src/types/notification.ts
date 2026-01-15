export interface NotificationMessage {
    type: string;
    title?: string;
    message: string;
    timestamp: string;
    entity_id?: number;
    entity_type?: string;
    urgency?: string;
    data?: any;
}

export interface NotificationItem {
    id: number;
    user_id: number;
    type: string;
    entity_type: string;
    entity_id: number;
    title: string;
    message: string;
    metadata?: any;
    is_read: number;
    created_at: string;
    sent_at?: string;
}

export interface NotificationResponse {
    status: boolean;
    notifications: NotificationItem[];
    count: number;
}

export interface UnreadCountResponse {
    status: boolean;
    unread_count: number;
}
