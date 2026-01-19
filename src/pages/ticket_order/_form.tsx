/**
 * @author Sarip Hidayat <hidayatsarip2210@gmail.com>
 * @copyright Sarip Hidayat 2024
 * @date 2026-01-14
 */

import React, { useState, useEffect } from 'react';
import $ from "jquery";
import 'select2/dist/js/select2.min.js';
import 'select2/dist/css/select2.min.css';
import { Form as BootstrapForm, Row, Col, Table, Button } from 'react-bootstrap';
import { InTicketOrder, InOrderItem } from '@/models/TicketOrder';
import { User } from '@/models/User';
import Select2Component from '@/pages/_components/Select2';
import { EventTicket } from '@/models/EventTicket';
import SingleDateTimePicker from '@/pages/_components/SingleDateTimePicker';
import OptionOrderStatus from "@/pages/_components/OptionOrderStatus";
import { OrderStatus, InOrderStatus } from "@/models/OrderStatus";

interface OrderFormData extends Partial<InTicketOrder> {
    order_items?: InOrderItem[];
}

interface FormProps {
    title: string;
    data: OrderFormData;
    onHide: () => void;
    onSave: (data: OrderFormData) => void;
    validationError?: { field: string; message: string }[];
}

const TicketOrderForm: React.FC<FormProps> = ({ title, data, onHide, onSave, validationError = [] }) => {
    const [formData, setFormData] = useState<OrderFormData>(data);
    const [orderItems, setOrderItems] = useState<InOrderItem[]>(data.order_items || []);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const UserModel = new User();
    const EventTicketModel = new EventTicket();


    const [statusOptions, setStatusOptions] = useState<InOrderStatus[]>([]);
    const [statusLoaded, setStatusLoaded] = useState(false);

    useEffect(() => {
        setFormData(data);
        setOrderItems(data.order_items || []);
    }, [data]);

    useEffect(() => {
        const errorMap = validationError.reduce((acc: { [key: string]: string }, error) => {
            acc[error.field] = error.message;
            return acc;
        }, {});
        setErrors(errorMap);
    }, [validationError]);

    const handleInputChange = (e: any) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const addOrderItem = () => {
        const newItem: Partial<InOrderItem> = {
            event_ticket_id: 0,
            event_date: '',
            quantity: 1,
            unit_price: '0',
            subtotal: '0'
        };
        setOrderItems([...orderItems, newItem as InOrderItem]);
    };

    const updateOrderItem = async (index: number, field: keyof InOrderItem, value: any) => {
        const updated = [...orderItems];
        updated[index] = { ...updated[index], [field]: value };

        // Auto-fill price when ticket is selected
        if (field === 'event_ticket_id' && value) {
            try {
                const ticketData = await EventTicketModel.list({ filter: `id=${value}` });
                if (ticketData.event_ticket && ticketData.event_ticket.length > 0) {
                    const ticket = ticketData.event_ticket[0];
                    updated[index].unit_price = ticket.price.toString();
                    // Auto-calculate subtotal
                    const qty = updated[index].quantity || 1;
                    const price = parseFloat(ticket.price.toString());
                    updated[index].subtotal = (qty * price).toString();
                }
            } catch (error) {
                console.error('Failed to fetch ticket price:', error);
            }
        }

        // Auto-calculate subtotal when quantity changes
        if (field === 'quantity') {
            const qty = parseFloat(value) || 1;
            const price = parseFloat(updated[index].unit_price);
            updated[index].subtotal = (qty * price).toString();
        }

        // Auto-calculate subtotal when unit_price changes manually
        if (field === 'unit_price') {
            const qty = updated[index].quantity;
            const price = parseFloat(value);
            updated[index].subtotal = (qty * price).toString();
        }

        setOrderItems(updated);
    };

    const removeOrderItem = (index: number) => {
        setOrderItems(orderItems.filter((_, i) => i !== index));
    };

    const calculateTotal = () => {
        return orderItems.reduce((sum, item) => sum + parseFloat(item.subtotal || '0'), 0);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const total = calculateTotal();
        onSave({
            ...formData,
            total_amount: total.toString(),
            order_items: orderItems
        });
    };

    useEffect(() => {
        const model = new OrderStatus();
        model.list({ per_page: 1000000 })
            .then(res => {
                setStatusOptions(res.orders_status ?? []);
                setStatusLoaded(true);
            })
            .catch(console.error);
    }, []);


    return (
        <div className="modal fade show d-block" id='modal-ticket-order' style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-xl modal-dialog-scrollable">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">
                            <i className="bx bx-receipt me-2"></i>
                            {title}
                        </h5>
                        <button type="button" className="btn-close" onClick={onHide}></button>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="modal-body">
                            <Row className="g-3">
                                <Col md={12}>
                                    <h6 className="border-bottom pb-2 mb-3">Order Information</h6>
                                </Col>

                                <Col md={6}>
                                    <label className="form-label">User *</label>
                                    <Select2Component
                                        fetchData={UserModel.list}
                                        dropdownParent="#modal-ticket-order"
                                        placeholder="Select User"
                                        name="user_id"
                                        onChange={handleInputChange}
                                        validation={errors.user_id}
                                        selectedId={formData.user_id}
                                        dataKey="users"
                                        showKey="name"
                                    />
                                </Col>

                                <Col md={6}>
                                    <label className="form-label">Order Code</label>
                                    <input
                                        type="text"
                                        name="order_code"
                                        className="form-control"
                                        placeholder="Auto-generated if empty"
                                        value={formData.order_code || ''}
                                        onChange={handleInputChange}
                                        disabled={!!formData.id}
                                    />
                                </Col>

                                <Col md={6}>
                                    <label className="form-label">Payment Method *</label>
                                    <select
                                        name="payment_method"
                                        className={`form-select ${errors.payment_method ? 'is-invalid' : ''}`}
                                        value={formData.payment_method || ''}
                                        onChange={handleInputChange}
                                    >
                                        <option value="">Select Method</option>
                                        <option value="Bank Transfer">Bank Transfer</option>
                                        <option value="Credit Card">Credit Card</option>
                                        <option value="E-Wallet">E-Wallet</option>
                                        <option value="Cash">Cash</option>
                                    </select>
                                    {errors.payment_method && <div className="invalid-feedback">{errors.payment_method}</div>}
                                </Col>

                                <Col md={6}>
                                    <label className="form-label">Status *</label>
                                    <select
                                        name="status"
                                        className={`form-select ${errors.status ? 'is-invalid' : ''}`}
                                        value={statusLoaded ? formData.status ?? "" : ""}
                                        onChange={handleInputChange}
                                        disabled={!statusLoaded}
                                    >
                                        <option value="">-- Pilih Status --</option>

                                        {statusOptions.map((s) => (
                                            <option key={s.name} value={s.name.toLowerCase()}>
                                                {s.display_name}
                                            </option>
                                        ))}
                                    </select>

                                    {errors.status && <div className="invalid-feedback">{errors.status}</div>}
                                </Col>

                                <Col md={12} className="mt-4">
                                    <div className="d-flex justify-content-between align-items-center mb-3">
                                        <h6 className="border-bottom pb-2 mb-0">Order Items</h6>
                                        <Button variant="outline-primary" size="sm" type="button" onClick={addOrderItem}>
                                            <i className="bx bx-plus me-1"></i>
                                            Add Item
                                        </Button>
                                    </div>

                                    {orderItems.length === 0 ? (
                                        <div className="text-center py-3 bg-light rounded">
                                            <p className="text-muted mb-0">No items yet. Click "Add Item" to start.</p>
                                        </div>
                                    ) : (
                                        <Table bordered hover size="sm">
                                            <thead className="table-light">
                                                <tr>
                                                    <th width="30%">Ticket</th>
                                                    <th width="20%">Event Date</th>
                                                    <th width="10%">Qty</th>
                                                    <th width="15%">Unit Price</th>
                                                    <th width="15%">Subtotal</th>
                                                    <th width="10%">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {orderItems.map((item, index) => (
                                                    <tr key={index}>
                                                        <td>
                                                            <Select2Component
                                                                fetchData={EventTicketModel.list}
                                                                dropdownParent="#modal-ticket-order"
                                                                placeholder="Select Ticket"
                                                                name={`ticket_${index}`}
                                                                onChange={(e) => updateOrderItem(index, 'event_ticket_id', parseInt(e.target.value))}
                                                                selectedId={item.event_ticket_id}
                                                                dataKey="event_ticket"
                                                                showKey="name"
                                                            />
                                                        </td>
                                                        <td>
                                                            <input
                                                                type="datetime-local"
                                                                className="form-control form-control-sm"
                                                                value={item.event_date?.substring(0, 16) || ''}
                                                                onChange={(e) => updateOrderItem(index, 'event_date', e.target.value)}
                                                            />
                                                        </td>
                                                        <td>
                                                            <input
                                                                type="number"
                                                                min="1"
                                                                className="form-control form-control-sm"
                                                                value={item.quantity}
                                                                onChange={(e) => updateOrderItem(index, 'quantity', parseInt(e.target.value) || 1)}
                                                            />
                                                        </td>
                                                        <td>
                                                            <input
                                                                type="number"
                                                                min="0"
                                                                step="1000"
                                                                className="form-control form-control-sm bg-light"
                                                                value={item.unit_price}
                                                                onChange={(e) => updateOrderItem(index, 'unit_price', e.target.value)}
                                                                readOnly
                                                                title="Auto-filled from ticket price"
                                                            />
                                                        </td>
                                                        <td>
                                                            <input
                                                                type="text"
                                                                className="form-control form-control-sm"
                                                                value={item.subtotal}
                                                                readOnly
                                                            />
                                                        </td>
                                                        <td className="text-center">
                                                            <button
                                                                type="button"
                                                                className="btn btn-sm btn-danger"
                                                                onClick={() => removeOrderItem(index)}
                                                            >
                                                                <i className="bx bx-trash"></i>
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                            <tfoot className="table-light">
                                                <tr>
                                                    <td colSpan={4} className="text-end fw-bold">Total:</td>
                                                    <td className="fw-bold text-primary">
                                                        {new Intl.NumberFormat('id-ID', {
                                                            style: 'currency',
                                                            currency: 'IDR',
                                                            minimumFractionDigits: 0
                                                        }).format(calculateTotal())}
                                                    </td>
                                                    <td></td>
                                                </tr>
                                            </tfoot>
                                        </Table>
                                    )}
                                </Col>
                            </Row>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" onClick={onHide}>
                                Cancel
                            </button>
                            <button type="submit" className="btn btn-primary">
                                <i className="bx bx-save me-1"></i>
                                {formData.id ? 'Update' : 'Create'} Order
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default TicketOrderForm;
