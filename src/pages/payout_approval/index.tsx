/**
 * Superadmin Payout Approval Queue - Event Organizer & Facility Owner Withdrawal Requests
 * @author Antigravity & Veentix Admin
 */

import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Table, Badge, Button, Form, Modal, Dropdown } from 'react-bootstrap';
import { showToast } from '@/utils/toast';
import moment from 'moment';

interface WithdrawalRequest {
    id: string;
    type: 'eo' | 'facility';
    requester_name: string;
    pic_name: string;
    email: string;
    phone: string;
    entity_name: string; // Event title or Facility name
    request_date: string;
    gross_amount: number;
    fee_percentage: number;
    fee_amount: number;
    net_amount: number;
    bank_name: string;
    account_number: string;
    account_holder: string;
    status: 'Pending' | 'Processing' | 'Approved' | 'Rejected';
    processed_at?: string;
    transfer_proof_ref?: string;
    rejection_reason?: string;
}

const initialWithdrawalRequests: WithdrawalRequest[] = [
    {
        id: "WD-EO-0092",
        type: "eo",
        requester_name: "Soundfest Production Indo",
        pic_name: "Bambang Pamungkas",
        email: "finance@soundfest.id",
        phone: "+62 812-3456-7890",
        entity_name: "Summer Music Festival 2026",
        request_date: "18 Mei 2026 14:10",
        gross_amount: 15000000,
        fee_percentage: 3.0,
        fee_amount: 450000,
        net_amount: 14550000,
        bank_name: "BCA (Bank Central Asia)",
        account_number: "8830-1928-33",
        account_holder: "PT SOUNDFEST PRODUCTION",
        status: "Pending"
    },
    {
        id: "WD-FAC-0043",
        type: "facility",
        requester_name: "PT BSD Venue Management",
        pic_name: "Hendro Wijaya",
        email: "booking@icebsd.com",
        phone: "+62 811-9876-5432",
        entity_name: "Hall 1-3 ICE BSD City",
        request_date: "18 Mei 2026 11:30",
        gross_amount: 25000000,
        fee_percentage: 3.0,
        fee_amount: 750000,
        net_amount: 24250000,
        bank_name: "Bank Mandiri",
        account_number: "127-00-9876543-2",
        account_holder: "PT BSD VENUE MANAGEMENT",
        status: "Pending"
    },
    {
        id: "WD-EO-0091",
        type: "eo",
        requester_name: "Techverse Event Organizer",
        pic_name: "Sarah Amanda",
        email: "sarah@techverse.io",
        phone: "+62 856-1122-3344",
        entity_name: "Tech Summit Indonesia 2026",
        request_date: "17 Mei 2026 16:45",
        gross_amount: 8000000,
        fee_percentage: 3.0,
        fee_amount: 240000,
        net_amount: 7760000,
        bank_name: "Bank Central Asia (BCA)",
        account_number: "5210-9871-00",
        account_holder: "SARAH AMANDA TECHVERSE",
        status: "Processing"
    },
    {
        id: "WD-FAC-0042",
        type: "facility",
        requester_name: "Gelora Management",
        pic_name: "Dedi Kusuma",
        email: "dedi@gbk.id",
        phone: "+62 813-8899-0011",
        entity_name: "Stadion Madya GBK Senayan",
        request_date: "16 Mei 2026 09:20",
        gross_amount: 18000000,
        fee_percentage: 3.0,
        fee_amount: 540000,
        net_amount: 17460000,
        bank_name: "Bank BNI",
        account_number: "0345-6789-01",
        account_holder: "GELORA INDO MITRA",
        status: "Approved",
        processed_at: "16 Mei 2026 11:00",
        transfer_proof_ref: "TRF-BNI-20260516-99120"
    },
    {
        id: "WD-EO-0090",
        type: "eo",
        requester_name: "Karya Seni Nusantara",
        pic_name: "Rian Hidayat",
        email: "rian@karyaseni.com",
        phone: "+62 878-3344-5566",
        entity_name: "Art & Culture Expo",
        request_date: "15 Mei 2026 13:15",
        gross_amount: 5000000,
        fee_percentage: 3.0,
        fee_amount: 150000,
        net_amount: 4850000,
        bank_name: "Bank BRI",
        account_number: "0012-01-098765-50-1",
        account_holder: "KARYA SENI NUSANTARA",
        status: "Rejected",
        processed_at: "15 Mei 2026 14:00",
        rejection_reason: "Nama pada buku rekening tidak sesuai dengan identitas EO yang terverifikasi."
    }
];

