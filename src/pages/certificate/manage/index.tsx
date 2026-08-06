import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Button, Table, Spinner, Badge } from 'react-bootstrap';
import CertificateModel from '@/models/CertificateModel';
import CertificateTemplateModel from '@/models/CertificateTemplateModel';
import { Event } from '@/models/Event';
const EventModel = new Event();
import Swal from 'sweetalert2';

const CertificateManagePage: React.FC = () => {
    const [events, setEvents] = useState<any[]>([]);
    const [templates, setTemplates] = useState<any[]>([]);
    const [selectedEventId, setSelectedEventId] = useState<number | null>(null);
    const [selectedTemplateId, setSelectedTemplateId] = useState<number | null>(null);
    const [participants, setParticipants] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [generating, setGenerating] = useState(false);

    useEffect(() => {
        loadEvents();
        loadTemplates();
    }, []);

    useEffect(() => {
        if (selectedEventId) {
            loadParticipants(selectedEventId);
        }
    }, [selectedEventId]);

    const loadEvents = async () => {
        try {
            const res: any = await EventModel.list({ per_page: 100 });
            if (res?.data) {
                setEvents(res.data);
            }
        } catch (err) {
            console.error('Failed to load events', err);
        }
    };

    const loadTemplates = async () => {
        try {
            const res: any = await CertificateTemplateModel.list();
            if (res?.data) {
                setTemplates(res.data);
            }
        } catch (err) {
            console.error('Failed to load templates', err);
        }
    };

    const loadParticipants = async (eventId: number) => {
        setLoading(true);
        try {
            const res: any = await CertificateModel.getParticipants(eventId);
            if (res?.data) {
                setParticipants(res.data);
            }
        } catch (err) {
            console.error('Failed to load participants', err);
        } finally {
            setLoading(false);
        }
    };

    const handleGenerateSingle = async (userId: number) => {
        if (!selectedEventId) return;
        setGenerating(true);
        try {
            await CertificateModel.generate(selectedEventId, userId, selectedTemplateId || undefined);
            Swal.fire('Success', 'Certificate generated', 'success');
            loadParticipants(selectedEventId);
        } catch (err: any) {
            Swal.fire('Error', err?.message || 'Generation failed', 'error');
        } finally {
            setGenerating(false);
        }
    };

    const handleGenerateBulk = async () => {
        if (!selectedEventId) {
            Swal.fire('Warning', 'Please select an event first', 'warning');
            return;
        }

        const confirm = await Swal.fire({
            title: 'Generate All Certificates?',
            text: `Generate certificates for all ${participants.length} present participants?`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Generate All'
        });

        if (!confirm.isConfirmed) return;

        setGenerating(true);
        try {
            const res: any = await CertificateModel.generateBulk(selectedEventId, selectedTemplateId || undefined);
            Swal.fire('Success', `Generated ${res.data?.generated_count || 0} certificates`, 'success');
            loadParticipants(selectedEventId);
        } catch (err: any) {
            Swal.fire('Error', err?.message || 'Bulk generation failed', 'error');
        } finally {
            setGenerating(false);
        }
    };

    const handleSendNotification = async (certificateId: number, channel: 'EMAIL' | 'WHATSAPP') => {
        try {
            await CertificateModel.send(certificateId, channel);
            Swal.fire('Success', `Sent via ${channel}`, 'success');
            if (selectedEventId) loadParticipants(selectedEventId);
        } catch (err: any) {
            Swal.fire('Error', err?.message || 'Sending failed', 'error');
        }
    };

    return (
        <div className="py-3 px-2">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <div>
                    <h4 className="fw-bold text-dark mb-1">Certificate Management</h4>
                    <p className="text-muted small mb-0">Generate digital certificates for present attendees and send via Email/WhatsApp</p>
                </div>
                <div className="d-flex gap-2">
                    <Button variant="outline-primary" className="rounded-pill" href="/certificate/template">
                        <i className="bx bx-layout me-1"></i> Template Builder
                    </Button>
                    <Button variant="primary" className="rounded-pill px-3" onClick={handleGenerateBulk} disabled={generating || !selectedEventId || participants.length === 0}>
                        {generating ? <Spinner size="sm" animation="border" /> : <><i className="bx bx-certification me-1"></i> Generate All Certificates</>}
                    </Button>
                </div>
            </div>

            <Row className="g-3 mb-4">
                <Col md={6}>
                    <Card className="border-0 shadow-sm rounded-4 p-3 bg-white">
                        <h6 className="fw-bold mb-2">Select Event</h6>
                        <select className="form-select" value={selectedEventId || ''} onChange={e => setSelectedEventId(Number(e.target.value) || null)}>
                            <option value="">-- Choose Event --</option>
                            {events.map(ev => (
                                <option key={ev.id} value={ev.id}>{ev.title || ev.name}</option>
                            ))}
                        </select>
                    </Card>
                </Col>
                <Col md={6}>
                    <Card className="border-0 shadow-sm rounded-4 p-3 bg-white">
                        <h6 className="fw-bold mb-2">Select Certificate Template (Optional)</h6>
                        <select className="form-select" value={selectedTemplateId || ''} onChange={e => setSelectedTemplateId(Number(e.target.value) || null)}>
                            <option value="">-- Active Default Template --</option>
                            {templates.map(t => (
                                <option key={t.id} value={t.id}>{t.name}</option>
                            ))}
                        </select>
                    </Card>
                </Col>
            </Row>

            <Card className="border-0 shadow-sm rounded-4 p-3 bg-white">
                <h6 className="fw-bold mb-3">Attended Participants List ({participants.length})</h6>

                {loading ? (
                    <div className="text-center py-4"><Spinner animation="border" variant="primary" /></div>
                ) : (
                    <Table hover responsive className="align-middle mb-0">
                        <thead className="bg-light">
                            <tr>
                                <th>Participant</th>
                                <th>Email / Phone</th>
                                <th>Check-in Time</th>
                                <th>Certificate Number</th>
                                <th>Status</th>
                                <th className="text-end">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {participants.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="text-center py-4 text-muted">
                                        {selectedEventId ? 'No present participants found for this event.' : 'Please select an event to view attendees.'}
                                    </td>
                                </tr>
                            ) : (
                                participants.map(p => (
                                    <tr key={p.ticket_id}>
                                        <td className="fw-bold">{p.user_name}</td>
                                        <td className="small text-muted">{p.user_email}<br />{p.user_phone}</td>
                                        <td className="small">{p.check_in_at || 'Present'}</td>
                                        <td>{p.certificate_number ? <span className="badge bg-light text-dark border">{p.certificate_number}</span> : '-'}</td>
                                        <td>
                                            {p.certificate_id ? (
                                                <Badge bg={p.certificate_status === 'SENT' ? 'success' : 'primary'}>{p.certificate_status || 'GENERATED'}</Badge>
                                            ) : (
                                                <Badge bg="secondary">Not Generated</Badge>
                                            )}
                                        </td>
                                        <td className="text-end">
                                            {p.certificate_id ? (
                                                <div className="d-flex justify-content-end gap-1">
                                                    <a href={p.download_url} target="_blank" rel="noreferrer" className="btn btn-sm btn-light border">
                                                        <i className="bx bx-download"></i> PDF
                                                    </a>
                                                    <Button size="sm" variant="outline-success" onClick={() => handleSendNotification(p.certificate_id, 'WHATSAPP')}>
                                                        <i className="bx bxl-whatsapp"></i> WA
                                                    </Button>
                                                    <Button size="sm" variant="outline-primary" onClick={() => handleSendNotification(p.certificate_id, 'EMAIL')}>
                                                        <i className="bx bx-envelope"></i> Email
                                                    </Button>
                                                </div>
                                            ) : (
                                                <Button size="sm" variant="primary" onClick={() => handleGenerateSingle(p.user_id)} disabled={generating}>
                                                    Generate
                                                </Button>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </Table>
                )}
            </Card>
        </div>
    );
};

export default CertificateManagePage;
