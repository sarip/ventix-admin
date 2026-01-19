/**
 * Facility Booking Model
 */

import APIClient from '../lib/ApiClient';
import { ListResponse, PostResponse, PutResponse, DeleteResponse } from '@/types/apiTypes';

export interface InFacilityBooking {
    id: number;
    facility_id: number;
    user_id: number;
    facility_code: string;
    booking_date: string;
    start_time: string;
    end_time: string;
    total_hours: number;
    total_price: number;
    status_id: number;
    notes: string;
    created_at: string;
    updated_at: string;
    facility?: {
        id: number;
        name: string;
        category: string;
    };
    user?: {
        id: number;
        name: string;
        email: string;
    };
    status?: {
        id: number;
        name: string;
        color_code: string;
    };
}

export interface InFacilityBookingForm {
    id?: number;
    facility_id: number;
    user_id: number;
    booking_date: string;
    start_time: string;
    end_time: string;
    notes?: string;
}

export interface InBookingCalculation {
    total_hours: number;
    total_price: number;
    breakdown: {
        day_type: string;
        hours: number;
        price_per_hour: number;
        subtotal: number;
    }[];
}

class FacilityBooking {
    async list(query: Record<string, any> = {}): Promise<ListResponse<InFacilityBooking[]>> {
        return await APIClient.get('facility_bookings', query);
    }

    async detail(id: number): Promise<{ booking: InFacilityBooking }> {
        return await APIClient.get(`facility_booking/${id}`);
    }

    async create(data: InFacilityBookingForm): Promise<PostResponse> {
        return await APIClient.post('facility_booking', data);
    }

    async update(id: number, data: InFacilityBookingForm): Promise<PutResponse<InFacilityBooking>> {
        return await APIClient.put(`facility_booking/${id}`, data);
    }

    async delete(id: number): Promise<DeleteResponse> {
        return await APIClient.delete(`facility_booking/${id}`);
    }

    async updateStatus(id: number, status: string): Promise<PutResponse<InFacilityBooking>> {
        return await APIClient.put(`facility_booking/${id}/status`, { status });
    }

    async checkAvailability(data: InFacilityBookingForm): Promise<{ available: boolean; message?: string }> {
        return await APIClient.post('facility_booking/check_availability', data);
    }

    async calculatePrice(data: InFacilityBookingForm): Promise<InBookingCalculation> {
        return await APIClient.post('facility_booking/calculate_price', data);
    }
}

export { FacilityBooking };
