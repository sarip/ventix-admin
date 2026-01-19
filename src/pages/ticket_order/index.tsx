/**
 * @author Sarip Hidayat <hidayatsarip2210@gmail.com>
 * @copyright Sarip Hidayat 2024
 * @date 2026-01-14
 */

import React, { useEffect, useState, useCallback } from 'react';
import { Badge, Button } from 'react-bootstrap';
import Swal from 'sweetalert2';
import useBlockUI from '@/pages/_components/useBlockUI';
import Pagination from '@/pages/_components/Pagination';
import { TicketOrder, InTicketOrder, InOrderItem } from '@/models/TicketOrder';
import { showToast } from '@/utils/toast';
import TicketOrderForm from './_form';
import Filter, {QueryParamsProps} from "./_filter";

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

const TicketOrderPage: React.FC = () => {
    const { blockUI, unblockUI } = useBlockUI();
    const [orders, setOrders] = useState<InTicketOrder[]>([]);
    const [pagination, setPagination] = useState<PaginationProps | null>(null);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [isInitialLoad, setIsInitialLoad] = useState<boolean>(true);
    const [pageCount, setPageCount] = useState<number>(0);
    const [lastQuery, setLastQuery] = useState<any>({});
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState<Partial<InTicketOrder>>({
        user_id: 0,
        order_code: '',
        total_amount: '0',
        status: 'pending',
        payment_method: '',
        order_items: []
    });
    const [validationError, setValidationError] = useState<ValidationErrorProps[]>([]);
    const TicketOrderModel = new TicketOrder();


    const loadOrders = async (query: QueryParamsProps = {}) => {
        if (isInitialLoad) blockUI();
        try {
            query.page = currentPage;
            const response = await TicketOrderModel.list(query);
            setLastQuery(query);
            setOrders(response.orders || []);
            setPagination(response.pagination);
            setPageCount(response.pagination.page_count);
        } catch (error) {
            showToast('Failed to load orders', 'error');
        } finally {
            if (isInitialLoad) {
                unblockUI();
                setIsInitialLoad(false);
            }
        }
    };

    const create = () => {
        setFormData({
            user_id: 0,
            order_code: '',
            total_amount: '0',
            status: 'pending',
            payment_method: '',
            order_items: []
        });
        setValidationError([]);
        setShowForm(true);
    };

    const update = (order: InTicketOrder) => {
        setFormData({
            ...order,
            status: order.status?.toLowerCase(),
            order_items: order.order_item || []
        });
        setValidationError([]);
        setShowForm(true);
    };

    const save = useCallback(async (data: Partial<InTicketOrder>) => {
        try {
            if (data.id) {
                await TicketOrderModel.update(data.id, data);
            } else {
                await TicketOrderModel.create(data);
            }
            showToast(`Order successfully ${data.id ? 'updated' : 'created'}`, 'success');
            setShowForm(false);
            loadOrders(lastQuery);
        } catch (error: any) {
            let lines = error.message.trim().split('\n');
            let result: ValidationErrorProps[] = lines.map((line: string) => {
                let [field, ...message] = line.split(' ');
                return { field, message: message.join(' ') };
            });
            setValidationError(result);
        }
    }, [TicketOrderModel, lastQuery, loadOrders]);

    const remove = async (id: number) => {
        Swal.fire({
            title: "Are you sure?",
            text: "Once deleted, you will not be able to recover this order",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
            cancelButtonText: "Cancel",
        }).then(async (result) => {
            if (result.isConfirmed) {
                const response = await TicketOrderModel.delete(id);
                if (response.success) {
                    showToast("Order successfully deleted", "success");
                    loadOrders(lastQuery);
                }
            }
        });
    };

    const toggleRow = (id: number) => {
        const newExpanded = new Set(expandedRows);
        if (newExpanded.has(id)) {
            newExpanded.delete(id);
        } else {
            newExpanded.add(id);
        }
        setExpandedRows(newExpanded);
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

    const getStatusBadge = (status: string) => {
        const statusMap: { [key: string]: string } = {
            pending: 'warning',
            paid: 'success',
            cancelled: 'danger',
            refunded: 'secondary'
        };
        return <Badge bg={statusMap[status.toLowerCase()] || 'secondary'}>{status}</Badge>;
    };

    useEffect(() => {
        if (!isInitialLoad) loadOrders(lastQuery);
    }, [currentPage]);

    return (
        <>
            <div className=" container-p-y">
                <h4 className="py-2 breadcrumb-wrapper mb-0">Orders</h4>
                Manage your Order
            </div>
            <Filter onSubmit={loadOrders} />
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
                                <th style={{ width: '50px' }}></th>
                                <th style={{ width: '100px' }}>Actions</th>
                                <th>Order Code</th>
                                <th>User</th>
                                <th>Total Amount</th>
                                <th>Payment Method</th>
                                <th>Status</th>
                                <th>Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.length === 0 ? (
                                <tr>
                                    <td colSpan={9} className="text-center py-4 text-muted">
                                        <i className="bx bx-info-circle bx-lg mb-2 d-block"></i>
                                        No orders found
                                    </td>
                                </tr>
                            ) : (
                                orders.map((order, index) => (
                                    <React.Fragment key={order.id}>
                                        <tr>
                                            <td>
                                                <button
                                                    className="btn btn-sm btn-link p-0"
                                                    onClick={() => toggleRow(order.id)}
                                                >
                                                    <i className={`bx ${expandedRows.has(order.id) ? 'bx-chevron-down' : 'bx-chevron-right'}`}></i>
                                                </button>
                                            </td>
                                            <td>
                                                <div className="d-flex gap-1">
                                                    <button className="btn btn-sm btn-icon btn-warning" onClick={() => update(order)} title="Edit">
                                                        <i className="bx bx-edit"></i>
                                                    </button>
                                                    <button className="btn btn-sm btn-icon btn-danger" onClick={() => remove(order.id)} title="Delete">
                                                        <i className="bx bx-trash"></i>
                                                    </button>
                                                </div>
                                            </td>
                                            <td>
                                                <span className="font-monospace fw-bold">{order.order_code}</span>
                                            </td>
                                            <td>
                                                <div className="fw-semibold">{order.user?.name || 'N/A'}</div>
                                                <small className="text-muted">{order.user?.email}</small>
                                            </td>
                                            <td className="fw-bold text-primary">
                                                {formatCurrency(order.total_amount)}
                                            </td>
                                            <td>{order.payment_method}</td>

                                            <td  dangerouslySetInnerHTML={{
                                                __html: order.status_badge,
                                            }} />
                                            <td>
                                                <small>{formatDate(order.created_at)}</small>
                                            </td>
                                        </tr>
                                        {expandedRows.has(order.id) && order.order_item && (
                                            <tr>
                                                <td colSpan={9} className="bg-light">
                                                    <div className="p-3">
                                                        <h6 className="mb-3">
                                                            <i className="bx bx-list-ul me-1"></i>
                                                            Order Items
                                                        </h6>
                                                        <table className="table table-sm table-bordered bg-white">
                                                            <thead>
                                                                <tr>
                                                                    <th>Ticket</th>
                                                                    <th>Event Date</th>
                                                                    <th>Quantity</th>
                                                                    <th>Unit Price</th>
                                                                    <th>Subtotal</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {order.order_item.map((item: InOrderItem) => (
                                                                    <tr key={item.id}>
                                                                        <td>Ticket #{item.event_ticket_id}</td>
                                                                        <td>{formatDate(item.event_date)}</td>
                                                                        <td>
                                                                            <Badge bg="info">{item.quantity}x</Badge>
                                                                        </td>
                                                                        <td>{formatCurrency(item.unit_price)}</td>
                                                                        <td className="fw-bold">{formatCurrency(item.subtotal)}</td>
                                                                    </tr>
                                                                ))}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </React.Fragment>
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
                                displaying {orders.length} data
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
            {showForm && (
                <TicketOrderForm
                    title={formData.id ? 'Edit Order' : 'Create Order'}
                    data={formData}
                    onHide={() => setShowForm(false)}
                    onSave={save}
                    validationError={validationError}
                />
            )}
        </>
    );
};

export default TicketOrderPage;
