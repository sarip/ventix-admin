/**
 * Role Model - API Client
 * @author Sarip Hidayat <hidayatsarip2210@gmail.com>
 * @date 2026-01-19
 */

import APIClient from '../lib/ApiClient';
import {
    InRole,
    InRoleForm,
    RoleListQuery,
    RolePermissions,
    UpdatePermissionsRequest,
    UpdateMenuAccessRequest
} from '@/types/role';

interface ListResponse<T> {
    roles: T;
    pagination: {
        page: number;
        per_page: number;
        total: number;
        page_count: number;
        filtered_total: number;
    };
}

class Role {
    async list(query: RoleListQuery = {}): Promise<ListResponse<InRole[]>> {
        return await APIClient.get('roles', query);
    }

    async show(id: number): Promise<{ role: InRole }> {
        return await APIClient.get(`role/${id}`);
    }

    async create(role: InRoleForm): Promise<{ role: InRole }> {
        return await APIClient.post('role', role);
    }

    async update(id: number, role: Partial<InRoleForm>): Promise<{ role: InRole }> {
        return await APIClient.put(`role/${id}`, role);
    }

    async delete(id: number): Promise<{ success: boolean }> {
        return await APIClient.delete(`role/${id}`);
    }

    async getPermissions(id: number): Promise<{ permissions: RolePermissions }> {
        return await APIClient.get(`role/${id}/permissions`);
    }

    async updatePermissions(id: number, permissions: UpdatePermissionsRequest): Promise<{ success: boolean }> {
        return await APIClient.put(`role/${id}/permissions`, permissions);
    }

    async getMenuAccess(id: number): Promise<{ menu_access: string[] }> {
        return await APIClient.get(`role/${id}/menu-access`);
    }

    async updateMenuAccess(id: number, menuAccess: UpdateMenuAccessRequest): Promise<{ success: boolean }> {
        return await APIClient.put(`role/${id}/menu-access`, menuAccess);
    }
}

export default Role;
export { Role };
export type { InRole, InRoleForm };