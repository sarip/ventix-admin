/**
 * Facility Pricing Form Modal
 */

import React, { useState, useEffect } from 'react';
import { Modal, Button, Form as BootstrapForm, Row, Col } from 'react-bootstrap';
import { InFacilityPricingForm } from '@/models/FacilityPricing';
import { TicketOrder } from '@/models/TicketOrder';

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
    const [commissions, setCommissions] = useState<any[]>([]);
    const [loadingCommission, setLoadingCommission] = useState<boolean>(false);

    const TicketOrderModel = new TicketOrder();

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

    useEffect(() => {
        const price = parseFloat(formData.price_per_hour?.toString() || '0');
        if (price > 0) {
            setLoadingCommission(true);
            TicketOrderModel.previewCommission({ module: 'facility', base_amount: price })
                .then((res: any) => {
                    setCommissions(res.calculations || []);
                })
                .catch(err => console.error('Failed to fetch commission:', err))
                .finally(() => setLoadingCommission(false));
        } else {
            setCommissions([]);
        }
    }, [formData.price_per_hour]);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(amount);
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

                                {/* Commission Preview */}
                                <div className="mt-2 p-2 bg-light rounded border border-info" style={{ fontSize: '0.85rem' }}>
                                    <div className="fw-bold mb-1 text-info">
                                        <i className="bx bx-calculator me-1"></i>
                                        Fee Breakdown
                                    </div>
                                    {loadingCommission ? (
                                        <div className="text-muted italic small">Computing fees...</div>
                                    ) : commissions.length > 0 ? (
                                        <div className="d-flex flex-column gap-1">
                                            {commissions.map((c: any, i: number) => (
                                                <div key={i} className="d-flex justify-content-between">
                                                    <span className="text-capitalize">{c.rule_key.replace(/_/g, ' ')}:</span>
                                                    <span className="fw-semibold text-success">{formatCurrency(c.calculated_amount)}</span>
                                                </div>
                                            ))}
                                            <div className="border-top pt-1 mt-1 d-flex justify-content-between fw-bold text-primary">
                                                <span>Total Price for Guest:</span>
                                                <span>
                                                    {formatCurrency(
                                                        parseFloat(formData.price_per_hour?.toString() || '0') +
                                                        commissions.reduce((sum: number, c: any) =>
                                                            sum + (c.rule_key === 'guest_fee' ? parseFloat(c.calculated_amount) : 0), 0
                                                        )
                                                    )}
                                                </span>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="text-muted small">Enter price to see estimated fees.</div>
                                    )}
                                </div>
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
