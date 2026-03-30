
/**
 * @author Sarip Hidayat <hidayatsarip2210@gmail.com>
 * @copyright Sarip Hidayat 2024
 * @date 02/08/24
 */

import APIClient from '../lib/ApiClient';
import { ListResponse, PostResponse, PutResponse, DeleteResponse } from '@/types/apiTypes';

export interface InCommisionRulesForm {
    id: number | null;
    module: string;
    rule_key: string;
    percentage: string;
    fixed_amount: string;
    is_active: number;
}

export interface InCommisionRules {
    id: number;
    module: string;
    rule_key: string;
    percentage: string;
    fixed_amount: string;
    is_active: number;
    created_at: string;
    updated_at: string;
}


class CommisionRules {
    async list(query: Record<string, any> = {}): Promise<ListResponse<InCommisionRules[]>> {
        return await APIClient.get('commission_rules', query);
    }

    async create(CommisionRules: InCommisionRulesForm): Promise<PostResponse> {
        return await APIClient.post('/commissionrule', CommisionRules);
    }

    async update(id: number, CommisionRules: InCommisionRulesForm) : Promise<PutResponse<InCommisionRules>>{
        return await APIClient.put(`/commissionrule/${id}`, CommisionRules);
    }

    async delete(id: number) : Promise<DeleteResponse> {
        return await APIClient.delete(`/commissionrule/${id}`);
    }
}


export type {InCommisionRulesForm, InCommisionRules}
export { CommisionRules };