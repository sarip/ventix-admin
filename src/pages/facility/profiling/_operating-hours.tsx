/**
 * Facility Operating Hours Tab Component
 */

import React, { useState, useEffect, useRef } from 'react';
import { Button, Card, Form, Row, Col, Badge, Modal } from 'react-bootstrap';
import { InFacility, Facility } from '@/models/Facility';
import {
    FacilityOperatingHour,
    DAY_NAMES,
    DAY_SHORT_NAMES,
    DayOfWeek,
    WeeklyHours
} from '@/types/facility';
import useBlockUI from '@/pages/_components/useBlockUI';
import { showToast } from '@/utils/toast';

interface OperatingHoursTabProps {
    facility: InFacility | null;
    refreshKey: number;
    onRefresh: () => void;
    onDataChange?: (data: any[]) => void;
    isStepMode?: boolean;
    initialData?: any[];
}

const FacilityOperatingHoursTab: React.FC<OperatingHoursTabProps> = ({ facility, refreshKey, onRefresh, onDataChange, isStepMode = false, initialData }) => {
    const { blockUI, unblockUI } = useBlockUI();
    const [hours, setHours] = useState<FacilityOperatingHour[]>(initialData || []);
    const FacilityModel = new Facility();
    const [weeklyHours, setWeeklyHours] = useState<WeeklyHours>({});
    const [showCopyModal, setShowCopyModal] = useState(false);
    const [copyFrom, setCopyFrom] = useState<DayOfWeek>(1);
    const [copyTo, setCopyTo] = useState<DayOfWeek[]>([]);

    // Notify parent of data changes
    useEffect(() => {
        if (onDataChange) {
            onDataChange(hours);
        }
    }, [hours, onDataChange]);

    // Sync initialData → weeklyHours/hours ONLY ONCE on mount.
    // After that, weeklyHours is the local source of truth managed via handleDayChange.
    // Re-syncing on every initialData change causes infinite loop:
    //   onDataChange → parent state → new initialData ref → setWeeklyHours → useEffect[weeklyHours] → setHours → onDataChange → ...
    const didSyncRef = useRef(false);
    useEffect(() => {
        if (initialData && isStepMode && !didSyncRef.current) {
            didSyncRef.current = true;
            setHours(initialData);

            // Convert to weeklyHours format for UI display
            const weekly: WeeklyHours = {};
            initialData.forEach((hour: FacilityOperatingHour) => {
                if (hour && hour.day_of_week) {
                    weekly[hour.day_of_week] = {
                        open_time: hour.open_time,
                        close_time: hour.close_time,
                        is_closed: hour.is_closed || false
                    };
                }
            });
            // Use functional update to avoid stale closure issues
            setWeeklyHours(weekly);
        }
    }, [isStepMode]); // intentionally NOT including initialData — only run once

    useEffect(() => {
        // Load hours whenever the facility exists (including step mode for editing)
        if (facility && facility.id && !isStepMode) {
            loadHours();
        } else if (!facility?.id && isStepMode && !initialData) {
            // Only clear if no initialData provided
            setHours([]);
            setWeeklyHours({});
        }
        // Don't reset when initialData changes - let the sync useEffect handle it
    }, [refreshKey, facility?.id, isStepMode]);

    const loadHours = async () => {
        if (!facility || !facility.id) return;

        blockUI();
        try {
            const response = await FacilityModel.getOperatingHours(facility.id);
            const operatingHours = response.operating_hours;
            setHours(operatingHours);

            // Convert to weekly hours format
            const weekly: WeeklyHours = {};
            operatingHours.forEach((hour: FacilityOperatingHour) => {
                weekly[hour.day_of_week] = {
                    open_time: hour.open_time,
                    close_time: hour.close_time,
                    is_closed: hour.is_closed
                };
            });
            setWeeklyHours(weekly);
        } catch (error) {
            showToast('Failed to load operating hours', 'error');
        } finally {
            unblockUI();
        }
    };

    const handleDayChange = (day: DayOfWeek, field: 'open_time' | 'close_time' | 'is_closed', value: any) => {
        setWeeklyHours(prev => {
            const updated = {
                ...prev,
                [day]: {
                    ...prev[day],
                    [field]: value
                }
            };

            // Auto-push to parent in step mode so SaveAll always has latest data
            if (isStepMode && onDataChange) {
                const hoursArray: any[] = [];
                Object.entries(updated).forEach(([d, data]) => {
                    if (data && (data.open_time || data.close_time || data.is_closed)) {
                        hoursArray.push({
                            day_of_week: parseInt(d) as DayOfWeek,
                            open_time: data.open_time || null,
                            close_time: data.close_time || null,
                            is_closed: data.is_closed || false,
                            is_holiday_schedule: false,
                            _isNew: true
                        });
                    }
                });
                onDataChange(hoursArray);
            }

            return updated;
        });
    };

    const handleSave = async () => {
        // In step mode, convert weeklyHours to array format for parent
        if (isStepMode) {
            const hoursArray: any[] = [];
            Object.entries(weeklyHours).forEach(([day, data]) => {
                if (data && (data.open_time || data.close_time || data.is_closed)) {
                    hoursArray.push({
                        id: Date.now() + parseInt(day), // Temporary ID
                        day_of_week: parseInt(day) as DayOfWeek,
                        open_time: data.open_time || null,
                        close_time: data.close_time || null,
                        is_closed: data.is_closed || false,
                        is_holiday_schedule: false,
                        _isNew: true
                    });
                }
            });
            setHours(hoursArray);
            // Notify parent of the changes
            if (onDataChange) {
                onDataChange(hoursArray);
            }
            showToast('Schedule saved! Will be submitted with the form', 'success');
            return;
        }

        blockUI();
        try {
            await FacilityModel.syncOperatingHours(facility.id, { hours: weeklyHours });
            showToast('Operating hours saved successfully', 'success');
            onRefresh();
        } catch (error) {
            showToast('Failed to save operating hours', 'error');
        } finally {
            unblockUI();
        }
    };

    const handleCopy = async () => {
        blockUI();
        try {
            await FacilityModel.copyOperatingHours(facility.id, {
                from_day: copyFrom,
                to_days: copyTo
            });
            showToast('Hours copied successfully', 'success');
            setShowCopyModal(false);
            onRefresh();
        } catch (error) {
            showToast('Failed to copy hours', 'error');
        } finally {
            unblockUI();
        }
    };

    const renderDayRow = (day: DayOfWeek) => {
        const dayData = weeklyHours[day] || { is_closed: false };
        const isClosed = dayData.is_closed;

        return (
            <Row key={day} className="align-items-center mb-3 p-3 bg-light rounded">
                <Col md={3}>
                    <div className="fw-bold">{DAY_NAMES[day]}</div>
                    {isClosed && (
                        <Badge bg="danger" className="mt-1">Closed</Badge>
                    )}
                </Col>
                <Col md={3}>
                    <Form.Label className="small text-muted">Open Time</Form.Label>
                    <Form.Control
                        type="time"
                        value={dayData.open_time || ''}
                        onChange={(e) => handleDayChange(day, 'open_time', e.target.value)}
                        disabled={isClosed}
                    />
                </Col>
                <Col md={3}>
                    <Form.Label className="small text-muted">Close Time</Form.Label>
                    <Form.Control
                        type="time"
                        value={dayData.close_time || ''}
                        onChange={(e) => handleDayChange(day, 'close_time', e.target.value)}
                        disabled={isClosed}
                    />
                </Col>
                <Col md={3}>
                    <Form.Check
                        type="checkbox"
                        label="Closed on this day"
                        checked={isClosed}
                        onChange={(e) => handleDayChange(day, 'is_closed', e.target.checked)}
                        className="mt-4"
                    />
                </Col>
            </Row>
        );
    };

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <div>
                    <h5 className="mb-1">
                        <i className="bx bx-time-five me-2"></i>
                        Operating Hours
                    </h5>
                    <small className="text-muted">
                        Weekly schedule
                    </small>
                </div>
                <div className="d-flex gap-2">
                    {!isStepMode && (
                        <Button
                            variant="outline-info"
                            size="sm"
                            onClick={() => {
                                setCopyFrom(1);
                                setCopyTo([]);
                                setShowCopyModal(true);
                            }}
                        >
                            <i className="bx bx-copy me-2"></i>
                            Copy Hours
                        </Button>
                    )}
                    <Button
                        variant="primary"
                        size="sm"
                        onClick={handleSave}
                    >
                        <i className="bx bx-save me-2"></i>
                        {isStepMode ? 'Apply Hours' : 'Save Schedule'}
                    </Button>
                </div>
            </div>

            <Card>
                <Card.Body>
                    {[1, 2, 3, 4, 5, 6, 7].map((day) => renderDayRow(day as DayOfWeek))}
                </Card.Body>
            </Card>

            {/* Copy Modal */}
            <Form as={Modal} show={showCopyModal} onHide={() => setShowCopyModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>
                        <i className="bx bx-copy me-2"></i>
                        Copy Operating Hours
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group className="mb-3">
                        <Form.Label>Copy From</Form.Label>
                        <Form.Select
                            value={copyFrom}
                            onChange={(e) => setCopyFrom(parseInt(e.target.value) as DayOfWeek)}
                        >
                            {[1, 2, 3, 4, 5, 6, 7].map(day => (
                                <option key={day} value={day}>{DAY_NAMES[day]}</option>
                            ))}
                        </Form.Select>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Copy To (hold Ctrl/Cmd to select multiple)</Form.Label>
                        <Form.Select
                            multiple
                            value={copyTo}
                            onChange={(e) => {
                                const values = Array.from(e.target.selectedOptions).map(opt => parseInt(opt.value));
                                setCopyTo(values as DayOfWeek[]);
                            }}
                            style={{ height: '200px' }}
                        >
                            {[1, 2, 3, 4, 5, 6, 7].map(day => (
                                <option key={day} value={day}>{DAY_NAMES[day]}</option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowCopyModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleCopy}>
                        <i className="bx bx-copy me-2"></i>
                        Copy Hours
                    </Button>
                </Modal.Footer>
            </Form>
        </div>
    );
};

export default FacilityOperatingHoursTab;
