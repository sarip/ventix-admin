import React, { useState } from 'react';
import { Row, Col, Card, Form, Button } from 'react-bootstrap';
import Link from 'next/link';

const CreateEventPage: React.FC = () => {
    const [eventName, setEventName] = useState('Summer Music Festival 2026');
    const [category, setCategory] = useState('Music Festival');
    const [eventType, setEventType] = useState('Offline Event');
    const [startDate, setStartDate] = useState('20 Dec 2026');
    const [startTime, setStartTime] = useState('10:00 AM');
    const [endDate, setEndDate] = useState('20 Dec 2026');
    const [endTime, setEndTime] = useState('10:00 PM');
    const [location, setLocation] = useState('ICE BSD City, Tangerang, Banten');
    const [organizer, setOrganizer] = useState('Veentix Organizer');
    const [shortDesc, setShortDesc] = useState('Festival musik tahunan terbesar dengan line-up artis nasional dan internasional paling seru!');
    const [fullDesc, setFullDesc] = useState('Bersiaplah untuk pengalaman musik yang tak terlupakan di Summer Music Festival 2026! Nikmati penampilan spesial dari artis-artis favorit Anda dalam satu panggung spektakuler.');
    const [previewDevice, setPreviewDevice] = useState<'mobile' | 'desktop'>('mobile');

    return (
        <div className="py-3 px-1">
            {/* Header Title & Stepper */}
            <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 mb-4">
                <div>
                    <h4 className="fw-extrabold text-dark mb-1" style={{ fontSize: '1.45rem' }}>Create Event</h4>
                    <p className="text-muted small mb-0">Buat event baru dan kelola setiap detailnya dengan mudah.</p>
                </div>
                {/* Stepper Nav */}
                <div className="stepper-nav bg-white p-2 rounded-pill border shadow-sm px-3">
                    <div className="stepper-item active">
                        <span className="stepper-number">1</span>
                        <span>Basic Information</span>
                    </div>
                    <i className="bx bx-chevron-right text-muted"></i>
                    <div className="stepper-item">
                        <span className="stepper-number">2</span>
                        <span>Venue & Location</span>
                    </div>
                    <i className="bx bx-chevron-right text-muted"></i>
                    <div className="stepper-item">
                        <span className="stepper-number">3</span>
                        <span>Tickets & Pricing</span>
                    </div>
                    <i className="bx bx-chevron-right text-muted"></i>
                    <div className="stepper-item">
                        <span className="stepper-number">4</span>
                        <span>Publish & Preview</span>
                    </div>
                </div>
            </div>

            <Row className="g-4">
                {/* Left Column: Form Section */}
                <Col xl={7} lg={6}>
                    <Card className="border-0 shadow-sm rounded-4 p-4 bg-white mb-4">
                        <div className="d-flex align-items-center justify-content-between mb-3 border-bottom pb-3">
                            <div>
                                <h6 className="fw-bold text-dark mb-1" style={{ fontSize: '1.05rem' }}>Basic Information</h6>
                                <p className="text-muted small mb-0">Lengkapi informasi dasar event Anda.</p>
                            </div>
                            <Button variant="outline-primary" size="sm" className="rounded-pill px-3">
                                <i className="bx bx-save me-1"></i> Save as Draft
                            </Button>
                        </div>

                        <Form>
                            {/* Event Name */}
                            <Form.Group className="mb-3">
                                <div className="d-flex justify-content-between align-items-center mb-1">
                                    <Form.Label className="fw-bold small text-dark mb-0">Event Name *</Form.Label>
                                    <span className="text-muted" style={{ fontSize: '0.72rem' }}>{eventName.length}/100</span>
                                </div>
                                <Form.Control
                                    type="text"
                                    value={eventName}
                                    onChange={(e) => setEventName(e.target.value)}
                                    placeholder="Enter event title"
                                />
                            </Form.Group>

                            {/* Category & Event Type */}
                            <Row className="g-3 mb-3">
                                <Col md={6}>
                                    <Form.Label className="fw-bold small text-dark mb-1">Category *</Form.Label>
                                    <Form.Select value={category} onChange={(e) => setCategory(e.target.value)}>
                                        <option>Music Festival</option>
                                        <option>Tech Conference</option>
                                        <option>Art Expo</option>
                                    </Form.Select>
                                </Col>
                                <Col md={6}>
                                    <Form.Label className="fw-bold small text-dark mb-1">Event Type</Form.Label>
                                    <Form.Select value={eventType} onChange={(e) => setEventType(e.target.value)}>
                                        <option>Offline Event</option>
                                        <option>Online Event</option>
                                        <option>Hybrid Event</option>
                                    </Form.Select>
                                </Col>
                            </Row>

                            {/* Date & Time */}
                            <Row className="g-3 mb-3">
                                <Col md={6}>
                                    <Form.Label className="fw-bold small text-dark mb-1">Date & Time *</Form.Label>
                                    <div className="d-flex gap-2">
                                        <Form.Control type="text" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                                        <Form.Control type="text" value={startTime} onChange={(e) => setStartTime(e.target.value)} style={{ width: '110px' }} />
                                    </div>
                                </Col>
                                <Col md={6}>
                                    <Form.Label className="fw-bold small text-dark mb-1">End Date & Time</Form.Label>
                                    <div className="d-flex gap-2">
                                        <Form.Control type="text" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                                        <Form.Control type="text" value={endTime} onChange={(e) => setEndTime(e.target.value)} style={{ width: '110px' }} />
                                    </div>
                                </Col>
                            </Row>

                            {/* Location & Organizer */}
                            <Row className="g-3 mb-3">
                                <Col md={6}>
                                    <Form.Label className="fw-bold small text-dark mb-1">Location *</Form.Label>
                                    <Form.Control type="text" value={location} onChange={(e) => setLocation(e.target.value)} />
                                </Col>
                                <Col md={6}>
                                    <Form.Label className="fw-bold small text-dark mb-1">Organizer Name *</Form.Label>
                                    <Form.Control type="text" value={organizer} onChange={(e) => setOrganizer(e.target.value)} />
                                </Col>
                            </Row>

                            {/* Short Description */}
                            <Form.Group className="mb-3">
                                <div className="d-flex justify-content-between align-items-center mb-1">
                                    <Form.Label className="fw-bold small text-dark mb-0">Short Description *</Form.Label>
                                    <span className="text-muted" style={{ fontSize: '0.72rem' }}>{shortDesc.length}/150</span>
                                </div>
                                <Form.Control
                                    as="textarea"
                                    rows={2}
                                    value={shortDesc}
                                    onChange={(e) => setShortDesc(e.target.value)}
                                />
                            </Form.Group>

                            {/* Full Description */}
                            <Form.Group className="mb-3">
                                <div className="d-flex justify-content-between align-items-center mb-1">
                                    <Form.Label className="fw-bold small text-dark mb-0">Full Description</Form.Label>
                                    <span className="text-muted" style={{ fontSize: '0.72rem' }}>{fullDesc.length}/2000</span>
                                </div>
                                {/* WYSIWYG Mock Toolbar */}
                                <div className="border rounded-top bg-light p-2 d-flex gap-2">
                                    <button type="button" className="btn btn-sm btn-light border p-1" style={{ width: '28px' }}><b>B</b></button>
                                    <button type="button" className="btn btn-sm btn-light border p-1" style={{ width: '28px' }}><i>I</i></button>
                                    <button type="button" className="btn btn-sm btn-light border p-1" style={{ width: '28px' }}><u>U</u></button>
                                    <button type="button" className="btn btn-sm btn-light border p-1"><i className="bx bx-list-ul"></i></button>
                                    <button type="button" className="btn btn-sm btn-light border p-1"><i className="bx bx-link"></i></button>
                                    <button type="button" className="btn btn-sm btn-light border p-1"><i className="bx bx-image"></i></button>
                                </div>
                                <Form.Control
                                    as="textarea"
                                    rows={4}
                                    className="rounded-top-0"
                                    value={fullDesc}
                                    onChange={(e) => setFullDesc(e.target.value)}
                                />
                            </Form.Group>

                            {/* Event Banner / Poster */}
                            <Form.Group className="mb-3">
                                <Form.Label className="fw-bold small text-dark mb-1">Event Banner / Poster *</Form.Label>
                                <div className="border rounded-4 p-3 d-flex align-items-center gap-3 bg-light">
                                    <img src="https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&auto=format&fit=crop&q=80" alt="Banner" className="rounded-3 object-fit-cover" style={{ width: '140px', height: '80px' }} />
                                    <div>
                                        <button type="button" className="btn btn-sm btn-outline-primary rounded-pill mb-1">
                                            <i className="bx bx-image-add me-1"></i> Change Image
                                        </button>
                                        <p className="text-muted mb-0" style={{ fontSize: '0.72rem' }}>JPG, PNG or WebP. Max size 5MB. Recommended 1200x628px</p>
                                    </div>
                                </div>
                            </Form.Group>
                        </Form>
                    </Card>

                    {/* Footer Navigation Action */}
                    <div className="d-flex align-items-center justify-content-between">
                        <Link href="/event" className="btn btn-light border rounded-pill px-4">
                            <i className="bx bx-arrow-back me-1"></i> Back
                        </Link>
                        <Button variant="primary" className="rounded-pill px-4">
                            Next Step <i className="bx bx-right-arrow-alt ms-1"></i>
                        </Button>
                    </div>
                </Col>

                {/* Right Column: Live Preview Mobile Frame */}
                <Col xl={5} lg={6}>
                    <Card className="border-0 shadow-sm rounded-4 p-3 bg-white mb-3">
                        <div className="d-flex align-items-center justify-content-between mb-3 border-bottom pb-2">
                            <div>
                                <h6 className="fw-bold text-dark mb-0" style={{ fontSize: '0.95rem' }}>Live Preview</h6>
                                <span className="text-muted" style={{ fontSize: '0.75rem' }}>Pratinjau tampilan event Anda</span>
                            </div>
                            <div className="d-flex align-items-center gap-1 bg-light p-1 rounded-pill">
                                <button className={`btn btn-sm py-1 px-2 border-0 ${previewDevice === 'desktop' ? 'bg-white shadow-sm text-primary' : 'text-muted'}`} onClick={() => setPreviewDevice('desktop')}>
                                    <i className="bx bx-laptop"></i>
                                </button>
                                <button className={`btn btn-sm py-1 px-2 border-0 ${previewDevice === 'mobile' ? 'bg-white shadow-sm text-primary' : 'text-muted'}`} onClick={() => setPreviewDevice('mobile')}>
                                    <i className="bx bx-mobile-alt"></i>
                                </button>
                            </div>
                        </div>

                        {/* Mobile Preview Device Frame */}
                        <div className="d-flex justify-content-center">
                            <div className="border shadow-lg rounded-4 overflow-hidden bg-black text-white" style={{ width: previewDevice === 'mobile' ? '330px' : '100%', minHeight: '520px' }}>
                                {/* Header Image Poster */}
                                <div className="position-relative" style={{ height: '180px' }}>
                                    <img src="https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500&auto=format&fit=crop&q=80" alt="Event Poster" className="w-100 h-100 object-fit-cover opacity-75" />
                                    <div className="position-absolute top-0 start-0 end-0 p-3 d-flex justify-content-between text-white">
                                        <i className="bx bx-left-arrow-alt fs-4"></i>
                                        <div className="d-flex gap-2">
                                            <i className="bx bx-share-alt fs-5"></i>
                                            <i className="bx bx-heart fs-5"></i>
                                        </div>
                                    </div>
                                    <div className="position-absolute bottom-0 start-0 p-3">
                                        <h5 className="fw-extrabold text-white mb-0" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>{eventName.toUpperCase()}</h5>
                                    </div>
                                </div>

                                {/* Content Details */}
                                <div className="p-3 bg-white text-dark" style={{ minHeight: '340px' }}>
                                    <span className="badge bg-primary-subtle text-primary mb-2" style={{ fontSize: '0.7rem' }}>{category}</span>
                                    <h6 className="fw-bold mb-1" style={{ fontSize: '0.95rem' }}>{eventName}</h6>
                                    <div className="text-muted mb-2" style={{ fontSize: '0.72rem' }}>
                                        <i className="bx bx-calendar me-1"></i>{startDate} ({startTime}) - {endDate} ({endTime})
                                    </div>
                                    <div className="text-muted mb-3" style={{ fontSize: '0.72rem' }}>
                                        <i className="bx bx-map me-1"></i>{location}
                                    </div>

                                    <div className="border-top pt-2 mb-3">
                                        <div className="fw-bold small mb-1">About This Event</div>
                                        <p className="text-muted mb-0" style={{ fontSize: '0.72rem', lineHeight: '1.4' }}>
                                            {shortDesc} <span className="text-primary cursor-pointer">See more</span>
                                        </p>
                                    </div>

                                    {/* Ticket Preview Tiers */}
                                    <div className="d-flex flex-column gap-2 mb-3">
                                        <div className="border rounded-3 p-2 d-flex align-items-center justify-content-between bg-light">
                                            <div>
                                                <div className="fw-bold" style={{ fontSize: '0.78rem' }}>VIP Pass</div>
                                                <div className="text-primary fw-extrabold" style={{ fontSize: '0.8rem' }}>Rp 350.000</div>
                                            </div>
                                            <button className="btn btn-sm btn-primary py-1 px-2" style={{ fontSize: '0.7rem' }}>Buy Ticket</button>
                                        </div>
                                        <div className="border rounded-3 p-2 d-flex align-items-center justify-content-between bg-light">
                                            <div>
                                                <div className="fw-bold" style={{ fontSize: '0.78rem' }}>Regular Pass</div>
                                                <div className="text-primary fw-extrabold" style={{ fontSize: '0.8rem' }}>Rp 175.000</div>
                                            </div>
                                            <button className="btn btn-sm btn-primary py-1 px-2" style={{ fontSize: '0.7rem' }}>Buy Ticket</button>
                                        </div>
                                    </div>

                                    <div className="text-center text-muted" style={{ fontSize: '0.68rem' }}>
                                        More info will be available after the event is published.
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* Tips Card */}
                    <Card className="border-0 shadow-sm rounded-4 p-3 bg-primary-subtle text-primary border-primary">
                        <h6 className="fw-bold mb-2" style={{ fontSize: '0.88rem' }}>Tips</h6>
                        <ul className="list-unstyled mb-0 d-flex flex-column gap-1" style={{ fontSize: '0.78rem' }}>
                            <li className="d-flex align-items-center gap-2"><i className="bx bx-check-circle fs-6 text-primary"></i> Gunakan gambar dengan resolusi tinggi untuk hasil terbaik</li>
                            <li className="d-flex align-items-center gap-2"><i className="bx bx-check-circle fs-6 text-primary"></i> Pastikan informasi tanggal dan lokasi sudah benar</li>
                            <li className="d-flex align-items-center gap-2"><i className="bx bx-check-circle fs-6 text-primary"></i> Anda dapat menyimpan draft dan melanjutkan nanti</li>
                        </ul>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default CreateEventPage;
