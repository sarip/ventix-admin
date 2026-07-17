/**
 * Facility Model
 */

import APIClient from '../lib/ApiClient';
import { ListResponse, PostResponse, PutResponse, DeleteResponse } from '@/types/apiTypes';

export interface InFacility {
    id: number;
    name: string;
    facility_organizer_id: number;
    category: string;
    description: string;
    user_id_pic: number;
    is_available: boolean;
    slug?: string;
    email?: string;
    phone?: string;
    address?: string;
    latitude?: number | null;
    longitude?: number | null;
    banner_image?: string;
    created_at: string;
    updated_at: string;
    user_pic?: {
        id: number;
        name: string;
        email: string;
        phone?: string;
    };
    facility_organizer?: {
        id: number;
        owner_user_id: number;
        facility_name: string;
        company_name: string;
        email: string;
        phone: string;
        website: string;
        address: string;
    };
    facility_gallery?: any[];
    facility_amenities?: any[];
    facility_features?: any[];
    facility_operating_hours?: any[];
    facility_rules?: any[];
}

export interface InFacilityForm {
    id?: number;
    facility_organizer_id: number;
    name: string;
    category: string;
    description: string;
    user_id_pic: number;
    is_available: boolean;
    slug?: string;
    email?: string;
    phone?: string;
    address?: string;
    latitude?: number | null;
    longitude?: number | null;
    banner_image?: string;
}

class Facility {
    async list(query: Record<string, any> = {}): Promise<ListResponse<InFacility[]>> {
        return await APIClient.get('facilities', query);
    }

    async detail(id: number): Promise<{ facility: InFacility }> {
        return await APIClient.get(`facilities/${id}`);
    }

    async create(data: InFacilityForm): Promise<PostResponse> {
        return await APIClient.post('facilities', data);
    }

    async update(id: number, data: InFacilityForm): Promise<PutResponse<InFacility>> {
        return await APIClient.put(`facilities/${id}`, data);
    }

    async delete(id: number): Promise<DeleteResponse> {
        return await APIClient.delete(`facilities/${id}`);
    }

    // ==================== FACILITY PROFILING METHODS ====================

    /**
     * Save complete facility with all profiling data
     */
    async saveComplete(id: number | null, formData: FormData): Promise<any> {
        if (id) {
            return await APIClient.post(`facilities/${id}`, formData);
        } else {
            return await APIClient.post(`facilities`, formData);
        }
    }

    // ==================== FACILITY GALLERY ====================

    async getGallery(facilityId: number): Promise<{ gallery: any[] }> {
        return await APIClient.get(`facilities/${facilityId}/gallery`);
    }

    async uploadGalleryImage(facilityId: number, formData: FormData): Promise<any> {
        return await APIClient.post(`facilities/${facilityId}/gallery`, formData);
    }

    async updateGalleryImage(facilityId: number, imageId: number, data: any): Promise<any> {
        return await APIClient.put(`facilities/${facilityId}/gallery/${imageId}`, data);
    }

    async setFeaturedGalleryImage(facilityId: number, imageId: number): Promise<any> {
        return await APIClient.put(`facilities/${facilityId}/gallery/${imageId}/featured`, {});
    }

    async deleteGalleryImage(facilityId: number, imageId: number): Promise<any> {
        return await APIClient.delete(`facilities/${facilityId}/gallery/${imageId}`);
    }

    // ==================== FACILITY AMENITIES ====================

    async getAllAmenities(): Promise<{ amenities: any[] }> {
        return await APIClient.get('amenities');
    }

    async getAmenities(facilityId: number): Promise<{ amenities: any[] }> {
        return await APIClient.get(`facilities/${facilityId}/amenities`);
    }

    async syncAmenities(facilityId: number, amenityIds: number[]): Promise<any> {
        return await APIClient.post(`facilities/${facilityId}/amenities/sync`, { amenity_ids: amenityIds });
    }

    // ==================== FACILITY FEATURES ====================

    async getFeatures(facilityId: number): Promise<{ features: any[] }> {
        return await APIClient.get(`facilities/${facilityId}/features`);
    }

    async addFeature(facilityId: number, data: any): Promise<any> {
        return await APIClient.post(`facilities/${facilityId}/features`, data);
    }

    async updateFeature(facilityId: number, featureId: number, data: any): Promise<any> {
        return await APIClient.put(`facilities/${facilityId}/features/${featureId}`, data);
    }

    async deleteFeature(facilityId: number, featureId: number): Promise<any> {
        return await APIClient.delete(`facilities/${facilityId}/features/${featureId}`);
    }

    // ==================== FACILITY OPERATING HOURS ====================

    async getOperatingHours(facilityId: number): Promise<{ operating_hours: any[] }> {
        return await APIClient.get(`facilities/${facilityId}/operating-hours`);
    }

    async syncOperatingHours(facilityId: number, data: any): Promise<any> {
        return await APIClient.post(`facilities/${facilityId}/operating-hours/sync`, data);
    }

    async copyOperatingHours(facilityId: number, data: any): Promise<any> {
        return await APIClient.post(`facilities/${facilityId}/operating-hours/copy`, data);
    }

    // ==================== FACILITY RULES ====================

    async getRules(facilityId: number): Promise<{ rules: any[] }> {
        return await APIClient.get(`facilities/${facilityId}/rules`);
    }

    async addRule(facilityId: number, data: any): Promise<any> {
        return await APIClient.post(`facilities/${facilityId}/rules`, data);
    }

    async updateRule(facilityId: number, ruleId: number, data: any): Promise<any> {
        return await APIClient.put(`facilities/${facilityId}/rules/${ruleId}`, data);
    }

    async deleteRule(facilityId: number, ruleId: number): Promise<any> {
        return await APIClient.delete(`facilities/${facilityId}/rules/${ruleId}`);
    }
}

export { Facility };
