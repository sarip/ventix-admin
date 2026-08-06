/**
 * EO Payouts Page - PDF Page 9 High Fidelity Implementation
 */

import React, { useState } from 'react';
import { Card, Row, Col, Table, Button, Form, Badge } from 'react-bootstrap';

const PayoutsPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'all' | 'completed' | 'pending' | 'processing' | 'failed' | 'cancelled'>('all');
    const [selectedPayout, setSelectedPayout] = useState<any>({
        id: "#PAYOUT-0028",
        status: "Completed",
        payout_date: "18 Jun 2026, 14:32 WIB",
        processed_date: "18 Jun 2026, 15:02 WIB",
        event: "Summer Music Festival 2026",
        venue: "ICE BSD City",
        gross_revenue: "Rp 51.187.500",
        platform_fee: "- Rp 2.437.500",
        gateway_fee: "- Rp 1.350.000",
        adjustments: "- Rp 650.000",
        payout_amount: "Rp 48.750.000",
        bank_name: "Bank Transfer BCA",
        account_no: "**** 7890"
    });

    const payoutList = [
        {
            id: "#PAYOUT-0028",
            event: "Summer Music Festival 2026",
            venue: "ICE BSD City",
            date: "18 Jun 2026 14:32 WIB",
            amount: "Rp 48.750.000",
            fee: "Rp 2.437.500 (5%)",
            method: "Bank Transfer BCA **** 7890",
            status: "Completed"
        },
        {
            id: "#PAYOUT-0027",
            event: "Tech Summit Indonesia 2026",
            venue: "ICE BSD City",
            date: "15 Jun 2026 10:21 WIB",
            amount: "Rp 36.250.000",
            fee: "Rp 1.812.500 (5%)",
            method: "Bank Transfer Mandiri **** 1234",
            status: "Completed"
        },
        {
            id: "#PAYOUT-0026",
            event: "Art & Culture Expo",
            venue: "Taman Ismail Marzuki",
            date: "14 Jun 2026 16:45 WIB",
            amount: "Rp 18.450.000",
            fee: "Rp 922.500 (5%)",
            method: "Bank Transfer BCA **** 4567",
            status: "Completed"
        },
        {
            id: "#PAYOUT-0025",
            event: "Runfest 2026",
            venue: "GBK Senayan",
            date: "12 Jun 2026 11:20 WIB",
            amount: "Rp 12.750.000",
            fee: "Rp 637.500 (5%)",
            method: "E-Wallet OVO **** 9876",
            status: "Processing"
        },
        {
            id: "#PAYOUT-0024",
            event: "Corporate Gathering 2026",
            venue: "Atria Hotel",
            date: "10 Jun 2026 09:15 WIB",
            amount: "Rp 8.920.000",
            fee: "Rp 446.000 (5%)",
            method: "Bank Transfer BNI **** 3210",
            status: "Pending"
        }
    ];

    return (
        <div className="py-3 px-1">
            {/* HEADER */}
            <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 mb-3">
                <div>
                    <h4 className="fw-extrabold text-dark mb-1" style={{ fontSize: '1.45rem' }}>Payouts</h4>
                    <p className="text-muted small mb-0">Kelola pencairan dana dari penjualan tiket event Anda.</p>
                </div>
                <div className="d-flex align-items-center gap-2">
                    <Button variant="light" size="sm" className="border text-muted rounded-pill px-3 py-2"><i className="bx bx-cog me-1"></i> Payout Settings</Button>
                    <Button variant="primary" size="sm" className="rounded-pill px-3 py-2"><i className="bx bx-plus me-1"></i> Request Payout</Button>
                </div>
            </div>

            {/* 4 METRIC CARDS */}
            <Row className="g-3 mb-4">
                <Col xl={3} lg={6} md={6}>
                    <Card className="border-0 shadow-sm rounded-4 p-2 bg-white">
                        <Card.Body className="d-flex align-items-center justify-content-between p-2">
                            <div>
                                <span className="text-muted small fw-semibold uppercase" style={{ fontSize: '0.72rem' }}>Total Balance</span>
                                <h3 className="fw-extrabold text-dark mt-1 mb-0" style={{ fontSize: '1.45rem' }}>Rp 125.450.000</h3>
                                <span className="text-muted small" style={{ fontSize: '0.72rem' }}>Tersedia untuk dicairkan</span>
                            </div>
                            <div className="metric-icon-box rounded-4 bg-primary-subtle text-primary">
                                <i className="bx bx-wallet fs-3"></i>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>

                <Col xl={3} lg={6} md={6}>
                    <Card className="border-0 shadow-sm rounded-4 p-2 bg-white">
                        <Card.Body className="d-flex align-items-center justify-content-between p-2">
                            <div>
                                <span className="text-muted small fw-semibold uppercase" style={{ fontSize: '0.72rem' }}>Total Payouts</span>
                                <h3 className="fw-extrabold text-dark mt-1 mb-0" style={{ fontSize: '1.45rem' }}>Rp 736.850.000</h3>
                                <span className="text-muted small" style={{ fontSize: '0.72rem' }}>Total dana telah dicairkan</span>
                            </div>
                            <div className="metric-icon-box rounded-4 bg-success-subtle text-success">
                                <i className="bx bx-check-double fs-3"></i>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>

                <Col xl={3} lg={6} md={6}>
                    <Card className="border-0 shadow-sm rounded-4 p-2 bg-white">
                        <Card.Body className="d-flex align-items-center justify-content-between p-2">
                            <div>
                                <span className="text-muted small fw-semibold uppercase" style={{ fontSize: '0.72rem' }}>Pending Payouts</span>
                                <h3 className="fw-extrabold text-dark mt-1 mb-0" style={{ fontSize: '1.45rem' }}>Rp 84.320.000</h3>
                                <span className="text-muted small" style={{ fontSize: '0.72rem' }}>Menunggu proses</span>
                            </div>
                            <div className="metric-icon-box rounded-4" style={{ backgroundColor: 'rgba(245, 158, 11, 0.12)', color: '#f59e0b' }}>
                                <i className="bx bx-time-five fs-3"></i>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>

                <Col xl={3} lg={6} md={6}>
                    <Card className="border-0 shadow-sm rounded-4 p-2 bg-white">
                        <Card.Body className="d-flex align-items-center justify-content-between p-2">
                            <div>
                                <span className="text-muted small fw-semibold uppercase" style={{ fontSize: '0.72rem' }}>This Month Payout</span>
                                <h3 className="fw-extrabold text-dark mt-1 mb-0" style={{ fontSize: '1.45rem' }}>Rp 96.750.000</h3>
                                <span className="badge bg-success-subtle text-success p-1" style={{ fontSize: '0.68rem' }}>↑ 18.6% vs last month</span>
                            </div>
                            <div className="metric-icon-box rounded-4 bg-info-subtle text-info">
                                <i className="bx bx-trending-up fs-3"></i>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Row className="g-4">
                {/* Left Side: Payout Table */}
                <Col xl={selectedPayout ? 8 : 12}>
                    <Card className="border-0 shadow-sm rounded-4 p-3 bg-white">
                        {/* Tabs & Search */}
                        <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-3">
                            <div className="nav nav-pills bg-light rounded-pill p-1" style={{ fontSize: '0.78rem' }}>
                                <button className={`nav-link border-0 rounded-pill py-1 px-3 ${activeTab === 'all' ? 'bg-primary text-white' : 'text-muted'}`} onClick={() => setActiveTab('all')}>All Payouts (28)</button>
                                <button className={`nav-link border-0 rounded-pill py-1 px-3 ${activeTab === 'completed' ? 'bg-primary text-white' : 'text-muted'}`} onClick={() => setActiveTab('completed')}>Completed (20)</button>
                                <button className={`nav-link border-0 rounded-pill py-1 px-3 ${activeTab === 'pending' ? 'bg-primary text-white' : 'text-muted'}`} onClick={() => setActiveTab('pending')}>Pending (3)</button>
                                <button className={`nav-link border-0 rounded-pill py-1 px-3 ${activeTab === 'processing' ? 'bg-primary text-white' : 'text-muted'}`} onClick={() => setActiveTab('processing')}>Processing (1)</button>
                            </div>
                            <div className="d-flex align-items-center gap-2">
                                <Form.Control type="text" value="20 May 2026 - 20 Jun 2026" readOnly className="form-control-sm bg-light border-0 text-muted w-auto" style={{ fontSize: '0.78rem' }} />
                                <button className="btn btn-sm btn-light border text-muted px-2 py-1" style={{ fontSize: '0.78rem' }}><i className="bx bx-filter me-1"></i> Filter</button>
                                <button className="btn btn-sm btn-light border text-muted px-2 py-1" style={{ fontSize: '0.78rem' }}><i className="bx bx-export me-1"></i> Export</button>
                            </div>
                        </div>

                        {/* Table */}
                        <div className="table-responsive">
                            <Table hover className="align-middle mb-0" style={{ fontSize: '0.82rem' }}>
                                <thead className="bg-light text-muted uppercase">
                                    <tr>
                                        <th>Payout ID</th>
                                        <th>Event</th>
                                        <th>Payout Date</th>
                                        <th>Amount</th>
                                        <th>Fee</th>
                                        <th>Method</th>
                                        <th>Status</th>
                                        <th className="text-end">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {payoutList.map((po, idx) => (
                                        <tr key={idx} className="cursor-pointer" onClick={() => setSelectedPayout({
                                            id: po.id,
                                            status: po.status,
                                            payout_date: po.date,
                                            processed_date: po.date,
                                            event: po.event,
                                            venue: po.venue,
                                            gross_revenue: "Rp 51.187.500",
                                            platform_fee: "- Rp 2.437.500",
                                            gateway_fee: "- Rp 1.350.000",
                                            adjustments: "- Rp 650.000",
                                            payout_amount: po.amount,
                                            bank_name: po.method,
                                            account_no: "**** 7890"
                                        })}>
                                            <td className="fw-bold text-primary">{po.id}</td>
                                            <td>
                                                <div className="fw-bold text-dark">{po.event}</div>
                                                <div className="text-muted" style={{ fontSize: '0.7rem' }}>{po.venue}</div>
                                            </td>
                                            <td className="text-muted" style={{ fontSize: '0.75rem' }}>{po.date}</td>
                                            <td className="fw-bold text-dark">{po.amount}</td>
                                            <td className="text-muted" style={{ fontSize: '0.75rem' }}>{po.fee}</td>
                                            <td className="text-muted" style={{ fontSize: '0.75rem' }}>{po.method}</td>
                                            <td>
                                                <span className={`badge ${po.status === 'Completed' ? 'badge-published' : po.status === 'Processing' ? 'badge-info' : 'badge-draft'}`}>
                                                    {po.status}
                                                </span>
                                            </td>
                                            <td className="text-end">
                                                <button className="btn btn-sm btn-icon text-muted hover-text-primary p-1"><i className="bx bx-show fs-5"></i></button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </div>
                    </Card>
                </Col>

                {/* Right Side: Payout Detail Panel */}
                {selectedPayout && (
                    <Col xl={4}>
                        <Card className="border-0 shadow-sm rounded-4 p-3 bg-white">
                            <div className="d-flex align-items-center justify-content-between border-bottom pb-2 mb-3">
                                <h6 className="fw-bold text-dark mb-0" style={{ fontSize: '1rem' }}>Payout Detail</h6>
                                <button className="btn btn-sm btn-icon text-muted p-0" onClick={() => setSelectedPayout(null)}><i className="bx bx-x fs-4"></i></button>
                            </div>

                            {/* Payout Header ID & Status */}
                            <div className="d-flex align-items-center justify-content-between bg-light p-2 rounded-3 mb-3">
                                <div>
                                    <div className="fw-extrabold text-primary" style={{ fontSize: '1.05rem' }}>{selectedPayout.id}</div>
                                    <div className="text-muted" style={{ fontSize: '0.7rem' }}>Payout Date: {selectedPayout.payout_date}</div>
                                </div>
                                <span className={`badge ${selectedPayout.status === 'Completed' ? 'badge-published' : 'badge-draft'}`} style={{ fontSize: '0.8rem' }}>
                                    {selectedPayout.status}
                                </span>
                            </div>

                            {/* Event Info */}
                            <div className="mb-3 border-bottom pb-2">
                                <div className="text-muted small uppercase fw-semibold mb-1" style={{ fontSize: '0.7rem' }}>Event</div>
                                <div className="fw-bold text-dark" style={{ fontSize: '0.85rem' }}>{selectedPayout.event}</div>
                                <div className="text-muted" style={{ fontSize: '0.72rem' }}>{selectedPayout.venue}</div>
                            </div>

                            {/* Financial Breakdown */}
                            <div className="mb-3 border-bottom pb-2">
                                <div className="text-muted small uppercase fw-semibold mb-2" style={{ fontSize: '0.7rem' }}>Payout Breakdown</div>
                                <div className="d-flex justify-content-between mb-1" style={{ fontSize: '0.78rem' }}>
                                    <span>Gross Revenue</span>
                                    <span className="fw-bold text-dark">{selectedPayout.gross_revenue}</span>
                                </div>
                                <div className="d-flex justify-content-between mb-1 text-muted" style={{ fontSize: '0.75rem' }}>
                                    <span>Platform Fee (5%)</span>
                                    <span className="text-danger">{selectedPayout.platform_fee}</span>
                                </div>
                                <div className="d-flex justify-content-between mb-1 text-muted" style={{ fontSize: '0.75rem' }}>
                                    <span>Payment Gateway Fee</span>
                                    <span className="text-danger">{selectedPayout.gateway_fee}</span>
                                </div>
                                <div className="d-flex justify-content-between mb-1 text-muted" style={{ fontSize: '0.75rem' }}>
                                    <span>Other Adjustments</span>
                                    <span className="text-danger">{selectedPayout.adjustments}</span>
                                </div>
                                <div className="d-flex justify-content-between pt-2 border-top fw-bold text-dark" style={{ fontSize: '0.95rem' }}>
                                    <span>Payout Amount</span>
                                    <span className="text-primary">{selectedPayout.payout_amount}</span>
                                </div>
                                <div className="text-success small mt-1" style={{ fontSize: '0.68rem' }}>✓ Dana telah berhasil ditransfer ke rekening Anda.</div>
                            </div>

                            {/* Payout Timeline Stepper */}
                            <div className="mb-3">
                                <div className="text-muted small uppercase fw-semibold mb-2" style={{ fontSize: '0.7rem' }}>Payout Timeline</div>
                                <div className="d-flex flex-column gap-2 ps-2 border-start border-2 border-primary" style={{ fontSize: '0.75rem' }}>
                                    <div>
                                        <span className="fw-bold text-dark">Request Payout</span>
                                        <div className="text-muted" style={{ fontSize: '0.68rem' }}>18 Jun 2026, 14:32 WIB</div>
                                    </div>
                                    <div>
                                        <span className="fw-bold text-dark">Processing</span>
                                        <div className="text-muted" style={{ fontSize: '0.68rem' }}>18 Jun 2026, 14:33 WIB</div>
                                    </div>
                                    <div>
                                        <span className="fw-bold text-success">Transferred</span>
                                        <div className="text-muted" style={{ fontSize: '0.68rem' }}>18 Jun 2026, 15:02 WIB</div>
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="d-flex flex-column gap-2 border-top pt-3">
                                <button className="btn btn-sm btn-outline-primary w-100"><i className="bx bx-download me-1"></i> Download Invoice</button>
                                <button className="btn btn-sm btn-light border w-100 text-muted"><i className="bx bx-receipt me-1"></i> View Payout Receipt</button>
                            </div>
                        </Card>
                    </Col>
                )}
            </Row>
        </div>
    );
};

export default PayoutsPage;
