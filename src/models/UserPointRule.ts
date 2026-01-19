/**
 * UserPointRule Model - API Client
 * @author Sarip Hidayat <hidayatsarip2210@gmail.com>
 * @date 2026-01-19
 */

import APIClient from '../lib/ApiClient';

export interface InUserPointRule {
    activity_name: string;
    description: string;
    points: number;
    is_active: number;
    min_transaction_amount: string;
    max_times_per_day: number;
    cooldown_minutes: number;
    start_date: string;
    end_date: string | null;
    point_expiry_days: number;
    updated_at: string;
}

class UserPointRule {
    async list(query: Record<string, any> = {}): Promise<{ userpoint_rules: InUserPointRule[] }> {
        return await APIClient.get('userpoint_rules', query);
    }
}

export { UserPointRule };
