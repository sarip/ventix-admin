/**
 * Facility Profiling Types
 * @author Sarip Hidayat <hidayatsarip2210@gmail.com>
 * @date 2026-07-02
 */

// ==================== FACILITY GALLERY ====================

export interface FacilityGallery {
    id: number;
    facility_id: number;
    image: string;
    title?: string;
    description?: string;
    sort_order: number;
    is_featured: boolean;
    created_at?: string;
    updated_at?: string;
}

export interface FacilityGalleryFormData {
    image?: File;
    title?: string;
    description?: string;
    sort_order?: number;
    is_featured?: boolean;
}

// ==================== FACILITY AMENITIES ====================

export interface FacilityAmenity {
    id: number;
    name: string;
    icon?: string;
    description?: string;
    is_active: boolean;
    created_at?: string;
    updated_at?: string;
}

export interface FacilityAmenityFormData {
    name: string;
    icon?: string;
    description?: string;
}

export interface FacilityHasAmenity {
    id: number;
    facility_id: number;
    amenity_id: number;
    created_at?: string;
}

// ==================== FACILITY FEATURES (SPECIFICATIONS) ====================

export interface FacilityFeature {
    id: number;
    facility_id: number;
    feature_name: string;
    feature_value: string;
    sort_order: number;
    created_at?: string;
    updated_at?: string;
}

export interface FacilityFeatureFormData {
    feature_name: string;
    feature_value: string;
    sort_order?: number;
}

// ==================== FACILITY OPERATING HOURS ====================

export type DayOfWeek = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export const DAY_NAMES: Record<DayOfWeek, string> = {
    1: 'Monday',
    2: 'Tuesday',
    3: 'Wednesday',
    4: 'Thursday',
    5: 'Friday',
    6: 'Saturday',
    7: 'Sunday'
};

export const DAY_SHORT_NAMES: Record<DayOfWeek, string> = {
    1: 'Mon',
    2: 'Tue',
    3: 'Wed',
    4: 'Thu',
    5: 'Fri',
    6: 'Sat',
    7: 'Sun'
};

export interface FacilityOperatingHour {
    id: number;
    facility_id: number;
    day_of_week: DayOfWeek;
    open_time?: string;
    close_time?: string;
    is_closed: boolean;
    is_holiday_schedule: boolean;
    created_at?: string;
    updated_at?: string;
}

export interface FacilityOperatingHourFormData {
    day_of_week: DayOfWeek;
    open_time?: string;
    close_time?: string;
    is_closed?: boolean;
    is_holiday_schedule?: boolean;
}

export interface WeeklyHours {
    [key: number]: {
        open_time?: string;
        close_time?: string;
        is_closed?: boolean;
    };
}

// ==================== FACILITY RULES ====================

export interface FacilityRule {
    id: number;
    facility_id: number;
    rule_text: string;
    sort_order: number;
    created_at?: string;
    updated_at?: string;
}

export interface FacilityRuleFormData {
    rule_text: string;
    sort_order?: number;
}

// ==================== FACILITY STATISTICS ====================

export interface FacilityStatistics {
    id: number;
    facility_id: number;
    total_bookings: number;
    total_revenue: number;
    total_visitors: number;
    total_events: number;
    total_followers: number;
    total_reviews: number;
    average_rating: number;
    last_calculated_at?: string;
    created_at?: string;
    updated_at?: string;
}

// ==================== COMBINED TYPES ====================

export interface FacilityProfile {
    facility_id: number;
    gallery?: FacilityGallery[];
    amenities?: (FacilityAmenity & { is_selected?: boolean })[];
    features?: FacilityFeature[];
    operating_hours?: FacilityOperatingHour[];
    rules?: FacilityRule[];
    statistics?: FacilityStatistics;
}

// ==================== API RESPONSE TYPES ====================

export interface FacilityGalleryResponse {
    gallery: FacilityGallery[];
}

export interface FacilityAmenitiesResponse {
    amenities: (FacilityAmenity & { is_selected?: boolean })[];
}

export interface FacilityFeaturesResponse {
    features: FacilityFeature[];
}

export interface FacilityOperatingHoursResponse {
    operating_hours: FacilityOperatingHour[];
}

export interface FacilityRulesResponse {
    rules: FacilityRule[];
}

export interface FacilityStatisticsResponse {
    statistics: FacilityStatistics;
}

// ==================== SORT/REORDER TYPES ====================

export interface ReorderItem {
    id: number;
    sort_order: number;
}

// ==================== VALIDATION TYPES ====================

export interface FacilityGalleryValidation {
    max_images: number;
    max_file_size_mb: number;
    allowed_extensions: string[];
}

export const FACILITY_GALLERY_VALIDATION: FacilityGalleryValidation = {
    max_images: 50,
    max_file_size_mb: 10,
    allowed_extensions: ['jpg', 'jpeg', 'png', 'webp']
};

// ==================== DEFAULT AMENITIES ====================

export const DEFAULT_AMENITIES: Omit<FacilityAmenity, 'id' | 'is_active' | 'created_at' | 'updated_at'>[] = [
    { name: 'Parking', icon: 'parking', description: 'Parking area available' },
    { name: 'WiFi', icon: 'wifi', description: 'Free WiFi access' },
    { name: 'Mushola', icon: 'mosque', description: 'Prayer room available' },
    { name: 'Locker', icon: 'locker', description: 'Storage lockers' },
    { name: 'Shower', icon: 'shower', description: 'Shower facilities' },
    { name: 'Cafe', icon: 'cafe', description: 'Cafe or food court' },
    { name: 'AC', icon: 'ac', description: 'Air conditioning' },
    { name: 'Waiting Room', icon: 'waiting-room', description: 'Waiting area' },
    { name: 'CCTV', icon: 'cctv', description: 'CCTV surveillance' },
    { name: 'Sound System', icon: 'sound-system', description: 'Sound system equipment' },
    { name: 'VIP Room', icon: 'vip-room', description: 'VIP room available' }
];

// ==================== EXAMPLE DATA ====================

export const EXAMPLE_FEATURES: Omit<FacilityFeature, 'id' | 'facility_id' | 'created_at' | 'updated_at'>[] = [
    { feature_name: 'Total Court', feature_value: '8', sort_order: 1 },
    { feature_name: 'Court Type', feature_value: 'Vinyl', sort_order: 2 },
    { feature_name: 'Capacity', feature_value: '500', sort_order: 3 },
    { feature_name: 'Lighting', feature_value: 'LED', sort_order: 4 },
    { feature_name: 'Sound System', feature_value: 'JBL', sort_order: 5 },
    { feature_name: 'Air Conditioner', feature_value: 'Central AC', sort_order: 6 }
];

export const EXAMPLE_RULES: Omit<FacilityRule, 'id' | 'facility_id' | 'created_at' | 'updated_at'>[] = [
    { rule_text: 'No smoking.', sort_order: 1 },
    { rule_text: 'Wear sports shoes.', sort_order: 2 },
    { rule_text: 'No outside food.', sort_order: 3 },
    { rule_text: 'Booking payment required before usage.', sort_order: 4 },
    { rule_text: 'Cancellation maximum 24 hours before schedule.', sort_order: 5 }
];
