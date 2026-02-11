
/**
 * @author Sarip Hidayat <hidayatsarip2210@gmail.com>
 * @copyright Sarip Hidayat 2024
 * @date 02/08/24
 */

import APIClient from '../lib/ApiClient';
import { ListResponse, PostResponse, PutResponse, DeleteResponse } from '@/types/apiTypes';

export interface InMasterTaxeForm {
    id: number | null;
    code: string;
    name: string;
    rate: string;
    is_active: number;
}

export interface InMasterTaxe {
    id: number;
    code: string;
    name: string;
    rate: string;
    is_active: number;
    created_at: string;
    updated_at: string;
}


class MasterTaxe {
    async list(query: Record<string, any> = {}): Promise<ListResponse<InMasterTaxe[]>> {
        return await APIClient.get('master_taxes', query);
    }

    async create(MasterTaxe: InMasterTaxeForm): Promise<PostResponse> {
        return await APIClient.post('/mastertaxe', MasterTaxe);
    }

    async update(id: number, MasterTaxe: InMasterTaxeForm) : Promise<PutResponse<InMasterTaxe>>{
        return await APIClient.put(`/mastertaxe/${id}`, MasterTaxe);
    }

    async delete(id: number) : Promise<DeleteResponse> {
        return await APIClient.delete(`/mastertaxe/${id}`);
    }
}


export type {InMasterTaxeForm, InMasterTaxe}
export { MasterTaxe };