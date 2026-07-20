/**
 * EO & Facility Verification Model
 * API client for the admin verification moderation endpoints
 *
 * @author Sarip Hidayat <hidayatsarip2210@gmail.com>
 * @copyright Sarip Hidayat 2024
 * @date 2026-07-18
 */

import APIClient from '../lib/ApiClient';
import { ListResponse } from '@/types/apiTypes';
import { InEventOrganizer } from '@/models/EventOrganizer';
import { InFacilityOrganizer } from '@/models/FacilityOrganizer';

export interface EoVerificationListQuery {
    search?: string;
    status?: 'Pending' | 'Approved' | 'Rejected' | '';
    sort_by?: string;
    per_page?: number;
    page?: number;
    filter?: string;
}

export interface FacilityVerificationListQuery {
    search?: string;
    status?: 'Pending' | 'Approved' | 'Rejected' | '';
    sort_by?: string;
    per_page?: number;
    page?: number;
    filter?: string;
}

class EoVerification {
    // ============= EVENT ORGANIZER VERIFICATION =============

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

    // ============= FACILITY VERIFICATION =============

    async facilityList(query: FacilityVerificationListQuery = {}): Promise<ListResponse<InFacilityOrganizer[]>> {
        return await APIClient.get('admin/facility/verifications', query);
    }

    async facilityDetail(id: number): Promise<{ success: boolean; data: { facilities_organizer: InFacilityOrganizer } }> {
        return await APIClient.get(`admin/facility/verifications/${id}`);
    }

    async facilityApprove(facilityId: number): Promise<{ success: boolean; data: any }> {
        return await APIClient.post('admin/facility/approve', { facility_id: facilityId });
    }

    async facilityReject(facilityId: number, verificationNote: string): Promise<{ success: boolean; data: any }> {
        return await APIClient.post('admin/facility/reject', {
            facility_id: facilityId,
            verification_note: verificationNote,
        });
    }
}

export { EoVerification };
