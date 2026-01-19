
/**
 * @author Sarip Hidayat <hidayatsarip2210@gmail.com>
 * @copyright Sarip Hidayat 2024
 * @date 02/08/24
 */

import APIClient from '../lib/ApiClient';
import { ListResponse, PostResponse, PutResponse, DeleteResponse } from '@/types/apiTypes';

export interface InOrderStatusForm {
    name: string;
    display_name: string;
    description: string;
    color_code: string;
}

export interface InOrderStatus {
    name: string;
    display_name: string;
    description: string;
    color_code: string;
}



class OrderStatus {
    async list(query: Record<string, any> = {}): Promise<ListResponse<InOrderStatus[]>> {
        return await APIClient.get('orders_status', query);
    }

    async create(OrderStatus: InOrderStatusForm): Promise<PostResponse> {
        return await APIClient.post('/ordersstatu', OrderStatus);
    }

    async update(id: any, OrderStatus: InOrderStatusForm) : Promise<PutResponse<InOrderStatus>>{
        return await APIClient.put(`/ordersstatu/${id}`, OrderStatus);
    }

    async delete(id: any) : Promise<DeleteResponse> {
        return await APIClient.delete(`/ordersstatu/${id}`);
    }
}


export { OrderStatus };