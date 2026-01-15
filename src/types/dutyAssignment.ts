// Types for Duty Assignment
export interface InDutyAssignment {
    id: number;
    user_id: number;
    start_date: string;
    end_date: string;
    shift_id: number;
    duty_type: 'technician' | 'cleaning' | 'security';
    asset_id?: number;
    space_id?: number;
    zone_id?: number;
    rotation: 'none' | 'daily' | 'weekly';
    notes?: string;
    created_at?: string;
    updated_at?: string;

    // Joined data
    fullname?: string;
    shift_name?: string;
    asset_name?: string;
    space_name?: string;
    zone_name?: string;
}

export interface DutyAssignmentListResponse {
    success: boolean;
    count: number;
    duties: InDutyAssignment[];
}

export interface DutyAssignmentRequest {
    user_id: number;
    shift_id: number;
    start_date: string;
    end_date: string;
    duty_type: 'technician' | 'cleaning' | 'security';
    asset_id?: number;
    space_id?: number;
    zone_id?: number;
    rotation?: 'none' | 'daily' | 'weekly';
    notes?: string;
}
