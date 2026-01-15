/**
 * @author Sarip Hidayat <hidayatsarip2210@gmail.com>
 * @copyright Sarip Hidayat 2024
 * @date 2026-01-14
 */

import APIClient from '../lib/ApiClient';
import { ListResponse, PostResponse, PutResponse, DeleteResponse } from '@/types/apiTypes';

export interface InEventAgendaForm {
    id?: number | null;
    events_id: number;
    start_time: string;
    end_time?: string | null;
    activity_name: string;
    notes?: string | null;
}

export interface InEventAgenda {
    id: number;
    events_id: number;
    start_time: string;
    end_time: string | null;
    activity_name: string;
    notes: string | null;
}

class EventAgenda {
    async list(query: Record<string, any> = {}): Promise<ListResponse<InEventAgenda[]>> {
        return await APIClient.get('events_agendas', query);
    }

    async create(agenda: InEventAgendaForm): Promise<PostResponse> {
        return await APIClient.post('/eventsagenda', agenda);
    }

    async update(id: number, agenda: InEventAgendaForm): Promise<PutResponse<InEventAgenda>> {
        return await APIClient.put(`/eventsagenda/${id}`, agenda);
    }

    async delete(id: number): Promise<DeleteResponse> {
        return await APIClient.delete(`/eventsagenda/${id}`);
    }
}

export type { InEventAgendaForm, InEventAgenda };
export { EventAgenda };
