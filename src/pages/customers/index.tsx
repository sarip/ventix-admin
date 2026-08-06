/**
 * EO Customers Page - PDF Page 5 High Fidelity Implementation
 */

import React, { useState } from 'react';
import { Card, Row, Col, Table, Button, Form, Badge } from 'react-bootstrap';

const CustomersPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'all' | 'top' | 'new' | 'repeat'>('all');
    const [selectedCustomer, setSelectedCustomer] = useState<any>({
        id: 1,
        name: "Dinda Kharisma",
        email: "dinda.k@email.com",
        phone: "+62 812-3456-7890",
        address: "Tangerang, Banten",
        member_since: "12 Feb 2026",
        badge: "VIP Customer",
        total_orders: 8,
        total_spent: "Rp 3.450.000",
        events_count: 4,
        status: "Active"
    });

    const customerList = [
        {
            id: 1,
            name: "Dinda Kharisma",
            email: "dinda.k@email.com",
            phone: "+62 812-3456-7890",
            total_orders: 8,
            total_spent: "Rp 3.450.000",
            last_order: "18 May 2026 14:32",
            status: "Active",
            badge: "VIP",
            color: "#6366f1"
        },
        {
            id: 2,
            name: "Rizky Pratama",
            email: "rizky.p@email.com",
            phone: "+62 812-9988-7766",
            total_orders: 5,
            total_spent: "Rp 2.175.000",
            last_order: "18 May 2026 14:21",
            status: "Active",
            color: "#ec4899"
        },
        {
            id: 3,
            name: "Sarah Wijaya",
            email: "sarah.w@email.com",
            phone: "+62 812-1122-3344",
            total_orders: 12,
            total_spent: "Rp 5.780.000",
            last_order: "18 May 2026 14:15",
            status: "Active",
            badge: "VIP",
            color: "#3b82f6"
        },
        {
            id: 4,
            name: "Andi Setiawan",
            email: "andi.s@email.com",
            phone: "+62 822-5566-7788",
            total_orders: 3,
            total_spent: "Rp 1.050.000",
            last_order: "18 May 2026 13:48",
            status: "Active",
            color: "#10b981"
        },
        {
            id: 5,
            name: "Maya Febriani",
            email: "maya.f@email.com",
            phone: "+62 813-6677-8899",
            total_orders: 2,
            total_spent: "Rp 700.000",
            last_order: "18 May 2026 13:30",
            status: "Active",
            color: "#f59e0b"
        },
        {
            id: 6,
            name: "Fajar Ramadhan",
            email: "fajar.r@email.com",
            phone: "+62 812-7788-9900",
            total_orders: 6,
            total_spent: "Rp 2.625.000",
            last_order: "18 May 2026 12:58",
            status: "Active",
            color: "#14b8a6"
        }
    ];

    return (
        <div className="py-3 px-1">
            {/* HEADER */}
            <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 mb-3">
                <div>
                    <h4 className="fw-extrabold text-dark mb-1" style={{ fontSize: '1.45rem' }}>Customers</h4>
                    <p className="text-muted small mb-0">Kelola data pelanggan dan lihat aktivitas pembelian mereka.</p>
                </div>
                <Button variant="primary" size="sm" className="rounded-pill px-3 py-2">
                    <i className="bx bx-import me-1"></i> Import Customers
                </Button>
            </div>

            {/* 5 METRIC CARDS */}
            <Row className="g-3 mb-4">
                <Col xl={2.4} lg={4} md={6}>
                    <Card className="border-0 shadow-sm rounded-4 p-2 bg-white">
                        <Card.Body className="d-flex align-items-center justify-content-between p-2">
                            <div>
                                <span className="text-muted small fw-semibold uppercase" style={{ fontSize: '0.72rem' }}>Total Customers</span>
                                <h4 className="fw-extrabold text-dark mt-1 mb-1" style={{ fontSize: '1.35rem' }}>8.742</h4>
                                <span className="badge bg-success-subtle text-success p-1" style={{ fontSize: '0.68rem' }}>↑ 12.5% vs last 30 days</span>
                            </div>
                            <div className="metric-icon-box rounded-4 bg-primary-subtle text-primary">
                                <i className="bx bx-group fs-3"></i>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>

                <Col xl={2.4} lg={4} md={6}>
                    <Card className="border-0 shadow-sm rounded-4 p-2 bg-white">
                        <Card.Body className="d-flex align-items-center justify-content-between p-2">
                            <div>
                                <span className="text-muted small fw-semibold uppercase" style={{ fontSize: '0.72rem' }}>New Customers</span>
                                <h4 className="fw-extrabold text-dark mt-1 mb-1" style={{ fontSize: '1.35rem' }}>1.245</h4>
                                <span className="badge bg-success-subtle text-success p-1" style={{ fontSize: '0.68rem' }}>↑ 18.7% vs last 30 days</span>
                            </div>
                            <div className="metric-icon-box rounded-4 bg-success-subtle text-success">
                                <i className="bx bx-user-plus fs-3"></i>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>

                <Col xl={2.4} lg={4} md={6}>
                    <Card className="border-0 shadow-sm rounded-4 p-2 bg-white">
                        <Card.Body className="d-flex align-items-center justify-content-between p-2">
                            <div>
                                <span className="text-muted small fw-semibold uppercase" style={{ fontSize: '0.72rem' }}>Repeat Customers</span>
                                <h4 className="fw-extrabold text-dark mt-1 mb-1" style={{ fontSize: '1.35rem' }}>2.340</h4>
                                <span className="badge bg-success-subtle text-success p-1" style={{ fontSize: '0.68rem' }}>↑ 9.3% vs last 30 days</span>
                            </div>
                            <div className="metric-icon-box rounded-4 bg-info-subtle text-info">
                                <i className="bx bx-refresh fs-3"></i>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>

                <Col xl={2.4} lg={4} md={6}>
                    <Card className="border-0 shadow-sm rounded-4 p-2 bg-white">
                        <Card.Body className="d-flex align-items-center justify-content-between p-2">
                            <div>
                                <span className="text-muted small fw-semibold uppercase" style={{ fontSize: '0.72rem' }}>Total Orders</span>
                                <h4 className="fw-extrabold text-dark mt-1 mb-1" style={{ fontSize: '1.35rem' }}>12.568</h4>
                                <span className="badge bg-success-subtle text-success p-1" style={{ fontSize: '0.68rem' }}>↑ 14.2% vs last 30 days</span>
                            </div>
                            <div className="metric-icon-box rounded-4" style={{ backgroundColor: 'rgba(245, 158, 11, 0.12)', color: '#f59e0b' }}>
                                <i className="bx bx-shopping-bag fs-3"></i>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>

                <Col xl={2.4} lg={4} md={6}>
                    <Card className="border-0 shadow-sm rounded-4 p-2 bg-white">
                        <Card.Body className="d-flex align-items-center justify-content-between p-2">
                            <div>
                                <span className="text-muted small fw-semibold uppercase" style={{ fontSize: '0.72rem' }}>Total Spent</span>
                                <h4 className="fw-extrabold text-dark mt-1 mb-1" style={{ fontSize: '1.15rem' }}>Rp 1.245M</h4>
                                <span className="badge bg-success-subtle text-success p-1" style={{ fontSize: '0.68rem' }}>↑ 16.8% vs last 30 days</span>
                            </div>
                            <div className="metric-icon-box rounded-4" style={{ backgroundColor: 'rgba(236, 72, 153, 0.12)', color: '#ec4899' }}>
                                <i className="bx bx-credit-card fs-3"></i>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Row className="g-4">
                {/* Main Customer Table */}
                <Col xl={selectedCustomer ? 8 : 12}>
                    <Card className="border-0 shadow-sm rounded-4 p-3 bg-white">
                        <div className="d-flex align-items-center justify-content-between pb-3 mb-3 border-bottom">
                            <h6 className="fw-bold text-dark mb-0" style={{ fontSize: '1.05rem' }}>Customer List</h6>
                            <div className="d-flex align-items-center gap-2">
                                <div className="position-relative" style={{ width: '200px' }}>
                                    <i className="bx bx-search position-absolute top-50 start-0 translate-middle-y ms-2.5 text-muted" style={{ fontSize: '0.9rem' }}></i>
                                    <input type="text" className="form-control form-control-sm ps-4 bg-light border-0" placeholder="Search name, email, phone..." style={{ fontSize: '0.8rem', borderRadius: '6px' }} />
                                </div>
                                <button className="btn btn-sm btn-light border text-secondary px-2.5 py-1 d-flex align-items-center gap-1" style={{ fontSize: '0.8rem', borderRadius: '6px' }}><i className="bx bx-filter fs-6"></i> Filter</button>
                                <button className="btn btn-sm btn-light border text-secondary px-2.5 py-1 d-flex align-items-center gap-1" style={{ fontSize: '0.8rem', borderRadius: '6px' }}><i className="bx bx-export fs-6"></i> Export</button>
                            </div>
                        </div>

                        {/* Clean Underline Tabs */}
                        <div className="d-flex align-items-center gap-4 mb-3 border-bottom overflow-x-auto" style={{ fontSize: '0.875rem' }}>
                            {[
                                { id: 'all', label: 'All Customers' },
                                { id: 'top', label: 'Top Customers' },
                                { id: 'new', label: 'New Customers' },
                                { id: 'repeat', label: 'Repeat Customers' }
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

                        <div className="table-responsive">
                            <Table hover className="align-middle mb-0" style={{ fontSize: '0.84rem' }}>
                                <thead className="bg-light text-muted uppercase">
                                    <tr>
                                        <th>Customer</th>
                                        <th>Contact</th>
                                        <th>Total Orders</th>
                                        <th>Total Spent</th>
                                        <th>Last Order</th>
                                        <th>Status</th>
                                        <th className="text-end">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {customerList.map((c) => (
                                        <tr key={c.id} className="cursor-pointer" onClick={() => setSelectedCustomer({
                                            id: c.id,
                                            name: c.name,
                                            email: c.email,
                                            phone: c.phone,
                                            address: "Tangerang, Banten",
                                            member_since: "12 Feb 2026",
                                            badge: c.badge || "Customer",
                                            total_orders: c.total_orders,
                                            total_spent: c.total_spent,
                                            events_count: 4,
                                            status: c.status
                                        })}>
                                            <td>
                                                <div className="d-flex align-items-center gap-2">
                                                    <div className="avatar avatar-sm rounded-circle text-white d-flex align-items-center justify-content-center fw-bold" style={{ backgroundColor: c.color, width: '36px', height: '36px', fontSize: '0.85rem' }}>
                                                        {c.name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <div className="fw-bold text-dark">{c.name} {c.badge && <span className="badge badge-purple ms-1" style={{ fontSize: '0.65rem' }}>{c.badge}</span>}</div>
                                                        <div className="text-muted" style={{ fontSize: '0.7rem' }}>{c.email}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="text-muted">{c.phone}</td>
                                            <td className="fw-bold text-dark">{c.total_orders}</td>
                                            <td className="fw-bold text-dark">{c.total_spent}</td>
                                            <td className="text-muted" style={{ fontSize: '0.75rem' }}>{c.last_order}</td>
                                            <td><span className="badge badge-published">Active</span></td>
                                            <td className="text-end">
                                                <button className="btn btn-sm btn-icon text-muted hover-text-primary p-1"><i className="bx bx-show fs-5"></i></button>
                                                <button className="btn btn-sm btn-icon text-muted hover-text-primary p-1"><i className="bx bx-dots-horizontal-rounded fs-5"></i></button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </div>
                    </Card>
                </Col>

                {/* Right Side: Customer Details Drawer */}
                {selectedCustomer && (
                    <Col xl={4}>
                        <Card className="border-0 shadow-sm rounded-4 p-3 bg-white">
                            <div className="d-flex align-items-center justify-content-between border-bottom pb-2 mb-3">
                                <h6 className="fw-bold text-dark mb-0" style={{ fontSize: '1rem' }}>Customer Profile</h6>
                                <button className="btn btn-sm btn-icon text-muted p-0" onClick={() => setSelectedCustomer(null)}><i className="bx bx-x fs-4"></i></button>
                            </div>

                            {/* Main Avatar Banner */}
                            <div className="text-center mb-3">
                                <div className="avatar avatar-xl rounded-circle text-white d-inline-flex align-items-center justify-content-center fw-extrabold mb-2" style={{ width: '64px', height: '64px', backgroundColor: '#6366f1', fontSize: '1.4rem' }}>
                                    {selectedCustomer.name.charAt(0)}
                                </div>
                                <h5 className="fw-bold text-dark mb-0">{selectedCustomer.name}</h5>
                                <span className="badge badge-purple my-1">{selectedCustomer.badge}</span>
                                <div className="text-muted" style={{ fontSize: '0.75rem' }}>{selectedCustomer.email}</div>
                                <div className="text-muted" style={{ fontSize: '0.75rem' }}>{selectedCustomer.phone}</div>
                                <div className="text-muted" style={{ fontSize: '0.72rem' }}>Customer since {selectedCustomer.member_since}</div>
                            </div>

                            {/* Summary Metrics */}
                            <Row className="g-2 text-center mb-3">
                                <Col xs={4}>
                                    <div className="bg-light p-2 rounded-3">
                                        <div className="fw-extrabold fs-5 text-dark">{selectedCustomer.total_orders}</div>
                                        <div className="text-muted" style={{ fontSize: '0.68rem' }}>Total Orders</div>
                                    </div>
                                </Col>
                                <Col xs={4}>
                                    <div className="bg-light p-2 rounded-3">
                                        <div className="fw-extrabold text-primary" style={{ fontSize: '0.85rem' }}>{selectedCustomer.total_spent}</div>
                                        <div className="text-muted" style={{ fontSize: '0.68rem' }}>Total Spent</div>
                                    </div>
                                </Col>
                                <Col xs={4}>
                                    <div className="bg-light p-2 rounded-3">
                                        <div className="fw-extrabold fs-5 text-dark">{selectedCustomer.events_count}</div>
                                        <div className="text-muted" style={{ fontSize: '0.68rem' }}>Events</div>
                                    </div>
                                </Col>
                            </Row>

                            {/* Customer Activity Line Graph */}
                            <div className="mb-3 border-top pt-2">
                                <div className="d-flex align-items-center justify-content-between mb-2">
                                    <span className="fw-bold text-dark small">Customer Activity</span>
                                    <span className="text-muted" style={{ fontSize: '0.7rem' }}>Last 6 Months</span>
                                </div>
                                <div style={{ height: '70px' }}>
                                    <svg viewBox="0 0 300 60" className="w-100 h-100">
                                        <path d="M0,45 Q50,10 100,35 T200,15 T300,10" fill="none" stroke="#6366f1" strokeWidth="2.5" />
                                    </svg>
                                </div>
                            </div>

                            {/* Top Events Purchased */}
                            <div className="mb-3 border-top pt-2">
                                <span className="fw-bold text-dark small d-block mb-2">Top Events Purchased</span>
                                <div className="d-flex flex-column gap-2">
                                    <div className="d-flex align-items-center justify-content-between p-2 rounded-3 bg-light" style={{ fontSize: '0.78rem' }}>
                                        <div>
                                            <div className="fw-bold text-dark">Summer Music Festival 2026</div>
                                            <div className="text-muted" style={{ fontSize: '0.68rem' }}>20 Dec 2026 • ICE BSD City</div>
                                        </div>
                                        <div className="text-end">
                                            <div className="fw-bold text-primary">Rp 1.050.000</div>
                                            <div className="text-muted" style={{ fontSize: '0.68rem' }}>3 Orders</div>
                                        </div>
                                    </div>
                                    <div className="d-flex align-items-center justify-content-between p-2 rounded-3 bg-light" style={{ fontSize: '0.78rem' }}>
                                        <div>
                                            <div className="fw-bold text-dark">Tech Summit Indonesia 2026</div>
                                            <div className="text-muted" style={{ fontSize: '0.68rem' }}>07 Jun 2026 • ICE BSD City</div>
                                        </div>
                                        <div className="text-end">
                                            <div className="fw-bold text-primary">Rp 875.000</div>
                                            <div className="text-muted" style={{ fontSize: '0.68rem' }}>2 Orders</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="d-flex gap-2 border-top pt-3">
                                <button className="btn btn-sm btn-outline-primary flex-grow-1"><i className="bx bx-plus me-1"></i> Add Note</button>
                                <button className="btn btn-sm btn-outline-primary flex-grow-1"><i className="bx bx-envelope me-1"></i> Email</button>
                                <button className="btn btn-sm btn-outline-danger"><i className="bx bx-block"></i> Block</button>
                            </div>
                        </Card>
                    </Col>
                )}
            </Row>
        </div>
    );
};

export default CustomersPage;
