/**
 * Facility Pricing Modal
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Modal, Button, Table, Badge } from 'react-bootstrap';
import Swal from 'sweetalert2';
import { InFacility } from '@/models/Facility';
import { FacilityPricing, InFacilityPricing, InFacilityPricingForm, DayType } from '@/models/FacilityPricing';
import { showToast } from '@/utils/toast';
import useBlockUI from '@/pages/_components/useBlockUI';
import FacilityPricingForm from './_pricing_form';
import {buildQuery} from "@/lib/FilterDriver";

interface PricingModalProps {
    facility: InFacility;
    onHide: () => void;
}

interface ValidationErrorProps {
    field: string;
    message: string;
}

const FacilityPricingModal: React.FC<PricingModalProps> = ({ facility, onHide }) => {
    const { blockUI, unblockUI } = useBlockUI();
    const [pricings, setPricings] = useState<InFacilityPricing[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState<InFacilityPricingForm>({
        facility_id: facility.id,
        day_type: 'Weekday',
        start_time: '',
        end_time: '',
        price_per_hour: 0
    });
    const [validationError, setValidationError] = useState<ValidationErrorProps[]>([]);
    const PricingModel = new FacilityPricing();

    useEffect(() => {
        loadPricings();
    }, []);

    const loadPricings = async () => {
        blockUI();
        try {
            const query  = {
                filter: buildQuery({
                    facility_id: facility.id,
                }),
            };
            console.log({'query' : query})

            const response = await PricingModel.list(query);
            setPricings(response.facility_pricing || []);
        } catch (error) {
            showToast('Failed to load pricings', 'error');
        } finally {
            unblockUI();
        }
    };

    const create = () => {
        setFormData({
            facility_id: facility.id,
            day_type: 'Weekday',
            start_time: '',
            end_time: '',
            price_per_hour: 0
        });
        setValidationError([]);
        setShowForm(true);
    };

    const update = (pricing: InFacilityPricing) => {
        setFormData({
            id: pricing.id,
            facility_id: pricing.facility_id,
            day_type: pricing.day_type,
            start_time: pricing.start_time,
            end_time: pricing.end_time,
            price_per_hour: pricing.price_per_hour
        });
        setValidationError([]);
        setShowForm(true);
    };

    const save = useCallback(async (data: InFacilityPricingForm) => {
        try {
            // Check overlap
            const overlapCheck = await PricingModel.checkOverlap(data);
            if (overlapCheck.has_overlap) {
                showToast('Time range overlaps with existing pricing rule', 'error');
                return;
            }

            if (data.id) {
                await PricingModel.update(data.id, data);
            } else {
                await PricingModel.create(data);
            }
            showToast(`Pricing successfully ${data.id ? 'updated' : 'created'}`, 'success');
            setShowForm(false);
            loadPricings();
        } catch (error: any) {
            let lines = error.message.trim().split('\n');
            let result: ValidationErrorProps[] = lines.map((line: string) => {
                let [field, ...message] = line.split(' ');
                return { field, message: message.join(' ') };
            });
            setValidationError(result);
        }
    }, []);

    const remove = async (id: number) => {
        Swal.fire({
            title: "Are you sure?",
            text: "Delete this pricing rule?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
        }).then(async (result) => {
            if (result.isConfirmed) {
                const response = await PricingModel.delete(id);
                if (response.success) {
                    showToast("Pricing deleted successfully", "success");
                    loadPricings();
                }
            }
        });
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(amount);
    };

    const getDayTypeBadge = (dayType: DayType) => {
        const badges = {
            'Weekday': 'primary',
            'Weekend': 'success',
            'Holiday': 'danger'
        };
        return <Badge bg={badges[dayType]}>{dayType}</Badge>;
    };

    return (
        <>
            <Modal show={true} onHide={onHide} size="lg" centered>
                <Modal.Header closeButton>
                    <Modal.Title>
                        <i className="bx bx-dollar me-2"></i>
                        Pricing Rules - {facility.name}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="d-flex justify-content-between mb-3">
                        <div>
                            <small className="text-muted">Manage pricing rules for different day types and time ranges</small>
                        </div>
                        <Button variant="primary" size="sm" onClick={create}>
                            <i className="bx bx-plus me-1"></i>
                            Add Pricing
                        </Button>
                    </div>

                    <Table bordered hover size="sm">
                        <thead className="table-light">
                            <tr>
                                <th>Day Type</th>
                                <th>Time Range</th>
                                <th>Price/Hour</th>
                                <th style={{ width: '100px' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pricings.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="text-center py-3 text-muted">
                                        No pricing rules yet
                                    </td>
                                </tr>
                            ) : (
                                pricings.map((pricing) => (
                                    <tr key={pricing.id}>
                                        <td>{getDayTypeBadge(pricing.day_type)}</td>
                                        <td>
                                            <span className="font-monospace">
                                                {pricing.start_time} - {pricing.end_time}
                                            </span>
                                        </td>
                                        <td className="fw-bold text-success">
                                            {formatCurrency(pricing.price_per_hour)}
                                        </td>
                                        <td>
                                            <div className="d-flex gap-1">
                                                <button
                                                    className="btn btn-sm btn-icon btn-warning"
                                                    onClick={() => update(pricing)}
                                                >
                                                    <i className="bx bx-edit"></i>
                                                </button>
                                                <button
                                                    className="btn btn-sm btn-icon btn-danger"
                                                    onClick={() => remove(pricing.id)}
                                                >
                                                    <i className="bx bx-trash"></i>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </Table>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={onHide}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>

            {showForm && (
                <FacilityPricingForm
                    title={formData.id ? 'Edit Pricing' : 'Add Pricing'}
                    data={formData}
                    onHide={() => setShowForm(false)}
                    onSave={save}
                    validationError={validationError}
                />
            )}
        </>
    );
};

export default FacilityPricingModal;
