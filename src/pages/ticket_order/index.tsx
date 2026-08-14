/**
 * EO Orders Management Page - Status Workflow (Unpaid -> Pending -> Paid) & Manual Controls
 */

import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Table, Form, Button, Badge, Modal, Dropdown } from 'react-bootstrap';
import { showToast } from '@/utils/toast';
import { TicketOrder, InTicketOrder } from '@/models/TicketOrder';

interface OrderItem {
    id: string;
    backend_id?: number;
    customer: string;
    email: string;
    phone: string;
    event: string;
    event_image: string;
    event_venue: string;
    date: string;
    tickets: string;
    amount: number;
    formatted_amount: string;
    admin_fee: string;
    total_paid: string;
    method: string;
    status: 'Unpaid' | 'Pending' | 'Paid' | 'Failed' | 'Refunded';
    order_date: string;
    payment_time?: string;
    transaction_id: string;
}

const initialMockOrders: OrderItem[] = [
    {
        id: "#VTX-001249",
        customer: "Budi Santoso",
        email: "budi.santoso@email.com",
        phone: "+62 813-9876-5432",
        event: "Summer Music Festival 2026",
        event_image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=150&auto=format&fit=crop&q=80",
        event_venue: "ICE BSD City, Tangerang",
        date: "20 Des 2026",
        tickets: "2 x VIP Pass",
        amount: 700000,
        formatted_amount: "Rp 700.000",
        admin_fee: "Rp 10.000",
        total_paid: "Rp 710.000",
        method: "Transfer Bank (BCA)",
        status: "Unpaid",
        order_date: "18 Mei 2026 14:45",
        transaction_id: "SNAP-20260518-144510"
    },
    {
        id: "#VTX-001248",
        customer: "Dinda Kharisma",
        email: "dinda.k@email.com",
        phone: "+62 812-3456-7890",
        event: "Summer Music Festival 2026",
        event_image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=150&auto=format&fit=crop&q=80",
        event_venue: "ICE BSD City, Tangerang",
        date: "20 Des 2026",
        tickets: "2 x VIP Pass",
        amount: 700000,
        formatted_amount: "Rp 700.000",
        admin_fee: "Rp 10.000",
        total_paid: "Rp 710.000",
        method: "Midtrans",
        status: "Paid",
        order_date: "18 Mei 2026 14:32",
        payment_time: "18 Mei 2026 14:33",
        transaction_id: "SNAP-20260518-143312"
    },
    {
        id: "#VTX-001247",
        customer: "Rizky Pratama",
        email: "rizky.p@email.com",
        phone: "+62 811-2233-4455",
        event: "Summer Music Festival 2026",
        event_image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=150&auto=format&fit=crop&q=80",
        event_venue: "ICE BSD City, Tangerang",
        date: "20 Des 2026",
        tickets: "1 x Regular Pass",
        amount: 175000,
        formatted_amount: "Rp 175.000",
        admin_fee: "Rp 5.000",
        total_paid: "Rp 180.000",
        method: "QRIS",
        status: "Paid",
        order_date: "18 Mei 2026 14:21",
        payment_time: "18 Mei 2026 14:22",
        transaction_id: "QRIS-20260518-142100"
    },
    {
        id: "#VTX-001246",
        customer: "Sarah Wijaya",
        email: "sarah.w@email.com",
        phone: "+62 856-7890-1234",
        event: "Tech Summit Indonesia 2026",
        event_image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=150&auto=format&fit=crop&q=80",
        event_venue: "ICE BSD City, Tangerang",
        date: "07 Jun 2026",
        tickets: "3 x Early Bird",
        amount: 375000,
        formatted_amount: "Rp 375.000",
        admin_fee: "Rp 10.000",
        total_paid: "Rp 385.000",
        method: "VA BCA",
        status: "Pending",
        order_date: "18 Mei 2026 14:15",
        transaction_id: "VA-BCA-20260518-1415"
    },
    {
        id: "#VTX-001245",
        customer: "Andi Setiawan",
        email: "andi.s@email.com",
        phone: "+62 819-0123-4567",
        event: "Art & Culture Expo",
        event_image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=150&auto=format&fit=crop&q=80",
        event_venue: "Taman Ismail Marzuki, Jakarta",
        date: "21 Jun 2026",
        tickets: "2 x Regular Pass",
        amount: 350000,
        formatted_amount: "Rp 350.000",
        admin_fee: "Rp 10.000",
        total_paid: "Rp 360.000",
        method: "Credit Card",
        status: "Paid",
        order_date: "18 Mei 2026 13:48",
        payment_time: "18 Mei 2026 13:50",
        transaction_id: "CC-20260518-1348"
    },
    {
        id: "#VTX-001244",
        customer: "Maya Febriani",
        email: "maya.f@email.com",
        phone: "+62 878-1122-3344",
        event: "Summer Music Festival 2026",
        event_image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=150&auto=format&fit=crop&q=80",
        event_venue: "ICE BSD City, Tangerang",
        date: "20 Des 2026",
        tickets: "1 x VIP Pass",
        amount: 350000,
        formatted_amount: "Rp 350.000",
        admin_fee: "Rp 10.000",
        total_paid: "Rp 360.000",
        method: "E-Wallet (GoPay)",
        status: "Failed",
        order_date: "18 Mei 2026 13:30",
        transaction_id: "GOPAY-20260518-1330"
    },
    {
        id: "#VTX-001243",
        customer: "Fajar Ramadhan",
        email: "fajar.r@email.com",
        phone: "+62 812-9988-7766",
        event: "Tech Summit Indonesia 2026",
        event_image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=150&auto=format&fit=crop&q=80",
        event_venue: "ICE BSD City, Tangerang",
        date: "07 Jun 2026",
        tickets: "1 x Regular Pass",
        amount: 175000,
        formatted_amount: "Rp 175.000",
        admin_fee: "Rp 5.000",
        total_paid: "Rp 180.000",
        method: "VA Mandiri",
        status: "Refunded",
        order_date: "18 Mei 2026 12:58",
        transaction_id: "VA-MANDIRI-20260518"
    }
];

