/**
 * EO Verification Model
 * API client for the admin EO verification moderation endpoints
 *
 * @author Sarip Hidayat <hidayatsarip2210@gmail.com>
 * @copyright Sarip Hidayat 2024
 * @date 2026-05-08
 */

import APIClient from '../lib/ApiClient';
import { ListResponse } from '@/types/apiTypes';
import { InEventOrganizer } from '@/models/EventOrganizer';

export interface EoVerificationListQuery {
    search?: string;
    status?: 'Pending' | 'Approved' | 'Rejected' | '';
    sort_by?: string;
    per_page?: number;
    page?: number;
    filter?: string;
}

class EoVerification {
    async list(query: EoVerificationListQuery = {}): Promise<ListResponse<InEventOrganizer[]>> {
        return await APIClient.get('admin/eo/verifications', query);
    }

    async detail(id: number): Promise<{ success: boolean; data: { events_organizer: InEventOrganizer } }> {
        return await APIClient.get(`admin/eo/verifications/${id}`);
    }

    async approve(eoId: number): Promise<{ success: boolean; data: any }> {
        return await APIClient.post('admin/eo/approve', { eo_id: eoId });
    }

    async reject(eoId: number, verificationNote: string): Promise<{ success: boolean; data: any }> {
        return await APIClient.post('admin/eo/reject', {
            eo_id: eoId,
            verification_note: verificationNote,
        });
    }
}

export { EoVerification };
