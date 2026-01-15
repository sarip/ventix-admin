/**
 * @author Sarip Hidayat <hidayatsarip2210@gmail.com>
 * @copyright Sarip Hidayat 2024
 * @date 2026-01-14
 */

import React, { useEffect, useState } from 'react';
import { Badge, Modal, Button } from 'react-bootstrap';
import useBlockUI from '@/pages/_components/useBlockUI';
import Pagination from '@/pages/_components/Pagination';
import { TicketUser, InTicketUser } from '@/models/TicketUser';
import { showToast } from '@/utils/toast';
import QRCode from 'qrcode';
import PrintTicket from './PrintTicket';

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
    const [showQRModal, setShowQRModal] = useState(false);
    const [showPrintModal, setShowPrintModal] = useState(false);
    const [selectedTicket, setSelectedTicket] = useState<InTicketUser | null>(null);
    const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
    const TicketUserModel = new TicketUser();

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
                query.filter = `status=${statusFilter}`;
            }

            const response = await TicketUserModel.list(query);
            setTickets(response.user_tickets || []);
            setPagination(response.pagination);
        } catch (error) {
            showToast('Failed to load tickets', 'error');
        } finally {
            unblockUI();
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

    const handleCheckIn = async (ticket: InTicketUser) => {
        if (ticket.check_in_at) {
            showToast('Ticket already checked in', 'info');
            return;
        }

        if (ticket.status !== 'VALID') {
            showToast('Only VALID tickets can be checked in', 'error');
            return;
        }

        // Confirmation
        const confirmed = await new Promise((resolve) => {
            const result = confirm(`Check in ticket ${ticket.ticket_code} for ${ticket.user?.name}?`);
            resolve(result);
        });

        if (!confirmed) return;

        blockUI();
        try {
            await TicketUserModel.checkIn(ticket.id);
            showToast('Ticket checked in successfully', 'success');
            loadTickets(); // Reload to get updated data
        } catch (error) {
            showToast('Failed to check in ticket', 'error');
        } finally {
            unblockUI();
        }
    };

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

    return (
        <div className="container-fluid">
            <div className="card">
                <div className="card-header d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">
                        <i className="bx bx-barcode me-2"></i>
                        User Tickets
                    </h5>
                    <small className="text-muted">
                        View all user tickets and check-in status
                    </small>
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
                                    placeholder="Search ticket code or user..."
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
                                <option value="VALID">Valid</option>
                                <option value="USED">Used</option>
                                <option value="CANCELLED">Cancelled</option>
                            </select>
                        </div>
                    </div>

                    {/* TABLE */}
                    <div className="table-responsive">
                        <table className="table table-hover">
                            <thead className="table-light">
                                <tr>
                                    <th>#</th>
                                    <th>Ticket Code</th>
                                    <th>User</th>
                                    <th>Event Ticket</th>
                                    <th>Status</th>
                                    <th>Check-in</th>
                                    <th>Created</th>
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
                                                <div className="fw-semibold">{ticket.user?.name || 'N/A'}</div>
                                                <small className="text-muted">{ticket.user?.email}</small>
                                            </td>
                                            <td>
                                                <div className="fw-semibold">{ticket.ticket?.name || 'N/A'}</div>
                                                <small className="text-muted">Event ID: {ticket.event_ticket_id}</small>
                                            </td>
                                            <td>{getStatusBadge(ticket.status)}</td>
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

                    {/* PAGINATION */}
                    {pagination && (
                        <div className="d-flex justify-content-between align-items-center mt-3">
                            <div className="text-muted">
                                Showing {tickets.length} of {pagination.filtered_total} tickets
                            </div>
                            <Pagination
                                currentPage={currentPage}
                                pageCount={pagination.page_count}
                                onPageChange={setCurrentPage}
                            />
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
        </div>
    );
};

export default TicketUserPage;
