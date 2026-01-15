
/**
 * @author Sarip Hidayat <hidayatsarip2210@gmail.com>
 * @copyright Sarip Hidayat 2024
 * @date 02/08/24
 */

import APIClient from '../lib/ApiClient';
import { ListResponse, PostResponse, PutResponse, DeleteResponse } from '@/types/apiTypes';

export interface InEventStatusForm {
    name: string;
    description: string;
}

export interface InEventStatus {
    id: number;
    name: string;
    description: string;
    created_at: string;
    updated_at: string;
}



class EventStatus {
    async list(query: Record<string, any> = {}): Promise<ListResponse<InEventStatus[]>> {
        return await APIClient.get('events_status', query);
    }

    async create(EventStatus: InEventStatusForm): Promise<PostResponse> {
        return await APIClient.post('/eventsstatu', EventStatus);
    }

    async update(id: any, EventStatus: InEventStatusForm) : Promise<PutResponse<InEventStatus>>{
        return await APIClient.put(`/eventsstatu/${id}`, EventStatus);
    }

    async delete(id: any) : Promise<DeleteResponse> {
        return await APIClient.delete(`/eventsstatu/${id}`);
    }
}


export { EventStatus };