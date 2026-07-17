/**
 * Facility Detail Page
 */

import React, { useEffect, useState } from 'react';
import { Button, Badge, Card, Row, Col, Spinner, Alert, Table, Tab, Nav } from 'react-bootstrap';
import useBlockUI from '@/pages/_components/useBlockUI';
import { useRouter } from 'next/router';
import { Facility, InFacility, InFacilityForm } from '@/models/Facility';
import { showToast } from '@/utils/toast';
import FacilityProfilingModal from './_profiling';
import FacilityFormModal from './_form';
import { API_BASE_URL } from '@/lib/ApiClient';

const FacilityDetailPage: React.FC = () => {
    const { blockUI, unblockUI } = useBlockUI();
    const router = useRouter();
    const { id } = router.query;
    const [facility, setFacility] = useState<InFacility | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [showProfiling, setShowProfiling] = useState<boolean>(false);
    const [showEditForm, setShowEditForm] = useState<boolean>(false);
    const [activeTab, setActiveTab] = useState<string>('overview');
    const FacilityModel = new Facility();

    const loadFacility = async () => {
        if (!id || typeof id !== 'string') {
            setLoading(false);
            return;
        }

        blockUI();
        try {
            const response = await FacilityModel.detail(parseInt(id));
            setFacility(response.facility);
        } catch (error) {
            console.error('Error loading facility:', error);
            showToast('Failed to load facility details', 'error');
        } finally {
            unblockUI();
            setLoading(false);
        }
    };

    useEffect(() => {
        if (id && typeof id === 'string') {
            loadFacility();
        }
    }, [id]);

    const getAvailabilityBadge = (is_available: boolean) => {
        return is_available ?
            <Badge bg="success">Active</Badge> :
            <Badge bg="secondary">Inactive</Badge>;
    };

    const getCategoryBadge = (category: string) => {
        const colors: Record<string, string> = {
            'Sports': 'primary',
            'Gaming': 'info',
            'Music': 'danger',
            'Others': 'secondary'
        };
        return <Badge bg={colors[category] || 'secondary'}>{category}</Badge>;
    };

    const getDayName = (dayOfWeek: number) => {
        const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        return days[dayOfWeek - 1] || 'Unknown';
    };

    if (loading) {
        return (
            <div className="container-p-y">
                <div className="text-center py-5">
                    <Spinner animation="border" variant="primary" />
                    <p className="mt-3 text-muted">Loading facility details...</p>
                </div>
            </div>
        );
    }

    if (!facility) {
        return (
            <div className="container-p-y">
                <Alert variant="danger">
                    <i className="bx bx-error-circle me-2"></i>
                    Facility not found
                </Alert>
            </div>
        );
    }

    const galleryImages = facility.facility_gallery || [];
    const amenities = facility.facility_amenities || [];
    const features = facility.facility_features || [];
    const operatingHours = facility.facility_operating_hours || [];
    const rules = facility.facility_rules || [];

    return (
        <>
            <div className="container-p-y">
                {/* Breadcrumb */}
                <div className="breadcrumb-wrapper mb-0">
                    <h4 className="py-2 mb-0">Facility Details</h4>
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item">
                                <a href="/facility">
                                    <i className="bx bx-buildings"></i> Facilities
                                </a>
                            </li>
                            <li className="breadcrumb-item active">{facility.name}</li>
                        </ol>
                    </nav>
                </div>
            </div>

            <div className="card mt-2">
                {/* Banner Image */}
                {(facility as any).banner_image && (
                    <div style={{ width: '100%', height: '300px', overflow: 'hidden', borderTopLeftRadius: '8px', borderTopRightRadius: '8px' }}>
                        <img
                            src={`${API_BASE_URL}/${(facility as any).banner_image}`}
                            alt={`${facility.name} Banner`}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                    </div>
                )}

                <div className="card-body">
                    {/* Header */}
                    <div className="d-flex justify-content-between align-items-start mb-4">
                        <div className="flex-grow-1">
                            <h3 className="mb-2">
                                <i className="bx bx-building me-2"></i>
                                {facility.name}
                            </h3>
                            <div className="d-flex gap-2 align-items-center">
                                {getCategoryBadge(facility.category)}
                                {getAvailabilityBadge(!!facility.is_available)}
                                <Badge bg="info" className="ms-auto">
                                    <i className="bx bx-hash me-1"></i>
                                    ID: {facility.id}
                                </Badge>
                            </div>
                        </div>
                        <div className="d-flex gap-2">
                            <Button
                                variant="primary"
                                size="sm"
                                onClick={() => setShowEditForm(true)}
                            >
                                <i className="bx bx-edit me-1"></i>
                                Edit
                            </Button>
                            <Button
                                variant="secondary"
                                size="sm"
                                onClick={() => router.push('/facility')}
                            >
                                <i className="bx bx-arrow-back me-1"></i>
                                Back
                            </Button>
                        </div>
                    </div>

                    {/* Tabs */}
                    <Tab.Container activeKey={activeTab} onSelect={(k) => setActiveTab(k as string)}>
                        <Nav variant="pills" className="mb-4">
                            <Nav.Item>
                                <Nav.Link eventKey="overview">
                                    <i className="bx bx-info-circle me-1"></i>
                                    Overview
                                </Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link eventKey="gallery">
                                    <i className="bx bx-image me-1"></i>
                                    Gallery ({galleryImages.length})
                                </Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link eventKey="amenities">
                                    <i className="bx bx-grid-small me-1"></i>
                                    Amenities ({amenities.length})
                                </Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link eventKey="features">
                                    <i className="bx bx-list-ul me-1"></i>
                                    Features ({features.length})
                                </Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link eventKey="hours">
                                    <i className="bx bx-time-five me-1"></i>
                                    Hours
                                </Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link eventKey="rules">
                                    <i className="bx bx-file me-1"></i>
                                    Rules ({rules.length})
                                </Nav.Link>
                            </Nav.Item>
                        </Nav>
                        <Tab.Content>

                            {/* Overview Tab */}
                            <Tab.Pane eventKey="overview">
                                <Row className="g-4">
                                    <Col lg={8}>
                                        <Card className="border-0 shadow-sm mb-4">
                                            <Card.Header className="bg-light">
                                                <h6 className="mb-0">
                                                    <i className="bx bx-building me-2"></i>
                                                    About Facility
                                                </h6>
                                            </Card.Header>
                                            <Card.Body>
                                                <Row>
                                                    <Col md={6} className="mb-3">
                                                        <label className="text-muted fw-semibold small">Facility Name</label>
                                                        <div className="fs-5 fw-semibold">{facility.name}</div>
                                                    </Col>
                                                    <Col md={6} className="mb-3">
                                                        <label className="text-muted fw-semibold small">Category</label>
                                                        <div>{getCategoryBadge(facility.category)}</div>
                                                    </Col>
                                                    <Col md={12} className="mb-3">
                                                        <label className="text-muted fw-semibold small">Description</label>
                                                        <div>{facility.description || <span className="text-muted">No description provided</span>}</div>
                                                    </Col>
                                                    <Col md={6} className="mb-3">
                                                        <label className="text-muted fw-semibold small">Status</label>
                                                        <div>{getAvailabilityBadge(!!facility.is_available)}</div>
                                                    </Col>
                                                    <Col md={6} className="mb-3">
                                                        <label className="text-muted fw-semibold small">Created Date</label>
                                                        <div>{new Date(facility.created_at).toLocaleDateString()}</div>
                                                    </Col>
                                                    {facility.slug && (
                                                        <Col md={6} className="mb-3">
                                                            <label className="text-muted fw-semibold small">Slug</label>
                                                            <div className="font-monospace">{facility.slug}</div>
                                                        </Col>
                                                    )}
                                                    {facility.email && (
                                                        <Col md={6} className="mb-3">
                                                            <label className="text-muted fw-semibold small">Email</label>
                                                            <div><a href={`mailto:${facility.email}`}>{facility.email}</a></div>
                                                        </Col>
                                                    )}
                                                    {facility.phone && (
                                                        <Col md={6} className="mb-3">
                                                            <label className="text-muted fw-semibold small">Phone</label>
                                                            <div>{facility.phone}</div>
                                                        </Col>
                                                    )}
                                                    {facility.address && (
                                                        <Col md={12} className="mb-3">
                                                            <label className="text-muted fw-semibold small">Address</label>
                                                            <div>{facility.address}</div>
                                                        </Col>
                                                    )}
                                                    {(facility.latitude || facility.longitude) && (
                                                        <Col md={12} className="mb-3">
                                                            <label className="text-muted fw-semibold small">Coordinates</label>
                                                            <div className="d-flex gap-3">
                                                                <span className="text-muted small">Lat: {facility.latitude}</span>
                                                                <span className="text-muted small">Lng: {facility.longitude}</span>
                                                                <a
                                                                    href={`https://maps.google.com?q=${facility.latitude},${facility.longitude}`}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="small"
                                                                >
                                                                    <i className="bx bx-map me-1"></i>View on Map
                                                                </a>
                                                            </div>
                                                        </Col>
                                                    )}
                                                </Row>
                                            </Card.Body>
                                        </Card>

                                        {/* PIC & Organizer */}
                                        <Card className="border-0 shadow-sm">
                                            <Card.Header className="bg-light">
                                                <h6 className="mb-0">
                                                    <i className="bx bx-user me-2"></i>
                                                    Contacts & Organization
                                                </h6>
                                            </Card.Header>
                                            <Card.Body>
                                                <Row>
                                                    <Col md={6} className="mb-4">
                                                        <label className="text-muted fw-semibold small mb-2">Person in Charge</label>
                                                        {facility.user_pic ? (
                                                            <div className="d-flex align-items-center gap-3 p-3 bg-light rounded">
                                                                <div className="avatar bg-primary text-white rounded-circle d-flex align-items-center justify-content-center"
                                                                    style={{ width: '50px', height: '50px', fontSize: '1.2rem' }}>
                                                                    {facility.user_pic.name.charAt(0).toUpperCase()}
                                                                </div>
                                                                <div>
                                                                    <div className="fw-bold">{facility.user_pic.name}</div>
                                                                    <div className="text-muted small">{facility.user_pic.email}</div>
                                                                    {facility.user_pic.phone && (
                                                                        <div className="text-muted small">
                                                                            <i className="bx bx-phone me-1"></i>
                                                                            {facility.user_pic.phone}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <div className="text-muted">No PIC assigned</div>
                                                        )}
                                                    </Col>
                                                    <Col md={6} className="mb-4">
                                                        <label className="text-muted fw-semibold small mb-2">Facility Organizer</label>
                                                        {facility.facility_organizer ? (
                                                            <div className="p-3 bg-light rounded">
                                                                <div className="fw-bold">{facility.facility_organizer.facility_name}</div>
                                                                <div className="text-muted small">{facility.facility_organizer.company_name}</div>
                                                                <div className="text-muted small">
                                                                    <i className="bx bx-envelope me-1"></i>
                                                                    {facility.facility_organizer.email}
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <div className="text-muted">No organizer info</div>
                                                        )}
                                                    </Col>
                                                </Row>
                                            </Card.Body>
                                        </Card>
                                    </Col>

                                    {/* Sidebar - Quick Stats */}
                                    <Col lg={4}>
                                        <Card className="border-0 shadow-sm mb-4">
                                            <Card.Header className="bg-light">
                                                <h6 className="mb-0">
                                                    <i className="bx bx-chart me-2"></i>
                                                    Quick Stats
                                                </h6>
                                            </Card.Header>
                                            <Card.Body>
                                                <div className="d-flex justify-content-between mb-3">
                                                    <span className="text-muted">Gallery Photos</span>
                                                    <Badge bg="primary">{galleryImages.length}</Badge>
                                                </div>
                                                <div className="d-flex justify-content-between mb-3">
                                                    <span className="text-muted">Amenities</span>
                                                    <Badge bg="success">{amenities.length}</Badge>
                                                </div>
                                                <div className="d-flex justify-content-between mb-3">
                                                    <span className="text-muted">Features</span>
                                                    <Badge bg="info">{features.length}</Badge>
                                                </div>
                                                <div className="d-flex justify-content-between mb-3">
                                                    <span className="text-muted">Operating Days</span>
                                                    <Badge bg="warning">
                                                        {operatingHours.filter((h: any) => !h.is_closed).length}
                                                    </Badge>
                                                </div>
                                                <div className="d-flex justify-content-between">
                                                    <span className="text-muted">Rules</span>
                                                    <Badge bg="secondary">{rules.length}</Badge>
                                                </div>
                                            </Card.Body>
                                        </Card>

                                        {/* Preview Gallery */}
                                        {galleryImages.length > 0 && (
                                            <Card className="border-0 shadow-sm">
                                                <Card.Header className="bg-light">
                                                    <h6 className="mb-0">
                                                        <i className="bx bx-image me-2"></i>
                                                        Gallery Preview
                                                    </h6>
                                                </Card.Header>
                                                <Card.Body>
                                                    <div className="d-flex gap-2 flex-wrap">
                                                        {galleryImages.slice(0, 3).map((img: any) => (
                                                            <img
                                                                key={img.id}
                                                                src={`${API_BASE_URL}/${img.image}`}
                                                                alt={img.title}
                                                                className="rounded"
                                                                style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                                                            />
                                                        ))}
                                                    </div>
                                                    <div className="text-center mt-2">
                                                        <Button
                                                            variant="link"
                                                            size="sm"
                                                            onClick={() => setActiveTab('gallery')}
                                                        >
                                                            View All ({galleryImages.length})
                                                        </Button>
                                                    </div>
                                                </Card.Body>
                                            </Card>
                                        )}
                                    </Col>
                                </Row>
                            </Tab.Pane>

                            {/* Gallery Tab */}
                            <Tab.Pane eventKey="gallery">
                                <Row className="g-4">
                                    {galleryImages.length > 0 ? (
                                        galleryImages.map((img: any) => (
                                            <Col key={img.id} xs={12} sm={6} md={4} lg={3}>
                                                <Card className="border-0 shadow-sm h-100">
                                                    <div style={{ paddingTop: '75%' }} className="position-relative bg-light">
                                                        <img
                                                            src={`${API_BASE_URL}/${img.image}`}
                                                            alt={img.title}
                                                            className="position-absolute top-0 start-0 w-100 h-100 object-fit-cover"
                                                            style={{ borderTopLeftRadius: '8px', borderTopRightRadius: '8px' }}
                                                        />
                                                        {img.is_featured && (
                                                            <Badge bg="warning" className="position-absolute top-0 end-0 m-2">
                                                                <i className="bx bx-star"></i> Featured
                                                            </Badge>
                                                        )}
                                                    </div>
                                                    <Card.Body className="p-2">
                                                        <div className="fw-semibold small text-truncate">{img.title || 'Untitled'}</div>
                                                        {img.description && (
                                                            <div className="text-muted small text-truncate" title={img.description}>
                                                                {img.description}
                                                            </div>
                                                        )}
                                                    </Card.Body>
                                                </Card>
                                            </Col>
                                        ))
                                    ) : (
                                        <Col xs={12}>
                                            <div className="text-center py-5 text-muted">
                                                <i className="bx bx-image bx-lg mb-2 d-block"></i>
                                                <p>No gallery images uploaded</p>
                                            </div>
                                        </Col>
                                    )}
                                </Row>
                            </Tab.Pane>

                            {/* Amenities Tab */}
                            <Tab.Pane eventKey="amenities">
                                <Row className="g-4">
                                    {amenities.length > 0 ? (
                                        amenities.map((item: any) => (
                                            <Col key={item.id} xs={12} sm={6} md={4} lg={3}>
                                                <Card className="border-0 shadow-sm text-center h-100">
                                                    <Card.Body className="p-3 d-flex flex-column align-items-center">
                                                        <div className="avatar bg-primary bg-opacity-10 text-white rounded-circle d-flex align-items-center justify-content-center mb-2"
                                                            style={{ width: '60px', height: '60px' }}>
                                                            <i className={`fa ${item.icon || 'fa-star'} fa-2x`}></i>
                                                        </div>
                                                        <div className="fw-semibold">{item.name}</div>
                                                        {item.description && (
                                                            <div className="text-muted small text-truncate" title={item.description}>
                                                                {item.description}
                                                            </div>
                                                        )}
                                                    </Card.Body>
                                                </Card>
                                            </Col>
                                        ))
                                    ) : (
                                        <Col xs={12}>
                                            <div className="text-center py-5 text-muted">
                                                <i className="bx bx-grid-small bx-lg mb-2 d-block"></i>
                                                <p>No amenities added</p>
                                            </div>
                                        </Col>
                                    )}
                                </Row>
                            </Tab.Pane>

                            {/* Features Tab */}
                            <Tab.Pane eventKey="features">
                                <Card className="border-0 shadow-sm">
                                    <Card.Body className="p-0">
                                        {features.length > 0 ? (
                                            <Table hover borderless>
                                                <thead className="bg-light">
                                                    <tr>
                                                        <th style={{ width: '50px' }} className="text-center">#</th>
                                                        <th>Specification</th>
                                                        <th>Value</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {features.map((feature: any, index: number) => (
                                                        <tr key={feature.id}>
                                                            <td className="text-center">{index + 1}</td>
                                                            <td className="fw-semibold">{feature.feature_name}</td>
                                                            <td>{feature.feature_value}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </Table>
                                        ) : (
                                            <div className="text-center py-5 text-muted">
                                                <i className="bx bx-list-ul bx-lg mb-2 d-block"></i>
                                                <p>No specifications added</p>
                                            </div>
                                        )}
                                    </Card.Body>
                                </Card>
                            </Tab.Pane>

                            {/* Operating Hours Tab */}
                            <Tab.Pane eventKey="hours">
                                <Card className="border-0 shadow-sm">
                                    <Card.Body className="p-0">
                                        {operatingHours.length > 0 ? (
                                            <Table hover borderless>
                                                <thead className="bg-light">
                                                    <tr>
                                                        <th style={{ width: '150px' }}>Day</th>
                                                        <th>Open Time</th>
                                                        <th>Close Time</th>
                                                        <th className="text-center">Status</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {operatingHours.map((hours: any) => (
                                                        <tr key={hours.id}>
                                                            <td className="fw-semibold">{getDayName(hours.day_of_week)}</td>
                                                            <td>{hours.open_time || '-'}</td>
                                                            <td>{hours.close_time || '-'}</td>
                                                            <td className="text-center">
                                                                {hours.is_closed ? (
                                                                    <Badge bg="secondary">Closed</Badge>
                                                                ) : (
                                                                    <Badge bg="success">Open</Badge>
                                                                )}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </Table>
                                        ) : (
                                            <div className="text-center py-5 text-muted">
                                                <i className="bx bx-time-five bx-lg mb-2 d-block"></i>
                                                <p>No operating hours set</p>
                                            </div>
                                        )}
                                    </Card.Body>
                                </Card>
                            </Tab.Pane>

                            {/* Rules Tab */}
                            <Tab.Pane eventKey="rules">
                                <Card className="border-0 shadow-sm">
                                    <Card.Body>
                                        {rules.length > 0 ? (
                                            <ol className="mb-0" style={{ paddingLeft: '1.5rem' }}>
                                                {rules.map((rule: any, index: number) => (
                                                    <li key={rule.id} className="mb-3">
                                                        <span className="fw-semibold">Rule {index + 1}:</span>
                                                        <span className="ms-2">{rule.rule_text}</span>
                                                    </li>
                                                ))}
                                            </ol>
                                        ) : (
                                            <div className="text-center py-5 text-muted">
                                                <i className="bx bx-file bx-lg mb-2 d-block"></i>
                                                <p>No rules defined</p>
                                            </div>
                                        )}
                                    </Card.Body>
                                </Card>
                            </Tab.Pane>
                        </Tab.Content>
                    </Tab.Container>
                </div>
            </div>

            {/* PROFILING MODAL */}
            {showProfiling && (
                <FacilityProfilingModal
                    facility={facility}
                    show={showProfiling}
                    onHide={() => setShowProfiling(false)}
                />
            )}

            {/* EDIT FORM MODAL */}
            {showEditForm && (
                <FacilityFormModal
                    title="Edit Facility"
                    data={{
                        id: facility.id,
                        name: facility.name,
                        facility_organizer_id: facility.facility_organizer_id,
                        category: facility.category,
                        description: facility.description,
                        user_id_pic: facility.user_id_pic,
                        is_available: facility.is_available,
                        facility_gallery: facility.facility_gallery || [],
                        facility_amenities: facility.facility_amenities || [],
                        facility_features: facility.facility_features || [],
                        facility_operating_hours: facility.facility_operating_hours || [],
                        facility_rules: facility.facility_rules || [],
                    } as InFacilityForm}
                    onHide={() => setShowEditForm(false)}
                    onSave={() => {
                        showToast('Facility updated successfully', 'success');
                        setShowEditForm(false);
                        loadFacility();
                    }}
                    validationError={[]}
                />
            )}
        </>
    );
};

export default FacilityDetailPage;
