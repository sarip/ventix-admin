/**
 * Facility Profiling Content
 * Reusable component for displaying profiling tabs in form modal
 */

import React, { useState, useEffect } from 'react';
import { Alert, Spinner } from 'react-bootstrap';
import { InFacility } from '@/models/Facility';
import FacilityGalleryTab from './_gallery';
import FacilityAmenitiesTab from './_amenities';
import FacilityFeaturesTab from './_features';
import FacilityOperatingHoursTab from './_operating-hours';
import FacilityRulesTab from './_rules';

interface ProfilingContentProps {
    facilityId: number;
    type: 'gallery' | 'amenities' | 'features' | 'operating-hours' | 'rules';
}

const FacilityProfilingContent: React.FC<ProfilingContentProps> = ({ facilityId, type }) => {
    const [facility, setFacility] = useState<InFacility | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [refreshKey, setRefreshKey] = useState<number>(0);

    useEffect(() => {
        // Load facility data based on facilityId
        const loadFacility = async () => {
            setLoading(true);
            try {
                const FacilityModel = new Facility();
                const response = await FacilityModel.detail(facilityId);
                setFacility(response);
            } catch (error) {
                console.error('Failed to load facility:', error);
            } finally {
                setLoading(false);
            }
        };

        loadFacility();
    }, [facilityId, refreshKey]);

    const handleRefresh = () => {
        setRefreshKey(prev => prev + 1);
    };

    if (loading) {
        return (
            <div className="text-center py-5">
                <Spinner animation="border" variant="primary" />
                <p className="mt-3 text-muted">Loading facility data...</p>
            </div>
        );
    }

    if (!facility) {
        return (
            <Alert variant="danger">
                <i className="bx bx-error-circle me-2"></i>
                Failed to load facility data. Please try again.
            </Alert>
        );
    }

    // Render the appropriate tab content based on type
    switch (type) {
        case 'gallery':
            return (
                <FacilityGalleryTab
                    facility={facility}
                    refreshKey={refreshKey}
                    onRefresh={handleRefresh}
                />
            );
        case 'amenities':
            return (
                <FacilityAmenitiesTab
                    facility={facility}
                    refreshKey={refreshKey}
                    onRefresh={handleRefresh}
                />
            );
        case 'features':
            return (
                <FacilityFeaturesTab
                    facility={facility}
                    refreshKey={refreshKey}
                    onRefresh={handleRefresh}
                />
            );
        case 'operating-hours':
            return (
                <FacilityOperatingHoursTab
                    facility={facility}
                    refreshKey={refreshKey}
                    onRefresh={handleRefresh}
                />
            );
        case 'rules':
            return (
                <FacilityRulesTab
                    facility={facility}
                    refreshKey={refreshKey}
                    onRefresh={handleRefresh}
                />
            );
        default:
            return (
                <Alert variant="warning">
                    Unknown profiling type.
                </Alert>
            );
    }
};

export default FacilityProfilingContent;
