/**
 * @author Sarip Hidayat <hidayatsarip2210@gmail.com>
 * @copyright Sarip Hidayat 2024
 * @date 2026-01-14
 */

import React, { useEffect, useState, useCallback } from 'react';
import { Badge, Modal, Button } from 'react-bootstrap';
import Swal from 'sweetalert2';
import useBlockUI from '@/pages/_components/useBlockUI';
import Pagination from '@/pages/_components/Pagination';
import { EventTicket, InEventTicket, InEventTicketForm } from '@/models/EventTicket';
import { showToast } from '@/utils/toast';
import { useRouter } from 'next/router';
import Form from './_form';
import Filter from "@/pages/ticket_event/_filter";
import { QueryParamsProps } from "@/pages/tenant/_filter";

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

const TicketEventPage: React.FC = () => {
    const router = useRouter();
    const { blockUI, unblockUI } = useBlockUI();
    const [tickets, setTickets] = useState<InEventTicket[]>([]);
    const [pagination, setPagination] = useState<PaginationProps | null>(null);
    const [isInitialLoad, setIsInitialLoad] = useState<boolean>(true);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [pageCount, setPageCount] = useState<number>(0);
    const [lastQuery, setLastQuery] = useState<any>({});
    const [sortBy, setSortBy] = useState<string>('created_at');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [selectedTicket, setSelectedTicket] = useState<InEventTicket | null>(null);
    const [formData, setFormData] = useState<InEventTicketForm>({
        id: null,
        event_id: null,
        name: '',
        description: '',
        price: 0,
        final_price: 0,
        is_taxable: 'N',
        tax_id: "",
        total_capacity: 0,
        remaining_capacity: 0,
        max_per_order: 5,
        sales_start_date: '',
        sales_end_date: '',
        is_active: true,
        sort_order: 0
    });
    const [validationError, setValidationError] = useState<ValidationErrorProps[]>([]);
    const EventTicketModel = new EventTicket();

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

    const loadTickets = async (query: QueryParamsProps = {}) => {
        if (isInitialLoad) blockUI();
        try {
            query.page = currentPage;
            query.sort_by = sortBy + ':' + sortOrder;
            const response = await EventTicketModel.list(query);
            setLastQuery(query);
            setTickets(response.event_ticket || []);
            setPagination(response.pagination);
            setPageCount(response.pagination.page_count);
        } catch (error) {
            if (error.status === 403) {
                router.push('/403');
            }
            showToast('Failed to load tickets', 'error');
        } finally {
            if (isInitialLoad) {
                unblockUI();
                setIsInitialLoad(false);
            }
        }
    };

    const create = () => {
        setFormData({
            id: null,
            event_id: null,
            name: '',
            description: '',
            price: 0,
            final_price: 0,
            is_taxable: 'N',
            tax_id: "",
            total_capacity: 0,
            remaining_capacity: 0,
            max_per_order: 5,
            sales_start_date: '',
            sales_end_date: '',
            is_active: true,
            sort_order: 0
        });
        setValidationError([]);
        jQuery("#modal-eventTicket").modal('show');
    };

    const update = (ticket: InEventTicket) => {
        setFormData(ticket);
        setValidationError([]);
        jQuery("#modal-eventTicket").modal('show');
    };

    const save = useCallback(async (data: InEventTicketForm) => {
        try {
            if (data.id) {
                await EventTicketModel.update(data.id, data);
            } else {
                await EventTicketModel.create(data);
            }
            showToast(`Successfully ${data.id ? 'updated' : 'added'}`, 'success');
            jQuery("#modal-eventTicket").modal('hide');
            await loadTickets(lastQuery);
        } catch (error) {
            let lines = error.message.trim().split('\n');
            let result: ValidationErrorProps[] = lines.map(line => {
                let [field, ...message] = line.split(' ');
                return { field, message: message.join(' ') };
            });
            setValidationError(result);
        }
    }, [EventTicketModel, lastQuery, loadTickets]);

    const remove = async (id: number) => {
        Swal.fire({
            title: "Are you sure?",
            text: "Once deleted, you will not be able to recover this ticket",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
            cancelButtonText: "Cancel",
        }).then(async (result) => {
            if (result.isConfirmed) {
                const response = await EventTicketModel.delete(id);
                if (response.success) {
                    showToast("Successfully Deleted", "success");
                    await loadTickets(lastQuery);
                }
            }
        });
    };

    const showDetail = (ticket: InEventTicket) => {
        setSelectedTicket(ticket);
        setShowDetailModal(true);
    };

    const formatCurrency = (amount: string | number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(Number(amount));
    };

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    useEffect(() => {
        if (!isInitialLoad) loadTickets(lastQuery);
    }, [currentPage]);

    useEffect(() => {
        if (!isInitialLoad) loadTickets(lastQuery);
    }, [sortBy, sortOrder]);


    return (
        <>
            <div className=" container-p-y">
                <h4 className="py-2 breadcrumb-wrapper mb-0">Ticket Event</h4>
                Manage your ticket event
            </div>
            <Filter onSubmit={loadTickets} />
            <div className="card mt-2">
                <h5 className="card-header d-flex border-top rounded-0 flex-wrap">
                    <div className="d-flex justify-content-start justify-content-md-end align-items-baseline ms-auto">
                        <Button variant="primary" onClick={create}>
                            <span><i className="bx bx-plus me-0 me-sm-1"></i></span>
                            <span className="d-none d-sm-inline-block">Add Data</span>
                        </Button>
                    </div>
                </h5>

                {/* TABLE */}
                <div className="table-responsive">
                    <table className="table table-hover">
                        <thead className="table-light">
                            <tr>
                                <th width="120">Actions</th>
                                <th style={{ cursor: 'pointer' }} onClick={() => handleSort('event_id')}>Event {getSortIcon('event_id')}</th>
                                <th style={{ cursor: 'pointer' }} onClick={() => handleSort('name')}>Ticket Name {getSortIcon('name')}</th>
                                <th style={{ cursor: 'pointer' }} onClick={() => handleSort('price')}>Price {getSortIcon('price')}</th>
                                <th>Taxes</th>
                                <th style={{ cursor: 'pointer' }} onClick={() => handleSort('final_price')}>Final Price {getSortIcon('final_price')}</th>
                                <th style={{ cursor: 'pointer' }} onClick={() => handleSort('remaining_capacity')}>Capacity {getSortIcon('remaining_capacity')}</th>
                                <th style={{ cursor: 'pointer' }} onClick={() => handleSort('is_active')}>Status {getSortIcon('is_active')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tickets.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="text-center py-4 text-muted">
                                        <i className="bx bx-info-circle bx-lg mb-2 d-block"></i>
                                        No tickets found
                                    </td>
                                </tr>
                            ) : (
                                tickets.map((ticket, index) => (
                                    <tr key={ticket.id}>
                                        <td>
                                            <div className="d-flex gap-1">
                                                <button className="btn btn-sm btn-icon btn-info"
                                                    onClick={() => showDetail(ticket)} title="View Details">
                                                    <i className="bx bx-show"></i>
                                                </button>
                                                <button className="btn btn-sm btn-icon btn-warning"
                                                    onClick={() => update(ticket)} title="Edit">
                                                    <i className="bx bx-edit"></i>
                                                </button>
                                                <button className="btn btn-sm btn-icon btn-danger"
                                                    onClick={() => remove(ticket.id)} title="Delete">
                                                    <i className="bx bx-trash"></i>
                                                </button>
                                            </div>
                                        </td>
                                        <td>
                                            <div
                                                className="fw-semibold">{(ticket as any).event?.title || 'N/A'}</div>
                                            <small
                                                className="text-muted">{(ticket as any).event?.event_category}</small>
                                        </td>
                                        <td>
                                            <div className="fw-semibold">{ticket.name}</div>
                                            <small className="text-muted">{ticket.description}</small>
                                        </td>
                                        <td className="fw-bold text-primary">
                                            {formatCurrency(ticket.price)}
                                        </td>
                                        <td>
                                            <div
                                                className="fw-semibold">{ticket.is_taxable === "Y" ? ticket.tax.rate + "%" : '-'}</div>
                                            <small
                                                className="text-muted">{ticket.is_taxable === "Y" ? ticket.tax.name : '-'}</small>
                                        </td>
                                        <td className="fw-bold text-primary">
                                            {formatCurrency(ticket.final_price)}
                                        </td>
                                        <td>
                                            <span
                                                className={`badge ${ticket.remaining_capacity > 0 ? 'bg-success' : 'bg-danger'}`}>
                                                {ticket.remaining_capacity}
                                            </span>
                                            <span className="text-muted"> / {ticket.total_capacity}</span>
                                        </td>
                                        <td>
                                            <Badge bg={ticket.is_active ? 'success' : 'secondary'}>
                                                {ticket.is_active ? 'Active' : 'Inactive'}
                                            </Badge>
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
                                displaying {tickets.length} data
                            </div>
                        </div>
                        {pagination.page_count && (
                            <div className="col-sm-12 col-md-6 d-flex justify-content-end">
                                <Pagination currentPage={currentPage} pageCount={pagination.page_count} onPageChange={setCurrentPage} />
                            </div>
                        )}
                    </div>
                )}

            </div>

            {/* FORM MODAL */}
            <Form
                title={formData.id ? 'Update Ticket' : 'Add Ticket'}
                data={formData}
                onSave={save}
                validationError={validationError}
            />

            {/* DETAIL MODAL */}
            <Modal show={showDetailModal} onHide={() => setShowDetailModal(false)} size="lg" centered>
                <Modal.Header closeButton>
                    <Modal.Title>
                        <i className="bx bx-ticket me-2"></i>
                        Ticket Details
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedTicket && (
                        <div className="row g-3">
                            <div className="col-12">
                                <h6 className="border-bottom pb-2">Event Information</h6>
                            </div>
                            <div className="col-md-6">
                                <label className="text-muted small">Event</label>
                                <div className="fw-semibold">{(selectedTicket as any).event?.title || 'N/A'}</div>
                            </div>
                            <div className="col-md-6">
                                <label className="text-muted small">Category</label>
                                <div className="fw-semibold">{(selectedTicket as any).event?.event_category || 'N/A'}</div>
                            </div>

                            <div className="col-12 mt-3">
                                <h6 className="border-bottom pb-2">Ticket Information</h6>
                            </div>
                            <div className="col-md-6">
                                <label className="text-muted small">Ticket Name</label>
                                <div className="fw-semibold">{selectedTicket.name}</div>
                            </div>
                            <div className="col-md-6">
                                <label className="text-muted small">Price</label>
                                <div className="fw-semibold text-primary">{formatCurrency(selectedTicket.price)}</div>
                            </div>
                            <div className="col-md-12">
                                <label className="text-muted small">Description</label>
                                <div>{selectedTicket.description || '-'}</div>
                            </div>

                            <div className="col-12 mt-3">
                                <h6 className="border-bottom pb-2">Capacity</h6>
                            </div>
                            <div className="col-md-4">
                                <label className="text-muted small">Total Capacity</label>
                                <div className="fw-semibold">{selectedTicket.total_capacity}</div>
                            </div>
                            <div className="col-md-4">
                                <label className="text-muted small">Remaining</label>
                                <div className="fw-semibold">
                                    <Badge bg={selectedTicket.remaining_capacity > 0 ? 'success' : 'danger'}>
                                        {selectedTicket.remaining_capacity}
                                    </Badge>
                                </div>
                            </div>
                            <div className="col-md-4">
                                <label className="text-muted small">Max Per Order</label>
                                <div className="fw-semibold">{selectedTicket.max_per_order}</div>
                            </div>

                            <div className="col-12 mt-3">
                                <h6 className="border-bottom pb-2">Sales Period</h6>
                            </div>
                            <div className="col-md-6">
                                <label className="text-muted small">Start Date</label>
                                <div>{formatDate(selectedTicket.sales_start_date)}</div>
                            </div>
                            <div className="col-md-6">
                                <label className="text-muted small">End Date</label>
                                <div>{formatDate(selectedTicket.sales_end_date)}</div>
                            </div>

                            <div className="col-12 mt-3">
                                <h6 className="border-bottom pb-2">Other</h6>
                            </div>
                            <div className="col-md-4">
                                <label className="text-muted small">Status</label>
                                <div>
                                    <Badge bg={selectedTicket.is_active ? 'success' : 'secondary'}>
                                        {selectedTicket.is_active ? 'Active' : 'Inactive'}
                                    </Badge>
                                </div>
                            </div>
                            <div className="col-md-4">
                                <label className="text-muted small">Sort Order</label>
                                <div>{selectedTicket.sort_order}</div>
                            </div>
                            <div className="col-md-4">
                                <label className="text-muted small">Created At</label>
                                <div><small>{formatDate(selectedTicket.created_at)}</small></div>
                            </div>

                            {(selectedTicket as any).events_sponsors && (selectedTicket as any).events_sponsors.length > 0 && (
                                <div className="col-12 mt-3">
                                    <h6 className="border-bottom pb-2">Sponsors</h6>
                                    <div className="d-flex flex-wrap gap-2">
                                        {(selectedTicket as any).events_sponsors.map((sponsor: any) => (
                                            <div key={sponsor.id} className="border rounded p-1" style={{ width: '80px', height: '80px' }}>
                                                <img
                                                    src={sponsor.url}
                                                    alt="Sponsor Logo"
                                                    className="img-fluid h-100 w-100 object-fit-contain"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDetailModal(false)}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default TicketEventPage;
