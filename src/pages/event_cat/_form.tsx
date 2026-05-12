import React, { useState, useEffect, useRef } from 'react';
import { Offcanvas, Button, Form as BootstrapForm } from 'react-bootstrap';
import { InEventCatForm } from "@/models/EventCat";
import { EventCat } from "@/models/EventCat";
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
    data: InEventCatForm,
    onSave: (data: InEventCatForm) => void,
    validationError?: { field: string; message: string }[]
}

const Form: React.FC<FormProps> = ({ title, data, onSave, validationError = [] }) => {
    const [formData, setFormData] = useState<InEventCatForm>({
        id: null,
        name: "",
        description: ""
    });
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
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
        jQuery("#modal-EventCat").modal('hide');
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

        <div className="modal fade" id="modal-EventCat" aria-hidden="true"   data-bs-backdrop="static" data-bs-keyboard="false" >
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
                                    className={`form-control ${!!errors?.name ? 'is-invalid' : ''}` }
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
                                <label className="form-label" htmlFor="description">Description</label>
                                <textarea
                                    id="description"
                                    name="description"
                                    className={`form-control ${!!errors?.description ? 'is-invalid' : ''}`}
                                    placeholder="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                />
                                {!!errors?.description && (
                                    <div className="invalid-feedback">{errors.description}</div>
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
