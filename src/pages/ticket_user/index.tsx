/**
 * @author Sarip Hidayat <hidayatsarip2210@gmail.com>
 * @copyright Sarip Hidayat 2024
 * @date 2026-01-14
 */

import React, { useCallback, useEffect, useState } from 'react';
import { Badge, Modal, Button } from 'react-bootstrap';
import useBlockUI from '@/pages/_components/useBlockUI';
import Pagination from '@/pages/_components/Pagination';
import { TicketUser, InTicketUser } from '@/models/TicketUser';
import { showToast } from '@/utils/toast';
import QRCode from 'qrcode';
import PrintTicket from './PrintTicket';
import Filter, { QueryParamsProps } from "./_filter";
import Swal from "sweetalert2";
import moment from "moment/moment";
import { getCookie } from "cookies-next";

interface PaginationProps {
    current_page: number;
    total: number;
    filtered_total: number;
    page_count: number;
    per_page: number;
}

const TicketUserPage: React.FC = () => {
    const { blockUI, unblockUI } = useBlockUI();
    const [tickets, setTickets] = useState<InTicketUser[]>([]);
    const [pagination, setPagination] = useState<PaginationProps | null>(null);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [isInitialLoad, setIsInitialLoad] = useState<boolean>(true);
    const [pageCount, setPageCount] = useState<number>(0);
    const [lastQuery, setLastQuery] = useState<any>({});
    const [sortBy, setSortBy] = useState<string>('created_at');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
    const [showQRModal, setShowQRModal] = useState(false);
    const [showPrintModal, setShowPrintModal] = useState(false);
    const [selectedTicket, setSelectedTicket] = useState<InTicketUser | null>(null);
    const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
    const TicketUserModel = new TicketUser();

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
            const response = await TicketUserModel.list(query);
            setLastQuery(query);
            setTickets(response.user_tickets || []);
            setPagination(response.pagination);
            setPageCount(response.pagination.page_count);
        } catch (error) {
            showToast('Failed to load tickets', 'error');
        } finally {
            if (isInitialLoad) {
                unblockUI();
                setIsInitialLoad(false);
            }
        }
    };

    const showQRCode = async (ticket: InTicketUser) => {
        setSelectedTicket(ticket);
        try {
            const qrUrl = await QRCode.toDataURL(ticket.ticket_code, {
                width: 300,
                margin: 2
            });
            setQrCodeUrl(qrUrl);
            setShowQRModal(true);
        } catch (error) {
            showToast('Failed to generate QR code', 'error');
        }
    };

    const handleCheckIn = useCallback(async (ticket: InTicketUser) => {
        if (ticket.check_in_at) {
            showToast('Ticket already checked in', 'info');
            return;
        }

        if (ticket.status !== 'VALID') {
            showToast('Only VALID tickets can be checked in', 'error');
            return;
        }

        Swal.fire({
            title: "Are you sure?",
            text: `Check in ticket ${ticket.ticket_code} for ${ticket.user?.name}?`,
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes",
            cancelButtonText: "No",
        }).then(async (result) => {
            if (result.isConfirmed) {
                const data = {
                    ...ticket,
                    status: 'USED',
                    check_in_at: moment().format('YYYY-MM-DD HH:mm:ss'),
                    check_in_by: getCookie('id')
                }
                console.log({ 'ticket': data })
                await TicketUserModel.update(ticket.id, data);
                showToast('Ticket checked in successfully', 'success');
                await loadTickets(lastQuery); // Reload to get updated data
            }
        });

        unblockUI();


    }, [TicketUserModel, lastQuery, loadTickets]);

    const showPrint = (ticket: InTicketUser) => {
        setSelectedTicket(ticket);
        setShowPrintModal(true);
    };

    const formatDate = (date: string | null) => {
        if (!date) return '-';
        return new Date(date).toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusBadge = (status: string) => {
        const statusMap: { [key: string]: string } = {
            VALID: 'success',
            USED: 'warning',
            CANCELLED: 'danger'
        };
        return <Badge bg={statusMap[status] || 'secondary'}>{status}</Badge>;
    };


    useEffect(() => {
        if (!isInitialLoad) loadTickets(lastQuery);
    }, [currentPage]);

    useEffect(() => {
        if (!isInitialLoad) loadTickets(lastQuery);
    }, [sortBy, sortOrder]);

    return (
        <>
            <div className="container-p-y">
                <h4 className="py-2 breadcrumb-wrapper mb-0">User Tickets</h4>
                Manage your User Tickets
            </div>
            <Filter onSubmit={loadTickets} />
            <div className="card mt-2">
                <div className="card-header d-flex justify-content-between align-items-center">
                    <h5 className="mb-0"></h5>
                    <small className="text-muted">
                        View all user tickets and check-in status
                    </small>
                </div>

                <div className="card-body">


                    {/* TABLE */}
                    <div className="table-responsive">
                        <table className="table table-hover">
                            <thead className="table-light">
                                <tr>
                                    <th>#</th>
                                    <th style={{ cursor: 'pointer' }} onClick={() => handleSort('ticket_code')}>Ticket Code {getSortIcon('ticket_code')}</th>
                                    <th>User</th>
                                    <th>Event Ticket</th>
                                    <th style={{ cursor: 'pointer' }} onClick={() => handleSort('status')}>Status {getSortIcon('status')}</th>
                                    <th style={{ cursor: 'pointer' }} onClick={() => handleSort('check_in_at')}>Check-in {getSortIcon('check_in_at')}</th>
                                    <th style={{ cursor: 'pointer' }} onClick={() => handleSort('created_at')}>Created {getSortIcon('created_at')}</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tickets.length === 0 ? (
                                    <tr>
                                        <td colSpan={8} className="text-center py-4 text-muted">
                                            <i className="bx bx-info-circle bx-lg mb-2 d-block"></i>
                                            No tickets found
                                        </td>
                                    </tr>
                                ) : (
                                    tickets.map((ticket, index) => (
                                        <tr key={ticket.id}>
                                            <td>{((currentPage - 1) * 10) + index + 1}</td>
                                            <td>
                                                <span className="font-monospace fw-bold text-primary">
                                                    {ticket.ticket_code}
                                                </span>
                                            </td>
                                            <td>
                                                <div className="fw-semibold">{ticket.user?.name || ticket.guest_name || 'N/A'}</div>
                                                <small className="text-muted">{ticket.user?.email || ticket.guest_email || 'N/A'}</small>
                                            </td>
                                            <td>
                                                <div className="fw-semibold">{ticket.ticket?.name || 'N/A'}</div>
                                                <small className="text-muted">Event ID: {ticket.event_ticket_id}</small>
                                            </td>
                                            <td dangerouslySetInnerHTML={{
                                                __html: ticket.status_badge,
                                            }} />
                                            <td>
                                                {ticket.check_in_at ? (
                                                    <div>
                                                        <div className="text-success">
                                                            <i className="bx bx-check-circle me-1"></i>
                                                            Checked In
                                                        </div>
                                                        <small className="text-muted">{formatDate(ticket.check_in_at)}</small>
                                                    </div>
                                                ) : (
                                                    <span className="text-muted">
                                                        <i className="bx bx-minus-circle me-1"></i>
                                                        Not checked in
                                                    </span>
                                                )}
                                            </td>
                                            <td>
                                                <small>{formatDate(ticket.created_at)}</small>
                                            </td>
                                            <td>
                                                <div className="d-flex gap-1">
                                                    <button
                                                        className="btn btn-sm btn-primary"
                                                        onClick={() => showQRCode(ticket)}
                                                        title="View QR Code"
                                                    >
                                                        <i className="bx bx-qr"></i>
                                                    </button>
                                                    {!ticket.check_in_at && ticket.status === 'VALID' && (
                                                        <button
                                                            className="btn btn-sm btn-success"
                                                            onClick={() => handleCheckIn(ticket)}
                                                            title="Check In"
                                                        >
                                                            <i className="bx bx-check"></i>
                                                        </button>
                                                    )}
                                                    <button
                                                        className="btn btn-sm btn-info"
                                                        onClick={() => showPrint(ticket)}
                                                        title="Print Ticket"
                                                    >
                                                        <i className="bx bx-printer"></i>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>



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

            {/* QR CODE MODAL */}
            <Modal show={showQRModal} onHide={() => setShowQRModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>
                        <i className="bx bx-qr me-2"></i>
                        Ticket QR Code
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="text-center">
                    {selectedTicket && (
                        <>
                            <div className="mb-3">
                                <h6 className="font-monospace text-primary">{selectedTicket.ticket_code}</h6>
                                <small className="text-muted">{selectedTicket.user?.name}</small>
                            </div>
                            {qrCodeUrl && (
                                <div className="mb-3">
                                    <img src={qrCodeUrl} alt="QR Code" className="img-fluid" />
                                </div>
                            )}
                            <div className="alert alert-info mb-0">
                                <small>
                                    <i className="bx bx-info-circle me-1"></i>
                                    Scan this QR code at the event entrance for check-in
                                </small>
                            </div>
                        </>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowQRModal(false)}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* PRINT TICKET MODAL */}
            {selectedTicket && (
                <PrintTicket
                    ticket={selectedTicket}
                    show={showPrintModal}
                    onHide={() => setShowPrintModal(false)}
                />
            )}
        </>
    );
};

export default TicketUserPage;
