/**
 * Facility Dashboard Page - Professional Design
 */

import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Table, Badge, ProgressBar } from 'react-bootstrap';
import APIClient from '@/lib/ApiClient';
import { showToast } from '@/utils/toast';
import useBlockUI from '@/pages/_components/useBlockUI';

interface DashboardData {
    booking_stats: {
        total_this_month: number;
        pending: number;
        confirmed: number;
        completed: number;
        cancelled: number;
    };
    revenue_stats: {
        this_month: number;
        potential: number;
        total_all_time: number;
    };
    facility_stats: {
        total_facilities: number;
        available_facilities: number;
        unavailable_facilities: number;
    };
    today_bookings: any[];
    upcoming_bookings: any[];
    top_facilities: any[];
    monthly_trend: Array<{
        month: string;
        bookings: number;
        revenue: number;
    }>;
}

const DashboardPage: React.FC = () => {
    const { blockUI, unblockUI } = useBlockUI();
    const [data, setData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadDashboard();
    }, []);

    const loadDashboard = async () => {
        blockUI();
        try {
            const response = await APIClient.get('dashboard/facility');
            setData(response as DashboardData);
        } catch (error) {
            showToast('Failed to load dashboard', 'error');
        } finally {
            unblockUI();
            setLoading(false);
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(amount);
    };

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

    const getStatusBadge = (status: string) => {
        const variants: { [key: string]: string } = {
            'Pending': 'warning',
            'confirmed': 'primary',
            'completed': 'success',
            'cancelled': 'danger'
        };
        return variants[status] || 'secondary';
    };

    if (loading || !data) {
        return null;
    }

    const totalBookings = data.booking_stats.total_this_month || 1;
    const completionRate = ((data.booking_stats.completed / totalBookings) * 100).toFixed(0);
    const confirmationRate = (((data.booking_stats.confirmed + data.booking_stats.completed) / totalBookings) * 100).toFixed(0);

    return (
        <>
            <div className="container-p-y">
                {/* HEADER */}
                <div className="mb-4">
                    <h3 className="fw-bold text-primary mb-1">
                        <i className="bx bx-grid-alt me-2"></i>
                        Dashboard Facility Booking
                    </h3>
                    <p className="text-muted mb-0">Ringkasan performa booking fasilitas bulan ini</p>
                </div>

                {/* BOOKING STATISTICS - Modern Cards */}
                <Row className="g-4 mb-4">
                    <Col xl={2} lg={4} md={6} sm={6}>
                        <Card className="card-border-shadow-primary bg-primary h-100" style={{
                            borderRadius: '1rem',
                            overflow: 'hidden'
                        }}>
                            <Card.Body className="text-white position-relative">
                                <div style={{
                                    position: 'absolute',
                                    top: '-20px',
                                    right: '-20px',
                                    fontSize: '120px',
                                    opacity: 0.1
                                }}>
                                    <i className="bx bx-calendar-check"></i>
                                </div>
                                <div className="d-flex flex-column" style={{ position: 'relative', zIndex: 1 }}>
                                    <small className="mb-1" style={{ opacity: 0.9 }}>Total Booking</small>
                                    <h2 className="mb-0 fw-bold text-white">{data.booking_stats.total_this_month}</h2>
                                    <small className="mt-1" style={{ opacity: 0.8 }}>Bulan ini</small>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>

                    <Col xl={2} lg={4} md={6} sm={6}>
                        <Card className="card-border-shadow-warning h-100 bg-warning" style={{
                            borderRadius: '1rem',
                            overflow: 'hidden'
                        }}>
                            <Card.Body className="text-white position-relative">
                                <div style={{
                                    position: 'absolute',
                                    top: '-20px',
                                    right: '-20px',
                                    fontSize: '120px',
                                    opacity: 0.1
                                }}>
                                    <i className="bx bx-time-five"></i>
                                </div>
                                <div className="d-flex flex-column" style={{ position: 'relative', zIndex: 1 }}>
                                    <small className="mb-1" style={{ opacity: 0.9 }}>Pending</small>
                                    <h2 className="mb-0 fw-bold text-white">{data.booking_stats.pending}</h2>
                                    <small className="mt-1" style={{ opacity: 0.8 }}>Menunggu konfirmasi</small>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>

                    <Col xl={2} lg={4} md={6} sm={6}>
                        <Card className="card-border-shadow-info h-100 bg-info" style={{
                            borderRadius: '1rem',
                            overflow: 'hidden'
                        }}>
                            <Card.Body className="text-white position-relative">
                                <div style={{
                                    position: 'absolute',
                                    top: '-20px',
                                    right: '-20px',
                                    fontSize: '120px',
                                    opacity: 0.1
                                }}>
                                    <i className="bx bx-check-circle"></i>
                                </div>
                                <div className="d-flex flex-column" style={{ position: 'relative', zIndex: 1 }}>
                                    <small className="mb-1" style={{ opacity: 0.9 }}>Confirmed</small>
                                    <h2 className="mb-0 fw-bold text-white">{data.booking_stats.confirmed}</h2>
                                    <small className="mt-1" style={{ opacity: 0.8 }}>Terkonfirmasi</small>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>

                    <Col xl={2} lg={4} md={6} sm={6}>
                        <Card className="card-border-shadow-success bg-success h-100" style={{
                            borderRadius: '1rem',
                            overflow: 'hidden'
                        }}>
                            <Card.Body className="text-white position-relative">
                                <div style={{
                                    position: 'absolute',
                                    top: '-20px',
                                    right: '-20px',
                                    fontSize: '120px',
                                    opacity: 0.1
                                }}>
                                    <i className="bx bx-check-double"></i>
                                </div>
                                <div className="d-flex flex-column" style={{ position: 'relative', zIndex: 1 }}>
                                    <small className="mb-1" style={{ opacity: 0.9 }}>Completed</small>
                                    <h2 className="mb-0 fw-bold text-white">{data.booking_stats.completed}</h2>
                                    <small className="mt-1" style={{ opacity: 0.8 }}>Selesai</small>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>

                    <Col xl={2} lg={4} md={6} sm={6}>
                        <Card className="card-border-shadow-danger h-100 bg-danger" style={{
                            backgroundColor: '#ff3e1d',
                            borderRadius: '1rem',
                            overflow: 'hidden'
                        }}>
                            <Card.Body className="text-white position-relative">
                                <div style={{
                                    position: 'absolute',
                                    top: '-20px',
                                    right: '-20px',
                                    fontSize: '120px',
                                    opacity: 0.1
                                }}>
                                    <i className="bx bx-x-circle"></i>
                                </div>
                                <div className="d-flex flex-column" style={{ position: 'relative', zIndex: 1 }}>
                                    <small className="mb-1" style={{ opacity: 0.9 }}>Cancelled</small>
                                    <h2 className="mb-0 fw-bold text-white" >{data.booking_stats.cancelled}</h2>
                                    <small className="mt-1" style={{ opacity: 0.8 }}>Dibatalkan</small>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>

                    <Col xl={2} lg={4} md={6} sm={6}>
                        <Card className="card-border-shadow-secondary bg-gray h-100" style={{
                            borderRadius: '1rem',
                            overflow: 'hidden'
                        }}>
                            <Card.Body className="text-white position-relative">
                                <div style={{
                                    position: 'absolute',
                                    top: '-20px',
                                    right: '-20px',
                                    fontSize: '120px',
                                    opacity: 0.1
                                }}>
                                    <i className="bx bx-buildings"></i>
                                </div>
                                <div className="d-flex flex-column" style={{ position: 'relative', zIndex: 1 }}>
                                    <small className="mb-1" style={{ opacity: 0.9 }}>Total Facilities</small>
                                    <h2 className="mb-0 fw-bold text-white">{data.facility_stats.total_facilities}</h2>
                                    <small className="mt-1" style={{ opacity: 0.8 }}>
                                        <i className="bx bx-check-circle me-1"></i>
                                        {data.facility_stats.available_facilities} tersedia
                                    </small>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

                {/* PERFORMANCE METRICS */}
                <Row className="g-4 mb-4">
                    <Col md={4}>
                        <Card className="shadow-sm h-100" style={{ borderRadius: '1rem' }}>
                            <Card.Body>
                                <div className="d-flex align-items-center mb-3">
                                    <div className="avatar avatar-xl me-3">
                                        <span className="avatar-initial rounded-circle bg-primary">
                                            <i className="bx bx-trending-up bx-lg text-white"></i>
                                        </span>
                                    </div>
                                    <div>
                                        <h6 className="mb-0 text-muted">Completion Rate</h6>
                                        <h4 className="mb-0 fw-bold">{completionRate}%</h4>
                                    </div>
                                </div>
                                <ProgressBar
                                    now={parseInt(completionRate)}
                                    variant="success"
                                    style={{ height: '8px', borderRadius: '10px' }}
                                />
                                <small className="text-muted mt-2 d-block">
                                    {data.booking_stats.completed} dari {totalBookings} booking selesai
                                </small>
                            </Card.Body>
                        </Card>
                    </Col>

                    <Col md={4}>
                        <Card className="shadow-sm h-100" style={{ borderRadius: '1rem' }}>
                            <Card.Body>
                                <div className="d-flex align-items-center mb-3">
                                    <div className="avatar avatar-xl me-3">
                                        <span className="avatar-initial rounded-circle bg-info">
                                            <i className="bx bx-check-shield bx-lg text-white"></i>
                                        </span>
                                    </div>
                                    <div>
                                        <h6 className="mb-0 text-muted">Confirmation Rate</h6>
                                        <h4 className="mb-0 fw-bold">{confirmationRate}%</h4>
                                    </div>
                                </div>
                                <ProgressBar
                                    now={parseInt(confirmationRate)}
                                    variant="info"
                                    style={{ height: '8px', borderRadius: '10px' }}
                                />
                                <small className="text-muted mt-2 d-block">
                                    {data.booking_stats.confirmed + data.booking_stats.completed} booking dikonfirmasi
                                </small>
                            </Card.Body>
                        </Card>
                    </Col>

                    <Col md={4}>
                        <Card className="shadow-sm h-100" style={{ borderRadius: '1rem' }}>
                            <Card.Body>
                                <div className="d-flex align-items-center mb-3">
                                    <div className="avatar avatar-xl me-3">
                                        <span className="avatar-initial rounded-circle bg-success">
                                            <i className="bx bx-buildings bx-lg text-white"></i>
                                        </span>
                                    </div>
                                    <div>
                                        <h6 className="mb-0 text-muted">Facility Utilization</h6>
                                        <h4 className="mb-0 fw-bold">
                                            {data.facility_stats.total_facilities > 0
                                                ? ((data.facility_stats.available_facilities / data.facility_stats.total_facilities) * 100).toFixed(0)
                                                : 0}%
                                        </h4>
                                    </div>
                                </div>
                                <ProgressBar style={{ height: '8px', borderRadius: '10px' }}>
                                    <ProgressBar
                                        variant="success"
                                        now={(data.facility_stats.available_facilities / data.facility_stats.total_facilities) * 100}
                                        key={1}
                                    />
                                    <ProgressBar
                                        variant="danger"
                                        now={(data.facility_stats.unavailable_facilities / data.facility_stats.total_facilities) * 100}
                                        key={2}
                                    />
                                </ProgressBar>
                                <small className="text-muted mt-2 d-block">
                                    {data.facility_stats.available_facilities} tersedia, {data.facility_stats.unavailable_facilities} tidak tersedia
                                </small>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

                {/* REVENUE & TOP FACILITIES */}
                <Row className="g-4 mb-4">
                    <Col lg={4}>
                        <Card className="shadow-sm h-100" style={{ borderRadius: '1rem', border: 'none' }}>
                            <Card.Body>
                                <div className="d-flex align-items-center mb-4">
                                    <div className="avatar me-2">
                                        <span className="avatar-initial rounded bg-success">
                                            <i className="bx bx-money text-white"></i>
                                        </span>
                                    </div>
                                    <h5 className="mb-0">Revenue Overview</h5>
                                </div>

                                <div className="mb-4 p-3 rounded bg-light" style={{
                                    border: '1px solid #e0e0e0'
                                }}>
                                    <small className="text-muted d-block mb-1">💰 Pendapatan Bulan Ini</small>
                                    <h3 className="mb-0 text-success fw-bold">{formatCurrency(data.revenue_stats.this_month)}</h3>
                                </div>

                                <div className="mb-4 p-3 rounded bg-light" style={{
                                    border: '1px solid #e0e0e0'
                                }}>
                                    <small className="text-muted d-block mb-1">🎯 Potensi Pendapatan</small>
                                    <h4 className="mb-1 text-warning fw-bold">{formatCurrency(data.revenue_stats.potential)}</h4>
                                    <small className="text-muted">Dari pending & confirmed</small>
                                </div>

                                <div className="p-3 rounded bg-light" style={{
                                    border: '1px solid #e0e0e0'
                                }}>
                                    <small className="text-muted d-block mb-1">📊 Total Revenue</small>
                                    <h4 className="mb-1 text-primary fw-bold">{formatCurrency(data.revenue_stats.total_all_time)}</h4>
                                    <small className="text-muted">Sepanjang masa</small>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>

                    <Col lg={8}>
                        <Card className="shadow-sm h-100" style={{ borderRadius: '1rem', border: 'none' }}>
                            <Card.Body>
                                <div className="d-flex align-items-center mb-4">
                                    <div className="avatar me-2">
                                        <span className="avatar-initial rounded bg-label-warning">
                                            <i className="bx bx-trophy"></i>
                                        </span>
                                    </div>
                                    <h5 className="mb-0">Top 5 Facilities</h5>
                                </div>

                                <div className="table-responsive">
                                    <Table hover className="mb-0">
                                        <thead>
                                            <tr>
                                                <th style={{ borderBottom: '2px solid #e7e7e7' }}>#</th>
                                                <th style={{ borderBottom: '2px solid #e7e7e7' }}>Facility</th>
                                                <th style={{ borderBottom: '2px solid #e7e7e7' }}>Category</th>
                                                <th className="text-center" style={{ borderBottom: '2px solid #e7e7e7' }}>Bookings</th>
                                                <th className="text-end" style={{ borderBottom: '2px solid #e7e7e7' }}>Revenue</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {data.top_facilities.length === 0 ? (
                                                <tr>
                                                    <td colSpan={5} className="text-center text-muted py-5">
                                                        <i className="bx bx-info-circle bx-lg d-block mb-2" style={{ fontSize: '3rem', opacity: 0.5 }}></i>
                                                        <div>Belum ada data booking</div>
                                                    </td>
                                                </tr>
                                            ) : (
                                                data.top_facilities.map((facility, index) => (
                                                    <tr key={facility.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                                                        <td>
                                                            <div className="avatar avatar-sm">
                                                                <span className={`avatar-initial rounded ${index === 0 ? 'bg-warning' : 'bg-label-secondary'}`}>
                                                                    {index + 1}
                                                                </span>
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <div className="fw-semibold">{facility.name}</div>
                                                        </td>
                                                        <td>
                                                            <span className="badge bg-label-primary rounded-pill">
                                                                {facility.category}
                                                            </span>
                                                        </td>
                                                        <td className="text-center">
                                                            <span className="badge bg-label-info rounded-pill">
                                                                {facility.booking_count} bookings
                                                            </span>
                                                        </td>
                                                        <td className="text-end">
                                                            <span className="fw-bold text-success">
                                                                {formatCurrency(facility.total_revenue)}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </Table>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

                {/* TODAY'S SCHEDULE */}
                <Row className="g-4 mb-4">
                    <Col lg={12}>
                        <Card className="shadow-sm" style={{ borderRadius: '1rem', border: 'none' }}>
                            <Card.Header className="pb-0 bg-primary" style={{
                                borderRadius: '1rem 1rem 0 0',
                                padding: '1.5rem'
                            }}>
                                <div className="d-flex justify-content-between align-items-center text-white">
                                    <div>
                                        <h5 className="mb-0 text-white">
                                            <i className="bx bx-calendar-event me-2"></i>
                                            Jadwal Hari Ini
                                        </h5>
                                        <small style={{ opacity: 0.9 }}>
                                            {new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                        </small>
                                    </div>
                                    <Badge bg="light" text="dark" className="px-3 py-2">
                                        <i className="bx bx-calendar me-1"></i>
                                        {data.today_bookings.length} booking
                                    </Badge>
                                </div>
                            </Card.Header>
                            <Card.Body>
                                <div className="table-responsive">
                                    <Table hover className="mb-0">
                                        <thead>
                                            <tr>
                                                <th style={{ borderBottom: '2px solid #e7e7e7' }}>
                                                    <i className="bx bx-time me-1"></i>Waktu
                                                </th>
                                                <th style={{ borderBottom: '2px solid #e7e7e7' }}>
                                                    <i className="bx bx-buildings me-1"></i>Facility
                                                </th>
                                                <th style={{ borderBottom: '2px solid #e7e7e7' }}>
                                                    <i className="bx bx-user me-1"></i>User
                                                </th>
                                                <th style={{ borderBottom: '2px solid #e7e7e7' }}>Duration</th>
                                                <th style={{ borderBottom: '2px solid #e7e7e7' }}>Status</th>
                                                <th className="text-end" style={{ borderBottom: '2px solid #e7e7e7' }}>Price</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {data.today_bookings.length === 0 ? (
                                                <tr>
                                                    <td colSpan={6} className="text-center py-5 text-muted">
                                                        <i className="bx bx-calendar-x" style={{ fontSize: '4rem', opacity: 0.3 }}></i>
                                                        <div className="mt-2">Tidak ada booking hari ini</div>
                                                    </td>
                                                </tr>
                                            ) : (
                                                data.today_bookings.map((booking) => (
                                                    <tr key={booking.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                                                        <td>
                                                            <span className="badge bg-label-primary font-monospace px-3 py-2">
                                                                {booking.start_time} - {booking.end_time}
                                                            </span>
                                                        </td>
                                                        <td>
                                                            <div className="fw-semibold">{booking.facility_name}</div>
                                                            <small className="text-muted">{booking.facility_code}</small>
                                                        </td>
                                                        <td>{booking.user_name}</td>
                                                        <td>
                                                            <i className="bx bx-time-five me-1 text-muted"></i>
                                                            {booking.total_hours} jam
                                                        </td>
                                                        <td>
                                                            <Badge bg={getStatusBadge(booking.status)} className="px-3 py-2">
                                                                {booking.status}
                                                            </Badge>
                                                        </td>
                                                        <td className="text-end fw-bold text-success">
                                                            {formatCurrency(booking.total_price)}
                                                        </td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </Table>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

                {/* UPCOMING & TRENDS */}
                <Row className="g-4">
                    <Col lg={6}>
                        <Card className="shadow-sm h-100" style={{ borderRadius: '1rem', border: 'none' }}>
                            <Card.Body>
                                <div className="d-flex align-items-center mb-4">
                                    <div className="avatar me-2">
                                        <span className="avatar-initial rounded bg-label-info">
                                            <i className="bx bx-time-five"></i>
                                        </span>
                                    </div>
                                    <div>
                                        <h5 className="mb-0">Upcoming Bookings</h5>
                                        <small className="text-muted">7 hari ke depan</small>
                                    </div>
                                </div>

                                {data.upcoming_bookings.length === 0 ? (
                                    <div className="text-center py-5 text-muted">
                                        <i className="bx bx-calendar-x" style={{ fontSize: '4rem', opacity: 0.3 }}></i>
                                        <div className="mt-2">Tidak ada booking mendatang</div>
                                    </div>
                                ) : (
                                    <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                                        {data.upcoming_bookings.map((booking) => (
                                            <div key={booking.id} className="p-3 mb-3 rounded" style={{
                                                background: '#f8f9fa',
                                                border: '1px solid #e7e7e7'
                                            }}>
                                                <div className="d-flex justify-content-between align-items-start mb-2">
                                                    <div className="flex-grow-1">
                                                        <h6 className="mb-1">{booking.facility_name}</h6>
                                                        <small className="text-muted">
                                                            <i className="bx bx-user me-1"></i>
                                                            {booking.user_name}
                                                        </small>
                                                    </div>
                                                    <Badge bg={getStatusBadge(booking.status)}>
                                                        {booking.status}
                                                    </Badge>
                                                </div>
                                                <div className="d-flex gap-3 mt-2">
                                                    <small className="text-muted">
                                                        <i className="bx bx-calendar me-1"></i>
                                                        {formatDate(booking.booking_date)}
                                                    </small>
                                                    <small className="text-muted font-monospace">
                                                        <i className="bx bx-time me-1"></i>
                                                        {booking.start_time} - {booking.end_time}
                                                    </small>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </Card.Body>
                        </Card>
                    </Col>

                    <Col lg={6}>
                        <Card className="shadow-sm h-100" style={{ borderRadius: '1rem', border: 'none' }}>
                            <Card.Body>
                                <div className="d-flex align-items-center mb-4">
                                    <div className="avatar me-2">
                                        <span className="avatar-initial rounded bg-label-success">
                                            <i className="bx bx-line-chart"></i>
                                        </span>
                                    </div>
                                    <div>
                                        <h5 className="mb-0">Monthly Trend</h5>
                                        <small className="text-muted">6 bulan terakhir</small>
                                    </div>
                                </div>

                                <Table hover className="mb-0">
                                    <thead>
                                        <tr>
                                            <th style={{ borderBottom: '2px solid #e7e7e7' }}>Bulan</th>
                                            <th className="text-center" style={{ borderBottom: '2px solid #e7e7e7' }}>Bookings</th>
                                            <th className="text-end" style={{ borderBottom: '2px solid #e7e7e7' }}>Revenue</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {data.monthly_trend.map((trend, index) => (
                                            <tr key={index} style={{ borderBottom: '1px solid #f0f0f0' }}>
                                                <td className="fw-semibold">{trend.month}</td>
                                                <td className="text-center">
                                                    <Badge bg="label-primary" className="px-3 py-2">
                                                        {trend.bookings}
                                                    </Badge>
                                                </td>
                                                <td className="text-end fw-bold text-success">
                                                    {formatCurrency(trend.revenue)}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </div>
        </>
    );
};

export default DashboardPage;
