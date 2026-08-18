import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Button, Table, Spinner, Badge, Form } from 'react-bootstrap';
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
    const [selectedCertIds, setSelectedCertIds] = useState<Set<number>>(new Set());
    const [bulkSending, setBulkSending] = useState(false);
    const [sendingKey, setSendingKey] = useState<string | null>(null);

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
            setEvents(res.events || []);
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
        setSelectedCertIds(new Set());
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

    const handleGenerateSingle = async (userId: number, forceRegenerate: boolean = false) => {
        if (!selectedEventId) return;
        setGenerating(true);
        try {
            await CertificateModel.generate(selectedEventId, userId, selectedTemplateId || undefined, forceRegenerate);
            Swal.fire('Success', forceRegenerate ? 'Certificate regenerated successfully' : 'Certificate generated successfully', 'success');
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

    // WhatsApp has no server-side send without a paid gateway (not configured yet), so WA is
    // dispatched by opening a wa.me deep link in the admin's own browser with the message
    // pre-filled - the admin still has to press Send inside WhatsApp itself.
    const buildWaMeUrl = (phone: string, message: string) => {
        let digits = (phone || '').replace(/[^0-9]/g, '');
        if (digits.startsWith('0')) digits = '62' + digits.slice(1);
        return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
    };

    const buildWaMessage = (name: string, downloadUrl: string) => {
        const eventTitle = events.find(e => e.id === selectedEventId)?.title || events.find(e => e.id === selectedEventId)?.name || 'event kami';
        return `Halo ${name || 'Peserta'},\n\nTerima kasih telah mengikuti event ${eventTitle}.\n\nSertifikat digital Anda dapat diakses melalui link berikut:\n${downloadUrl}\n\nTerima kasih.`;
    };

    const handleSendNotification = async (p: any, channel: 'EMAIL' | 'WHATSAPP') => {
        const certificateId = p.certificate_id;
        const key = `${certificateId}_${channel}`;
        setSendingKey(key);
        try {
            if (channel === 'WHATSAPP') {
                const url = buildWaMeUrl(p.user_phone, buildWaMessage(p.user_name, p.download_url));
                window.open(url, '_blank');
            }
            await CertificateModel.send(certificateId, channel);
            if (channel === 'EMAIL') Swal.fire('Success', `Sent via ${channel}`, 'success');
            if (selectedEventId) loadParticipants(selectedEventId);
        } catch (err: any) {
            Swal.fire('Error', err?.message || 'Sending failed', 'error');
        } finally {
            setSendingKey(null);
        }
    };

    const sendableCertIds = participants.filter(p => p.certificate_id).map(p => p.certificate_id as number);
    const allSendableSelected = sendableCertIds.length > 0 && sendableCertIds.every(id => selectedCertIds.has(id));

    const toggleSelectAll = () => {
        setSelectedCertIds(allSendableSelected ? new Set() : new Set(sendableCertIds));
    };

    const toggleSelectOne = (certId: number) => {
        setSelectedCertIds((prev) => {
            const next = new Set(prev);
            if (next.has(certId)) next.delete(certId);
            else next.add(certId);
            return next;
        });
    };

    const handleBulkSend = async (channel: 'EMAIL' | 'WHATSAPP') => {
        const ids = Array.from(selectedCertIds);
        if (ids.length === 0) return;

        const confirm = await Swal.fire({
            title: `Send ${channel === 'WHATSAPP' ? 'WhatsApp' : 'Email'} to ${ids.length} recipient(s)?`,
            text: channel === 'WHATSAPP'
                ? 'A WhatsApp tab will open for each recipient - your browser may block tabs after the first one. Allow pop-ups for this site if that happens.'
                : undefined,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Send',
        });
        if (!confirm.isConfirmed) return;

        setBulkSending(true);
        try {
            if (channel === 'WHATSAPP') {
                participants
                    .filter(p => selectedCertIds.has(p.certificate_id))
                    .forEach(p => window.open(buildWaMeUrl(p.user_phone, buildWaMessage(p.user_name, p.download_url)), '_blank'));
            }

            const res: any = await CertificateModel.sendBulk(ids, channel);
            const sentCount = res?.data?.sent_count ?? 0;
            const total = res?.data?.total ?? ids.length;
            Swal.fire('Done', `${sentCount}/${total} sent successfully via ${channel}`, sentCount === total ? 'success' : 'warning');
            setSelectedCertIds(new Set());
            if (selectedEventId) loadParticipants(selectedEventId);
        } catch (err: any) {
            Swal.fire('Error', err?.message || 'Bulk send failed', 'error');
        } finally {
            setBulkSending(false);
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
                <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
                    <h6 className="fw-bold mb-0">Attended Participants List ({participants.length})</h6>
                    {selectedCertIds.size > 0 && (
                        <div className="d-flex align-items-center gap-2">
                            <span className="small text-muted">{selectedCertIds.size} selected</span>
                            <Button size="sm" variant="outline-success" onClick={() => handleBulkSend('WHATSAPP')} disabled={bulkSending}>
                                {bulkSending ? <Spinner size="sm" animation="border" /> : <><i className="bx bxl-whatsapp me-1"></i> Send WA to Selected</>}
                            </Button>
                            <Button size="sm" variant="outline-primary" onClick={() => handleBulkSend('EMAIL')} disabled={bulkSending}>
                                {bulkSending ? <Spinner size="sm" animation="border" /> : <><i className="bx bx-envelope me-1"></i> Send Email to Selected</>}
                            </Button>
                        </div>
                    )}
                </div>

                {loading ? (
                    <div className="text-center py-4"><Spinner animation="border" variant="primary" /></div>
                ) : (
                    <Table hover responsive className="align-middle mb-0">
                        <thead className="bg-light">
                            <tr>
                                <th style={{ width: '36px' }}>
                                    <Form.Check
                                        type="checkbox"
                                        checked={allSendableSelected}
                                        onChange={toggleSelectAll}
                                        disabled={sendableCertIds.length === 0}
                                        title="Select all sendable participants"
                                    />
                                </th>
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
                                    <td colSpan={7} className="text-center py-4 text-muted">
                                        {selectedEventId ? 'No present participants found for this event.' : 'Please select an event to view attendees.'}
                                    </td>
                                </tr>
                            ) : (
                                participants.map(p => (
                                    <tr key={p.ticket_id}>
                                        <td>
                                            {p.certificate_id ? (
                                                <Form.Check
                                                    type="checkbox"
                                                    checked={selectedCertIds.has(p.certificate_id)}
                                                    onChange={() => toggleSelectOne(p.certificate_id)}
                                                />
                                            ) : null}
                                        </td>
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
                                                    <a href={p.download_url} target="_blank" rel="noreferrer" className="btn btn-sm btn-light border" title="Download PDF">
                                                        <i className="bx bx-download"></i> PDF
                                                    </a>
                                                    <Button size="sm" variant="outline-secondary" onClick={() => handleGenerateSingle(p.user_id, true)} disabled={generating} title="Regenerate Certificate">
                                                        <i className="bx bx-refresh"></i> Re-generate
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="outline-success"
                                                        onClick={() => handleSendNotification(p, 'WHATSAPP')}
                                                        disabled={sendingKey !== null}
                                                    >
                                                        {sendingKey === `${p.certificate_id}_WHATSAPP` ? (
                                                            <Spinner size="sm" animation="border" />
                                                        ) : (
                                                            <><i className="bx bxl-whatsapp"></i> WA</>
                                                        )}
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="outline-primary"
                                                        onClick={() => handleSendNotification(p, 'EMAIL')}
                                                        disabled={sendingKey !== null}
                                                    >
                                                        {sendingKey === `${p.certificate_id}_EMAIL` ? (
                                                            <Spinner size="sm" animation="border" />
                                                        ) : (
                                                            <><i className="bx bx-envelope"></i> Email</>
                                                        )}
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
