/**
 * EO Orders Management Page - PDF Page 4 High Fidelity Implementation
 */

import React, { useState } from 'react';
import { Card, Row, Col, Table, Form, Button } from 'react-bootstrap';

const TicketOrderPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'all' | 'paid' | 'pending' | 'failed' | 'cancelled' | 'refunded'>('all');
    const [selectedOrder, setSelectedOrder] = useState<any>({
        order_id: "#VTX-001248",
        status: "Paid",
        order_date: "18 May 2026, 14:32",
        payment_time: "18 May 2026, 14:33",
        customer_name: "Dinda Kharisma",
        customer_email: "dinda.k@email.com",
        customer_phone: "+62 812-3456-7890",
        event_name: "Summer Music Festival 2026",
        event_date: "20 Dec 2026",
        event_venue: "ICE BSD City, Tangerang",
        event_image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=150&auto=format&fit=crop&q=80",
        tickets: "2 x VIP Pass",
        items_subtotal: "Rp 700.000",
        admin_fee: "Rp 10.000",
        total_paid: "Rp 710.000",
        payment_method: "Midtrans",
        transaction_id: "SNAP-20260518-143312"
    });

    const ordersList = [
        {
            id: "#VTX-001248",
            customer: "Dinda Kharisma",
            email: "dinda.k@email.com",
            event: "Summer Music Festival 2026",
            date: "20 Dec 2026 • ICE BSD City",
            tickets: "2 x VIP Pass",
            amount: "Rp 700.000",
            method: "Midtrans",
            status: "Paid",
            order_date: "18 May 2026 14:32"
        },
        {
            id: "#VTX-001247",
            customer: "Rizky Pratama",
            email: "rizky.p@email.com",
            event: "Summer Music Festival 2026",
            date: "20 Dec 2026 • ICE BSD City",
            tickets: "1 x Regular Pass",
            amount: "Rp 175.000",
            method: "QRIS",
            status: "Paid",
            order_date: "18 May 2026 14:21"
        },
        {
            id: "#VTX-001246",
            customer: "Sarah Wijaya",
            email: "sarah.w@email.com",
            event: "Tech Summit Indonesia 2026",
            date: "07 Jun 2026 • ICE BSD City",
            tickets: "3 x Early Bird",
            amount: "Rp 375.000",
            method: "VA BCA",
            status: "Pending",
            order_date: "18 May 2026 14:15"
        },
        {
            id: "#VTX-001245",
            customer: "Andi Setiawan",
            email: "andi.s@email.com",
            event: "Art & Culture Expo",
            date: "21 Jun 2026 • Taman Ismail Marzuki",
            tickets: "2 x Regular Pass",
            amount: "Rp 350.000",
            method: "Credit Card",
            status: "Paid",
            order_date: "18 May 2026 13:48"
        },
        {
            id: "#VTX-001244",
            customer: "Maya Febriani",
            email: "maya.f@email.com",
            event: "Summer Music Festival 2026",
            date: "20 Dec 2026 • ICE BSD City",
            tickets: "1 x VIP Pass",
            amount: "Rp 350.000",
            method: "E-Wallet",
            status: "Failed",
            order_date: "18 May 2026 13:30"
        },
        {
            id: "#VTX-001243",
            customer: "Fajar Ramadhan",
            email: "fajar.r@email.com",
            event: "Tech Summit Indonesia 2026",
            date: "07 Jun 2026 • ICE BSD City",
            tickets: "1 x Regular Pass",
            amount: "Rp 175.000",
            method: "VA Mandiri",
            status: "Refunded",
            order_date: "18 May 2026 12:58"
        }
    ];

    return (
        <div className="py-3 px-1">
            {/* HEADER */}
            <div className="mb-3">
                <h4 className="fw-extrabold text-dark mb-1" style={{ fontSize: '1.45rem' }}>Orders</h4>
                <p className="text-muted small mb-0">Kelola semua pesanan tiket dan pantau status pembayaran pelanggan.</p>
            </div>

            {/* 5 METRICS CARDS */}
            <Row className="g-3 mb-4">
                <Col xl={2.4} lg={4} md={6}>
                    <Card className="border-0 shadow-sm rounded-4 p-2 bg-white">
                        <Card.Body className="p-2">
                            <span className="text-muted small fw-semibold uppercase" style={{ fontSize: '0.72rem' }}>Total Orders</span>
                            <h4 className="fw-extrabold text-dark mt-1 mb-1" style={{ fontSize: '1.3rem' }}>1.248</h4>
                            <span className="badge bg-success-subtle text-success p-1" style={{ fontSize: '0.68rem' }}>↑ 18.2% vs last 30 days</span>
                        </Card.Body>
                    </Card>
                </Col>

                <Col xl={2.4} lg={4} md={6}>
                    <Card className="border-0 shadow-sm rounded-4 p-2 bg-white">
                        <Card.Body className="p-2">
                            <span className="text-muted small fw-semibold uppercase" style={{ fontSize: '0.72rem' }}>Total Revenue</span>
                            <h4 className="fw-extrabold text-dark mt-1 mb-1" style={{ fontSize: '1.3rem' }}>Rp 361.650.000</h4>
                            <span className="badge bg-success-subtle text-success p-1" style={{ fontSize: '0.68rem' }}>↑ 16.7% vs last 30 days</span>
                        </Card.Body>
                    </Card>
                </Col>

                <Col xl={2.4} lg={4} md={6}>
                    <Card className="border-0 shadow-sm rounded-4 p-2 bg-white">
                        <Card.Body className="p-2">
                            <span className="text-muted small fw-semibold uppercase" style={{ fontSize: '0.72rem' }}>Paid Orders</span>
                            <h4 className="fw-extrabold text-dark mt-1 mb-1" style={{ fontSize: '1.3rem' }}>1.102</h4>
                            <span className="text-muted" style={{ fontSize: '0.68rem' }}><span className="text-success fw-bold">88.3%</span> dari total orders</span>
                        </Card.Body>
                    </Card>
                </Col>

                <Col xl={2.4} lg={4} md={6}>
                    <Card className="border-0 shadow-sm rounded-4 p-2 bg-white">
                        <Card.Body className="p-2">
                            <span className="text-muted small fw-semibold uppercase" style={{ fontSize: '0.72rem' }}>Refunded Orders</span>
                            <h4 className="fw-extrabold text-dark mt-1 mb-1" style={{ fontSize: '1.3rem' }}>26</h4>
                            <span className="text-muted" style={{ fontSize: '0.68rem' }}><span className="text-danger fw-bold">2.1%</span> dari total orders</span>
                        </Card.Body>
                    </Card>
                </Col>

                <Col xl={2.4} lg={4} md={6}>
                    <Card className="border-0 shadow-sm rounded-4 p-2 bg-white">
                        <Card.Body className="p-2">
                            <span className="text-muted small fw-semibold uppercase" style={{ fontSize: '0.72rem' }}>Pending Orders</span>
                            <h4 className="fw-extrabold text-dark mt-1 mb-1" style={{ fontSize: '1.3rem' }}>120</h4>
                            <span className="text-muted" style={{ fontSize: '0.68rem' }}><span className="text-warning fw-bold">9.6%</span> dari total orders</span>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Row className="g-4">
                {/* Main Table Area */}
                <Col xl={selectedOrder ? 8 : 12}>
                    <Card className="border-0 shadow-sm rounded-4 p-3 bg-white">
                        <div className="d-flex align-items-center justify-content-between pb-3 mb-3 border-bottom">
                            <h6 className="fw-bold text-dark mb-0" style={{ fontSize: '1.05rem' }}>Orders List</h6>
                            <div className="d-flex align-items-center gap-2">
                                <div className="position-relative" style={{ width: '200px' }}>
                                    <i className="bx bx-search position-absolute top-50 start-0 translate-middle-y ms-2.5 text-muted" style={{ fontSize: '0.9rem' }}></i>
                                    <input type="text" className="form-control form-control-sm ps-4 bg-light border-0" placeholder="Search order ID, customer..." style={{ fontSize: '0.8rem', borderRadius: '6px' }} />
                                </div>
                                <button className="btn btn-sm btn-light border text-secondary px-2.5 py-1 d-flex align-items-center gap-1" style={{ fontSize: '0.8rem', borderRadius: '6px' }}><i className="bx bx-filter fs-6"></i> Filter</button>
                                <button className="btn btn-sm btn-light border text-secondary px-2.5 py-1 d-flex align-items-center gap-1" style={{ fontSize: '0.8rem', borderRadius: '6px' }}><i className="bx bx-export fs-6"></i> Export</button>
                            </div>
                        </div>

                        {/* Clean Underline Tabs */}
                        <div className="d-flex align-items-center gap-4 mb-3 border-bottom overflow-x-auto" style={{ fontSize: '0.875rem' }}>
                            {[
                                { id: 'all', label: 'All Orders' },
                                { id: 'paid', label: 'Paid' },
                                { id: 'pending', label: 'Pending' },
                                { id: 'failed', label: 'Failed' },
                                { id: 'cancelled', label: 'Cancelled' },
                                { id: 'refunded', label: 'Refunded' }
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
                            <Table hover className="align-middle mb-0" style={{ fontSize: '0.82rem' }}>
                                <thead className="bg-light text-muted uppercase">
                                    <tr>
                                        <th>Order ID</th>
                                        <th>Customer</th>
                                        <th>Event</th>
                                        <th>Tickets</th>
                                        <th>Amount</th>
                                        <th>Payment</th>
                                        <th>Status</th>
                                        <th>Order Date</th>
                                        <th className="text-end">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {ordersList
                                        .filter(ord => activeTab === 'all' || ord.status.toLowerCase() === activeTab)
                                        .map((ord) => (
                                            <tr key={ord.id} className="cursor-pointer" onClick={() => setSelectedOrder({
                                                order_id: ord.id,
                                                status: ord.status,
                                                order_date: ord.order_date,
                                                payment_time: ord.order_date,
                                                customer_name: ord.customer,
                                                customer_email: ord.email,
                                                customer_phone: "+62 812-3456-7890",
                                                event_name: ord.event,
                                                event_date: "20 Dec 2026",
                                                event_venue: "ICE BSD City",
                                                event_image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=150&auto=format&fit=crop&q=80",
                                                tickets: ord.tickets,
                                                items_subtotal: ord.amount,
                                                admin_fee: "Rp 10.000",
                                                total_paid: ord.amount,
                                                payment_method: ord.method,
                                                transaction_id: "SNAP-20260518"
                                            })}>
                                                <td className="fw-bold text-primary">{ord.id}</td>
                                                <td>
                                                    <div className="fw-bold text-dark">{ord.customer}</div>
                                                    <div className="text-muted" style={{ fontSize: '0.7rem' }}>{ord.email}</div>
                                                </td>
                                                <td>
                                                    <div className="fw-semibold text-dark">{ord.event}</div>
                                                    <div className="text-muted" style={{ fontSize: '0.7rem' }}>{ord.date}</div>
                                                </td>
                                                <td className="fw-semibold">{ord.tickets}</td>
                                                <td className="fw-bold text-dark">{ord.amount}</td>
                                                <td className="text-muted">{ord.method}</td>
                                                <td>
                                                    <span className={`badge ${ord.status === 'Paid' ? 'badge-published' : ord.status === 'Pending' ? 'badge-draft' : ord.status === 'Refunded' ? 'badge-purple' : 'badge-danger'}`}>
                                                        {ord.status}
                                                    </span>
                                                </td>
                                                <td className="text-muted" style={{ fontSize: '0.75rem' }}>{ord.order_date}</td>
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

                {/* Right Side: Order Details Drawer */}
                {selectedOrder && (
                    <Col xl={4}>
                        <Card className="border-0 shadow-sm rounded-4 p-3 bg-white">
                            <div className="d-flex align-items-center justify-content-between border-bottom pb-2 mb-3">
                                <h6 className="fw-bold text-dark mb-0" style={{ fontSize: '1rem' }}>Order Details</h6>
                                <button className="btn btn-sm btn-icon text-muted p-0" onClick={() => setSelectedOrder(null)}><i className="bx bx-x fs-4"></i></button>
                            </div>

                            <div className="d-flex align-items-center justify-content-between bg-light p-2 rounded-3 mb-3">
                                <div>
                                    <div className="text-muted small" style={{ fontSize: '0.72rem' }}>Order ID</div>
                                    <div className="fw-extrabold text-primary" style={{ fontSize: '1.05rem' }}>{selectedOrder.order_id}</div>
                                </div>
                                <span className={`badge ${selectedOrder.status === 'Paid' ? 'badge-published' : 'badge-draft'}`} style={{ fontSize: '0.8rem' }}>
                                    {selectedOrder.status}
                                </span>
                            </div>

                            <div className="mb-3">
                                <div className="text-muted small fw-semibold uppercase mb-1" style={{ fontSize: '0.7rem' }}>Customer</div>
                                <div className="d-flex align-items-center gap-2">
                                    <div className="avatar avatar-sm rounded-circle bg-primary text-white d-flex align-items-center justify-content-center fw-bold">
                                        {selectedOrder.customer_name.charAt(0)}
                                    </div>
                                    <div>
                                        <div className="fw-bold text-dark" style={{ fontSize: '0.85rem' }}>{selectedOrder.customer_name}</div>
                                        <div className="text-muted" style={{ fontSize: '0.72rem' }}>{selectedOrder.customer_email}</div>
                                        <div className="text-muted" style={{ fontSize: '0.72rem' }}>{selectedOrder.customer_phone}</div>
                                    </div>
                                </div>
                            </div>

                            <div className="mb-3 border-top pt-2">
                                <div className="text-muted small fw-semibold uppercase mb-1" style={{ fontSize: '0.7rem' }}>Event</div>
                                <div className="d-flex align-items-center gap-2 bg-light p-2 rounded-3">
                                    <img src={selectedOrder.event_image} alt={selectedOrder.event_name} className="rounded-2 object-fit-cover" style={{ width: '42px', height: '42px' }} />
                                    <div>
                                        <div className="fw-bold text-dark" style={{ fontSize: '0.8rem' }}>{selectedOrder.event_name}</div>
                                        <div className="text-muted" style={{ fontSize: '0.7rem' }}>{selectedOrder.event_date} • {selectedOrder.event_venue}</div>
                                    </div>
                                </div>
                            </div>

                            <div className="mb-3 border-top pt-2">
                                <div className="text-muted small fw-semibold uppercase mb-1" style={{ fontSize: '0.7rem' }}>Order Items</div>
                                <div className="d-flex justify-content-between align-items-center mb-1" style={{ fontSize: '0.8rem' }}>
                                    <span>{selectedOrder.tickets}</span>
                                    <span className="fw-bold text-dark">{selectedOrder.items_subtotal}</span>
                                </div>
                                <div className="d-flex justify-content-between align-items-center mb-1 text-muted" style={{ fontSize: '0.75rem' }}>
                                    <span>Admin Fee</span>
                                    <span>{selectedOrder.admin_fee}</span>
                                </div>
                                <div className="d-flex justify-content-between align-items-center pt-2 border-top fw-bold text-dark" style={{ fontSize: '0.95rem' }}>
                                    <span>Total Paid</span>
                                    <span className="text-primary">{selectedOrder.total_paid}</span>
                                </div>
                            </div>

                            <div className="mb-3 border-top pt-2">
                                <div className="text-muted small fw-semibold uppercase mb-1" style={{ fontSize: '0.7rem' }}>Payment Information</div>
                                <div className="bg-light p-2 rounded-3 text-muted" style={{ fontSize: '0.75rem' }}>
                                    <div className="d-flex justify-content-between mb-1">
                                        <span>Method</span>
                                        <span className="fw-bold text-dark">{selectedOrder.payment_method}</span>
                                    </div>
                                    <div className="d-flex justify-content-between mb-1">
                                        <span>Transaction ID</span>
                                        <span className="font-monospace text-dark">{selectedOrder.transaction_id}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="d-flex flex-column gap-2 border-top pt-3">
                                <button className="btn btn-sm btn-outline-primary w-100 d-flex align-items-center justify-content-center gap-1"><i className="bx bx-download fs-5"></i> Download Invoice</button>
                                <button className="btn btn-sm btn-light border w-100 d-flex align-items-center justify-content-center gap-1 text-muted"><i className="bx bx-paper-plane fs-5"></i> Resend E-Ticket</button>
                                <button className="btn btn-sm btn-light border text-danger w-100 d-flex align-items-center justify-content-center gap-1"><i className="bx bx-undo fs-5"></i> Refund Order</button>
                            </div>
                        </Card>
                    </Col>
                )}
            </Row>
        </div>
    );
};

export default TicketOrderPage;
