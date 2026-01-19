/**
 * Facility Booking Status Model
 */

import APIClient from '../lib/ApiClient';
import { ListResponse } from '@/types/apiTypes';

export interface InFacilityBookingStatus {
    id: number;
    name: string;
    display_name: string;
    color_code: string;
    description: string;
    created_at: string;
    updated_at: string;
}

class FacilityBookingStatus {
    async list(query: Record<string, any> = {}): Promise<ListResponse<InFacilityBookingStatus[]>> {
        return await APIClient.get('facility_booking_statuses', query);
    }

    async detail(id: number): Promise<{ status: InFacilityBookingStatus }> {
        return await APIClient.get(`facility_booking_status/${id}`);
    }
}

export { FacilityBookingStatus };
