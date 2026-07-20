/**
 * @author Sarip Hidayat <hidayatsarip2210@gmail.com>
 * @copyright Sarip Hidayat 2024
 * @date 2026-07-18
 */

import APIClient from '../lib/ApiClient';
import { ListResponse, PostResponse, PutResponse, DeleteResponse } from '@/types/apiTypes';

export interface InFacilityOrganizerForm {
    id: number | null;
    facility_name: string;
    company_name: string;
    legal_doc_path?: string | null;
    email: string;
    phone: string;
    website: string;
    address: string;
    logo_path?: string | null;
    tax_id: string | null;
    description?: string | null;
}

export interface InFacilityOrganizer {
    id: number;
    owner_user_id?: number | null;
    facility_name: string;
    company_name: string;
    legal_doc_path: string | null;
    email: string;
    phone: string;
    website: string;
    address: string;
    logo_path: string | null;
    tax_id: string;
    description: string | null;
    facility_slug: string;
    verification_status?: 'Pending' | 'Approved' | 'Rejected';
    verified_at?: string | null;
    verified_by?: number | null;
    verification_note?: string | null;
    created_at: string;
    updated_at: string;
}



class FacilityOrganizer {
    async list(query: Record<string, any> = {}): Promise<ListResponse<InFacilityOrganizer[]>> {
        return await APIClient.get('facilities_organizer', query);
    }

    async create(facilityOrganizer: InFacilityOrganizerForm | FormData): Promise<PostResponse> {
        return await APIClient.post('/facilitiesorganizer', facilityOrganizer);
    }

    async update(id: number, facilityOrganizer: InFacilityOrganizerForm | FormData): Promise<PutResponse<InFacilityOrganizer>> {
        return await APIClient.post(`/facilitiesorganizer/${id}`, facilityOrganizer);
    }

    async delete(id: number): Promise<DeleteResponse> {
        return await APIClient.delete(`/facilitiesorganizer/${id}`);
    }

    async verify(id: number, data: { status: 'Approved' | 'Rejected', note?: string }): Promise<PostResponse> {
        return await APIClient.post(`/facilitiesorganizer/${id}/verify`, data);
    }
}


export type { InFacilityOrganizerForm, InFacilityOrganizer }
export { FacilityOrganizer };
