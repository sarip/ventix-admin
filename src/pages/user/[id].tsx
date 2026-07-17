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
                    <div className="card h-100 overflow-hidden">
                        {/* Cover Photo */}
                        <div
                            className="bg-primary"
                            style={{
                                height: '100px',
                                backgroundImage: user.cover_photo ? `url(${user.cover_photo})` : 'none',
                                backgroundSize: 'cover',
                                backgroundPosition: 'center'
                            }}
                        ></div>

                        <div className="card-body text-center" style={{ marginTop: '-50px' }}>
                            {/* Profile Picture */}
                            <div className="mb-3">
                                {user.profile_picture ? (
                                    <img
                                        src={user.profile_picture}
                                        alt={user.name}
                                        className="rounded-circle border border-5 border-white shadow-sm"
                                        style={{ width: '120px', height: '120px', objectFit: 'cover' }}
                                    />
                                ) : (
                                    <div
                                        className="rounded-circle mx-auto d-flex align-items-center justify-content-center bg-primary text-white border border-5 border-white shadow-sm"
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

                            {/* Social Stats (Followers/Following) */}
                            {user.role === 'General_User' && (
                                <div className="d-flex justify-content-center gap-4 mb-4">
                                    <div className="text-center">
                                        <h6 className="mb-0">{user.followers_count || 0}</h6>
                                        <small className="text-muted">Followers</small>
                                    </div>
                                    <div className="text-center">
                                        <h6 className="mb-0">{user.following_count || 0}</h6>
                                        <small className="text-muted">Following</small>
                                    </div>
                                </div>
                            )}

                            {/* Referral Code */}
                            <div className="mt-4 text-start">
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
                            <div className="row mb-3">
                                <div className="col-md-4">
                                    <small className="text-muted">Phone</small>
                                    <p className="mb-0 fw-semibold">{user.phone || '-'}</p>
                                </div>
                                <div className="col-md-8">
                                    <small className="text-muted">Bio</small>
                                    <p className="mb-0">{user.bio || 'No bio provided'}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Member Profile Enhancements (Only for General_User/Member) */}
                    {user.role === 'General_User' && (
                        <>
                            {/* Experiences */}
                            <div className="card mb-4">
                                <div className="card-header d-flex justify-content-between align-items-center">
                                    <h5 className="mb-0">
                                        <i className="bx bx-briefcase me-2"></i>
                                        Experiences
                                    </h5>
                                    <span className="badge bg-label-primary">{user.experiences?.length || 0} Total</span>
                                </div>
                                <div className="card-body">
                                    {user.experiences && user.experiences.length > 0 ? (
                                        <div className="list-group list-group-flush">
                                            {user.experiences.map((exp, idx) => (
                                                <div key={idx} className="list-group-item px-0 border-bottom-0 pb-3">
                                                    <div className="d-flex align-items-start">
                                                        <div className="badge bg-label-info p-2 me-3">
                                                            <i className={`bx ${exp.type === 'EVENT' ? 'bx-calendar-event' : exp.type === 'FACILITY' ? 'bx-building' : 'bx-medal'} fs-4`}></i>
                                                        </div>
                                                        <div className="flex-grow-1">
                                                            <h6 className="mb-1">{exp.title}</h6>
                                                            <p className="mb-1 text-muted small">{exp.description}</p>
                                                            <small className="text-primary">{exp.date}</small>
                                                        </div>
                                                        {!exp.is_public && <span className="badge bg-label-secondary ms-2">Private</span>}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-muted mb-0">No experiences listed.</p>
                                    )}
                                </div>
                            </div>

                            {/* Ratings & Reviews */}
                            <div className="card mb-4">
                                <div className="card-header d-flex justify-content-between align-items-center">
                                    <h5 className="mb-0">
                                        <i className="bx bx-star me-2"></i>
                                        Ratings & Reviews
                                    </h5>
                                    <div className="d-flex align-items-center">
                                        <small className="text-muted me-2">Show in Profile:</small>
                                        <span className={`badge ${user.show_ratings ? 'bg-label-success' : 'bg-label-danger'}`}>
                                            {user.show_ratings ? 'Yes' : 'No'}
                                        </span>
                                    </div>
                                </div>
                                <div className="card-body">
                                    {user.ratings && user.ratings.length > 0 ? (
                                        <div className="list-group list-group-flush">
                                            {user.ratings.map((rating, idx) => (
                                                <div key={idx} className="list-group-item px-0 border-bottom-0 pb-3">
                                                    <div className="d-flex align-items-start">
                                                        <div className="flex-grow-1">
                                                            <div className="d-flex align-items-center mb-1">
                                                                <h6 className="mb-0 me-3">{rating.target_type}: {rating.target_id}</h6>
                                                                <div className="text-warning">
                                                                    {[...Array(5)].map((_, i) => (
                                                                        <i key={i} className={`bx ${i < rating.rating ? 'bxs-star' : 'bx-star'}`}></i>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                            <p className="mb-0 text-muted small">{rating.comment}</p>
                                                        </div>
                                                        {!rating.is_public && <span className="badge bg-label-secondary ms-2">Private</span>}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-muted mb-0">No ratings or reviews yet.</p>
                                    )}
                                </div>
                            </div>
                        </>
                    )}

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
