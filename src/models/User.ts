/**
 * @author Sarip Hidayat <hidayatsarip2210@gmail.com>
 * @copyright Sarip Hidayat 2024
 * @date 02/08/24
 */

import APIClient from '../lib/ApiClient';
import { ListResponse, PostResponse, PutResponse, DeleteResponse } from '@/types/apiTypes';

export interface InUserForm {
    id?: number;
    role_id: string | number;
    username: string;
    password: string;
    fullname: string;
}

export interface InUser {
    id: number;
    role_id: number;
    username: string;
    password: string;
    fullname: string;
    created_at: number;
    updated_at?: number;
}

export let userForm : InUserForm = {
    role_id: 0,
    username: '',
    password: '',
    fullname: ''
}


class User {
    async list(query: Record<string, any> = {}): Promise<ListResponse<InUser[]>> {
        return await APIClient.get('users', query);
    }

    async lists(query: Record<string, any> = {}): Promise<ListResponse<InUser[]>> {
        return await APIClient.get('users-lists', query);
    }

    async create(user: InUserForm): Promise<PostResponse> {
        return await APIClient.post('/user', user);
    }

    async update(id: number, user: InUserForm) : Promise<PutResponse<InUser>>{
        return await APIClient.put(`/user/${id}`, user);
    }

    async delete(id: number) : Promise<DeleteResponse> {
        return await APIClient.delete(`/user/${id}`);
    }
}


export type {InUserForm, InUser, userForm}
export { User };