import APIClient from '../lib/ApiClient';

export interface InCheckinScanRequest {
    qr_token: string;
    event_id?: number;
    device_id?: string;
}

export interface InCheckinScanResponse {
    status: 'SUCCESS' | 'FAILED' | 'INVALID' | 'ALREADY_CHECKED';
    message?: string;
    guest_name?: string;
    ticket?: string;
    ticket_code?: string;
    check_in_at?: string;
}

export interface InCheckinDashboardData {
    total_tickets: number;
    checked_in: number;
    remaining: number;
    attendance_rate: number;
    recent_history: Array<{
        id: number;
        ticket_id: number;
        event_id: number;
        scan_token: string;
        status: string;
        message: string;
        scanned_by?: number;
        device_id?: string;
        ip_address?: string;
        created_at: string;
        ticket_code?: string;
        guest_name?: string;
        user_name?: string;
        staff_name?: string;
        ticket_name?: string;
    }>;
}

class CheckinModel {
    async generateQr(ticketId: number): Promise<{ ticket_id: number; qr_token: string; status: string }> {
        return await APIClient.get(`/tickets/${ticketId}/qr`);
    }

    async scan(data: InCheckinScanRequest): Promise<InCheckinScanResponse> {
        return await APIClient.post('/checkin/scan', data);
    }

    async dashboard(eventId?: number): Promise<InCheckinDashboardData> {
        const query = eventId ? `?event_id=${eventId}` : '';
        return await APIClient.get(`/checkin/dashboard${query}`);
    }
}

export const Checkin = new CheckinModel();
