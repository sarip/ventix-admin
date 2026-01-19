/**
 * User Management Types
 * @author Sarip Hidayat <hidayatsarip2210@gmail.com>
 * @date 2026-01-17
 */

// User Roles
export type UserRole = 'Super Admin' | 'EO Owner' | 'Admin' | 'EO Staff';

// User Status
export type UserStatus = 'Active' | 'Inactive' | 'Suspended';

// Role Badge Colors
export const RoleBadgeColors: Record<UserRole, string> = {
    'Super Admin': 'primary', // Purple/Blue
    'EO Owner': 'info',    // Blue
    'Admin': 'warning',    // Orange
    'EO Staff': 'success'   // Teal/Green
};

// Status Badge Colors
export const StatusBadgeColors: Record<UserStatus, string> = {
    'Active': 'success',   // Green
    'Inactive': 'secondary', // Gray
    'Suspended': 'danger'  // Red
};

// Permission Matrix Interface
export interface PermissionMatrix {
    canViewAllUsers: boolean;
    canCreateUser: boolean;
    canEditUser: boolean;
    canChangeStatus: boolean;
    canResetPassword: boolean;
    canDeleteUser: boolean;
    availableRoles: UserRole[];
    canViewEOFilter: boolean;
}

// Role Permission Map
export const RolePermissions: Record<UserRole, PermissionMatrix> = {
    'Super Admin': {
        canViewAllUsers: true,
        canCreateUser: true,
        canEditUser: true,
        canChangeStatus: true,
        canResetPassword: true,
        canDeleteUser: true,
        availableRoles: ['Super Admin', 'EO Owner', 'Admin', 'EO Staff'],
        canViewEOFilter: true
    },
    'EO Owner': {
        canViewAllUsers: false, // Only own EO
        canCreateUser: true,
        canEditUser: true,
        canChangeStatus: true,
        canResetPassword: true,
        canDeleteUser: false,
        availableRoles: ['EO Owner', 'EO Staff'],
        canViewEOFilter: false
    },
    'Admin': {
        canViewAllUsers: false, // Only non-EO users
        canCreateUser: true,
        canEditUser: true,
        canChangeStatus: true,
        canResetPassword: true,
        canDeleteUser: false,
        availableRoles: ['Admin'],
        canViewEOFilter: false
    },
    'EO Staff': {
        canViewAllUsers: false, // Only own EO
        canCreateUser: false,
        canEditUser: false,
        canChangeStatus: false,
        canResetPassword: false,
        canDeleteUser: false,
        availableRoles: [],
        canViewEOFilter: false
    }
};

// Audit Log Types
export interface AuditLog {
    id: number;
    user_id: number;
    action: 'CREATE' | 'UPDATE' | 'DELETE' | 'STATUS_CHANGE' | 'PASSWORD_RESET';
    changed_field?: string;
    old_value?: string;
    new_value?: string;
    reason?: string;
    changed_by: number;
    changed_by_name: string;
    created_at: string;
}

// Password Strength
export type PasswordStrength = 'Weak' | 'Medium' | 'Strong';

// Sort Options
export interface SortOption {
    value: string;
    label: string;
}

export const UserSortOptions: SortOption[] = [
    { value: 'created_at_desc', label: 'Newest First' },
    { value: 'created_at_asc', label: 'Oldest First' },
    { value: 'username_asc', label: 'Username (A-Z)' },
    { value: 'username_desc', label: 'Username (Z-A)' },
    { value: 'name_asc', label: 'Name (A-Z)' },
    { value: 'name_desc', label: 'Name (Z-A)' },
    { value: 'last_login_desc', label: 'Last Login (Recent)' },
    { value: 'last_login_asc', label: 'Last Login (Oldest)' }
];

// Filter Options
export interface FilterOptions {
    role?: UserRole;
    status?: UserStatus;
    eo_id?: number;
}
