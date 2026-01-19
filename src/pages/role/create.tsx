/**
 * Role Form - Create/Edit Role
 * @author Sarip Hidayat <hidayatsarip2210@gmail.com>
 * @date 2026-01-19
 */

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Role } from '@/models/Role';
import { InRole, InRoleForm } from '@/types/role';
import { showToast } from '@/utils/toast';
import useBlockUI from '@/pages/_components/useBlockUI';
import Link from 'next/link';

export default function RoleFormPage() {
    const router = useRouter();
    const { id } = router.query;
    const isEditMode = !!id;
    const { blockUI, unblockUI } = useBlockUI();

    const [formData, setFormData] = useState<InRoleForm>({
        name: '',
        description: '',
        status: 'Active',
        copy_from_role_id: undefined
    });
    const [role, setRole] = useState<InRole | null>(null);
    const [roles, setRoles] = useState<InRole[]>([]);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [touched, setTouched] = useState<{ [key: string]: boolean }>({});

    const Model = new Role();

    useEffect(() => {
        if (isEditMode && id) {
            loadRole(Number(id));
        }
        loadRoles();
    }, [id]);

    const loadRole = async (roleId: number) => {
        blockUI();
        try {
            const response = await Model.show(roleId);
            setRole(response.role);
            setFormData({
                name: response.role.name,
                description: response.role.description || '',
                status: response.role.status
            });
        } catch (error) {
            console.error('Error loading role:', error);
            showToast('Failed to load role', 'error');
            router.push('/role');
        } finally {
            unblockUI();
        }
    };

    const loadRoles = async () => {
        try {
            const response = await Model.list({ per_page: 100, status: 'Active' });
            setRoles(response.roles || []);
        } catch (error) {
            console.error('Error loading roles:', error);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        setTouched(prev => ({
            ...prev,
            [name]: true
        }));
        validateField(name, value);
    };

    const validateField = (name: string, value: any) => {
        let error = '';

        switch (name) {
            case 'name':
                if (!value.trim()) {
                    error = 'Role name is required';
                } else if (value.trim().length < 3) {
                    error = 'Role name must be at least 3 characters';
                } else if (value.trim().length > 50) {
                    error = 'Role name must not exceed 50 characters';
                }
                break;

            case 'description':
                if (value && value.length > 255) {
                    error = 'Description must not exceed 255 characters';
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

        if (!formData.name.trim()) {
            newErrors.name = 'Role name is required';
        } else if (formData.name.trim().length < 3) {
            newErrors.name = 'Role name must be at least 3 characters';
        }

        if (formData.description && formData.description.length > 255) {
            newErrors.description = 'Description must not exceed 255 characters';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Mark all as touched
        const allTouched = Object.keys(formData).reduce((acc, key) => {
            acc[key] = true;
            return acc;
        }, {} as { [key: string]: boolean });
        setTouched(allTouched);

        if (!validateForm()) {
            showToast('Please fix the errors', 'error');
            return;
        }

        blockUI();
        try {
            if (isEditMode && id) {
                await Model.update(Number(id), formData);
                showToast('Role updated successfully', 'success');
            } else {
                await Model.create(formData);
                showToast('Role created successfully', 'success');
            }
            router.push('/role');
        } catch (error: any) {
            console.error('Error saving role:', error);
            showToast(error?.message || 'Failed to save role', 'error');
        } finally {
            unblockUI();
        }
    };

    const isDefaultRole = role?.is_default || false;

    return (
        <div className="flex-grow-1 container-p-y">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <div>
                    <h4 className="py-2 breadcrumb-wrapper mb-0">
                        {isEditMode ? 'Edit Role' : 'Create Role'}
                    </h4>
                    <p className="text-muted">
                        {isEditMode ? `Edit role: ${role?.name}` : 'Create a new role with custom permissions'}
                    </p>
                </div>
                <Link href="/role" className="btn btn-outline-secondary">
                    <i className="bx bx-arrow-back me-1"></i>
                    Back to List
                </Link>
            </div>

            <div className="row">
                <div className="col-md-8">
                    <div className="card">
                        <div className="card-header">
                            <h5 className="mb-0">Role Information</h5>
                        </div>
                        <div className="card-body">
                            <form onSubmit={handleSubmit}>
                                {/* Role Name */}
                                <div className="mb-3">
                                    <label className="form-label" htmlFor="name">
                                        Role Name <span className="text-danger">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        className={`form-control ${touched.name && errors.name ? 'is-invalid' : ''}`}
                                        placeholder="Enter role name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        onBlur={(e) => {
                                            setTouched({ ...touched, name: true });
                                            validateField('name', e.target.value);
                                        }}
                                        disabled={isDefaultRole}
                                        readOnly={isDefaultRole}
                                    />
                                    {touched.name && errors.name && (
                                        <div className="invalid-feedback">{errors.name}</div>
                                    )}
                                    {isDefaultRole && (
                                        <small className="text-muted">
                                            <i className="bx bx-lock-alt me-1"></i>
                                            Default role name cannot be changed
                                        </small>
                                    )}
                                </div>

                                {/* Description */}
                                <div className="mb-3">
                                    <label className="form-label" htmlFor="description">
                                        Description
                                    </label>
                                    <textarea
                                        id="description"
                                        name="description"
                                        className={`form-control ${touched.description && errors.description ? 'is-invalid' : ''}`}
                                        rows={3}
                                        placeholder="Enter role description"
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        onBlur={(e) => {
                                            setTouched({ ...touched, description: true });
                                            validateField('description', e.target.value);
                                        }}
                                    />
                                    {touched.description && errors.description && (
                                        <div className="invalid-feedback">{errors.description}</div>
                                    )}
                                    <small className="text-muted">
                                        {formData.description?.length || 0}/255 characters
                                    </small>
                                </div>

                                {/* Status */}
                                <div className="mb-3">
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
                                    </select>
                                    <small className="text-muted">
                                        Inactive roles cannot be assigned to new users
                                    </small>
                                </div>

                                {/* Copy from existing role (only for create) */}
                                {!isEditMode && (
                                    <div className="mb-3">
                                        <label className="form-label" htmlFor="copy_from_role_id">
                                            Copy Permissions From (Optional)
                                        </label>
                                        <select
                                            id="copy_from_role_id"
                                            name="copy_from_role_id"
                                            className="form-select"
                                            value={formData.copy_from_role_id || ''}
                                            onChange={handleInputChange}
                                        >
                                            <option value="">-- Start with empty permissions --</option>
                                            {roles.map(r => (
                                                <option key={r.id} value={r.id}>
                                                    {r.name}
                                                </option>
                                            ))}
                                        </select>
                                        <small className="text-muted">
                                            You can copy permissions from an existing role and modify them later
                                        </small>
                                    </div>
                                )}

                                {/* Submit Buttons */}
                                <div className="d-flex gap-2 justify-content-end">
                                    <Link href="/role" className="btn btn-outline-secondary">
                                        Cancel
                                    </Link>
                                    <button type="submit" className="btn btn-primary">
                                        <i className="bx bx-save me-1"></i>
                                        {isEditMode ? 'Update Role' : 'Create Role'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>

                {/* Info Sidebar */}
                <div className="col-md-4">
                    <div className="card">
                        <div className="card-header">
                            <h6 className="mb-0">
                                <i className="bx bx-info-circle me-1"></i>
                                Information
                            </h6>
                        </div>
                        <div className="card-body">
                            <div className="mb-3">
                                <strong>Role LifeCycle:</strong>
                                <ol className="mt-2 ps-3">
                                    <li>Create role with name & description</li>
                                    <li>Set permissions (menu access & CRUD)</li>
                                    <li>Assign role to users</li>
                                </ol>
                            </div>

                            {isEditMode && role && (
                                <>
                                    <div className="mb-2">
                                        <strong>Type:</strong>
                                        <span className={`badge bg-${role.is_default ? 'primary' : 'info'} ms-2`}>
                                            {role.is_default ? 'Default' : 'Custom'}
                                        </span>
                                    </div>
                                    <div className="mb-2">
                                        <strong>Users:</strong>
                                        <span className="badge bg-light text-dark ms-2">
                                            {role.user_count || 0}
                                        </span>
                                    </div>
                                </>
                            )}

                            {!isEditMode && (
                                <div className="alert alert-info mb-0">
                                    <i className="bx bx-bulb me-1"></i>
                                    <strong>Tip:</strong> After creating the role, you can manage its permissions from the role list.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
