/**
 * App Permissions Page
 */

import React, { useEffect, useState } from 'react';
import useBlockUI from '@/pages/_components/useBlockUI';
import { UsersAppPermissions, InUsersAppPermissions } from '@/models/UsersAppPermissions';
import { showToast } from '@/utils/toast';

const AppPermissionsPage: React.FC = () => {
    const { blockUI, unblockUI } = useBlockUI();
    const [permissions, setPermissions] = useState<InUsersAppPermissions[]>([]);
    const [isInitialLoad, setIsInitialLoad] = useState<boolean>(true);
    const UsersAppPermissionsModel = new UsersAppPermissions();

    const loadPermissions = async () => {
        if (isInitialLoad) blockUI();
        try {
            const response = await UsersAppPermissionsModel.list();
            setPermissions(response.sys_users_apppermissions || []);
        } catch (error) {
            showToast('Failed to load app permissions', 'error');
        } finally {
            if (isInitialLoad) {
                unblockUI();
                setIsInitialLoad(false);
            }
        }
    };

    useEffect(() => {
        loadPermissions();
    }, []);

    return (
        <>
            <div className="container-p-y">
                <h4 className="py-2 breadcrumb-wrapper mb-0">App Permissions</h4>
                Manage application permission definitions
            </div>
            <div className="card mt-2">
                <h5 className="card-header border-top rounded-0">
                    Permission List
                </h5>

                <div className="card-body">
                    {/* TABLE */}
                    <div className="table-responsive">
                        <table className="table table-hover">
                            <thead className="table-light">
                                <tr>
                                    <th style={{ width: '50px' }}>#</th>
                                    <th>Permission Name</th>
                                    <th style={{ width: '200px' }}>Slug</th>
                                    <th>Description</th>
                                </tr>
                            </thead>
                            <tbody>
                                {permissions.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="text-center py-4 text-muted">
                                            <i className="bx bx-info-circle bx-lg mb-2 d-block"></i>
                                            No permissions found
                                        </td>
                                    </tr>
                                ) : (
                                    permissions.map((permission, index) => (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>
                                                <div className="fw-semibold">{permission.perm_name}</div>
                                            </td>
                                            <td>
                                                <code className="text-primary">{permission.slug}</code>
                                            </td>
                                            <td>
                                                <span className="text-muted">{permission.description}</span>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AppPermissionsPage;
