import React, { useEffect, useState, useRef } from 'react';
import { Card, Row, Col, Table, Form, Button, Modal, Alert } from 'react-bootstrap';
import QRCode from 'qrcode';
import { Html5Qrcode } from 'html5-qrcode';
import { Event } from '@/models/Event';
import { TicketUser, InTicketUser } from '@/models/TicketUser';
import { Checkin, InCheckinDashboardData, InCheckinScanResponse } from '@/models/Checkin';
import { showToast } from '@/utils/toast';

const TicketEventPage: React.FC = () => {
    const [events, setEvents] = useState<any[]>([]);
    const [selectedEventId, setSelectedEventId] = useState<number | ''>('');
    const [activeTab, setActiveTab] = useState<'all' | 'checkedin' | 'notcheckedin'>('all');
    const [searchTerm, setSearchTerm] = useState('');

    const [dashData, setDashData] = useState<InCheckinDashboardData | null>(null);
    const [attendees, setAttendees] = useState<InTicketUser[]>([]);
    const [loading, setLoading] = useState(false);

    // QR Modal state
    const [selectedTicket, setSelectedTicket] = useState<InTicketUser | null>(null);
    const [qrUrl, setQrUrl] = useState<string>('');
    const [showQrModal, setShowQrModal] = useState(false);

    // Scanner state
    const [scanMode, setScanMode] = useState<'camera' | 'manual'>('camera');
    const [isScanning, setIsScanning] = useState(false);
    const [isLaunching, setIsLaunching] = useState(false);
    const [gateName, setGateName] = useState('Gate A');
    const [manualToken, setManualToken] = useState('');
    const [lastScan, setLastScan] = useState<InCheckinScanResponse | null>(null);
    const [isProcessingScan, setIsProcessingScan] = useState(false);
    const html5QrCodeRef = useRef<Html5Qrcode | null>(null);

    useEffect(() => {
        const EventModel = new Event();
        EventModel.list()
            .then((res: any) => {
                const list = res.events || res.data || [];
                setEvents(list);
                if (list.length > 0) {
                    setSelectedEventId(list[0].id);
                }
            })
            .catch((err) => console.error('Failed to fetch events:', err));
    }, []);

    useEffect(() => {
        fetchDashboardAndAttendees();
    }, [selectedEventId]);

    const stopScanning = async () => {
        if (html5QrCodeRef.current) {
            try {
                if (html5QrCodeRef.current.isScanning) {
                    await html5QrCodeRef.current.stop();
                }
                html5QrCodeRef.current.clear();
            } catch (err) {
                console.error('Stop scanner error:', err);
            }
            html5QrCodeRef.current = null;
        }
        setIsScanning(false);
        setIsLaunching(false);
    };

    const startScanning = async () => {
        setIsLaunching(true);
        try {
            if (html5QrCodeRef.current) {
                await stopScanning();
            }

            const html5QrCode = new Html5Qrcode('reader-inline');
            html5QrCodeRef.current = html5QrCode;

            const handleSuccess = async (decodedText: string) => {
                if (isProcessingScan) return;
                setIsProcessingScan(true);

                try {
                    const response = await Checkin.scan({
                        qr_token: decodedText,
                        event_id: selectedEventId ? Number(selectedEventId) : undefined,
                        device_id: gateName,
                    });

                    setLastScan(response);
                    if (response.status === 'SUCCESS') {
                        showToast(`Check-in Berhasil: ${response.guest_name}`, 'success');
                        fetchDashboardAndAttendees();
                    } else if (response.status === 'ALREADY_CHECKED') {
                        showToast('Tiket Sudah Digunakan!', 'error');
                    } else {
                        showToast(response.message || 'Tiket Tidak Valid', 'error');
                    }
                } catch (err: any) {
                    showToast(err?.message || 'Gagal scan tiket', 'error');
                } finally {
                    setTimeout(() => setIsProcessingScan(false), 1500);
                }
            };

            setIsScanning(true);

            await html5QrCode.start(
                { facingMode: 'environment' },
                { fps: 10, qrbox: { width: 220, height: 220 }, aspectRatio: 1.0 },
                handleSuccess,
                () => {}
            );
        } catch (err: any) {
            console.error('Camera start error:', err);
            showToast(err?.message || 'Gagal membuka kamera scanner', 'error');
            await stopScanning();
        } finally {
            setIsLaunching(false);
        }
    };

    useEffect(() => {
        return () => {
            if (html5QrCodeRef.current) {
                if (html5QrCodeRef.current.isScanning) {
                    html5QrCodeRef.current.stop().catch(() => {});
                }
                html5QrCodeRef.current.clear();
                html5QrCodeRef.current = null;
            }
        };
    }, []);

    const fetchDashboardAndAttendees = async () => {
        setLoading(true);
        try {
            const evId = selectedEventId ? Number(selectedEventId) : undefined;
            const [dashRes, ticketRes] = await Promise.all([
                Checkin.dashboard(evId),
                new TicketUser().list({ limit: 100 }),
            ]);

            setDashData(dashRes);
            const userTickets = ticketRes.user_tickets || (ticketRes as any).data || [];
            setAttendees(userTickets);
        } catch (err: any) {
            console.error('Failed to load check-in data:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleShowQr = async (ticket: InTicketUser) => {
        try {
            let qrToken = ticket.qr_token;
            if (!qrToken) {
                const qrRes = await Checkin.generateQr(ticket.id);
                qrToken = qrRes.qr_token;
            }

            const dataUrl = await QRCode.toDataURL(qrToken || ticket.ticket_code, { width: 250 });
            setQrUrl(dataUrl);
            setSelectedTicket({ ...ticket, qr_token: qrToken });
            setShowQrModal(true);
        } catch (err: any) {
            showToast('Gagal memuat QR Code tiket', 'error');
        }
    };

    const handleManualScan = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!manualToken.trim()) return;

        setIsProcessingScan(true);
        try {
            const response = await Checkin.scan({
                qr_token: manualToken.trim(),
                event_id: selectedEventId ? Number(selectedEventId) : undefined,
                device_id: gateName,
            });

            setLastScan(response);
            if (response.status === 'SUCCESS') {
                showToast(`Check-in Berhasil: ${response.guest_name}`, 'success');
                setManualToken('');
                fetchDashboardAndAttendees();
            } else if (response.status === 'ALREADY_CHECKED') {
                showToast('Tiket Sudah Digunakan!', 'error');
            } else {
                showToast(response.message || 'Tiket Tidak Valid', 'error');
            }
        } catch (err: any) {
            showToast(err?.message || 'Gagal submit tiket', 'error');
        } finally {
            setIsProcessingScan(false);
        }
    };

    const filteredAttendees = attendees.filter((item) => {
        if (activeTab === 'checkedin' && item.status !== 'USED') return false;
        if (activeTab === 'notcheckedin' && item.status === 'USED') return false;

        if (searchTerm.trim()) {
            const term = searchTerm.toLowerCase();
            const name = (item.user?.name || item.guest_name || '').toLowerCase();
            const code = (item.ticket_code || '').toLowerCase();
            return name.includes(term) || code.includes(term);
        }
        return true;
    });

    return (
        <div className="py-3 px-1">
            {/* HEADER */}
            <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 mb-3">
                <div>
                    <h4 className="fw-extrabold text-dark mb-1" style={{ fontSize: '1.45rem' }}>
                        Check-in & Event Dashboard
                    </h4>
                    <p className="text-muted small mb-0">Kelola proses check-in secara real-time dan pantau kehadiran event.</p>
                </div>
            </div>

            {/* 4 METRIC CARDS */}
            <Row className="g-3 mb-4">
                <Col xl={3} md={6}>
                    <Card className="border-0 shadow-sm rounded-4 p-2 bg-white">
                        <Card.Body className="p-2">
                            <span className="text-muted small fw-semibold uppercase" style={{ fontSize: '0.72rem' }}>
                                Total Tickets Sold
                            </span>
                            <h4 className="fw-extrabold text-dark mt-1 mb-0" style={{ fontSize: '1.4rem' }}>
                                {dashData?.total_tickets ?? 0}
                            </h4>
                        </Card.Body>
                    </Card>
                </Col>

                <Col xl={3} md={6}>
                    <Card className="border-0 shadow-sm rounded-4 p-2 bg-white">
                        <Card.Body className="p-2">
                            <span className="text-muted small fw-semibold uppercase" style={{ fontSize: '0.72rem' }}>
                                Checked-in
                            </span>
                            <h4 className="fw-extrabold text-dark mt-1 mb-0" style={{ fontSize: '1.4rem' }}>
                                {dashData?.checked_in ?? 0}
                            </h4>
                            <span className="badge bg-success-subtle text-success p-1" style={{ fontSize: '0.68rem' }}>
                                {dashData?.attendance_rate ?? 0}% Attendance Rate
                            </span>
                        </Card.Body>
                    </Card>
                </Col>

                <Col xl={3} md={6}>
                    <Card className="border-0 shadow-sm rounded-4 p-2 bg-white">
                        <Card.Body className="p-2">
                            <span className="text-muted small fw-semibold uppercase" style={{ fontSize: '0.72rem' }}>
                                Not Checked-in
                            </span>
                            <h4 className="fw-extrabold text-dark mt-1 mb-0" style={{ fontSize: '1.4rem' }}>
                                {dashData?.remaining ?? 0}
                            </h4>
                        </Card.Body>
                    </Card>
                </Col>

                <Col xl={3} md={6}>
                    <Card className="border-0 shadow-sm rounded-4 p-2 bg-white">
                        <Card.Body className="p-2">
                            <span className="text-muted small fw-semibold uppercase" style={{ fontSize: '0.72rem' }}>
                                Attendance Rate
                            </span>
                            <h4 className="fw-extrabold text-primary mt-1 mb-0" style={{ fontSize: '1.4rem' }}>
                                {dashData?.attendance_rate ?? 0}%
                            </h4>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* EVENT SELECTOR BAR */}
            <Card className="border-0 shadow-sm rounded-4 p-3 bg-white mb-4">
                <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
                    <div className="d-flex align-items-center gap-3">
                        <i className="bx bx-calendar-event fs-2 text-primary"></i>
                        <div>
                            <Form.Select
                                className="fw-bold border-0 bg-light py-1 px-3 shadow-none"
                                value={selectedEventId}
                                onChange={(e) => setSelectedEventId(Number(e.target.value))}
                                style={{ fontSize: '0.95rem' }}
                            >
                                <option value="">Semua Event</option>
                                {events.map((ev) => (
                                    <option key={ev.id} value={ev.id}>
                                        {ev.title || ev.name}
                                    </option>
                                ))}
                            </Form.Select>
                        </div>
                    </div>
                    <div className="d-flex align-items-center gap-2">
                        <Button variant="light" size="sm" className="border text-muted rounded-pill px-3" onClick={fetchDashboardAndAttendees}>
                            <i className="bx bx-refresh me-1"></i> Refresh Data
                        </Button>
                    </div>
                </div>
            </Card>

            <Row className="g-4">
                {/* Left Side: Attendee List */}
                <Col xl={7} lg={6}>
                    <Card className="border-0 shadow-sm rounded-4 p-3 bg-white">
                        <div className="d-flex align-items-center justify-content-between pb-3 mb-3 border-bottom">
                            <h6 className="fw-bold text-dark mb-0" style={{ fontSize: '1.05rem' }}>Attendee List</h6>
                            <div className="d-flex align-items-center gap-2">
                                <div className="position-relative" style={{ width: '200px' }}>
                                    <i className="bx bx-search position-absolute top-50 start-0 translate-middle-y ms-2.5 text-muted" style={{ fontSize: '0.9rem' }}></i>
                                    <input
                                        type="text"
                                        className="form-control form-control-sm ps-4 bg-light border-0"
                                        placeholder="Search name, code..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        style={{ fontSize: '0.8rem', borderRadius: '6px' }}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Clean Underline Tabs */}
                        <div className="d-flex align-items-center gap-4 mb-3 border-bottom overflow-x-auto" style={{ fontSize: '0.875rem' }}>
                            {[
                                { id: 'all', label: `All (${attendees.length})` },
                                { id: 'checkedin', label: 'Checked-in' },
                                { id: 'notcheckedin', label: 'Not Checked-in' }
                            ].map(tab => (
                                <button
                                    key={tab.id}
                                    className={`btn btn-link text-decoration-none px-0 py-2 border-0 fw-semibold cursor-pointer text-nowrap ${activeTab === tab.id ? 'text-primary border-bottom border-2 border-primary' : 'text-secondary opacity-75 hover-opacity-100'}`}
                                    style={{
                                        borderRadius: 0,
                                        marginBottom: '-1px',
                                        fontSize: '0.85rem'
                                    }}
                                    onClick={() => setActiveTab(tab.id as any)}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        <div className="table-responsive">
                            <Table hover className="align-middle mb-0" style={{ fontSize: '0.84rem' }}>
                                <thead className="bg-light text-muted uppercase">
                                    <tr>
                                        <th>Attendee</th>
                                        <th>Ticket Code</th>
                                        <th>Type</th>
                                        <th>Status</th>
                                        <th className="text-end">QR</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredAttendees.map((item) => {
                                        const name = item.user?.name || item.guest_name || 'Guest';
                                        const email = item.user?.email || item.guest_email || '-';

                                        return (
                                            <tr key={item.id}>
                                                <td>
                                                    <div className="fw-bold text-dark">{name}</div>
                                                    <div className="text-muted" style={{ fontSize: '0.7rem' }}>
                                                        {email}
                                                    </div>
                                                </td>
                                                <td className="fw-semibold text-primary">{item.ticket_code}</td>
                                                <td><span className="badge bg-light text-dark border">{item.ticket?.name || 'Standard'}</span></td>
                                                <td>
                                                    <span className={`badge ${item.status === 'USED' ? 'bg-success' : 'bg-warning text-dark'}`}>
                                                        {item.status === 'USED' ? 'Checked-in' : 'Valid'}
                                                    </span>
                                                </td>
                                                <td className="text-end">
                                                    <Button
                                                        variant="light"
                                                        size="sm"
                                                        className="border p-1 px-2 text-primary"
                                                        onClick={() => handleShowQr(item)}
                                                    >
                                                        <i className="bx bx-qr"></i> View QR
                                                    </Button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                    {filteredAttendees.length === 0 && (
                                        <tr>
                                            <td colSpan={5} className="text-center py-3 text-muted">
                                                Tidak ada data tiket check-in.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </Table>
                        </div>
                    </Card>
                </Col>

                {/* Right Side: Quick Check-in Camera Scanner & History Panel */}
                <Col xl={5} lg={6}>
                    <Card className="border-0 shadow-sm rounded-4 p-3 bg-white mb-3">
                        <div className="d-flex align-items-center justify-content-between border-bottom pb-2 mb-3">
                            <h6 className="fw-bold text-dark mb-0" style={{ fontSize: '1rem' }}>Quick Check-in Scanner</h6>
                            <Form.Control
                                size="sm"
                                type="text"
                                style={{ width: '100px' }}
                                value={gateName}
                                onChange={(e) => setGateName(e.target.value)}
                                placeholder="Gate A"
                            />
                        </div>

                        <div className="d-flex gap-2 mb-3">
                            <button
                                className={`btn btn-sm flex-grow-1 rounded-pill ${scanMode === 'camera' ? 'btn-primary' : 'btn-light border text-muted'}`}
                                onClick={() => {
                                    setScanMode('camera');
                                }}
                            >
                                <i className="bx bx-qr-scan me-1"></i> Camera Scanner
                            </button>
                            <button
                                className={`btn btn-sm flex-grow-1 rounded-pill ${scanMode === 'manual' ? 'btn-primary' : 'btn-light border text-muted'}`}
                                onClick={() => {
                                    setScanMode('manual');
                                    stopScanning();
                                }}
                            >
                                <i className="bx bx-barcode me-1"></i> Manual Input
                            </button>
                        </div>

                        {scanMode === 'camera' ? (
                            <div className="mb-3">
                                <div
                                    id="reader-inline"
                                    style={{
                                        width: '100%',
                                        borderRadius: '12px',
                                        overflow: 'hidden',
                                        display: isScanning ? 'block' : 'none',
                                    }}
                                ></div>

                                {!isScanning && (
                                    <div className="p-4 text-center bg-light rounded-3 border">
                                        <i className="bx bx-camera display-4 text-muted mb-2"></i>
                                        <p className="text-muted small mb-0">Klik tombol di bawah untuk membuka kamera scanner.</p>
                                    </div>
                                )}

                                {isScanning ? (
                                    <Button
                                        variant="danger"
                                        className="w-100 rounded-pill py-2 mt-3"
                                        onClick={stopScanning}
                                    >
                                        <i className="bx bx-stop-circle me-1"></i> Stop Scanning
                                    </Button>
                                ) : (
                                    <Button
                                        variant="primary"
                                        className="w-100 rounded-pill py-2 mt-3"
                                        disabled={isLaunching}
                                        onClick={startScanning}
                                    >
                                        <i className="bx bx-camera me-1"></i> {isLaunching ? 'Launching Camera...' : 'Start Scanning'}
                                    </Button>
                                )}
                            </div>
                        ) : (
                            <Form onSubmit={handleManualScan} className="mb-3">
                                <Form.Group className="mb-2">
                                    <Form.Label className="small text-muted fw-bold">Kode Tiket / QR Token</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Input kode tiket / QR token..."
                                        value={manualToken}
                                        onChange={(e) => setManualToken(e.target.value)}
                                        disabled={isProcessingScan}
                                    />
                                </Form.Group>
                                <Button variant="primary" type="submit" className="w-100 rounded-pill" disabled={isProcessingScan}>
                                    Submit Check-in
                                </Button>
                            </Form>
                        )}

                        {/* LAST SCAN ALERT */}
                        {lastScan && (
                            <Alert
                                variant={
                                    lastScan.status === 'SUCCESS'
                                        ? 'success'
                                        : lastScan.status === 'ALREADY_CHECKED'
                                        ? 'warning'
                                        : 'danger'
                                }
                                className="rounded-3 mb-3 p-2 px-3 small"
                            >
                                <div className="d-flex align-items-center justify-content-between">
                                    <div>
                                        <strong className="d-block">Result: {lastScan.status}</strong>
                                        {lastScan.guest_name && <div>Guest: {lastScan.guest_name}</div>}
                                        {lastScan.message && <div className="text-danger">{lastScan.message}</div>}
                                    </div>
                                    <span className="fs-4">
                                        {lastScan.status === 'SUCCESS' ? '✅' : lastScan.status === 'ALREADY_CHECKED' ? '⚠️' : '❌'}
                                    </span>
                                </div>
                            </Alert>
                        )}

                        <div className="border-top pt-3">
                            <div className="d-flex align-items-center justify-content-between mb-2">
                                <span className="fw-bold text-dark small">Recent Scan Activity</span>
                            </div>
                            <div className="d-flex flex-column gap-2" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                                {dashData?.recent_history?.map((rc) => (
                                    <div key={rc.id} className="d-flex align-items-center justify-content-between p-2 rounded-3 bg-light" style={{ fontSize: '0.78rem' }}>
                                        <div className="d-flex align-items-center gap-2">
                                            <div className={`avatar avatar-xs rounded-circle text-white d-flex align-items-center justify-content-center fw-bold ${rc.status === 'SUCCESS' ? 'bg-success' : 'bg-danger'}`}>
                                                {rc.status === 'SUCCESS' ? '✓' : '✕'}
                                            </div>
                                            <div>
                                                <div className="fw-bold text-dark">{rc.guest_name || rc.user_name || 'Guest'}</div>
                                                <div className="text-muted" style={{ fontSize: '0.68rem' }}>
                                                    {rc.ticket_code || rc.scan_token} • {rc.device_id || 'Gate'}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-end" style={{ fontSize: '0.72rem' }}>
                                            <span className={`badge ${rc.status === 'SUCCESS' ? 'bg-success-subtle text-success' : 'bg-danger-subtle text-danger'}`}>
                                                {rc.status}
                                            </span>
                                            <div className="text-muted" style={{ fontSize: '0.65rem' }}>{rc.created_at}</div>
                                        </div>
                                    </div>
                                ))}
                                {(!dashData?.recent_history || dashData.recent_history.length === 0) && (
                                    <div className="text-center py-3 text-muted small">Belum ada aktivitas scan.</div>
                                )}
                            </div>
                        </div>
                    </Card>
                </Col>
            </Row>

            {/* QR DISPLAY MODAL */}
            <Modal show={showQrModal} onHide={() => setShowQrModal(false)} centered size="sm">
                <Modal.Header closeButton>
                    <Modal.Title className="fs-6 fw-bold">Ticket QR Code</Modal.Title>
                </Modal.Header>
                <Modal.Body className="text-center py-4">
                    {qrUrl && <img src={qrUrl} alt="QR Code" className="img-fluid mb-3 rounded border p-2" style={{ maxWidth: '200px' }} />}
                    <h6 className="fw-bold text-dark mb-1">{selectedTicket?.user?.name || selectedTicket?.guest_name || 'Guest Ticket'}</h6>
                    <p className="text-primary fw-semibold mb-1" style={{ fontSize: '0.85rem' }}>{selectedTicket?.ticket_code}</p>
                    <small className="text-muted d-block" style={{ fontSize: '0.7rem', wordBreak: 'break-all' }}>
                        Token: {selectedTicket?.qr_token}
                    </small>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default TicketEventPage;
