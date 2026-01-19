/**
 * Change User Status Modal
 * Two-step confirmation for changing user status with reason
 * @author Sarip Hidayat <hidayatsarip2210@gmail.com>
 * @date 2026-01-17
 */

import React, { useState, useEffect } from 'react';
import { InUser } from '@/models/User';
import { UserStatus } from '@/types/user';
import { UserStatusBadge } from '@/components/UserBadge';

interface ChangeStatusModalProps {
    show: boolean;
    user: InUser | null;
    currentUserId?: number;
    onClose: () => void;
    onConfirm: (userId: number, newStatus: UserStatus, reason: string) => void;
}

const ChangeStatusModal: React.FC<ChangeStatusModalProps> = ({
    show,
    user,
    currentUserId,
    onClose,
    onConfirm
}) => {
    const [step, setStep] = useState<1 | 2>(1);
    const [newStatus, setNewStatus] = useState<UserStatus>('Active');
    const [reason, setReason] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if (show && user) {
            setStep(1);
            setNewStatus(user.status);
            setReason('');
            setError('');
        }
    }, [show, user]);

    const handleNext = () => {
        setError('');

        // Validation
        if (newStatus === user?.status) {
            setError('Please select a different status');
            return;
        }

        // Check if trying to change own status
        if (user?.id === currentUserId) {
            setError('You cannot change your own status');
            return;
        }

        setStep(2);
    };

    const handleConfirm = () => {
        if (!user) return;

        onConfirm(user.id, newStatus, reason);
        handleClose();
    };

    const handleClose = () => {
        setStep(1);
        setNewStatus('Active');
        setReason('');
        setError('');
        onClose();
    };

    if (!user) return null;

    return (
        <div
            className="modal fade"
            id="modal-change-status"
            aria-hidden="true"
            tabIndex={-1}
            data-bs-backdrop="static"
            data-bs-keyboard="false"
        >
            <div className="modal-dialog" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">
                            <i className="bx bx-check-circle me-2"></i>
                            Change User Status
                        </h5>
                        <button
                            type="button"
                            className="btn-close"
                            data-bs-dismiss="modal"
                            aria-label="Close"
                            onClick={handleClose}
                        ></button>
                    </div>
                    <div className="modal-body">
                        {/* Step Indicator */}
                        <div className="mb-4">
                            <div className="d-flex justify-content-between">
                                <div className={`text-center flex-fill ${step >= 1 ? 'text-primary' : 'text-muted'}`}>
                                    <div className={`rounded-circle mx-auto mb-2 d-flex align-items-center justify-content-center ${step >= 1 ? 'bg-primary text-white' : 'bg-light'}`}
                                        style={{ width: '32px', height: '32px' }}>
                                        1
                                    </div>
                                    <small>Select Status</small>
                                </div>
                                <div className="d-flex align-items-center px-2">
                                    <div className={`border-top ${step >= 2 ? 'border-primary' : ''}`} style={{ width: '50px' }}></div>
                                </div>
                                <div className={`text-center flex-fill ${step >= 2 ? 'text-primary' : 'text-muted'}`}>
                                    <div className={`rounded-circle mx-auto mb-2 d-flex align-items-center justify-content-center ${step >= 2 ? 'bg-primary text-white' : 'bg-light'}`}
                                        style={{ width: '32px', height: '32px' }}>
                                        2
                                    </div>
                                    <small>Confirm</small>
                                </div>
                            </div>
                        </div>

                        {/* User Info */}
                        <div className="alert alert-info mb-3">
                            <strong>{user.name}</strong> (@{user.username})
                        </div>

                        {/* Step 1: Select Status */}
                        {step === 1 && (
                            <>
                                <div className="mb-3">
                                    <label className="form-label">Current Status</label>
                                    <div>
                                        <UserStatusBadge status={user.status} />
                                    </div>
                                </div>

                                <div className="mb-3">
                                    <label className="form-label" htmlFor="new-status">
                                        New Status <span className="text-danger">*</span>
                                    </label>
                                    <select
                                        id="new-status"
                                        className="form-select"
                                        value={newStatus}
                                        onChange={(e) => setNewStatus(e.target.value as UserStatus)}
                                    >
                                        <option value="Active">Active</option>
                                        <option value="Inactive">Inactive</option>
                                        <option value="Suspended">Suspended</option>
                                    </select>
                                </div>

                                <div className="mb-3">
                                    <label className="form-label" htmlFor="reason">
                                        Reason {(newStatus === 'Inactive' || newStatus === 'Suspended') && <span className="text-danger">*</span>}
                                    </label>
                                    <textarea
                                        id="reason"
                                        className="form-control"
                                        rows={3}
                                        placeholder="Enter reason for status change (optional)"
                                        value={reason}
                                        onChange={(e) => setReason(e.target.value)}
                                    ></textarea>
                                </div>

                                {error && (
                                    <div className="alert alert-danger">
                                        <i className="bx bx-error me-2"></i>
                                        {error}
                                    </div>
                                )}
                            </>
                        )}

                        {/* Step 2: Confirmation */}
                        {step === 2 && (
                            <div>
                                <div className="alert alert-warning">
                                    <h6 className="alert-heading mb-2">
                                        <i className="bx bx-error-circle me-2"></i>
                                        Please Confirm
                                    </h6>
                                    <p className="mb-0">
                                        You are about to change the status of <strong>{user.name}</strong> from{' '}
                                        <UserStatusBadge status={user.status} /> to{' '}
                                        <UserStatusBadge status={newStatus} />
                                    </p>
                                </div>

                                {reason && (
                                    <div className="mb-3">
                                        <label className="form-label fw-semibold">Reason:</label>
                                        <p className="text-muted">{reason}</p>
                                    </div>
                                )}

                                {(newStatus === 'Inactive' || newStatus === 'Suspended') && (
                                    <div className="alert alert-danger">
                                        <i className="bx bx-info-circle me-2"></i>
                                        <strong>Note:</strong> This user will be immediately logged out and cannot access the system.
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                    <div className="modal-footer">
                        {step === 1 ? (
                            <>
                                <button
                                    type="button"
                                    className="btn btn-outline-secondary"
                                    data-bs-dismiss="modal"
                                    onClick={handleClose}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={handleNext}
                                >
                                    Next
                                    <i className="bx bx-right-arrow-alt ms-1"></i>
                                </button>
                            </>
                        ) : (
                            <>
                                <button
                                    type="button"
                                    className="btn btn-outline-secondary"
                                    onClick={() => setStep(1)}
                                >
                                    <i className="bx bx-left-arrow-alt me-1"></i>
                                    Back
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={handleConfirm}
                                >
                                    <i className="bx bx-check me-1"></i>
                                    Confirm Change
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChangeStatusModal;
