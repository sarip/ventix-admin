
/**
 * @author Sarip Hidayat <hidayatsarip2210@gmail.com>
 * @copyright Sarip Hidayat 2024
 * @date 02/08/24
 */

import APIClient from '../lib/ApiClient';
import { ListResponse, PostResponse, PutResponse, DeleteResponse } from '@/types/apiTypes';

export interface InSysUserTicketStatusForm {
    name: string;
    display_name: string;
    description: string;
    color_code: string;
}

export interface InSysUserTicketStatus {
    name: string;
    display_name: string;
    description: string;
    color_code: string;
}



class SysUserTicketStatus {
    async list(query: Record<string, any> = {}): Promise<ListResponse<InSysUserTicketStatus[]>> {
        return await APIClient.get('sys_userticket_status', query);
    }

    async create(SysUserTicketStatus: InSysUserTicketStatusForm): Promise<PostResponse> {
        return await APIClient.post('/sys_userticket_status', SysUserTicketStatus);
    }

    async update(id: any, SysUserTicketStatus: InSysUserTicketStatusForm) : Promise<PutResponse<InSysUserTicketStatus>>{
        return await APIClient.put(`/sys_userticket_status/${id}`, SysUserTicketStatus);
    }

    async delete(id: any) : Promise<DeleteResponse> {
        return await APIClient.delete(`/sys_userticket_status/${id}`);
    }
}


export { SysUserTicketStatus };