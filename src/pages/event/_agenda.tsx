import React, { useState } from 'react';
import { Table, Button, Form as BootstrapForm } from 'react-bootstrap';
import { InEventAgendaForm } from '@/models/EventAgenda';

interface AgendaRow extends InEventAgendaForm {
    _isNew?: boolean;
    _isDeleted?: boolean;
    _tempId?: number;
}

interface EventAgendaStepProps {
    eventId: number | null;
    agendas: AgendaRow[];
    onChange: (agendas: AgendaRow[]) => void;
}

const EventAgendaStep: React.FC<EventAgendaStepProps> = ({ eventId, agendas, onChange }) => {
    const nextTempId = React.useRef(1);

    const addNewRow = () => {
        const newRow: AgendaRow = {
            events_id: eventId || 0,
            start_time: '',
            end_time: null,
            activity_name: '',
            notes: null,
            _isNew: true,
            _tempId: nextTempId.current++
        };
        onChange([...agendas, newRow]);
    };

    const updateRow = (index: number, field: keyof AgendaRow, value: any) => {
        const updated = [...agendas];
        updated[index] = { ...updated[index], [field]: value };
        onChange(updated);
    };

    const removeRow = (index: number) => {
        const row = agendas[index];
        if (row._isNew) {
            onChange(agendas.filter((_, i) => i !== index));
        } else {
            const updated = [...agendas];
            updated[index] = { ...updated[index], _isDeleted: true };
            onChange(updated);
        }
    };

    const activeAgendas = agendas.filter(a => !a._isDeleted);

    return (
        <div className="event-agenda-step">
            <div className="mb-3">
                <h6>Event Agenda</h6>
                <p className="text-muted small">
                    Add schedule items for this event. All times should be in HH:mm format (e.g., 09:00, 14:30).
                </p>
            </div>

            {activeAgendas.length === 0 ? (
                <div className="text-center py-4 bg-light rounded">
                    <i className="bx bx-calendar-event bx-lg text-muted mb-2"></i>
                    <p className="text-muted mb-3">No agenda items yet</p>
                    <Button variant="primary" size="sm" onClick={addNewRow}>
                        <i className="bx bx-plus me-1"></i>
                        Add First Agenda Item
                    </Button>
                </div>
            ) : (
                <>
                    <div className="table-responsive">
                        <Table bordered hover>
                            <thead className="table-light">
                                <tr>
                                    <th style={{ width: '130px' }}>Start Time *</th>
                                    <th style={{ width: '130px' }}>End Time</th>
                                    <th>Activity Name *</th>
                                    <th>Notes</th>
                                    <th style={{ width: '80px' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {activeAgendas.map((agenda, index) => {
                                    const actualIndex = agendas.indexOf(agenda);

                                    return (
                                        <tr key={agenda.id || agenda._tempId || index}>
                                            <td>
                                                <BootstrapForm.Control
                                                    type="time"
                                                    value={agenda.start_time}
                                                    onChange={(e) => updateRow(actualIndex, 'start_time', e.target.value)}
                                                    size="sm"
                                                />
                                            </td>
                                            <td>
                                                <BootstrapForm.Control
                                                    type="time"
                                                    value={agenda.end_time || ''}
                                                    onChange={(e) => updateRow(actualIndex, 'end_time', e.target.value || null)}
                                                    size="sm"
                                                />
                                            </td>
                                            <td>
                                                <BootstrapForm.Control
                                                    type="text"
                                                    value={agenda.activity_name}
                                                    onChange={(e) => updateRow(actualIndex, 'activity_name', e.target.value)}
                                                    placeholder="Enter activity name"
                                                    size="sm"
                                                />
                                            </td>
                                            <td>
                                                <BootstrapForm.Control
                                                    as="textarea"
                                                    rows={1}
                                                    value={agenda.notes || ''}
                                                    onChange={(e) => updateRow(actualIndex, 'notes', e.target.value || null)}
                                                    placeholder="Optional notes"
                                                    size="sm"
                                                />
                                            </td>
                                            <td className="text-center">
                                                <Button
                                                    variant="danger"
                                                    size="sm"
                                                    onClick={() => removeRow(actualIndex)}
                                                    title="Remove"
                                                >
                                                    <i className="bx bx-trash"></i>
                                                </Button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </Table>
                    </div>

                    <Button variant="outline-primary" size="sm" onClick={addNewRow} className="mb-3">
                        <i className="bx bx-plus me-1"></i>
                        Add Another Item
                    </Button>
                </>
            )}
        </div>
    );
};

export default EventAgendaStep;
