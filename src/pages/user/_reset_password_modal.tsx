/**
 * Reset Password Modal - Manual Input Version
 * Allow admin to set custom password for user
 * @author Sarip Hidayat <hidayatsarip2210@gmail.com>
 * @date 2026-01-19
 */

import React, { useState, useEffect } from 'react';
import { InUser } from '@/models/User';
import { validatePassword, getPasswordStrength, getPasswordStrengthColor } from '@/utils/validation';

interface ResetPasswordModalProps {
    show: boolean;
    user: InUser | null;
    onClose: () => void;
    onConfirm: (userId: number, newPassword: string, sendEmail: boolean) => void;
}

const ResetPasswordModal: React.FC<ResetPasswordModalProps> = ({
    show,
    user,
    onClose,
    onConfirm
}) => {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [sendEmail, setSendEmail] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState<{ password?: string; confirmPassword?: string }>({});

    useEffect(() => {
        if (show && user) {
            setNewPassword('');
            setConfirmPassword('');
            setSendEmail(false);
            setShowPassword(false);
            setErrors({});
        }
    }, [show, user]);

    const validateForm = (): boolean => {
        const newErrors: { password?: string; confirmPassword?: string } = {};

        // Validate password
        const passResult = validatePassword(newPassword);
        if (!passResult.valid) {
            newErrors.password = passResult.errors[0] || 'Invalid password';
        }

        // Validate confirm password
        if (newPassword !== confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleConfirm = () => {
        if (!user) return;
        if (validateForm()) {
            onConfirm(user.id, newPassword, sendEmail);
            handleClose();
        }
    };

    const handleClose = () => {
        setNewPassword('');
        setConfirmPassword('');
        setSendEmail(false);
        setShowPassword(false);
        setErrors({});
        onClose();
    };

    if (!user) return null;

    const passwordStrength = newPassword ? getPasswordStrength(newPassword) : null;

    return (
        <div
            className="modal fade"
            id="modal-reset-password"
            aria-hidden="true"
            tabIndex={-1}
            data-bs-backdrop="static"
            data-bs-keyboard="false"
        >
            <div className="modal-dialog" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">
                            <i className="bx bx-lock me-2"></i>
                            Reset User Password
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
                        {/* User Info */}
                        <div className="alert alert-info mb-4">
                            <h6 className="alert-heading mb-2">
                                <i className="bx bx-user me-2"></i>
                                Target User
                            </h6>
                            <p className="mb-1">
                                <strong>Name:</strong> {user.name}
                            </p>
                            <p className="mb-1">
                                <strong>Username:</strong> @{user.username}
                            </p>
                            <p className="mb-0">
                                <strong>Email:</strong> {user.email}
                            </p>
                        </div>

                        {/* New Password Input */}
                        <div className="mb-3">
                            <label className="form-label" htmlFor="new-password">
                                New Password <span className="text-danger">*</span>
                            </label>
                            <div className="input-group">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="new-password"
                                    className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                                    placeholder="Enter new password"
                                    value={newPassword}
                                    onChange={(e) => {
                                        setNewPassword(e.target.value);
                                        setErrors({ ...errors, password: undefined });
                                    }}
                                />
                                <button
                                    className="btn btn-outline-secondary"
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    <i className={`bx ${showPassword ? 'bx-hide' : 'bx-show'}`}></i>
                                </button>
                                {errors.password && (
                                    <div className="invalid-feedback">{errors.password}</div>
                                )}
                            </div>
                            {passwordStrength && (
                                <div className="mt-1">
                                    <small className={`text-${getPasswordStrengthColor(passwordStrength)}`}>
                                        Strength: {passwordStrength}
                                    </small>
                                </div>
                            )}
                        </div>

                        {/* Confirm Password Input */}
                        <div className="mb-3">
                            <label className="form-label" htmlFor="confirm-password">
                                Confirm Password <span className="text-danger">*</span>
                            </label>
                            <input
                                type={showPassword ? "text" : "password"}
                                id="confirm-password"
                                className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
                                placeholder="Re-enter password"
                                value={confirmPassword}
                                onChange={(e) => {
                                    setConfirmPassword(e.target.value);
                                    setErrors({ ...errors, confirmPassword: undefined });
                                }}
                            />
                            {errors.confirmPassword && (
                                <div className="invalid-feedback">{errors.confirmPassword}</div>
                            )}
                        </div>

                        {/* Options */}
                        {/*<div className="mb-3">*/}
                        {/*    <div className="form-check">*/}
                        {/*        <input*/}
                        {/*            className="form-check-input"*/}
                        {/*            type="checkbox"*/}
                        {/*            id="send-email"*/}
                        {/*            checked={sendEmail}*/}
                        {/*            onChange={(e) => setSendEmail(e.target.checked)}*/}
                        {/*        />*/}
                        {/*        <label className="form-check-label" htmlFor="send-email">*/}
                        {/*            Send password via email to user*/}
                        {/*        </label>*/}
                        {/*    </div>*/}
                        {/*</div>*/}

                        {/* Warning */}
                        <div className="alert alert-warning mb-0">
                            <i className="bx bx-error-circle me-2"></i>
                            <strong>Note:</strong> User will be logged out from all active sessions after password reset.
                        </div>
                    </div>
                    <div className="modal-footer">
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
                            onClick={handleConfirm}
                            disabled={!newPassword || !confirmPassword}
                        >
                            <i className="bx bx-lock-open me-1"></i>
                            Reset Password
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResetPasswordModal;
