/**
 * @author Sarip Hidayat <hidayatsarip2210@gmail.com>
 * @copyright Sarip Hidayat 2024
 * @date 2026-01-14
 */

import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Form } from 'react-bootstrap';
import useBlockUI from '@/pages/_components/useBlockUI';
import { TicketOrder } from '@/models/TicketOrder';
import { TicketUser } from '@/models/TicketUser';
import { showToast } from '@/utils/toast';

interface AnalyticsData {
    totalOrders: number;
    totalRevenue: number;
    totalTickets: number;
    pendingOrders: number;
    paidOrders: number;
    validTickets: number;
    usedTickets: number;
}

const TicketAnalyticsPage: React.FC = () => {
    const { blockUI, unblockUI } = useBlockUI();
    const [analytics, setAnalytics] = useState<AnalyticsData>({
        totalOrders: 0,
        totalRevenue: 0,
        totalTickets: 0,
        pendingOrders: 0,
        paidOrders: 0,
        validTickets: 0,
        usedTickets: 0
    });
    const [dateRange, setDateRange] = useState({
        start: '',
        end: ''
    });

    const TicketOrderModel = new TicketOrder();
    const TicketUserModel = new TicketUser();

    useEffect(() => {
        loadAnalytics();
    }, [dateRange]);

    const loadAnalytics = async () => {
        blockUI();
        try {
            // Build query with date filters
            const query: any = {
                per_page: 1000 // Get all for analytics
            };

            if (dateRange.start && dateRange.end) {
                query.date_from = dateRange.start;
                query.date_to = dateRange.end;
            }

            // Fetch orders
            const ordersResponse = await TicketOrderModel.list(query);
            const orders = ordersResponse.orders || [];

            // Fetch tickets
            const ticketsResponse = await TicketUserModel.list(query);
            const tickets = ticketsResponse.user_tickets || [];

            // Calculate analytics
            const totalRevenue = orders.reduce((sum, order) => sum + parseFloat(order.total_amount || '0'), 0);
            const pendingOrders = orders.filter(o => o.status === 'pending').length;
            const paidOrders = orders.filter(o => o.status === 'paid').length;
            const validTickets = tickets.filter(t => t.status === 'VALID').length;
            const usedTickets = tickets.filter(t => t.status === 'USED').length;

            setAnalytics({
                totalOrders: orders.length,
                totalRevenue,
                totalTickets: tickets.length,
                pendingOrders,
                paidOrders,
                validTickets,
                usedTickets
            });
        } catch (error) {
            showToast('Failed to load analytics', 'error');
        } finally {
            unblockUI();
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(amount);
    };

    const handleDateChange = (field: 'start' | 'end', value: string) => {
        setDateRange(prev => ({ ...prev, [field]: value }));
    };

    const resetFilters = () => {
        setDateRange({ start: '', end: '' });
    };

    return (
        <div className="container-fluid">
            {/* HEADER */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h4 className="mb-1">
                        <i className="bx bx-bar-chart me-2"></i>
                        Ticket Analytics Dashboard
                    </h4>
                    <p className="text-muted mb-0">Overview of ticket sales and performance</p>
                </div>
            </div>

            {/* DATE FILTERS */}
            <Card className="mb-4">
                <Card.Body>
                    <Row className="align-items-end">
                        <Col md={4}>
                            <Form.Group>
                                <Form.Label>Start Date</Form.Label>
                                <Form.Control
                                    type="date"
                                    value={dateRange.start}
                                    onChange={(e) => handleDateChange('start', e.target.value)}
                                />
                            </Form.Group>
                        </Col>
                        <Col md={4}>
                            <Form.Group>
                                <Form.Label>End Date</Form.Label>
                                <Form.Control
                                    type="date"
                                    value={dateRange.end}
                                    onChange={(e) => handleDateChange('end', e.target.value)}
                                />
                            </Form.Group>
                        </Col>
                        <Col md={4}>
                            <button className="btn btn-outline-secondary" onClick={resetFilters}>
                                <i className="bx bx-reset me-1"></i>
                                Reset Filters
                            </button>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>

            {/* SUMMARY CARDS */}
            <Row className="g-3 mb-4">
                {/* Total Revenue */}
                <Col md={4}>
                    <Card className="border-0 shadow-sm">
                        <Card.Body>
                            <div className="d-flex justify-content-between align-items-start">
                                <div>
                                    <p className="text-muted mb-1 small">Total Revenue</p>
                                    <h3 className="mb-0 text-success">{formatCurrency(analytics.totalRevenue)}</h3>
                                </div>
                                <div className="avatar avatar-lg bg-label-success rounded">
                                    <i className="bx bx-dollar-circle bx-lg"></i>
                                </div>
                            </div>
                            <small className="text-muted">
                                From {analytics.totalOrders} orders
                            </small>
                        </Card.Body>
                    </Card>
                </Col>

                {/* Total Orders */}
                <Col md={4}>
                    <Card className="border-0 shadow-sm">
                        <Card.Body>
                            <div className="d-flex justify-content-between align-items-start">
                                <div>
                                    <p className="text-muted mb-1 small">Total Orders</p>
                                    <h3 className="mb-0 text-primary">{analytics.totalOrders}</h3>
                                </div>
                                <div className="avatar avatar-lg bg-label-primary rounded">
                                    <i className="bx bx-receipt bx-lg"></i>
                                </div>
                            </div>
                            <small className="text-muted">
                                <span className="text-success">{analytics.paidOrders} paid</span> ·
                                <span className="text-warning ms-1">{analytics.pendingOrders} pending</span>
                            </small>
                        </Card.Body>
                    </Card>
                </Col>

                {/* Total Tickets */}
                <Col md={4}>
                    <Card className="border-0 shadow-sm">
                        <Card.Body>
                            <div className="d-flex justify-content-between align-items-start">
                                <div>
                                    <p className="text-muted mb-1 small">Total Tickets</p>
                                    <h3 className="mb-0 text-info">{analytics.totalTickets}</h3>
                                </div>
                                <div className="avatar avatar-lg bg-label-info rounded">
                                    <i className="bx bx-ticket bx-lg"></i>
                                </div>
                            </div>
                            <small className="text-muted">
                                <span className="text-success">{analytics.validTickets} valid</span> ·
                                <span className="text-secondary ms-1">{analytics.usedTickets} used</span>
                            </small>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* DETAILED STATS */}
            <Row className="g-3">
                {/* Order Status Breakdown */}
                <Col md={6}>
                    <Card className="border-0 shadow-sm">
                        <Card.Header className="bg-white">
                            <h6 className="mb-0">
                                <i className="bx bx-pie-chart-alt me-2"></i>
                                Order Status Breakdown
                            </h6>
                        </Card.Header>
                        <Card.Body>
                            <div className="mb-3">
                                <div className="d-flex justify-content-between mb-1">
                                    <span className="text-muted">Paid Orders</span>
                                    <span className="fw-semibold text-success">{analytics.paidOrders}</span>
                                </div>
                                <div className="progress" style={{ height: '8px' }}>
                                    <div
                                        className="progress-bar bg-success"
                                        style={{ width: `${analytics.totalOrders > 0 ? (analytics.paidOrders / analytics.totalOrders) * 100 : 0}%` }}
                                    ></div>
                                </div>
                            </div>

                            <div className="mb-3">
                                <div className="d-flex justify-content-between mb-1">
                                    <span className="text-muted">Pending Orders</span>
                                    <span className="fw-semibold text-warning">{analytics.pendingOrders}</span>
                                </div>
                                <div className="progress" style={{ height: '8px' }}>
                                    <div
                                        className="progress-bar bg-warning"
                                        style={{ width: `${analytics.totalOrders > 0 ? (analytics.pendingOrders / analytics.totalOrders) * 100 : 0}%` }}
                                    ></div>
                                </div>
                            </div>

                            <div className="mt-3 pt-3 border-top">
                                <div className="d-flex justify-content-between">
                                    <span className="fw-semibold">Total</span>
                                    <span className="fw-bold">{analytics.totalOrders}</span>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>

                {/* Ticket Status Breakdown */}
                <Col md={6}>
                    <Card className="border-0 shadow-sm">
                        <Card.Header className="bg-white">
                            <h6 className="mb-0">
                                <i className="bx bx-chart me-2"></i>
                                Ticket Status Breakdown
                            </h6>
                        </Card.Header>
                        <Card.Body>
                            <div className="mb-3">
                                <div className="d-flex justify-content-between mb-1">
                                    <span className="text-muted">Valid Tickets</span>
                                    <span className="fw-semibold text-success">{analytics.validTickets}</span>
                                </div>
                                <div className="progress" style={{ height: '8px' }}>
                                    <div
                                        className="progress-bar bg-success"
                                        style={{ width: `${analytics.totalTickets > 0 ? (analytics.validTickets / analytics.totalTickets) * 100 : 0}%` }}
                                    ></div>
                                </div>
                            </div>

                            <div className="mb-3">
                                <div className="d-flex justify-content-between mb-1">
                                    <span className="text-muted">Used Tickets</span>
                                    <span className="fw-semibold text-secondary">{analytics.usedTickets}</span>
                                </div>
                                <div className="progress" style={{ height: '8px' }}>
                                    <div
                                        className="progress-bar bg-secondary"
                                        style={{ width: `${analytics.totalTickets > 0 ? (analytics.usedTickets / analytics.totalTickets) * 100 : 0}%` }}
                                    ></div>
                                </div>
                            </div>

                            <div className="mt-3 pt-3 border-top">
                                <div className="d-flex justify-content-between">
                                    <span className="fw-semibold">Total</span>
                                    <span className="fw-bold">{analytics.totalTickets}</span>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>

                {/* Quick Stats */}
                <Col md={12}>
                    <Card className="border-0 shadow-sm">
                        <Card.Header className="bg-white">
                            <h6 className="mb-0">
                                <i className="bx bx-stats me-2"></i>
                                Quick Statistics
                            </h6>
                        </Card.Header>
                        <Card.Body>
                            <Row className="text-center">
                                <Col md={3}>
                                    <div className="py-2">
                                        <h4 className="mb-1">{formatCurrency(analytics.totalOrders > 0 ? analytics.totalRevenue / analytics.totalOrders : 0)}</h4>
                                        <small className="text-muted">Avg. Order Value</small>
                                    </div>
                                </Col>
                                <Col md={3}>
                                    <div className="py-2">
                                        <h4 className="mb-1">{analytics.totalOrders > 0 ? ((analytics.paidOrders / analytics.totalOrders) * 100).toFixed(1) : 0}%</h4>
                                        <small className="text-muted">Payment Success Rate</small>
                                    </div>
                                </Col>
                                <Col md={3}>
                                    <div className="py-2">
                                        <h4 className="mb-1">{analytics.totalTickets > 0 ? ((analytics.usedTickets / analytics.totalTickets) * 100).toFixed(1) : 0}%</h4>
                                        <small className="text-muted">Ticket Usage Rate</small>
                                    </div>
                                </Col>
                                <Col md={3}>
                                    <div className="py-2">
                                        <h4 className="mb-1">{analytics.paidOrders > 0 ? (analytics.totalTickets / analytics.paidOrders).toFixed(1) : 0}</h4>
                                        <small className="text-muted">Avg. Tickets per Order</small>
                                    </div>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default TicketAnalyticsPage;
