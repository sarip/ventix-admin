/**
 * Manage Role Permissions Page
 * Configure module permissions and menu access for a role
 * @author Sarip Hidayat <hidayatsarip2210@gmail.com>
 * @date 2026-01-19
 */

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Role } from '@/models/Role';
import { InRole, ModulePermission, AVAILABLE_MODULES } from '@/types/role';
import PermissionMatrix from '@/components/PermissionMatrix';
import MenuAccessTree from '@/components/MenuAccessTree';
import { showToast } from '@/utils/toast';
import useBlockUI from '@/pages/_components/useBlockUI';
import { RoleTypeBadge } from '@/components/RoleBadge';

// Mock menu structure - TODO: get from API atau routes config
const MENU_STRUCTURE = [
    {
        key: 'dashboard',
        label: 'Dashboard',
        icon: 'bx bx-home-circle'
    },
    {
        key: 'user-management',
        label: 'User Management',
        icon: 'bx bx-user',
        children: [
            { key: 'users', label: 'Users', icon: 'bx bx-user' },
            { key: 'roles', label: 'Roles', icon: 'bx bx-shield' }
        ]
    },
    {
        key: 'event-management',
        label: 'Event Management',
        icon: 'bx bx-calendar',
        children: [
            { key: 'events', label: 'Events', icon: 'bx bx-calendar-event' },
            { key: 'event-categories', label: 'Categories', icon: 'bx bx-category' },
            { key: 'tickets', label: 'Tickets', icon: 'bx bx-receipt' }
        ]
    },
    {
        key: 'facility-management',
        label: 'Facility Management',
        icon: 'bx bx-building',
        children: [
            { key: 'facilities', label: 'Facilities', icon: 'bx bx-building-house' },
            { key: 'facility-bookings', label: 'Bookings', icon: 'bx bx-calendar-check' }
        ]
    },
    {
        key: 'analytics',
        label: 'Analytics',
        icon: 'bx bx-bar-chart-alt-2'
    },
    {
        key: 'settings',
        label: 'Settings',
        icon: 'bx bx-cog'
    }
];