const TicketOrderPage: React.FC = () => {
    const [orders, setOrders] = useState<OrderItem[]>(initialMockOrders);
    const [activeTab, setActiveTab] = useState<'all' | 'unpaid' | 'pending' | 'paid' | 'failed' | 'refunded'>('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedOrder, setSelectedOrder] = useState<OrderItem | null>(initialMockOrders[0]);
    const [loading, setLoading] = useState(false);

    const ticketOrderModel = new TicketOrder();

    // Fetch live orders if available
    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await ticketOrderModel.list();
                if (res && (res.data || (res as any).orders)) {
                    const list = (res.data || (res as any).orders) as InTicketOrder[];
                    if (list.length > 0) {
                        const formatted: OrderItem[] = list.map((item) => {
                            const rawStatus = (item.status || 'unpaid').toLowerCase();
                            let status: 'Unpaid' | 'Pending' | 'Paid' | 'Failed' | 'Refunded' = 'Unpaid';
                            if (rawStatus === 'paid' || rawStatus === 'success') status = 'Paid';
                            else if (rawStatus === 'pending' || rawStatus === 'waiting') status = 'Pending';
                            else if (rawStatus === 'failed') status = 'Failed';
                            else if (rawStatus === 'refunded') status = 'Refunded';

                            const amountNum = Number(item.total_amount) || Number(item.subtotal_amount) || 0;

                            return {
                                id: item.order_code ? `#${item.order_code}` : `#VTX-${item.id}`,
                                backend_id: item.id,
                                customer: item.guest_name || item.user?.name || item.user?.username || 'Customer',
                                email: item.guest_email || item.user?.email || '-',
                                phone: item.guest_phone || item.user?.phone || '-',
                                event: item.order_items?.[0]?.event_ticket?.name ? `Event Tiket: ${item.order_items[0].event_ticket.name}` : 'Event Veentix',
                                event_image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=150&auto=format&fit=crop&q=80",
                                event_venue: "Venue Lokasi",
                                date: item.created_at ? new Date(item.created_at).toLocaleDateString('id-ID') : 'Hari ini',
                                tickets: item.order_items ? `${item.order_items.reduce((acc, i) => acc + (i.quantity || 1), 0)} Tiket` : '1 Tiket',
                                amount: amountNum,
                                formatted_amount: `Rp ${amountNum.toLocaleString('id-ID')}`,
                                admin_fee: item.admin_fee_amount ? `Rp ${Number(item.admin_fee_amount).toLocaleString('id-ID')}` : 'Rp 0',
                                total_paid: `Rp ${amountNum.toLocaleString('id-ID')}`,
                                method: item.payment_method || 'Manual',
                                status: status,
                                order_date: item.created_at ? new Date(item.created_at).toLocaleString('id-ID') : '18 Mei 2026',
                                transaction_id: item.order_code || `TRX-${item.id}`
                            };
                        });
                        setOrders(formatted);
                        if (formatted.length > 0) {
                            setSelectedOrder(formatted[0]);
                        }
                    }
                }
            } catch (err) {
                // Keep mock fallback on error
                console.log('Using local order dataset');
            }
        };
        fetchOrders();
    }, []);

    // Manual status change handler
    const handleUpdateStatus = async (orderId: string, newStatus: 'Unpaid' | 'Pending' | 'Paid' | 'Failed' | 'Refunded') => {
        const targetOrder = orders.find(o => o.id === orderId);
        if (!targetOrder) return;

        // Try API update if backend_id exists
        if (targetOrder.backend_id) {
            try {
                await ticketOrderModel.update(targetOrder.backend_id, { status: newStatus.toLowerCase() });
            } catch (e) {
                // Continue with state update even if offline
            }
        }

        // Update local state
        setOrders(prev => prev.map(ord => ord.id === orderId ? { ...ord, status: newStatus } : ord));
        
        if (selectedOrder && selectedOrder.id === orderId) {
            setSelectedOrder(prev => prev ? { ...prev, status: newStatus } : null);
        }

        let statusIndo = 'Belum Dibayar (Unpaid)';
        if (newStatus === 'Pending') statusIndo = 'Menunggu Konfirmasi (Pending)';
        if (newStatus === 'Paid') statusIndo = 'Lunas (Paid)';
        if (newStatus === 'Failed') statusIndo = 'Gagal (Failed)';
        if (newStatus === 'Refunded') statusIndo = 'Dikembalikan (Refunded)';

        showToast(`Status pesanan ${orderId} berhasil diubah ke: ${statusIndo}`, 'success');
    };

    // Calculate metrics based on state
    const totalOrdersCount = orders.length;
    const paidOrders = orders.filter(o => o.status === 'Paid');
    const pendingOrders = orders.filter(o => o.status === 'Pending');
    const unpaidOrders = orders.filter(o => o.status === 'Unpaid');
    const refundedOrders = orders.filter(o => o.status === 'Refunded');

    const totalRevenue = paidOrders.reduce((acc, o) => acc + o.amount, 0);

    const filteredOrders = orders.filter(ord => {
        const matchesTab = activeTab === 'all' || ord.status.toLowerCase() === activeTab;
        if (!matchesTab) return false;
        if (!searchTerm.trim()) return true;
        const term = searchTerm.toLowerCase();
        return (
            ord.id.toLowerCase().includes(term) ||
            ord.customer.toLowerCase().includes(term) ||
            ord.email.toLowerCase().includes(term) ||
            ord.event.toLowerCase().includes(term)
        );
    });

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'Paid':
                return <span className="badge bg-success-subtle text-success border border-success-subtle fw-semibold px-2.5 py-1">Lunas (Paid)</span>;
            case 'Pending':
                return <span className="badge bg-warning-subtle text-warning border border-warning-subtle fw-semibold px-2.5 py-1">Menunggu (Pending)</span>;
            case 'Unpaid':
                return <span className="badge bg-secondary-subtle text-secondary border border-secondary-subtle fw-semibold px-2.5 py-1">Belum Bayar (Unpaid)</span>;
            case 'Refunded':
                return <span className="badge bg-purple-subtle text-purple border border-purple-subtle fw-semibold px-2.5 py-1" style={{ color: '#7c3aed', backgroundColor: 'rgba(124, 58, 237, 0.12)' }}>Dikembalikan</span>;
            default:
                return <span className="badge bg-danger-subtle text-danger border border-danger-subtle fw-semibold px-2.5 py-1">Gagal (Failed)</span>;
        }
    };

    return (
        <div className="py-3 px-1">
            {/* HEADER */}
            <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 mb-4">
                <div>
                    <h4 className="fw-extrabold text-dark mb-1" style={{ fontSize: '1.45rem' }}>Pesanan & Transaksi</h4>
                    <p className="text-muted small mb-0">Kelola semua pesanan tiket, verifikasi pembayaran, dan ubah status transaksi secara manual.</p>
                </div>
            </div>

            {/* 5 METRICS CARDS */}
            <Row className="g-3 mb-4">
                <Col xl={2} lg={4} md={6} sm={6}>
                    <Card className="border-0 shadow-sm rounded-4 p-2 bg-white h-100">
                        <Card.Body className="p-2">
                            <span className="text-muted small fw-semibold uppercase" style={{ fontSize: '0.72rem' }}>Total Pesanan</span>
                            <h4 className="fw-extrabold text-dark mt-1 mb-1" style={{ fontSize: '1.35rem' }}>{totalOrdersCount}</h4>
                            <span className="text-muted small" style={{ fontSize: '0.68rem' }}>Semua transaksi masuk</span>
                        </Card.Body>
                    </Card>
                </Col>

                <Col xl={3} lg={4} md={6} sm={6}>
                    <Card className="border-0 shadow-sm rounded-4 p-2 bg-white h-100">
                        <Card.Body className="p-2">
                            <span className="text-muted small fw-semibold uppercase" style={{ fontSize: '0.72rem' }}>Total Pendapatan (Lunas)</span>
                            <h4 className="fw-extrabold text-primary mt-1 mb-1" style={{ fontSize: '1.35rem' }}>Rp {totalRevenue.toLocaleString('id-ID')}</h4>
                            <span className="badge bg-success-subtle text-success p-1" style={{ fontSize: '0.68rem' }}>Dari {paidOrders.length} transaksi</span>
                        </Card.Body>
                    </Card>
                </Col>

                <Col xl={2} lg={4} md={4} sm={4}>
                    <Card className="border-0 shadow-sm rounded-4 p-2 bg-white h-100 border-start border-4 border-secondary">
                        <Card.Body className="p-2">
                            <span className="text-muted small fw-semibold uppercase" style={{ fontSize: '0.72rem' }}>Belum Bayar (Unpaid)</span>
                            <h4 className="fw-extrabold text-dark mt-1 mb-1" style={{ fontSize: '1.35rem' }}>{unpaidOrders.length}</h4>
                            <span className="text-muted" style={{ fontSize: '0.68rem' }}>
                                {totalOrdersCount > 0 ? Math.round((unpaidOrders.length / totalOrdersCount) * 100) : 0}% pesanan baru
                            </span>
                        </Card.Body>
                    </Card>
                </Col>

                <Col xl={2} lg={4} md={4} sm={4}>
                    <Card className="border-0 shadow-sm rounded-4 p-2 bg-white h-100 border-start border-4 border-warning">
                        <Card.Body className="p-2">
                            <span className="text-muted small fw-semibold uppercase" style={{ fontSize: '0.72rem' }}>Menunggu (Pending)</span>
                            <h4 className="fw-extrabold text-warning mt-1 mb-1" style={{ fontSize: '1.35rem' }}>{pendingOrders.length}</h4>
                            <span className="text-muted" style={{ fontSize: '0.68rem' }}>Perlu konfirmasi EO</span>
                        </Card.Body>
                    </Card>
                </Col>

                <Col xl={3} lg={4} md={4} sm={4}>
                    <Card className="border-0 shadow-sm rounded-4 p-2 bg-white h-100 border-start border-4 border-success">
                        <Card.Body className="p-2">
                            <span className="text-muted small fw-semibold uppercase" style={{ fontSize: '0.72rem' }}>Lunas (Paid)</span>
                            <h4 className="fw-extrabold text-success mt-1 mb-1" style={{ fontSize: '1.35rem' }}>{paidOrders.length}</h4>
                            <span className="text-muted" style={{ fontSize: '0.68rem' }}>
                                <span className="text-success fw-bold">{totalOrdersCount > 0 ? Math.round((paidOrders.length / totalOrdersCount) * 100) : 0}%</span> tingkat sukses
                            </span>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* FLOW INFO BANNER */}
            <div className="alert alert-primary bg-primary-subtle border-0 rounded-4 p-3 mb-4 d-flex align-items-center justify-content-between flex-wrap gap-2">
                <div className="d-flex align-items-center gap-3">
                    <div className="rounded-circle bg-primary text-white p-2 d-flex align-items-center justify-content-center" style={{ width: '38px', height: '38px' }}>
                        <i className="bx bx-transfer-alt fs-5"></i>
                    </div>
                    <div>
                        <div className="fw-bold text-dark" style={{ fontSize: '0.85rem' }}>Alur Status Pembayaran Tiket:</div>
                        <div className="text-muted small" style={{ fontSize: '0.75rem' }}>
                            <strong>1. Unpaid (Belum Bayar)</strong> saat pesanan dibuat ➔ <strong>2. Pending</strong> saat pembeli melakukan pembayaran ➔ <strong>3. Paid (Lunas)</strong> setelah pembayaran diverifikasi / di-update manual.
                        </div>
                    </div>
                </div>
                <div className="d-flex align-items-center gap-2">
                    <span className="badge bg-secondary">1. Unpaid</span>
                    <i className="bx bx-right-arrow-alt text-muted"></i>
                    <span className="badge bg-warning text-dark">2. Pending</span>
                    <i className="bx bx-right-arrow-alt text-muted"></i>
                    <span className="badge bg-success">3. Paid</span>
                </div>
            </div>

            <Row className="g-4">
                {/* Main Table Area */}
                <Col xl={selectedOrder ? 8 : 12}>
                    <Card className="border-0 shadow-sm rounded-4 p-3 bg-white">
                        <div className="d-flex flex-wrap align-items-center justify-content-between pb-3 mb-3 border-bottom gap-2">
                            <h6 className="fw-bold text-dark mb-0" style={{ fontSize: '1.05rem' }}>Daftar Pesanan Tiket</h6>
                            <div className="d-flex align-items-center gap-2">
                                <div className="position-relative" style={{ width: '220px' }}>
                                    <i className="bx bx-search position-absolute top-50 start-0 translate-middle-y ms-2.5 text-muted" style={{ fontSize: '0.9rem' }}></i>
                                    <input
                                        type="text"
                                        className="form-control form-control-sm ps-4 bg-light border-0"
                                        placeholder="Cari ID pesanan, nama, email..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        style={{ fontSize: '0.8rem', borderRadius: '6px' }}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Clean Underline Tabs */}
                        <div className="d-flex align-items-center gap-2 mb-3 border-bottom overflow-x-auto pb-1" style={{ fontSize: '0.85rem' }}>
                            {[
                                { id: 'all', label: 'Semua Pesanan', count: orders.length },
                                { id: 'unpaid', label: 'Belum Bayar (Unpaid)', count: unpaidOrders.length },
                                { id: 'pending', label: 'Menunggu (Pending)', count: pendingOrders.length },
                                { id: 'paid', label: 'Lunas (Paid)', count: paidOrders.length },
                                { id: 'failed', label: 'Gagal', count: orders.filter(o => o.status === 'Failed').length },
                                { id: 'refunded', label: 'Dikembalikan', count: refundedOrders.length }
                            ].map(tab => (
                                <button
                                    key={tab.id}
                                    className={`btn btn-link text-decoration-none px-2.5 py-2 border-0 fw-semibold cursor-pointer text-nowrap ${activeTab === tab.id ? 'text-primary border-bottom border-2 border-primary' : 'text-secondary opacity-75 hover-opacity-100'}`}
                                    style={{
                                        borderRadius: 0,
                                        marginBottom: '-1px',
                                        fontSize: '0.82rem'
                                    }}
                                    onClick={() => setActiveTab(tab.id as any)}
                                >
                                    {tab.label} <span className="badge bg-light text-muted ms-1 rounded-pill">{tab.count}</span>
                                </button>
                            ))}
                        </div>

                        <div className="table-responsive">
                            <Table hover className="align-middle mb-0" style={{ fontSize: '0.82rem' }}>
                                <thead className="bg-light text-muted uppercase">
                                    <tr>
                                        <th>ID Pesanan</th>
                                        <th>Pelanggan</th>
                                        <th>Event & Tiket</th>
                                        <th>Total</th>
                                        <th>Metode</th>
                                        <th>Status Pembayaran</th>
                                        <th className="text-center" style={{ minWidth: '160px' }}>Ubah Status Manual</th>
                                        <th className="text-end">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredOrders.map((ord) => (
                                        <tr
                                            key={ord.id}
                                            className={`cursor-pointer ${selectedOrder?.id === ord.id ? 'table-active' : ''}`}
                                            onClick={() => setSelectedOrder(ord)}
                                        >
                                            <td className="fw-bold text-primary">{ord.id}</td>
                                            <td>
                                                <div className="fw-bold text-dark">{ord.customer}</div>
                                                <div className="text-muted" style={{ fontSize: '0.7rem' }}>{ord.email}</div>
                                            </td>
                                            <td>
                                                <div className="fw-semibold text-dark text-truncate" style={{ maxWidth: '160px' }}>{ord.event}</div>
                                                <div className="text-muted" style={{ fontSize: '0.7rem' }}>{ord.tickets}</div>
                                            </td>
                                            <td className="fw-bold text-dark">{ord.formatted_amount}</td>
                                            <td className="text-muted">{ord.method}</td>
                                            <td>
                                                {getStatusBadge(ord.status)}
                                            </td>
                                            <td className="text-center" onClick={(e) => e.stopPropagation()}>
                                                {/* Dropdown status selector directly on table */}
                                                <Dropdown>
                                                    <Dropdown.Toggle
                                                        size="sm"
                                                        variant="light"
                                                        className="border py-1 px-2 fw-semibold d-inline-flex align-items-center gap-1"
                                                        style={{ fontSize: '0.75rem', borderRadius: '6px' }}
                                                    >
                                                        <i className="bx bx-edit text-muted"></i>
                                                        <span>Ubah Status</span>
                                                    </Dropdown.Toggle>

                                                    <Dropdown.Menu className="shadow-lg border-0 py-1" style={{ fontSize: '0.8rem' }}>
                                                        <Dropdown.Item
                                                            className={`d-flex align-items-center gap-2 py-2 ${ord.status === 'Unpaid' ? 'active' : ''}`}
                                                            onClick={() => handleUpdateStatus(ord.id, 'Unpaid')}
                                                        >
                                                            <span className="badge bg-secondary p-1 rounded-circle" style={{ width: '8px', height: '8px' }}> </span>
                                                            <span>1. Belum Bayar (Unpaid)</span>
                                                        </Dropdown.Item>
                                                        <Dropdown.Item
                                                            className={`d-flex align-items-center gap-2 py-2 ${ord.status === 'Pending' ? 'active' : ''}`}
                                                            onClick={() => handleUpdateStatus(ord.id, 'Pending')}
                                                        >
                                                            <span className="badge bg-warning p-1 rounded-circle" style={{ width: '8px', height: '8px' }}> </span>
                                                            <span>2. Sudah Bayar / Verifikasi (Pending)</span>
                                                        </Dropdown.Item>
                                                        <Dropdown.Item
                                                            className={`d-flex align-items-center gap-2 py-2 ${ord.status === 'Paid' ? 'active' : ''}`}
                                                            onClick={() => handleUpdateStatus(ord.id, 'Paid')}
                                                        >
                                                            <span className="badge bg-success p-1 rounded-circle" style={{ width: '8px', height: '8px' }}> </span>
                                                            <span>3. Lunas & Terkonfirmasi (Paid)</span>
                                                        </Dropdown.Item>
                                                        <Dropdown.Divider />
                                                        <Dropdown.Item
                                                            className={`d-flex align-items-center gap-2 py-1 text-danger ${ord.status === 'Failed' ? 'active' : ''}`}
                                                            onClick={() => handleUpdateStatus(ord.id, 'Failed')}
                                                        >
                                                            <i className="bx bx-x-circle fs-6"></i>
                                                            <span>Gagal (Failed)</span>
                                                        </Dropdown.Item>
                                                        <Dropdown.Item
                                                            className={`d-flex align-items-center gap-2 py-1 text-purple ${ord.status === 'Refunded' ? 'active' : ''}`}
                                                            onClick={() => handleUpdateStatus(ord.id, 'Refunded')}
                                                        >
                                                            <i className="bx bx-undo fs-6"></i>
                                                            <span>Kembalikan Dana (Refunded)</span>
                                                        </Dropdown.Item>
                                                    </Dropdown.Menu>
                                                </Dropdown>
                                            </td>
                                            <td className="text-end">
                                                <button
                                                    className="btn btn-sm btn-icon text-primary p-1"
                                                    title="Lihat Rincian"
                                                    onClick={() => setSelectedOrder(ord)}
                                                >
                                                    <i className="bx bx-show fs-5"></i>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {filteredOrders.length === 0 && (
                                        <tr>
                                            <td colSpan={8} className="text-center py-5 text-muted">
                                                Tidak ada pesanan ditemukan untuk filter ini.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </Table>
                        </div>
                    </Card>
                </Col>

                {/* Right Side: Order Details Drawer */}
                {selectedOrder && (
                    <Col xl={4}>
                        <Card className="border-0 shadow-sm rounded-4 p-3 bg-white position-sticky" style={{ top: '80px' }}>
                            <div className="d-flex align-items-center justify-content-between border-bottom pb-2 mb-3">
                                <h6 className="fw-bold text-dark mb-0" style={{ fontSize: '1rem' }}>Rincian Pesanan</h6>
                                <button className="btn btn-sm btn-icon text-muted p-0" onClick={() => setSelectedOrder(null)}>
                                    <i className="bx bx-x fs-4"></i>
                                </button>
                            </div>

                            {/* Order ID & Status Header */}
                            <div className="d-flex align-items-center justify-content-between bg-light p-3 rounded-3 mb-3 border">
                                <div>
                                    <div className="text-muted small" style={{ fontSize: '0.72rem' }}>ID Pesanan</div>
                                    <div className="fw-extrabold text-primary" style={{ fontSize: '1.1rem' }}>{selectedOrder.id}</div>
                                    <div className="text-muted" style={{ fontSize: '0.68rem' }}>{selectedOrder.order_date}</div>
                                </div>
                                <div className="text-end">
                                    {getStatusBadge(selectedOrder.status)}
                                </div>
                            </div>

                            {/* QUICK STATUS CHANGER BUTTONS */}
                            <div className="mb-3 p-2.5 rounded-3 border" style={{ background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.04) 0%, rgba(79, 70, 229, 0.08) 100%)' }}>
                                <div className="d-flex align-items-center justify-content-between mb-2">
                                    <span className="fw-bold text-dark small" style={{ fontSize: '0.78rem' }}>
                                        <i className="bx bx-slider-alt text-primary me-1"></i> Kontrol Status Transaksi
                                    </span>
                                </div>

                                <div className="d-flex flex-column gap-1.5">
                                    {selectedOrder.status === 'Unpaid' && (
                                        <>
                                            <button
                                                className="btn btn-warning btn-sm w-100 fw-semibold d-flex align-items-center justify-content-center gap-1.5 py-1.5"
                                                style={{ fontSize: '0.78rem' }}
                                                onClick={() => handleUpdateStatus(selectedOrder.id, 'Pending')}
                                            >
                                                <i className="bx bx-time fs-6"></i>
                                                <span>Pelanggan Sudah Bayar (Set ke Pending)</span>
                                            </button>
                                            <button
                                                className="btn btn-success btn-sm w-100 fw-semibold d-flex align-items-center justify-content-center gap-1.5 py-1.5"
                                                style={{ fontSize: '0.78rem' }}
                                                onClick={() => handleUpdateStatus(selectedOrder.id, 'Paid')}
                                            >
                                                <i className="bx bx-check-circle fs-6"></i>
                                                <span>Tandai Lunas Langsung (Paid)</span>
                                            </button>
                                        </>
                                    )}

                                    {selectedOrder.status === 'Pending' && (
                                        <>
                                            <button
                                                className="btn btn-success btn-sm w-100 fw-bold d-flex align-items-center justify-content-center gap-1.5 py-2 shadow-sm"
                                                style={{ fontSize: '0.82rem' }}
                                                onClick={() => handleUpdateStatus(selectedOrder.id, 'Paid')}
                                            >
                                                <i className="bx bx-check-double fs-5"></i>
                                                <span>Konfirmasi Pembayaran (Tandai Paid)</span>
                                            </button>
                                            <button
                                                className="btn btn-light btn-sm border w-100 text-secondary d-flex align-items-center justify-content-center gap-1 py-1"
                                                style={{ fontSize: '0.75rem' }}
                                                onClick={() => handleUpdateStatus(selectedOrder.id, 'Unpaid')}
                                            >
                                                <i className="bx bx-undo fs-6"></i>
                                                <span>Kembalikan ke Belum Bayar (Unpaid)</span>
                                            </button>
                                        </>
                                    )}

                                    {selectedOrder.status === 'Paid' && (
                                        <div className="d-flex gap-2">
                                            <button
                                                className="btn btn-light btn-sm border w-50 text-warning d-flex align-items-center justify-content-center gap-1 py-1.5"
                                                style={{ fontSize: '0.72rem' }}
                                                onClick={() => handleUpdateStatus(selectedOrder.id, 'Pending')}
                                            >
                                                <i className="bx bx-time fs-6"></i>
                                                <span>Set ke Pending</span>
                                            </button>
                                            <button
                                                className="btn btn-light btn-sm border w-50 text-secondary d-flex align-items-center justify-content-center gap-1 py-1.5"
                                                style={{ fontSize: '0.72rem' }}
                                                onClick={() => handleUpdateStatus(selectedOrder.id, 'Unpaid')}
                                            >
                                                <i className="bx bx-undo fs-6"></i>
                                                <span>Set ke Unpaid</span>
                                            </button>
                                        </div>
                                    )}

                                    {selectedOrder.status !== 'Unpaid' && selectedOrder.status !== 'Pending' && selectedOrder.status !== 'Paid' && (
                                        <div className="d-flex gap-2">
                                            <button
                                                className="btn btn-primary btn-sm w-100 fw-semibold py-1.5"
                                                style={{ fontSize: '0.78rem' }}
                                                onClick={() => handleUpdateStatus(selectedOrder.id, 'Paid')}
                                            >
                                                Pulihkan ke Paid
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Customer Information */}
                            <div className="mb-3">
                                <div className="text-muted small fw-semibold uppercase mb-1" style={{ fontSize: '0.7rem' }}>Pelanggan</div>
                                <div className="d-flex align-items-center gap-2">
                                    <div className="avatar avatar-sm rounded-circle bg-primary text-white d-flex align-items-center justify-content-center fw-bold">
                                        {selectedOrder.customer.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <div className="fw-bold text-dark" style={{ fontSize: '0.85rem' }}>{selectedOrder.customer}</div>
                                        <div className="text-muted" style={{ fontSize: '0.72rem' }}>{selectedOrder.email}</div>
                                        <div className="text-muted" style={{ fontSize: '0.72rem' }}>{selectedOrder.phone}</div>
                                    </div>
                                </div>
                            </div>

                            {/* Event Information */}
                            <div className="mb-3 border-top pt-2">
                                <div className="text-muted small fw-semibold uppercase mb-1" style={{ fontSize: '0.7rem' }}>Event Terpilih</div>
                                <div className="d-flex align-items-center gap-2 bg-light p-2 rounded-3">
                                    <img src={selectedOrder.event_image} alt={selectedOrder.event} className="rounded-2 object-fit-cover" style={{ width: '42px', height: '42px' }} />
                                    <div>
                                        <div className="fw-bold text-dark" style={{ fontSize: '0.8rem' }}>{selectedOrder.event}</div>
                                        <div className="text-muted" style={{ fontSize: '0.7rem' }}>{selectedOrder.date} • {selectedOrder.event_venue}</div>
                                    </div>
                                </div>
                            </div>

                            {/* Items & Price Breakdown */}
                            <div className="mb-3 border-top pt-2">
                                <div className="text-muted small fw-semibold uppercase mb-1" style={{ fontSize: '0.7rem' }}>Rincian Pembayaran</div>
                                <div className="d-flex justify-content-between align-items-center mb-1" style={{ fontSize: '0.8rem' }}>
                                    <span>{selectedOrder.tickets}</span>
                                    <span className="fw-bold text-dark">{selectedOrder.formatted_amount}</span>
                                </div>
                                <div className="d-flex justify-content-between align-items-center mb-1 text-muted" style={{ fontSize: '0.75rem' }}>
                                    <span>Biaya Admin</span>
                                    <span>{selectedOrder.admin_fee}</span>
                                </div>
                                <div className="d-flex justify-content-between align-items-center pt-2 border-top fw-bold text-dark" style={{ fontSize: '0.95rem' }}>
                                    <span>Total Tagihan</span>
                                    <span className="text-primary">{selectedOrder.total_paid}</span>
                                </div>
                            </div>

                            {/* Payment Method Details */}
                            <div className="mb-3 border-top pt-2">
                                <div className="text-muted small fw-semibold uppercase mb-1" style={{ fontSize: '0.7rem' }}>Informasi Pembayaran</div>
                                <div className="bg-light p-2 rounded-3 text-muted" style={{ fontSize: '0.75rem' }}>
                                    <div className="d-flex justify-content-between mb-1">
                                        <span>Metode</span>
                                        <span className="fw-bold text-dark">{selectedOrder.method}</span>
                                    </div>
                                    <div className="d-flex justify-content-between mb-1">
                                        <span>ID Transaksi</span>
                                        <span className="font-monospace text-dark">{selectedOrder.transaction_id}</span>
                                    </div>
                                    {selectedOrder.payment_time && (
                                        <div className="d-flex justify-content-between">
                                            <span>Waktu Bayar</span>
                                            <span className="text-success fw-semibold">{selectedOrder.payment_time}</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Actions Buttons */}
                            <div className="d-flex flex-column gap-2 border-top pt-3">
                                <button className="btn btn-sm btn-outline-primary w-100 d-flex align-items-center justify-content-center gap-1">
                                    <i className="bx bx-download fs-5"></i> Unduh Invoice
                                </button>
                                <button className="btn btn-sm btn-light border w-100 d-flex align-items-center justify-content-center gap-1 text-muted">
                                    <i className="bx bx-paper-plane fs-5"></i> Kirim Ulang E-Ticket
                                </button>
                            </div>
                        </Card>
                    </Col>
                )}
            </Row>
        </div>
    );
};

export default TicketOrderPage;
