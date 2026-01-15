/**
 * @author Sarip Hidayat <hidayatsarip2210@gmail.com>
 * @copyright Sarip Hidayat 2024
 * @date 02/08/24
 */

import APIClient from '../lib/ApiClient';
import { ListResponse, PostResponse, PutResponse, DeleteResponse } from '@/types/apiTypes';

export interface InActionForm {
    id?: number;
    endpoint: string;
    scope: string;
    label: string;
    title: string;
    created_at: number;
    updated_at: number;
}

export interface InAction {
    id: number;
    endpoint: string;
    scope: string;
    label: string;
    title: string;
    created_at: number;
    updated_at: number;
}


class Action {
    async list(query: Record<string, any> = {}): Promise<ListResponse<InAction[]>> {
        return await APIClient.get('actions', query);
    }
    async scope() {
        return await APIClient.get('actions/scope');
    }

    async create(item: InActionForm): Promise<PostResponse> {
        return await APIClient.post('/action', item);
    }

    async update(id: number, item: InActionForm) : Promise<PutResponse<InAction>>{
        return await APIClient.put(`/action/${id}`, item);
    }

    async delete(id: number) : Promise<DeleteResponse> {
        return await APIClient.delete(`/action/${id}`);
    }
}


export type {InActionForm, InAction}
export { Action };