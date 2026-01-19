/**
 * Facility Booking Form Modal
 */

import React, { useState, useEffect } from 'react';
import $ from "jquery";
import 'select2/dist/js/select2.min.js';
import 'select2/dist/css/select2.min.css';
import { Modal, Button, Form as BootstrapForm, Row, Col, Alert } from 'react-bootstrap';
import { InFacilityBookingForm, FacilityBooking, InBookingCalculation } from '@/models/FacilityBooking';
import { Facility } from '@/models/Facility';
import { User } from '@/models/User';
import Select2Component from '@/pages/_components/Select2';

interface FormProps {
    title: string;
    data: InFacilityBookingForm;
    onHide: () => void;
    onSave: (data: InFacilityBookingForm) => void;
    validationError?: { field: string; message: string }[];
}

const FacilityBookingForm: React.FC<FormProps> = ({ title, data, onHide, onSave, validationError = [] }) => {
    const [formData, setFormData] = useState<InFacilityBookingForm>(data);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [calculation, setCalculation] = useState<InBookingCalculation | null>(null);
    const [availability, setAvailability] = useState<{ available: boolean; message?: string } | null>(null);
    const [isCalculating, setIsCalculating] = useState(false);
    const FacilityModel = new Facility();
    const UserModel = new User();
    const BookingModel = new FacilityBooking();

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

    const checkAvailabilityAndCalculate = async () => {
        if (!formData.facility_id || !formData.booking_date || !formData.start_time || !formData.end_time) {
            return;
        }

        setIsCalculating(true);
        try {
            // Check availability
            const availabilityCheck = await BookingModel.checkAvailability(formData);
            setAvailability(availabilityCheck);

            if (availabilityCheck.available) {
                // Calculate price
                const calc = await BookingModel.calculatePrice(formData);
                // @ts-ignore
                setFormData(prev => ({ ...prev,
                    total_hours: calc.total_hours,
                    total_price: calc.total_price
                }));
                setCalculation(calc);
            } else {
                setCalculation(null);
            }
        } catch (error) {
            setAvailability({ available: false, message: error.message });
        } finally {
            setIsCalculating(false);
        }
    };

    useEffect(() => {
        if (formData.facility_id && formData.booking_date && formData.start_time && formData.end_time) {
            checkAvailabilityAndCalculate();
        }
    }, [formData.facility_id, formData.booking_date, formData.start_time, formData.end_time]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (availability?.available) {
            onSave(formData);
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(amount);
    };

    return (
        <div className="modal fade show d-block"   id="modal-facility-booking" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-xl modal-dialog-scrollable">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">
                            <i className="bx bx-calendar-check me-2"></i>
                            {title}
                        </h5>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="modal-body">
                            <Row className="g-3">
                                <Col md={6}>
                                    <BootstrapForm.Group>
                                        <BootstrapForm.Label>Facility *</BootstrapForm.Label>
                                        <Select2Component
                                            fetchData={(query) => FacilityModel.list({ ...query, filter: 'is_available=1' })}
                                            dropdownParent="#modal-facility-booking"
                                            placeholder="Select Facility"
                                            name="facility_id"
                                            onChange={handleInputChange}
                                            validation={errors.facility_id}
                                            selectedId={formData.facility_id}
                                            dataKey="facilities"
                                            showKey="name"
                                            id="id"
                                        />
                                    </BootstrapForm.Group>
                                </Col>

                                <Col md={6}>
                                    <BootstrapForm.Group>
                                        <BootstrapForm.Label>User *</BootstrapForm.Label>
                                        <Select2Component
                                            fetchData={UserModel.list}
                                            dropdownParent="#modal-facility-booking"
                                            placeholder="Select User"
                                            name="user_id"
                                            onChange={handleInputChange}
                                            validation={errors.user_id}
                                            selectedId={formData.user_id}
                                            dataKey="users"
                                            showKey="name"
                                            id="id"
                                        />
                                    </BootstrapForm.Group>
                                </Col>

                                <Col md={12}>
                                    <BootstrapForm.Group>
                                        <BootstrapForm.Label>Booking Date *</BootstrapForm.Label>
                                        <BootstrapForm.Control
                                            type="date"
                                            name="booking_date"
                                            value={formData.booking_date}
                                            onChange={handleInputChange}
                                            isInvalid={!!errors.booking_date}
                                            min={new Date().toISOString().split('T')[0]}
                                            required
                                        />
                                        {errors.booking_date && (
                                            <BootstrapForm.Control.Feedback type="invalid">
                                                {errors.booking_date}
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
                                        <BootstrapForm.Label>Notes</BootstrapForm.Label>
                                        <BootstrapForm.Control
                                            as="textarea"
                                            rows={2}
                                            name="notes"
                                            value={formData.notes}
                                            onChange={handleInputChange}
                                        />
                                    </BootstrapForm.Group>
                                </Col>

                                {/* AVAILABILITY STATUS */}
                                {availability && (
                                    <Col md={12}>
                                        <Alert variant={availability.available ? 'success' : 'danger'}>
                                            <i className={`bx ${availability.available ? 'bx-check-circle' : 'bx-x-circle'} me-2`}></i>
                                            {availability.available ? 'Facility is available' : availability.message}
                                        </Alert>
                                    </Col>
                                )}

                                {/* PRICE CALCULATION */}
                                {calculation && availability?.available && (
                                    <Col md={12}>
                                        <div className="card bg-light">
                                            <div className="card-body">
                                                <h6 className="fw-bold mb-3">Booking Summary</h6>
                                                <table className="table table-sm mb-2">
                                                    <tbody>
                                                        {calculation.breakdown.map((item, idx) => (
                                                            <tr key={idx}>
                                                                <td>{item.day_type}</td>
                                                                <td className="text-end">
                                                                    {item.hours} hours × {formatCurrency(item.price_per_hour)}
                                                                </td>
                                                                <td className="text-end fw-semibold">
                                                                    {formatCurrency(item.subtotal)}
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                    <tfoot className="table-light">
                                                        <tr>
                                                            <td colSpan={2} className="fw-bold">Total</td>
                                                            <td className="text-end fw-bold text-success fs-5">
                                                                {formatCurrency(calculation.total_price)}
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td colSpan={3} className="text-muted">
                                                                <small>Duration: {calculation.total_hours} hours</small>
                                                            </td>
                                                        </tr>
                                                    </tfoot>
                                                </table>
                                            </div>
                                        </div>
                                    </Col>
                                )}
                            </Row>
                        </div>
                        <div className="modal-footer">
                            <Button variant="secondary" onClick={onHide}>
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                variant="primary"
                                disabled={!availability?.available || isCalculating}
                            >
                                <i className="bx bx-save me-1"></i>
                                Confirm Booking
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default FacilityBookingForm;
