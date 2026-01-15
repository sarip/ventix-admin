
/**
 * @author Sarip Hidayat <hidayatsarip2210@gmail.com>
 * @copyright Sarip Hidayat 2024
 * @date 02/08/24
 */

import APIClient from '../lib/ApiClient';
import { ListResponse, PostResponse, PutResponse, DeleteResponse } from '@/types/apiTypes';

export interface InEventOrganizerForm {
    id: number | null;
    eo_name: string;
    company_name: string;
    email: string;
    phone: string;
    website: string;
    address: string;
    logo_path?: string | null;
    tax_id: string | null;
    description?: string | null;
}

export interface InEventOrganizer {
    id: number;
    eo_name: string;
    company_name: string;
    email: string;
    phone: string;
    website: string;
    address: string;
    logo_path: string | null;
    tax_id: string;
    description: string | null;
    eo_slug: string;
    created_at: string;
    updated_at: string;
}



class EventOrganizer {
    async list(query: Record<string, any> = {}): Promise<ListResponse<InEventOrganizer[]>> {
        return await APIClient.get('events_organizer', query);
    }

    async create(EventOrganizer: InEventOrganizerForm): Promise<PostResponse> {
        return await APIClient.post('/eventsorganizer', EventOrganizer);
    }

    async update(id: number, EventOrganizer: InEventOrganizerForm) : Promise<PutResponse<InEventOrganizer>>{
        return await APIClient.post(`/eventsorganizer/${id}`, EventOrganizer);
    }

    async delete(id: number) : Promise<DeleteResponse> {
        return await APIClient.delete(`/eventsorganizer/${id}`);
    }
}


export type {InEventOrganizerForm, InEventOrganizer}
export { EventOrganizer };