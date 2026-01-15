/**
 * @author Sarip Hidayat <hidayatsarip2210@gmail.com>
 * @copyright Sarip Hidayat 2024
 * @date 2026-01-14
 */

import APIClient from '../lib/ApiClient';
import { ListResponse, PostResponse, PutResponse, DeleteResponse } from '@/types/apiTypes';
import {InEvent} from "@/models/Event";

export interface InEventTicketForm {
    id?: number | null;
    event_id: number | null;
    name: string;
    description?: string | null;
    price: number;
    total_capacity: number;
    remaining_capacity: number;
    max_per_order?: number;
    sales_start_date?: string | null;
    sales_end_date?: string | null;
    is_active?: boolean;
    sort_order?: number;
}

export interface InEventTicket {
    id: number;
    event_id: number;
    name: string;
    description: string | null;
    price: number;
    total_capacity: number;
    remaining_capacity: number;
    max_per_order: number;
    sales_start_date: string | null;
    sales_end_date: string | null;
    is_active: boolean;
    sort_order: number;
    created_at: string;
    event: InEvent;
}

class EventTicket {
    async list(query: Record<string, any> = {}): Promise<ListResponse<InEventTicket[]>> {
        return await APIClient.get('event_ticket', query);
    }

    async create(ticket: InEventTicketForm): Promise<PostResponse> {
        return await APIClient.post('/eventticket', ticket);
    }

    async update(id: number, ticket: InEventTicketForm): Promise<PutResponse<InEventTicket>> {
        return await APIClient.put(`/eventticket/${id}`, ticket);
    }

    async delete(id: number): Promise<DeleteResponse> {
        return await APIClient.delete(`/eventticket/${id}`);
    }
}

export type { InEventTicketForm, InEventTicket };
export { EventTicket };
