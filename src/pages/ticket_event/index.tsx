/**
 * EO Check-in Management Page - PDF Page 6 High Fidelity Implementation
 */

import React, { useState } from 'react';
import { Card, Row, Col, Table, Form, Button } from 'react-bootstrap';

const TicketEventPage: React.FC = () => {
    const [selectedEvent, setSelectedEvent] = useState('Summer Music Festival 2026');
    const [activeTab, setActiveTab] = useState<'all' | 'checkedin' | 'notcheckedin' | 'vip' | 'exempted'>('all');
    const [scanMode, setScanMode] = useState<'qr' | 'code'>('qr');
    const [isScanning, setIsScanning] = useState(false);

    const attendeeList = [
        {
            id: "#VTX-001248",
            name: "Dinda Kharisma",
            email: "dinda.k@email.com",
            type: "VIP Pass",
            checkin_time: "20 May 2026 14:32:21",
            status: "Checked-in"
        },
        {
            id: "#VTX-001247",
            name: "Rizky Pratama",
            email: "rizky.p@email.com",
            type: "Regular Pass",
            checkin_time: "20 May 2026 14:31:55",
            status: "Checked-in"
        },
        {
            id: "#VTX-001246",
            name: "Sarah Wijaya",
            email: "sarah.w@email.com",
            type: "Early Bird",
            checkin_time: "20 May 2026 14:31:20",
            status: "Checked-in"
        },
        {
            id: "#VTX-001245",
            name: "Maya Febriani",
            email: "maya.f@email.com",
            type: "VIP Pass",
            checkin_time: "-",
            status: "Not Checked-in"
        },
        {
            id: "#VTX-001244",
            name: "Andi Setiawan",
            email: "andi.s@email.com",
            type: "Regular Pass",
            checkin_time: "-",
            status: "Not Checked-in"
        },
        {
            id: "#VTX-001243",
            name: "Fajar Ramadhan",
            email: "fajar.r@email.com",
            type: "Early Bird",
            checkin_time: "-",
            status: "Not Checked-in"
        }
    ];

    const recentCheckins = [
        { name: "Dinda Kharisma", type: "VIP Pass • #VTX-001248", time: "14:32:21" },
        { name: "Rizky Pratama", type: "Regular Pass • #VTX-001247", time: "14:31:55" },
        { name: "Sarah Wijaya", type: "Early Bird • #VTX-001246", time: "14:31:20" },
        { name: "M. Firdaus", type: "Regular Pass • #VTX-001241", time: "14:30:10" },
        { name: "Nadia Putri", type: "VIP Pass • #VTX-001239", time: "14:29:45" }
    ];

    return (
        <div className="py-3 px-1">
            {/* HEADER */}
            <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 mb-3">
                <div>
                    <h4 className="fw-extrabold text-dark mb-1" style={{ fontSize: '1.45rem' }}>Check-in</h4>
                    <p className="text-muted small mb-0">Kelola proses check-in secara real-time dan pantau kehadiran event.</p>
                </div>
            </div>

            {/* 5 METRIC CARDS */}
            <Row className="g-3 mb-4">
                <Col xl={2.4} lg={4} md={6}>
                    <Card className="border-0 shadow-sm rounded-4 p-2 bg-white">
                        <Card.Body className="p-2">
                            <span className="text-muted small fw-semibold uppercase" style={{ fontSize: '0.72rem' }}>Total Tickets Sold</span>
                            <h4 className="fw-extrabold text-dark mt-1 mb-0" style={{ fontSize: '1.4rem' }}>2.450</h4>
                            <span className="text-primary small" style={{ fontSize: '0.72rem' }}>View details →</span>
                        </Card.Body>
                    </Card>
                </Col>

                <Col xl={2.4} lg={4} md={6}>
                    <Card className="border-0 shadow-sm rounded-4 p-2 bg-white">
                        <Card.Body className="p-2">
                            <span className="text-muted small fw-semibold uppercase" style={{ fontSize: '0.72rem' }}>Checked-in</span>
                            <h4 className="fw-extrabold text-dark mt-1 mb-0" style={{ fontSize: '1.4rem' }}>1.642</h4>
                            <span className="badge bg-success-subtle text-success p-1" style={{ fontSize: '0.68rem' }}>66.9% dari total sold</span>
                        </Card.Body>
                    </Card>
                </Col>

                <Col xl={2.4} lg={4} md={6}>
                    <Card className="border-0 shadow-sm rounded-4 p-2 bg-white">
                        <Card.Body className="p-2">
                            <span className="text-muted small fw-semibold uppercase" style={{ fontSize: '0.72rem' }}>Not Checked-in</span>
                            <h4 className="fw-extrabold text-dark mt-1 mb-0" style={{ fontSize: '1.4rem' }}>808</h4>
                            <span className="badge bg-warning-subtle text-warning p-1" style={{ fontSize: '0.68rem' }}>33.1% dari total sold</span>
                        </Card.Body>
                    </Card>
                </Col>

                <Col xl={2.4} lg={4} md={6}>
                    <Card className="border-0 shadow-sm rounded-4 p-2 bg-white">
                        <Card.Body className="p-2">
                            <span className="text-muted small fw-semibold uppercase" style={{ fontSize: '0.72rem' }}>Check-in Today</span>
                            <h4 className="fw-extrabold text-dark mt-1 mb-0" style={{ fontSize: '1.4rem' }}>367</h4>
                            <span className="text-muted small" style={{ fontSize: '0.72rem' }}>Today</span>
                        </Card.Body>
                    </Card>
                </Col>

                <Col xl={2.4} lg={4} md={6}>
                    <Card className="border-0 shadow-sm rounded-4 p-2 bg-white">
                        <Card.Body className="p-2">
                            <span className="text-muted small fw-semibold uppercase" style={{ fontSize: '0.72rem' }}>Total Visitors</span>
                            <h4 className="fw-extrabold text-dark mt-1 mb-0" style={{ fontSize: '1.4rem' }}>1.642</h4>
                            <span className="text-muted small" style={{ fontSize: '0.72rem' }}>Live update</span>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* EVENT SELECTOR BAR */}
            <Card className="border-0 shadow-sm rounded-4 p-3 bg-white mb-4">
                <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
                    <div className="d-flex align-items-center gap-3">
                        <img src="https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=100&auto=format&fit=crop&q=80" alt="Event" className="rounded-3 object-fit-cover" style={{ width: '42px', height: '42px' }} />
                        <div>
                            <Form.Select className="fw-bold border-0 bg-light py-1 px-3 shadow-none" value={selectedEvent} onChange={(e) => setSelectedEvent(e.target.value)} style={{ fontSize: '0.95rem' }}>
                                <option>Summer Music Festival 2026</option>
                                <option>Tech Summit Indonesia</option>
                                <option>Art & Culture Expo</option>
                            </Form.Select>
                            <span className="text-muted small ms-2" style={{ fontSize: '0.72rem' }}>20 Dec 2026 • ICE BSD City</span>
                        </div>
                    </div>
                    <div className="d-flex align-items-center gap-2">
                        <Button variant="light" size="sm" className="border text-muted rounded-pill px-3"><i className="bx bx-user-check me-1"></i> Manual Check-in</Button>
                        <Button variant="light" size="sm" className="border text-muted rounded-pill px-3"><i className="bx bx-import me-1"></i> Import Attendee</Button>
                        <Button variant="light" size="sm" className="border text-muted rounded-pill px-3">More Actions <i className="bx bx-chevron-down ms-1"></i></Button>
                    </div>
                </div>
            </Card>

            <Row className="g-4">
                {/* Left Side: Attendee List */}
                <Col xl={7} lg={6}>
                    <Card className="border-0 shadow-sm rounded-4 p-3 bg-white">
                        <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-3">
                            <div className="nav nav-pills bg-light rounded-pill p-1" style={{ fontSize: '0.78rem' }}>
                                <button className={`nav-link border-0 rounded-pill py-1 px-3 ${activeTab === 'all' ? 'bg-primary text-white' : 'text-muted'}`} onClick={() => setActiveTab('all')}>All Attendees (2.450)</button>
                                <button className={`nav-link border-0 rounded-pill py-1 px-3 ${activeTab === 'checkedin' ? 'bg-primary text-white' : 'text-muted'}`} onClick={() => setActiveTab('checkedin')}>Checked-in (1.642)</button>
                                <button className={`nav-link border-0 rounded-pill py-1 px-3 ${activeTab === 'notcheckedin' ? 'bg-primary text-white' : 'text-muted'}`} onClick={() => setActiveTab('notcheckedin')}>Not Checked-in (808)</button>
                            </div>
                            <div className="d-flex align-items-center gap-2">
                                <div className="position-relative" style={{ width: '200px' }}>
                                    <i className="bx bx-search position-absolute top-50 start-0 translate-middle-y ms-2 text-muted" style={{ fontSize: '0.85rem' }}></i>
                                    <input type="text" className="form-control form-control-sm ps-4 bg-light border-0" placeholder="Search name, order ID..." style={{ fontSize: '0.78rem' }} />
                                </div>
                                <button className="btn btn-sm btn-light border text-muted px-2 py-1" style={{ fontSize: '0.78rem' }}><i className="bx bx-filter me-1"></i> Filter</button>
                            </div>
                        </div>

                        <div className="table-responsive">
                            <Table hover className="align-middle mb-0" style={{ fontSize: '0.84rem' }}>
                                <thead className="bg-light text-muted uppercase">
                                    <tr>
                                        <th style={{ width: '30px' }}><Form.Check type="checkbox" /></th>
                                        <th>Attendee</th>
                                        <th>Ticket Type</th>
                                        <th>Order ID</th>
                                        <th>Check-in Time</th>
                                        <th>Status</th>
                                        <th className="text-end">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {attendeeList.map((a, idx) => (
                                        <tr key={idx}>
                                            <td><Form.Check type="checkbox" /></td>
                                            <td>
                                                <div className="d-flex align-items-center gap-2">
                                                    <div className="avatar avatar-sm rounded-circle bg-primary text-white d-flex align-items-center justify-content-center fw-bold" style={{ width: '32px', height: '32px', fontSize: '0.78rem' }}>
                                                        {a.name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <div className="fw-bold text-dark">{a.name}</div>
                                                        <div className="text-muted" style={{ fontSize: '0.7rem' }}>{a.email}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td><span className="badge badge-purple">{a.type}</span></td>
                                            <td className="fw-semibold text-primary">{a.id}</td>
                                            <td className="text-muted" style={{ fontSize: '0.75rem' }}>{a.checkin_time}</td>
                                            <td>
                                                <span className={`badge ${a.status === 'Checked-in' ? 'badge-published' : 'badge-draft'}`}>
                                                    {a.status}
                                                </span>
                                            </td>
                                            <td className="text-end">
                                                <button className="btn btn-sm btn-icon text-muted hover-text-primary p-1"><i className="bx bx-dots-horizontal-rounded fs-5"></i></button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </div>
                    </Card>
                </Col>

                {/* Right Side: Quick Check-in Camera Viewfinder Panel */}
                <Col xl={5} lg={6}>
                    <Card className="border-0 shadow-sm rounded-4 p-3 bg-white mb-3">
                        <div className="d-flex align-items-center justify-content-between border-bottom pb-2 mb-3">
                            <h6 className="fw-bold text-dark mb-0" style={{ fontSize: '1rem' }}>Quick Check-in</h6>
                            <span className="text-muted" style={{ fontSize: '0.72rem' }}>How to scan? <i className="bx bx-help-circle"></i></span>
                        </div>

                        <div className="d-flex gap-2 mb-3">
                            <button className={`btn btn-sm flex-grow-1 rounded-pill ${scanMode === 'qr' ? 'btn-primary' : 'btn-light border text-muted'}`} onClick={() => setScanMode('qr')}>
                                <i className="bx bx-qr-scan me-1"></i> Scan QR Code
                            </button>
                            <button className={`btn btn-sm flex-grow-1 rounded-pill ${scanMode === 'code' ? 'btn-primary' : 'btn-light border text-muted'}`} onClick={() => setScanMode('code')}>
                                <i className="bx bx-barcode me-1"></i> Enter Code
                            </button>
                        </div>

                        <div className="scanner-frame mb-3 position-relative">
                            <div className="text-center text-white p-3">
                                <i className="bx bx-qr-scan display-3 text-primary mb-2 opacity-75"></i>
                                <div className="text-white-50" style={{ fontSize: '0.82rem' }}>Arahkan kamera ke QR Code tiket</div>
                            </div>
                            {isScanning && (
                                <div className="position-absolute top-0 start-0 end-0 bottom-0 bg-primary bg-opacity-25 d-flex align-items-center justify-content-center">
                                    <span className="spinner-border text-white"></span>
                                </div>
                            )}
                        </div>

                        <Button variant="primary" className="w-100 rounded-pill py-2 mb-3" onClick={() => setIsScanning(!isScanning)}>
                            <i className="bx bx-camera me-1"></i> {isScanning ? "Stop Scanning" : "Start Scanning"}
                        </Button>

                        <div className="border-top pt-3">
                            <div className="d-flex align-items-center justify-content-between mb-2">
                                <span className="fw-bold text-dark small">Recent Check-in</span>
                                <span className="text-primary small cursor-pointer">View all</span>
                            </div>
                            <div className="d-flex flex-column gap-2">
                                {recentCheckins.map((rc, idx) => (
                                    <div key={idx} className="d-flex align-items-center justify-content-between p-2 rounded-3 bg-light" style={{ fontSize: '0.78rem' }}>
                                        <div className="d-flex align-items-center gap-2">
                                            <div className="avatar avatar-xs rounded-circle bg-success text-white d-flex align-items-center justify-content-center fw-bold">✓</div>
                                            <div>
                                                <div className="fw-bold text-dark">{rc.name}</div>
                                                <div className="text-muted" style={{ fontSize: '0.68rem' }}>{rc.type}</div>
                                            </div>
                                        </div>
                                        <div className="text-success fw-semibold" style={{ fontSize: '0.72rem' }}>
                                            {rc.time} <i className="bx bx-check-double ms-1"></i>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="mt-3 bg-light rounded-3 p-2 border d-flex align-items-center justify-content-between" style={{ fontSize: '0.75rem' }}>
                            <span className="text-muted">Last updated: 20 May 2026, 14:32</span>
                            <button className="btn btn-sm btn-link text-primary p-0 text-decoration-none"><i className="bx bx-refresh me-1"></i> Refresh</button>
                        </div>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default TicketEventPage;
