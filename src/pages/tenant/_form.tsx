import React, { useState, useEffect, useRef } from 'react';
import { Offcanvas, Button, Form as BootstrapForm } from 'react-bootstrap';
import { InTenantForm } from "@/models/Tenant";
import { Tenant } from "@/models/Tenant";
import { Role } from '@/models/Role';
import $ from "jquery";
import 'select2/dist/js/select2.min.js';
import 'select2/dist/css/select2.min.css';
import swal from "sweetalert2";
import Select2Component from "@/pages/_components/Select2";
import DateRangePicker from "react-bootstrap-daterangepicker";
import "bootstrap-daterangepicker/daterangepicker.css";
import SingleDatePicker from "@/pages/_components/SingleDatePicker";
import MetadataEditor from "@/pages/_components/MetadataEditor";



interface FormProps {
    title: string,
    data: InTenantForm,
    onSave: (data: InTenantForm) => void,
    validationError?: { field: string; message: string }[]
}

const Form: React.FC<FormProps> = ({ title, data, onSave, validationError = [] }) => {
    const [formData, setFormData] = useState<InTenantForm>({
        id: undefined,
        name: "",
        contact_name: "",
        contact_email: "",
        contact_phone: "",
        unit_code: ""
    });
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const TenantModel = new Tenant();

    useEffect(() => {
        setFormData(data);
    }, [data]);


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value,
        }));
    };



    const save = () => {
        onSave(formData);
    };

    const onClose = () => {
        jQuery("#modal-tenant").modal('hide');
    }

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

    const [selectedDate, setSelectedDate] = useState("");

    const handleApply = (event: any, picker: any) => {
        setSelectedDate(picker.startDate.format("YYYY-MM-DD"));
    };


    return (

        <div className="modal fade" id="modal-tenant" aria-hidden="true"   data-bs-backdrop="static" data-bs-keyboard="false" >
            <div className="modal-dialog" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="exampleModalLabel1">{title}</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={onClose}></button>
                    </div>
                    <div className="modal-body">
                        <div className="row g-2">
                            <div className="col mb-3">
                                <label className="form-label" htmlFor="name">Name</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    className={`form-control ${!!errors?.name ? 'is-invalid' : ''}`}
                                    placeholder="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                />
                                {!!errors?.name && (
                                    <div className="invalid-feedback">{errors.name}</div>
                                )}
                            </div>
                        </div>
                        <div className="row">
                            <div className="col mb-3">
                                <label className="form-label" htmlFor="contact_name">Contact Name</label>
                                <input
                                    type="text"
                                    id="contact_name"
                                    name="contact_name"
                                    className={`form-control ${!!errors?.contact_name ? 'is-invalid' : ''}`}
                                    placeholder="contact_name"
                                    value={formData.contact_name}
                                    onChange={handleInputChange}
                                />
                                {!!errors?.contact_name && (
                                    <div className="invalid-feedback">{errors.contact_name}</div>
                                )}
                            </div>
                        </div>
                        <div className="row">
                            <div className="col mb-3">
                                <label className="form-label" htmlFor="contact_email">Contact Email</label>
                                <input
                                    type="text"
                                    id="contact_email"
                                    name="contact_email"
                                    className={`form-control ${!!errors?.contact_email ? 'is-invalid' : ''}`}
                                    placeholder="contact_email"
                                    value={formData.contact_email}
                                    onChange={handleInputChange}
                                />
                                {!!errors?.contact_email && (
                                    <div className="invalid-feedback">{errors.contact_email}</div>
                                )}
                            </div>
                        </div>
                        <div className="row">
                            <div className="col mb-3">
                                <label className="form-label" htmlFor="contact_phone">Contact Phone</label>
                                <input
                                    type="text"
                                    id="contact_phone"
                                    name="contact_phone"
                                    className={`form-control ${!!errors?.contact_phone ? 'is-invalid' : ''}`}
                                    placeholder="contact_phone"
                                    value={formData.contact_phone}
                                    onChange={handleInputChange}
                                />
                                {!!errors?.contact_phone && (
                                    <div className="invalid-feedback">{errors.contact_phone}</div>
                                )}
                            </div>
                        </div>
                        <div className="row">
                            <div className="col mb-3">
                                <label className="form-label" htmlFor="unit_code">Unit Code</label>
                                <input
                                    type="text"
                                    id="unit_code"
                                    name="unit_code"
                                    className={`form-control ${!!errors?.unit_code ? 'is-invalid' : ''}`}
                                    placeholder="unit_code"
                                    value={formData.unit_code}
                                    onChange={handleInputChange}
                                />
                                {!!errors?.unit_code && (
                                    <div className="invalid-feedback">{errors.unit_code}</div>
                                )}
                            </div>
                        </div>
                    </div>


                    <div className="modal-footer">
                        <button type="reset" className="btn btn-label-secondary" data-bs-dismiss="modal"
                                aria-label="Close" onClick={onClose}>Cancel
                        </button>
                        <button type="button" className="btn btn-primary me-sm-3 me-1" onClick={save}>Save</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Form;
