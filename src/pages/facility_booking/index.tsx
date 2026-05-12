/**
 * Facility Booking Page
 */

import React, { useEffect, useState, useCallback } from 'react';
import { Button } from 'react-bootstrap';
import Swal from 'sweetalert2';
import useBlockUI from '@/pages/_components/useBlockUI';
import Pagination from '@/pages/_components/Pagination';
import { FacilityBooking, InFacilityBooking, InFacilityBookingForm } from '@/models/FacilityBooking';
import { showToast } from '@/utils/toast';
import FacilityBookingForm from './_booking_form';
import StatusDropdown from './_status_dropdown';
import Filter, { QueryParamsProps } from "@/pages/facility/_filter";

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

const FacilityBookingPage: React.FC = () => {
    const { blockUI, unblockUI } = useBlockUI();
    const [bookings, setBookings] = useState<InFacilityBooking[]>([]);
    const [pagination, setPagination] = useState<PaginationProps | null>(null);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [isInitialLoad, setIsInitialLoad] = useState<boolean>(true);
    const [pageCount, setPageCount] = useState<number>(0);
    const [lastQuery, setLastQuery] = useState<any>({});
    const [sortBy, setSortBy] = useState<string>('id');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [loadingStatusId, setLoadingStatusId] = useState<number | null>(null);
    const [formData, setFormData] = useState<InFacilityBookingForm>({
        facility_id: 0,
        user_id: 0,
        guest_name: '',
        guest_email: '',
        guest_phone: '',
        booking_code: '',
        booking_source: 'MEMBER',
        subtotal_amount: 0,
        admin_fee_amount: 0,
        booking_date: '',
        start_time: '',
        end_time: '',
        notes: ''
    });
    const [validationError, setValidationError] = useState<ValidationErrorProps[]>([]);
    const BookingModel = new FacilityBooking();

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

    const loadBookings = async (query: QueryParamsProps = {}) => {
        if (isInitialLoad) blockUI();
        try {
            query.page = currentPage;
            query.sort_by = sortBy + ':' + sortOrder;
            const response = await BookingModel.list(query);
            setBookings(response.facility_bookings || []);
            setPagination(response.pagination);
            setLastQuery(query);
            setPageCount(response.pagination.page_count);
        } catch (error) {
            showToast('Failed to load bookings', 'error');
        } finally {
            if (isInitialLoad) {
                unblockUI();
                setIsInitialLoad(false);
            }
        }
    };

    const create = () => {
        setEditingId(null);
        setFormData({
            facility_id: 0,
            user_id: 0,
            guest_name: '',
            guest_email: '',
            guest_phone: '',
            booking_code: '',
            booking_source: 'MEMBER',
            subtotal_amount: 0,
            admin_fee_amount: 0,
            booking_date: '',
            start_time: '',
            end_time: '',
            notes: ''
        });
        setValidationError([]);
        setShowForm(true);
    };

    const edit = async (booking: InFacilityBooking) => {
        setEditingId(booking.id);
        setFormData({
            id: booking.id,
            facility_id: booking.facility_id,
            user_id: booking.user_id,
            guest_name: booking.guest_name,
            guest_email: booking.guest_email,
            guest_phone: booking.guest_phone,
            booking_code: booking.facility_code,
            booking_source: booking.booking_source,
            subtotal_amount: booking.subtotal_amount,
            admin_fee_amount: booking.admin_fee_amount,
            booking_date: booking.booking_date,
            start_time: booking.start_time,
            end_time: booking.end_time,
            notes: booking.notes
        });
        setValidationError([]);
        setShowForm(true);
    };

    const save = useCallback(async (data: InFacilityBookingForm) => {
        try {
            if (editingId) {
                await BookingModel.update(editingId, data);
                showToast('Booking successfully updated', 'success');
            } else {
                await BookingModel.create(data);
                showToast('Booking successfully created', 'success');
            }
            setShowForm(false);
            loadBookings();
        } catch (error: any) {
            let lines = error.message.trim().split('\n');
            let result: ValidationErrorProps[] = lines.map((line: string) => {
                let [field, ...message] = line.split(' ');
                return { field, message: message.join(' ') };
            });
            setValidationError(result);
        }
    }, [editingId]);

    const updateStatus = async (id: number, status: string) => {
        setLoadingStatusId(id);
        try {
            await BookingModel.updateStatus(id, status);
            showToast("Status updated successfully", "success");
            loadBookings(lastQuery);
        } catch (error) {
            showToast("Failed to update status", "error");
        } finally {
            setLoadingStatusId(null);
        }
    };

    const remove = async (id: number) => {
        Swal.fire({
            title: "Are you sure?",
            text: "Cancel this booking?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, cancel it!",
        }).then(async (result) => {
            if (result.isConfirmed) {
                const response = await BookingModel.delete(id);
                if (response.success) {
                    showToast("Booking cancelled successfully", "success");
                    loadBookings(lastQuery);
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

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    useEffect(() => {
        if (!isInitialLoad) loadBookings(lastQuery);
    }, [currentPage]);

    useEffect(() => {
        if (!isInitialLoad) loadBookings(lastQuery);
    }, [sortBy, sortOrder]);

    return (
        <>
            <div className=" container-p-y">
                <h4 className="py-2 breadcrumb-wrapper mb-0">Facility Booking</h4>
                Manage your Facility Booking
            </div>
            <Filter onSubmit={loadBookings} />
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
                                    <th>#</th>
                                    <th style={{ cursor: 'pointer' }} onClick={() => handleSort('facility_code')}>Booking Code {getSortIcon('facility_code')}</th>
                                    <th style={{ cursor: 'pointer' }} onClick={() => handleSort('facility_id')}>Facility {getSortIcon('facility_id')}</th>
                                    <th>User</th>
                                    <th style={{ cursor: 'pointer' }} onClick={() => handleSort('booking_date')}>Date & Time {getSortIcon('booking_date')}</th>
                                    <th style={{ cursor: 'pointer' }} onClick={() => handleSort('total_hours')}>Duration {getSortIcon('total_hours')}</th>
                                    <th style={{ cursor: 'pointer' }} onClick={() => handleSort('total_price')}>Total Price {getSortIcon('total_price')}</th>
                                    <th>Proof</th>
                                    <th style={{ cursor: 'pointer' }} onClick={() => handleSort('status')}>Status {getSortIcon('status')}</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {bookings.length === 0 ? (
                                    <tr>
                                        <td colSpan={10} className="text-center py-4 text-muted">
                                            <i className="bx bx-info-circle bx-lg mb-2 d-block"></i>
                                            No bookings found
                                        </td>
                                    </tr>
                                ) : (
                                    bookings.map((booking, index) => (
                                        <tr key={booking.id}>
                                            <td>{((currentPage - 1) * 10) + index + 1}</td>
                                            <td>
                                                <span className="font-monospace fw-bold">{booking.facility_code}</span>
                                            </td>
                                            <td>
                                                <div className="fw-semibold">{booking.facility?.name || 'N/A'}</div>
                                                <small className="text-muted">{booking.facility?.category}</small>
                                            </td>
                                            <td>
                                                <div className="fw-semibold">{booking.user?.name || booking.guest_name || 'N/A'}</div>
                                                <small className="text-muted">{booking.user?.email || booking.guest_email}</small> <br />
                                                <small className="text-muted">{booking.user?.phone || booking.guest_phone}</small>
                                            </td>
                                            <td>
                                                <div>{formatDate(booking.booking_date)}</div>
                                                <small className="text-muted font-monospace">
                                                    {booking.start_time} - {booking.end_time}
                                                </small>
                                            </td>
                                            <td>{booking.total_hours} hours</td>
                                            <td className="fw-bold text-success">
                                                {formatCurrency(booking.total_price)}
                                            </td>
                                            <td>
                                                {booking.payment_proof ? (
                                                    <a href={`/uploads/payment_proof/${booking.payment_proof}`} target="_blank" rel="noreferrer">
                                                        <img
                                                            src={`/uploads/payment_proof/${booking.payment_proof}`}
                                                            alt="Payment Proof"
                                                            style={{
                                                                height: '48px',
                                                                width: '64px',
                                                                objectFit: 'cover',
                                                                borderRadius: '4px',
                                                                border: '1px solid #dee2e6',
                                                                cursor: 'pointer'
                                                            }}
                                                            title="Click to view full size"
                                                        />
                                                    </a>
                                                ) : (
                                                    <span className="badge bg-secondary" style={{ fontSize: '11px' }}>
                                                        No proof yet
                                                    </span>
                                                )}
                                            </td>
                                            <td>
                                                {booking.status && (
                                                    <StatusDropdown
                                                        currentStatus={booking.status?.name || booking.status}
                                                        bookingId={booking.id}
                                                        onStatusChange={updateStatus}
                                                        isLoading={loadingStatusId === booking.id}
                                                    />
                                                )}
                                            </td>
                                            <td>
                                                <button
                                                    className="btn btn-sm btn-icon btn-warning"
                                                    onClick={() => edit(booking)}
                                                    title="Edit"
                                                >
                                                    <i className="bx bx-edit"></i>
                                                </button>
                                                <button
                                                    className="btn btn-sm btn-icon btn-danger ms-1"
                                                    onClick={() => remove(booking.id)}
                                                    title="Cancel"
                                                >
                                                    <i className="bx bx-x"></i>
                                                </button>
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
                                    displaying {bookings.length} data
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

            {/* BOOKING FORM MODAL */}
            {showForm && (
                <FacilityBookingForm
                    title={editingId ? "Edit Booking" : "New Booking"}
                    data={formData}
                    onHide={() => setShowForm(false)}
                    onSave={save}
                    validationError={validationError}
                />
            )}
        </>
    );
};

export default FacilityBookingPage;
