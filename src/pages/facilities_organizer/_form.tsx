/**
 * @author Sarip Hidayat <hidayatsarip2210@gmail.com>
 * @copyright Sarip Hidayat 2024
 * @date 2026-07-18
 */

import React, { useState, useEffect, useRef } from 'react';
import { Offcanvas, Button, Form as BootstrapForm } from 'react-bootstrap';
import { InFacilityOrganizerForm } from "@/models/FacilityOrganizer";
import { FacilityOrganizer } from "@/models/FacilityOrganizer";
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
    data: InFacilityOrganizerForm,
    onSave: (data: InFacilityOrganizerForm) => void,
    validationError?: { field: string; message: string }[]
}

const Form: React.FC<FormProps> = ({ title, data, onSave, validationError = [] }) => {
    const [formData, setFormData] = useState<InFacilityOrganizerForm>({
        id: null,
        facility_name: "",
        company_name: "",
        email: "",
        phone: "",
        website: "",
        address: "",
        logo_path: "",
        tax_id: "",
        description: "",
        legal_doc_path: "",
    });
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const FacilityOrganizerModel = new FacilityOrganizer();

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
        jQuery("#modal-FacilityOrganizer").modal('hide');
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

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;
        const { name } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: e.target.files![0],
        }));
    };


    return (

        <div className="modal fade" id="modal-FacilityOrganizer" aria-hidden="true" data-bs-backdrop="static" data-bs-keyboard="false" >
            <div className="modal-dialog" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="exampleModalLabel1">{title}</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={onClose}></button>
                    </div>
                    <div className="modal-body">
                        <div className="row g-2">
                            <div className="col mb-3">
                                <label className="form-label" htmlFor="facility_name">Facility Name</label>
                                <input
                                    type="text"
                                    id="facility_name"
                                    name="facility_name"
                                    className={`form-control ${!!errors?.facility_name ? 'is-invalid' : ''}`}
                                    placeholder="Facility Name"
                                    value={formData.facility_name}
                                    onChange={handleInputChange}
                                />
                                {!!errors?.facility_name && (
                                    <div className="invalid-feedback">{errors.facility_name}</div>
                                )}
                            </div>
                        </div>
                        <div className="row">
                            <div className="col mb-3">
                                <label className="form-label" htmlFor="email">Email</label>
                                <input
                                    type="text"
                                    id="email"
                                    name="email"
                                    className={`form-control ${!!errors?.email ? 'is-invalid' : ''}`}
                                    placeholder="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                />
                                {!!errors?.email && (
                                    <div className="invalid-feedback">{errors.email}</div>
                                )}
                            </div>
                        </div>
                        <div className="row">
                            <div className="col mb-3">
                                <label className="form-label" htmlFor="phone">Phone</label>
                                <input
                                    type="text"
                                    id="phone"
                                    name="phone"
                                    className={`form-control ${!!errors?.phone ? 'is-invalid' : ''}`}
                                    placeholder="phone"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                />
                                {!!errors?.phone && (
                                    <div className="invalid-feedback">{errors.phone}</div>
                                )}
                            </div>
                        </div>
                        <div className="row">
                            <div className="col mb-3">
                                <label className="form-label" htmlFor="website">Website</label>
                                <input
                                    type="text"
                                    id="website"
                                    name="website"
                                    className={`form-control ${!!errors?.website ? 'is-invalid' : ''}`}
                                    placeholder="website"
                                    value={formData.website}
                                    onChange={handleInputChange}
                                />
                                {!!errors?.website && (
                                    <div className="invalid-feedback">{errors.website}</div>
                                )}
                            </div>
                        </div>
                        <div className="row">
                            <div className="col mb-3">
                                <label className="form-label" htmlFor="company_name">Company Name</label>
                                <input
                                    type="text"
                                    id="company_name"
                                    name="company_name"
                                    className={`form-control ${!!errors?.company_name ? 'is-invalid' : ''}`}
                                    placeholder="company_name"
                                    value={formData.company_name}
                                    onChange={handleInputChange}
                                />
                                {!!errors?.company_name && (
                                    <div className="invalid-feedback">{errors.company_name}</div>
                                )}
                            </div>
                        </div>
                        <div className="row">
                            <div className="col mb-3">
                                <label className="form-label" htmlFor="tax_id">Tax ID</label>
                                <input
                                    type="text"
                                    id="tax_id"
                                    name="tax_id"
                                    className={`form-control ${!!errors?.tax_id ? 'is-invalid' : ''}`}
                                    placeholder="tax_id"
                                    value={formData.tax_id as string}
                                    onChange={handleInputChange}
                                />
                                {!!errors?.tax_id && (
                                    <div className="invalid-feedback">{errors.tax_id}</div>
                                )}
                            </div>
                        </div>
                        <div className="row">
                            <div className="col mb-3">
                                <label className="form-label" htmlFor="address">Address</label>
                                <textarea
                                    id="address"
                                    name="address"
                                    className={`form-control ${!!errors?.address ? 'is-invalid' : ''}`}
                                    placeholder="address"
                                    value={formData.address as string}
                                    onChange={handleInputChange}
                                />
                                {!!errors?.address && (
                                    <div className="invalid-feedback">{errors.address}</div>
                                )}
                            </div>
                        </div>
                        <div className="row">
                            <div className="col mb-3">
                                <label className="form-label" htmlFor="description">Description</label>
                                <textarea
                                    id="description"
                                    name="description"
                                    className={`form-control ${!!errors?.description ? 'is-invalid' : ''}`}
                                    placeholder="description"
                                    value={formData.description as string}
                                    onChange={handleInputChange}
                                />
                                {!!errors?.description && (
                                    <div className="invalid-feedback">{errors.description}</div>
                                )}
                            </div>
                        </div>
                        <div className="row">
                            <div className="col mb-3">
                                <label className="form-label" htmlFor="logo_path">Logo</label>
                                <input
                                    type="file"
                                    name="logo_path"
                                    className={`form-control ${!!errors?.logo_path ? 'is-invalid' : ''}`}
                                    onChange={handleFileChange}
                                />
                                {formData.logo_path && typeof formData.logo_path === 'string' && (
                                    <small className="text-muted">Current logo: {formData.logo_path}</small>
                                )}
                            </div>
                        </div>
                        <div className="row">
                            <div className="col mb-3">
                                <label className="form-label" htmlFor="legal_doc_path">Legal Document</label>
                                <input
                                    type="file"
                                    name="legal_doc_path"
                                    className={`form-control ${!!errors?.legal_doc_path ? 'is-invalid' : ''}`}
                                    onChange={handleFileChange}
                                />
                                {formData.legal_doc_path && (
                                    <small className="text-muted">
                                        Current document: <a href={`${process.env.NEXT_PUBLIC_BASE_URL?.replace('/api/v1/', '')}/uploads/legality/${formData.legal_doc_path}`} target="_blank" rel="noreferrer">View File</a>
                                    </small>
                                )}
                                {!!errors?.legal_doc_path && (
                                    <div className="invalid-feedback">{errors.legal_doc_path}</div>
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
