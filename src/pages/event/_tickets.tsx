import React, {useEffect, useState} from 'react';
import { Table, Button, Form as BootstrapForm, Row, Col } from 'react-bootstrap';
import { InEventTicketForm } from '@/models/EventTicket';
import SingleDateTimePicker from '@/pages/_components/SingleDateTimePicker';
import {InMasterTaxe, MasterTaxe} from "@/models/MasterTaxe";

interface TicketRow extends InEventTicketForm {
    _isNew?: boolean;
    _isDeleted?: boolean;
    _tempId?: number;
}

interface EventTicketsStepProps {
    eventId: number | null;
    tickets: TicketRow[];
    onChange: (tickets: TicketRow[]) => void;
}

const EventTicketsStep: React.FC<EventTicketsStepProps> = ({ eventId, tickets, onChange }) => {
    const nextTempId = React.useRef(1);
    const [taxes, setTaxes] = useState<InMasterTaxe[]>([]);

    const addNewRow = () => {
        const newRow: TicketRow = {
            event_id: eventId || 0,
            name: '',
            description: null,
            price: 0,
            final_price: 0,
            is_taxable: 'N',
            tax_id: "",
            total_capacity: 0,
            remaining_capacity: 0,
            max_per_order: 5,
            sales_start_date: null,
            sales_end_date: null,
            is_active: true,
            sort_order: tickets.filter(t => !t._isDeleted).length,
            _isNew: true,
            _tempId: nextTempId.current++
        };
        onChange([...tickets, newRow]);
    };

    const updateRow = (index: number, field: keyof TicketRow, value: any) => {
        const updated = [...tickets];
        updated[index] = { ...updated[index], [field]: value };

        // Auto-sync remaining_capacity when total_capacity changes
        if (field === 'total_capacity' && updated[index]._isNew) {
            updated[index].remaining_capacity = value;
        }


        const ticket = updated[index];
        if (ticket.is_taxable === 'Y') {
            ticket.final_price = calculateFinalPrice(ticket.price, ticket.tax_id);
        } else {
            ticket.final_price = ticket.price;
            ticket.tax_id = '';
        }

        onChange(updated);
    };

    const removeRow = (index: number) => {
        const row = tickets[index];
        if (row._isNew) {
            onChange(tickets.filter((_, i) => i !== index));
        } else {
            const updated = [...tickets];
            updated[index] = { ...updated[index], _isDeleted: true };
            onChange(updated);
        }
    };

    const activeTickets = tickets.filter(t => !t._isDeleted);

    const calculateFinalPrice = (price: number, taxId?: number) => {
        if (!taxId) return price;
        const tax = taxes.find(t => t.id === Number(taxId));
        if (!tax) return price;
        return price + price * (tax.rate / 100);
    };


    const TaxesModel = new MasterTaxe();
    const loadtaxes = () => {
        TaxesModel.list({per_page: `1000000000000`}).then(response => {
            setTaxes(response.master_taxes);
        })
    }

    useEffect(() => {
        loadtaxes();
    }, []);

    return (
        <div className="event-tickets-step">
            <div className="mb-3">
                <h6>Event Tickets</h6>
                <p className="text-muted small">
                    Configure ticket types for this event. You can add multiple ticket categories with different prices and capacities.
                </p>
            </div>

            {activeTickets.length === 0 ? (
                <div className="text-center py-4 bg-light rounded">
                    <i className="bx bx-ticket bx-lg text-muted mb-2"></i>
                    <p className="text-muted mb-3">No tickets yet</p>
                    <Button variant="primary" size="sm" onClick={addNewRow}>
                        <i className="bx bx-plus me-1"></i>
                        Add First Ticket
                    </Button>
                </div>
            ) : (
                <>
                    {activeTickets.map((ticket, index) => {
                        const actualIndex = tickets.indexOf(ticket);

                        return (
                            <div key={ticket.id || ticket._tempId || index} className="card mb-3">
                                <div className="card-body">
                                    <div className="d-flex justify-content-between align-items-center mb-3">
                                        <h6 className="mb-0">
                                            <i className="bx bx-ticket me-1"></i>
                                            Ticket #{index + 1}
                                        </h6>
                                        <Button
                                            variant="outline-danger"
                                            size="sm"
                                            onClick={() => removeRow(actualIndex)}
                                        >
                                            <i className="bx bx-trash"></i>
                                        </Button>
                                    </div>

                                    <Row className="g-3">
                                        <Col md={12}>
                                            <BootstrapForm.Group>
                                                <BootstrapForm.Label>Ticket Name *</BootstrapForm.Label>
                                                <BootstrapForm.Control
                                                    type="text"
                                                    value={ticket.name}
                                                    onChange={(e) => updateRow(actualIndex, 'name', e.target.value)}
                                                    placeholder="e.g., General Admission, VIP, Early Bird"
                                                />
                                            </BootstrapForm.Group>
                                        </Col>

                                        <Col md={3}>
                                            <BootstrapForm.Group>
                                                <BootstrapForm.Label>Price (IDR) *</BootstrapForm.Label>
                                                <BootstrapForm.Control
                                                    type="number"
                                                    min="0"
                                                    step="1000"
                                                    value={ticket.price}
                                                    onChange={(e) => updateRow(actualIndex, 'price', parseFloat(e.target.value) || 0)}
                                                    placeholder="0"
                                                />
                                            </BootstrapForm.Group>
                                        </Col>
                                        <Col md={2}>
                                            <BootstrapForm.Group>
                                                <BootstrapForm.Label>Is Taxable ? *</BootstrapForm.Label>
                                                <BootstrapForm.Select
                                                    value={ticket.is_taxable}
                                                    onChange={(e) => updateRow(actualIndex, 'is_taxable', e.target.value)}
                                                >
                                                    <option value="N">No</option>
                                                    <option value="Y">Yes</option>
                                                </BootstrapForm.Select>
                                            </BootstrapForm.Group>
                                        </Col>
                                        {ticket.is_taxable === 'Y' && (
                                            <Col md={3}>
                                                <BootstrapForm.Group>
                                                    <BootstrapForm.Label>Tax *</BootstrapForm.Label>
                                                    <BootstrapForm.Select
                                                        value={ticket.tax_id || ''}
                                                        onChange={(e) => updateRow(actualIndex, 'tax_id', e.target.value)}
                                                    >
                                                        <option value="">-- Select Tax --</option>
                                                        {taxes.map(tax => (
                                                            <option key={tax.id} value={tax.id}>
                                                                {tax.name} ({tax.rate}%)
                                                            </option>
                                                        ))}
                                                    </BootstrapForm.Select>
                                                </BootstrapForm.Group>
                                            </Col>
                                        )}


                                        <Col md={4}>
                                            <BootstrapForm.Group>
                                                <BootstrapForm.Label>Final Price (IDR) *</BootstrapForm.Label>
                                                <BootstrapForm.Control
                                                    type="number"
                                                    readOnly={true}
                                                    disabled={true}
                                                    value={ticket.final_price}
                                                />
                                            </BootstrapForm.Group>
                                        </Col>

                                        <Col md={12}>
                                            <BootstrapForm.Group>
                                                <BootstrapForm.Label>Description</BootstrapForm.Label>
                                                <BootstrapForm.Control
                                                    as="textarea"
                                                    rows={2}
                                                    value={ticket.description || ''}
                                                    onChange={(e) => updateRow(actualIndex, 'description', e.target.value || null)}
                                                    placeholder="Optional description about this ticket type"
                                                />
                                            </BootstrapForm.Group>
                                        </Col>

                                        <Col md={4}>
                                            <BootstrapForm.Group>
                                                <BootstrapForm.Label>Total Capacity *</BootstrapForm.Label>
                                                <BootstrapForm.Control
                                                    type="number"
                                                    min="0"
                                                    value={ticket.total_capacity}
                                                    onChange={(e) => updateRow(actualIndex, 'total_capacity', parseInt(e.target.value) || 0)}
                                                    placeholder="0"
                                                />
                                            </BootstrapForm.Group>
                                        </Col>

                                        <Col md={4}>
                                            <BootstrapForm.Group>
                                                <BootstrapForm.Label>Remaining Capacity *</BootstrapForm.Label>
                                                <BootstrapForm.Control
                                                    type="number"
                                                    min="0"
                                                    max={ticket.total_capacity}
                                                    value={ticket.remaining_capacity}
                                                    onChange={(e) => updateRow(actualIndex, 'remaining_capacity', parseInt(e.target.value) || 0)}
                                                    placeholder="0"
                                                />
                                            </BootstrapForm.Group>
                                        </Col>

                                        <Col md={4}>
                                            <BootstrapForm.Group>
                                                <BootstrapForm.Label>Max Per Order</BootstrapForm.Label>
                                                <BootstrapForm.Control
                                                    type="number"
                                                    min="1"
                                                    value={ticket.max_per_order || 5}
                                                    onChange={(e) => updateRow(actualIndex, 'max_per_order', parseInt(e.target.value) || 5)}
                                                    placeholder="5"
                                                />
                                            </BootstrapForm.Group>
                                        </Col>

                                        <Col md={6}>
                                            <SingleDateTimePicker
                                                name="sales_start_date"
                                                label="Sales Start Date"
                                                parentEl="#modal-Event"
                                                value={ticket.sales_start_date || ''}
                                                onChange={(name, value) => updateRow(actualIndex, 'sales_start_date', value || null)}
                                            />
                                        </Col>

                                        <Col md={6}>
                                            <SingleDateTimePicker
                                                name="sales_end_date"
                                                label="Sales End Date"
                                                parentEl="#modal-Event"
                                                value={ticket.sales_end_date || ''}
                                                onChange={(name, value) => updateRow(actualIndex, 'sales_end_date', value || null)}
                                            />
                                        </Col>

                                        <Col md={6}>
                                            <BootstrapForm.Group>
                                                <BootstrapForm.Label>Sort Order</BootstrapForm.Label>
                                                <BootstrapForm.Control
                                                    type="number"
                                                    min="0"
                                                    value={ticket.sort_order || 0}
                                                    onChange={(e) => updateRow(actualIndex, 'sort_order', parseInt(e.target.value) || 0)}
                                                    placeholder="0"
                                                />
                                                <BootstrapForm.Text className="text-muted">
                                                    Display order (lower numbers appear first)
                                                </BootstrapForm.Text>
                                            </BootstrapForm.Group>
                                        </Col>

                                        <Col md={6}>
                                            <BootstrapForm.Group>
                                                <BootstrapForm.Label>Status</BootstrapForm.Label>
                                                <BootstrapForm.Check
                                                    type="switch"
                                                    label={ticket.is_active ? 'Active' : 'Inactive'}
                                                    checked={ticket.is_active !== false}
                                                    onChange={(e) => updateRow(actualIndex, 'is_active', e.target.checked)}
                                                    className="mt-2"
                                                />
                                            </BootstrapForm.Group>
                                        </Col>
                                    </Row>
                                </div>
                            </div>
                        );
                    })}

                    <Button variant="outline-primary" size="sm" onClick={addNewRow}>
                        <i className="bx bx-plus me-1"></i>
                        Add Another Ticket
                    </Button>
                </>
            )}
        </div>
    );
};

export default EventTicketsStep;
