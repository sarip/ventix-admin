/**
 * EO Reports Analytics Page - PDF Page 8 High Fidelity Implementation
 */

import React, { useState } from 'react';
import { Card, Row, Col, Table, Button, Form } from 'react-bootstrap';

const ReportsPage: React.FC = () => {
    const [selectedEvent, setSelectedEvent] = useState('All Events');

    const salesByEvent = [
        { title: "Summer Music Festival 2026", date: "20 Dec 2026 • ICE BSD City", sold: "1.450", revenue: "Rp 210.450.000", share: 58.1 },
        { title: "Tech Summit Indonesia 2026", date: "07 Jun 2026 • ICE BSD City", sold: "450", revenue: "Rp 75.600.000", share: 20.9 },
        { title: "Art & Culture Expo", date: "21 Jun 2026 • Taman Ismail Marzuki", sold: "280", revenue: "Rp 36.750.000", share: 10.2 },
        { title: "Runfest 2026", date: "27 Sep 2026 • GBK Senayan", sold: "180", revenue: "Rp 18.450.000", share: 5.1 },
        { title: "Corporate Gathering 2026", date: "15 May 2026 • Atria Hotel", sold: "90", revenue: "Rp 8.400.000", share: 2.3 }
    ];

    return (
        <div className="py-3 px-1">
            {/* HEADER */}
            <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 mb-3">
                <div>
                    <h4 className="fw-extrabold text-dark mb-1" style={{ fontSize: '1.45rem' }}>Reports</h4>
                    <p className="text-muted small mb-0">Pantau performa event dan penjualan tiket dengan data yang akurat.</p>
                </div>
                {/* Filters Header Bar */}
                <div className="d-flex flex-wrap align-items-center gap-2">
                    <Form.Control type="text" value="20 May 2026 - 20 Jun 2026" readOnly className="form-control-sm bg-white border text-muted w-auto" style={{ fontSize: '0.8rem' }} />
                    <Form.Select className="form-select-sm bg-white border text-muted w-auto" value={selectedEvent} onChange={(e) => setSelectedEvent(e.target.value)} style={{ fontSize: '0.8rem' }}>
                        <option>All Events</option>
                        <option>Summer Music Festival 2026</option>
                        <option>Tech Summit Indonesia</option>
                    </Form.Select>
                    <Button variant="light" size="sm" className="border text-muted px-2 py-1" style={{ fontSize: '0.8rem' }}>
                        <i className="bx bx-filter me-1"></i> Filter
                    </Button>
                    <Button variant="primary" size="sm" className="rounded-pill px-3 py-1" style={{ fontSize: '0.8rem' }}>
                        <i className="bx bx-download me-1"></i> Export Report
                    </Button>
                </div>
            </div>

            {/* 5 METRIC CARDS */}
            <Row className="g-3 mb-4">
                <Col xl={2.4} lg={4} md={6}>
                    <Card className="border-0 shadow-sm rounded-4 p-2 bg-white">
                        <Card.Body className="p-2">
                            <span className="text-muted small fw-semibold uppercase" style={{ fontSize: '0.72rem' }}>Total Revenue</span>
                            <h4 className="fw-extrabold text-dark mt-1 mb-1" style={{ fontSize: '1.3rem' }}>Rp 361.650.000</h4>
                            <span className="badge bg-success-subtle text-success p-1" style={{ fontSize: '0.68rem' }}>↑ 18.2% vs 20 Apr - 20 May</span>
                        </Card.Body>
                    </Card>
                </Col>

                <Col xl={2.4} lg={4} md={6}>
                    <Card className="border-0 shadow-sm rounded-4 p-2 bg-white">
                        <Card.Body className="p-2">
                            <span className="text-muted small fw-semibold uppercase" style={{ fontSize: '0.72rem' }}>Tickets Sold</span>
                            <h4 className="fw-extrabold text-dark mt-1 mb-1" style={{ fontSize: '1.3rem' }}>2.450</h4>
                            <span className="badge bg-success-subtle text-success p-1" style={{ fontSize: '0.68rem' }}>↑ 14.6% vs 20 Apr - 20 May</span>
                        </Card.Body>
                    </Card>
                </Col>

                <Col xl={2.4} lg={4} md={6}>
                    <Card className="border-0 shadow-sm rounded-4 p-2 bg-white">
                        <Card.Body className="p-2">
                            <span className="text-muted small fw-semibold uppercase" style={{ fontSize: '0.72rem' }}>Total Attendees</span>
                            <h4 className="fw-extrabold text-dark mt-1 mb-1" style={{ fontSize: '1.3rem' }}>1.642</h4>
                            <span className="badge bg-success-subtle text-success p-1" style={{ fontSize: '0.68rem' }}>↑ 12.9% vs 20 Apr - 20 May</span>
                        </Card.Body>
                    </Card>
                </Col>

                <Col xl={2.4} lg={4} md={6}>
                    <Card className="border-0 shadow-sm rounded-4 p-2 bg-white">
                        <Card.Body className="p-2">
                            <span className="text-muted small fw-semibold uppercase" style={{ fontSize: '0.72rem' }}>Average Order Value</span>
                            <h4 className="fw-extrabold text-dark mt-1 mb-1" style={{ fontSize: '1.3rem' }}>Rp 147.612</h4>
                            <span className="badge bg-success-subtle text-success p-1" style={{ fontSize: '0.68rem' }}>↑ 5.3% vs 20 Apr - 20 May</span>
                        </Card.Body>
                    </Card>
                </Col>

                <Col xl={2.4} lg={4} md={6}>
                    <Card className="border-0 shadow-sm rounded-4 p-2 bg-white">
                        <Card.Body className="p-2">
                            <span className="text-muted small fw-semibold uppercase" style={{ fontSize: '0.72rem' }}>Conversion Rate</span>
                            <h4 className="fw-extrabold text-dark mt-1 mb-1" style={{ fontSize: '1.3rem' }}>23.6%</h4>
                            <span className="badge bg-success-subtle text-success p-1" style={{ fontSize: '0.68rem' }}>↑ 2.1% vs 20 Apr - 20 May</span>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Row className="g-4 mb-4">
                {/* Revenue Overview Line Chart Card */}
                <Col xl={7} lg={6}>
                    <Card className="border-0 shadow-sm rounded-4 p-3 bg-white h-100">
                        <div className="d-flex align-items-center justify-content-between border-bottom pb-2 mb-3">
                            <h6 className="fw-bold text-dark mb-0" style={{ fontSize: '0.95rem' }}>Revenue Overview</h6>
                            <select className="form-select form-select-sm border-0 bg-light text-muted w-auto" style={{ fontSize: '0.75rem' }}>
                                <option>Daily</option>
                                <option>Weekly</option>
                            </select>
                        </div>
                        <div className="w-100 my-3" style={{ height: '180px' }}>
                            <svg viewBox="0 0 500 150" className="w-100 h-100">
                                <path d="M0,120 Q50,40 100,90 T200,60 T300,10 T400,70 T500,40" fill="none" stroke="#6366f1" strokeWidth="3" />
                            </svg>
                        </div>
                        <div className="d-flex justify-content-between text-muted small px-1" style={{ fontSize: '0.72rem' }}>
                            <span>20 May</span><span>24 May</span><span>28 May</span><span>1 Jun</span><span>5 Jun</span><span>9 Jun</span><span>13 Jun</span><span>17 Jun</span><span>20 Jun</span>
                        </div>
                    </Card>
                </Col>

                {/* Revenue by Payment Method Donut Card */}
                <Col xl={5} lg={6}>
                    <Card className="border-0 shadow-sm rounded-4 p-3 bg-white h-100">
                        <h6 className="fw-bold text-dark mb-3" style={{ fontSize: '0.95rem' }}>Revenue by Payment Method</h6>
                        <div className="d-flex align-items-center gap-3">
                            <div style={{ width: '130px', height: '130px' }}>
                                <svg viewBox="0 0 36 36" className="w-100 h-100">
                                    <path strokeDasharray="55, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#6366f1" strokeWidth="5" />
                                    <path strokeDasharray="27, 100" strokeDashoffset="-55" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#10b981" strokeWidth="5" />
                                    <path strokeDasharray="13, 100" strokeDashoffset="-82" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#f59e0b" strokeWidth="5" />
                                </svg>
                            </div>
                            <div className="flex-grow-1" style={{ fontSize: '0.78rem' }}>
                                <div className="d-flex justify-content-between py-1 border-bottom">
                                    <span><span className="rounded-circle me-1" style={{ display: 'inline-block', width: '8px', height: '8px', backgroundColor: '#6366f1' }}></span>Midtrans</span>
                                    <span className="fw-bold">Rp 198.450.000 (54.9%)</span>
                                </div>
                                <div className="d-flex justify-content-between py-1 border-bottom">
                                    <span><span className="rounded-circle me-1" style={{ display: 'inline-block', width: '8px', height: '8px', backgroundColor: '#10b981' }}></span>Bank Transfer</span>
                                    <span className="fw-bold">Rp 98.175.000 (27.1%)</span>
                                </div>
                                <div className="d-flex justify-content-between py-1 border-bottom">
                                    <span><span className="rounded-circle me-1" style={{ display: 'inline-block', width: '8px', height: '8px', backgroundColor: '#f59e0b' }}></span>E-Wallet</span>
                                    <span className="fw-bold">Rp 45.320.000 (12.5%)</span>
                                </div>
                                <div className="d-flex justify-content-between py-1">
                                    <span><span className="rounded-circle me-1" style={{ display: 'inline-block', width: '8px', height: '8px', backgroundColor: '#3b82f6' }}></span>Virtual Account</span>
                                    <span className="fw-bold">Rp 19.705.000 (5.5%)</span>
                                </div>
                            </div>
                        </div>
                    </Card>
                </Col>
            </Row>

            {/* BOTTOM ROW: Sales by Event & Right Summary Sidebar */}
            <Row className="g-4">
                <Col xl={8} lg={7}>
                    <Card className="border-0 shadow-sm rounded-4 p-3 bg-white">
                        <h6 className="fw-bold text-dark mb-3" style={{ fontSize: '0.95rem' }}>Sales by Event</h6>
                        <div className="table-responsive">
                            <Table hover className="align-middle mb-0" style={{ fontSize: '0.84rem' }}>
                                <thead className="bg-light text-muted uppercase">
                                    <tr>
                                        <th>Event</th>
                                        <th>Tickets Sold</th>
                                        <th>Revenue</th>
                                        <th>% of Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {salesByEvent.map((ev, idx) => (
                                        <tr key={idx}>
                                            <td>
                                                <div className="fw-bold text-dark">{ev.title}</div>
                                                <div className="text-muted" style={{ fontSize: '0.7rem' }}>{ev.date}</div>
                                            </td>
                                            <td className="fw-bold text-dark">{ev.sold}</td>
                                            <td className="fw-bold text-primary">{ev.revenue}</td>
                                            <td>
                                                <div style={{ width: '100px' }}>
                                                    <span className="small text-muted">{ev.share}%</span>
                                                    <div className="progress" style={{ height: '4px' }}>
                                                        <div className="progress-bar bg-primary" style={{ width: `${ev.share}%` }}></div>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </div>
                    </Card>
                </Col>

                {/* Right Side Summary Sidebar */}
                <Col xl={4} lg={5}>
                    <Card className="border-0 shadow-sm rounded-4 p-3 bg-white mb-3">
                        <h6 className="fw-bold text-dark mb-3" style={{ fontSize: '0.95rem' }}>Summary</h6>
                        <div className="d-flex flex-column gap-2" style={{ fontSize: '0.78rem' }}>
                            <div className="d-flex justify-content-between p-2 rounded-3 bg-light">
                                <span>Total Events</span>
                                <span className="fw-bold text-dark">8 <span className="text-success ms-1">↑ 2</span></span>
                            </div>
                            <div className="d-flex justify-content-between p-2 rounded-3 bg-light">
                                <span>Active Events</span>
                                <span className="fw-bold text-dark">5 <span className="text-success ms-1">↑ 1</span></span>
                            </div>
                            <div className="d-flex justify-content-between p-2 rounded-3 bg-light">
                                <span>Upcoming Events</span>
                                <span className="fw-bold text-dark">3 <span className="text-muted ms-1">↓ 1</span></span>
                            </div>
                        </div>
                    </Card>

                    <Card className="border-0 shadow-sm rounded-4 p-3 bg-white">
                        <h6 className="fw-bold text-dark mb-2" style={{ fontSize: '0.95rem' }}>Reports Shortcuts</h6>
                        <div className="d-flex flex-column gap-2" style={{ fontSize: '0.78rem' }}>
                            <div className="d-flex align-items-center gap-2 p-2 rounded-3 border bg-light-subtle cursor-pointer hover-bg-light">
                                <i className="bx bx-receipt fs-5 text-primary"></i>
                                <div>
                                    <div className="fw-bold text-dark">Sales Report</div>
                                    <div className="text-muted" style={{ fontSize: '0.68rem' }}>Laporan penjualan tiket</div>
                                </div>
                            </div>
                            <div className="d-flex align-items-center gap-2 p-2 rounded-3 border bg-light-subtle cursor-pointer hover-bg-light">
                                <i className="bx bx-group fs-5 text-success"></i>
                                <div>
                                    <div className="fw-bold text-dark">Attendee Report</div>
                                    <div className="text-muted" style={{ fontSize: '0.68rem' }}>Laporan data kehadiran</div>
                                </div>
                            </div>
                        </div>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default ReportsPage;
