/**
 * Facility Rules Tab Component
 */

import React, { useState, useEffect, useRef } from 'react';
import { Button, Card, Form, Modal } from 'react-bootstrap';
import { InFacility, Facility } from '@/models/Facility';
import {
    FacilityRule,
    FacilityRuleFormData,
    EXAMPLE_RULES
} from '@/types/facility';
import useBlockUI from '@/pages/_components/useBlockUI';
import { showToast } from '@/utils/toast';

interface RulesTabProps {
    facility: InFacility | null;
    refreshKey: number;
    onRefresh: () => void;
    onDataChange?: (data: any[]) => void;
    isStepMode?: boolean;
    initialData?: any[];
}

const FacilityRulesTab: React.FC<RulesTabProps> = ({ facility, refreshKey, onRefresh, onDataChange, isStepMode = false, initialData }) => {
    const { blockUI, unblockUI } = useBlockUI();
    const [rules, setRules] = useState<FacilityRule[]>(initialData || []);
    const FacilityModel = new Facility();
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [formData, setFormData] = useState<FacilityRuleFormData>({
        rule_text: '',
        sort_order: 0
    });
    const [editData, setEditData] = useState<{
        id: number;
        rule_text: string;
        sort_order: number;
    }>({
        id: 0,
        rule_text: '',
        sort_order: 0
    });

    // Notify parent of data changes
    useEffect(() => {
        if (onDataChange) {
            onDataChange(rules);
        }
    }, [rules, onDataChange]);

    // Sync with initialData only when content actually changes (prevent infinite re-render)
    const lastInitialDataJson = useRef<string>('');
    useEffect(() => {
        if (initialData && isStepMode) {
            const json = JSON.stringify(initialData);
            if (json !== lastInitialDataJson.current) {
                lastInitialDataJson.current = json;
                setRules(initialData);
            }
        }
    }, [initialData, isStepMode]);

    useEffect(() => {
        // Load rules whenever the facility exists (including step mode for editing)
        if (facility && facility.id && !isStepMode) {
            loadRules();
        } else if (!facility?.id && isStepMode && !initialData) {
            setRules([]);
        }
    }, [refreshKey, facility?.id, isStepMode, initialData]);

    const loadRules = async () => {
        if (!facility || !facility.id) return;

        blockUI();
        try {
            const response = await FacilityModel.getRules(facility.id);
            setRules(response.rules);
        } catch (error) {
            showToast('Failed to load rules', 'error');
        } finally {
            unblockUI();
        }
    };

    const handleAdd = async () => {
        if (!formData.rule_text.trim()) {
            showToast('Rule text is required', 'warning');
            return;
        }

        // In step mode, just add to local state
        if (isStepMode) {
            const newRule: any = {
                id: Date.now(), // Temporary ID
                rule_text: formData.rule_text,
                sort_order: formData.sort_order || rules.length + 1,
                _isNew: true
            };
            setRules([...rules, newRule]);
            setShowAddModal(false);
            setFormData({ rule_text: '', sort_order: rules.length + 2 });
            showToast('Rule added! Will be saved when you submit the form', 'success');
            return;
        }

        // blockUI();
        // try {
        //     await FacilityModel.addRule(facility.id, formData);
        //     showToast('Rule added successfully', 'success');
        //     setShowAddModal(false);
        //     setFormData({ rule_text: '', sort_order: 0 });
        //     onRefresh();
        // } catch (error) {
        //     showToast('Failed to add rule', 'error');
        // } finally {
        //     unblockUI();
        // }
    };

    const handleUpdate = async () => {
        // In step mode, just update local state
        if (isStepMode) {
            const updated = rules.map(r => {
                if (r.id === editData.id) {
                    return {
                        ...r,
                        rule_text: editData.rule_text,
                        sort_order: editData.sort_order
                    };
                }
                return r;
            });
            setRules(updated);
            setShowEditModal(false);
            showToast('Rule updated successfully', 'success');
            return;
        }

        // blockUI();
        // try {
        //     await FacilityModel.updateRule(facility.id, editData.id, {
        //         rule_text: editData.rule_text,
        //         sort_order: editData.sort_order
        //     });
        //     showToast('Rule updated successfully', 'success');
        //     setShowEditModal(false);
        //     onRefresh();
        // } catch (error) {
        //     showToast('Failed to update rule', 'error');
        // } finally {
        //     unblockUI();
        // }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this rule?')) return;

        // In step mode, just mark as deleted in local state
        if (isStepMode) {
            const updated = rules.map(r => {
                if (r.id === id) {
                    return { ...r, _isDeleted: true };
                }
                return r;
            });
            setRules(updated);
            showToast('Rule removed', 'success');
            return;
        }

        // blockUI();
        // try {
        //     await FacilityModel.deleteRule(facility.id, id);
        //     showToast('Rule deleted successfully', 'success');
        //     onRefresh();
        // } catch (error) {
        //     showToast('Failed to delete rule', 'error');
        // } finally {
        //     unblockUI();
        // }
    };

    const loadExampleRules = async () => {
        if (!facility || !facility.id) {
            showToast('Please save the facility first', 'warning');
            return;
        }

        const nextOrder = rules.length > 0 ? Math.max(...rules.map(r => r.sort_order)) + 1 : 1;

        blockUI();
        try {
            for (const rule of EXAMPLE_RULES) {
                const data = {
                    ...rule,
                    sort_order: nextOrder + EXAMPLE_RULES.indexOf(rule)
                };
                await FacilityModel.addRule(facility.id, data);
            }
            showToast('Example rules loaded', 'success');
            onRefresh();
        } catch (error) {
            console.error('Error loading example rules:', error);
            showToast('Failed to load example rules', 'error');
        } finally {
            unblockUI();
        }
    };

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <div>
                    <h5 className="mb-1">
                        <i className="bx bx-file me-2"></i>
                        Facility Rules
                    </h5>
                    <small className="text-muted">
                        {rules.length} rules
                    </small>
                </div>
                <div className="d-flex gap-2">
                    {rules.length === 0 && (
                        <Button
                            variant="outline-info"
                            size="sm"
                            onClick={loadExampleRules}
                        >
                            <i className="bx bx-download me-2"></i>
                            Load Examples
                        </Button>
                    )}
                    <Button
                        variant="primary"
                        size="sm"
                        onClick={() => {
                            const nextOrder = rules.length > 0 ? Math.max(...rules.map(r => r.sort_order)) + 1 : 1;
                            setFormData({ rule_text: '', sort_order: nextOrder });
                            setShowAddModal(true);
                        }}
                    >
                        <i className="bx bx-plus me-2"></i>
                        Add Rule
                    </Button>
                </div>
            </div>

            {rules.filter(r => !r._isDeleted).length === 0 ? (
                <Card className="text-center p-5">
                    <i className="bx bx-file-plus bx-lg text-muted mb-3 d-block"></i>
                    <p className="text-muted mb-3">No rules added yet</p>
                    <div className="d-flex gap-2 justify-content-center">
                        <Button variant="outline-primary" onClick={() => setShowAddModal(true)}>
                            <i className="bx bx-plus me-2"></i>
                            Add First Rule
                        </Button>
                        <Button
                            variant="outline-info"
                            onClick={loadExampleRules}
                            disabled={!facility || !facility.id}
                        >
                            <i className="bx bx-download me-2"></i>
                            Load Examples
                        </Button>
                    </div>
                </Card>
            ) : (
                <Card>
                    <div className="list-group list-group-flush">
                        {rules.filter(r => !r._isDeleted).map((rule, index) => (
                            <div key={rule.id} className="list-group-item d-flex align-items-center">
                                <div className="flex-shrink-0 me-3">
                                    <div className="badge bg-primary rounded-circle d-flex align-items-center justify-content-center"
                                        style={{ width: '40px', height: '40px' }}>
                                        {index + 1}
                                    </div>
                                </div>
                                <div className="flex-grow-1">
                                    <div className="fw-semibold">{rule.rule_text}</div>
                                    <small className="text-muted">Order: {rule.sort_order}</small>
                                </div>
                                <div className="d-flex gap-1">
                                    <Button
                                        variant="outline-primary"
                                        size="sm"
                                        onClick={() => {
                                            setEditData({
                                                id: rule.id,
                                                rule_text: rule.rule_text,
                                                sort_order: rule.sort_order
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
                                        onClick={() => handleDelete(rule.id)}
                                        title="Delete"
                                    >
                                        <i className="bx bx-trash"></i>
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            )}

            {/* Add Modal */}
            <Modal show={showAddModal} onHide={() => setShowAddModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>
                        <i className="bx bx-plus me-2"></i>
                        Add Rule
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group className="mb-3">
                        <Form.Label>Rule Text *</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={4}
                            value={formData.rule_text}
                            onChange={(e) => setFormData(prev => ({ ...prev, rule_text: e.target.value }))}
                            placeholder="e.g., No smoking, Wear sports shoes"
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
                        Edit Rule
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group className="mb-3">
                        <Form.Label>Rule Text *</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={4}
                            value={editData.rule_text}
                            onChange={(e) => setEditData(prev => ({ ...prev, rule_text: e.target.value }))}
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

export default FacilityRulesTab;
