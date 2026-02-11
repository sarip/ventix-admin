/**
 * @author Sarip Hidayat <hidayatsarip2210@gmail.com>
 * @copyright Sarip Hidayat 2024  
 * @date 2026-01-14
 */

import React, { useState, useEffect } from 'react';
import { Form as BootstrapForm, Row, Col, Nav, Tab } from 'react-bootstrap';
import $ from "jquery";
import 'select2/dist/js/select2.min.js';
import 'select2/dist/css/select2.min.css';
import { InEventTicketForm } from '@/models/EventTicket';
import { Event } from '@/models/Event';
import Select2Component from '@/pages/_components/Select2';
import SingleDateTimePicker from '@/pages/_components/SingleDateTimePicker';
import { InMasterTaxe, MasterTaxe } from "@/models/MasterTaxe";
import EventSponsorsStep from "../event/_sponsors";

interface FormProps {
    title: string;
    data: InEventTicketForm;
    onSave: (data: any) => void;
    validationError?: { field: string; message: string }[];
}

const Form: React.FC<FormProps> = ({ title, data, onSave, validationError = [] }) => {
    const [formData, setFormData] = useState<InEventTicketForm>(data);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [taxes, setTaxes] = useState<InMasterTaxe[]>([]);
    const [sponsors, setSponsors] = useState<any[]>([]);
    const [activeTab, setActiveTab] = useState<string>('ticket-info');
    const EventModel = new Event();

    useEffect(() => {
        setFormData(data);
        setSponsors(data.events_sponsors || []);
        setActiveTab('ticket-info');
    }, [data]);

    useEffect(() => {
        const errorMap = validationError.reduce((acc: { [key: string]: string }, error) => {
            acc[error.field] = error.message;
            return acc;
        }, {});
        setErrors(errorMap);
    }, [validationError]);

    const handleInputChange = (e: React.ChangeEvent<any>) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value,
        }));


    };

    const save = () => {
        const fd = new FormData();
        Object.entries(formData).forEach(([k, v]) => {
            if (v !== null && v !== undefined) {
                fd.append(k, v as any);
            }
        });

        // Add sponsors files and info
        sponsors.forEach((sponsor, index) => {
            if (sponsor.file) {
                fd.append(`sponsor_logos[${index}]`, sponsor.file);
            }
        });
        fd.append('sponsors_info', JSON.stringify(sponsors.map(s => ({
            id: s.id,
            _isDeleted: s._isDeleted,
            _isNew: s._isNew
        }))));

        onSave(fd);
    };

    const onClose = () => {
        jQuery("#modal-eventTicket").modal('hide');
    };

    const calculateFinalPrice = (price: number, taxId?: number) => {
        if (!taxId) return price;
        const tax = taxes.find(t => t.id === Number(taxId));
        if (!tax) return price;
        return price + price * (tax.rate / 100);
    };


    const TaxesModel = new MasterTaxe();
    const loadtaxes = () => {
        TaxesModel.list({ per_page: `1000000000000` }).then(response => {
            setTaxes(response.master_taxes);
        })
    }

    useEffect(() => {
        loadtaxes();
    }, []);

    useEffect(() => {
        let finalPrice = Number(formData.price) || 0;

        if (formData.is_taxable === 'Y' && formData.tax_id) {
            finalPrice = calculateFinalPrice(
                Number(formData.price),
                Number(formData.tax_id)
            );
        }

        setFormData(prev => ({
            ...prev,
            final_price: Math.round(Number(finalPrice)),
        }));
    }, [
        formData.price,
        formData.is_taxable,
        formData.tax_id,
        taxes
    ]);

    useEffect(() => {
        if (formData.is_taxable === 'N') {
            setFormData(prev => ({
                ...prev,
                tax_id: "",
                final_price: prev.price,
            }));
        }
    }, [formData.is_taxable]);

    return (
        <div className="modal fade" id="modal-eventTicket" aria-hidden="true" data-bs-backdrop="static" data-bs-keyboard="false">
            <div className="modal-dialog modal-lg" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">{title}</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={onClose}></button>
                    </div>
                    <div className="modal-body">
                        <Tab.Container activeKey={activeTab} onSelect={(k) => setActiveTab(k as string)}>
                            <Nav variant="tabs" className="mb-3">
                                <Nav.Item>
                                    <Nav.Link eventKey="ticket-info">
                                        <i className="bx bx-info-circle me-1"></i>
                                        Ticket Info
                                    </Nav.Link>
                                </Nav.Item>
                                <Nav.Item>
                                    <Nav.Link eventKey="ticket-sponsors">
                                        <i className="bx bx-image me-1"></i>
                                        Event Sponsors
                                    </Nav.Link>
                                </Nav.Item>
                            </Nav>

                            <Tab.Content>
                                <Tab.Pane eventKey="ticket-info">
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

                                        <Col md={12}>
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

                                        <Col md={3}>
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

                                        <Col md={2}>
                                            <BootstrapForm.Group>
                                                <BootstrapForm.Label>Is Taxable ? *</BootstrapForm.Label>
                                                <BootstrapForm.Select
                                                    value={formData.is_taxable}
                                                    name="is_taxable"
                                                    onChange={handleInputChange}
                                                >
                                                    <option value="N">No</option>
                                                    <option value="Y">Yes</option>
                                                </BootstrapForm.Select>
                                            </BootstrapForm.Group>
                                        </Col>
                                        {formData.is_taxable === 'Y' && (
                                            <Col md={3}>
                                                <BootstrapForm.Group>
                                                    <BootstrapForm.Label>Tax *</BootstrapForm.Label>
                                                    <BootstrapForm.Select
                                                        value={formData.tax_id || ''}
                                                        name="tax_id"
                                                        onChange={handleInputChange}

                                                    >
                                                        <option value="">-- Select Tax --</option>
                                                        {taxes.map(tax => (
                                                            <option key={tax.id} value={tax.id}>
                                                                {tax.name} ({tax.rate}%)
                                                            </option>
                                                        ))}
                                                    </BootstrapForm.Select>
                                                </BootstrapForm.Group>
                                            </Col>
                                        )}


                                        <Col md={4}>
                                            <BootstrapForm.Group>
                                                <BootstrapForm.Label>Final Price (IDR) *</BootstrapForm.Label>
                                                <BootstrapForm.Control
                                                    type="number"
                                                    readOnly={true}
                                                    disabled={true}
                                                    value={formData.final_price}
                                                />
                                            </BootstrapForm.Group>
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
                                </Tab.Pane>

                                <Tab.Pane eventKey="ticket-sponsors">
                                    <EventSponsorsStep
                                        eventId={formData.event_id}
                                        logos={sponsors}
                                        onChange={setSponsors}
                                    />
                                </Tab.Pane>
                            </Tab.Content>
                        </Tab.Container>
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
