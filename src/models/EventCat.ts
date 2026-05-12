
/**
 * @author Sarip Hidayat <hidayatsarip2210@gmail.com>
 * @copyright Sarip Hidayat 2024
 * @date 02/08/24
 */

import APIClient from '../lib/ApiClient';
import { ListResponse, PostResponse, PutResponse, DeleteResponse } from '@/types/apiTypes';

export interface InEventCatForm {
    id: number | null,
    name: string;
    description: string;
}

export interface InEventCat {
    id: number | null,
    name: string;
    description: string;
}


class EventCat {
    async list(query: Record<string, any> = {}): Promise<ListResponse<InEventCat[]>> {
        return await APIClient.get('events_cat', query);
    }

    async create(EventCat: InEventCatForm): Promise<PostResponse> {
        return await APIClient.post('/eventscat', EventCat);
    }

    async update(id: any, EventCat: InEventCatForm) : Promise<PutResponse<InEventCat>>{
        return await APIClient.put(`/eventscat/${id}`, EventCat);
    }

    async delete(id: any) : Promise<DeleteResponse> {
        return await APIClient.delete(`/eventscat/${id}`);
    }
}


export { EventCat };