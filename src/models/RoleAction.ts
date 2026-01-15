/**
 * @author Sarip Hidayat <hidayatsarip2210@gmail.com>
 * @copyright Sarip Hidayat 2024
 * @date 02/08/24
 */

import APIClient from '../lib/ApiClient';
import { ListResponse, PostResponse, PutResponse, DeleteResponse } from '@/types/apiTypes';

export interface InRoleActionForm {
    id?: number;
    name: string;
    scope: string;
}

export interface InRoleAction {
    id: number;
    name: string;
    scope: string;
    total_users: 101
    created_at: number;
    updated_at?: number;
}


class RoleAction {
    async list(query: Record<string, any> = {}): Promise<ListResponse<InRoleAction[]>> {
        return await APIClient.get('role_actions', query);
    }

    async create(item: InRoleActionForm): Promise<PostResponse> {
        return await APIClient.post('/roleaction', item);
    }

    async update(id: number, item: InRoleActionForm) : Promise<PutResponse<InRoleAction>>{
        return await APIClient.put(`/roleaction/${id}`, item);
    }

    async delete(id: number) : Promise<DeleteResponse> {
        return await APIClient.delete(`/roleaction/${id}`);
    }

    async scope() {

    }

    async truncate(role_id:number) : Promise<DeleteResponse>{
        return await APIClient.delete(`/roleaction/truncate/${role_id}`);
    }


}


export type {InRoleActionForm, InRoleAction}
export { RoleAction };