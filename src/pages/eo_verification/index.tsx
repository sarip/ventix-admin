/**
 * EO & Facility Verification Admin Page
 * Admin interface for reviewing, approving, and rejecting verification requests
 *
 * @author Sarip Hidayat <hidayatsarip2210@gmail.com>
 * @copyright Sarip Hidayat 2024
 * @date 2026-07-18
 */

import React, { useEffect, useState, useCallback } from 'react';
import { Badge } from 'react-bootstrap';
import Swal from 'sweetalert2';
import useBlockUI from '@/pages/_components/useBlockUI';
import Pagination from '@/pages/_components/Pagination';
import { InEventOrganizer } from '@/models/EventOrganizer';
import { InFacilityOrganizer } from '@/models/FacilityOrganizer';
import { EoVerification } from '@/models/EoVerification';
import { showToast } from '@/utils/toast';
import { useRouter } from 'next/router';
import { ListResponse } from '@/types/apiTypes';
import DetailModal from './_detail_modal';
import FacilityDetailModal from './_facility_detail_modal';

type VerificationStatus = 'Pending' | 'Approved' | 'Rejected' | '';

type VerificationTab = 'eo' | 'facility';

interface PaginationProps {
    current_page: number;
    total: number;
    filtered_total: number;
    page_count: number;
    per_page: number;
}

const STATUS_TABS: { label: string; value: VerificationStatus; variant: string }[] = [
    { label: 'All', value: '', variant: 'secondary' },
    { label: 'Pending', value: 'Pending', variant: 'warning' },
    { label: 'Approved', value: 'Approved', variant: 'success' },
    { label: 'Rejected', value: 'Rejected', variant: 'danger' },
];

const getStatusBadge = (status: string | undefined) => {
    switch (status) {
        case 'Approved': return <Badge bg="success">Approved</Badge>;
        case 'Rejected': return <Badge bg="danger">Rejected</Badge>;
        default: return <Badge bg="warning" text="dark">Pending</Badge>;
    }
};

