// Types for Attendance
export interface Attendance {
    id: number;
    user_id: number;
    shift_id?: number;
    duty_assignment_id?: number;
    attendance_date: string;
    clock_in?: string;
    clock_out?: string;
    geo_in?: string;
    geo_out?: string;
    status: 'present' | 'absent' | 'late' | 'on_leave';
    notes?: string;
    created_at?: string;
    updated_at?: string;
}

export interface ClockInRequest {
    user_id: number;
    lat: number;
    lon: number;
}

export interface ClockOutRequest {
    user_id: number;
    lat: number;
    lon: number;
    notes?: string;
}

export interface ClockInResponse {
    success: boolean;
    message: string;
    status?: 'present' | 'late';
    attendance_id?: number;
    shift?: {
        shift_id: number;
        shift_name: string;
        start_time: string;
        end_time: string;
    };
}

export interface ClockOutResponse {
    success: boolean;
    message: string;
    attendance_id?: number;
}

export interface StaffStatusResponse {
    success: boolean;
    data: {
        total_staff: number;
        clocked_in: number;
        clocked_out: number;
        on_shift: number;
        late: number;
        absent: number;
        staff: StaffMember[];
    };
}

export interface StaffMember {
    user_id: number;
    fullname: string;
    email: string;
    shift_name?: string;
    clock_in?: string;
    clock_out?: string;
    geo_in?: string;
    geo_out?: string;
    status: string;
    is_on_shift: boolean;
}
