/**
 * User Permission Utilities
 * @author Sarip Hidayat <hidayatsarip2210@gmail.com>
 * @date 2026-01-17
 */

import { InUser } from '@/models/User';
import { UserRole, RolePermissions, PermissionMatrix } from '@/types/user';

/**
 * Get permission matrix for current user
 */
export function getUserPermissions(currentUser: InUser | null): PermissionMatrix | null {
    if (!currentUser || !currentUser.role) return null;
    return RolePermissions[currentUser.role] || null;
}

/**
 * Check if current user can edit target user
 */
export function canEditUser(currentUser: InUser | null, targetUser: InUser): boolean {
    if (!currentUser) return false;

    const permissions = getUserPermissions(currentUser);
    if (!permissions || !permissions.canEditUser) return false;

    // Check scope based on role
    switch (currentUser.role) {
        case 'Super Admin':
            return true;

        case 'EO Owner':
        case 'EO Staff':
            return targetUser.eo_id === currentUser.eo_id;

        case 'Admin':
            return targetUser.eo_id === null;

        default:
            return false;
    }
}

/**
 * Check if current user can change status of target user
 */
export function canChangeStatus(currentUser: InUser | null, targetUser: InUser): boolean {
    if (!currentUser) return false;

    // Cannot change own status
    if (currentUser.id === targetUser.id) return false;

    return canEditUser(currentUser, targetUser);
}

/**
 * Check if current user can reset password of target user
 */
export function canResetPassword(currentUser: InUser | null, targetUser: InUser): boolean {
    if (!currentUser) return false;

    return canEditUser(currentUser, targetUser);
}

/**
 * Check if current user can create user with specific role
 */
export function canCreateUser(currentUser: InUser | null, role: UserRole): boolean {
    if (!currentUser) return false;

    const permissions = getUserPermissions(currentUser);
    if (!permissions || !permissions.canCreateUser) return false;

    return permissions.availableRoles.includes(role);
}

/**
 * Get available role options for current user
 */
export function getAvailableRoles(currentUser: InUser | null): UserRole[] {
    if (!currentUser) return [];

    const permissions = getUserPermissions(currentUser);
    return permissions?.availableRoles || [];
}

/**
 * Check if current user can view EO filter
 */
export function canViewEOFilter(currentUser: InUser | null): boolean {
    if (!currentUser) return false;

    const permissions = getUserPermissions(currentUser);
    return permissions?.canViewEOFilter || false;
}

/**
 * Check if current user can delete user
 */
export function canDeleteUser(currentUser: InUser | null, targetUser: InUser): boolean {
    if (!currentUser) return false;

    // Cannot delete own account
    if (currentUser.id === targetUser.id) return false;

    const permissions = getUserPermissions(currentUser);
    if (!permissions || !permissions.canDeleteUser) return false;

    return canEditUser(currentUser, targetUser);
}
