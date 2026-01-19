/**
 * Permission Matrix Component
 * CRUD permission grid for modules
 * @author Sarip Hidayat <hidayatsarip2210@gmail.com>
 * @date 2026-01-19
 */

import React from 'react';
import { ModulePermission, AVAILABLE_MODULES } from '@/types/role';

interface PermissionMatrixProps {
    permissions: ModulePermission[];
    onChange: (permissions: ModulePermission[]) => void;
}

const PermissionMatrix: React.FC<PermissionMatrixProps> = ({ permissions, onChange }) => {
    const handlePermissionChange = (moduleKey: string, action: keyof Omit<ModulePermission, 'module' | 'module_label'>, value: boolean) => {
        const updated = permissions.map(p => {
            if (p.module === moduleKey) {
                return { ...p, [action]: value };
            }
            return p;
        });
        onChange(updated);
    };

    const handleToggleAll = (action: keyof Omit<ModulePermission, 'module' | 'module_label'>) => {
        const allChecked = permissions.every(p => p[action]);
        const updated = permissions.map(p => ({
            ...p,
            [action]: !allChecked
        }));
        onChange(updated);
    };

    const handleToggleModule = (moduleKey: string) => {
        const module = permissions.find(p => p.module === moduleKey);
        if (!module) return;

        const allChecked = module.can_create && module.can_read && module.can_update && module.can_delete;
        const updated = permissions.map(p => {
            if (p.module === moduleKey) {
                return {
                    ...p,
                    can_create: !allChecked,
                    can_read: !allChecked,
                    can_update: !allChecked,
                    can_delete: !allChecked
                };
            }
            return p;
        });
        onChange(updated);
    };

    const isAllChecked = (action: keyof Omit<ModulePermission, 'module' | 'module_label'>) => {
        return permissions.every(p => p[action]);
    };

    return (
        <div className="table-responsive">
            <table className="table table-bordered table-hover">
                <thead className="table-light">
                    <tr>
                        <th style={{ width: '30%' }}>Module</th>
                        <th className="text-center" style={{ width: '15%' }}>
                            <div className="form-check d-flex justify-content-center align-items-center mb-0">
                                <input
                                    className="form-check-input me-2"
                                    type="checkbox"
                                    checked={isAllChecked('can_create')}
                                    onChange={() => handleToggleAll('can_create')}
                                />
                                <label className="form-check-label mb-0">Create</label>
                            </div>
                        </th>
                        <th className="text-center" style={{ width: '15%' }}>
                            <div className="form-check d-flex justify-content-center align-items-center mb-0">
                                <input
                                    className="form-check-input me-2"
                                    type="checkbox"
                                    checked={isAllChecked('can_read')}
                                    onChange={() => handleToggleAll('can_read')}
                                />
                                <label className="form-check-label mb-0">Read</label>
                            </div>
                        </th>
                        <th className="text-center" style={{ width: '15%' }}>
                            <div className="form-check d-flex justify-content-center align-items-center mb-0">
                                <input
                                    className="form-check-input me-2"
                                    type="checkbox"
                                    checked={isAllChecked('can_update')}
                                    onChange={() => handleToggleAll('can_update')}
                                />
                                <label className="form-check-label mb-0">Update</label>
                            </div>
                        </th>
                        <th className="text-center" style={{ width: '15%' }}>
                            <div className="form-check d-flex justify-content-center align-items-center mb-0">
                                <input
                                    className="form-check-input me-2"
                                    type="checkbox"
                                    checked={isAllChecked('can_delete')}
                                    onChange={() => handleToggleAll('can_delete')}
                                />
                                <label className="form-check-label mb-0">Delete</label>
                            </div>
                        </th>
                        <th className="text-center" style={{ width: '10%' }}>All</th>
                    </tr>
                </thead>
                <tbody>
                    {permissions.map((perm) => {
                        const allModuleChecked = perm.can_create && perm.can_read && perm.can_update && perm.can_delete;
                        return (
                            <tr key={perm.module}>
                                <td>
                                    <strong>{perm.module_label}</strong>
                                </td>
                                <td className="text-center">
                                    <div className="form-check d-flex justify-content-center mb-0">
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            checked={perm.can_create}
                                            onChange={(e) => handlePermissionChange(perm.module, 'can_create', e.target.checked)}
                                        />
                                    </div>
                                </td>
                                <td className="text-center">
                                    <div className="form-check d-flex justify-content-center mb-0">
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            checked={perm.can_read}
                                            onChange={(e) => handlePermissionChange(perm.module, 'can_read', e.target.checked)}
                                        />
                                    </div>
                                </td>
                                <td className="text-center">
                                    <div className="form-check d-flex justify-content-center mb-0">
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            checked={perm.can_update}
                                            onChange={(e) => handlePermissionChange(perm.module, 'can_update', e.target.checked)}
                                        />
                                    </div>
                                </td>
                                <td className="text-center">
                                    <div className="form-check d-flex justify-content-center mb-0">
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            checked={perm.can_delete}
                                            onChange={(e) => handlePermissionChange(perm.module, 'can_delete', e.target.checked)}
                                        />
                                    </div>
                                </td>
                                <td className="text-center">
                                    <div className="form-check d-flex justify-content-center mb-0">
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            checked={allModuleChecked}
                                            onChange={() => handleToggleModule(perm.module)}
                                        />
                                    </div>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default PermissionMatrix;
