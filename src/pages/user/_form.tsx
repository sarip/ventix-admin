/**
 * Enhanced User Form Component
 * Complete form with all fields, validation, and password strength indicator
 * @author Sarip Hidayat <hidayatsarip2210@gmail.com>
 * @date 2026-01-17
 */

import React, { useState, useEffect } from 'react';
import { InUserForm } from "@/models/User";
import { UserRole, UserStatus } from '@/types/user';
import { getAvailableRoles } from '@/utils/permission';
import {
    validateUsername,
    validateEmail,
    validatePassword,
    validatePhone,
    validatePasswordsMatch,
    getPasswordStrength,
    getPasswordStrengthColor
} from '@/utils/validation';

interface FormProps {
    title: string;
    show: boolean;
    onClose: () => void;
    data: InUserForm;
    onSave: (data: InUserForm) => void;
    validationError?: { field: string; message: string }[];
}

const Form: React.FC<FormProps> = ({ title, show, onClose, data, onSave, validationError = [] }) => {
    const [formData, setFormData] = useState<InUserForm>(data);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [touched, setTouched] = useState<{ [key: string]: boolean }>({});
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const isEditMode = !!formData.id;
    const passwordStrength = formData.password ? getPasswordStrength(formData.password) : null;

    // Mock current user - TODO: get from auth context
    const currentUser = {
        id: 1,
        role: 'Super Admin' as UserRole,
        eo_id: null
    };

    const availableRoles = getAvailableRoles(currentUser as any);
    const requiresEO = ['EO Owner', 'EO Staff'].includes(formData.role);

    useEffect(() => {
        setFormData(data);
        setTouched({});
        setErrors({});
    }, [data]);

    // Handle backend validation errors
    useEffect(() => {
        if (validationError.length > 0) {
            const errorMap = validationError.reduce((acc: { [key: string]: string }, error) => {
                acc[error.field] = error.message;
                return acc;
            }, {});
            setErrors(errorMap);
        }
    }, [validationError]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Mark field as touched
        setTouched(prev => ({
            ...prev,
            [name]: true
        }));

        // Real-time validation
        validateField(name, value);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setTouched(prev => ({
            ...prev,
            [name]: true
        }));
        validateField(name, value);
    };

    const validateField = (name: string, value: any) => {
        let error = '';

        switch (name) {
            case 'username':
                if (!isEditMode) { // Username not editable in edit mode
                    const result = validateUsername(value);
                    if (!result.valid) error = result.error;
                }
                break;

            case 'name':
                if (!value || value.trim().length < 3) {
                    error = 'Name must be at least 3 characters';
                }
                break;

            case 'email':
                if (!isEditMode) { // Email not editable in edit mode
                    const result = validateEmail(value);
                    if (!result.valid) error = result.error;
                }
                break;

            case 'phone':
                const phoneResult = validatePhone(value);
                if (!phoneResult.valid) error = phoneResult.error;
                break;

            case 'password':
                if (!isEditMode || value) { // Required for create, optional for edit
                    const passResult = validatePassword(value);
                    if (!passResult.valid) {
                        error = passResult.errors[0] || 'Invalid password';
                    }
                }
                break;

            case 'confirm_password':
                if (!isEditMode || formData.password) {
                    const matchResult = validatePasswordsMatch(formData.password || '', value);
                    if (!matchResult.valid) error = matchResult.error;
                }
                break;

            case 'role':
                if (!value) error = 'Role is required';
                break;

            case 'eo_id':
                if (requiresEO && !value) {
                    error = 'Events Organizer is required for this role';
                }
                break;
        }

        setErrors(prev => ({
            ...prev,
            [name]: error
        }));
    };

    const validateForm = (): boolean => {
        const newErrors: { [key: string]: string } = {};

        // Username (required for create)
        if (!isEditMode) {
            const usernameResult = validateUsername(formData.username);
            if (!usernameResult.valid) newErrors.username = usernameResult.error;
        }

        // Name (always required)
        if (!formData.name || formData.name.trim().length < 3) {
            newErrors.name = 'Name is required';
        }

        // Email (required for create)
        if (!isEditMode) {
            const emailResult = validateEmail(formData.email);
            if (!emailResult.valid) newErrors.email = emailResult.error;
        }

        // Password (required for create, optional for edit)
        if (!isEditMode) {
            const passResult = validatePassword(formData.password || '');
            if (!passResult.valid) {
                newErrors.password = passResult.errors[0] || 'Password is required';
            }

            // Confirm password
            const matchResult = validatePasswordsMatch(formData.password || '', formData.confirm_password || '');
            if (!matchResult.valid) {
                newErrors.confirm_password = matchResult.error;
            }
        } else if (formData.password) {
            // If password is provided in edit mode, validate it
            const passResult = validatePassword(formData.password);
            if (!passResult.valid) {
                newErrors.password = passResult.errors[0];
            }
        }

        // Phone (optional but validate if provided)
        if (formData.phone) {
            const phoneResult = validatePhone(formData.phone);
            if (!phoneResult.valid) newErrors.phone = phoneResult.error;
        }

        // Role (required)
        if (!formData.role) {
            newErrors.role = 'Role is required';
        }

        // EO (required for EO roles)
        if (requiresEO && !formData.eo_id) {
            newErrors.eo_id = 'Events Organizer is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = () => {
        // Mark all fields as touched
        const allTouched = Object.keys(formData).reduce((acc, key) => {
            acc[key] = true;
            return acc;
        }, {} as { [key: string]: boolean });
        setTouched(allTouched);

        if (validateForm()) {
            onSave(formData);
        }
    };

    return (
        <div className="modal fade" id="modal-user" aria-hidden="true" tabIndex={-1} data-bs-backdrop="static" data-bs-keyboard="false">
            <div className="modal-dialog modal-lg" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">{title}</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={onClose}></button>
                    </div>
                    <div className="modal-body">
                        <div className="row g-3">
                            {/* Username */}
                            <div className="col-md-6">
                                <label className="form-label" htmlFor="username">
                                    Username <span className="text-danger">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="username"
                                    name="username"
                                    className={`form-control ${touched.username && errors.username ? 'is-invalid' : ''}`}
                                    placeholder="Enter username"
                                    value={formData.username}
                                    onChange={handleInputChange}
                                    onBlur={handleBlur}
                                    readOnly={isEditMode}
                                    disabled={isEditMode}
                                />
                                {touched.username && errors.username && (
                                    <div className="invalid-feedback">{errors.username}</div>
                                )}
                                {isEditMode && (
                                    <small className="text-muted">Username cannot be changed</small>
                                )}
                            </div>

                            {/* Name */}
                            <div className="col-md-6">
                                <label className="form-label" htmlFor="name">
                                    Full Name <span className="text-danger">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    className={`form-control ${touched.name && errors.name ? 'is-invalid' : ''}`}
                                    placeholder="Enter full name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    onBlur={handleBlur}
                                />
                                {touched.name && errors.name && (
                                    <div className="invalid-feedback">{errors.name}</div>
                                )}
                            </div>

                            {/* Email */}
                            <div className="col-md-6">
                                <label className="form-label" htmlFor="email">
                                    Email <span className="text-danger">*</span>
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    className={`form-control ${touched.email && errors.email ? 'is-invalid' : ''}`}
                                    placeholder="example@email.com"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    onBlur={handleBlur}
                                    readOnly={isEditMode}
                                    disabled={isEditMode}
                                />
                                {touched.email && errors.email && (
                                    <div className="invalid-feedback">{errors.email}</div>
                                )}
                                {isEditMode && (
                                    <small className="text-muted">Email cannot be changed</small>
                                )}
                            </div>

                            {/* Phone */}
                            <div className="col-md-6">
                                <label className="form-label" htmlFor="phone">
                                    Phone Number
                                </label>
                                <input
                                    type="text"
                                    id="phone"
                                    name="phone"
                                    className={`form-control ${touched.phone && errors.phone ? 'is-invalid' : ''}`}
                                    placeholder="081234567890"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    onBlur={handleBlur}
                                />
                                {touched.phone && errors.phone && (
                                    <div className="invalid-feedback">{errors.phone}</div>
                                )}
                            </div>

                            {/* Role */}
                            <div className="col-md-6">
                                <label className="form-label" htmlFor="role">
                                    Role <span className="text-danger">*</span>
                                </label>
                                <select
                                    id="role"
                                    name="role"
                                    className={`form-select ${touched.role && errors.role ? 'is-invalid' : ''}`}
                                    value={formData.role}
                                    onChange={handleInputChange}
                                    onBlur={handleBlur}
                                >
                                    <option value="">Select role</option>
                                    {availableRoles.map(role => (
                                        <option key={role} value={role}>{role}</option>
                                    ))}
                                </select>
                                {touched.role && errors.role && (
                                    <div className="invalid-feedback">{errors.role}</div>
                                )}
                            </div>

                            {/* Status */}
                            <div className="col-md-6">
                                <label className="form-label" htmlFor="status">
                                    Status <span className="text-danger">*</span>
                                </label>
                                <select
                                    id="status"
                                    name="status"
                                    className="form-select"
                                    value={formData.status}
                                    onChange={handleInputChange}
                                >
                                    <option value="Active">Active</option>
                                    <option value="Inactive">Inactive</option>
                                    <option value="Suspended">Suspended</option>
                                </select>
                            </div>

                            {/* Events Organizer (conditional) */}
                            {requiresEO && (
                                <div className="col-md-12">
                                    <label className="form-label" htmlFor="eo_id">
                                        Events Organizer <span className="text-danger">*</span>
                                    </label>
                                    <select
                                        id="eo_id"
                                        name="eo_id"
                                        className={`form-select ${touched.eo_id && errors.eo_id ? 'is-invalid' : ''}`}
                                        value={formData.eo_id || ''}
                                        onChange={handleInputChange}
                                        onBlur={handleBlur}
                                    >
                                        <option value="">Select Events Organizer</option>
                                        {/* TODO: Load EO options from API */}
                                        <option value="1">Jakarta Events Organizer</option>
                                        <option value="2">Bandung Events Organizer</option>
                                    </select>
                                    {touched.eo_id && errors.eo_id && (
                                        <div className="invalid-feedback">{errors.eo_id}</div>
                                    )}
                                </div>
                            )}

                            {/* Password (not shown in edit mode unless explicitly adding) */}
                            {!isEditMode && (
                                <>
                                    <div className="col-md-6">
                                        <label className="form-label" htmlFor="password">
                                            Password <span className="text-danger">*</span>
                                        </label>
                                        <div className="input-group">
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                id="password"
                                                name="password"
                                                className={`form-control ${touched.password && errors.password ? 'is-invalid' : ''}`}
                                                placeholder="Enter password"
                                                value={formData.password}
                                                onChange={handleInputChange}
                                                onBlur={handleBlur}
                                            />
                                            <button
                                                className="btn btn-outline-secondary"
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                            >
                                                <i className={`bx ${showPassword ? 'bx-hide' : 'bx-show'}`}></i>
                                            </button>
                                            {touched.password && errors.password && (
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

                                    <div className="col-md-6">
                                        <label className="form-label" htmlFor="confirm_password">
                                            Confirm Password <span className="text-danger">*</span>
                                        </label>
                                        <div className="input-group">
                                            <input
                                                type={showConfirmPassword ? "text" : "password"}
                                                id="confirm_password"
                                                name="confirm_password"
                                                className={`form-control ${touched.confirm_password && errors.confirm_password ? 'is-invalid' : ''}`}
                                                placeholder="Re-enter password"
                                                value={formData.confirm_password}
                                                onChange={handleInputChange}
                                                onBlur={handleBlur}
                                            />
                                            <button
                                                className="btn btn-outline-secondary"
                                                type="button"
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            >
                                                <i className={`bx ${showConfirmPassword ? 'bx-hide' : 'bx-show'}`}></i>
                                            </button>
                                            {touched.confirm_password && errors.confirm_password && (
                                                <div className="invalid-feedback">{errors.confirm_password}</div>
                                            )}
                                        </div>
                                    </div>
                                </>
                            )}

                            {isEditMode && (
                                <div className="col-12">
                                    <div className="alert alert-info mb-0">
                                        <i className="bx bx-info-circle me-2"></i>
                                        Use "Reset Password" action to change user password
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button
                            type="button"
                            className="btn btn-outline-secondary"
                            data-bs-dismiss="modal"
                            onClick={onClose}
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            className="btn btn-primary"
                            onClick={handleSave}
                        >
                            <i className="bx bx-save me-1"></i>
                            {isEditMode ? 'Update' : 'Create'} User
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Form;
