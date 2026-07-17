/**
 * Facility Amenities Tab Component (Step Mode Compatible)
 */

import React, { useState, useEffect, useRef } from 'react';
import { Button, Card, Row, Col, Badge, Form } from 'react-bootstrap';
import { InFacility, Facility } from '@/models/Facility';
import {
    FacilityAmenity,
    DEFAULT_AMENITIES
} from '@/types/facility';
import useBlockUI from '@/pages/_components/useBlockUI';
import { showToast } from '@/utils/toast';

interface AmenitiesTabProps {
    facility: InFacility | null;
    refreshKey: number;
    onRefresh: () => void;
    onDataChange?: (data: any[]) => void;
    isStepMode?: boolean;
    initialData?: any[];
}

const FacilityAmenitiesTab: React.FC<AmenitiesTabProps> = ({
    facility,
    refreshKey,
    onRefresh,
    onDataChange,
    isStepMode = false,
    initialData
}) => {
    const { blockUI, unblockUI } = useBlockUI();
    const [allAmenities, setAllAmenities] = useState<FacilityAmenity[]>([]);
    const [selectedAmenities, setSelectedAmenities] = useState<number[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const FacilityModel = new Facility();

    // Notify parent of data changes
    useEffect(() => {
        if (onDataChange && allAmenities.length > 0) {
            const selectedData = allAmenities
                .filter(a => selectedAmenities.includes(a.id))
                .map(a => ({
                    ...a,
                    _isNew: false,
                    _isDeleted: false
                }));
            onDataChange(selectedData);
        }
    }, [selectedAmenities, allAmenities, onDataChange]);

    // Sync initialData → selectedAmenities ONLY ONCE (on first load).
    // After that, selectedAmenities is the local source of truth.
    // Re-syncing on every initialData change causes the flicker/double-click bug
    // because onDataChange → parent state update → new initialData ref → overwrite.
    const didSyncRef = useRef(false);
    useEffect(() => {
        if (initialData && isStepMode && allAmenities.length > 0 && !didSyncRef.current) {
            didSyncRef.current = true;
            // const amenityIds = initialData.map((item: any) => item.id);
            const amenityIds = initialData.map(
                                                    (item: any) => item.amenity_id ?? item.id
                                                );
            setSelectedAmenities(amenityIds);
        }
    }, [allAmenities]); // intentionally only depends on allAmenities loading, not initialData

    // Track if we've loaded all amenities to prevent infinite loop
    const hasLoadedAllAmenities = useRef(false);

    useEffect(() => {
        if (facility && facility.id && !isStepMode) {
            // Normal mode: load facility's amenities + all amenities
            loadAmenities();
            hasLoadedAllAmenities.current = false;
        } else if (facility && facility.id && isStepMode) {
            // Step/edit mode with existing facility: pre-load selections
            loadAllAmenities();
        } else if (!facility?.id && isStepMode && !hasLoadedAllAmenities.current) {
            // New facility step mode: load all amenities for selection
            loadAllAmenities();
            hasLoadedAllAmenities.current = true;
        }
    }, [refreshKey, facility?.id, isStepMode]);

    const loadAllAmenities = async () => {
        try {
            const allResponse = await FacilityModel.getAllAmenities();
            setAllAmenities(allResponse.amenities);
            // Don't reset selectedAmenities - let it be managed by user interaction and initialData sync
            // setSelectedAmenities([]);  // ❌ Don't reset
        } catch (error) {
            showToast('Failed to load amenities', 'error');
        }
    };

    const loadAmenities = async () => {
        if (!facility || !facility.id) {
            loadAllAmenities();
            return;
        }

        blockUI();
        try {
            // Load all amenities
            const allResponse = await FacilityModel.getAllAmenities();
            setAllAmenities(allResponse.amenities);

            // Load facility amenities
            const facilityResponse = await FacilityModel.getAmenities(facility.id);
            console.log('Facility amenities loaded:', facilityResponse.amenities);
            // setSelectedAmenities(
            //     facilityResponse.amenities.map((a: FacilityAmenity) => a.id)
            // );
            setSelectedAmenities(
    facilityResponse.amenities.map(
        (a: any) => a.amenity_id ?? a.id
    )
);
        } catch (error) {
            showToast('Failed to load amenities', 'error');
        } finally {
            unblockUI();
        }
    };

    const handleToggle = async (amenityId: number) => {
        // In step mode, just update local state
        if (isStepMode) {
            const newSelected = selectedAmenities.includes(amenityId)
                ? selectedAmenities.filter(id => id !== amenityId)
                : [...selectedAmenities, amenityId];
            setSelectedAmenities(newSelected);
            return;
        }

        if (!facility || !facility.id) {
            showToast('Please save the facility first', 'info');
            return;
        }

        const newSelected = selectedAmenities.includes(amenityId)
            ? selectedAmenities.filter(id => id !== amenityId)
            : [...selectedAmenities, amenityId];

        await syncAmenities(newSelected);
    };

    const syncAmenities = async (amenityIds: number[]) => {
        if (!facility || !facility.id) {
            showToast('Please save the facility first', 'info');
            return;
        }

        blockUI();
        try {
            await FacilityModel.syncAmenities(facility.id, amenityIds);
            setSelectedAmenities(amenityIds);
            showToast('Amenities updated successfully', 'success');
        } catch (error) {
            showToast('Failed to update amenities', 'error');
        } finally {
            unblockUI();
        }
    };

    const filteredAmenities = allAmenities.filter(a =>
        a.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div>
            {!facility && !isStepMode && (
                <div className="alert alert-info mb-3">
                    <i className="bx bx-info-circle me-2"></i>
                    Please save the facility basic information first before managing amenities.
                </div>
            )}
            <div className="d-flex justify-content-between align-items-center mb-3">
                <div>
                    <h5 className="mb-1">
                        <i className="bx bx-grid-small me-2"></i>
                        Facility Amenities
                    </h5>
                    <small className="text-muted">
                        {selectedAmenities.length} selected
                    </small>
                </div>
                <Form.Control
                    type="text"
                    placeholder="Search amenities..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ width: '250px' }}
                />
            </div>

            {filteredAmenities.length === 0 ? (
                <Card className="text-center p-5">
                    <i className="bx bx-search bx-lg text-muted mb-3 d-block"></i>
                    <p className="text-muted mb-3">No amenities found</p>
                </Card>
            ) : (
                <Row className="g-3">
                    {filteredAmenities.map((amenity) => {
                        const isSelected = selectedAmenities.includes(amenity.id);
                        return (
                            <Col key={amenity.id} xs={12} sm={6} md={4} lg={3}>
                                <Card
                                    className={`h-100 cursor-pointer transition-all ${isSelected
                                        ? 'border-primary bg-light-primary'
                                        : 'hover-shadow'
                                        }`}
                                    onClick={() => handleToggle(amenity.id)}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <Card.Body className="p-3 text-center">
                                        <div className="mb-2">
                                            <i className={`${amenity.icon || 'fa fa-circle'}`}></i>
                                        </div>
                                        <div className="fw-bold mb-1">{amenity.name}</div>
                                        <small className="text-muted text-truncate d-block">
                                            {amenity.description}
                                        </small>
                                        {isSelected && (
                                            <Badge bg="primary" className="mt-2">
                                                <i className="bx bx-check me-1"></i>
                                                Selected
                                            </Badge>
                                        )}
                                    </Card.Body>
                                </Card>
                            </Col>
                        );
                    })}
                </Row>
            )}
        </div>
    );
};

export default FacilityAmenitiesTab;
