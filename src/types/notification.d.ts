export interface NotificationMessage {
    id: number;
    userId: number;
    type: string;
    message: string;
    severity?: string;
}
