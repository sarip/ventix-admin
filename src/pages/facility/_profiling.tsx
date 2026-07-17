/**
 * Facility Profiling Modal
 * Complete facility profiling management with tabs
 */

import React, { useState } from 'react';
import { Modal, Button, Nav, Tab } from 'react-bootstrap';
import { InFacility } from '@/models/Facility';
import FacilityGalleryTab from './profiling/_gallery';
import FacilityAmenitiesTab from './profiling/_amenities';
import FacilityFeaturesTab from './profiling/_features';
import FacilityOperatingHoursTab from './profiling/_operating-hours';
import FacilityRulesTab from './profiling/_rules';
import FacilityStatisticsTab from './profiling/_statistics';

interface ProfilingProps {
    facility: InFacility;
    show: boolean;
    onHide: () => void;
}

const FacilityProfilingModal: React.FC<ProfilingProps> = ({ facility, show, onHide }) => {
    const [activeTab, setActiveTab] = useState<string>('gallery');
    const [refreshKey, setRefreshKey] = useState<number>(0);

    const handleTabSelect = (tabKey: string | null) => {
        if (tabKey) setActiveTab(tabKey);
    };

    const handleRefresh = () => {
        setRefreshKey(prev => prev + 1);
    };

    return (
        <Modal
            show={show}
            onHide={onHide}
            fullscreen={true}
            backdrop="static"
            keyboard={false}
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title>
                    <i className="bx bx-building me-2"></i>
                    Facility Profiling - {facility.name}
                </Modal.Title>
            </Modal.Header>

            <Modal.Body className="p-0">
                <Tab.Container
                    activeKey={activeTab}
                    onSelect={handleTabSelect}
                    id="facility-profiling-tabs"
                >
                    <div className="d-flex">
                        {/* Sidebar Navigation */}
                        <div className="border-end bg-light" style={{ width: '280px', minHeight: '600px' }}>
                            <div className="p-3">
                                <h6 className="text-uppercase text-muted mb-3">
                                    <small>Profiling Sections</small>
                                </h6>

                                <Nav variant="pills" className="flex-column">
                                    <Nav.Item>
                                        <Nav.Link eventKey="gallery" className="d-flex align-items-center">
                                            <i className="bx bx-image me-2"></i>
                                            <div>
                                                <div className="fw-bold">Gallery</div>
                                                <small className="text-muted">Manage photos</small>
                                            </div>
                                        </Nav.Link>
                                    </Nav.Item>

                                    <Nav.Item>
                                        <Nav.Link eventKey="amenities" className="d-flex align-items-center">
                                            <i className="bx bx-grid-small me-2"></i>
                                            <div>
                                                <div className="fw-bold">Amenities</div>
                                                <small className="text-muted">Facilities & services</small>
                                            </div>
                                        </Nav.Link>
                                    </Nav.Item>

                                    <Nav.Item>
                                        <Nav.Link eventKey="features" className="d-flex align-items-center">
                                            <i className="bx bx-list-ul me-2"></i>
                                            <div>
                                                <div className="fw-bold">Specifications</div>
                                                <small className="text-muted">Technical details</small>
                                            </div>
                                        </Nav.Link>
                                    </Nav.Item>

                                    <Nav.Item>
                                        <Nav.Link eventKey="operating-hours" className="d-flex align-items-center">
                                            <i className="bx bx-time-five me-2"></i>
                                            <div>
                                                <div className="fw-bold">Operating Hours</div>
                                                <small className="text-muted">Schedule & availability</small>
                                            </div>
                                        </Nav.Link>
                                    </Nav.Item>

                                    <Nav.Item>
                                        <Nav.Link eventKey="rules" className="d-flex align-items-center">
                                            <i className="bx bx-file me-2"></i>
                                            <div>
                                                <div className="fw-bold">Rules</div>
                                                <small className="text-muted">Usage policies</small>
                                            </div>
                                        </Nav.Link>
                                    </Nav.Item>

                                    <Nav.Item>
                                        <Nav.Link eventKey="statistics" className="d-flex align-items-center">
                                            <i className="bx bx-bar-chart me-2"></i>
                                            <div>
                                                <div className="fw-bold">Statistics</div>
                                                <small className="text-muted">Analytics & metrics</small>
                                            </div>
                                        </Nav.Link>
                                    </Nav.Item>
                                </Nav>
                            </div>
                        </div>

                        {/* Tab Content */}
                        <div className="flex-grow-1 p-4" style={{ maxWidth: 'calc(100% - 280px)', overflowY: 'auto' }}>
                            <Tab.Content>
                                {/* Gallery Tab */}
                                <Tab.Pane eventKey="gallery">
                                    <FacilityGalleryTab
                                        facility={facility}
                                        refreshKey={refreshKey}
                                        onRefresh={handleRefresh}
                                    />
                                </Tab.Pane>

                                {/* Amenities Tab */}
                                <Tab.Pane eventKey="amenities">
                                    <FacilityAmenitiesTab
                                        facility={facility}
                                        refreshKey={refreshKey}
                                        onRefresh={handleRefresh}
                                    />
                                </Tab.Pane>

                                {/* Features Tab */}
                                <Tab.Pane eventKey="features">
                                    <FacilityFeaturesTab
                                        facility={facility}
                                        refreshKey={refreshKey}
                                        onRefresh={handleRefresh}
                                    />
                                </Tab.Pane>

                                {/* Operating Hours Tab */}
                                <Tab.Pane eventKey="operating-hours">
                                    <FacilityOperatingHoursTab
                                        facility={facility}
                                        refreshKey={refreshKey}
                                        onRefresh={handleRefresh}
                                    />
                                </Tab.Pane>

                                {/* Rules Tab */}
                                <Tab.Pane eventKey="rules">
                                    <FacilityRulesTab
                                        facility={facility}
                                        refreshKey={refreshKey}
                                        onRefresh={handleRefresh}
                                    />
                                </Tab.Pane>

                                {/* Statistics Tab */}
                                <Tab.Pane eventKey="statistics">
                                    <FacilityStatisticsTab
                                        facility={facility}
                                        refreshKey={refreshKey}
                                        onRefresh={handleRefresh}
                                    />
                                </Tab.Pane>
                            </Tab.Content>
                        </div>
                    </div>
                </Tab.Container>
            </Modal.Body>

            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>
                    <i className="bx bx-x me-2"></i>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default FacilityProfilingModal;
