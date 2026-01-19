/**
 * User Badge Component
 * Displays colored badges for user roles and statuses
 * @author Sarip Hidayat <hidayatsarip2210@gmail.com>
 * @date 2026-01-17
 */

import React from 'react';
import { UserRole, UserStatus, RoleBadgeColors, StatusBadgeColors } from '@/types/user';

interface UserRoleBadgeProps {
    role: UserRole;
    className?: string;
}

export const UserRoleBadge: React.FC<UserRoleBadgeProps> = ({ role, className = '' }) => {
    const badgeClass = RoleBadgeColors[role] || 'secondary';

    return (
        <span className={`badge bg-${badgeClass} ${className}`}>
            {role}
        </span>
    );
};

interface UserStatusBadgeProps {
    status: UserStatus;
    className?: string;
}

export const UserStatusBadge: React.FC<UserStatusBadgeProps> = ({ status, className = '' }) => {
    const badgeClass = StatusBadgeColors[status] || 'secondary';

    return (
        <span className={`badge bg-${badgeClass} ${className}`}>
            {status}
        </span>
    );
};
