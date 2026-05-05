/**
 * User Management - List Page
 * Professional table view with search, filter, sort, and pagination
 * @author Sarip Hidayat <hidayatsarip2210@gmail.com>
 * @date 2026-01-17
 */

import React, { useCallback, useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { InUser, InUserForm, User, UserListQuery } from "@/models/User";
import { useRouter } from "next/router";
import useBlockUI from "@/pages/_components/useBlockUI";
import Pagination from "@/pages/_components/Pagination";
import Link from "next/link";
import Form from "./_form";
import { showToast } from "@/utils/toast";
import Swal from "sweetalert2";
import { UserRoleBadge, UserStatusBadge } from "@/components/UserBadge";
import SearchBar from "@/components/SearchBar";
import { UserRole, UserStatus, UserSortOptions } from "@/types/user";
import { canEditUser, canChangeStatus, canResetPassword, getUserPermissions } from "@/utils/permission";
import { convertUnixTimestampToDate } from "@/utils/date";
import ChangeStatusModal from "@/pages/user/_change_status_modal";
import ResetPasswordModal from "@/pages/user/_reset_password_modal";
import {InUsersRole, UsersRole} from "@/models/UsersRole";

export default function UserPage() {
    const router = useRouter();
    const { blockUI, unblockUI } = useBlockUI();
    const [isInitialLoad, setIsInitialLoad] = useState<boolean>(true);
    const [users, setUsers] = useState<InUser[]>([]);
    const [roles,setRoles ] = useState<InUsersRole[]>([]);
    const [pagination, setPagination] = useState<any>({});
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [showForm, setShowForm] = useState<boolean>(false);
    const [showChangeStatusModal, setShowChangeStatusModal] = useState<boolean>(false);
    const [showResetPasswordModal, setShowResetPasswordModal] = useState<boolean>(false);
    const [selectedUser, setSelectedUser] = useState<InUser | null>(null);
    const [formData, setFormData] = useState<InUserForm>({
        eo_id: null,
        username: '',
        name: '',
        email: '',
        phone: '',
        role: '',
        status: 'Active',
        password: '',
        confirm_password: ''
    });
    const [validationError, setValidationError] = useState<any>({});
    const [currentUser, setCurrentUser] = useState<InUser | null>(null);

    // Filter states
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [roleFilter, setRoleFilter] = useState<string>('');
    const [statusFilter, setStatusFilter] = useState<string>('');
    const [eoFilter, setEOFilter] = useState<string>('');
    const [sortBy, setSortBy] = useState<string>('created_at');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
    const [perPage, setPerPage] = useState<number>(25);

    const Model = new User();


    const listData = async () => {
        if (isInitialLoad) blockUI();

        try {
            const query: UserListQuery = {
                page: currentPage,
                per_page: perPage,
                search: searchQuery || undefined,
                role: roleFilter || undefined,
                status: statusFilter || undefined,
                eo_id: eoFilter || undefined,
                sort_by: sortBy,
                sort_order: sortOrder
            };

            const response = await Model.list(query);
            setUsers(response.users || []);
            setPagination(response.pagination || {});
        } catch (e: any) {
            if (e.status === 403) {
                router.push('/403');
            }
            console.error('Error loading users:', e);
            showToast('Failed to load users', 'error');
        } finally {
            if (isInitialLoad) {
                unblockUI();
                setIsInitialLoad(false);
            }
        }
    };


    const ModelRoles = new UsersRole();
    const loadRoles = () => {
        ModelRoles.list().then(response => {
            setRoles(response.sys_users_role || []);
        })
    }

    // Reload data when filters change
    useEffect(() => {
        if (!isInitialLoad) {
            setCurrentPage(1); // Reset to first page on filter change
            listData();
        }
    }, [searchQuery, roleFilter, statusFilter, eoFilter, sortBy, sortOrder, perPage]);

    // Reload data when page changes
    useEffect(() => {
        if (!isInitialLoad) {
            listData();
        }
    }, [currentPage]);

    // Initial load
    useEffect(() => {
        loadRoles();
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

    const create = () => {
        setValidationError({});
        setFormData({
            eo_id: null,
            username: '',
            name: '',
            email: '',
            phone: '',
            role: '',
            status: 'Active',
            password: '',
            confirm_password: ''
        });
        setShowForm(true);
    };

    const edit = (user: InUser) => {
        setValidationError({});
        setFormData({
            id: user.id,
            eo_id: user.eo_id,
            username: user.username,
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role,
            status: user.status,
            profile_picture: user.profile_picture || undefined
        });
        setShowForm(true);
    };

    useEffect(() => {
        if (showForm) {
            (jQuery as any)("#modal-user").modal('show');
        } else {
            (jQuery as any)("#modal-user").modal('hide');
        }
    }, [showForm]);

    const save = useCallback(async (data: InUserForm) => {
        try {
            if (data.id) {
                await Model.update(data.id, data);
                showToast('User berhasil diupdate', 'success');
            } else {
                await Model.create(data);
                showToast('User berhasil ditambahkan', 'success');
            }
            (jQuery as any)('#modal-user').modal('hide');
            setShowForm(false);
            listData();
        } catch (error: any) {
            const lines = error.message?.trim().split('\n') || [];
            const result = lines.map((line: string) => {
                const [field, ...message] = line.split(' ');
                return { field, message: message.join(' ') };
            });
            setValidationError(result);
            // console.log({'error': error})
            // showToast(error.message, 'error');
        }
    }, []);

    const handleChangeStatus = (user: InUser) => {
        setSelectedUser(user);
        setShowChangeStatusModal(true);
        (jQuery as any)('#modal-change-status').modal('show');
    };

    const handleResetPassword = (user: InUser) => {
        setSelectedUser(user);
        setShowResetPasswordModal(true);
        (jQuery as any)('#modal-reset-password').modal('show');
    };

    const confirmChangeStatus = async (userId: number, newStatus: UserStatus, reason: string) => {
        try {
            await Model.changeStatus(userId, { status: newStatus, reason });
            showToast('User status updated successfully', 'success');
            listData(); // Reload data
            (jQuery as any)('#modal-change-status').modal('hide');
            setShowChangeStatusModal(false);
        } catch (error: any) {
            console.error('Error changing status:', error);
            showToast('Failed to change user status', 'error');
        }
    };


    const confirmResetPassword = async (userId: number, newPassword: string, sendEmail: boolean) => {
        try {
            await Model.resetPassword(userId, {
                new_password: newPassword,
                send_email: sendEmail
            });

            showToast('Password ber hasil direset!', 'success');
            (jQuery as any)('#modal-reset-password').modal('hide');
            setShowResetPasswordModal(false);
        } catch (error: any) {
            console.error('Error resetting password:', error);
            showToast('Gagal reset password', 'error');
        }
    };

    const handleDelete = async (id: number) => {
        Swal.fire({
            title: "Nonaktifkan User?",
            text: "User akan dinonaktifkan (status = Inactive)",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Ya, Nonaktifkan",
            cancelButtonText: "Batal",
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await Model.delete(id);
                    showToast("User berhasil dinonaktifkan", "success");
                    listData();
                } catch (error) {
                    showToast("Gagal menonaktifkan user", "error");
                }
            }
        });
    };

    const remove = async (id: number) => {
        Swal.fire({
            title: "Are you sure?",
            text: "Once deleted, you will not be able to recover this data",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes",
            cancelButtonText: "No",
        }).then(async (result) => {
            if (result.isConfirmed) {
                const response = await Model.delete(id);
                if (response.success) {
                    showToast("Successfully Deleted", "success");
                    listData();
                }
            }
        });
    };


    const permissions = currentUser ? getUserPermissions(currentUser) : null;

    return (
        <>
            <div className="flex-grow-1 container-p-y">
                <h4 className="py-2 breadcrumb-wrapper mb-0">User Management</h4>
                <p className="text-muted">Manage system users with role-based access control</p>
            </div>

            {/* Header with Add Button */}
            <div className="card mb-3">
                <div className="card-header d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">Users List</h5>
                    {/*{permissions?.canCreateUser && (*/}
                        <Button variant="primary" onClick={create}>
                            <i className="bx bx-plus me-1"></i>
                            Add User
                        </Button>
                    {/*)}*/}
                </div>
            </div>

            {/* Search and Filters */}
            <div className="card mb-3">
                <div className="card-body">
                    <div className="row g-3">
                        {/* Search */}
                        <div className="col-md-4">
                            <SearchBar
                                onSearch={setSearchQuery}
                                placeholder="Search username, name, or email..."
                                className="w-100"
                            />
                        </div>

                        {/* Role Filter */}
                        <div className="col-md-2">
                            <select
                                className="form-select"
                                value={roleFilter}
                                onChange={(e) => setRoleFilter(e.target.value)}
                            >
                                <option value="">All Roles</option>
                                {roles.map((role, key) => (
                                    <option value={role.role_name}>{role.role_name}</option>
                                ))}
                            </select>
                        </div>

                        {/* Status Filter */}
                        <div className="col-md-2">
                            <select
                                className="form-select"
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                            >
                                <option value="">All Status</option>
                                <option value="Active">Active</option>
                                <option value="Inactive">Inactive</option>
                                <option value="Suspend">Suspend</option>
                            </select>
                        </div>

                        {/* Per Page */}
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

                        {/* Clear Filters */}
                        <div className="col-md-2">
                            <button
                                className="btn btn-outline-secondary w-100"
                                onClick={() => {
                                    setSearchQuery('');
                                    setRoleFilter('');
                                    setStatusFilter('');
                                    setEOFilter('');
                                }}
                            >
                                <i className="bx bx-reset me-1"></i>
                                Clear Filters
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Users Table */}
            <div className="card">
                <div className="table-responsive">
                    <table className="table table-hover">
                        <thead>
                            <tr>
                                <th style={{ cursor: 'pointer' }} onClick={() => handleSort('username')}>
                                    Username {getSortIcon('username')}
                                </th>
                                <th style={{ cursor: 'pointer' }} onClick={() => handleSort('name')}>
                                    Name {getSortIcon('name')}
                                </th>
                                <th style={{ cursor: 'pointer' }} onClick={() => handleSort('email')}>
                                    Email {getSortIcon('email')}
                                </th>
                                <th>Role</th>
                                <th>Status</th>
                                <th>Events Organizer</th>
                                <th style={{ cursor: 'pointer' }} onClick={() => handleSort('last_login')}>
                                    Last Login {getSortIcon('last_login')}
                                </th>
                                <th className="text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="text-center py-4">
                                        <i className="bx bx-info-circle fs-3 text-muted d-block mb-2"></i>
                                        <p className="text-muted mb-0">No users found</p>
                                    </td>
                                </tr>
                            ) : (
                                users.map((user) => (
                                    <tr key={user.id}>
                                        <td>
                                            <strong>{user.username}</strong>
                                        </td>
                                        <td>{user.name}</td>
                                        <td>{user.email}</td>
                                        <td>
                                            <UserRoleBadge role={user.role} />
                                        </td>
                                        <td>
                                            <UserStatusBadge status={user.status} />
                                        </td>
                                        <td>
                                            {user.eo_detail ? user.eo_detail.eo_name : '-'}
                                        </td>
                                        <td>
                                            {user.last_login
                                                ? convertUnixTimestampToDate(user.last_login)
                                                : '-'
                                            }
                                        </td>
                                        <td>
                                            <div className="d-flex gap-1 justify-content-center">
                                                <Link href={`/user/${user.id}`} className="btn btn-sm btn-info">
                                                    <i className="bx bx-show"></i>
                                                </Link>
                                                {/*{currentUser && canEditUser(currentUser, user) && (*/}
                                                <button
                                                    className="btn btn-sm btn-warning"
                                                    onClick={() => edit(user)}
                                                    title="Edit User"
                                                >
                                                    <i className="bx bx-edit"></i>
                                                </button>
                                                <button
                                                    className="btn btn-sm btn-danger"
                                                    onClick={() => remove(user.id)}
                                                    title="Delete User"
                                                >
                                                    <i className="bx bx-trash"></i>
                                                </button>
                                                {/*)}*/}
                                                {/*{currentUser && canChangeStatus(currentUser, user) && (*/}
                                                <button
                                                    className="btn btn-sm btn-secondary"
                                                    onClick={() => handleChangeStatus(user)}
                                                    title="Change Status"
                                                >
                                                    <i className="bx bx-check-circle"></i>
                                                </button>
                                                {/*)}*/}
                                                {/*{currentUser && canResetPassword(currentUser, user) && (*/}
                                                <button
                                                    className="btn btn-sm btn-primary"
                                                    onClick={() => handleResetPassword(user)}
                                                    title="Reset Password"
                                                >
                                                    <i className="bx bx-lock"></i>
                                                </button>
                                                {/*)}*/}
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
                                    Showing {users.length} of {pagination.total || 0} users
                                    {pagination.filtered_total !== pagination.total && (
                                        <span> (filtered from {pagination.total} total users)</span>
                                    )}
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


            {/* User Form Modal */}
            <Form
                roles={roles}
                title={formData.id ? 'Edit User' : 'Add User'}
                show={showForm}
                onClose={() => setShowForm(false)}
                data={formData}
                onSave={save}
                validationError={validationError}
            />

            {/* Change Status Modal */}
            <ChangeStatusModal
                show={showChangeStatusModal}
                user={selectedUser}
                currentUserId={currentUser?.id}
                onClose={() => {
                    jQuery('#modal-change-status').modal('hide');
                    setShowChangeStatusModal(false);
                    setSelectedUser(null);
                }}
                onConfirm={confirmChangeStatus}
            />

            {/* Reset Password Modal */}
            <ResetPasswordModal
                show={showResetPasswordModal}
                user={selectedUser}
                onClose={() => {
                    (jQuery as any)('#modal-reset-password').modal('hide');
                    setShowResetPasswordModal(false);
                    setSelectedUser(null);
                }}
                onConfirm={confirmResetPassword}
            />
        </>
    );
}

