/**
 * User Detail Page
 * Read-only view of user information with action buttons
 * @author Sarip Hidayat <hidayatsarip2210@gmail.com>
 * @date 2026-01-17
 */

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { User, InUser } from '@/models/User';
import { UserRoleBadge, UserStatusBadge } from '@/components/UserBadge';
import { canEditUser, canChangeStatus, canResetPassword } from '@/utils/permission';
import { convertUnixTimestampToDate } from '@/utils/date';
import { showToast } from '@/utils/toast';
import useBlockUI from '@/pages/_components/useBlockUI';

export default function UserDetailPage() {
    const router = useRouter();
    const { id } = router.query;
    const { blockUI, unblockUI } = useBlockUI();

    const [user, setUser] = useState<InUser | null>(null);
    const [currentUser, setCurrentUser] = useState<InUser | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    const Model = new User();

    // Get current user (placeholder - should come from auth context)
    useEffect(() => {
        // TODO: Get from auth context/session
        const mockUser: InUser = {
            id: 1,
            eo_id: null,
            username: 'admin',
            name: 'Super Admin',
            email: 'admin@example.com',
            phone: '081234567890',
            role: 'Super Admin',
            profile_picture: null,
            refferalcode: 'REF000001',
            status: 'Active',
            last_login: new Date().toISOString(),
            created_at: new Date().toISOString()
        };
        setCurrentUser(mockUser);
    }, []);

    useEffect(() => {
        if (id) {
            loadUserDetail();
        }
    }, [id]);

    const loadUserDetail = async () => {
        if (!id) return;

        blockUI();
        setLoading(true);

        try {
            const response = await Model.show(Number(id));
            setUser(response.user);
        } catch (error: any) {
            console.error('Error loading user:', error);
            if (error.status === 403) {
                showToast('Access denied', 'error');
                router.push('/403');
            } else if (error.status === 404) {
                showToast('User not found', 'error');
                router.push('/user');
            } else {
                showToast('Failed to load user details', 'error');
            }
        } finally {
            setLoading(false);
            unblockUI();
        }
    };

    const handleEdit = () => {
        router.push(`/user?edit=${id}`);
    };

    const handleChangeStatus = () => {
        // TODO: Open change status modal
        showToast('Change Status - To be implemented', 'info');
    };

    const handleResetPassword = () => {
        // TODO: Open reset password modal
        showToast('Reset Password - To be implemented', 'info');
    };

    if (loading || !user) {
        return (
            <div className="container-p-y">
                <div className="text-center py-5">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container-p-y">
            {/* Header */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h4 className="mb-1">User Details</h4>
                    <p className="text-muted mb-0">View complete user information</p>
                </div>
                <Link href="/user" className="btn btn-outline-secondary">
                    <i className="bx bx-arrow-back me-1"></i>
                    Back to List
                </Link>
            </div>

            <div className="row">
                {/* Left Column - Basic Info */}
                <div className="col-lg-4 col-md-6 mb-4">
                    <div className="card h-100">
                        <div className="card-body text-center">
                            {/* Profile Picture */}
                            <div className="mb-3">
                                {user.profile_picture ? (
                                    <img
                                        src={user.profile_picture}
                                        alt={user.name}
                                        className="rounded-circle"
                                        style={{ width: '120px', height: '120px', objectFit: 'cover' }}
                                    />
                                ) : (
                                    <div
                                        className="rounded-circle mx-auto d-flex align-items-center justify-content-center bg-primary text-white"
                                        style={{ width: '120px', height: '120px', fontSize: '3rem' }}
                                    >
                                        {user.name.charAt(0).toUpperCase()}
                                    </div>
                                )}
                            </div>

                            <h5 className="mb-1">{user.name}</h5>
                            <p className="text-muted mb-3">@{user.username}</p>

                            <div className="mb-3">
                                <UserRoleBadge role={user.role} className="me-2" />
                                <UserStatusBadge status={user.status} />
                            </div>

                            {/* Referral Code */}
                            <div className="mt-4">
                                <small className="text-muted d-block mb-1">Referral Code</small>
                                <div className="input-group input-group-sm">
                                    <input
                                        type="text"
                                        className="form-control text-center"
                                        value={user.refferalcode}
                                        readOnly
                                    />
                                    <button
                                        className="btn btn-outline-secondary"
                                        onClick={() => {
                                            navigator.clipboard.writeText(user.refferalcode);
                                            showToast('Referral code copied!', 'success');
                                        }}
                                    >
                                        <i className="bx bx-copy"></i>
                                    </button>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            {/*<div className="mt-4 d-grid gap-2">*/}
                            {/*    {currentUser && canEditUser(currentUser, user) && (*/}
                            {/*        <button className="btn btn-warning" onClick={handleEdit}>*/}
                            {/*            <i className="bx bx-edit me-1"></i>*/}
                            {/*            Edit User*/}
                            {/*        </button>*/}
                            {/*    )}*/}
                            {/*    {currentUser && canChangeStatus(currentUser, user) && (*/}
                            {/*        <button className="btn btn-secondary" onClick={handleChangeStatus}>*/}
                            {/*            <i className="bx bx-check-circle me-1"></i>*/}
                            {/*            Change Status*/}
                            {/*        </button>*/}
                            {/*    )}*/}
                            {/*    {currentUser && canResetPassword(currentUser, user) && (*/}
                            {/*        <button className="btn btn-primary" onClick={handleResetPassword}>*/}
                            {/*            <i className="bx bx-lock me-1"></i>*/}
                            {/*            Reset Password*/}
                            {/*        </button>*/}
                            {/*    )}*/}
                            {/*</div>*/}
                        </div>
                    </div>
                </div>

                {/* Right Column - Detailed Info */}
                <div className="col-lg-8 col-md-6">
                    {/* Personal Information */}
                    <div className="card mb-4">
                        <div className="card-header">
                            <h5 className="mb-0">
                                <i className="bx bx-user me-2"></i>
                                Personal Information
                            </h5>
                        </div>
                        <div className="card-body">
                            <div className="row mb-3">
                                <div className="col-md-4">
                                    <small className="text-muted">Full Name</small>
                                    <p className="mb-0 fw-semibold">{user.name}</p>
                                </div>
                                <div className="col-md-4">
                                    <small className="text-muted">Username</small>
                                    <p className="mb-0 fw-semibold">{user.username}</p>
                                </div>
                                <div className="col-md-4">
                                    <small className="text-muted">Email</small>
                                    <p className="mb-0 fw-semibold">{user.email}</p>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-4">
                                    <small className="text-muted">Phone</small>
                                    <p className="mb-0 fw-semibold">{user.phone || '-'}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Account Information */}
                    <div className="card mb-4">
                        <div className="card-header">
                            <h5 className="mb-0">
                                <i className="bx bx-shield me-2"></i>
                                Account Information
                            </h5>
                        </div>
                        <div className="card-body">
                            <div className="row mb-3">
                                <div className="col-md-4">
                                    <small className="text-muted">Role</small>
                                    <p className="mb-0">
                                        <UserRoleBadge role={user.role} />
                                    </p>
                                    {user.role_detail && (
                                        <small className="text-muted d-block mt-1">
                                            {user.role_detail.description}
                                        </small>
                                    )}
                                </div>
                                <div className="col-md-4">
                                    <small className="text-muted">Status</small>
                                    <p className="mb-0">
                                        <UserStatusBadge status={user.status} />
                                    </p>
                                </div>
                                <div className="col-md-4">
                                    <small className="text-muted">Events Organizer</small>
                                    <p className="mb-0 fw-semibold">
                                        {user.eo_detail ? (
                                            <>
                                                {user.eo_detail.eo_name}
                                                <br />
                                                <small className="text-muted">
                                                    {user.eo_detail.company_name}
                                                </small>
                                            </>
                                        ) : (
                                            '-'
                                        )}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Activity Information */}
                    <div className="card">
                        <div className="card-header">
                            <h5 className="mb-0">
                                <i className="bx bx-time me-2"></i>
                                Activity Information
                            </h5>
                        </div>
                        <div className="card-body">
                            <div className="row">
                                <div className="col-md-6">
                                    <small className="text-muted">Account Created</small>
                                    <p className="mb-0 fw-semibold">
                                        {user.created_at}
                                    </p>
                                </div>
                                <div className="col-md-6">
                                    <small className="text-muted">Last Login</small>
                                    <p className="mb-0 fw-semibold">
                                        {user.last_login
                                            ? user.last_login
                                            : 'Never logged in'
                                        }
                                    </p>
                                </div>
                            </div>
                            {user.updated_at && (
                                <div className="row mt-3">
                                    <div className="col-md-6">
                                        <small className="text-muted">Last Updated</small>
                                        <p className="mb-0 fw-semibold">
                                            {user.updated_at}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
