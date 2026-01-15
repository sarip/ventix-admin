import React, { useState, useEffect } from 'react';
import { Offcanvas, Button, Form as BootstrapForm } from 'react-bootstrap';
import { InItemForm } from "@/models/Item";
import { Action } from '@/models/Action';
import { RoleAction } from "@/models/RoleAction";
import {Module} from "@/models/Module";

interface FormProps {
    title: string,
    show: boolean,
    onClose: () => void,
    data: InItemForm,
    onSave: (data: InItemForm) => Promise<void>,
    validationError?: any[],
    scopes: any[]
}

const Form: React.FC<FormProps> = ({ title, show, onClose, data, onSave, validationError, scopes }) => {
    const [formData, setFormData] = useState<InItemForm>({ id: undefined, name: '', description: '', scope: '', permissions: {} });
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [permissions, setPermissions] = useState<any[]>([]);
    const [selectedPermissions, setSelectedPermissions] = useState<{ [key: string]: any }>({});
    const [selectAll, setSelectAll] = useState(false);

    useEffect(() => {
        setFormData(data);
    }, [data]);

    useEffect(() => {
        setErrors({});
        if (validationError && validationError.length > 0) {
            const errorMap = validationError.reduce((acc: { [key: string]: string }, error) => {
                acc[error.field] = error.message;
                return acc;
            }, {});
            setErrors(errorMap);
        }
    }, [validationError]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSelectAllChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { checked } = e.target;
        const updatedPermissions = permissions.reduce((acc, permission) => {
            acc[permission.id] = {
                read: checked,
                create: checked,
                update: checked,
                delete: checked,
            };
            return acc;
        }, {});

        setSelectedPermissions(updatedPermissions);
    };

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>, permissionId: string, actionType: string) => {
        const { checked } = e.target;
        setSelectedPermissions((prevPermissions) => ({
            ...prevPermissions,
            [permissionId]: {
                ...prevPermissions[permissionId],
                [actionType]: checked,
            },
        }));
    };

    const save = async () => {
        const permissionsData = permissions.map(permission => ({
            id: permission.id,
            module_id: permission.id,
            label: permission.name,
            endpoint: permission.name,
            title: permission.name,
            can_read: selectedPermissions[permission.id]?.read ? "Y" : "N",
            can_create: selectedPermissions[permission.id]?.create ? "Y" : "N",
            can_update: selectedPermissions[permission.id]?.update ? "Y" : "N",
            can_delete: selectedPermissions[permission.id]?.delete ? "Y" : "N",
        }));

        const updatedData = {
            ...formData,
            permissions: permissionsData,
        };
        await onSave(updatedData);
    };

    const handleSelectAllForLabel = (permissionId: string, isChecked: boolean) => {
        setSelectedPermissions((prevPermissions) => ({
            ...prevPermissions,
            [permissionId]: {
                read: isChecked,
                create: isChecked,
                update: isChecked,
                delete: isChecked,
            },
        }));
    };

    const ModelModule = new Module();

    useEffect(() => {
        const fetchPermissions = async () => {
            setPermissions([]);
            setSelectedPermissions([]);

            let permission_update: any[] = [];

            try {
                // Step 1: Ambil RoleAction jika ada formData.id
                if (formData.id) {
                    const RoleActionModel = new RoleAction();
                    const roleResponse = await RoleActionModel.list({ filter: `role_id:${formData.id}`, per_page: '100000000000' });
                    permission_update = roleResponse.role_actions || [];
                }

                // Step 2: Ambil daftar module
                const moduleResponse = await ModelModule.list({sort_by: `sort_order:asc`});
                const modules = moduleResponse.modules || [];

                // Step 3: Bentuk permission map berdasarkan hasil di atas
                const selected = modules.reduce((acc: Record<string, any>, module) => {
                    const existing = permission_update.find((p) => p.module_id === module.id);
                    acc[module.id] = {
                        read: existing?.can_read === "Y" || false,
                        create: existing?.can_create === "Y" || false,
                        update: existing?.can_update === "Y" || false,
                        delete: existing?.can_delete === "Y" || false,
                    };
                    return acc;
                }, {});

                // Step 4: Set state
                setPermissions(modules);
                setSelectedPermissions(selected);
            } catch (error) {
                console.error("Error fetching permissions:", error);
            }
        };

        fetchPermissions();
    }, [formData.id]);


    return (
        <div className="modal fade" id="modal-role" tabIndex="-1" aria-hidden="true">
            <div className="modal-dialog modal-lg modal-dialog-centered modal-add-new-role">
                <div className="modal-content p-3 p-md-5">
                    <button type="button" className="btn-close btn-pinned" data-bs-dismiss="modal" aria-label="Close"></button>
                    <div className="modal-body">
                        <div className="text-center mb-4">
                            <h3 className="role-title">{title}</h3>
                            <p>Menetapkan Hak Akses Peran</p>
                        </div>
                        <form id="addRoleForm" className="row g-3">
                            {/*<div className="col-6 mb-4">*/}
                            {/*    <label className="form-label" htmlFor="scope">Scope</label>*/}
                            {/*    <select className={`form-control ${!!errors?.scope ? 'is-invalid' : ''}`} name="scope" value={formData.scope} onChange={handleInputChange}>*/}
                            {/*        <option value="">Pilih Scope</option>*/}
                            {/*        {scopes.map((scope, key) => (*/}
                            {/*            <option value={scope.scope} key={key}>{scope.scope}</option>*/}
                            {/*        ))}*/}
                            {/*    </select>*/}
                            {/*    {!!errors?.scope && (*/}
                            {/*        <div className="invalid-feedback">{errors.scope}</div>*/}
                            {/*    )}*/}
                            {/*</div>*/}
                            <div className="col-12">
                                <label className="form-label" htmlFor="name">Role Name</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    className={`form-control ${!!errors?.name ? 'is-invalid' : ''}`}
                                    placeholder="Enter a role name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                />
                                {!!errors?.name && (
                                    <div className="invalid-feedback">{errors.name}</div>
                                )}
                            </div>
                            <div className="col-12 mb-4">
                                <label className="form-label" htmlFor="description">Description</label>
                                <textarea
                                    id="description"
                                    name="description"
                                    className={`form-control ${!!errors?.description ? 'is-invalid' : ''}`}
                                    placeholder="Enter a role description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                />
                                {!!errors?.description && (
                                    <div className="invalid-feedback">{errors.description}</div>
                                )}
                            </div>
                            <div className="col-12">
                                <h5>Role Permissions</h5>
                                <div className="table-responsive">
                                    <table className="table table-flush-spacing">
                                        <tbody>
                                        <tr>
                                            <td className="text-nowrap fw-medium">
                                                Access <i
                                                className="bx bx-info-circle bx-xs"
                                                data-bs-toggle="tooltip"
                                                data-bs-placement="top"
                                                title="Allows a full access to the system"
                                            ></i>
                                            </td>
                                            <td>
                                                <div className="form-check">
                                                    <input
                                                        className="form-check-input"
                                                        type="checkbox"
                                                        id="selectAll"
                                                        onChange={handleSelectAllChange}
                                                        checked={permissions.length > 0 && Object.values(selectedPermissions).every(p =>
                                                            p.read && p.create && p.update && p.delete)}
                                                    />
                                                    <label className="form-check-label" htmlFor="selectAll">
                                                        Select All
                                                    </label>
                                                </div>
                                            </td>
                                        </tr>
                                        {permissions.length > 0 ? (
                                            permissions.map((permission) => (
                                                <tr key={permission.id}>
                                                    <td className="text-nowrap fw-medium">
                                                        <div className="form-check">
                                                            <input
                                                                className="form-check-input"
                                                                type="checkbox"
                                                                id={`selectAll-${permission.id}`}
                                                                onChange={(e) => handleSelectAllForLabel(permission.id, e.target.checked)}
                                                                checked={
                                                                    selectedPermissions[permission.id]?.read &&
                                                                    selectedPermissions[permission.id]?.create &&
                                                                    selectedPermissions[permission.id]?.update &&
                                                                    selectedPermissions[permission.id]?.delete
                                                                }
                                                            />
                                                            <label className="form-check-label"
                                                                   htmlFor={`selectAll-${permission.id}`}>
                                                                {permission.name}
                                                            </label>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div className="d-flex">
                                                            <div className="form-check me-3 me-lg-5">
                                                                <input
                                                                    className="form-check-input"
                                                                    type="checkbox"
                                                                    id={`read-${permission.id}`}
                                                                    checked={selectedPermissions[permission.id]?.read || false}
                                                                    onChange={(e) => handleCheckboxChange(e, permission.id, 'read')}
                                                                />
                                                                <label className="form-check-label"
                                                                       htmlFor={`read-${permission.id}`}>
                                                                    Read
                                                                </label>
                                                            </div>
                                                            <div className="form-check me-3 me-lg-5">
                                                                <input
                                                                    className="form-check-input"
                                                                    type="checkbox"
                                                                    id={`create-${permission.id}`}
                                                                    checked={selectedPermissions[permission.id]?.create || false}
                                                                    onChange={(e) => handleCheckboxChange(e, permission.id, 'create')}
                                                                />
                                                                <label className="form-check-label"
                                                                       htmlFor={`create-${permission.id}`}>
                                                                    Create
                                                                </label>
                                                            </div>
                                                            <div className="form-check me-3 me-lg-5">
                                                                <input
                                                                    className="form-check-input"
                                                                    type="checkbox"
                                                                    id={`update-${permission.id}`}
                                                                    checked={selectedPermissions[permission.id]?.update || false}
                                                                    onChange={(e) => handleCheckboxChange(e, permission.id, 'update')}
                                                                />
                                                                <label className="form-check-label"
                                                                       htmlFor={`update-${permission.id}`}>
                                                                    Update
                                                                </label>
                                                            </div>
                                                            <div className="form-check">
                                                                <input
                                                                    className="form-check-input"
                                                                    type="checkbox"
                                                                    id={`delete-${permission.id}`}
                                                                    checked={selectedPermissions[permission.id]?.delete || false}
                                                                    onChange={(e) => handleCheckboxChange(e, permission.id, 'delete')}
                                                                />
                                                                <label className="form-check-label"
                                                                       htmlFor={`delete-${permission.id}`}>
                                                                    Delete
                                                                </label>
                                                            </div>

                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={2} className="text-center">Tidak ada izin yang tersedia
                                                    untuk scope yang dipilih.
                                                </td>
                                            </tr>
                                        )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div className="col-12 text-center mt-4">
                                <button type="button" className="btn btn-primary me-sm-3 me-1" onClick={save}>Submit
                                </button>
                                <button type="reset" className="btn btn-label-secondary" data-bs-dismiss="modal"
                                        aria-label="Close">Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Form;
