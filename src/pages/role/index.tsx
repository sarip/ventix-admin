/**
 * Role Management - List Page
 * Display all roles with search, filter, and actions
 * @author Sarip Hidayat <hidayatsarip2210@gmail.com>
 * @date 2026-01-19
 */

import React, { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import Link from 'next/link';
import { Role } from '@/models/Role';
import { InRole, RoleListQuery, DEFAULT_ROLES } from '@/types/role';
import { RoleStatusBadge, RoleTypeBadge } from '@/components/RoleBadge';
import SearchBar from '@/components/SearchBar';
import Pagination from '@/pages/_components/Pagination';
import { showToast } from '@/utils/toast';
import useBlockUI from '@/pages/_components/useBlockUI';
import Swal from 'sweetalert2';

export default function RolePage() {
    const { blockUI, unblockUI } = useBlockUI();
    const [roles, setRoles] = useState<InRole[]>([]);
    const [pagination, setPagination] = useState<any>({});
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [statusFilter, setStatusFilter] = useState<string>('');
    const [typeFilter, setTypeFilter] = useState<string>('');
    const [sortBy, setSortBy] = useState<string>('name');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
    const [perPage, setPerPage] = useState<number>(25);
    const [isInitialLoad, setIsInitialLoad] = useState<boolean>(true);

    const Model = new Role();

    const listData = async () => {
        if (isInitialLoad) blockUI();

        try {
            const query: RoleListQuery = {
                page: currentPage,
                per_page: perPage,
                search: searchQuery || undefined,
                status: statusFilter as any,
                type: typeFilter as any,
                sort_by: sortBy,
                sort_order: sortOrder
            };

            const response = await Model.list(query);
            setRoles(response.roles || []);
            setPagination(response.pagination || {});
        } catch (error: any) {
            console.error('Error loading roles:', error);
            showToast('Failed to load roles', 'error');
        } finally {
            if (isInitialLoad) {
                unblockUI();
                setIsInitialLoad(false);
            }
        }
    };

    useEffect(() => {
        if (!isInitialLoad) {
            setCurrentPage(1);
            listData();
        }
    }, [searchQuery, statusFilter, typeFilter, sortBy, sortOrder, perPage]);

    useEffect(() => {
        if (!isInitialLoad) {
            listData();
        }
    }, [currentPage]);

    useEffect(() => {
        listData();
    }, []);

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

    const handleDelete = async (role: InRole) => {
        // Check if default role
        if (role.is_default) {
            showToast('Cannot delete default roles', 'error');
            return;
        }

        // Check if role in use
        if (role.user_count && role.user_count > 0) {
            showToast(`Cannot delete role. Currently used by ${role.user_count} users`, 'error');
            return;
        }

        Swal.fire({
            title: 'Delete Role?',
            text: `Are you sure you want to delete "${role.name}"?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, Delete',
            cancelButtonText: 'Cancel',
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await Model.delete(role.id);
                    showToast('Role deleted successfully', 'success');
                    listData();
                } catch (error) {
                    showToast('Failed to delete role', 'error');
                }
            }
        });
    };

    return (
        <>
            <div className="flex-grow-1 container-p-y">
                <h4 className="py-2 breadcrumb-wrapper mb-0">Role Management</h4>
                <p className="text-muted">Manage system roles and permissions</p>
            </div>

            {/* Header */}
            <div className="card mb-3">
                <div className="card-header d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">Roles List</h5>
                    <Link href="/role/create" className="btn btn-primary">
                        <i className="bx bx-plus me-1"></i>
                        Add Role
                    </Link>
                </div>
            </div>

            {/* Filters */}
            <div className="card mb-3">
                <div className="card-body">
                    <div className="row g-3">
                        <div className="col-md-4">
                            <SearchBar
                                onSearch={setSearchQuery}
                                placeholder="Search role name..."
                                className="w-100"
                            />
                        </div>

                        <div className="col-md-2">
                            <select
                                className="form-select"
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                            >
                                <option value="">All Status</option>
                                <option value="Active">Active</option>
                                <option value="Inactive">Inactive</option>
                            </select>
                        </div>

                        <div className="col-md-2">
                            <select
                                className="form-select"
                                value={typeFilter}
                                onChange={(e) => setTypeFilter(e.target.value)}
                            >
                                <option value="">All Types</option>
                                <option value="default">Default</option>
                                <option value="custom">Custom</option>
                            </select>
                        </div>

                        <div className="col-md-2">
                            <select
                                className="form-select"
                                value={perPage}
                                onChange={(e) => setPerPage(Number(e.target.value))}
                            >
                                <option value="10">10 per page</option>
                                <option value="25">25 per page</option>
                                <option value="50">50 per page</option>
                                <option value="100">100 per page</option>
                            </select>
                        </div>

                        <div className="col-md-2">
                            <button
                                className="btn btn-outline-secondary w-100"
                                onClick={() => {
                                    setSearchQuery('');
                                    setStatusFilter('');
                                    setTypeFilter('');
                                }}
                            >
                                <i className="bx bx-reset me-1"></i>
                                Clear
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="card">
                <div className="table-responsive">
                    <table className="table table-hover">
                        <thead>
                            <tr>
                                <th style={{ cursor: 'pointer' }} onClick={() => handleSort('name')}>
                                    Role Name {getSortIcon('name')}
                                </th>
                                <th>Description</th>
                                <th>Type</th>
                                <th>Status</th>
                                <th style={{ cursor: 'pointer' }} onClick={() => handleSort('user_count')}>
                                    Users {getSortIcon('user_count')}
                                </th>
                                <th className="text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {roles.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="text-center py-4">
                                        <i className="bx bx-info-circle fs-3 text-muted d-block mb-2"></i>
                                        <p className="text-muted mb-0">No roles found</p>
                                    </td>
                                </tr>
                            ) : (
                                roles.map((role) => (
                                    <tr key={role.id}>
                                        <td>
                                            <strong>{role.name}</strong>
                                            {role.is_default && (
                                                <i className="bx bx-lock-alt ms-2 text-muted" title="Default role (cannot delete)"></i>
                                            )}
                                        </td>
                                        <td>{role.description || '-'}</td>
                                        <td>
                                            <RoleTypeBadge isDefault={role.is_default} />
                                        </td>
                                        <td>
                                            <RoleStatusBadge status={role.status} />
                                        </td>
                                        <td>
                                            <span className="badge bg-light text-dark">
                                                {role.user_count || 0}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="d-flex gap-1 justify-content-center">
                                                <Link
                                                    href={`/role/${role.id}/permissions`}
                                                    className="btn btn-sm btn-success"
                                                    title="Manage Permissions"
                                                >
                                                    <i className="bx bx-shield"></i>
                                                </Link>
                                                <Link
                                                    href={`/role/${role.id}/edit`}
                                                    className="btn btn-sm btn-warning"
                                                    title="Edit Role"
                                                >
                                                    <i className="bx bx-edit"></i>
                                                </Link>
                                                {!role.is_default && (
                                                    <button
                                                        className="btn btn-sm btn-danger"
                                                        onClick={() => handleDelete(role)}
                                                        title="Delete Role"
                                                        disabled={role.user_count && role.user_count > 0}
                                                    >
                                                        <i className="bx bx-trash"></i>
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {pagination && (
                    <div className="card-footer">
                        <div className="row align-items-center">
                            <div className="col-sm-12 col-md-6">
                                <div className="dataTables_info">
                                    Showing {roles.length} of {pagination.total || 0} roles
                                </div>
                            </div>
                            {pagination.page_count > 1 && (
                                <div className="col-sm-12 col-md-6 d-flex justify-content-end">
                                    <Pagination
                                        currentPage={currentPage}
                                        pageCount={pagination.page_count}
                                        onPageChange={setCurrentPage}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
