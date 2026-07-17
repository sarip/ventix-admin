/**
 * Facility Features (Specifications) Tab Component
 */

import React, { useState, useEffect, useRef } from 'react';
import { Button, Card, Form, Modal, Table } from 'react-bootstrap';
import { InFacility, Facility } from '@/models/Facility';
import {
    FacilityFeature,
    FacilityFeatureFormData,
    EXAMPLE_FEATURES
} from '@/types/facility';
import useBlockUI from '@/pages/_components/useBlockUI';
import { showToast } from '@/utils/toast';

interface FeaturesTabProps {
    facility: InFacility | null;
    refreshKey: number;
    onRefresh: () => void;
    onDataChange?: (data: any[]) => void;
    isStepMode?: boolean;
    initialData?: any[];
}

const FacilityFeaturesTab: React.FC<FeaturesTabProps> = ({ facility, refreshKey, onRefresh, onDataChange, isStepMode = false, initialData }) => {
    const { blockUI, unblockUI } = useBlockUI();
    const [features, setFeatures] = useState<FacilityFeature[]>(initialData || []);
    const FacilityModel = new Facility();
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [formData, setFormData] = useState<FacilityFeatureFormData>({
        feature_name: '',
        feature_value: '',
        sort_order: 0
    });
    const [editData, setEditData] = useState<{
        id: number;
        feature_name: string;
        feature_value: string;
        sort_order: number;
    }>({
        id: 0,
        feature_name: '',
        feature_value: '',
        sort_order: 0
    });

    // Notify parent of data changes
    useEffect(() => {
        if (onDataChange) {
            onDataChange(features);
        }
    }, [features, onDataChange]);

    // Sync with initialData only when content actually changes (prevent infinite re-render)
    const lastInitialDataJson = useRef<string>('');
    useEffect(() => {
        if (initialData && isStepMode) {
            const json = JSON.stringify(initialData);
            if (json !== lastInitialDataJson.current) {
                lastInitialDataJson.current = json;
                setFeatures(initialData);
            }
        }
    }, [initialData, isStepMode]);

    useEffect(() => {
        // Load features whenever the facility exists (including step mode for editing)
        if (facility && facility.id && !isStepMode) {
            loadFeatures();
        } else if (!facility?.id && isStepMode && !initialData) {
            setFeatures([]);
        }
    }, [refreshKey, facility?.id, isStepMode, initialData]);

    const loadFeatures = async () => {
        if (!facility || !facility.id) return;

        blockUI();
        try {
            const response = await FacilityModel.getFeatures(facility.id);
            setFeatures(response.features);
        } catch (error) {
            showToast('Failed to load features', 'error');
        } finally {
            unblockUI();
        }
    };

    const handleAdd = async () => {
        if (!formData.feature_name || !formData.feature_value) {
            showToast('Feature name and value are required', 'warning');
            return;
        }

        // In step mode, just add to local state
        if (isStepMode) {
            const newFeature: any = {
                id: Date.now(), // Temporary ID
                feature_name: formData.feature_name,
                feature_value: formData.feature_value,
                sort_order: formData.sort_order,
                _isNew: true
            };
            setFeatures([...features, newFeature]);
            setShowAddModal(false);
            setFormData({ feature_name: '', feature_value: '', sort_order: features.length + 1 });
            showToast('Specification added! Will be saved when you submit the form', 'success');
            return;
        }

        if (!facility || !facility.id) {
            showToast('Please save the facility first', 'warning');
            return;
        }

        blockUI();
        try {
            await FacilityModel.addFeature(facility.id, formData);
            showToast('Feature added successfully', 'success');
            setShowAddModal(false);
            setFormData({ feature_name: '', feature_value: '', sort_order: 0 });
            onRefresh();
        } catch (error) {
            showToast('Failed to add feature', 'error');
        } finally {
            unblockUI();
        }
    };

    const handleUpdate = async () => {
        // In step mode, just update local state
        if (isStepMode) {
            const updated = features.map(f => {
                if (f.id === editData.id) {
                    return {
                        ...f,
                        feature_name: editData.feature_name,
                        feature_value: editData.feature_value,
                        sort_order: editData.sort_order
                    };
                }
                return f;
            });
            setFeatures(updated);
            setShowEditModal(false);
            showToast('Specification updated successfully', 'success');
            return;
        }

        // if (!facility || !facility.id) {
        //     showToast('Please save the facility first', 'warning');
        //     return;
        // }

        // blockUI();
        // try {
        //     await FacilityModel.updateFeature(facility.id, editData.id, {
        //         feature_name: editData.feature_name,
        //         feature_value: editData.feature_value,
        //         sort_order: editData.sort_order
        //     });
        //     showToast('Feature updated successfully', 'success');
        //     setShowEditModal(false);
        //     onRefresh();
        // } catch (error) {
        //     showToast('Failed to update feature', 'error');
        // } finally {
        //     unblockUI();
        // }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this feature?')) return;

        // In step mode, just mark as deleted in local state
        if (isStepMode) {
            const updated = features.map(f => {
                if (f.id === id) {
                    return { ...f, _isDeleted: true };
                }
                return f;
            });
            setFeatures(updated);
            showToast('Specification removed', 'success');
            return;
        }

        // if (!facility || !facility.id) {
        //     showToast('Please save the facility first', 'warning');
        //     return;
        // }

        // blockUI();
        // try {
        //     await FacilityModel.deleteFeature(facility.id, id);
        //     showToast('Feature deleted successfully', 'success');
        //     onRefresh();
        // } catch (error) {
        //     showToast('Failed to delete feature', 'error');
        // } finally {
        //     unblockUI();
        // }
    };

    const loadExampleFeatures = async () => {
        if (!facility || !facility.id) {
            showToast('Please save the facility first', 'warning');
            return;
        }

        const nextOrder = features.length > 0 ? Math.max(...features.map(f => f.sort_order)) + 1 : 1;

        blockUI();
        try {
            for (const feature of EXAMPLE_FEATURES) {
                const data = {
                    ...feature,
                    sort_order: nextOrder + EXAMPLE_FEATURES.indexOf(feature)
                };
                await FacilityModel.addFeature(facility.id, data);
            }
            showToast('Example features loaded', 'success');
            onRefresh();
        } catch (error) {
            console.error('Error loading example features:', error);
            showToast('Failed to load example features', 'error');
        } finally {
            unblockUI();
        }
    };

    return (
        <div>
            {!facility && !isStepMode && (
                <div className="alert alert-info mb-3">
                    <i className="bx bx-info-circle me-2"></i>
                    Please save the facility basic information first before managing specifications.
                </div>
            )}
            <div className="d-flex justify-content-between align-items-center mb-3">
                <div>
                    <h5 className="mb-1">
                        <i className="bx bx-list-ul me-2"></i>
                        Facility Specifications
                    </h5>
                    <small className="text-muted">
                        {features.length} specifications
                    </small>
                </div>
                <div className="d-flex gap-2">
                    {features.length === 0 && (
                        <Button
                            variant="outline-info"
                            size="sm"
                            onClick={loadExampleFeatures}
                            disabled={!facility || !facility.id}
                        >
                            <i className="bx bx-download me-2"></i>
                            Load Examples
                        </Button>
                    )}
                    <Button
                        variant="primary"
                        size="sm"
                        onClick={() => {
                            const nextOrder = features.length > 0 ? Math.max(...features.map(f => f.sort_order)) + 1 : 1;
                            setFormData({ feature_name: '', feature_value: '', sort_order: nextOrder });
                            setShowAddModal(true);
                        }}
                    >
                        <i className="bx bx-plus me-2"></i>
                        Add Specification
                    </Button>
                </div>
            </div>

            {features.filter(f => !f._isDeleted).length === 0 ? (
                <Card className="text-center p-5">
                    <i className="bx bx-list-plus bx-lg text-muted mb-3 d-block"></i>
                    <p className="text-muted mb-3">No specifications added yet</p>
                    <div className="d-flex gap-2 justify-content-center">
                        <Button variant="outline-primary" onClick={() => setShowAddModal(true)}>
                            <i className="bx bx-plus me-2"></i>
                            Add First Specification
                        </Button>
                        <Button
                            variant="outline-info"
                            onClick={loadExampleFeatures}
                            disabled={!facility || !facility.id}
                        >
                            <i className="bx bx-download me-2"></i>
                            Load Examples
                        </Button>
                    </div>
                </Card>
            ) : (
                <Card>
                    <Card.Body className="p-0">
                        <Table responsive hover className="mb-0">
                            <thead className="table-light">
                                <tr>
                                    <th style={{ width: '50px' }}>#</th>
                                    <th>Specification Name</th>
                                    <th>Value</th>
                                    <th style={{ width: '100px' }}>Order</th>
                                    <th style={{ width: '150px' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {features.filter(f => !f._isDeleted).map((feature, index) => (
                                    <tr key={feature.id}>
                                        <td>{index + 1}</td>
                                        <td className="fw-semibold">{feature.feature_name}</td>
                                        <td>{feature.feature_value}</td>
                                        <td>{feature.sort_order}</td>
                                        <td>
                                            <div className="d-flex gap-1">
                                                <Button
                                                    variant="outline-primary"
                                                    size="sm"
                                                    onClick={() => {
                                                        setEditData({
                                                            id: feature.id,
                                                            feature_name: feature.feature_name,
                                                            feature_value: feature.feature_value,
                                                            sort_order: feature.sort_order
                                                        });
                                                        setShowEditModal(true);
                                                    }}
                                                    title="Edit"
                                                >
                                                    <i className="bx bx-edit"></i>
                                                </Button>
                                                <Button
                                                    variant="outline-danger"
                                                    size="sm"
                                                    onClick={() => handleDelete(feature.id)}
                                                    title="Delete"
                                                >
                                                    <i className="bx bx-trash"></i>
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </Card.Body>
                </Card>
            )}

            {/* Add Modal */}
            <Modal show={showAddModal} onHide={() => setShowAddModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>
                        <i className="bx bx-plus me-2"></i>
                        Add Specification
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group className="mb-3">
                        <Form.Label>Specification Name *</Form.Label>
                        <Form.Control
                            type="text"
                            value={formData.feature_name}
                            onChange={(e) => setFormData(prev => ({ ...prev, feature_name: e.target.value }))}
                            placeholder="e.g., Total Court, Capacity"
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Value *</Form.Label>
                        <Form.Control
                            type="text"
                            value={formData.feature_value}
                            onChange={(e) => setFormData(prev => ({ ...prev, feature_value: e.target.value }))}
                            placeholder="e.g., 8, 500, LED"
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Sort Order</Form.Label>
                        <Form.Control
                            type="number"
                            value={formData.sort_order}
                            onChange={(e) => setFormData(prev => ({ ...prev, sort_order: parseInt(e.target.value) }))}
                        />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowAddModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleAdd}>
                        <i className="bx bx-check me-2"></i>
                        Add
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Edit Modal */}
            <Modal show={showEditModal} onHide={() => setShowEditModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>
                        <i className="bx bx-edit me-2"></i>
                        Edit Specification
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group className="mb-3">
                        <Form.Label>Specification Name *</Form.Label>
                        <Form.Control
                            type="text"
                            value={editData.feature_name}
                            onChange={(e) => setEditData(prev => ({ ...prev, feature_name: e.target.value }))}
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Value *</Form.Label>
                        <Form.Control
                            type="text"
                            value={editData.feature_value}
                            onChange={(e) => setEditData(prev => ({ ...prev, feature_value: e.target.value }))}
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Sort Order</Form.Label>
                        <Form.Control
                            type="number"
                            value={editData.sort_order}
                            onChange={(e) => setEditData(prev => ({ ...prev, sort_order: parseInt(e.target.value) }))}
                        />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowEditModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleUpdate}>
                        <i className="bx bx-check me-2"></i>
                        Update
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default FacilityFeaturesTab;
