
/**
 * @author Sarip Hidayat <hidayatsarip2210@gmail.com>
 * @copyright Sarip Hidayat 2024
 * @date 02/08/24
 */

import APIClient from '../lib/ApiClient';
import { ListResponse, PostResponse, PutResponse, DeleteResponse } from '@/types/apiTypes';
import {InEventOrganizer} from "@/models/EventOrganizer";
import {InUser} from "@/models/User";

export interface InEventForm {
    id: number | null;
    events_organizer_id: number | null;
    user_id_pic: number | null;
    event_category: string;
    title: string;
    description: string;
    start_date: string;
    end_date: string;
    location_name: string;
    latitude: string;
    longitude: string;
    price_pool: string;
    registration_fee: string;
    thumbnail_url?: string | null;
    events_status: string;
}

export interface InEvent {
    id: number;
    events_organizer_id: number;
    user_id_pic: number;
    event_category: string;
    title: string;
    description: string;
    start_date: string;
    end_date: string;
    location_name: string;
    latitude: string;
    longitude: string;
    price_pool: string;
    registration_fee: string;
    thumbnail_url: string | null;
    events_status: string;
    created_at: string;
    updated_at: string;
    event_organizer: InEventOrganizer;
    user: InUser;
}




class Event {
    async list(query: Record<string, any> = {}): Promise<ListResponse<InEvent[]>> {
        return await APIClient.get('events', query);
    }

    async create(Event: InEventForm): Promise<PostResponse> {
        return await APIClient.post('/event', Event);
    }
    async saveAll(Event: InEventForm): Promise<PostResponse> {
        return await APIClient.post('/event/saveAll', Event);
    }

    async update(id: number, Event: InEventForm) : Promise<PutResponse<InEvent>>{
        return await APIClient.put(`/event/${id}`, Event);
    }

    async delete(id: number) : Promise<DeleteResponse> {
        return await APIClient.delete(`/event/${id}`);
    }
}


export type {InEventForm, InEvent}
export { Event };