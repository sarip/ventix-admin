import React from 'react';
import { Row, Col, Card, Form as BootstrapForm } from 'react-bootstrap';
import $ from 'jquery';
import 'select2/dist/js/select2.min.js';
import 'select2/dist/css/select2.min.css';
import Select2Component from '@/pages/_components/Select2';
import SingleDatePicker from '@/pages/_components/SingleDatePicker';
import OptionEventStatus from '@/pages/_components/OptionEventStatus';
import { InEventForm } from '@/models/Event';
import { EventOrganizer } from '@/models/EventOrganizer';
import { User } from '@/models/User';
import { EventCat } from '@/models/EventCat';
import { RegProvince } from '@/models/RegProvince';

interface EventInfoStepProps {
    formData: InEventForm;
    errors: { [key: string]: string };
    onFieldChange: (e: React.ChangeEvent<any>, selectedItem?: any) => void;
    onDateChange: (name: string, value: string) => void;
    onThumbnailChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const EventInfoStep: React.FC<EventInfoStepProps> = ({
    formData,
    errors,
    onFieldChange,
    onDateChange,
    onThumbnailChange,
}) => {
    const EventOrganizerModel = new EventOrganizer();
    const UserModel = new User();
    const EventCatModel = new EventCat();
    const RegProvinceModel = new RegProvince();

    return (
        <Row className="g-4">
            <Col xl={8} lg={7}>
                <Card className="border-0 shadow-sm rounded-4 p-4 bg-white mb-4">
                    <div className="mb-4 border-bottom pb-3">
                        <h6 className="fw-bold text-dark mb-1" style={{ fontSize: '1.1rem' }}>Event Information</h6>
                        <p className="text-muted small mb-0">Let's start with the basic information about your event.</p>
                    </div>

                    <BootstrapForm>
                        <h6 className="fw-bold text-primary mb-3" style={{ fontSize: '0.9rem' }}>Basic Details</h6>

                        <Row className="g-3 mb-3">
                            <Col md={6}>
                                <BootstrapForm.Label className="fw-semibold small text-dark">EO / Organizer *</BootstrapForm.Label>
                                <Select2Component
                                    fetchData={EventOrganizerModel.list}
                                    placeholder="Pilih EO"
                                    name="events_organizer_id"
                                    onChange={onFieldChange}
                                    validation={errors.events_organizer_id}
                                    selectedId={formData.events_organizer_id as number}
                                    dataKey="events_organizer"
                                    showKey="eo_name"
                                    filterKey=""
                                />
                                {!!errors.events_organizer_id && (
                                    <div className="invalid-feedback d-block">{errors.events_organizer_id}</div>
                                )}
                            </Col>
                            <Col md={6}>
                                <BootstrapForm.Label className="fw-semibold small text-dark">PIC (Person in Charge) *</BootstrapForm.Label>
                                <Select2Component
                                    fetchData={UserModel.lists}
                                    placeholder="Pilih PIC"
                                    name="user_id_pic"
                                    onChange={onFieldChange}
                                    validation={errors.user_id_pic}
                                    selectedId={formData.user_id_pic as number}
                                    dataKey="users"
                                    showKey="name"
                                    filterKey={`eo_id:${formData.events_organizer_id}`}
                                    id="id"
                                />
                                {!!errors.user_id_pic && (
                                    <div className="invalid-feedback d-block">{errors.user_id_pic}</div>
                                )}
                            </Col>
                        </Row>

                        <Row className="g-3 mb-3">
                            <Col md={6}>
                                <BootstrapForm.Label className="fw-semibold small text-dark">Category *</BootstrapForm.Label>
                                <Select2Component
                                    fetchData={EventCatModel.list}
                                    placeholder="Pilih Kategori"
                                    name="event_category"
                                    onChange={onFieldChange}
                                    validation={errors.event_category}
                                    selectedId={formData.event_category}
                                    dataKey="events_cat"
                                    showKey="name"
                                    id="name"
                                />
                                {!!errors.event_category && (
                                    <div className="invalid-feedback d-block">{errors.event_category}</div>
                                )}
                            </Col>
                            <Col md={6}>
                                <BootstrapForm.Label className="fw-semibold small text-dark">Event Status</BootstrapForm.Label>
                                <BootstrapForm.Select
                                    name="events_status"
                                    value={formData.events_status}
                                    onChange={onFieldChange}
                                    className={`py-2 ${errors.events_status ? 'is-invalid' : ''}`}
                                >
                                    <option value="">-- Select --</option>
                                    <OptionEventStatus />
                                </BootstrapForm.Select>
                                {!!errors.events_status && (
                                    <div className="invalid-feedback">{errors.events_status}</div>
                                )}
                            </Col>
                        </Row>

                        <BootstrapForm.Group className="mb-3">
                            <BootstrapForm.Label className="fw-semibold small text-dark">Event Title *</BootstrapForm.Label>
                            <BootstrapForm.Control
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={onFieldChange}
                                placeholder="Enter event title"
                                className={`py-2 ${errors.title ? 'is-invalid' : ''}`}
                            />
                            {!!errors.title && <div className="invalid-feedback">{errors.title}</div>}
                        </BootstrapForm.Group>

                        <BootstrapForm.Group className="mb-4">
                            <BootstrapForm.Label className="fw-semibold small text-dark">Description *</BootstrapForm.Label>
                            <BootstrapForm.Control
                                as="textarea"
                                rows={3}
                                name="description"
                                value={formData.description}
                                onChange={onFieldChange}
                                placeholder="Describe your event"
                                className={errors.description ? 'is-invalid' : ''}
                            />
                            {!!errors.description && <div className="invalid-feedback">{errors.description}</div>}
                        </BootstrapForm.Group>

                        <Row className="g-3 mb-4">
                            <Col md={6}>
                                <SingleDatePicker
                                    name="start_date"
                                    label="Start Date *"
                                    value={formData.start_date}
                                    onChange={onDateChange}
                                    error={errors.start_date}
                                />
                            </Col>
                            <Col md={6}>
                                <SingleDatePicker
                                    name="end_date"
                                    label="End Date *"
                                    value={formData.end_date}
                                    onChange={onDateChange}
                                    error={errors.end_date}
                                />
                            </Col>
                        </Row>

                        <hr className="my-4" />

                        <h6 className="fw-bold text-primary mb-3" style={{ fontSize: '0.9rem' }}>Location</h6>
                        <Row className="g-3 mb-3">
                            <Col md={6}>
                                <BootstrapForm.Label className="fw-semibold small text-dark">Province *</BootstrapForm.Label>
                                <Select2Component
                                    fetchData={RegProvinceModel.list}
                                    placeholder="Pilih Provinsi"
                                    name="location"
                                    onChange={onFieldChange}
                                    validation={errors.location}
                                    selectedId={formData.location}
                                    dataKey="reg_provinces"
                                    showKey="name"
                                    id="name"
                                />
                                {!!errors.location && (
                                    <div className="invalid-feedback d-block">{errors.location}</div>
                                )}
                            </Col>
                            <Col md={6}>
                                <BootstrapForm.Label className="fw-semibold small text-dark">Location Name / Venue *</BootstrapForm.Label>
                                <BootstrapForm.Control
                                    as="textarea"
                                    rows={1}
                                    name="location_name"
                                    value={formData.location_name}
                                    onChange={onFieldChange}
                                    placeholder="Enter venue / full address"
                                    className={errors.location_name ? 'is-invalid' : ''}
                                />
                                {!!errors.location_name && (
                                    <div className="invalid-feedback">{errors.location_name}</div>
                                )}
                            </Col>
                        </Row>

                        <Row className="g-3 mb-4">
                            <Col md={6}>
                                <BootstrapForm.Label className="fw-semibold small text-dark">Latitude (Optional)</BootstrapForm.Label>
                                <BootstrapForm.Control
                                    type="text"
                                    name="latitude"
                                    value={formData.latitude}
                                    onChange={onFieldChange}
                                    className="py-2"
                                />
                            </Col>
                            <Col md={6}>
                                <BootstrapForm.Label className="fw-semibold small text-dark">Longitude (Optional)</BootstrapForm.Label>
                                <BootstrapForm.Control
                                    type="text"
                                    name="longitude"
                                    value={formData.longitude}
                                    onChange={onFieldChange}
                                    className="py-2"
                                />
                            </Col>
                        </Row>

                        <hr className="my-4" />

                        <h6 className="fw-bold text-primary mb-3" style={{ fontSize: '0.9rem' }}>Additional Details</h6>
                        <Row className="g-3 mb-3">
                            <Col md={6}>
                                <BootstrapForm.Label className="fw-semibold small text-dark">Price Pool (Optional)</BootstrapForm.Label>
                                <BootstrapForm.Control
                                    type="number"
                                    name="price_pool"
                                    value={formData.price_pool}
                                    onChange={onFieldChange}
                                    placeholder="0"
                                    className="py-2"
                                />
                            </Col>
                            <Col md={6}>
                                <BootstrapForm.Label className="fw-semibold small text-dark">Registration Fee (Optional)</BootstrapForm.Label>
                                <BootstrapForm.Control
                                    type="number"
                                    name="registration_fee"
                                    value={formData.registration_fee}
                                    onChange={onFieldChange}
                                    placeholder="0"
                                    className="py-2"
                                />
                            </Col>
                        </Row>

                        <BootstrapForm.Group>
                            <BootstrapForm.Label className="fw-semibold small text-dark">Thumbnail (Optional)</BootstrapForm.Label>
                            <BootstrapForm.Control
                                type="file"
                                name="thumbnail_url"
                                accept="image/*"
                                onChange={onThumbnailChange}
                                className={errors.thumbnail_url ? 'is-invalid' : ''}
                            />
                            {typeof formData.thumbnail_url === 'string' && formData.thumbnail_url && (
                                <small className="text-muted d-block mt-1">Current thumbnail: {formData.thumbnail_url}</small>
                            )}
                            {!!errors.thumbnail_url && <div className="invalid-feedback">{errors.thumbnail_url}</div>}
                        </BootstrapForm.Group>
                    </BootstrapForm>
                </Card>
            </Col>

            <Col xl={4} lg={5}>
                <Card className="border-0 shadow-sm rounded-4 p-3 bg-white mb-4">
                    <div className="d-flex align-items-center gap-2 mb-3 pb-2 border-bottom">
                        <i className="bx bx-show fs-5 text-primary"></i>
                        <h6 className="fw-bold text-dark mb-0" style={{ fontSize: '0.95rem' }}>Event Preview</h6>
                    </div>
                    <div className="d-flex flex-column gap-2 text-muted" style={{ fontSize: '0.82rem' }}>
                        <div className="d-flex align-items-center gap-2 py-1 border-bottom">
                            <i className="bx bx-heading text-primary fs-5"></i>
                            <div><span className="text-muted">Title:</span> <strong className="text-dark ms-1">{formData.title || '-'}</strong></div>
                        </div>
                        <div className="d-flex align-items-center gap-2 py-1 border-bottom">
                            <i className="bx bx-calendar text-primary fs-5"></i>
                            <div><span className="text-muted">Start Date:</span> <strong className="text-dark ms-1">{formData.start_date || '-'}</strong></div>
                        </div>
                        <div className="d-flex align-items-center gap-2 py-1 border-bottom">
                            <i className="bx bx-map text-primary fs-5"></i>
                            <div><span className="text-muted">Location:</span> <strong className="text-dark ms-1">{formData.location_name || '-'}</strong></div>
                        </div>
                        <div className="d-flex align-items-center gap-2 py-1">
                            <i className="bx bx-tag text-primary fs-5"></i>
                            <div><span className="text-muted">Category:</span> <strong className="text-dark ms-1">{formData.event_category || '-'}</strong></div>
                        </div>
                    </div>
                </Card>

                <Card className="border-0 shadow-sm rounded-4 p-3 bg-primary-subtle text-primary border-primary">
                    <div className="d-flex align-items-center gap-2 mb-2">
                        <i className="bx bx-bulb fs-5"></i>
                        <h6 className="fw-bold mb-0" style={{ fontSize: '0.9rem' }}>Tips for a great event</h6>
                    </div>
                    <ul className="list-unstyled mb-0 d-flex flex-column gap-1.5" style={{ fontSize: '0.78rem' }}>
                        <li className="d-flex align-items-center gap-2"><i className="bx bx-check-circle text-primary fs-6"></i> Use a clear and engaging title</li>
                        <li className="d-flex align-items-center gap-2"><i className="bx bx-check-circle text-primary fs-6"></i> Choose the right category</li>
                        <li className="d-flex align-items-center gap-2"><i className="bx bx-check-circle text-primary fs-6"></i> Add a compelling description</li>
                        <li className="d-flex align-items-center gap-2"><i className="bx bx-check-circle text-primary fs-6"></i> Upload an attractive thumbnail</li>
                    </ul>
                </Card>
            </Col>
        </Row>
    );
};

export default EventInfoStep;
