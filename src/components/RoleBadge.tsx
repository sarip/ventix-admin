/**
 * Role Badge Components
 * Display role status and type badges
 * @author Sarip Hidayat <hidayatsarip2210@gmail.com>
 * @date 2026-01-19
 */

import React from 'react';
import { RoleStatus, RoleStatusColors, RoleType, RoleTypeColors } from '@/types/role';

interface RoleStatusBadgeProps {
    status: RoleStatus;
    className?: string;
}

export const RoleStatusBadge: React.FC<RoleStatusBadgeProps> = ({ status, className = '' }) => {
    const badgeClass = RoleStatusColors[status] || 'secondary';

    return (
        <span className={`badge bg-${badgeClass} ${className}`}>
            {status}
        </span>
    );
};

interface RoleTypeBadgeProps {
    isDefault: boolean;
    className?: string;
}

export const RoleTypeBadge: React.FC<RoleTypeBadgeProps> = ({ isDefault, className = '' }) => {
    const type: RoleType = isDefault ? 'default' : 'custom';
    const badgeClass = RoleTypeColors[type];
    const label = isDefault ? 'Default' : 'Custom';

    return (
        <span className={`badge bg-${badgeClass} ${className}`}>
            {label}
        </span>
    );
};
