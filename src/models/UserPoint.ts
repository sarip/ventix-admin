/**
 * UserPoint Model - API Client
 * @author Sarip Hidayat <hidayatsarip2210@gmail.com>
 * @date 2026-01-19
 */

import APIClient from '../lib/ApiClient';

export interface InUser {
    id: number;
    username: string;
    name: string;
    email: string;
    phone: string;
    role: string;
    status: string;
    created_at: string;
}

export interface InPointLog {
    id: number;
    activity_type: string;
    amount: number;
    point_status: string;
    description: string;
    expiry_date: string;
    created_at: string;
}

export interface InUserPoint {
    user_id: number;
    current_balance: number;
    total_earned: number;
    last_updated: string;
    user: InUser;
    point_logs: InPointLog[];
}

class UserPoint {
    async list(query: Record<string, any> = {}): Promise<{ user_points: InUserPoint[] }> {
        return await APIClient.get('user_points', query);
    }
}

export { UserPoint };
