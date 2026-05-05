import React, { useState, useEffect, useRef } from 'react';
import { Offcanvas, Button, Form as BootstrapForm } from 'react-bootstrap';
import { InExternalForm } from "@/models/Event";
import { Event } from "@/models/Event";
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
import OptionEventStatus from "@/pages/_components/OptionEventStatus";
import {RegProvince} from "@/models/RegProvince";
import {EventCat} from "@/models/EventCat";



interface FormProps {
    title: string,
    data: InExternalForm,
    onSave: (data: InExternalForm) => void,
    validationError?: { field: string; message: string }[]
}

const Form: React.FC<FormProps> = ({ title, data, onSave, validationError = [] }) => {
    const [formData, setFormData] = useState<InExternalForm>({
        id: null,
        is_external: "N",
        external_url: "",
        title: "",
        start_date: "",
        end_date: "",
        location: "",
        event_category: "",
        events_status: "",
        thumbnail_url: "",
    });
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const EventModel = new Event();
    const RegProvinceModel = new RegProvince();
    const EventCatModel = new EventCat();

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
        jQuery("#modal-Event-external").modal('hide');
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

        setFormData({
            ...data,
            [e.target.name]: e.target.files[0]
        });
    };

    return (

        <div className="modal fade" id="modal-Event-external" aria-hidden="true" data-bs-backdrop="static" data-bs-keyboard="false" >
            <div className="modal-dialog" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="exampleModalLabel1">{title}</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={onClose}></button>
                    </div>
                    <div className="modal-body">
                        <div className="row g-2">
                            <div className="col mb-3">
                                <label className="form-label" htmlFor="external_url">URL EVENT</label>
                                <input
                                    type="text"
                                    id="external_url"
                                    name="external_url"
                                    className={`form-control ${!!errors?.external_url ? 'is-invalid' : ''}`}
                                    placeholder="external url"
                                    value={formData.external_url}
                                    onChange={handleInputChange}
                                />
                                {!!errors?.external_url && (
                                    <div className="invalid-feedback">{errors.external_url}</div>
                                )}
                            </div>
                        </div>
                        <div className="row g-2">
                            <div className="col mb-3">
                                <label className="form-label" htmlFor="title">Title</label>
                                <input
                                    type="text"
                                    id="title"
                                    name="title"
                                    className={`form-control ${!!errors?.title ? 'is-invalid' : ''}`}
                                    placeholder="title"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                />
                                {!!errors?.title && (
                                    <div className="invalid-feedback">{errors.title}</div>
                                )}
                            </div>
                        </div>
                        <div className="row g-2">
                            <div className="form-group mb-3">
                                <label className="form-label" htmlFor="event_category">Category</label>
                                <Select2Component
                                    fetchData={EventCatModel.list}
                                    dropdownParent="#modal-Event-external"
                                    placeholder="Pilih opsi"
                                    name="event_category"
                                    onChange={handleInputChange}
                                    validation={errors.event_category}
                                    selectedId={formData.event_category}
                                    dataKey="events_cat"
                                    showKey="name"
                                    id="name"
                                />
                                {!!errors?.event_category && (
                                    <div className="invalid-feedback">{errors.event_category}</div>
                                )}
                            </div>

                        </div>
                        <div className="row g-2">
                            <div className="col">
                                <SingleDatePicker
                                    name="start_date"
                                    label="Start Date"
                                    parentEl="#modal-Event-external"
                                    value={formData.start_date}
                                    onChange={(name, value) =>
                                        setFormData((prev) => ({...prev, [name]: value}))
                                    }
                                    error={errors.start_date}
                                />

                            </div>
                            <div className="col">
                                <SingleDatePicker
                                    name="end_date"
                                    label="End Date"
                                    parentEl="#modal-Event-external"
                                    value={formData.end_date}
                                    onChange={(name, value) =>
                                        setFormData((prev) => ({...prev, [name]: value}))
                                    }
                                    error={errors.end_date}
                                />
                            </div>
                        </div>
                        <div className="row g-2">
                            <div className="form-group mb-3">
                                <label className="form-label" htmlFor="events_status">Event
                                    Status</label>
                                <select
                                    id="events_status"
                                    name="events_status"
                                    className={`form-control ${!!errors?.events_status ? 'is-invalid' : ''}`}
                                    value={formData.events_status}
                                    onChange={handleInputChange}
                                >
                                    <option value="">-- Select --</option>
                                    <OptionEventStatus/>
                                </select>
                                {!!errors?.events_status && (
                                    <div className="invalid-feedback">{errors.location_name}</div>
                                )}
                            </div>
                        </div>
                        <div className="row g-2">
                            <div className="form-group mb-3">
                                <label className="form-label" htmlFor="location">Location</label>
                                <Select2Component
                                    fetchData={RegProvinceModel.list}
                                    dropdownParent="#modal-Event-external"
                                    placeholder="Pilih opsi"
                                    name="location"
                                    onChange={handleInputChange}
                                    validation={errors.location}
                                    selectedId={formData.location}
                                    dataKey="reg_provinces"
                                    showKey="name"
                                    id="name"
                                />
                                {!!errors?.location && (
                                    <div className="invalid-feedback">{errors.location}</div>
                                )}
                            </div>
                        </div>

                        <div className="row">
                            <div className="col mb-3">
                                <label className="form-label" htmlFor="thumbnail_url">Thumbnail Url</label>
                                <input
                                    type="file"
                                    name="thumbnail_url"
                                    className={`form-control ${!!errors?.logo_path ? 'is-invalid' : ''}`}
                                    onChange={handleFileChange}
                                />
                                {formData.thumbnail_url && typeof formData.thumbnail_url === 'string' && (
                                    <small className="text-muted">Current logo: {formData.thumbnail_url}</small>
                                )}
                            </div>
                        </div>
                        {/*<div className="row">*/}
                        {/*    <div className="col mb-3">*/}
                        {/*        <label className="form-label" htmlFor="legal_document">Legal Document</label>*/}
                        {/*        <input*/}
                        {/*            type="file"*/}
                        {/*            name="legal_document"*/}
                        {/*            className={`form-control ${!!errors?.legal_document ? 'is-invalid' : ''}`}*/}
                        {/*            onChange={handleFileChange}*/}
                        {/*        />*/}
                        {/*        {formData.legal_doc_path && (*/}
                        {/*            <small className="text-muted">*/}
                        {/*                Current document: <a href={`${process.env.NEXT_PUBLIC_BASE_URL?.replace('/api/v1/', '')}/uploads/legality/${formData.legal_doc_path}`} target="_blank" rel="noreferrer">View File</a>*/}
                        {/*            </small>*/}
                        {/*        )}*/}
                        {/*        {!!errors?.legal_document && (*/}
                        {/*            <div className="invalid-feedback">{errors.legal_document}</div>*/}
                        {/*        )}*/}
                        {/*    </div>*/}
                        {/*</div>*/}
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
