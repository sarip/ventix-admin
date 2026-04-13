/**
 * Facility List Page
 */

import React, { useEffect, useState, useCallback } from 'react';
import { Button, Badge } from 'react-bootstrap';
import Swal from 'sweetalert2';
import useBlockUI from '@/pages/_components/useBlockUI';
import Pagination from '@/pages/_components/Pagination';
import { Facility, InFacility, InFacilityForm } from '@/models/Facility';
import { showToast } from '@/utils/toast';
import FacilityFormModal from './_form';
import FacilityPricingModal from './_pricing';
import Filter, { QueryParamsProps } from "./_filter";

interface PaginationProps {
    current_page: number;
    total: number;
    filtered_total: number;
    page_count: number;
    per_page: number;
}

interface ValidationErrorProps {
    field: string;
    message: string;
}

const FacilityListPage: React.FC = () => {
    const { blockUI, unblockUI } = useBlockUI();
    const [facilities, setFacilities] = useState<InFacility[]>([]);
    const [pagination, setPagination] = useState<PaginationProps | null>(null);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [categoryFilter, setCategoryFilter] = useState<string>('all');
    const [showForm, setShowForm] = useState(false);
    const [showPricing, setShowPricing] = useState(false);
    const [isInitialLoad, setIsInitialLoad] = useState<boolean>(true);
    const [pageCount, setPageCount] = useState<number>(0);
    const [lastQuery, setLastQuery] = useState<any>({});
    const [sortBy, setSortBy] = useState<string>('created_at');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
    const [selectedFacility, setSelectedFacility] = useState<InFacility | null>(null);
    const [formData, setFormData] = useState<InFacilityForm>({
        name: '',
        events_organizer_id: '',
        category: '',
        description: '',
        user_id_pic: 0,
        is_available: true
    });
    const [validationError, setValidationError] = useState<ValidationErrorProps[]>([]);
    const FacilityModel = new Facility();

    const handleSort = (column: string) => {
        if (sortBy === column) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(column);
            setSortOrder('asc');
        }
    };

    const getSortIcon = (column: string) => {
        if (sortBy !== column) return <i className="bx bx-sort ms-1"></i>;
        return sortOrder === 'asc'
            ? <i className="bx bx-sort-up ms-1"></i>
            : <i className="bx bx-sort-down ms-1"></i>;
    };

    const loadFacilities = async (query: QueryParamsProps = {}) => {
        if (isInitialLoad) blockUI();
        try {
            query.page = currentPage;
            query.sort_by = sortBy + ':' + sortOrder;
            const response = await FacilityModel.list(query);
            setFacilities(response.facilities || []);
            setPagination(response.pagination);
            setLastQuery(query);
            setPageCount(response.pagination.page_count);
        } catch (error) {
            showToast('Failed to load facilities', 'error');
        } finally {
            if (isInitialLoad) {
                unblockUI();
                setIsInitialLoad(false);
            }
        }
    };

    const create = () => {
        setFormData({
            name: '',
            events_organizer_id: '',
            category: '',
            description: '',
            user_id_pic: 0,
            is_available: true
        });
        setValidationError([]);
        setShowForm(true);
    };

    const update = (facility: InFacility) => {
        setFormData({
            id: facility.id,
            name: facility.name,
            events_organizer_id: facility.events_organizer_id,
            category: facility.category,
            description: facility.description,
            user_id_pic: facility.user_id_pic,
            is_available: facility.is_available
        });
        setValidationError([]);
        setShowForm(true);
    };

    const save = useCallback(async (data: InFacilityForm) => {
        try {
            if (data.id) {
                await FacilityModel.update(data.id, data);
            } else {
                await FacilityModel.create(data);
            }
            showToast(`Facility successfully ${data.id ? 'updated' : 'created'}`, 'success');
            setShowForm(false);
            loadFacilities(lastQuery);
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
            text: "Once deleted, you will not be able to recover this facility",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
            cancelButtonText: "Cancel",
        }).then(async (result) => {
            if (result.isConfirmed) {
                const response = await FacilityModel.delete(id);
                if (response.success) {
                    showToast("Facility successfully deleted", "success");
                    loadFacilities(lastQuery);
                }
            }
        });
    };

    const openPricing = (facility: InFacility) => {
        setSelectedFacility(facility);
        setShowPricing(true);
    };

    const getAvailabilityBadge = (is_available: boolean) => {
        return is_available ?
            <Badge bg="success">Active</Badge> :
            <Badge bg="secondary">Inactive</Badge>;
    };


    useEffect(() => {
        if (!isInitialLoad) loadFacilities(lastQuery);
    }, [currentPage]);

    useEffect(() => {
        if (!isInitialLoad) loadFacilities(lastQuery);
    }, [sortBy, sortOrder]);


    return (
        <>
            <div className=" container-p-y">
                <h4 className="py-2 breadcrumb-wrapper mb-0">Facility Management</h4>
                Manage your Facility Management
            </div>
            <Filter onSubmit={loadFacilities} />
            <div className="card mt-2">
                <h5 className="card-header d-flex border-top rounded-0 flex-wrap">
                    <div className="d-flex justify-content-start justify-content-md-end align-items-baseline ms-auto">
                        <Button variant="primary" onClick={create}>
                            <span><i className="bx bx-plus me-0 me-sm-1"></i></span>
                            <span className="d-none d-sm-inline-block">Add Data</span>
                        </Button>
                    </div>
                </h5>

                <div className="card-body">
                    {/* TABLE */}
                    <div className="table-responsive">
                        <table className="table table-hover">
                            <thead className="table-light">
                                <tr>
                                    <th style={{ width: '50px' }}>#</th>
                                    <th style={{ cursor: 'pointer' }} onClick={() => handleSort('name')}>Name {getSortIcon('name')}</th>
                                    <th style={{ cursor: 'pointer' }} onClick={() => handleSort('category')}>Category {getSortIcon('category')}</th>
                                    <th>PIC</th>
                                    <th style={{ cursor: 'pointer' }} onClick={() => handleSort('is_available')}>Availability {getSortIcon('is_available')}</th>
                                    <th style={{ width: '200px' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {facilities.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="text-center py-4 text-muted">
                                            <i className="bx bx-info-circle bx-lg mb-2 d-block"></i>
                                            No facilities found
                                        </td>
                                    </tr>
                                ) : (
                                    facilities.map((facility, index) => (
                                        <tr key={facility.id}>
                                            <td>{((currentPage - 1) * 10) + index + 1}</td>
                                            <td>
                                                <div className="fw-semibold">{facility.name}</div>
                                                <small className="text-muted">{facility.description}</small>
                                            </td>
                                            <td>{facility.category}</td>
                                            <td>
                                                {facility.user_pic ? (
                                                    <>
                                                        <div className="fw-semibold">{facility.user_pic.name}</div>
                                                        <small className="text-muted">{facility.user_pic.email}</small>
                                                    </>
                                                ) : (
                                                    <span className="text-muted">-</span>
                                                )}
                                            </td>
                                            <td>{getAvailabilityBadge(facility.is_available)}</td>
                                            <td>
                                                <div className="d-flex gap-1">
                                                    <button
                                                        className="btn btn-sm btn-icon btn-warning"
                                                        onClick={() => update(facility)}
                                                        title="Edit"
                                                    >
                                                        <i className="bx bx-edit"></i>
                                                    </button>
                                                    <button
                                                        className="btn btn-sm btn-icon btn-info"
                                                        onClick={() => openPricing(facility)}
                                                        title="Pricing"
                                                    >
                                                        <i className="bx bx-dollar"></i>
                                                    </button>
                                                    <button
                                                        className="btn btn-sm btn-icon btn-danger"
                                                        onClick={() => remove(facility.id)}
                                                        title="Delete"
                                                    >
                                                        <i className="bx bx-trash"></i>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* PAGINATION */}
                    {pagination && (
                        <div className="row mx-2 mt-4">
                            <div className="col-sm-12 col-md-6">
                                <div className="dataTables_info" role="status" aria-live="polite">
                                    Found {pagination.filtered_total} of {pagination.total} data,
                                    displaying {facilities.length} data
                                </div>
                            </div>
                            {pagination.page_count && (
                                <div className="col-sm-12 col-md-6 d-flex justify-content-end">
                                    <Pagination currentPage={currentPage} pageCount={pagination.page_count}
                                        onPageChange={setCurrentPage} />
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* FORM MODAL */}
            {showForm && (
                <FacilityFormModal
                    title={formData.id ? 'Edit Facility' : 'Add Facility'}
                    data={formData}
                    onHide={() => setShowForm(false)}
                    onSave={save}
                    validationError={validationError}
                />
            )}

            {/* PRICING MODAL */}
            {showPricing && selectedFacility && (
                <FacilityPricingModal
                    facility={selectedFacility}
                    onHide={() => setShowPricing(false)}
                />
            )}
        </>
    );
};

export default FacilityListPage;
