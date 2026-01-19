/**
 * Facility Pricing Model
 */

import APIClient from '../lib/ApiClient';
import { ListResponse, PostResponse, PutResponse, DeleteResponse } from '@/types/apiTypes';

export type DayType = 'Weekday' | 'Weekend' | 'Holiday';

export interface InFacilityPricing {
    id: number;
    facility_id: number;
    day_type: DayType;
    start_time: string;
    end_time: string;
    price_per_hour: number;
    created_at: string;
    updated_at: string;
}

export interface InFacilityPricingForm {
    id?: number;
    facility_id: number;
    day_type: DayType;
    start_time: string;
    end_time: string;
    price_per_hour: number;
}

class FacilityPricing {
    async list(query: Record<string, any> = {}): Promise<ListResponse<InFacilityPricing[]>> {
        return await APIClient.get('facility_pricings', query);
    }

    async detail(id: number): Promise<{ pricing: InFacilityPricing }> {
        return await APIClient.get(`facility_pricing/${id}`);
    }

    async create(data: InFacilityPricingForm): Promise<PostResponse> {
        return await APIClient.post('facility_pricing', data);
    }

    async update(id: number, data: InFacilityPricingForm): Promise<PutResponse<InFacilityPricing>> {
        return await APIClient.put(`facility_pricing/${id}`, data);
    }

    async delete(id: number): Promise<DeleteResponse> {
        return await APIClient.delete(`facility_pricing/${id}`);
    }

    async checkOverlap(data: InFacilityPricingForm): Promise<{ has_overlap: boolean }> {
        return await APIClient.post('facility_pricing/check_overlap', data);
    }
}

export { FacilityPricing };
