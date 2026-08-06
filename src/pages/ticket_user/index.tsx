/**
 * EO Tickets Management Page - PDF Page 3 High Fidelity Implementation
 */

import React, { useState } from 'react';
import { Card, Row, Col, Table, Form, Button, ProgressBar } from 'react-bootstrap';

const TicketUserPage: React.FC = () => {
    const [subTab, setSubTab] = useState<'tickets' | 'promo' | 'bundling'>('tickets');

    const ticketList = [
        {
            id: 1,
            name: "VIP Pass",
            description: "Akses penuh ke semua area dan benefit eksklusif.",
            price: "Rp 350.000",
            quota: 500,
            sold: 420,
            progress: 84,
            status: true,
            color: "#7c3aed",
            badge: "VIP PASS"
        },
        {
            id: 2,
            name: "Regular Pass",
            description: "Akses ke area festival standar.",
            price: "Rp 175.000",
            quota: 1000,
            sold: 920,
            progress: 92,
            status: true,
            color: "#3b82f6",
            badge: "REGULAR PASS"
        },
        {
            id: 3,
            name: "Early Bird",
            description: "Harga spesial untuk pembelian lebih awal.",
            price: "Rp 125.000",
            quota: 500,
            sold: 450,
            progress: 90,
            status: false,
            color: "#10b981",
            badge: "EARLY BIRD",
            soldOut: true
        },
        {
            id: 4,
            name: "Group Pass (5 Pax)",
            description: "Tiket untuk 5 orang. Lebih hemat!",
            price: "Rp 800.000",
            quota: 250,
            sold: 52,
            progress: 21,
            status: true,
            color: "#f59e0b",
            badge: "GROUP PASS"
        }
    ];

    return (
        <div className="py-3 px-1">
            {/* HEADER */}
            <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 mb-3">
                <div>
                    <h4 className="fw-extrabold text-dark mb-1" style={{ fontSize: '1.45rem' }}>Tickets</h4>
                    <p className="text-muted small mb-0">Kelola jenis tiket, harga, kuota, dan benefit untuk event Anda.</p>
                </div>
                <div className="d-flex align-items-center gap-2">
                    <Button variant="primary" size="sm" className="rounded-pill px-3 py-2">
                        <i className="bx bx-plus me-1"></i> Add Ticket
                    </Button>
                </div>
            </div>

            {/* SUB NAVIGATION TABS */}
            <div className="d-flex gap-2 mb-4 border-bottom pb-2">
                <button
                    className={`btn btn-sm rounded-pill px-3 ${subTab === 'tickets' ? 'btn-primary' : 'btn-light border text-muted'}`}
                    onClick={() => setSubTab('tickets')}
                >
                    <i className="bx bx-ticket me-1"></i> Ticket List
                </button>
                <button
                    className={`btn btn-sm rounded-pill px-3 ${subTab === 'promo' ? 'btn-primary' : 'btn-light border text-muted'}`}
                    onClick={() => setSubTab('promo')}
                >
                    <i className="bx bx-purchase-tag me-1"></i> Promo Codes
                </button>
                <button
                    className={`btn btn-sm rounded-pill px-3 ${subTab === 'bundling' ? 'btn-primary' : 'btn-light border text-muted'}`}
                    onClick={() => setSubTab('bundling')}
                >
                    <i className="bx bx-package me-1"></i> Bundling
                </button>
            </div>

            {/* 4 STATS METRIC CARDS */}
            <Row className="g-3 mb-4">
                <Col xl={3} lg={6} md={6}>
                    <Card className="border-0 shadow-sm rounded-4 p-2 bg-white">
                        <Card.Body className="d-flex align-items-center justify-content-between p-2">
                            <div>
                                <span className="text-muted small fw-semibold text-uppercase" style={{ fontSize: '0.75rem' }}>Total Tickets</span>
                                <h3 className="fw-extrabold text-dark mt-1 mb-0" style={{ fontSize: '1.6rem' }}>4</h3>
                            </div>
                            <div className="metric-icon-box rounded-4 bg-primary-subtle text-primary">
                                <i className="bx bx-layer fs-3"></i>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>

                <Col xl={3} lg={6} md={6}>
                    <Card className="border-0 shadow-sm rounded-4 p-2 bg-white">
                        <Card.Body className="d-flex align-items-center justify-content-between p-2">
                            <div>
                                <span className="text-muted small fw-semibold text-uppercase" style={{ fontSize: '0.75rem' }}>Total Quota</span>
                                <h3 className="fw-extrabold text-dark mt-1 mb-0" style={{ fontSize: '1.6rem' }}>2.250</h3>
                            </div>
                            <div className="metric-icon-box rounded-4" style={{ backgroundColor: 'rgba(168, 85, 247, 0.12)', color: '#7c3aed' }}>
                                <i className="bx bx-group fs-3"></i>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>

                <Col xl={3} lg={6} md={6}>
                    <Card className="border-0 shadow-sm rounded-4 p-2 bg-white">
                        <Card.Body className="d-flex align-items-center justify-content-between p-2">
                            <div>
                                <span className="text-muted small fw-semibold text-uppercase" style={{ fontSize: '0.75rem' }}>Sold</span>
                                <h3 className="fw-extrabold text-dark mt-1 mb-0" style={{ fontSize: '1.6rem' }}>1.842</h3>
                            </div>
                            <div className="metric-icon-box rounded-4 bg-success-subtle text-success">
                                <i className="bx bx-check-circle fs-3"></i>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>

                <Col xl={3} lg={6} md={6}>
                    <Card className="border-0 shadow-sm rounded-4 p-2 bg-white">
                        <Card.Body className="d-flex align-items-center justify-content-between p-2">
                            <div>
                                <span className="text-muted small fw-semibold text-uppercase" style={{ fontSize: '0.75rem' }}>Sales Percentage</span>
                                <h3 className="fw-extrabold text-dark mt-1 mb-0" style={{ fontSize: '1.6rem' }}>82%</h3>
                            </div>
                            <div className="metric-icon-box rounded-4 bg-info-subtle text-info">
                                <i className="bx bx-pie-chart-alt fs-3"></i>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Row className="g-4">
                {/* Left Side: Ticket List Table */}
                <Col xl={7} lg={6}>
                    <Card className="border-0 shadow-sm rounded-4 p-3 bg-white mb-3">
                        <div className="d-flex align-items-center justify-content-between mb-3 border-bottom pb-2">
                            <h6 className="fw-bold text-dark mb-0" style={{ fontSize: '1rem' }}>Daftar Tiket</h6>
                            <div className="d-flex align-items-center gap-2">
                                <Button variant="light" size="sm" className="border text-muted px-2 py-1" style={{ fontSize: '0.78rem' }}>
                                    <i className="bx bx-menu-alt-left me-1"></i> Reorder
                                </Button>
                                <Button variant="light" size="sm" className="border text-muted px-2 py-1" style={{ fontSize: '0.78rem' }}>
                                    Bulk Actions <i className="bx bx-chevron-down ms-1"></i>
                                </Button>
                            </div>
                        </div>

                        <div className="table-responsive">
                            <Table hover className="align-middle mb-0" style={{ fontSize: '0.85rem' }}>
                                <thead className="bg-light text-muted uppercase">
                                    <tr>
                                        <th>Tiket</th>
                                        <th>Harga</th>
                                        <th>Kuota</th>
                                        <th>Terjual</th>
                                        <th>Persentase</th>
                                        <th>Status</th>
                                        <th className="text-end">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {ticketList.map((t) => (
                                        <tr key={t.id}>
                                            <td>
                                                <div className="d-flex align-items-center gap-2">
                                                    <div className="rounded-3 p-2 text-white fw-extrabold text-center d-flex align-items-center justify-content-center" style={{ width: '48px', height: '48px', backgroundColor: t.color, fontSize: '0.65rem' }}>
                                                        {t.badge}
                                                    </div>
                                                    <div>
                                                        <div className="fw-bold text-dark">{t.name}</div>
                                                        <div className="text-muted" style={{ fontSize: '0.72rem' }}>{t.description}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="fw-bold text-dark">{t.price}</td>
                                            <td className="text-muted">{t.quota}</td>
                                            <td className="fw-bold text-dark">{t.sold}</td>
                                            <td>
                                                <div style={{ width: '80px' }}>
                                                    <div className="text-muted mb-1" style={{ fontSize: '0.7rem' }}>{t.progress}%</div>
                                                    <ProgressBar now={t.progress} variant={t.progress > 80 ? "primary" : "warning"} style={{ height: '5px' }} />
                                                </div>
                                            </td>
                                            <td>
                                                {t.soldOut ? (
                                                    <span className="badge bg-secondary-subtle text-muted" style={{ fontSize: '0.7rem' }}>Sold Out</span>
                                                ) : (
                                                    <Form.Check type="switch" checked={t.status} readOnly />
                                                )}
                                            </td>
                                            <td className="text-end">
                                                <div className="d-flex align-items-center justify-content-end gap-1 text-muted">
                                                    <button className="btn btn-sm btn-icon text-muted hover-text-primary p-1"><i className="bx bx-edit fs-5"></i></button>
                                                    <button className="btn btn-sm btn-icon text-muted hover-text-primary p-1"><i className="bx bx-dots-horizontal-rounded fs-5"></i></button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </div>

                        <div className="mt-3">
                            <button className="btn btn-light w-100 border-dashed text-primary fw-bold py-2 rounded-3" style={{ borderStyle: 'dashed', fontSize: '0.85rem' }}>
                                + Add New Ticket
                            </button>
                        </div>
                    </Card>
                </Col>

                {/* Right Side: Ticket Preview Card */}
                <Col xl={5} lg={6}>
                    <Card className="border-0 shadow-sm rounded-4 p-3 bg-white mb-3">
                        <div className="d-flex align-items-center justify-content-between mb-3 border-bottom pb-2">
                            <div>
                                <h6 className="fw-bold text-dark mb-0" style={{ fontSize: '0.95rem' }}>Ticket Preview</h6>
                                <span className="text-muted" style={{ fontSize: '0.72rem' }}>Pratinjau tampilan tiket di halaman event</span>
                            </div>
                            <div className="d-flex align-items-center gap-1 bg-light p-1 rounded-pill">
                                <button className="btn btn-sm py-1 px-2 border-0 bg-white shadow-sm text-primary"><i className="bx bx-laptop"></i></button>
                                <button className="btn btn-sm py-1 px-2 border-0 text-muted"><i className="bx bx-mobile-alt"></i></button>
                            </div>
                        </div>

                        <div className="border rounded-4 p-3 bg-dark text-white mb-3">
                            <div className="position-relative mb-2 rounded-3 overflow-hidden" style={{ height: '140px' }}>
                                <img src="https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500&auto=format&fit=crop&q=80" alt="Event Banner" className="w-100 h-100 object-fit-cover opacity-75" />
                                <div className="position-absolute top-0 end-0 p-2 text-white"><i className="bx bx-share-alt fs-5"></i></div>
                                <div className="position-absolute bottom-0 start-0 p-3">
                                    <span className="badge bg-primary mb-1" style={{ fontSize: '0.65rem' }}>Music Festival</span>
                                    <h5 className="fw-extrabold text-white mb-0" style={{ fontSize: '1.1rem' }}>SUMMER MUSIC FESTIVAL 2026</h5>
                                </div>
                            </div>
                            <div className="d-flex align-items-center gap-3 text-white-50" style={{ fontSize: '0.72rem' }}>
                                <span><i className="bx bx-calendar me-1"></i> 20 Dec 2026</span>
                                <span><i className="bx bx-map me-1"></i> ICE BSD City, Tangerang</span>
                            </div>
                        </div>

                        <div className="d-flex flex-column gap-2 mb-3">
                            <div className="border rounded-3 p-3 bg-light">
                                <div className="d-flex align-items-center justify-content-between mb-2">
                                    <span className="fw-bold text-primary" style={{ fontSize: '0.85rem' }}>⭐ VIP Pass</span>
                                    <span className="fw-extrabold text-dark" style={{ fontSize: '0.9rem' }}>Rp 350.000</span>
                                </div>
                                <ul className="list-unstyled text-muted mb-2 ps-2" style={{ fontSize: '0.72rem', lineHeight: '1.4' }}>
                                    <li>• Akses semua area</li>
                                    <li>• Antrian khusus</li>
                                    <li>• Lounge VIP</li>
                                    <li>• Merchandise eksklusif</li>
                                </ul>
                                <div className="d-flex align-items-center justify-content-between">
                                    <span className="text-muted" style={{ fontSize: '0.7rem' }}>Kuota: 500 | 420 terjual</span>
                                    <button className="btn btn-sm btn-primary py-1 px-3" style={{ fontSize: '0.75rem' }}>Buy Ticket</button>
                                </div>
                            </div>

                            <div className="border rounded-3 p-3 bg-light">
                                <div className="d-flex align-items-center justify-content-between mb-2">
                                    <span className="fw-bold text-dark" style={{ fontSize: '0.85rem' }}>🎟 Regular Pass</span>
                                    <span className="fw-extrabold text-dark" style={{ fontSize: '0.9rem' }}>Rp 175.000</span>
                                </div>
                                <ul className="list-unstyled text-muted mb-2 ps-2" style={{ fontSize: '0.72rem', lineHeight: '1.4' }}>
                                    <li>• Akses area festival</li>
                                    <li>• Panggung utama</li>
                                    <li>• Food court</li>
                                </ul>
                                <div className="d-flex align-items-center justify-content-between">
                                    <span className="text-muted" style={{ fontSize: '0.7rem' }}>Kuota: 1.000 | 920 terjual</span>
                                    <button className="btn btn-sm btn-primary py-1 px-3" style={{ fontSize: '0.75rem' }}>Buy Ticket</button>
                                </div>
                            </div>
                        </div>

                        <div className="bg-light rounded-4 p-3 border">
                            <h6 className="fw-bold text-dark mb-2" style={{ fontSize: '0.85rem' }}>Ringkasan Penjualan</h6>
                            <div className="d-flex align-items-center justify-content-between">
                                <div>
                                    <div className="text-muted" style={{ fontSize: '0.72rem' }}>Total Revenue</div>
                                    <div className="fw-extrabold text-primary" style={{ fontSize: '1.05rem' }}>Rp 361.650.000</div>
                                </div>
                                <div>
                                    <div className="text-muted" style={{ fontSize: '0.72rem' }}>Conversion Rate</div>
                                    <div className="fw-extrabold text-dark" style={{ fontSize: '1.05rem' }}>8,42%</div>
                                </div>
                            </div>
                        </div>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default TicketUserPage;
