/**
 * EO Promotions Page - PDF Page 7 High Fidelity Implementation
 */

import React, { useState } from 'react';
import { Card, Row, Col, Table, Button, Badge, ProgressBar } from 'react-bootstrap';

const PromotionsPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'all' | 'active' | 'scheduled' | 'expired' | 'draft'>('all');

    const promoList = [
        {
            name: "Flash Sale 7.7",
            code: "FLASH77",
            type: "Discount",
            discount: "20%",
            max: "Max Rp 50.000",
            usage: "1.248 / 2.000",
            period: "7 Jul 2026 00:00 - 7 Jul 2026 23:59",
            status: "Active",
            event: "Summer Music Festival 2026",
            badge: "FLASH SALE",
            color: "#6366f1"
        },
        {
            name: "Early Bird",
            code: "EARLY10",
            type: "Discount",
            discount: "10%",
            max: "Max Rp 30.000",
            usage: "2.156 / 3.000",
            period: "1 Jun 2026 00:00 - 30 Jun 2026 23:59",
            status: "Active",
            event: "Summer Music Festival 2026",
            badge: "EARLY BIRD",
            color: "#10b981"
        },
        {
            name: "Buy 2 Get 1",
            code: "B2G1",
            type: "Special",
            discount: "Beli 2 gratis 1",
            max: "(Regular Pass)",
            usage: "356 / 1.000",
            period: "10 Jun 2026 00:00 - 20 Aug 2026 23:59",
            status: "Active",
            event: "Tech Summit Indonesia 2026",
            badge: "BUY 2 GET 1",
            color: "#3b82f6"
        },
        {
            name: "Student Discount",
            code: "STUDENT15",
            type: "Discount",
            discount: "15%",
            max: "Max Rp 20.000",
            usage: "892 / 1.500",
            period: "1 Jun 2026 00:00 - 31 Aug 2026 23:59",
            status: "Active",
            event: "Art & Culture Expo",
            badge: "STUDENT 15",
            color: "#ec4899"
        },
        {
            name: "Weekend Special",
            code: "WEEKEND10",
            type: "Discount",
            discount: "10%",
            max: "Max Rp 25.000",
            usage: "1.102 / 2.000",
            period: "Setiap Sabtu - Minggu (Recurring)",
            status: "Scheduled",
            event: "Semua Event",
            badge: "WEEKEND",
            color: "#f59e0b"
        }
    ];

    return (
        <div className="py-3 px-1">
            {/* HEADER */}
            <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 mb-3">
                <div>
                    <h4 className="fw-extrabold text-dark mb-1" style={{ fontSize: '1.45rem' }}>Promotions</h4>
                    <p className="text-muted small mb-0">Kelola promo, diskon, dan kupon untuk meningkatkan penjualan tiket event Anda.</p>
                </div>
                <Button variant="primary" size="sm" className="rounded-pill px-3 py-2">
                    <i className="bx bx-plus me-1"></i> Create Promotion
                </Button>
            </div>

            {/* 4 METRIC CARDS */}
            <Row className="g-3 mb-4">
                <Col xl={3} lg={6} md={6}>
                    <Card className="border-0 shadow-sm rounded-4 p-2 bg-white">
                        <Card.Body className="d-flex align-items-center justify-content-between p-2">
                            <div>
                                <span className="text-muted small fw-semibold uppercase" style={{ fontSize: '0.72rem' }}>Total Promotions</span>
                                <h3 className="fw-extrabold text-dark mt-1 mb-0" style={{ fontSize: '1.6rem' }}>24</h3>
                                <span className="text-muted small" style={{ fontSize: '0.72rem' }}>Aktif 18 • Nonaktif 6</span>
                            </div>
                            <div className="metric-icon-box rounded-4 bg-primary-subtle text-primary">
                                <i className="bx bx-purchase-tag-alt fs-3"></i>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>

                <Col xl={3} lg={6} md={6}>
                    <Card className="border-0 shadow-sm rounded-4 p-2 bg-white">
                        <Card.Body className="d-flex align-items-center justify-content-between p-2">
                            <div>
                                <span className="text-muted small fw-semibold uppercase" style={{ fontSize: '0.72rem' }}>Total Usage</span>
                                <h3 className="fw-extrabold text-dark mt-1 mb-0" style={{ fontSize: '1.6rem' }}>8.432</h3>
                                <span className="text-muted small" style={{ fontSize: '0.72rem' }}>Digunakan oleh customer</span>
                            </div>
                            <div className="metric-icon-box rounded-4 bg-success-subtle text-success">
                                <i className="bx bx-user-check fs-3"></i>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>

                <Col xl={3} lg={6} md={6}>
                    <Card className="border-0 shadow-sm rounded-4 p-2 bg-white">
                        <Card.Body className="d-flex align-items-center justify-content-between p-2">
                            <div>
                                <span className="text-muted small fw-semibold uppercase" style={{ fontSize: '0.72rem' }}>Total Discount</span>
                                <h3 className="fw-extrabold text-dark mt-1 mb-0" style={{ fontSize: '1.4rem' }}>Rp 125.450.000</h3>
                                <span className="text-muted small" style={{ fontSize: '0.72rem' }}>Total nilai diskon</span>
                            </div>
                            <div className="metric-icon-box rounded-4" style={{ backgroundColor: 'rgba(245, 158, 11, 0.12)', color: '#f59e0b' }}>
                                <i className="bx bx-gift fs-3"></i>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>

                <Col xl={3} lg={6} md={6}>
                    <Card className="border-0 shadow-sm rounded-4 p-2 bg-white">
                        <Card.Body className="d-flex align-items-center justify-content-between p-2">
                            <div>
                                <span className="text-muted small fw-semibold uppercase" style={{ fontSize: '0.72rem' }}>Conversion Impact</span>
                                <h3 className="fw-extrabold text-dark mt-1 mb-0" style={{ fontSize: '1.6rem' }}>+23.6%</h3>
                                <span className="text-muted small" style={{ fontSize: '0.72rem' }}>vs tanpa promo</span>
                            </div>
                            <div className="metric-icon-box rounded-4 bg-info-subtle text-info">
                                <i className="bx bx-trending-up fs-3"></i>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Row className="g-4">
                {/* Left Side: Promotions Table */}
                <Col xl={7} lg={6}>
                    <Card className="border-0 shadow-sm rounded-4 p-3 bg-white">
                        <div className="d-flex align-items-center justify-content-between pb-3 mb-3 border-bottom">
                            <h6 className="fw-bold text-dark mb-0" style={{ fontSize: '1.05rem' }}>Promotions List</h6>
                            <div className="d-flex align-items-center gap-2">
                                <div className="position-relative" style={{ width: '200px' }}>
                                    <i className="bx bx-search position-absolute top-50 start-0 translate-middle-y ms-2.5 text-muted" style={{ fontSize: '0.9rem' }}></i>
                                    <input type="text" className="form-control form-control-sm ps-4 bg-light border-0" placeholder="Search promotion..." style={{ fontSize: '0.8rem', borderRadius: '6px' }} />
                                </div>
                                <button className="btn btn-sm btn-light border text-secondary px-2.5 py-1 d-flex align-items-center gap-1" style={{ fontSize: '0.8rem', borderRadius: '6px' }}><i className="bx bx-filter fs-6"></i> Filter</button>
                            </div>
                        </div>

                        {/* Clean Underline Tabs */}
                        <div className="d-flex align-items-center gap-4 mb-3 border-bottom overflow-x-auto" style={{ fontSize: '0.875rem' }}>
                            {[
                                { id: 'all', label: 'All Promotions (24)' },
                                { id: 'active', label: 'Active (18)' },
                                { id: 'scheduled', label: 'Scheduled (2)' },
                                { id: 'expired', label: 'Expired (4)' }
                            ].map(tab => (
                                <button
                                    key={tab.id}
                                    className={`btn btn-link text-decoration-none px-0 py-2 border-0 fw-semibold cursor-pointer text-nowrap ${activeTab === tab.id ? 'text-primary border-bottom border-2 border-primary' : 'text-secondary opacity-75 hover-opacity-100'}`}
                                    style={{
                                        borderRadius: 0,
                                        marginBottom: '-1px',
                                        fontSize: '0.85rem'
                                    }}
                                    onClick={() => setActiveTab(tab.id as any)}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        {/* Promo Table */}
                        <div className="table-responsive">
                            <Table hover className="align-middle mb-0" style={{ fontSize: '0.82rem' }}>
                                <thead className="bg-light text-muted uppercase">
                                    <tr>
                                        <th>Promotion</th>
                                        <th>Type</th>
                                        <th>Discount</th>
                                        <th>Usage</th>
                                        <th>Valid Period</th>
                                        <th>Status</th>
                                        <th>Event</th>
                                        <th className="text-end">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {promoList.map((p, idx) => (
                                        <tr key={idx}>
                                            <td>
                                                <div className="d-flex align-items-center gap-2">
                                                    <div className="rounded-3 p-2 text-white fw-bold text-center d-flex align-items-center justify-content-center" style={{ width: '42px', height: '42px', backgroundColor: p.color, fontSize: '0.6rem' }}>
                                                        {p.badge}
                                                    </div>
                                                    <div>
                                                        <div className="fw-bold text-dark">{p.name}</div>
                                                        <div className="font-monospace text-primary" style={{ fontSize: '0.7rem' }}>{p.code}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="text-muted">{p.type}</td>
                                            <td>
                                                <div className="fw-bold text-dark">{p.discount}</div>
                                                <div className="text-muted" style={{ fontSize: '0.68rem' }}>{p.max}</div>
                                            </td>
                                            <td className="fw-semibold text-dark">{p.usage}</td>
                                            <td className="text-muted" style={{ fontSize: '0.72rem' }}>{p.period}</td>
                                            <td>
                                                <span className={`badge ${p.status === 'Active' ? 'badge-published' : 'badge-draft'}`}>
                                                    {p.status}
                                                </span>
                                            </td>
                                            <td className="text-muted" style={{ fontSize: '0.75rem' }}>{p.event}</td>
                                            <td className="text-end">
                                                <button className="btn btn-sm btn-icon text-muted hover-text-primary p-1"><i className="bx bx-edit fs-5"></i></button>
                                                <button className="btn btn-sm btn-icon text-muted hover-text-primary p-1"><i className="bx bx-dots-horizontal-rounded fs-5"></i></button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </div>
                    </Card>
                </Col>

                {/* Right Side: Promo Performance & Templates */}
                <Col xl={5} lg={6}>
                    {/* Promotion Performance Card */}
                    <Card className="border-0 shadow-sm rounded-4 p-3 bg-white mb-3">
                        <div className="d-flex align-items-center justify-content-between border-bottom pb-2 mb-2">
                            <h6 className="fw-bold text-dark mb-0" style={{ fontSize: '0.95rem' }}>Promotion Performance</h6>
                            <select className="form-select form-select-sm border-0 bg-light text-muted w-auto" style={{ fontSize: '0.75rem' }}>
                                <option>Last 30 Days</option>
                            </select>
                        </div>

                        <div className="mb-2">
                            <div className="text-muted" style={{ fontSize: '0.72rem' }}>Total Revenue from Promo</div>
                            <div className="d-flex align-items-baseline gap-2">
                                <span className="fw-extrabold text-dark" style={{ fontSize: '1.2rem' }}>Rp 361.650.000</span>
                                <span className="badge bg-success-subtle text-success p-1" style={{ fontSize: '0.65rem' }}>↑ 18.2%</span>
                            </div>
                            <span className="text-muted" style={{ fontSize: '0.68rem' }}>vs last 30 days (Rp 305.980.000)</span>
                        </div>

                        {/* Chart SVG Graphic */}
                        <div className="w-100 my-2" style={{ height: '90px' }}>
                            <svg viewBox="0 0 300 60" className="w-100 h-100">
                                <path d="M0,50 Q50,20 100,35 T200,10 T300,5" fill="none" stroke="#6366f1" strokeWidth="2.5" />
                            </svg>
                        </div>

                        {/* Top Performing Promo Box */}
                        <div className="bg-light rounded-3 p-2 border d-flex align-items-center justify-content-between" style={{ fontSize: '0.78rem' }}>
                            <div>
                                <span className="text-muted d-block" style={{ fontSize: '0.68rem' }}>Top Performing Promo</span>
                                <span className="fw-bold text-dark">Flash Sale 7.7</span>
                            </div>
                            <div className="text-end">
                                <div className="fw-bold text-primary">Rp 125.450.000</div>
                                <div className="text-muted" style={{ fontSize: '0.68rem' }}>34.7% of total promo revenue</div>
                            </div>
                        </div>
                    </Card>

                    {/* Promo Templates */}
                    <Card className="border-0 shadow-sm rounded-4 p-3 bg-white mb-3">
                        <div className="d-flex align-items-center justify-content-between border-bottom pb-2 mb-2">
                            <h6 className="fw-bold text-dark mb-0" style={{ fontSize: '0.95rem' }}>Promo Templates</h6>
                            <span className="text-primary small cursor-pointer">Lihat semua</span>
                        </div>

                        <div className="d-flex flex-column gap-2">
                            <div className="d-flex align-items-center justify-content-between p-2 rounded-3 border bg-light-subtle cursor-pointer hover-bg-light" style={{ fontSize: '0.78rem' }}>
                                <div className="d-flex align-items-center gap-2">
                                    <div className="avatar avatar-xs rounded-circle bg-success text-white d-flex align-items-center justify-content-center">%</div>
                                    <div>
                                        <div className="fw-bold text-dark">Diskon Persentase</div>
                                        <div className="text-muted" style={{ fontSize: '0.68rem' }}>Buat promo diskon dalam persentase</div>
                                    </div>
                                </div>
                                <i className="bx bx-plus fs-5 text-primary"></i>
                            </div>

                            <div className="d-flex align-items-center justify-content-between p-2 rounded-3 border bg-light-subtle cursor-pointer hover-bg-light" style={{ fontSize: '0.78rem' }}>
                                <div className="d-flex align-items-center gap-2">
                                    <div className="avatar avatar-xs rounded-circle bg-warning text-white d-flex align-items-center justify-content-center">Rp</div>
                                    <div>
                                        <div className="fw-bold text-dark">Diskon Nominal</div>
                                        <div className="text-muted" style={{ fontSize: '0.68rem' }}>Buat promo diskon dalam nominal tertentu</div>
                                    </div>
                                </div>
                                <i className="bx bx-plus fs-5 text-primary"></i>
                            </div>
                        </div>
                    </Card>

                    {/* Tips Promo */}
                    <Card className="border-0 shadow-sm rounded-4 p-3 bg-primary-subtle text-primary border-primary">
                        <h6 className="fw-bold mb-1" style={{ fontSize: '0.88rem' }}>Tips Promo</h6>
                        <p className="small mb-0" style={{ fontSize: '0.75rem' }}>Gunakan kombinasi promo yang berbeda untuk meningkatkan konversi penjualan tiket event Anda.</p>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default PromotionsPage;