const VerificationPage: React.FC = () => {
    const router = useRouter();
    const { blockUI, unblockUI } = useBlockUI();
    const [isInitialLoad, setIsInitialLoad] = useState<boolean>(true);
    const [activeTab, setActiveTab] = useState<VerificationTab>('eo');

    // Event Organizer State
    const [eoList, setEoList] = useState<InEventOrganizer[]>([]);
    const [eoPagination, setEoPagination] = useState<PaginationProps | null>(null);
    const [selectedEO, setSelectedEO] = useState<InEventOrganizer | null>(null);
    const [showEoDetail, setShowEoDetail] = useState<boolean>(false);

    // Facility State
    const [facilityList, setFacilityList] = useState<InFacilityOrganizer[]>([]);
    const [facilityPagination, setFacilityPagination] = useState<PaginationProps | null>(null);
    const [selectedFacility, setSelectedFacility] = useState<InFacilityOrganizer | null>(null);
    const [showFacilityDetail, setShowFacilityDetail] = useState<boolean>(false);

    // Common State
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [lastQuery, setLastQuery] = useState<any>({});
    const [search, setSearch] = useState<string>('');
    const [activeStatus, setActiveStatus] = useState<VerificationStatus>('');
    const [perPage, setPerPage] = useState<number>(10);
    const [sortBy, setSortBy] = useState<string>('created_at');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

    const Model = new EoVerification();

    const handleSort = (column: string) => {
        if (sortBy === column) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(column);
            setSortOrder('asc');
        }
    };

    const getSortIcon = (column: string) => {
        if (sortBy !== column) return <i className="bx bx-sort ms-1" />;
        return sortOrder === 'asc'
            ? <i className="bx bx-sort-up ms-1" />
            : <i className="bx bx-sort-down ms-1" />;
    };

    const listData = useCallback(async (query: Record<string, any> = {}) => {
        if (isInitialLoad) blockUI();
        try {
            const q = {
                ...query,
                page: currentPage,
                sort_by: sortBy + ':' + sortOrder,
                per_page: perPage,
            };
            setLastQuery(q);

            if (activeTab === 'eo') {
                const response: ListResponse<InEventOrganizer[]> = await Model.list(q);
                setEoList(response.events_organizer);
                setEoPagination(response.pagination);
            } else {
                const response: ListResponse<InFacilityOrganizer[]> = await Model.facilityList(q);
                setFacilityList(response.facilities_organizer);
                setFacilityPagination(response.pagination);
            }
        } catch (e: any) {
            if (e.status === 403) router.push('/403');
            unblockUI();
        } finally {
            if (isInitialLoad) {
                unblockUI();
                setIsInitialLoad(false);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeTab, currentPage, sortBy, sortOrder, perPage, isInitialLoad]);

    const buildAndSubmit = useCallback(() => {
        const query: Record<string, any> = { search };
        if (activeStatus) query.status = activeStatus;
        listData(query);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search, activeStatus, listData]);

    useEffect(() => {
        buildAndSubmit();
    }, [activeStatus, currentPage, sortBy, sortOrder, buildAndSubmit]);

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => buildAndSubmit(), 800);
        return () => clearTimeout(timer);
    }, [search, perPage, buildAndSubmit]);

    // Reset to page 1 when changing tabs
    useEffect(() => {
        setCurrentPage(1);
        setSearch('');
        setActiveStatus('');
        setSortBy('created_at');
        setSortOrder('desc');
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeTab]);

    const openEoDetail = (item: InEventOrganizer) => {
        setSelectedEO(item);
        setShowEoDetail(true);
    };

    const openFacilityDetail = (item: InFacilityOrganizer) => {
        setSelectedFacility(item);
        setShowFacilityDetail(true);
    };

    const handleEoApprove = async (id: number) => {
        const result = await Swal.fire({
            title: 'Approve this Event Organizer?',
            text: 'Verification status will be set to Approved and the organizer will be notified.',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Yes, Approve',
            confirmButtonColor: '#28a745',
            cancelButtonText: 'Cancel',
        });
        if (!result.isConfirmed) return;

        try {
            await Model.approve(id);
            showToast('Event Organizer approved successfully', 'success');
            setShowEoDetail(false);
            buildAndSubmit();
        } catch (error: any) {
            showToast(error.message || 'Failed to approve', 'error');
        }
    };

    const handleEoReject = async (id: number) => {
        const { value: note } = await Swal.fire({
            title: 'Reject Organizer',
            input: 'textarea',
            inputLabel: 'Reason for rejection',
            inputPlaceholder: 'Type your reason here...',
            inputAttributes: { 'aria-label': 'Rejection reason' },
            showCancelButton: true,
            confirmButtonText: 'Reject',
            confirmButtonColor: '#dc3545',
            inputValidator: (value) => {
                if (!value || !value.trim()) return 'Rejection note is required';
            },
        });

        if (!note) return;

        try {
            await Model.reject(id, note.trim());
            showToast('Event Organizer rejected', 'info');
            setShowEoDetail(false);
            buildAndSubmit();
        } catch (error: any) {
            showToast(error.message || 'Failed to reject', 'error');
        }
    };

    const handleFacilityApprove = async (id: number) => {
        const result = await Swal.fire({
            title: 'Approve this Facility?',
            text: 'Verification status will be set to Approved and the facility owner will be notified.',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Yes, Approve',
            confirmButtonColor: '#28a745',
            cancelButtonText: 'Cancel',
        });
        if (!result.isConfirmed) return;

        try {
            await Model.facilityApprove(id);
            showToast('Facility approved successfully', 'success');
            setShowFacilityDetail(false);
            buildAndSubmit();
        } catch (error: any) {
            showToast(error.message || 'Failed to approve', 'error');
        }
    };

    const handleFacilityReject = async (id: number) => {
        const { value: note } = await Swal.fire({
            title: 'Reject Facility',
            input: 'textarea',
            inputLabel: 'Reason for rejection',
            inputPlaceholder: 'Type your reason here...',
            inputAttributes: { 'aria-label': 'Rejection reason' },
            showCancelButton: true,
            confirmButtonText: 'Reject',
            confirmButtonColor: '#dc3545',
            inputValidator: (value) => {
                if (!value || !value.trim()) return 'Rejection note is required';
            },
        });

        if (!note) return;

        try {
            await Model.facilityReject(id, note.trim());
            showToast('Facility rejected', 'info');
            setShowFacilityDetail(false);
            buildAndSubmit();
        } catch (error: any) {
            showToast(error.message || 'Failed to reject', 'error');
        }
    };

    const currentList = activeTab === 'eo' ? eoList : facilityList;
    const currentPagination = activeTab === 'eo' ? eoPagination : facilityPagination;

    return (
        <>
            <div className="container-p-y">
                <h4 className="py-2 breadcrumb-wrapper mb-0">Verification Management</h4>
                <span className="text-muted">Review and moderate verification requests</span>
            </div>

            {/* Filter bar */}
            <div className="card mb-3">
                <div className="card-header border-top rounded-0 p-3 d-flex flex-wrap gap-3 align-items-end">
                    {/* Search */}
                    <div>
                        <label className="form-label">Search</label>
                        <div className="input-group input-group-merge">
                            <span className="input-group-text">
                                <i className="bx bx-search" />
                            </span>
                            <input
                                type="search"
                                className="form-control"
                                placeholder={activeTab === 'eo' ? "Name, email, or phone..." : "Facility name, email, or phone..."}
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Per page */}
                    <div className="ms-auto">
                        <label className="form-label">Show</label>
                        <select className="form-select" value={perPage} onChange={(e) => setPerPage(parseInt(e.target.value))}>
                            {[10, 20, 50, 100].map((n) => <option key={n} value={n}>{n}</option>)}
                        </select>
                    </div>
                </div>
            </div>

            <div className="card mt-2">
                {/* Type tabs */}
                <div className="card-header border-top rounded-0 py-2 px-3">
                    <div className="d-flex gap-2 flex-wrap">
                        <button
                            onClick={() => setActiveTab('eo')}
                            className={`btn btn-sm ${activeTab === 'eo' ? 'btn-primary' : 'btn-outline-primary'}`}
                        >
                            <i className="bx bx-calendar-event me-1"></i>
                            Event Organizers
                        </button>
                        <button
                            onClick={() => setActiveTab('facility')}
                            className={`btn btn-sm ${activeTab === 'facility' ? 'btn-primary' : 'btn-outline-primary'}`}
                        >
                            <i className="bx bx-building me-1"></i>
                            Facilities
                        </button>
                    </div>
                </div>

                {/* Status tabs */}
                <div className="card-header border-top rounded-0 py-2 px-3">
                    <div className="d-flex gap-2 flex-wrap">
                        {STATUS_TABS.map((tab) => (
                            <button
                                key={tab.value}
                                onClick={() => { setActiveStatus(tab.value); setCurrentPage(1); }}
                                className={`btn btn-sm ${activeStatus === tab.value ? `btn-${tab.variant}` : `btn-outline-${tab.variant}`}`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="table-responsive text-nowrap">
                    <table className="table">
                        <thead className="border-top">
                            <tr>
                                <th style={{ width: '8%' }}>Actions</th>
                                <th style={{ cursor: 'pointer' }} onClick={() => handleSort(activeTab === 'eo' ? 'eo_name' : 'facility_name')}>
                                    {activeTab === 'eo' ? 'EO Name' : 'Facility Name'} {getSortIcon(activeTab === 'eo' ? 'eo_name' : 'facility_name')}
                                </th>
                                <th style={{ cursor: 'pointer' }} onClick={() => handleSort('email')}>
                                    Email {getSortIcon('email')}
                                </th>
                                <th style={{ cursor: 'pointer' }} onClick={() => handleSort('phone')}>
                                    Phone {getSortIcon('phone')}
                                </th>
                                {activeTab === 'eo' && <th>Org. Type</th>}
                                <th>Verification Status</th>
                                <th style={{ cursor: 'pointer' }} onClick={() => handleSort('created_at')}>
                                    Created At {getSortIcon('created_at')}
                                </th>
                            </tr>
                        </thead>
                        <tbody className="table-border-bottom-0">
                            {currentList.length === 0 && (
                                <tr>
                                    <td colSpan={activeTab === 'eo' ? 7 : 6} className="text-center text-muted py-4">
                                        No verification requests found.
                                    </td>
                                </tr>
                            )}
                            {activeTab === 'eo' && eoList.map((item: InEventOrganizer, key: number) => (
                                <tr className="odd" key={key}>
                                    <td>
                                        <button
                                            className="btn btn-md btn-icon btn-primary"
                                            onClick={() => openEoDetail(item)}
                                            title="Review"
                                        >
                                            <i className="bx bx-shield-quarter" />
                                        </button>
                                    </td>
                                    <td>{item.eo_name}</td>
                                    <td>{item.email}</td>
                                    <td>{item.phone}</td>
                                    <td>
                                        {item.organization_type
                                            ? <span className="badge bg-label-info">{item.organization_type}</span>
                                            : <span className="text-muted">-</span>
                                        }
                                    </td>
                                    <td>{getStatusBadge(item.verification_status)}</td>
                                    <td>{item.created_at}</td>
                                </tr>
                            ))}
                            {activeTab === 'facility' && facilityList.map((item: InFacilityOrganizer, key: number) => (
                                <tr className="odd" key={key}>
                                    <td>
                                        <button
                                            className="btn btn-md btn-icon btn-primary"
                                            onClick={() => openFacilityDetail(item)}
                                            title="Review"
                                        >
                                            <i className="bx bx-shield-quarter" />
                                        </button>
                                    </td>
                                    <td>{item.facility_name}</td>
                                    <td>{item.email}</td>
                                    <td>{item.phone}</td>
                                    <td>{getStatusBadge(item.verification_status)}</td>
                                    <td>{item.created_at}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {currentPagination && (
                        <div className="row mx-2 mt-4 mb-3">
                            <div className="col-sm-12 col-md-6">
                                <div className="dataTables_info" role="status" aria-live="polite">
                                    Found {currentPagination.filtered_total} of {currentPagination.total} data,
                                    displaying {currentList.length} data
                                </div>
                            </div>
                            {currentPagination.page_count > 1 && (
                                <div className="col-sm-12 col-md-6 d-flex justify-content-end">
                                    <Pagination
                                        currentPage={currentPage}
                                        pageCount={currentPagination.page_count}
                                        onPageChange={setCurrentPage}
                                    />
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* EO Detail Modal */}
            <DetailModal
                show={showEoDetail}
                onHide={() => setShowEoDetail(false)}
                data={selectedEO}
                onApprove={handleEoApprove}
                onReject={handleEoReject}
            />

            {/* Facility Detail Modal */}
            <FacilityDetailModal
                show={showFacilityDetail}
                onHide={() => setShowFacilityDetail(false)}
                data={selectedFacility}
                onApprove={handleFacilityApprove}
                onReject={handleFacilityReject}
            />
        </>
    );
};

export default VerificationPage;
