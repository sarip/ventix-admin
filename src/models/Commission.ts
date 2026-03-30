/**
 * @author Sarip Hidayat <hidayatsarip2210@gmail.com>
 * @copyright Sarip Hidayat 2024
 * @date 2026-03-14
 */

import APIClient from '../lib/ApiClient';
import { ListResponse } from '@/types/apiTypes';

export interface InCommissionRecord {
    id: number;
    order_id: number;
    order_code: string;
    customer_name: string;
    module: 'event' | 'facility';
    rule_key: string;
    base_amount: string;
    calculated_amount: string;
    created_at: string;
}

export interface CommissionAnalysisData {
    summary: Array<{ rule_key: string; total: string }>;
    modules: Array<{ module: string; total: string }>;
    trends: Array<{ date: string; total: string }>;
    period: { start: string; end: string };
}

class Commission {
    async list(query: Record<string, any> = {}): Promise<ListResponse<InCommissionRecord[]>> {
        return await APIClient.get('commissions', query);
    }

    async analysis(query: Record<string, any> = {}): Promise<CommissionAnalysisData> {
        const response = await APIClient.get('commissions/analysis', query);
        return response as CommissionAnalysisData;
    }
}

export { Commission };
