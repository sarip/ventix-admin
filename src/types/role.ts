/**
 * Role Management Types
 * TypeScript interfaces for role management system
 * @author Sarip Hidayat <hidayatsarip2210@gmail.com>
 * @date 2026-01-19
 */

// Role Type
export type RoleType = 'default' | 'custom';

// Role Status
export type RoleStatus = 'Active' | 'Inactive';

// Role Interface
export interface InRole {
    id: number;
    name: string;
    description?: string;
    is_default: boolean;
    status: RoleStatus;
    user_count?: number; // Jumlah user yang pakai role ini
    created_at: string;
    updated_at?: string;
}

// Role Form Interface
export interface InRoleForm {
    id?: number;
    name: string;
    description?: string;
    status: RoleStatus;
    copy_from_role_id?: number; // Copy permissions dari role lain
}

// Module Permission Interface
export interface ModulePermission {
    module: string;
    module_label: string;
    can_create: boolean;
    can_read: boolean;
    can_update: boolean;
    can_delete: boolean;
}

// Menu Access Interface
export interface MenuAccess {
    menu_key: string;
    menu_label: string;
    parent_key?: string;
    can_access: boolean;
    children?: MenuAccess[];
}

// Role Permissions (Complete)
export interface RolePermissions {
    role_id: number;
    module_permissions: ModulePermission[];
    menu_access: MenuAccess[];
}

// Available Modules List
export const AVAILABLE_MODULES: { key: string; label: string }[] = [
    { key: 'users', label: 'User Management' },
    { key: 'roles', label: 'Role Management' },
    { key: 'events', label: 'Events' },
    { key: 'event_categories', label: 'Event Categories' },
    { key: 'tickets', label: 'Tickets' },
    { key: 'facilities', label: 'Facilities' },
    { key: 'facility_bookings', label: 'Facility Bookings' },
    { key: 'analytics', label: 'Analytics' },
    { key: 'settings', label: 'Settings' }
];

// Default Roles (cannot be deleted)
export const DEFAULT_ROLES = ['Super Admin', 'EO Owner', 'Admin', 'EO Staff'];

// Role Badge Colors
export const RoleStatusColors: Record<RoleStatus, string> = {
    'Active': 'success',
    'Inactive': 'secondary'
};

export const RoleTypeColors: Record<RoleType, string> = {
    'default': 'primary',
    'custom': 'info'
};

// List Query
export interface RoleListQuery {
    search?: string;
    status?: RoleStatus;
    type?: RoleType;
    sort_by?: string;
    sort_order?: 'asc' | 'desc';
    page?: number;
    per_page?: number;
}

// Update Permission Request
export interface UpdatePermissionsRequest {
    module_permissions: ModulePermission[];
}

// Update Menu Access Request
export interface UpdateMenuAccessRequest {
    menu_access: string[]; // Array of menu_key yang bisa diakses
}
