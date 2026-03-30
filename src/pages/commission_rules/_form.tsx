import React, { useState, useEffect, useRef } from 'react';
import { Offcanvas, Button, Form as BootstrapForm } from 'react-bootstrap';
import { InCommisionRulesForm } from "@/models/CommisionRules";
import { CommisionRules } from "@/models/CommisionRules";
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
    data: InCommisionRulesForm,
    onSave: (data: InCommisionRulesForm) => void,
    validationError?: { field: string; message: string }[]
}

const Form: React.FC<FormProps> = ({ title, data, onSave, validationError = [] }) => {
    const [formData, setFormData] = useState<InCommisionRulesForm>({
        id: null,
        module: "",
        rule_key: "",
        percentage: "",
        fixed_amount: "",
        is_active: 0
    });
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const CommisionRulesModel = new CommisionRules();

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
        jQuery("#modal-commision-rules").modal('hide');
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

        <div className="modal fade" id="modal-commision-rules" aria-hidden="true"   data-bs-backdrop="static" data-bs-keyboard="false" >
            <div className="modal-dialog modal-lg" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="exampleModalLabel1">{title}</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={onClose}></button>
                    </div>
                    <div className="modal-body">
                        <div className="row g-2">
                            <div className="col-6 mb-3">
                                <label className="form-label" htmlFor="module">Module</label>
                                <input
                                    type="text"
                                    id="module"
                                    name="module"
                                    className={`form-control ${!!errors?.module ? 'is-invalid' : ''}`}
                                    placeholder="module"
                                    value={formData.module}
                                    readOnly={true}
                                    disabled={true}
                                    onChange={handleInputChange}
                                />
                                {!!errors?.module && (
                                    <div className="invalid-feedback">{errors.module}</div>
                                )}
                            </div>
                            <div className="col-6 mb-3">
                                <label className="form-label" htmlFor="rule_key">Rule Key</label>
                                <input
                                    type="text"
                                    id="rule_key"
                                    name="rule_key"
                                    className={`form-control ${!!errors?.rule_key ? 'is-invalid' : ''}`}
                                    placeholder="rule_key"
                                    value={formData.rule_key}
                                    readOnly={true}
                                    disabled={true}
                                    onChange={handleInputChange}
                                />
                                {!!errors?.rule_key && (
                                    <div className="invalid-feedback">{errors.rule_key}</div>
                                )}
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-4 mb-3">
                                <label className="form-label" htmlFor="percentage">Percentage</label>
                                <div className="input-group">
                                    <input
                                        type="number"
                                        id="percentage"
                                        name="percentage"
                                        className={`form-control ${!!errors?.percentage ? 'is-invalid' : ''}`}
                                        placeholder="percentage"
                                        value={formData.percentage}
                                        onChange={handleInputChange}
                                    />
                                    <span className="input-group-text" id="basic-addon2">%</span>
                                </div>
                                {!!errors?.percentage && (
                                    <div className="invalid-feedback">{errors.percentage}</div>
                                )}
                            </div>


                            <div className="col-4 mb-3">
                                <label className="form-label" htmlFor="fixed_amount">Fixed Amount</label>
                                <div className="input-group">
                                    <span className="input-group-text" id="basic-addon2">Rp</span>
                                    <input
                                        type="number"
                                        id="fixed_amount"
                                        name="fixed_amount"
                                        className={`form-control ${!!errors?.fixed_amount ? 'is-invalid' : ''}`}
                                        placeholder="fixed_amount"
                                        value={formData.fixed_amount}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                {!!errors?.fixed_amount && (
                                    <div className="invalid-feedback">{errors.fixed_amount}</div>
                                )}
                            </div>

                            <div className="col-4 mb-3">
                                <label className="form-label" htmlFor="is_active">Is Active</label>
                                <select
                                    id="is_active"
                                    name="is_active"
                                    className={`form-control ${!!errors?.is_active ? 'is-invalid' : ''}`}
                                    value={formData.is_active}
                                    onChange={handleInputChange}
                                >
                                    <option value="">-- Select --</option>
                                    <option value="1">Active</option>
                                    <option value="0">Inactive</option>
                                </select>
                                {!!errors?.is_active && (
                                    <div className="invalid-feedback">{errors.is_active}</div>
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
