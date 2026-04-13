/**
 * Users Role Page
 */

import React, { useEffect, useState, useMemo } from 'react';
import useBlockUI from '@/pages/_components/useBlockUI';
import { UsersRole, InUsersRole } from '@/models/UsersRole';
import { showToast } from '@/utils/toast';

const UsersRolePage: React.FC = () => {
    const { blockUI, unblockUI } = useBlockUI();
    const [roles, setRoles] = useState<InUsersRole[]>([]);
    const [isInitialLoad, setIsInitialLoad] = useState<boolean>(true);
    const [sortBy, setSortBy] = useState<string>('role_name');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
    const UsersRoleModel = new UsersRole();

    const handleSort = (column: string) => {
        if (sortBy === column) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(column);
            setSortOrder('asc');
        }
    };

    const getSortIcon = (column: string) => {
        if (sortBy !== column) return <i className="bx bx-sort ms-1"></i>;
        return sortOrder === 'asc'
            ? <i className="bx bx-sort-up ms-1"></i>
            : <i className="bx bx-sort-down ms-1"></i>;
    };

    const sortedRoles = useMemo(() => {
        return [...roles].sort((a, b) => {
            const valA = (a as any)[sortBy] ?? '';
            const valB = (b as any)[sortBy] ?? '';
            if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
            if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
            return 0;
        });
    }, [roles, sortBy, sortOrder]);

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
                                    <th style={{ cursor: 'pointer' }} onClick={() => handleSort('role_name')}>Role Name {getSortIcon('role_name')}</th>
                                    <th style={{ width: '180px', cursor: 'pointer' }} onClick={() => handleSort('role_slug')}>Role Slug {getSortIcon('role_slug')}</th>
                                    <th>Description</th>
                                    <th style={{ width: '180px', cursor: 'pointer' }} onClick={() => handleSort('created_at')}>Created At {getSortIcon('created_at')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sortedRoles.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="text-center py-4 text-muted">
                                            <i className="bx bx-info-circle bx-lg mb-2 d-block"></i>
                                            No roles found
                                        </td>
                                    </tr>
                                ) : (
                                    sortedRoles.map((role, index) => (
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