const PayoutApprovalPage: React.FC = () => {
    const [requests, setRequests] = useState<WithdrawalRequest[]>(initialWithdrawalRequests);
    const [filterType, setFilterType] = useState<'all' | 'eo' | 'facility'>('all');
    const [filterStatus, setFilterStatus] = useState<'all' | 'Pending' | 'Processing' | 'Approved' | 'Rejected'>('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedRequest, setSelectedRequest] = useState<WithdrawalRequest | null>(initialWithdrawalRequests[0]);

    // Modal state for Approval / Transfer Action
    const [showApproveModal, setShowApproveModal] = useState<boolean>(false);
    const [transferRef, setTransferRef] = useState<string>('');
    
    // Modal state for Rejection Action
    const [showRejectModal, setShowRejectModal] = useState<boolean>(false);
    const [rejectionReason, setRejectionReason] = useState<string>('');

    // Active action target
    const [actionTarget, setActionTarget] = useState<WithdrawalRequest | null>(null);

    const formatCurrency = (val: number) => {
        return `Rp ${val.toLocaleString('id-ID')}`;
    };

    const handleOpenApproveModal = (req: WithdrawalRequest) => {
        setActionTarget(req);
        setTransferRef(`TRF-${req.bank_name.substring(0, 3).toUpperCase()}-${moment().format('YYYYMMDD')}-${Math.floor(1000 + Math.random() * 9000)}`);
        setShowApproveModal(true);
    };

    const handleConfirmApproval = (e: React.FormEvent) => {
        e.preventDefault();
        if (!actionTarget) return;

        setRequests(prev => prev.map(r => r.id === actionTarget.id ? {
            ...r,
            status: 'Approved',
            processed_at: moment().format('DD MMM YYYY HH:mm'),
            transfer_proof_ref: transferRef
        } : r));

        if (selectedRequest?.id === actionTarget.id) {
            setSelectedRequest({
                ...actionTarget,
                status: 'Approved',
                processed_at: moment().format('DD MMM YYYY HH:mm'),
                transfer_proof_ref: transferRef
            });
        }

        setShowApproveModal(false);
        showToast(`Pengajuan penarikan dana ${actionTarget.id} berhasil disetujui!`, 'success');
    };

    const handleOpenRejectModal = (req: WithdrawalRequest) => {
        setActionTarget(req);
        setRejectionReason('');
        setShowRejectModal(true);
    };

    const handleConfirmRejection = (e: React.FormEvent) => {
        e.preventDefault();
        if (!actionTarget || !rejectionReason.trim()) {
            showToast('Harap masukkan alasan penolakan!', 'error');
            return;
        }

        setRequests(prev => prev.map(r => r.id === actionTarget.id ? {
            ...r,
            status: 'Rejected',
            processed_at: moment().format('DD MMM YYYY HH:mm'),
            rejection_reason: rejectionReason
        } : r));

        if (selectedRequest?.id === actionTarget.id) {
            setSelectedRequest({
                ...actionTarget,
                status: 'Rejected',
                processed_at: moment().format('DD MMM YYYY HH:mm'),
                rejection_reason: rejectionReason
            });
        }

        setShowRejectModal(false);
        showToast(`Pengajuan penarikan ${actionTarget.id} ditolak.`, 'info');
    };

    const handleSetProcessing = (req: WithdrawalRequest) => {
        setRequests(prev => prev.map(r => r.id === req.id ? { ...r, status: 'Processing' } : r));
        if (selectedRequest?.id === req.id) {
            setSelectedRequest({ ...req, status: 'Processing' });
        }
        showToast(`Status penarikan ${req.id} diubah ke Sedang Diproses.`, 'info');
    };

    // Filter calculations
    const pendingList = requests.filter(r => r.status === 'Pending');
    const processingList = requests.filter(r => r.status === 'Processing');
    const approvedList = requests.filter(r => r.status === 'Approved');

    const totalPendingAmount = pendingList.reduce((acc, r) => acc + r.gross_amount, 0);
    const totalApprovedNet = approvedList.reduce((acc, r) => acc + r.net_amount, 0);
    const totalPlatformFeeCollected = approvedList.reduce((acc, r) => acc + r.fee_amount, 0);

    const filteredRequests = requests.filter(r => {
        const matchesType = filterType === 'all' || r.type === filterType;
        const matchesStatus = filterStatus === 'all' || r.status === filterStatus;
        if (!matchesType || !matchesStatus) return false;
        if (!searchTerm.trim()) return true;
        const term = searchTerm.toLowerCase();
        return (
            r.id.toLowerCase().includes(term) ||
            r.requester_name.toLowerCase().includes(term) ||
            r.entity_name.toLowerCase().includes(term) ||
            r.bank_name.toLowerCase().includes(term) ||
            r.account_number.toLowerCase().includes(term)
        );
    });

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'Approved':
                return <span className="badge bg-success-subtle text-success border border-success-subtle fw-semibold px-2.5 py-1">Disetujui / Selesai</span>;
            case 'Processing':
                return <span className="badge bg-info-subtle text-info border border-info-subtle fw-semibold px-2.5 py-1">Sedang Diproses</span>;
            case 'Pending':
                return <span className="badge bg-warning-subtle text-warning border border-warning-subtle fw-semibold px-2.5 py-1">Menunggu Persetujuan</span>;
            case 'Rejected':
                return <span className="badge bg-danger-subtle text-danger border border-danger-subtle fw-semibold px-2.5 py-1">Ditolak</span>;
            default:
                return <span className="badge bg-secondary-subtle text-secondary">{status}</span>;
        }
    };

    return (
        <div className="py-3 px-1">
            {/* HEADER */}
            <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 mb-4">
                <div>
                    <h4 className="fw-extrabold text-dark mb-1" style={{ fontSize: '1.45rem' }}>
                        <i className="bx bx-money-withdraw me-2 text-primary"></i>
                        Antrean Pengajuan Tarik Tunai (Superadmin)
                    </h4>
                    <p className="text-muted small mb-0">Verifikasi, setujui, dan proses pencairan dana (payout) hasil penjualan tiket EO dan penyewaan fasilitas.</p>
                </div>
            </div>

            {/* 4 METRICS CARDS */}
            <Row className="g-3 mb-4">
                <Col xl={3} lg={6} md={6}>
                    <Card className="border-0 shadow-sm rounded-4 p-2 bg-white h-100 border-start border-4 border-warning">
                        <Card.Body className="d-flex align-items-center justify-content-between p-2">
                            <div>
                                <span className="text-muted small fw-semibold uppercase" style={{ fontSize: '0.72rem' }}>Antrean Menunggu</span>
                                <h3 className="fw-extrabold text-warning mt-1 mb-0" style={{ fontSize: '1.5rem' }}>{pendingList.length} Pengajuan</h3>
                                <small className="text-muted" style={{ fontSize: '0.7rem' }}>Total {formatCurrency(totalPendingAmount)}</small>
                            </div>
                            <div className="metric-icon-box bg-warning-subtle text-warning rounded-4">
                                <i className="bx bx-time fs-3"></i>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>

                <Col xl={3} lg={6} md={6}>
                    <Card className="border-0 shadow-sm rounded-4 p-2 bg-white h-100 border-start border-4 border-info">
                        <Card.Body className="d-flex align-items-center justify-content-between p-2">
                            <div>
                                <span className="text-muted small fw-semibold uppercase" style={{ fontSize: '0.72rem' }}>Sedang Ditransfer</span>
                                <h3 className="fw-extrabold text-info mt-1 mb-0" style={{ fontSize: '1.5rem' }}>{processingList.length} Pengajuan</h3>
                                <small className="text-muted" style={{ fontSize: '0.7rem' }}>Dalam proses transfer bank</small>
                            </div>
                            <div className="metric-icon-box bg-info-subtle text-info rounded-4">
                                <i className="bx bx-loader-alt fs-3"></i>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>

                <Col xl={3} lg={6} md={6}>
                    <Card className="border-0 shadow-sm rounded-4 p-2 bg-white h-100 border-start border-4 border-success">
                        <Card.Body className="d-flex align-items-center justify-content-between p-2">
                            <div>
                                <span className="text-muted small fw-semibold uppercase" style={{ fontSize: '0.72rem' }}>Total Dana Ditransfer</span>
                                <h3 className="fw-extrabold text-success mt-1 mb-0" style={{ fontSize: '1.5rem' }}>{formatCurrency(totalApprovedNet)}</h3>
                                <small className="text-success" style={{ fontSize: '0.7rem' }}>{approvedList.length} pengajuan sukses</small>
                            </div>
                            <div className="metric-icon-box bg-success-subtle text-success rounded-4">
                                <i className="bx bx-check-double fs-3"></i>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>

                <Col xl={3} lg={6} md={6}>
                    <Card className="border-0 shadow-sm rounded-4 p-2 bg-white h-100 border-start border-4 border-primary">
                        <Card.Body className="d-flex align-items-center justify-content-between p-2">
                            <div>
                                <span className="text-muted small fw-semibold uppercase" style={{ fontSize: '0.72rem' }}>Fee Platform Terkumpul</span>
                                <h3 className="fw-extrabold text-primary mt-1 mb-0" style={{ fontSize: '1.5rem' }}>{formatCurrency(totalPlatformFeeCollected)}</h3>
                                <small className="text-muted" style={{ fontSize: '0.7rem' }}>Dipotong dari pencairan dana</small>
                            </div>
                            <div className="metric-icon-box bg-primary-subtle text-primary rounded-4">
                                <i className="bx bx-pie-chart-alt fs-3"></i>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Row className="g-4">
                {/* Main Table Area */}
                <Col xl={selectedRequest ? 8 : 12}>
                    <Card className="border-0 shadow-sm rounded-4 p-3 bg-white">
                        {/* Type Switcher & Search Bar */}
                        <div className="d-flex flex-wrap align-items-center justify-content-between pb-3 mb-3 border-bottom gap-2">
                            {/* Type Tabs */}
                            <div className="d-flex gap-2">
                                <button
                                    className={`btn btn-sm rounded-pill px-3 fw-semibold ${filterType === 'all' ? 'btn-primary' : 'btn-light border text-muted'}`}
                                    onClick={() => setFilterType('all')}
                                >
                                    Semua ({requests.length})
                                </button>
                                <button
                                    className={`btn btn-sm rounded-pill px-3 fw-semibold ${filterType === 'eo' ? 'btn-primary' : 'btn-light border text-muted'}`}
                                    onClick={() => setFilterType('eo')}
                                >
                                    <i className="bx bx-calendar-event me-1"></i> Event Organizer ({requests.filter(r => r.type === 'eo').length})
                                </button>
                                <button
                                    className={`btn btn-sm rounded-pill px-3 fw-semibold ${filterType === 'facility' ? 'btn-primary' : 'btn-light border text-muted'}`}
                                    onClick={() => setFilterType('facility')}
                                >
                                    <i className="bx bx-buildings me-1"></i> Fasilitas ({requests.filter(r => r.type === 'facility').length})
                                </button>
                            </div>

                            {/* Search */}
                            <div className="position-relative" style={{ width: '220px' }}>
                                <i className="bx bx-search position-absolute top-50 start-0 translate-middle-y ms-2.5 text-muted" style={{ fontSize: '0.9rem' }}></i>
                                <input
                                    type="text"
                                    className="form-control form-control-sm ps-4 bg-light border-0"
                                    placeholder="Cari ID, EO, nama bank..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    style={{ fontSize: '0.8rem', borderRadius: '6px' }}
                                />
                            </div>
                        </div>

                        {/* Status Filter Sub-tabs */}
                        <div className="d-flex align-items-center gap-2 mb-3 border-bottom overflow-x-auto pb-2" style={{ fontSize: '0.82rem' }}>
                            {[
                                { id: 'all', label: 'Semua Status' },
                                { id: 'Pending', label: 'Menunggu Persetujuan' },
                                { id: 'Processing', label: 'Sedang Diproses' },
                                { id: 'Approved', label: 'Disetujui' },
                                { id: 'Rejected', label: 'Ditolak' }
                            ].map(st => (
                                <button
                                    key={st.id}
                                    className={`btn btn-link text-decoration-none px-2.5 py-1.5 border-0 fw-semibold cursor-pointer text-nowrap ${filterStatus === st.id ? 'text-primary border-bottom border-2 border-primary' : 'text-secondary opacity-75 hover-opacity-100'}`}
                                    style={{
                                        borderRadius: 0,
                                        marginBottom: '-1px',
                                        fontSize: '0.82rem'
                                    }}
                                    onClick={() => setFilterStatus(st.id as any)}
                                >
                                    {st.label}
                                </button>
                            ))}
                        </div>

                        <div className="table-responsive">
                            <Table hover className="align-middle mb-0" style={{ fontSize: '0.82rem' }}>
                                <thead className="bg-light text-muted uppercase">
                                    <tr>
                                        <th>ID Pengajuan</th>
                                        <th>Pihak Pemohon</th>
                                        <th>Nominal Ditarik</th>
                                        <th>Fee Platform</th>
                                        <th>Bersih Ditransfer</th>
                                        <th>Rekening Tujuan</th>
                                        <th>Status</th>
                                        <th className="text-end">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredRequests.map((req) => (
                                        <tr
                                            key={req.id}
                                            className={`cursor-pointer ${selectedRequest?.id === req.id ? 'table-active' : ''}`}
                                            onClick={() => setSelectedRequest(req)}
                                        >
                                            <td className="fw-bold text-primary">{req.id}</td>
                                            <td>
                                                <div className="d-flex align-items-center gap-2">
                                                    <span className={`badge ${req.type === 'eo' ? 'bg-primary-subtle text-primary' : 'bg-warning-subtle text-warning'}`} style={{ fontSize: '0.65rem' }}>
                                                        {req.type === 'eo' ? 'EO' : 'FASILITAS'}
                                                    </span>
                                                    <div>
                                                        <div className="fw-bold text-dark">{req.requester_name}</div>
                                                        <div className="text-muted" style={{ fontSize: '0.7rem' }}>{req.entity_name}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="fw-bold text-dark">{formatCurrency(req.gross_amount)}</td>
                                            <td className="text-danger fw-semibold">
                                                -{formatCurrency(req.fee_amount)}
                                                <div className="text-muted" style={{ fontSize: '0.65rem' }}>({req.fee_percentage}%)</div>
                                            </td>
                                            <td className="fw-bold text-success fs-6">{formatCurrency(req.net_amount)}</td>
                                            <td>
                                                <div className="fw-semibold text-dark">{req.bank_name}</div>
                                                <div className="text-muted font-monospace" style={{ fontSize: '0.7rem' }}>{req.account_number}</div>
                                                <div className="text-muted" style={{ fontSize: '0.68rem' }}>a.n {req.account_holder}</div>
                                            </td>
                                            <td>{getStatusBadge(req.status)}</td>
                                            <td className="text-end" onClick={(e) => e.stopPropagation()}>
                                                <div className="d-flex align-items-center justify-content-end gap-1">
                                                    {req.status === 'Pending' && (
                                                        <>
                                                            <Button
                                                                variant="success"
                                                                size="sm"
                                                                className="py-1 px-2 fw-semibold d-inline-flex align-items-center gap-1"
                                                                style={{ fontSize: '0.72rem' }}
                                                                onClick={() => handleOpenApproveModal(req)}
                                                                title="Setujui & Transfer"
                                                            >
                                                                <i className="bx bx-check"></i> Setujui
                                                            </Button>
                                                            <Button
                                                                variant="outline-danger"
                                                                size="sm"
                                                                className="py-1 px-2 fw-semibold"
                                                                style={{ fontSize: '0.72rem' }}
                                                                onClick={() => handleOpenRejectModal(req)}
                                                                title="Tolak Pengajuan"
                                                            >
                                                                <i className="bx bx-x"></i>
                                                            </Button>
                                                        </>
                                                    )}

                                                    {req.status === 'Processing' && (
                                                        <Button
                                                            variant="success"
                                                            size="sm"
                                                            className="py-1 px-2 fw-semibold"
                                                            style={{ fontSize: '0.72rem' }}
                                                            onClick={() => handleOpenApproveModal(req)}
                                                        >
                                                            Konfirmasi Selesai
                                                        </Button>
                                                    )}

                                                    <Button
                                                        variant="light"
                                                        size="sm"
                                                        className="border p-1 text-primary"
                                                        onClick={() => setSelectedRequest(req)}
                                                        title="Lihat Rincian"
                                                    >
                                                        <i className="bx bx-show fs-5"></i>
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {filteredRequests.length === 0 && (
                                        <tr>
                                            <td colSpan={8} className="text-center py-5 text-muted">
                                                Tidak ada antrean pengajuan penarikan dana ditemukan.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </Table>
                        </div>
                    </Card>
                </Col>

                {/* Right Side: Detailed Drawer */}
                {selectedRequest && (
                    <Col xl={4}>
                        <Card className="border-0 shadow-sm rounded-4 p-3 bg-white position-sticky" style={{ top: '80px' }}>
                            <div className="d-flex align-items-center justify-content-between border-bottom pb-2 mb-3">
                                <h6 className="fw-bold text-dark mb-0" style={{ fontSize: '1rem' }}>Rincian Pengajuan Penarikan</h6>
                                <button className="btn btn-sm btn-icon text-muted p-0" onClick={() => setSelectedRequest(null)}>
                                    <i className="bx bx-x fs-4"></i>
                                </button>
                            </div>

                            {/* Header ID & Status */}
                            <div className="d-flex align-items-center justify-content-between bg-light p-3 rounded-3 mb-3 border">
                                <div>
                                    <div className="text-muted small" style={{ fontSize: '0.72rem' }}>ID Pengajuan</div>
                                    <div className="fw-extrabold text-primary" style={{ fontSize: '1.1rem' }}>{selectedRequest.id}</div>
                                    <div className="text-muted" style={{ fontSize: '0.68rem' }}>{selectedRequest.request_date}</div>
                                </div>
                                <div className="text-end">
                                    {getStatusBadge(selectedRequest.status)}
                                </div>
                            </div>

                            {/* Action Buttons Panel */}
                            {selectedRequest.status === 'Pending' && (
                                <div className="p-3 border rounded-3 mb-3 bg-warning-subtle text-dark">
                                    <div className="fw-bold mb-1" style={{ fontSize: '0.82rem' }}>Aksi Superadmin Diperlukan:</div>
                                    <p className="text-muted small mb-2" style={{ fontSize: '0.75rem' }}>
                                        Periksa nomor rekening tujuan dan saldo tersedia sebelum menyetujui transfer.
                                    </p>
                                    <div className="d-flex gap-2">
                                        <Button
                                            variant="success"
                                            size="sm"
                                            className="w-100 fw-bold py-1.5 shadow-sm"
                                            onClick={() => handleOpenApproveModal(selectedRequest)}
                                        >
                                            <i className="bx bx-check-circle me-1"></i> Setujui & Transfer
                                        </Button>
                                        <Button
                                            variant="danger"
                                            size="sm"
                                            className="w-50 fw-semibold py-1.5"
                                            onClick={() => handleOpenRejectModal(selectedRequest)}
                                        >
                                            <i className="bx bx-x-circle me-1"></i> Tolak
                                        </Button>
                                    </div>
                                </div>
                            )}

                            {selectedRequest.status === 'Processing' && (
                                <div className="p-3 border rounded-3 mb-3 bg-info-subtle text-dark">
                                    <div className="fw-bold mb-1" style={{ fontSize: '0.82rem' }}>Status: Sedang Ditransfer</div>
                                    <p className="text-muted small mb-2" style={{ fontSize: '0.75rem' }}>
                                        Selesaikan pengiriman dana ke rekening penerima dan masukkan nomor bukti transfer.
                                    </p>
                                    <Button
                                        variant="success"
                                        size="sm"
                                        className="w-100 fw-bold py-2 shadow-sm"
                                        onClick={() => handleOpenApproveModal(selectedRequest)}
                                    >
                                        <i className="bx bx-check-double me-1"></i> Selesaikan Transfer (Approve)
                                    </Button>
                                </div>
                            )}

                            {selectedRequest.status === 'Approved' && (
                                <div className="p-3 border rounded-3 mb-3 bg-success-subtle text-success">
                                    <div className="fw-bold mb-1" style={{ fontSize: '0.82rem' }}>
                                        <i className="bx bx-check-double me-1"></i> Telah Berhasil Ditransfer
                                    </div>
                                    <div className="small text-dark" style={{ fontSize: '0.75rem' }}>
                                        Waktu: <strong>{selectedRequest.processed_at}</strong><br />
                                        Ref: <span className="font-monospace text-primary">{selectedRequest.transfer_proof_ref}</span>
                                    </div>
                                </div>
                            )}

                            {selectedRequest.status === 'Rejected' && (
                                <div className="p-3 border rounded-3 mb-3 bg-danger-subtle text-danger">
                                    <div className="fw-bold mb-1" style={{ fontSize: '0.82rem' }}>
                                        <i className="bx bx-x-circle me-1"></i> Pengajuan Ditolak
                                    </div>
                                    <div className="small text-dark" style={{ fontSize: '0.75rem' }}>
                                        Alasan: <em>{selectedRequest.rejection_reason || 'Tidak memenuhi syarat.'}</em>
                                    </div>
                                </div>
                            )}

                            {/* Rekening Tujuan Transfer */}
                            <div className="mb-3">
                                <div className="text-muted small fw-semibold uppercase mb-1" style={{ fontSize: '0.7rem' }}>Rekening Bank Tujuan Transfer</div>
                                <div className="bg-light p-3 rounded-3 border">
                                    <div className="d-flex justify-content-between mb-1">
                                        <span className="text-muted small">Bank:</span>
                                        <span className="fw-bold text-dark">{selectedRequest.bank_name}</span>
                                    </div>
                                    <div className="d-flex justify-content-between mb-1">
                                        <span className="text-muted small">Nomor Rekening:</span>
                                        <span className="fw-extrabold text-primary font-monospace fs-6">{selectedRequest.account_number}</span>
                                    </div>
                                    <div className="d-flex justify-content-between">
                                        <span className="text-muted small">Atas Nama:</span>
                                        <span className="fw-bold text-dark">{selectedRequest.account_holder}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Rincian Nominal & Potongan Fee */}
                            <div className="mb-3 border-top pt-2">
                                <div className="text-muted small fw-semibold uppercase mb-1" style={{ fontSize: '0.7rem' }}>Kalkulasi Potongan & Dana Bersih</div>
                                <div className="d-flex justify-content-between align-items-center mb-1" style={{ fontSize: '0.8rem' }}>
                                    <span className="text-muted">Nominal Saldo Ditarik:</span>
                                    <span className="fw-bold text-dark">{formatCurrency(selectedRequest.gross_amount)}</span>
                                </div>
                                <div className="d-flex justify-content-between align-items-center mb-1" style={{ fontSize: '0.8rem' }}>
                                    <span className="text-danger">Biaya Jasa Aplikasi ({selectedRequest.fee_percentage}%):</span>
                                    <span className="fw-bold text-danger">-{formatCurrency(selectedRequest.fee_amount)}</span>
                                </div>
                                <div className="d-flex justify-content-between align-items-center pt-2 border-top fw-bold text-dark" style={{ fontSize: '0.95rem' }}>
                                    <span>Total Ditransfer ke Rekening:</span>
                                    <span className="text-success fs-6">{formatCurrency(selectedRequest.net_amount)}</span>
                                </div>
                            </div>

                            {/* Info Pemohon */}
                            <div className="mb-3 border-top pt-2">
                                <div className="text-muted small fw-semibold uppercase mb-1" style={{ fontSize: '0.7rem' }}>Profil Pihak Pemohon</div>
                                <div className="bg-light p-2.5 rounded-3 border" style={{ fontSize: '0.78rem' }}>
                                    <div className="fw-bold text-dark mb-0.5">{selectedRequest.requester_name}</div>
                                    <div className="text-muted">Tipe: <span className="badge bg-secondary-subtle text-secondary">{selectedRequest.type === 'eo' ? 'Event Organizer' : 'Pemilik Fasilitas'}</span></div>
                                    <div className="text-muted">PIC: {selectedRequest.pic_name} ({selectedRequest.phone})</div>
                                    <div className="text-muted">Email: {selectedRequest.email}</div>
                                    <div className="text-muted">Unit Terkait: {selectedRequest.entity_name}</div>
                                </div>
                            </div>
                        </Card>
                    </Col>
                )}
            </Row>

            {/* MODAL APPROVAL / TRANSFER ACTION */}
            <Modal show={showApproveModal} onHide={() => setShowApproveModal(false)} centered>
                <Modal.Header closeButton className="border-bottom">
                    <Modal.Title className="fs-6 fw-bold">
                        <i className="bx bx-check-shield text-success me-2"></i>
                        Konfirmasi Persetujuan Pencairan Dana
                    </Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleConfirmApproval}>
                    <Modal.Body className="py-3">
                        {actionTarget && (
                            <>
                                <div className="p-3 bg-light rounded-3 border mb-3">
                                    <div className="d-flex justify-content-between mb-1" style={{ fontSize: '0.8rem' }}>
                                        <span className="text-muted">ID Pengajuan:</span>
                                        <span className="fw-bold text-primary">{actionTarget.id}</span>
                                    </div>
                                    <div className="d-flex justify-content-between mb-1" style={{ fontSize: '0.8rem' }}>
                                        <span className="text-muted">Penerima:</span>
                                        <span className="fw-bold text-dark">{actionTarget.requester_name}</span>
                                    </div>
                                    <div className="d-flex justify-content-between mb-1" style={{ fontSize: '0.8rem' }}>
                                        <span className="text-muted">Rekening Tujuan:</span>
                                        <span className="fw-bold text-dark">{actionTarget.bank_name} - {actionTarget.account_number}</span>
                                    </div>
                                    <div className="d-flex justify-content-between pt-2 border-top fw-bold text-dark">
                                        <span>Nominal Bersih yang Ditransfer:</span>
                                        <span className="text-success fs-5">{formatCurrency(actionTarget.net_amount)}</span>
                                    </div>
                                </div>

                                <Form.Group className="mb-3">
                                    <Form.Label className="small fw-bold text-dark">Nomor Referensi / ID Bukti Transfer *</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={transferRef}
                                        onChange={(e) => setTransferRef(e.target.value)}
                                        placeholder="Contoh: TRF-BCA-20260518-9921"
                                        required
                                    />
                                    <Form.Text className="text-muted small">ID referensi transaksi perbankan untuk arsip bukti transfer.</Form.Text>
                                </Form.Group>
                            </>
                        )}
                    </Modal.Body>
                    <Modal.Footer className="border-top">
                        <Button variant="light" onClick={() => setShowApproveModal(false)}>
                            Batal
                        </Button>
                        <Button variant="success" type="submit" className="px-4 fw-semibold">
                            <i className="bx bx-check me-1"></i> Konfirmasi & Selesaikan Payout
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>

            {/* MODAL REJECTION ACTION */}
            <Modal show={showRejectModal} onHide={() => setShowRejectModal(false)} centered>
                <Modal.Header closeButton className="border-bottom">
                    <Modal.Title className="fs-6 fw-bold text-danger">
                        <i className="bx bx-x-circle text-danger me-2"></i>
                        Tolak Pengajuan Pencairan Dana
                    </Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleConfirmRejection}>
                    <Modal.Body className="py-3">
                        {actionTarget && (
                            <>
                                <p className="text-muted small mb-3">
                                    Anda akan menolak pengajuan penarikan dana <strong className="text-dark">{actionTarget.id}</strong> sebesar <strong>{formatCurrency(actionTarget.gross_amount)}</strong> dari <strong className="text-dark">{actionTarget.requester_name}</strong>. Saldo akan dikembalikan ke akun pemohon.
                                </p>

                                <Form.Group className="mb-3">
                                    <Form.Label className="small fw-bold text-dark">Alasan Penolakan *</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={3}
                                        value={rejectionReason}
                                        onChange={(e) => setRejectionReason(e.target.value)}
                                        placeholder="Tuliskan alasan penolakan (misal: Nomor rekening tidak cocok, identitas belum valid, dll)..."
                                        required
                                    />
                                </Form.Group>
                            </>
                        )}
                    </Modal.Body>
                    <Modal.Footer className="border-top">
                        <Button variant="light" onClick={() => setShowRejectModal(false)}>
                            Batal
                        </Button>
                        <Button variant="danger" type="submit" className="px-4 fw-semibold">
                            <i className="bx bx-x me-1"></i> Tolak Pengajuan
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </div>
    );
};

export default PayoutApprovalPage;
