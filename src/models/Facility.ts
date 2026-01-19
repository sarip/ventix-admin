/**
 * Facility Model
 */

import APIClient from '../lib/ApiClient';
import { ListResponse, PostResponse, PutResponse, DeleteResponse } from '@/types/apiTypes';

export interface InFacility {
    id: number;
    name: string;
    events_organizer_id: string;
    category: string;
    description: string;
    user_id_pic: number;
    is_available: boolean;
    created_at: string;
    updated_at: string;
    user_pic?: {
        id: number;
        name: string;
        email: string;
    };
}

export interface InFacilityForm {
    id?: number;
    events_organizer_id: string;
    name: string;
    category: string;
    description: string;
    user_id_pic: number;
    is_available: boolean;
}

class Facility {
    async list(query: Record<string, any> = {}): Promise<ListResponse<InFacility[]>> {
        return await APIClient.get('facilities', query);
    }

    async detail(id: number): Promise<{ facility: InFacility }> {
        return await APIClient.get(`facility/${id}`);
    }

    async create(data: InFacilityForm): Promise<PostResponse> {
        return await APIClient.post('facility', data);
    }

    async update(id: number, data: InFacilityForm): Promise<PutResponse<InFacility>> {
        return await APIClient.put(`facility/${id}`, data);
    }

    async delete(id: number): Promise<DeleteResponse> {
        return await APIClient.delete(`facility/${id}`);
    }
}

export { Facility };
