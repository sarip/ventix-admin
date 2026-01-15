import React, { useState, useEffect, useRef } from 'react';
import { Offcanvas, Button, Form as BootstrapForm } from 'react-bootstrap';
import { InUserForm } from "@/models/User";
import { Role } from '@/models/Role';
import $ from "jquery";
import 'select2/dist/js/select2.min.js';
import 'select2/dist/css/select2.min.css';
import swal from "sweetalert2";
import Select2Component from "@/pages/_components/Select2";



interface FormProps {
    title: string,
    show: boolean,
    onClose: () => void,
    data: InUserForm,
    onSave: (data: InUserForm) => void,
    validationError?: { field: string; message: string }[]
}

const Form: React.FC<FormProps> = ({ title, show, onClose, data, onSave, validationError = [] }) => {
    const [formData, setFormData] = useState<InUserForm>({ id: undefined, role_id: '', username: '', password: '', fullname: '' });
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const selectRef = useRef<HTMLSelectElement>(null);

    const RoleModel = new Role();

    useEffect(() => {
        setFormData(data);
        console.log({'form' : formData})
    }, [data]);


    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value,
        }));
    };

    const save = () => {
        onSave(formData);
    };

    useEffect(() => {
        setErrors({});
        if (validationError.length > 0) {
            const errorMap = validationError.reduce((acc: { [key: string]: string }, error) => {
                acc[error.field] = error.message;
                return acc;
            }, {});
            setErrors(errorMap);
        }
    }, [validationError]);

    return (

        <div className="modal fade" id="modal-user" aria-hidden="true" tabIndex="-1"  data-bs-backdrop="static" data-bs-keyboard="false" >
            <div className="modal-dialog" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="exampleModalLabel1">{title}</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={onClose}></button>
                    </div>
                    <div className="modal-body">
                        <div className="row g-2">
                            <div className="col mb-3">
                                <label className="form-label" htmlFor="username">Username</label>
                                <input
                                    type="text"
                                    id="username"
                                    name="username"
                                    className={`form-control ${!!errors?.username ? 'is-invalid' : ''}`}
                                    placeholder="username"
                                    value={formData.username}
                                    onChange={handleInputChange}
                                />
                                {!!errors?.username && (
                                    <div className="invalid-feedback">{errors.username}</div>
                                )}
                            </div>
                            <div className="col mb-3">
                                <label className="form-label" htmlFor="password">Password</label>
                                <input
                                    type="text"
                                    id="password"
                                    name="password"
                                    className={`form-control ${!!errors?.password ? 'is-invalid' : ''}`}
                                    placeholder="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                />
                                {!!errors?.password && (
                                    <div className="invalid-feedback">{errors.password}</div>
                                )}
                            </div>
                        </div>
                        <div className="row">
                            <div className="col mb-3">
                                <label className="form-label" htmlFor="fullname">Fullname</label>
                                <input
                                    type="text"
                                    id="fullname"
                                    name="fullname"
                                    className={`form-control ${!!errors?.fullname ? 'is-invalid' : ''}`}
                                    placeholder="fullname"
                                    value={formData.fullname}
                                    onChange={handleInputChange}
                                />
                                {!!errors?.fullname && (
                                    <div className="invalid-feedback">{errors.fullname}</div>
                                )}
                            </div>
                        </div>
                        <div className="row">
                            <div className="col mb-3">
                                <label className="form-label" htmlFor="role_id">Role</label>
                                <Select2Component
                                    fetchData={RoleModel.list}
                                    dropdownParent="#modal-user"
                                    placeholder="Pilih opsi"
                                    name="role_id"
                                    onChange={handleInputChange}
                                    validation={errors.role_id}
                                    selectedId={formData.role_id}
                                    dataKey="roles"
                                    showKey="name"
                                />
                                {!!errors?.role_id && (
                                    <div className="invalid-feedback">Kolom Role Harus Diisi</div>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button type="reset" className="btn btn-label-secondary" data-bs-dismiss="modal" aria-label="Close" onClick={onClose}>Cancel</button>
                        <button type="button" className="btn btn-primary me-sm-3 me-1" onClick={save}>Save</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Form;