export default function ManagePermissionsPage() {
    const router = useRouter();
    const { id } = router.query;
    const { blockUI, unblockUI } = useBlockUI();

    const [role, setRole] = useState<InRole | null>(null);
    const [activeTab, setActiveTab] = useState<'modules' | 'menus'>('modules');
    const [modulePermissions, setModulePermissions] = useState<ModulePermission[]>([]);
    const [selectedMenus, setSelectedMenus] = useState<string[]>([]);
    const [hasChanges, setHasChanges] = useState(false);

    const Model = new Role();

    useEffect(() => {
        if (id) {
            loadRole(Number(id));
            loadPermissions(Number(id));
        }
    }, [id]);

    const loadRole = async (roleId: number) => {
        try {
            const response = await Model.show(roleId);
            setRole(response.role);
        } catch (error) {
            console.error('Error loading role:', error);
            showToast('Failed to load role', 'error');
            router.push('/role');
        }
    };

    const loadPermissions = async (roleId: number) => {
        blockUI();
        try {
            // Load module permissions
            const permResponse = await Model.getPermissions(roleId);
            const existingPerms = permResponse.permissions.module_permissions || [];

            // Initialize with all available modules
            const allPermissions: ModulePermission[] = AVAILABLE_MODULES.map(module => {
                const existing = existingPerms.find(p => p.module === module.key);
                return existing || {
                    module: module.key,
                    module_label: module.label,
                    can_create: false,
                    can_read: false,
                    can_update: false,
                    can_delete: false
                };
            });
            setModulePermissions(allPermissions);

            // Load menu access
            const menuResponse = await Model.getMenuAccess(roleId);
            setSelectedMenus(menuResponse.menu_access || []);
        } catch (error: any) {
            console.error('Error loading permissions:', error);
            // Initialize empty permissions if error
            const emptyPermissions: ModulePermission[] = AVAILABLE_MODULES.map(module => ({
                module: module.key,
                module_label: module.label,
                can_create: false,
                can_read: false,
                can_update: false,
                can_delete: false
            }));
            setModulePermissions(emptyPermissions);
        } finally {
            unblockUI();
        }
    };

    const handleSavePermissions = async () => {
        if (!id) return;

        blockUI();
        try {
            // Save module permissions
            await Model.updatePermissions(Number(id), {
                module_permissions: modulePermissions
            });

            // Save menu access
            await Model.updateMenuAccess(Number(id), {
                menu_access: selectedMenus
            });

            showToast('Permissions updated successfully', 'success');
            setHasChanges(false);
        } catch (error: any) {
            console.error('Error saving permissions:', error);
            showToast('Failed to save permissions', 'error');
        } finally {
            unblockUI();
        }
    };

    const handlePermissionChange = (permissions: ModulePermission[]) => {
        setModulePermissions(permissions);
        setHasChanges(true);
    };

    const handleMenuChange = (menus: string[]) => {
        setSelectedMenus(menus);
        setHasChanges(true);
    };

    if (!role) {
        return <div>Loading...</div>;
    }

    return (
        <div className="flex-grow-1 container-p-y">
            {/* Header */}
            <div className="d-flex justify-content-between align-items-center mb-3">
                <div>
                    <h4 className="py-2 breadcrumb-wrapper mb-0">
                        Manage Permissions
                    </h4>
                    <p className="text-muted mb-0">
                        Configure access rights for <strong>{role.name}</strong>
                        <RoleTypeBadge isDefault={role.is_default} className="ms-2" />
                    </p>
                </div>
                <Link href="/role" className="btn btn-outline-secondary">
                    <i className="bx bx-arrow-back me-1"></i>
                    Back to Roles
                </Link>
            </div>

            {/* Main Card */}
            <div className="card">
                {/* Tabs */}
                <div className="card-header">
                    <ul className="nav nav-tabs card-header-tabs" role="tablist">
                        <li className="nav-item">
                            <button
                                className={`nav-link ${activeTab === 'modules' ? 'active' : ''}`}
                                onClick={() => setActiveTab('modules')}
                            >
                                <i className="bx bx-grid-alt me-1"></i>
                                Module Permissions
                            </button>
                        </li>
                        <li className="nav-item">
                            <button
                                className={`nav-link ${activeTab === 'menus' ? 'active' : ''}`}
                                onClick={() => setActiveTab('menus')}
                            >
                                <i className="bx bx-menu me-1"></i>
                                Menu Access
                            </button>
                        </li>
                    </ul>
                </div>

                {/* Tab Content */}
                <div className="card-body">
                    {activeTab === 'modules' && (
                        <div>
                            <div className="alert alert-info mb-3">
                                <i className="bx bx-info-circle me-2"></i>
                                <strong>Module Permissions:</strong> Control what actions this role can perform on each module.
                                <ul className="mb-0 mt-2">
                                    <li><strong>Create:</strong> Add new records</li>
                                    <li><strong>Read:</strong> View/list records</li>
                                    <li><strong>Update:</strong> Edit existing records</li>
                                    <li><strong>Delete:</strong> Remove records</li>
                                </ul>
                            </div>
                            <PermissionMatrix
                                permissions={modulePermissions}
                                onChange={handlePermissionChange}
                            />
                        </div>
                    )}

                    {activeTab === 'menus' && (
                        <div>
                            <div className="alert alert-info mb-3">
                                <i className="bx bx-info-circle me-2"></i>
                                <strong>Menu Access:</strong> Control which menus are visible to users with this role.
                            </div>
                            <MenuAccessTree
                                menus={MENU_STRUCTURE}
                                selectedMenus={selectedMenus}
                                onChange={handleMenuChange}
                            />
                        </div>
                    )}
                </div>

                {/* Footer with Save Button */}
                <div className="card-footer d-flex justify-content-between align-items-center">
                    <div>
                        {hasChanges && (
                            <small className="text-warning">
                                <i className="bx bx-error-circle me-1"></i>
                                You have unsaved changes
                            </small>
                        )}
                    </div>
                    <div className="d-flex gap-2">
                        <Link href="/role" className="btn btn-outline-secondary">
                            Cancel
                        </Link>
                        <button
                            className="btn btn-primary"
                            onClick={handleSavePermissions}
                            disabled={!hasChanges}
                        >
                            <i className="bx bx-save me-1"></i>
                            Save Permissions
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
