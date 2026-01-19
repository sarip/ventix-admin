/**
 * Users Role Page
 */

import React, { useEffect, useState } from 'react';
import useBlockUI from '@/pages/_components/useBlockUI';
import { UsersRole, InUsersRole } from '@/models/UsersRole';
import { showToast } from '@/utils/toast';

const UsersRolePage: React.FC = () => {
    const { blockUI, unblockUI } = useBlockUI();
    const [roles, setRoles] = useState<InUsersRole[]>([]);
    const [isInitialLoad, setIsInitialLoad] = useState<boolean>(true);
    const UsersRoleModel = new UsersRole();

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const loadRoles = async () => {
        if (isInitialLoad) blockUI();
        try {
            const response = await UsersRoleModel.list();
            setRoles(response.sys_users_role || []);
        } catch (error) {
            showToast('Failed to load user roles', 'error');
        } finally {
            if (isInitialLoad) {
                unblockUI();
                setIsInitialLoad(false);
            }
        }
    };

    useEffect(() => {
        loadRoles();
    }, []);

    return (
        <>
            <div className="container-p-y">
                <h4 className="py-2 breadcrumb-wrapper mb-0">User Roles</h4>
                Manage user role definitions
            </div>
            <div className="card mt-2">
                <h5 className="card-header border-top rounded-0">
                    Role List
                </h5>

                <div className="card-body">
                    {/* TABLE */}
                    <div className="table-responsive">
                        <table className="table table-hover">
                            <thead className="table-light">
                                <tr>
                                    <th style={{ width: '50px' }}>#</th>
                                    <th>Role Name</th>
                                    <th style={{ width: '180px' }}>Role Slug</th>
                                    <th>Description</th>
                                    <th style={{ width: '180px' }}>Created At</th>
                                </tr>
                            </thead>
                            <tbody>
                                {roles.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="text-center py-4 text-muted">
                                            <i className="bx bx-info-circle bx-lg mb-2 d-block"></i>
                                            No roles found
                                        </td>
                                    </tr>
                                ) : (
                                    roles.map((role, index) => (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>
                                                <div className="fw-semibold">{role.role_name}</div>
                                            </td>
                                            <td>
                                                <code className="text-primary">{role.role_slug}</code>
                                            </td>
                                            <td>
                                                <span className="text-muted">{role.description}</span>
                                            </td>
                                            <td>
                                                <small className="text-muted">{formatDate(role.created_at)}</small>
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

export default UsersRolePage;
