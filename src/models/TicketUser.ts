/**
 * @author Sarip Hidayat <hidayatsarip2210@gmail.com>
 * @copyright Sarip Hidayat 2024
 * @date 2026-01-14
 */

import APIClient from '../lib/ApiClient';
import { ListResponse, PostResponse, PutResponse, DeleteResponse } from '@/types/apiTypes';
import {InEventCat, InEventCatForm} from "@/models/EventCat";
import {InEvent} from "@/models/Event";

export interface InTicketUser {
    id: number;
    user_id: number;
    guest_name: string | null;
    guest_email: string | null;
    guest_phone: string | null;
    event_ticket_id: number;
    ticket_code: string;
    status: 'VALID' | 'USED' | 'CANCELLED';
    check_in_at: string | null;
    check_in_by: number | null;
    created_at: string;
    user?: {
        id: number;
        username: string;
        name: string;
        email: string;
        phone: string;
        role: string;
    };
    ticket?: {
        id: number;
        event_id: number;
        name: string;
        description: string;
        price: string;
        total_capacity: number;
        remaining_capacity: number;
        max_per_order: number;
        sales_start_date: string;
        sales_end_date: string;
        is_active: number;
        sort_order: number;
        created_at: string;
        event : InEvent;
    };
}

class TicketUser {
    async list(query: Record<string, any> = {}): Promise<ListResponse<InTicketUser[]>> {
        return await APIClient.get('user_tickets', query);
    }

    async detail(id: number): Promise<{ user_ticket: InTicketUser }> {
        return await APIClient.get(`user_ticket/${id}`);
    }

    async update(id: any, data: InTicketUser) : Promise<PutResponse<InEventCat>>{
        return await APIClient.put(`/userticket/${id}`, data);
    }
}

export type { InTicketUser };
export { TicketUser };
