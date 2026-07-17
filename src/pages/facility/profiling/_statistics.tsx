/**
 * Facility Statistics Tab Component
 */

import React, { useState, useEffect } from 'react';
import { Button, Card, Row, Col, ProgressBar } from 'react-bootstrap';
import { InFacility } from '@/models/Facility';
import { FacilityStatistics } from '@/types/facility';
import useBlockUI from '@/pages/_components/useBlockUI';
import { showToast } from '@/utils/toast';
import axios from 'axios';
import { Calendar, DollarSign, Users, MessageSquare, Star } from 'react-feather';

interface StatisticsTabProps {
    facility: InFacility;
    refreshKey: number;
    onRefresh: () => void;
}

const FacilityStatisticsTab: React.FC<StatisticsTabProps> = ({ facility, refreshKey, onRefresh }) => {
    const { blockUI, unblockUI } = useBlockUI();
    const [statistics, setStatistics] = useState<FacilityStatistics | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadStatistics();
    }, [refreshKey, facility.id]);

    const loadStatistics = async () => {
        blockUI();
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(
                `/api/v1/facilities/${facility.id}/statistics`,
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
            setStatistics(response.data.data.statistics);
        } catch (error) {
            showToast('Failed to load statistics', 'error');
        } finally {
            unblockUI();
        }
    };

    const handleRefresh = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            await axios.post(
                `/api/v1/facilities/${facility.id}/statistics/calculate`,
                {},
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
            await loadStatistics();
            showToast('Statistics refreshed successfully', 'success');
        } catch (error) {
            showToast('Failed to refresh statistics', 'error');
        } finally {
            setLoading(false);
        }
    };

    const renderStatCard = (icon: React.ReactNode, title: string, value: string | number, subtitle?: string, color: string = 'primary') => (
        <Col md={6} lg={4} xl={3} className="mb-4">
            <Card className={`h-100 border-${color}`}>
                <Card.Body>
                    <div className="d-flex align-items-center">
                        <div className={`flex-shrink-0 bg-light-${color} rounded p-3 me-3`}>
                            {icon}
                        </div>
                        <div className="flex-grow-1">
                            <h6 className="text-muted mb-1 small">{title}</h6>
                            <div className="fw-bold fs-4">{value}</div>
                            {subtitle && (
                                <small className="text-muted">{subtitle}</small>
                            )}
                        </div>
                    </div>
                </Card.Body>
            </Card>
        </Col>
    );

    const renderRatingStars = (rating: number) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            if (i <= rating) {
                stars.push(<Star key={i} className="fill-current text-warning" size={16} />);
            } else if (i - 0.5 <= rating) {
                stars.push(<Star key={i} className="fill-current text-warning" size={16} style={{ opacity: 0.5 }} />);
            } else {
                stars.push(<Star key={i} className="text-muted" size={16} />);
            }
        }
        return stars;
    };

    if (!statistics) {
        return (
            <div className="text-center p-5">
                <i className="bx bx-bar-chart bx-lg text-muted mb-3 d-block"></i>
                <p className="text-muted">No statistics available</p>
                <Button
                    variant="primary"
                    onClick={loadStatistics}
                >
                    <i className="bx bx-refresh me-2"></i>
                    Load Statistics
                </Button>
            </div>
        );
    }

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <div>
                    <h5 className="mb-1">
                        <i className="bx bx-bar-chart me-2"></i>
                        Facility Statistics
                    </h5>
                    <small className="text-muted">
                        Last updated: {statistics.last_calculated_at
                            ? new Date(statistics.last_calculated_at).toLocaleString()
                            : 'Never'}
                    </small>
                </div>
                <Button
                    variant="outline-primary"
                    size="sm"
                    onClick={handleRefresh}
                    disabled={loading}
                >
                    <i className={`bx bx-refresh ${loading ? 'bx-spin' : ''} me-2`}></i>
                    Refresh Statistics
                </Button>
            </div>

            {/* Summary Cards */}
            <Row className="mb-4">
                {renderStatCard(
                    <Calendar className="text-primary" size={24} />,
                    'Total Bookings',
                    statistics.total_bookings.toLocaleString(),
                    'Confirmed bookings',
                    'primary'
                )}
                {renderStatCard(
                    <DollarSign className="text-success" size={24} />,
                    'Total Revenue',
                    `Rp ${statistics.total_revenue.toLocaleString()}`,
                    'All time revenue',
                    'success'
                )}
                {renderStatCard(
                    <Users className="text-info" size={24} />,
                    'Total Visitors',
                    statistics.total_visitors.toLocaleString(),
                    'Unique visitors',
                    'info'
                )}
                {renderStatCard(
                    <div className="text-warning">
                        <i className="bx bx-calendar-event bx-lg"></i>
                    </div>,
                    'Total Events',
                    statistics.total_events.toLocaleString(),
                    'Events held',
                    'warning'
                )}
            </Row>

            <Row className="mb-4">
                {renderStatCard(
                    <div className="text-primary">
                        <i className="bx bx-user-plus bx-lg"></i>
                    </div>,
                    'Total Followers',
                    statistics.total_followers.toLocaleString(),
                    'People following',
                    'primary'
                )}
                {renderStatCard(
                    <MessageSquare className="text-info" size={24} />,
                    'Total Reviews',
                    statistics.total_reviews.toLocaleString(),
                    'Customer reviews',
                    'info'
                )}
                {renderStatCard(
                    <Star className="text-warning" size={24} />,
                    'Average Rating',
                    statistics.average_rating.toFixed(1),
                    'Out of 5.0',
                    'warning'
                )}
                {renderStatCard(
                    <div className="text-success">
                        <i className="bx bx-trophy bx-lg"></i>
                    </div>,
                    'Rating Score',
                    <div className="d-flex align-items-center gap-1">
                        {renderRatingStars(statistics.average_rating)}
                    </div>,
                    `${statistics.total_reviews} reviews`,
                    'success'
                )}
            </Row>

            {/* Performance Indicators */}
            <Card className="mb-4">
                <Card.Header className="bg-light">
                    <h6 className="mb-0">
                        <i className="bx bx-chart me-2"></i>
                        Performance Metrics
                    </h6>
                </Card.Header>
                <Card.Body>
                    <Row>
                        <Col md={6} className="mb-3">
                            <div className="d-flex justify-content-between mb-2">
                                <span className="fw-semibold">Booking Rate</span>
                                <span className="text-muted">
                                    {statistics.total_followers > 0
                                        ? ((statistics.total_bookings / statistics.total_followers) * 100).toFixed(1)
                                        : 0}%
                                </span>
                            </div>
                            <ProgressBar
                                now={statistics.total_followers > 0
                                    ? (statistics.total_bookings / statistics.total_followers) * 100
                                    : 0}
                                variant="primary"
                                style={{ height: '10px' }}
                            />
                        </Col>
                        <Col md={6} className="mb-3">
                            <div className="d-flex justify-content-between mb-2">
                                <span className="fw-semibold">Review Rate</span>
                                <span className="text-muted">
                                    {statistics.total_bookings > 0
                                        ? ((statistics.total_reviews / statistics.total_bookings) * 100).toFixed(1)
                                        : 0}%
                                </span>
                            </div>
                            <ProgressBar
                                now={statistics.total_bookings > 0
                                    ? (statistics.total_reviews / statistics.total_bookings) * 100
                                    : 0}
                                variant="info"
                                style={{ height: '10px' }}
                            />
                        </Col>
                        <Col md={6} className="mb-3">
                            <div className="d-flex justify-content-between mb-2">
                                <span className="fw-semibold">Average Revenue per Booking</span>
                                <span className="text-success fw-semibold">
                                    Rp {statistics.total_bookings > 0
                                        ? (statistics.total_revenue / statistics.total_bookings).toLocaleString()
                                        : 0}
                                </span>
                            </div>
                        </Col>
                        <Col md={6} className="mb-3">
                            <div className="d-flex justify-content-between mb-2">
                                <span className="fw-semibold">Rating Quality</span>
                                <span className="text-warning fw-semibold">
                                    {statistics.average_rating >= 4.5
                                        ? 'Excellent'
                                        : statistics.average_rating >= 4.0
                                            ? 'Very Good'
                                            : statistics.average_rating >= 3.5
                                                ? 'Good'
                                                : statistics.average_rating >= 3.0
                                                    ? 'Average'
                                                    : 'Needs Improvement'}
                                </span>
                            </div>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>

            {/* Quick Stats */}
            <Card>
                <Card.Header className="bg-light">
                    <h6 className="mb-0">
                        <i className="bx bx-info-circle me-2"></i>
                        Facility Info
                    </h6>
                </Card.Header>
                <Card.Body>
                    <Row>
                        <Col md={6} className="mb-2">
                            <strong>Facility ID:</strong> {statistics.facility_id}
                        </Col>
                        <Col md={6} className="mb-2">
                            <strong>Total Revenue:</strong>{' '}
                            <span className="text-success fw-semibold">
                                Rp {statistics.total_revenue.toLocaleString()}
                            </span>
                        </Col>
                        <Col md={6} className="mb-2">
                            <strong>Created:</strong> {statistics.created_at
                                ? new Date(statistics.created_at).toLocaleDateString()
                                : 'N/A'}
                        </Col>
                        <Col md={6} className="mb-2">
                            <strong>Last Updated:</strong> {statistics.updated_at
                                ? new Date(statistics.updated_at).toLocaleString()
                                : 'N/A'}
                        </Col>
                    </Row>
                </Card.Body>
            </Card>
        </div>
    );
};

export default FacilityStatisticsTab;
