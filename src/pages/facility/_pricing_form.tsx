/**
 * Facility Pricing Form Modal
 */

import React, { useState, useEffect } from 'react';
import { Modal, Button, Form as BootstrapForm, Row, Col } from 'react-bootstrap';
import { InFacilityPricingForm } from '@/models/FacilityPricing';

interface FormProps {
    title: string;
    data: InFacilityPricingForm;
    onHide: () => void;
    onSave: (data: InFacilityPricingForm) => void;
    validationError?: { field: string; message: string }[];
}

const FacilityPricingForm: React.FC<FormProps> = ({ title, data, onHide, onSave, validationError = [] }) => {
    const [formData, setFormData] = useState<InFacilityPricingForm>(data);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

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
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <Modal show={true} onHide={onHide} centered>
            <Modal.Header closeButton>
                <Modal.Title>
                    <i className="bx bx-dollar me-2"></i>
                    {title}
                </Modal.Title>
            </Modal.Header>
            <form onSubmit={handleSubmit}>
                <Modal.Body>
                    <Row className="g-3">
                        <Col md={12}>
                            <BootstrapForm.Group>
                                <BootstrapForm.Label>Day Type *</BootstrapForm.Label>
                                <BootstrapForm.Select
                                    name="day_type"
                                    value={formData.day_type}
                                    onChange={handleInputChange}
                                    isInvalid={!!errors.day_type}
                                    required
                                >
                                    <option value="Weekday">Weekday</option>
                                    <option value="Weekend">Weekend</option>
                                    <option value="Holiday">Holiday</option>
                                </BootstrapForm.Select>
                                {errors.day_type && (
                                    <BootstrapForm.Control.Feedback type="invalid">
                                        {errors.day_type}
                                    </BootstrapForm.Control.Feedback>
                                )}
                            </BootstrapForm.Group>
                        </Col>

                        <Col md={6}>
                            <BootstrapForm.Group>
                                <BootstrapForm.Label>Start Time *</BootstrapForm.Label>
                                <BootstrapForm.Control
                                    type="time"
                                    name="start_time"
                                    value={formData.start_time}
                                    onChange={handleInputChange}
                                    isInvalid={!!errors.start_time}
                                    required
                                />
                                {errors.start_time && (
                                    <BootstrapForm.Control.Feedback type="invalid">
                                        {errors.start_time}
                                    </BootstrapForm.Control.Feedback>
                                )}
                            </BootstrapForm.Group>
                        </Col>

                        <Col md={6}>
                            <BootstrapForm.Group>
                                <BootstrapForm.Label>End Time *</BootstrapForm.Label>
                                <BootstrapForm.Control
                                    type="time"
                                    name="end_time"
                                    value={formData.end_time}
                                    onChange={handleInputChange}
                                    isInvalid={!!errors.end_time}
                                    required
                                />
                                {errors.end_time && (
                                    <BootstrapForm.Control.Feedback type="invalid">
                                        {errors.end_time}
                                    </BootstrapForm.Control.Feedback>
                                )}
                            </BootstrapForm.Group>
                        </Col>

                        <Col md={12}>
                            <BootstrapForm.Group>
                                <BootstrapForm.Label>Price per Hour (IDR) *</BootstrapForm.Label>
                                <BootstrapForm.Control
                                    type="number"
                                    name="price_per_hour"
                                    value={formData.price_per_hour}
                                    onChange={handleInputChange}
                                    isInvalid={!!errors.price_per_hour}
                                    min="0"
                                    step="1000"
                                    required
                                />
                                {errors.price_per_hour && (
                                    <BootstrapForm.Control.Feedback type="invalid">
                                        {errors.price_per_hour}
                                    </BootstrapForm.Control.Feedback>
                                )}
                            </BootstrapForm.Group>
                        </Col>
                    </Row>

                    <div className="alert alert-info mt-3 mb-0">
                        <small>
                            <i className="bx bx-info-circle me-1"></i>
                            Ensure time ranges do not overlap with existing pricing rules for the same day type
                        </small>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={onHide}>
                        Cancel
                    </Button>
                    <Button type="submit" variant="primary">
                        <i className="bx bx-save me-1"></i>
                        {formData.id ? 'Update' : 'Create'} Pricing
                    </Button>
                </Modal.Footer>
            </form>
        </Modal>
    );
};

export default FacilityPricingForm;
