/**
 * @author Sarip Hidayat <hidayatsarip2210@gmail.com>
 * @copyright Sarip Hidayat 2024
 * @date 02/08/24
 */

import APIClient from '../lib/ApiClient';
import { ListResponse, PostResponse, PutResponse, DeleteResponse } from '@/types/apiTypes';

export interface InUserLogForm {
    id?: number;
    role_id: number;
    scope: string;
    endpoint: string;
    can_read: 'Y' | 'N';
    can_create: 'Y' | 'N';
    can_update: 'Y' | 'N';
    can_delete: 'Y' | 'N';
    label: string;
}

export interface InUserLog {
    id: number;
    user_id: number;
    event_section: string;
    event_action: string;
    event_note: string;
    ip_address: string;
    created_at: number;
    updated_at: number;
    data : string;
}


class UserLog {
    async list(query: Record<string, any> = {}): Promise<ListResponse<InUserLog[]>> {
        return await APIClient.get('user_logs', query);
    }

    async create(user: InUserLogForm): Promise<PostResponse> {
        return await APIClient.post('/user_logs', user);
    }

    async update(id: number, user: InUserLogForm) : Promise<PutResponse<InUserLog>>{
        return await APIClient.put(`/user_logs/${id}`, user);
    }

    async delete(id: number) : Promise<DeleteResponse> {
        return await APIClient.delete(`/user_logs/${id}`);
    }
}


export type {InUserLogForm, InUserLog}
export { UserLog };