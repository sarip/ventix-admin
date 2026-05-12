/**
 * Status Dropdown Component for Booking
 */

import React, { useState, useEffect } from 'react';
import { Dropdown } from 'react-bootstrap';
import { FacilityBookingStatus, InFacilityBookingStatus } from '@/models/FacilityBookingStatus';

interface StatusDropdownProps {
    currentStatus: string;
    bookingId: number;
    onStatusChange: (id: number, status: string) => void;
    isLoading?: boolean;
}

const StatusDropdown: React.FC<StatusDropdownProps> = ({ currentStatus, bookingId, onStatusChange, isLoading = false }) => {
    const [statuses, setStatuses] = useState<InFacilityBookingStatus[]>([]);
    const StatusModel = new FacilityBookingStatus();

    useEffect(() => {
        loadStatuses();
    }, []);

    const loadStatuses = async () => {
        try {
            const response = await StatusModel.list();
            setStatuses(response.facilitybooking_status || []);
        } catch (error) {
            console.error('Failed to load statuses');
        }
    };

    const getStatusBadgeColor = (status: string) => {
        const statusMap: { [key: string]: string } = {
            'Pending': 'warning',
            'confirmed': 'primary',
            'completed': 'success',
            'cancelled': 'danger'
        };
        return statusMap[status] || 'secondary';
    };

    const currentStatusData = statuses.find(s => s.name === currentStatus);

    return (
        <Dropdown>
            <Dropdown.Toggle
                variant={getStatusBadgeColor(currentStatus)}
                size="sm"
                disabled={isLoading}
                style={{
                    backgroundColor: currentStatusData?.color_code,
                    borderColor: currentStatusData?.color_code,
                    opacity: isLoading ? 0.6 : 1,
                    cursor: isLoading ? 'not-allowed' : 'pointer'
                }}
            >
                {isLoading ? (
                    <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Updating...
                    </>
                ) : (
                    currentStatusData?.display_name || currentStatus
                )}
            </Dropdown.Toggle>

            <Dropdown.Menu>
                {statuses.map((status) => (
                    <Dropdown.Item
                        key={status.id}
                        onClick={() => onStatusChange(bookingId, status.name)}
                        active={currentStatus === status.name}
                        disabled={isLoading}
                    >
                        <span
                            className="badge me-2"
                            style={{
                                backgroundColor: status.color_code,
                                color: '#fff'
                            }}
                        >
                            {status.display_name}
                        </span>
                        <small className="text-muted">{status.description}</small>
                    </Dropdown.Item>
                ))}
            </Dropdown.Menu>
        </Dropdown>
    );
};

export default StatusDropdown;
