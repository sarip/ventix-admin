/**
 * Facility Form Modal
 */

import React, { useState, useEffect } from 'react';
import $ from "jquery";
import 'select2/dist/js/select2.min.js';
import 'select2/dist/css/select2.min.css';
import { Modal, Button, Form as BootstrapForm, Row, Col } from 'react-bootstrap';
import { InFacilityForm } from '@/models/Facility';
import { User } from '@/models/User';
import Select2Component from '@/pages/_components/Select2';
import {EventOrganizer} from "@/models/EventOrganizer";

interface FormProps {
    title: string;
    data: InFacilityForm;
    onHide: () => void;
    onSave: (data: InFacilityForm) => void;
    validationError?: { field: string; message: string }[];
}

const FacilityFormModal: React.FC<FormProps> = ({ title, data, onHide, onSave, validationError = [] }) => {
    const [formData, setFormData] = useState<InFacilityForm>(data);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const UserModel = new User();

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

    const handleInputChange = (e: any) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    const EventOrganizerModel = new EventOrganizer();

    return (
        <div className="modal fade show d-block"   id="modal-facility" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-xl modal-dialog-scrollable">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">
                            <i className="bx bx-buildings me-2"></i>
                            {title}
                        </h5>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="modal-body">
                            <Row className="g-3">
                                <Col md={6}>
                                    <BootstrapForm.Group>
                                        <BootstrapForm.Label>Name *</BootstrapForm.Label>
                                        <BootstrapForm.Control
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            isInvalid={!!errors.name}
                                            required
                                        />
                                        {errors.name && (
                                            <BootstrapForm.Control.Feedback type="invalid">
                                                {errors.name}
                                            </BootstrapForm.Control.Feedback>
                                        )}
                                    </BootstrapForm.Group>
                                </Col>
                                <Col md={6}>
                                    <div className="form-group mb-3">
                                        <label className="form-label" htmlFor="events_organizer_id">EO</label>
                                        <Select2Component
                                            fetchData={EventOrganizerModel.list}
                                            dropdownParent="#modal-facility"
                                            placeholder="Pilih opsi"
                                            name="events_organizer_id"
                                            onChange={handleInputChange}
                                            validation={errors.events_organizer_id}
                                            selectedId={formData.events_organizer_id as number}
                                            dataKey="events_organizer"
                                            showKey="eo_name"
                                            filterKey=""
                                        />
                                        {!!errors?.events_organizer_id && (
                                            <div className="invalid-feedback">{errors.events_organizer_id}</div>
                                        )}
                                    </div>
                                </Col>

                                <Col md={6}>
                                    <BootstrapForm.Group>
                                        <BootstrapForm.Label>Category *</BootstrapForm.Label>
                                        <BootstrapForm.Select
                                            name="category"
                                            value={formData.category}
                                            onChange={handleInputChange}
                                            isInvalid={!!errors.category}
                                            required
                                        >
                                            <option value="">Select Category</option>
                                            <option value="Sports">Sports</option>
                                            <option value="Gaming">Gaming</option>
                                            <option value="Music">Music</option>
                                            <option value="Others">Others</option>
                                        </BootstrapForm.Select>
                                        {errors.category && (
                                            <BootstrapForm.Control.Feedback type="invalid">
                                                {errors.category}
                                            </BootstrapForm.Control.Feedback>
                                        )}
                                    </BootstrapForm.Group>
                                </Col>

                                <Col md={6}>
                                    <BootstrapForm.Group>
                                        <BootstrapForm.Label>Person in Charge *</BootstrapForm.Label>
                                        <Select2Component
                                            fetchData={UserModel.list}
                                            dropdownParent="#modal-facility"
                                            placeholder="Select PIC"
                                            name="user_id_pic"
                                            onChange={handleInputChange}
                                            validation={errors.user_id_pic}
                                            selectedId={formData.user_id_pic}
                                            dataKey="users"
                                            showKey="name"
                                            id="id"
                                        />
                                    </BootstrapForm.Group>
                                </Col>

                                <Col md={12}>
                                    <BootstrapForm.Group>
                                        <BootstrapForm.Label>Description</BootstrapForm.Label>
                                        <BootstrapForm.Control
                                            as="textarea"
                                            rows={3}
                                            name="description"
                                            value={formData.description}
                                            onChange={handleInputChange}
                                        />
                                    </BootstrapForm.Group>
                                </Col>

                                <Col md={12}>
                                    <BootstrapForm.Group>
                                        <BootstrapForm.Check
                                            type="switch"
                                            id="is_available"
                                            name="is_available"
                                            label="Available for Booking"
                                            checked={formData.is_available}
                                            onChange={handleInputChange}
                                        />
                                    </BootstrapForm.Group>
                                </Col>
                            </Row>
                        </div>
                        <div className="modal-footer">
                            <Button variant="secondary" onClick={onHide}>
                                Cancel
                            </Button>
                            <Button type="submit" variant="primary">
                                <i className="bx bx-save me-1"></i>
                                {formData.id ? 'Update' : 'Create'} Facility
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default FacilityFormModal;
