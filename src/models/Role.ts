/**
 * @author Sarip Hidayat <hidayatsarip2210@gmail.com>
 * @copyright Sarip Hidayat 2024
 * @date 02/08/24
 */

import APIClient from '../lib/ApiClient';
import { ListResponse, PostResponse, PutResponse, DeleteResponse } from '@/types/apiTypes';

export interface InRoleForm {
    id?: number;
    name: string;
    scope: string;
}

export interface InRole {
    id: number;
    name: string;
    scope: string;
    total_users: 101
    created_at: number;
    updated_at?: number;
}


class Role {
    async list(query: Record<string, any> = {}): Promise<ListResponse<InRole[]>> {
        return await APIClient.get('roles', query);
    }

    async create(item: InRoleForm): Promise<PostResponse> {
        return await APIClient.post('/role', item);
    }

    async update(id: number, item: InRoleForm) : Promise<PutResponse<InRole>>{
        return await APIClient.put(`/role/${id}`, item);
    }

    async delete(id: number) : Promise<DeleteResponse> {
        return await APIClient.delete(`/role/${id}`);
    }

    async scope() {

    }
}


export type {InRoleForm, InRole}
export { Role };