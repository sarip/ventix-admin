/**
 * @author Sarip Hidayat <hidayatsarip2210@gmail.com>
 * @copyright Sarip Hidayat 2024
 * @date 2026-03-14
 */

import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Table, Badge, Form } from 'react-bootstrap';
import dynamic from 'next/dynamic';
import { Commission, InCommissionRecord, CommissionAnalysisData } from '@/models/Commission';
import { showToast } from '@/utils/toast';
import useBlockUI from '@/pages/_components/useBlockUI';
import moment from 'moment';
import DateRangePicker from 'react-bootstrap-daterangepicker';
import 'bootstrap-daterangepicker/daterangepicker.css';

// Dynamically import ApexCharts to avoid SSR issues
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

const CommissionAnalysisPage: React.FC = () => {
    const { blockUI, unblockUI } = useBlockUI();
    const [analysisData, setAnalysisData] = useState<CommissionAnalysisData | null>(null);
    const [commissions, setCommissions] = useState<InCommissionRecord[]>([]);
    const [pagination, setPagination] = useState({
        total: 0,
        current_page: 1,
        per_page: 10,
        page_count: 0
    });
    const [dateRange, setDateRange] = useState({
        start: moment().subtract(29, 'days'),
        end: moment()
    });
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);

    const CommissionModel = new Commission();

    useEffect(() => {
        loadData();
    }, [dateRange]);

    const loadData = async (page = pagination.current_page) => {
        blockUI();
        setLoading(true);
        try {
            const query = {
                start_date: dateRange.start.format('YYYY-MM-DD'),
                end_date: dateRange.end.format('YYYY-MM-DD'),
                search: search,
                page: page
            };

            const [analysisRes, listRes] = await Promise.all([
                CommissionModel.analysis(query),
                CommissionModel.list(query)
            ]);

            setAnalysisData(analysisRes);
            setCommissions(listRes.commissions || []);

            if (listRes.pagination) {
                setPagination({
                    total: listRes.pagination.total,
                    current_page: listRes.pagination.current_page,
                    per_page: listRes.pagination.per_page,
                    page_count: listRes.pagination.page_count
                });
            }
        } catch (error) {
            showToast('Failed to load commission data', 'error');
        } finally {
            unblockUI();
            setLoading(false);
        }
    };

    const handleApplyDateRange = (event: any, picker: any) => {
        setDateRange({
            start: picker.startDate,
            end: picker.endDate
        });
    };

    const formatCurrency = (amount: number | string) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(Number(amount));
    };

    const getTrendOptions = (): any => {
        if (!analysisData) return {};
        return {
            chart: { id: 'commission-trend', toolbar: { show: false } },
            stroke: { curve: 'smooth', width: 3 },
            colors: ['#696cff'],
            xaxis: {
                categories: analysisData.trends.map(t => moment(t.date).format('DD MMM')),
                labels: { rotate: -45 }
            },
            dataLabels: { enabled: false },
            tooltip: { y: { formatter: (val: number) => formatCurrency(val) } }
        };
    };

    const getDonutOptions = (): any => {
        if (!analysisData) return {};
        return {
            labels: analysisData.modules.map(m => m.module.charAt(0).toUpperCase() + m.module.slice(1)),
            colors: ['#696cff', '#03c3ec'],
            legend: { position: 'bottom' },
            dataLabels: { enabled: true },
            plotOptions: { pie: { donut: { size: '70%', labels: { show: true, total: { show: true, label: 'Total' } } } } }
        };
    };

    const getSummaryTotal = (key: string) => {
        const item = analysisData?.summary.find(s => s.rule_key === key);
        return item ? parseFloat(item.total) : 0;
    };

    const totalCommissions = analysisData?.summary.reduce((acc, curr) => acc + parseFloat(curr.total), 0) || 0;

    return (
        <div className="container-p-y">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h3 className="fw-bold text-primary mb-1">
                        <i className="bx bx-pie-chart-alt-2 me-2"></i>
                        Commission Analysis
                    </h3>
                    <p className="text-muted mb-0">Track and analyze your platform revenue</p>
                </div>
                <div className="d-flex gap-2">
                    <DateRangePicker
                        initialSettings={{
                            startDate: dateRange.start.toDate(),
                            endDate: dateRange.end.toDate(),
                            ranges: {
                                'Today': [moment(), moment()],
                                'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
                                'Last 7 Days': [moment().subtract(6, 'days'), moment()],
                                'Last 30 Days': [moment().subtract(29, 'days'), moment()],
                                'This Month': [moment().startOf('month'), moment().endOf('month')],
                                'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
                            }
                        }}
                        onApply={handleApplyDateRange}
                    >
                        <button className="btn btn-outline-primary">
                            <i className="bx bx-calendar me-1"></i>
                            {dateRange.start.format('MMM D, YYYY')} - {dateRange.end.format('MMM D, YYYY')}
                        </button>
                    </DateRangePicker>
                    <button className="btn btn-primary" onClick={() => loadData()}>
                        <i className="bx bx-refresh"></i>
                    </button>
                </div>
            </div>

            {/* Summary Cards */}
            <Row className="g-4 mb-4">
                <Col md={3}>
                    <Card className="card-border-shadow-primary h-100 border-0 shadow-sm">
                        <Card.Body>
                            <div className="d-flex align-items-center mb-2">
                                <div className="avatar me-2">
                                    <span className="avatar-initial rounded bg-label-primary">
                                        <i className="bx bx-wallet"></i>
                                    </span>
                                </div>
                                <h6 className="mb-0">Total Commissions</h6>
                            </div>
                            <h4 className="mb-1 fw-bold">{formatCurrency(totalCommissions)}</h4>
                            <small className="text-muted">Total platform revenue</small>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={3}>
                    <Card className="card-border-shadow-success h-100 border-0 shadow-sm">
                        <Card.Body>
                            <div className="d-flex align-items-center mb-2">
                                <div className="avatar me-2">
                                    <span className="avatar-initial rounded bg-label-success">
                                        <i className="bx bx-user"></i>
                                    </span>
                                </div>
                                <h6 className="mb-0">Guest Fees</h6>
                            </div>
                            <h4 className="mb-1 fw-bold">{formatCurrency(getSummaryTotal('guest_fee'))}</h4>
                            <small className="text-success">Purchaser contributions</small>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={3}>
                    <Card className="card-border-shadow-info h-100 border-0 shadow-sm">
                        <Card.Body>
                            <div className="d-flex align-items-center mb-2">
                                <div className="avatar me-2">
                                    <span className="avatar-initial rounded bg-label-info">
                                        <i className="bx bx-calendar-event"></i>
                                    </span>
                                </div>
                                <h6 className="mb-0">EO Fees</h6>
                            </div>
                            <h4 className="mb-1 fw-bold">{formatCurrency(getSummaryTotal('eo_fee'))}</h4>
                            <small className="text-info">Event organizer cut</small>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={3}>
                    <Card className="card-border-shadow-warning h-100 border-0 shadow-sm">
                        <Card.Body>
                            <div className="d-flex align-items-center mb-2">
                                <div className="avatar me-2">
                                    <span className="avatar-initial rounded bg-label-warning">
                                        <i className="bx bx-buildings"></i>
                                    </span>
                                </div>
                                <h6 className="mb-0">Facility Fees</h6>
                            </div>
                            <h4 className="mb-1 fw-bold">{formatCurrency(getSummaryTotal('facility_fee'))}</h4>
                            <small className="text-warning">Venue booking cut</small>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Charts */}
            <Row className="g-4 mb-4">
                <Col lg={8}>
                    <Card className="h-100 border-0 shadow-sm">
                        <Card.Header className="bg-transparent border-0 pt-4 px-4">
                            <h5 className="mb-0">Earnings Trend</h5>
                            <small className="text-muted">Daily commission growth</small>
                        </Card.Header>
                        <Card.Body className="px-4 pb-4">
                            {!loading && analysisData && (
                                <Chart
                                    options={getTrendOptions()}
                                    series={[{ name: 'Commission', data: analysisData.trends.map(t => parseFloat(t.total)) }]}
                                    type="area"
                                    height={300}
                                />
                            )}
                        </Card.Body>
                    </Card>
                </Col>
                <Col lg={4}>
                    <Card className="h-100 border-0 shadow-sm">
                        <Card.Header className="bg-transparent border-0 pt-4 px-4">
                            <h5 className="mb-0">Revenue Source</h5>
                            <small className="text-muted">Module distribution</small>
                        </Card.Header>
                        <Card.Body className="d-flex align-items-center justify-content-center">
                            {!loading && analysisData && (
                                <Chart
                                    options={getDonutOptions()}
                                    series={analysisData.modules.map(m => parseFloat(m.total))}
                                    type="donut"
                                    width="100%"
                                    height={300}
                                />
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Detailed Ledger */}
            <Card className="border-0 shadow-sm">
                <Card.Header className="bg-transparent border-0 py-4 px-4 d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">Commission Ledger</h5>
                    <div style={{ width: '250px' }}>
                        <Form.Control
                            type="text"
                            placeholder="Search order code..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && loadData()}
                        />
                    </div>
                </Card.Header>
                <Card.Body className="p-0">
                    <div className="table-responsive text-nowrap">
                        <Table hover className="mb-0">
                            <thead className="table-light">
                                <tr>
                                    <th className="px-4">Date</th>
                                    <th>Order Code</th>
                                    <th>Customer</th>
                                    <th>Module</th>
                                    <th>Fee Type</th>
                                    <th className="text-end">Base Amount</th>
                                    <th className="text-end px-4">Commission</th>
                                </tr>
                            </thead>
                            <tbody>
                                {commissions.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="text-center py-5 text-muted">No records found</td>
                                    </tr>
                                ) : (
                                    commissions.map((item) => (
                                        <tr key={item.id}>
                                            <td className="px-4 small">{moment(item.created_at).format('DD MMM YYYY HH:mm')}</td>
                                            <td><Badge bg="label-primary">{item.order_code}</Badge></td>
                                            <td>{item.customer_name}</td>
                                            <td>
                                                <Badge bg={item.module === 'event' ? 'info' : 'warning'} className="text-capitalize">
                                                    {item.module}
                                                </Badge>
                                            </td>
                                            <td className="text-capitalize small">{item.rule_key.replace(/_/g, ' ')}</td>
                                            <td className="text-end small">{formatCurrency(item.base_amount)}</td>
                                            <td className="text-end fw-bold text-success px-4">{formatCurrency(item.calculated_amount)}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </Table>
                    </div>
                </Card.Body>
                <Card.Footer className="bg-transparent border-0 py-4 px-4 d-flex justify-content-between">
                    <small className="text-muted">
                        Showing {commissions.length} of {pagination.total} records
                    </small>
                    <div className="d-flex gap-2">
                        <button
                            className="btn btn-sm btn-outline-secondary"
                            disabled={pagination.current_page <= 1}
                            onClick={() => loadData(pagination.current_page - 1)}
                        >
                            Previous
                        </button>
                        <button
                            className="btn btn-sm btn-outline-secondary"
                            disabled={pagination.current_page >= pagination.page_count}
                            onClick={() => loadData(pagination.current_page + 1)}
                        >
                            Next
                        </button>
                    </div>
                </Card.Footer>
            </Card>
        </div>
    );
};

export default CommissionAnalysisPage;
