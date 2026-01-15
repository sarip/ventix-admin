
/**
 * @author Sarip Hidayat <hidayatsarip2210@gmail.com>
 * @copyright Sarip Hidayat 2024
 * @date 02/08/24
 */

import APIClient from '../lib/ApiClient';
import { ListResponse, PostResponse, PutResponse, DeleteResponse } from '@/types/apiTypes';

export interface InTenantForm {
    id?: number;
    name: string;
    contact_name: string;
    contact_email: string;
    contact_phone: string;
    unit_code: string;
}

export interface InTenant {
    id: number;
    name: string;
    contact_name: string;
    contact_email: string;
    contact_phone: string;
    unit_code: string;
    created_at: string;
    updated_at: string;
}


class Tenant {
    async list(query: Record<string, any> = {}): Promise<ListResponse<InTenant[]>> {
        return await APIClient.get('tenants', query);
    }

    async create(tenant: InTenantForm): Promise<PostResponse> {
        return await APIClient.post('/tenant', tenant);
    }

    async update(id: number, tenant: InTenantForm) : Promise<PutResponse<InTenant>>{
        return await APIClient.put(`/tenant/${id}`, tenant);
    }

    async delete(id: number) : Promise<DeleteResponse> {
        return await APIClient.delete(`/tenant/${id}`);
    }
}


export type {InTenantForm, InTenant}
export { Tenant };