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
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [selectedTicket, setSelectedTicket] = useState<InEventTicket | null>(null);
    const [formData, setFormData] = useState<InEventTicketForm>({
        id: null,
        event_id: null,
        name: '',
        description: '',
        price: 0,
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

    useEffect(() => {
        loadTickets();
    }, [currentPage, searchQuery, statusFilter]);

    const loadTickets = async () => {
        blockUI();
        try {
            const query: any = {
                page: currentPage,
                per_page: 10,
                sort_by: 'created_at',
                sort_order: 'desc'
            };

            if (searchQuery) {
                query.search = searchQuery;
            }

            if (statusFilter !== 'all') {
                query.filter = `is_active=${statusFilter}`;
            }

            const response = await EventTicketModel.list(query);
            setTickets(response.event_ticket || []);
            setPagination(response.pagination);
        } catch (error) {
            if (error.status === 403) {
                router.push('/403');
            }
            showToast('Failed to load tickets', 'error');
        } finally {
            unblockUI();
        }
    };

    const create = () => {
        setFormData({
            id: null,
            event_id: null,
            name: '',
            description: '',
            price: 0,
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
            loadTickets();
        } catch (error) {
            let lines = error.message.trim().split('\n');
            let result: ValidationErrorProps[] = lines.map(line => {
                let [field, ...message] = line.split(' ');
                return { field, message: message.join(' ') };
            });
            setValidationError(result);
        }
    }, []);

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
                    loadTickets();
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

    return (
        <div className="container-fluid">
            <div className="card">
                <div className="card-header d-flex justify-content-between align-items-center">
                    <div>
                        <h5 className="mb-0">
                            <i className="bx bx-ticket me-2"></i>
                            Event Tickets
                        </h5>
                        <small className="text-muted">
                            Manage all event tickets
                        </small>
                    </div>
                    <Button variant="primary" onClick={create}>
                        <i className="bx bx-plus me-1"></i>
                        Add Data
                    </Button>
                </div>

                <div className="card-body">
                    {/* FILTERS */}
                    <div className="row mb-3">
                        <div className="col-md-6">
                            <div className="input-group">
                                <span className="input-group-text">
                                    <i className="bx bx-search"></i>
                                </span>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Search ticket name or event..."
                                    value={searchQuery}
                                    onChange={(e) => {
                                        setSearchQuery(e.target.value);
                                        setCurrentPage(1);
                                    }}
                                />
                            </div>
                        </div>
                        <div className="col-md-3">
                            <select
                                className="form-select"
                                value={statusFilter}
                                onChange={(e) => {
                                    setStatusFilter(e.target.value);
                                    setCurrentPage(1);
                                }}
                            >
                                <option value="all">All Status</option>
                                <option value="1">Active</option>
                                <option value="0">Inactive</option>
                            </select>
                        </div>
                    </div>

                    {/* TABLE */}
                    <div className="table-responsive">
                        <table className="table table-hover">
                            <thead className="table-light">
                                <tr>
                                    <th width="120">Actions</th>
                                    <th>#</th>
                                    <th>Event</th>
                                    <th>Ticket Name</th>
                                    <th>Price</th>
                                    <th>Capacity</th>
                                    <th>Status</th>
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
                                                    <button className="btn btn-sm btn-icon btn-info" onClick={() => showDetail(ticket)} title="View Details">
                                                        <i className="bx bx-show"></i>
                                                    </button>
                                                    <button className="btn btn-sm btn-icon btn-warning" onClick={() => update(ticket)} title="Edit">
                                                        <i className="bx bx-edit"></i>
                                                    </button>
                                                    <button className="btn btn-sm btn-icon btn-danger" onClick={() => remove(ticket.id)} title="Delete">
                                                        <i className="bx bx-trash"></i>
                                                    </button>
                                                </div>
                                            </td>
                                            <td>{((currentPage - 1) * 10) + index + 1}</td>
                                            <td>
                                                <div className="fw-semibold">{(ticket as any).event?.title || 'N/A'}</div>
                                                <small className="text-muted">{(ticket as any).event?.event_category}</small>
                                            </td>
                                            <td>
                                                <div className="fw-semibold">{ticket.name}</div>
                                                <small className="text-muted">{ticket.description}</small>
                                            </td>
                                            <td className="fw-bold text-primary">
                                                {formatCurrency(ticket.price)}
                                            </td>
                                            <td>
                                                <span className={`badge ${ticket.remaining_capacity > 0 ? 'bg-success' : 'bg-danger'}`}>
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
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDetailModal(false)}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default TicketEventPage;
