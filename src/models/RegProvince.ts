
/**
 * @author Sarip Hidayat <hidayatsarip2210@gmail.com>
 * @copyright Sarip Hidayat 2024
 * @date 02/08/24
 */

import APIClient from '../lib/ApiClient';
import { ListResponse, PostResponse, PutResponse, DeleteResponse } from '@/types/apiTypes';

export interface InRegProvinceForm {
    id?: number;
    name: string;
}

export interface InRegProvince {
    id: number;
    name: string;
}


class RegProvince {
    async list(query: Record<string, any> = {}): Promise<ListResponse<InRegProvince[]>> {
        return await APIClient.get('reg_provinces', query);
    }

    async create(RegProvince: InRegProvinceForm): Promise<PostResponse> {
        return await APIClient.post('/regprovince', RegProvince);
    }

    async update(id: number, RegProvince: InRegProvinceForm) : Promise<PutResponse<InRegProvince>>{
        return await APIClient.put(`/regprovince/${id}`, RegProvince);
    }

    async delete(id: number) : Promise<DeleteResponse> {
        return await APIClient.delete(`/regprovince/${id}`);
    }
}


export type {InRegProvinceForm, InRegProvince}
export { RegProvince };