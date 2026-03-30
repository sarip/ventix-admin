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
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState<InFacilityBookingForm>({
        facility_id: 0,
        user_id: 0,
        booking_date: '',
        start_time: '',
        end_time: '',
        notes: ''
    });
    const [validationError, setValidationError] = useState<ValidationErrorProps[]>([]);
    const BookingModel = new FacilityBooking();


    const loadBookings = async (query: QueryParamsProps = {}) => {
        if (isInitialLoad) blockUI();
        try {
            query.page = currentPage;
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
        setFormData({
            facility_id: 0,
            user_id: 0,
            booking_date: '',
            start_time: '',
            end_time: '',
            notes: ''
        });
        setValidationError([]);
        setShowForm(true);
    };

    const save = useCallback(async (data: InFacilityBookingForm) => {
        try {
            await BookingModel.create(data);
            showToast('Booking successfully created', 'success');
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
    }, []);

    const updateStatus = async (id: number, status: string) => {
        try {
            await BookingModel.updateStatus(id, status);
            showToast("Status updated successfully", "success");
            loadBookings(lastQuery);
        } catch (error) {
            showToast("Failed to update status", "error");
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
                                    <th>Booking Code</th>
                                    <th>Facility</th>
                                    <th>User</th>
                                    <th>Date & Time</th>
                                    <th>Duration</th>
                                    <th>Total Price</th>
                                    <th>Status</th>
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
                                                <div className="fw-semibold">{booking.user?.name || 'N/A'}</div>
                                                <small className="text-muted">{booking.user?.email}</small>
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
                                                            alt="Proof"
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
                                                        Not uploaded
                                                    </span>
                                                )}
                                            </td>
                                            <td>
                                                {booking.status && (
                                                    <StatusDropdown
                                                        currentStatus={booking.status}
                                                        bookingId={booking.id}
                                                        onStatusChange={updateStatus}
                                                    />
                                                )}
                                            </td>
                                            <td>
                                                <button
                                                    className="btn btn-sm btn-icon btn-danger"
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
                    title="New Booking"
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
