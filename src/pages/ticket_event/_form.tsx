/**
 * @author Sarip Hidayat <hidayatsarip2210@gmail.com>
 * @copyright Sarip Hidayat 2024  
 * @date 2026-01-14
 */

import React, { useState, useEffect } from 'react';
import { Form as BootstrapForm, Row, Col } from 'react-bootstrap';
import { InEventTicketForm } from '@/models/EventTicket';
import { Event } from '@/models/Event';
import Select2Component from '@/pages/_components/Select2';
import SingleDateTimePicker from '@/pages/_components/SingleDateTimePicker';

interface FormProps {
    title: string;
    data: InEventTicketForm;
    onSave: (data: InEventTicketForm) => void;
    validationError?: { field: string; message: string }[];
}

const Form: React.FC<FormProps> = ({ title, data, onSave, validationError = [] }) => {
    const [formData, setFormData] = useState<InEventTicketForm>(data);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const EventModel = new Event();

    useEffect(() => {
        setFormData(data);
    }, [data]);

    useEffect(() => {
        const errorMap = validationError.reduce((acc: { [key: string]: string }, error) => {
            acc[error.field] = error.message;
            return acc;
        }, {});
        setErrors(errorMap);
    }, [validationError]);

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
        jQuery("#modal-eventTicket").modal('hide');
    };

    return (
        <div className="modal fade" id="modal-eventTicket" aria-hidden="true" data-bs-backdrop="static" data-bs-keyboard="false">
            <div className="modal-dialog modal-lg" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">{title}</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={onClose}></button>
                    </div>
                    <div className="modal-body">
                        <Row className="g-3">
                            <Col md={12}>
                                <label className="form-label">Event *</label>
                                <Select2Component
                                    fetchData={EventModel.list}
                                    dropdownParent="#modal-eventTicket"
                                    placeholder="Select Event"
                                    name="event_id"
                                    onChange={handleInputChange}
                                    validation={errors.event_id}
                                    selectedId={formData.event_id as number}
                                    dataKey="events"
                                    showKey="title"
                                />
                            </Col>

                            <Col md={6}>
                                <label className="form-label">Ticket Name *</label>
                                <input
                                    type="text"
                                    name="name"
                                    className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                                    placeholder="e.g., General Admission, VIP"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                />
                                {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                            </Col>

                            <Col md={6}>
                                <label className="form-label">Price (IDR) *</label>
                                <input
                                    type="number"
                                    name="price"
                                    min="0"
                                    step="1000"
                                    className={`form-control ${errors.price ? 'is-invalid' : ''}`}
                                    placeholder="0"
                                    value={formData.price}
                                    onChange={handleInputChange}
                                />
                                {errors.price && <div className="invalid-feedback">{errors.price}</div>}
                            </Col>

                            <Col md={12}>
                                <label className="form-label">Description</label>
                                <textarea
                                    name="description"
                                    rows={2}
                                    className="form-control"
                                    placeholder="Optional description"
                                    value={formData.description || ''}
                                    onChange={handleInputChange}
                                />
                            </Col>

                            <Col md={4}>
                                <label className="form-label">Total Capacity *</label>
                                <input
                                    type="number"
                                    name="total_capacity"
                                    min="0"
                                    className={`form-control ${errors.total_capacity ? 'is-invalid' : ''}`}
                                    placeholder="0"
                                    value={formData.total_capacity}
                                    onChange={handleInputChange}
                                />
                                {errors.total_capacity && <div className="invalid-feedback">{errors.total_capacity}</div>}
                            </Col>

                            <Col md={4}>
                                <label className="form-label">Remaining Capacity *</label>
                                <input
                                    type="number"
                                    name="remaining_capacity"
                                    min="0"
                                    max={formData.total_capacity}
                                    className={`form-control ${errors.remaining_capacity ? 'is-invalid' : ''}`}
                                    placeholder="0"
                                    value={formData.remaining_capacity}
                                    onChange={handleInputChange}
                                />
                                {errors.remaining_capacity && <div className="invalid-feedback">{errors.remaining_capacity}</div>}
                            </Col>

                            <Col md={4}>
                                <label className="form-label">Max Per Order</label>
                                <input
                                    type="number"
                                    name="max_per_order"
                                    min="1"
                                    className="form-control"
                                    placeholder="5"
                                    value={formData.max_per_order || 5}
                                    onChange={handleInputChange}
                                />
                            </Col>

                            <Col md={6}>
                                <SingleDateTimePicker
                                    name="sales_start_date"
                                    label="Sales Start Date"
                                    parentEl="#modal-eventTicket"
                                    value={formData.sales_start_date || ''}
                                    onChange={(name, value) => setFormData(prev => ({ ...prev, sales_start_date: value }))}
                                />
                            </Col>

                            <Col md={6}>
                                <SingleDateTimePicker
                                    name="sales_end_date"
                                    label="Sales End Date"
                                    parentEl="#modal-eventTicket"
                                    value={formData.sales_end_date || ''}
                                    onChange={(name, value) => setFormData(prev => ({ ...prev, sales_end_date: value }))}
                                />
                            </Col>

                            <Col md={6}>
                                <label className="form-label">Sort Order</label>
                                <input
                                    type="number"
                                    name="sort_order"
                                    min="0"
                                    className="form-control"
                                    placeholder="0"
                                    value={formData.sort_order || 0}
                                    onChange={handleInputChange}
                                />
                                <small className="text-muted">Display order (lower numbers appear first)</small>
                            </Col>

                            <Col md={6}>
                                <label className="form-label">Status</label>
                                <div className="form-check form-switch mt-2">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        checked={formData.is_active !== false}
                                        onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.checked }))}
                                    />
                                    <label className="form-check-label">
                                        {formData.is_active ? 'Active' : 'Inactive'}
                                    </label>
                                </div>
                            </Col>
                        </Row>
                    </div>
                    <div className="modal-footer">
                        <button type="reset" className="btn btn-label-secondary" data-bs-dismiss="modal" aria-label="Close" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="button" className="btn btn-primary me-sm-3 me-1" onClick={save}>
                            <i className="bx bx-save me-1"></i>
                            Save
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Form;
