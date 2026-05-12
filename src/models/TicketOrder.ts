/**
 * @author Sarip Hidayat <hidayatsarip2210@gmail.com>
 * @copyright Sarip Hidayat 2024
 * @date 2026-01-14
 */

import APIClient from '../lib/ApiClient';
import { ListResponse, PostResponse, PutResponse, DeleteResponse } from '@/types/apiTypes';
import { InEventTicket } from "@/models/EventTicket";

export interface InOrderItem {
    id: number;
    order_id: number;
    event_id?: number;
    event_ticket_id: number;
    event_date: string;
    quantity: number;
    unit_price: string;
    subtotal: string;
    event_ticket?: InEventTicket
}

export interface InTicketOrder {
    id: number;
    user_id: number;
    guest_name: string | null;
    guest_email: string | null;
    guest_phone: string | null;
    order_source: string;
    subtotal_amount: string;
    admin_fee_amount: string;
    order_code: string;
    total_amount: string;
    status: string;
    payment_method: string;
    created_at: string;
    user?: {
        id: number;
        username: string;
        name: string;
        email: string;
        phone: string;
        role: string;
    };
    order_item?: InOrderItem[];
    commissions?: {
        id: number;
        order_id: number;
        module: string;
        rule_key: string;
        base_amount: string;
        calculated_amount: string;
        created_at: string;
    }[];
    status_badge?: string;
    payment_proof?: string;
    order_items?: InOrderItem[];
}

class TicketOrder {
    async list(query: Record<string, any> = {}): Promise<ListResponse<InTicketOrder[]>> {
        return await APIClient.get('orders', query);
    }

    async detail(id: number): Promise<{ order: InTicketOrder }> {
        return await APIClient.get(`order/${id}`);
    }

    async create(data: Partial<InTicketOrder>): Promise<PostResponse> {
        return await APIClient.post('order', data);
    }

    async update(id: number, data: Partial<InTicketOrder>): Promise<PutResponse<InTicketOrder>> {
        return await APIClient.put(`order/${id}`, data);
    }

    async delete(id: number): Promise<DeleteResponse> {
        return await APIClient.delete(`order/${id}`);
    }

    async previewCommission(data: { module: string, base_amount: number }) {
        return await APIClient.post('order/preview-commission', data);
    }
}

export { TicketOrder };
