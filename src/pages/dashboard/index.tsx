/**
 * EO Dashboard Page - High Fidelity PDF Design Implementation
 */

import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Table, ProgressBar } from 'react-bootstrap';
import APIClient from '@/lib/ApiClient';
import useBlockUI from '@/pages/_components/useBlockUI';
import Link from 'next/link';

interface DashboardData {
    total_revenue?: number;
    tickets_sold?: number;
    total_events?: number;
    visitors_this_month?: number;
    today_tickets_sold?: number;
    today_revenue?: number;
    today_checkins?: number;
    today_new_customers?: number;
    events?: any[];
}

const DashboardPage: React.FC = () => {
    const { blockUI, unblockUI } = useBlockUI();
    const [data, setData] = useState<DashboardData | null>(null);
    const [activeTab, setActiveTab] = useState<'all' | 'published' | 'draft' | 'ongoing' | 'completed'>('all');

    useEffect(() => {
        loadDashboard();
    }, []);

    const loadDashboard = async () => {
        try {
            const response = await APIClient.get('dashboard/facility');
            if (response) {
                setData(response as DashboardData);
            }
        } catch (error) {
            console.log('Using default dashboard metrics');
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(amount);
    };

    // Sample events matching PDF Page 1
    const sampleEvents = [
        {
            id: 1,
            title: "Summer Music Festival 2026",
            location: "Jakarta International Expo",
            date: "24 May 2026",
            tickets_sold: 850,
            tickets_total: 1200,
            revenue: "Rp 85.400.000",
            status: "Published",
            progress: 71,
            image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=150&auto=format&fit=crop&q=80"
        },
        {
            id: 2,
            title: "Tech Summit Indonesia",
            location: "ICE BSD City",
            date: "07 Jun 2026",
            tickets_sold: 230,
            tickets_total: 800,
            revenue: "Rp 23.150.000",
            status: "Published",
            progress: 29,
            image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=150&auto=format&fit=crop&q=80"
        },
        {
            id: 3,
            title: "Art & Culture Expo",
            location: "Taman Ismail Marzuki",
            date: "21 Jun 2026",
            tickets_sold: 120,
            tickets_total: 600,
            revenue: "Rp 12.200.000",
            status: "Draft",
            progress: 20,
            image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=150&auto=format&fit=crop&q=80"
        }
    ];

    const upcomingEvents = [
        {
            title: "Summer Music Festival 2026",
            location: "Jakarta International Expo",
            date_day: "24",
            date_month: "MAY",
            image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=150&auto=format&fit=crop&q=80"
        },
        {
            title: "Tech Summit Indonesia",
            location: "ICE BSD City",
            date_day: "07",
            date_month: "JUN",
            image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=150&auto=format&fit=crop&q=80"
        },
        {
            title: "Art & Culture Expo",
            location: "Taman Ismail Marzuki",
            date_day: "21",
            date_month: "JUN",
            image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=150&auto=format&fit=crop&q=80"
        }
    ];

    return (
        <div className="py-3 px-1">
            {/* GREETING HEADER */}
            <div className="d-flex align-items-center justify-content-between mb-4">
                <div>
                    <h4 className="fw-extrabold text-dark mb-1" style={{ fontSize: '1.45rem', letterSpacing: '-0.3px' }}>
                        Good morning, Admin! 👋
                    </h4>
                    <p className="text-muted small mb-0">Here's what happening with your events today.</p>
                </div>
            </div>

            {/* TOP 4 METRIC CARDS */}
            <Row className="g-3 mb-4">
                {/* Total Revenue */}
                <Col xl={3} lg={6} md={6}>
                    <Card className="border-0 shadow-sm rounded-4 h-100 p-2 bg-white">
                        <Card.Body className="d-flex align-items-center justify-content-between p-2">
                            <div>
                                <span className="text-muted small fw-semibold text-uppercase" style={{ fontSize: '0.75rem', letterSpacing: '0.5px' }}>Total Revenue</span>
                                <h4 className="fw-extrabold text-dark mt-1 mb-2" style={{ fontSize: '1.4rem' }}>
                                    {data?.total_revenue ? formatCurrency(data.total_revenue) : "Rp 125.750.000"}
                                </h4>
                                <span className="badge rounded-pill bg-success-subtle text-success border-0 px-2 py-1" style={{ fontSize: '0.72rem' }}>
                                    <i className="bx bx-up-arrow-alt me-1"></i>12.5% <span className="text-muted fw-normal ms-1">vs last 30 days</span>
                                </span>
                            </div>
                            <div className="metric-icon-box bg-primary-subtle text-primary rounded-4">
                                <i className="bx bx-wallet fs-3"></i>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>

                {/* Tickets Sold */}
                <Col xl={3} lg={6} md={6}>
                    <Card className="border-0 shadow-sm rounded-4 p-2 bg-white">
                        <Card.Body className="d-flex align-items-center justify-content-between p-2">
                            <div>
                                <span className="text-muted small fw-semibold text-uppercase" style={{ fontSize: '0.75rem', letterSpacing: '0.5px' }}>Tickets Sold</span>
                                <h4 className="fw-extrabold text-dark mt-1 mb-2" style={{ fontSize: '1.4rem' }}>
                                    {data?.tickets_sold || "1.250"}
                                </h4>
                                <span className="badge rounded-pill bg-success-subtle text-success border-0 px-2 py-1" style={{ fontSize: '0.72rem' }}>
                                    <i className="bx bx-up-arrow-alt me-1"></i>8.2% <span className="text-muted fw-normal ms-1">vs last 30 days</span>
                                </span>
                            </div>
                            <div className="metric-icon-box rounded-4" style={{ backgroundColor: 'rgba(236, 72, 153, 0.12)', color: '#ec4899' }}>
                                <i className="bx bx-purchase-tag-alt fs-3"></i>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>

                {/* Total Events */}
                <Col xl={3} lg={6} md={6}>
                    <Card className="border-0 shadow-sm rounded-4 p-2 bg-white">
                        <Card.Body className="d-flex align-items-center justify-content-between p-2">
                            <div>
                                <span className="text-muted small fw-semibold text-uppercase" style={{ fontSize: '0.75rem', letterSpacing: '0.5px' }}>Total Events</span>
                                <h4 className="fw-extrabold text-dark mt-1 mb-2" style={{ fontSize: '1.4rem' }}>
                                    {data?.total_events || "12"}
                                </h4>
                                <span className="text-muted small" style={{ fontSize: '0.75rem' }}>Active events</span>
                            </div>
                            <div className="metric-icon-box rounded-4" style={{ backgroundColor: 'rgba(59, 130, 246, 0.12)', color: '#3b82f6' }}>
                                <i className="bx bx-calendar fs-3"></i>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>

                {/* Visitors (This Month) */}
                <Col xl={3} lg={6} md={6}>
                    <Card className="border-0 shadow-sm rounded-4 p-2 bg-white">
                        <Card.Body className="d-flex align-items-center justify-content-between p-2">
                            <div>
                                <span className="text-muted small fw-semibold text-uppercase" style={{ fontSize: '0.75rem', letterSpacing: '0.5px' }}>Visitors (This Month)</span>
                                <h4 className="fw-extrabold text-dark mt-1 mb-2" style={{ fontSize: '1.4rem' }}>
                                    {data?.visitors_this_month || "3.420"}
                                </h4>
                                <span className="badge rounded-pill bg-success-subtle text-success border-0 px-2 py-1" style={{ fontSize: '0.72rem' }}>
                                    <i className="bx bx-up-arrow-alt me-1"></i>15.3% <span className="text-muted fw-normal ms-1">vs last 30 days</span>
                                </span>
                            </div>
                            <div className="metric-icon-box rounded-4" style={{ backgroundColor: 'rgba(20, 184, 166, 0.12)', color: '#14b8a6' }}>
                                <i className="bx bx-group fs-3"></i>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* MIDDLE ROW: Sales Overview & Revenue by Channel & Today's Summary */}
            <Row className="g-3 mb-4">
                {/* Sales Overview Chart Card */}
                <Col xl={5} lg={12}>
                    <Card className="border-0 shadow-sm rounded-4 h-100 p-3 bg-white">
                        <Card.Header className="bg-white border-0 d-flex align-items-center justify-content-between p-0 mb-3">
                            <h6 className="fw-bold text-dark mb-0" style={{ fontSize: '1rem' }}>Sales Overview</h6>
                            <select className="form-select form-select-sm border-0 bg-light text-muted w-auto" style={{ fontSize: '0.8rem', borderRadius: '8px' }}>
                                <option>Last 30 Days</option>
                                <option>This Week</option>
                            </select>
                        </Card.Header>
                        <Card.Body className="p-0 position-relative d-flex flex-column justify-content-between">
                            <div className="position-absolute bg-white shadow-sm border rounded-3 p-2 text-center" style={{ top: '15%', left: '35%', zIndex: 10, minWidth: '110px' }}>
                                <div className="text-muted" style={{ fontSize: '0.68rem' }}>16 May 2026</div>
                                <div className="fw-extrabold text-primary" style={{ fontSize: '0.85rem' }}>Rp 18.750.000</div>
                            </div>
                            <div className="w-100 mt-3" style={{ height: '180px' }}>
                                <svg viewBox="0 0 500 150" className="w-100 h-100" preserveAspectRatio="none">
                                    <defs>
                                        <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="#6366f1" stopOpacity="0.3" />
                                            <stop offset="100%" stopColor="#6366f1" stopOpacity="0.0" />
                                        </linearGradient>
                                    </defs>
                                    <path d="M0,90 Q50,20 100,80 T200,40 T300,10 T400,60 T500,30 L500,150 L0,150 Z" fill="url(#salesGrad)" />
                                    <path d="M0,90 Q50,20 100,80 T200,40 T300,10 T400,60 T500,30" fill="none" stroke="#6366f1" strokeWidth="3" />
                                    <circle cx="180" cy="35" r="5" fill="#6366f1" stroke="#fff" strokeWidth="2" />
                                </svg>
                            </div>
                            <div className="d-flex justify-content-between text-muted small px-1 mt-2" style={{ fontSize: '0.72rem' }}>
                                <span>1 May</span>
                                <span>6 May</span>
                                <span>11 May</span>
                                <span>16 May</span>
                                <span>21 May</span>
                                <span>26 May</span>
                                <span>31 May</span>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>

                {/* Revenue by Channel Donut Card */}
                <Col xl={3} lg={6}>
                    <Card className="border-0 shadow-sm rounded-4 h-100 p-3 bg-white">
                        <Card.Header className="bg-white border-0 p-0 mb-2">
                            <h6 className="fw-bold text-dark mb-0" style={{ fontSize: '1rem' }}>Revenue by Channel</h6>
                        </Card.Header>
                        <Card.Body className="p-0 d-flex flex-column align-items-center justify-content-center">
                            <div className="position-relative d-flex align-items-center justify-content-center my-2" style={{ width: '150px', height: '150px' }}>
                                <svg viewBox="0 0 36 36" className="w-100 h-100">
                                    <path className="circle" strokeDasharray="45, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#6366f1" strokeWidth="4.5" />
                                    <path className="circle" strokeDasharray="30, 100" strokeDashoffset="-45" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#3b82f6" strokeWidth="4.5" />
                                    <path className="circle" strokeDasharray="15, 100" strokeDashoffset="-75" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#f59e0b" strokeWidth="4.5" />
                                    <path className="circle" strokeDasharray="10, 100" strokeDashoffset="-90" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#14b8a6" strokeWidth="4.5" />
                                </svg>
                                <div className="position-absolute text-center">
                                    <div className="fw-extrabold text-dark" style={{ fontSize: '0.95rem' }}>Rp 125.75M</div>
                                    <div className="text-muted" style={{ fontSize: '0.65rem' }}>Total Revenue</div>
                                </div>
                            </div>
                            <div className="w-100 mt-2">
                                <div className="d-flex justify-content-between align-items-center py-1 border-bottom" style={{ fontSize: '0.78rem' }}>
                                    <span className="d-flex align-items-center gap-2"><span className="rounded-circle" style={{ width: '8px', height: '8px', backgroundColor: '#6366f1' }}></span>Website</span>
                                    <span className="fw-bold">45%</span>
                                </div>
                                <div className="d-flex justify-content-between align-items-center py-1 border-bottom" style={{ fontSize: '0.78rem' }}>
                                    <span className="d-flex align-items-center gap-2"><span className="rounded-circle" style={{ width: '8px', height: '8px', backgroundColor: '#3b82f6' }}></span>Mobile App</span>
                                    <span className="fw-bold">30%</span>
                                </div>
                                <div className="d-flex justify-content-between align-items-center py-1 border-bottom" style={{ fontSize: '0.78rem' }}>
                                    <span className="d-flex align-items-center gap-2"><span className="rounded-circle" style={{ width: '8px', height: '8px', backgroundColor: '#f59e0b' }}></span>Partner</span>
                                    <span className="fw-bold">15%</span>
                                </div>
                                <div className="d-flex justify-content-between align-items-center py-1" style={{ fontSize: '0.78rem' }}>
                                    <span className="d-flex align-items-center gap-2"><span className="rounded-circle" style={{ width: '8px', height: '8px', backgroundColor: '#14b8a6' }}></span>Others</span>
                                    <span className="fw-bold">10%</span>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>

                {/* Right Side: Today's Summary & Quick Actions */}
                <Col xl={4} lg={6}>
                    <div className="d-flex flex-column gap-3 h-100">
                        <Card className="border-0 shadow-sm rounded-4 p-3 bg-white">
                            <h6 className="fw-bold text-dark mb-2" style={{ fontSize: '0.95rem' }}>Today's Summary</h6>
                            <Row className="g-2">
                                <Col xs={6}>
                                    <div className="bg-light rounded-3 p-2">
                                        <div className="text-muted" style={{ fontSize: '0.72rem' }}>Tickets Sold Today</div>
                                        <div className="d-flex align-items-baseline gap-2 mt-1">
                                            <span className="fw-extrabold fs-5 text-dark">245</span>
                                            <span className="badge bg-success-subtle text-success p-1" style={{ fontSize: '0.65rem' }}>↑ 18%</span>
                                        </div>
                                    </div>
                                </Col>
                                <Col xs={6}>
                                    <div className="bg-light rounded-3 p-2">
                                        <div className="text-muted" style={{ fontSize: '0.72rem' }}>Revenue Today</div>
                                        <div className="d-flex align-items-baseline gap-2 mt-1">
                                            <span className="fw-extrabold text-dark" style={{ fontSize: '0.95rem' }}>Rp 18.250.000</span>
                                            <span className="badge bg-success-subtle text-success p-1" style={{ fontSize: '0.65rem' }}>↑ 22%</span>
                                        </div>
                                    </div>
                                </Col>
                                <Col xs={6}>
                                    <div className="bg-light rounded-3 p-2">
                                        <div className="text-muted" style={{ fontSize: '0.72rem' }}>Check-ins Today</div>
                                        <div className="d-flex align-items-baseline gap-2 mt-1">
                                            <span className="fw-extrabold fs-5 text-dark">198</span>
                                            <span className="badge bg-success-subtle text-success p-1" style={{ fontSize: '0.65rem' }}>↑ 16%</span>
                                        </div>
                                    </div>
                                </Col>
                                <Col xs={6}>
                                    <div className="bg-light rounded-3 p-2">
                                        <div className="text-muted" style={{ fontSize: '0.72rem' }}>New Customers</div>
                                        <div className="d-flex align-items-baseline gap-2 mt-1">
                                            <span className="fw-extrabold fs-5 text-dark">34</span>
                                            <span className="badge bg-success-subtle text-success p-1" style={{ fontSize: '0.65rem' }}>↑ 12%</span>
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                        </Card>

                        <Card className="border-0 shadow-sm rounded-4 p-3 bg-white flex-grow-1">
                            <h6 className="fw-bold text-dark mb-2" style={{ fontSize: '0.95rem' }}>Quick Actions</h6>
                            <Row className="g-2">
                                <Col xs={6}>
                                    <div className="border rounded-3 p-2 cursor-pointer hover-bg-light transition-all">
                                        <div className="d-flex align-items-center gap-2 mb-1">
                                            <div className="rounded-circle bg-primary-subtle text-primary p-1">
                                                <i className="bx bx-user-plus fs-5"></i>
                                            </div>
                                            <span className="fw-bold text-dark" style={{ fontSize: '0.78rem' }}>Input Tamu / Customer Manual</span>
                                        </div>
                                        <p className="text-muted mb-0" style={{ fontSize: '0.68rem' }}>Tambah tamu yang book manual / offline</p>
                                    </div>
                                </Col>
                                <Col xs={6}>
                                    <Link href="/ticket_event" className="text-decoration-none">
                                        <div className="border rounded-3 p-2 cursor-pointer hover-bg-light transition-all h-100">
                                            <div className="d-flex align-items-center gap-2 mb-1">
                                                <div className="rounded-circle bg-success-subtle text-success p-1">
                                                    <i className="bx bx-qr-scan fs-5"></i>
                                                </div>
                                                <span className="fw-bold text-dark" style={{ fontSize: '0.78rem' }}>Scan Ticket</span>
                                            </div>
                                            <p className="text-muted mb-0" style={{ fontSize: '0.68rem' }}>Scan QR code ticket masuk</p>
                                        </div>
                                    </Link>
                                </Col>
                                <Col xs={6}>
                                    <Link href="/event/create" className="text-decoration-none">
                                        <div className="border rounded-3 p-2 cursor-pointer hover-bg-light transition-all h-100">
                                            <div className="d-flex align-items-center gap-2 mb-1">
                                                <div className="rounded-circle bg-purple-subtle text-purple p-1" style={{ color: '#7c3aed', backgroundColor: 'rgba(124, 58, 237, 0.12)' }}>
                                                    <i className="bx bx-calendar-plus fs-5"></i>
                                                </div>
                                                <span className="fw-bold text-dark" style={{ fontSize: '0.78rem' }}>Create Event</span>
                                            </div>
                                            <p className="text-muted mb-0" style={{ fontSize: '0.68rem' }}>Buat event baru</p>
                                        </div>
                                    </Link>
                                </Col>
                                <Col xs={6}>
                                    <Link href="/reports" className="text-decoration-none">
                                        <div className="border rounded-3 p-2 cursor-pointer hover-bg-light transition-all h-100">
                                            <div className="d-flex align-items-center gap-2 mb-1">
                                                <div className="rounded-circle bg-info-subtle text-info p-1">
                                                    <i className="bx bx-bar-chart-alt-2 fs-5"></i>
                                                </div>
                                                <span className="fw-bold text-dark" style={{ fontSize: '0.78rem' }}>View Reports</span>
                                            </div>
                                            <p className="text-muted mb-0" style={{ fontSize: '0.68rem' }}>Lihat laporan penjualan</p>
                                        </div>
                                    </Link>
                                </Col>
                            </Row>
                        </Card>
                    </div>
                </Col>
            </Row>

            {/* BOTTOM ROW: Your Events Table & Upcoming Events List */}
            <Row className="g-3">
                <Col xl={8} lg={7}>
                    <Card className="border-0 shadow-sm rounded-4 p-3 bg-white">
                        <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-3">
                            <h6 className="fw-bold text-dark mb-0" style={{ fontSize: '1rem' }}>Your Events</h6>
                            <div className="d-flex align-items-center gap-2">
                                <div className="nav nav-pills bg-light rounded-pill p-1" style={{ fontSize: '0.78rem' }}>
                                    <button className={`nav-link border-0 rounded-pill py-1 px-3 ${activeTab === 'all' ? 'bg-primary text-white' : 'text-muted'}`} onClick={() => setActiveTab('all')}>All Events</button>
                                    <button className={`nav-link border-0 rounded-pill py-1 px-3 ${activeTab === 'published' ? 'bg-primary text-white' : 'text-muted'}`} onClick={() => setActiveTab('published')}>Published</button>
                                    <button className={`nav-link border-0 rounded-pill py-1 px-3 ${activeTab === 'draft' ? 'bg-primary text-white' : 'text-muted'}`} onClick={() => setActiveTab('draft')}>Draft</button>
                                    <button className={`nav-link border-0 rounded-pill py-1 px-3 ${activeTab === 'ongoing' ? 'bg-primary text-white' : 'text-muted'}`} onClick={() => setActiveTab('ongoing')}>Ongoing</button>
                                    <button className={`nav-link border-0 rounded-pill py-1 px-3 ${activeTab === 'completed' ? 'bg-primary text-white' : 'text-muted'}`} onClick={() => setActiveTab('completed')}>Completed</button>
                                </div>
                                <div className="d-flex align-items-center gap-2">
                                    <div className="position-relative" style={{ width: '160px' }}>
                                        <i className="bx bx-search position-absolute top-50 start-0 translate-middle-y ms-2 text-muted" style={{ fontSize: '0.85rem' }}></i>
                                        <input type="text" className="form-control form-control-sm ps-4 bg-light border-0" placeholder="Search events..." style={{ fontSize: '0.78rem' }} />
                                    </div>
                                    <button className="btn btn-sm btn-light border text-muted px-2 py-1" style={{ fontSize: '0.78rem' }}>
                                        <i className="bx bx-filter me-1"></i> Filter
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="table-responsive">
                            <Table hover className="align-middle mb-0" style={{ fontSize: '0.85rem' }}>
                                <thead className="bg-light text-muted uppercase">
                                    <tr>
                                        <th>Event</th>
                                        <th>Date</th>
                                        <th>Tickets Sold</th>
                                        <th>Revenue</th>
                                        <th>Status</th>
                                        <th className="text-end">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {sampleEvents
                                        .filter(ev => activeTab === 'all' || ev.status.toLowerCase() === activeTab)
                                        .map((ev) => (
                                            <tr key={ev.id}>
                                                <td>
                                                    <div className="d-flex align-items-center gap-3">
                                                        <img src={ev.image} alt={ev.title} className="rounded-3 object-fit-cover" style={{ width: '48px', height: '36px' }} />
                                                        <div>
                                                            <div className="fw-bold text-dark">{ev.title}</div>
                                                            <div className="text-muted" style={{ fontSize: '0.72rem' }}>{ev.location}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="text-muted" style={{ fontSize: '0.8rem' }}>{ev.date}</td>
                                                <td>
                                                    <div style={{ width: '120px' }}>
                                                        <div className="d-flex justify-content-between mb-1" style={{ fontSize: '0.72rem' }}>
                                                            <span className="fw-bold text-dark">{ev.tickets_sold} / {ev.tickets_total}</span>
                                                            <span className="text-muted">{ev.progress}%</span>
                                                        </div>
                                                        <ProgressBar now={ev.progress} variant="primary" style={{ height: '6px' }} />
                                                    </div>
                                                </td>
                                                <td className="fw-bold text-dark">{ev.revenue}</td>
                                                <td>
                                                    <span className={`badge ${ev.status === 'Published' ? 'badge-published' : 'badge-draft'}`}>
                                                        {ev.status}
                                                    </span>
                                                </td>
                                                <td className="text-end">
                                                    <div className="d-flex align-items-center justify-content-end gap-1 text-muted">
                                                        <button className="btn btn-sm btn-icon text-muted hover-text-primary p-1"><i className="bx bx-show fs-5"></i></button>
                                                        <button className="btn btn-sm btn-icon text-muted hover-text-primary p-1"><i className="bx bx-edit fs-5"></i></button>
                                                        <button className="btn btn-sm btn-icon text-muted hover-text-primary p-1"><i className="bx bx-dots-horizontal-rounded fs-5"></i></button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                </tbody>
                            </Table>
                        </div>
                        <div className="mt-3 text-center">
                            <Link href="/event" className="text-primary text-decoration-none fw-bold small">View all events →</Link>
                        </div>
                    </Card>
                </Col>

                <Col xl={4} lg={5}>
                    <Card className="border-0 shadow-sm rounded-4 p-3 bg-white h-100">
                        <div className="d-flex align-items-center justify-content-between mb-3">
                            <h6 className="fw-bold text-dark mb-0" style={{ fontSize: '0.95rem' }}>Upcoming Events</h6>
                            <Link href="/event" className="text-primary text-decoration-none small fw-semibold">View all</Link>
                        </div>
                        <div className="d-flex flex-column gap-3">
                            {upcomingEvents.map((item, idx) => (
                                <div key={idx} className="d-flex align-items-center justify-content-between p-2 rounded-3 border bg-light-subtle">
                                    <div className="d-flex align-items-center gap-2">
                                        <img src={item.image} alt={item.title} className="rounded-3 object-fit-cover" style={{ width: '42px', height: '42px' }} />
                                        <div>
                                            <div className="fw-bold text-dark" style={{ fontSize: '0.82rem' }}>{item.title}</div>
                                            <div className="text-muted" style={{ fontSize: '0.72rem' }}>{item.location}</div>
                                        </div>
                                    </div>
                                    <div className="text-center px-2 py-1 bg-white rounded-3 border" style={{ minWidth: '42px' }}>
                                        <div className="fw-extrabold text-primary lh-1" style={{ fontSize: '1rem' }}>{item.date_day}</div>
                                        <div className="text-muted uppercase fw-bold" style={{ fontSize: '0.6rem' }}>{item.date_month}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default DashboardPage;
