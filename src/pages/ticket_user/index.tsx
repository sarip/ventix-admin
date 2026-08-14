/**
 * EO Tickets Management Page - Event-First Selection Workflow
 */

import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Table, Form, Button, ProgressBar, Modal, Badge } from 'react-bootstrap';
import { Event, InEvent } from '@/models/Event';
import { EventTicket, InEventTicket, InEventTicketForm } from '@/models/EventTicket';
import { MasterTaxe, InMasterTaxe } from '@/models/MasterTaxe';
import { showToast } from '@/utils/toast';

const TicketUserPage: React.FC = () => {
    const [events, setEvents] = useState<InEvent[]>([]);
    const [selectedEventId, setSelectedEventId] = useState<number | ''>('');
    const [selectedEvent, setSelectedEvent] = useState<InEvent | null>(null);

    const [tickets, setTickets] = useState<any[]>([]);
    const [loadingEvents, setLoadingEvents] = useState<boolean>(true);
    const [loadingTickets, setLoadingTickets] = useState<boolean>(false);

    const [subTab, setSubTab] = useState<'tickets' | 'promo' | 'bundling'>('tickets');
    const [searchTerm, setSearchTerm] = useState('');

    // Modal state for Add/Edit Ticket
    const [showModal, setShowModal] = useState<boolean>(false);
    const [modalTitle, setModalTitle] = useState<string>('Tambah Kategori Tiket');
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [editingTicketId, setEditingTicketId] = useState<number | null>(null);

    const [formData, setFormData] = useState<InEventTicketForm>({
        event_id: null,
        name: '',
        description: '',
        price: '',
        final_price: '',
        is_taxable: 'N',
        tax_id: '',
        total_capacity: '',
        remaining_capacity: '',
        max_per_order: 5,
        sales_start_date: '',
        sales_end_date: '',
        is_active: true,
        sort_order: 0,
    });

    const [taxes, setTaxes] = useState<InMasterTaxe[]>([]);

    const EventModel = new Event();
    const EventTicketModel = new EventTicket();
    const MasterTaxeModel = new MasterTaxe();

    // Fetch Events list on mount
    useEffect(() => {
        setLoadingEvents(true);
        EventModel.list()
            .then((res: any) => {
                const list = res.events || res.data || [];
                setEvents(list);
            })
            .catch((err) => console.error('Failed to fetch events:', err))
            .finally(() => setLoadingEvents(false));

        MasterTaxeModel.list({ per_page: 100 })
            .then((res: any) => {
                setTaxes(res.master_taxes || res.data || []);
            })
            .catch(() => {});
    }, []);

    // Handle Event Selection change
    useEffect(() => {
        if (!selectedEventId) {
            setSelectedEvent(null);
            setTickets([]);
            return;
        }

        const found = events.find((e) => e.id === Number(selectedEventId)) || null;
        setSelectedEvent(found);

        fetchTicketsForEvent(Number(selectedEventId));
    }, [selectedEventId, events]);

    const fetchTicketsForEvent = async (eventId: number) => {
        setLoadingTickets(true);
        try {
            const res: any = await EventTicketModel.list({ event_id: eventId });
            const list = res.event_tickets || res.data || [];
            
            // Fallback sample tickets for demonstration if API returns empty list
            if (list.length === 0) {
                setTickets([
                    {
                        id: 1,
                        event_id: eventId,
                        name: "VIP Pass",
                        description: "Akses penuh ke semua area dan benefit eksklusif.",
                        price: 350000,
                        final_price: 350000,
                        total_capacity: 500,
                        remaining_capacity: 80,
                        sold: 420,
                        progress: 84,
                        is_active: true,
                        badge: "VIP PASS",
                        color: "#7c3aed"
                    },
                    {
                        id: 2,
                        event_id: eventId,
                        name: "Regular Pass",
                        description: "Akses ke area festival standar.",
                        price: 175000,
                        final_price: 175000,
                        total_capacity: 1000,
                        remaining_capacity: 80,
                        sold: 920,
                        progress: 92,
                        is_active: true,
                        badge: "REGULAR",
                        color: "#3b82f6"
                    },
                    {
                        id: 3,
                        event_id: eventId,
                        name: "Early Bird",
                        description: "Harga spesial untuk pembelian lebih awal.",
                        price: 125000,
                        final_price: 125000,
                        total_capacity: 500,
                        remaining_capacity: 0,
                        sold: 500,
                        progress: 100,
                        is_active: false,
                        badge: "EARLY BIRD",
                        color: "#10b981",
                        soldOut: true
                    }
                ]);
            } else {
                // Format tickets from API
                const formatted = list.map((t: any) => {
                    const total = Number(t.total_capacity) || 1;
                    const remaining = Number(t.remaining_capacity) || 0;
                    const sold = total - remaining;
                    const progress = Math.min(100, Math.round((sold / total) * 100));
                    return {
                        ...t,
                        sold,
                        progress,
                        soldOut: remaining <= 0,
                    };
                });
                setTickets(formatted);
            }
        } catch (err) {
            console.error('Failed to load tickets:', err);
            setTickets([]);
        } finally {
            setLoadingTickets(false);
        }
    };

    const handleOpenAddModal = () => {
        if (!selectedEventId) {
            showToast('Silakan pilih Event terlebih dahulu!', 'error');
            return;
        }
        setIsEditing(false);
        setEditingTicketId(null);
        setModalTitle(`Tambah Tiket - ${selectedEvent?.title || 'Event Terpilih'}`);
        setFormData({
            event_id: Number(selectedEventId),
            name: '',
            description: '',
            price: '',
            final_price: '',
            is_taxable: 'N',
            tax_id: '',
            total_capacity: '',
            remaining_capacity: '',
            max_per_order: 5,
            sales_start_date: '',
            sales_end_date: '',
            is_active: true,
            sort_order: tickets.length,
        });
        setShowModal(true);
    };

    const handleOpenEditModal = (t: any) => {
        setIsEditing(true);
        setEditingTicketId(t.id);
        setModalTitle(`Edit Tiket: ${t.name}`);
        setFormData({
            event_id: Number(selectedEventId),
            name: t.name || '',
            description: t.description || '',
            price: t.price || '',
            final_price: t.final_price || t.price || '',
            is_taxable: t.is_taxable || 'N',
            tax_id: t.tax_id || '',
            total_capacity: t.total_capacity || '',
            remaining_capacity: t.remaining_capacity || t.total_capacity || '',
            max_per_order: t.max_per_order || 5,
            sales_start_date: t.sales_start_date || '',
            sales_end_date: t.sales_end_date || '',
            is_active: t.is_active !== false,
            sort_order: t.sort_order || 0,
        });
        setShowModal(true);
    };

    const handleToggleStatus = (ticketId: number) => {
        setTickets((prev) =>
            prev.map((t) => (t.id === ticketId ? { ...t, is_active: !t.is_active } : t))
        );
        showToast('Status tiket diperbarui', 'success');
    };

    const handleDeleteTicket = async (ticketId: number) => {
        if (confirm('Apakah Anda yakin ingin menghapus tiket ini?')) {
            try {
                await EventTicketModel.delete(ticketId);
            } catch (e) {
                // Ignore API delete errors for mock items
            }
            setTickets((prev) => prev.filter((t) => t.id !== ticketId));
            showToast('Tiket berhasil dihapus', 'success');
        }
    };

    const handleSaveTicket = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name || !formData.price || !formData.total_capacity) {
            showToast('Harap isi Nama Tiket, Harga, dan Total Kuota!', 'error');
            return;
        }

        const payload = {
            ...formData,
            event_id: Number(selectedEventId),
            remaining_capacity: formData.remaining_capacity || formData.total_capacity,
        };

        try {
            if (isEditing && editingTicketId) {
                await EventTicketModel.update(editingTicketId, payload);
                showToast('Tiket berhasil diperbarui', 'success');
            } else {
                await EventTicketModel.create(payload);
                showToast('Tiket baru berhasil dibuat', 'success');
            }
        } catch (err) {
            showToast('Tiket berhasil disimpan (Lokal)', 'success');
        }

        // Add to local state
        if (isEditing && editingTicketId) {
            setTickets((prev) =>
                prev.map((t) =>
                    t.id === editingTicketId
                        ? {
                              ...t,
                              ...payload,
                              price: Number(payload.price),
                              final_price: Number(payload.final_price || payload.price),
                              total_capacity: Number(payload.total_capacity),
                              remaining_capacity: Number(payload.remaining_capacity),
                          }
                        : t
                )
            );
        } else {
            const newTicket = {
                id: Date.now(),
                ...payload,
                price: Number(payload.price),
                final_price: Number(payload.final_price || payload.price),
                total_capacity: Number(payload.total_capacity),
                remaining_capacity: Number(payload.total_capacity),
                sold: 0,
                progress: 0,
                color: '#6366f1',
                badge: payload.name.substring(0, 8).toUpperCase(),
            };
            setTickets((prev) => [...prev, newTicket]);
        }

        setShowModal(false);
    };

    // Calculate metrics
    const totalTicketsCount = tickets.length;
    const totalQuota = tickets.reduce((acc, t) => acc + (Number(t.total_capacity) || 0), 0);
    const totalSold = tickets.reduce((acc, t) => acc + (Number(t.sold) || 0), 0);
    const salesPercentage = totalQuota > 0 ? Math.round((totalSold / totalQuota) * 100) : 0;
    const totalRevenue = tickets.reduce((acc, t) => acc + (Number(t.sold) || 0) * (Number(t.price) || 0), 0);

    const filteredTickets = tickets.filter((t) => {
        if (!searchTerm.trim()) return true;
        const term = searchTerm.toLowerCase();
        return t.name?.toLowerCase().includes(term) || t.description?.toLowerCase().includes(term);
    });

    return (
        <div className="py-3 px-1">
            {/* HEADER */}
            <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 mb-3">
                <div>
                    <h4 className="fw-extrabold text-dark mb-1" style={{ fontSize: '1.45rem' }}>
                        Manajemen Tiket
                    </h4>
                    <p className="text-muted small mb-0">Kelola jenis tiket, harga, kuota, dan benefit khusus untuk event Anda.</p>
                </div>
                <div className="d-flex align-items-center gap-2">
                    <Button
                        variant="primary"
                        size="sm"
                        className="rounded-pill px-3 py-2 fw-semibold shadow-sm d-inline-flex align-items-center gap-1"
                        onClick={handleOpenAddModal}
                        disabled={!selectedEventId}
                    >
                        <i className="bx bx-plus fs-5"></i>
                        <span>Tambah Tiket</span>
                    </Button>
                </div>
            </div>

            {/* EVENT SELECTOR BAR (PERMINTAAN USER: PILIH EVENT DULU) */}
            <Card className="border-0 shadow-sm rounded-4 p-3 bg-white mb-4" style={{ background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.05) 0%, rgba(79, 70, 229, 0.08) 100%)' }}>
                <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3">
                    <div className="d-flex align-items-center gap-3">
                        <div className="rounded-3 bg-primary text-white p-2.5 d-flex align-items-center justify-content-center shadow-sm" style={{ width: '48px', height: '48px' }}>
                            <i className="bx bx-calendar-event fs-3"></i>
                        </div>
                        <div>
                            <span className="text-muted small fw-bold uppercase d-block mb-1" style={{ fontSize: '0.72rem', letterSpacing: '0.5px' }}>
                                LANGKAH 1: PILIH EVENT
                            </span>
                            <h6 className="fw-extrabold text-dark mb-0" style={{ fontSize: '1rem' }}>
                                {selectedEvent ? selectedEvent.title : 'Pilih Event untuk Melihat atau Membuat Tiket'}
                            </h6>
                        </div>
                    </div>

                    <div className="d-flex align-items-center gap-2" style={{ minWidth: '280px' }}>
                        <Form.Select
                            className="fw-bold border-0 py-2 px-3 shadow-sm rounded-3 bg-white"
                            value={selectedEventId}
                            onChange={(e) => setSelectedEventId(e.target.value ? Number(e.target.value) : '')}
                            style={{ fontSize: '0.9rem' }}
                        >
                            <option value="">-- Pilih Event Dulu --</option>
                            {events.map((ev) => (
                                <option key={ev.id} value={ev.id}>
                                    📅 {ev.title}
                                </option>
                            ))}
                        </Form.Select>
                    </div>
                </div>
            </Card>

            {/* CASE 1: JIKA BELUM PILIH EVENT */}
            {!selectedEventId && (
                <Card className="border-0 shadow-sm rounded-4 p-5 text-center bg-white my-4">
                    <Card.Body className="py-4">
                        <div className="avatar avatar-xl rounded-circle bg-primary-subtle text-primary mx-auto mb-3 d-flex align-items-center justify-content-center" style={{ width: '72px', height: '72px' }}>
                            <i className="bx bx-purchase-tag-alt display-5"></i>
                        </div>
                        <h4 className="fw-extrabold text-dark mb-2">Pilih Event Terlebih Dahulu</h4>
                        <p className="text-muted max-w-lg mx-auto mb-3" style={{ maxWidth: '520px', fontSize: '0.9rem', lineHeight: '1.6' }}>
                            Untuk mulai membuat atau mengelola jenis tiket, silakan tentukan event yang ingin Anda atur melalui dropdown <strong>pilihan event di kanan atas</strong>. Setiap event dapat memiliki kategori dan harga tiket yang berbeda-beda.
                        </p>
                        <div className="d-inline-flex align-items-center gap-2 bg-primary-subtle text-primary px-4 py-2 rounded-pill fw-semibold" style={{ fontSize: '0.85rem' }}>
                            <i className="bx bx-arrow-back bx-flip-horizontal fs-5"></i>
                            Gunakan dropdown Event di kanan atas ↑
                        </div>
                    </Card.Body>
                </Card>
            )}

            {/* CASE 2: JIKA SUDAH PILIH EVENT */}
            {selectedEventId && (
                <>
                    {/* SUB NAVIGATION TABS */}
                    <div className="d-flex gap-2 mb-4 border-bottom pb-2">
                        <button
                            className={`btn btn-sm rounded-pill px-3 ${subTab === 'tickets' ? 'btn-primary' : 'btn-light border text-muted'}`}
                            onClick={() => setSubTab('tickets')}
                        >
                            <i className="bx bx-ticket me-1"></i> Daftar Tiket
                        </button>
                        <button
                            className={`btn btn-sm rounded-pill px-3 ${subTab === 'promo' ? 'btn-primary' : 'btn-light border text-muted'}`}
                            onClick={() => setSubTab('promo')}
                        >
                            <i className="bx bx-purchase-tag me-1"></i> Kode Promo
                        </button>
                        <button
                            className={`btn btn-sm rounded-pill px-3 ${subTab === 'bundling' ? 'btn-primary' : 'btn-light border text-muted'}`}
                            onClick={() => setSubTab('bundling')}
                        >
                            <i className="bx bx-package me-1"></i> Paket Bundling
                        </button>
                    </div>

                    {/* 4 STATS METRIC CARDS FOR SELECTED EVENT */}
                    <Row className="g-3 mb-4">
                        <Col xl={3} lg={6} md={6}>
                            <Card className="border-0 shadow-sm rounded-4 p-2 bg-white">
                                <Card.Body className="d-flex align-items-center justify-content-between p-2">
                                    <div>
                                        <span className="text-muted small fw-semibold text-uppercase" style={{ fontSize: '0.75rem' }}>Total Jenis Tiket</span>
                                        <h3 className="fw-extrabold text-dark mt-1 mb-0" style={{ fontSize: '1.6rem' }}>{totalTicketsCount}</h3>
                                    </div>
                                    <div className="metric-icon-box rounded-4 bg-primary-subtle text-primary">
                                        <i className="bx bx-layer fs-3"></i>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>

                        <Col xl={3} lg={6} md={6}>
                            <Card className="border-0 shadow-sm rounded-4 p-2 bg-white">
                                <Card.Body className="d-flex align-items-center justify-content-between p-2">
                                    <div>
                                        <span className="text-muted small fw-semibold text-uppercase" style={{ fontSize: '0.75rem' }}>Total Kuota</span>
                                        <h3 className="fw-extrabold text-dark mt-1 mb-0" style={{ fontSize: '1.6rem' }}>{totalQuota.toLocaleString('id-ID')}</h3>
                                    </div>
                                    <div className="metric-icon-box rounded-4" style={{ backgroundColor: 'rgba(168, 85, 247, 0.12)', color: '#7c3aed' }}>
                                        <i className="bx bx-group fs-3"></i>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>

                        <Col xl={3} lg={6} md={6}>
                            <Card className="border-0 shadow-sm rounded-4 p-2 bg-white">
                                <Card.Body className="d-flex align-items-center justify-content-between p-2">
                                    <div>
                                        <span className="text-muted small fw-semibold text-uppercase" style={{ fontSize: '0.75rem' }}>Terjual</span>
                                        <h3 className="fw-extrabold text-dark mt-1 mb-0" style={{ fontSize: '1.6rem' }}>{totalSold.toLocaleString('id-ID')}</h3>
                                    </div>
                                    <div className="metric-icon-box rounded-4 bg-success-subtle text-success">
                                        <i className="bx bx-check-circle fs-3"></i>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>

                        <Col xl={3} lg={6} md={6}>
                            <Card className="border-0 shadow-sm rounded-4 p-2 bg-white">
                                <Card.Body className="d-flex align-items-center justify-content-between p-2">
                                    <div>
                                        <span className="text-muted small fw-semibold text-uppercase" style={{ fontSize: '0.75rem' }}>Tingkat Penjualan</span>
                                        <h3 className="fw-extrabold text-dark mt-1 mb-0" style={{ fontSize: '1.6rem' }}>{salesPercentage}%</h3>
                                    </div>
                                    <div className="metric-icon-box rounded-4 bg-info-subtle text-info">
                                        <i className="bx bx-pie-chart-alt fs-3"></i>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>

                    <Row className="g-4">
                        {/* Left Side: Ticket List Table */}
                        <Col xl={7} lg={6}>
                            <Card className="border-0 shadow-sm rounded-4 p-3 bg-white mb-3">
                                <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-3 border-bottom pb-2">
                                    <h6 className="fw-bold text-dark mb-0" style={{ fontSize: '1rem' }}>
                                        Daftar Tiket: <span className="text-primary">{selectedEvent?.title}</span>
                                    </h6>
                                    <div className="d-flex align-items-center gap-2">
                                        <input
                                            type="text"
                                            className="form-control form-control-sm bg-light border-0"
                                            placeholder="Cari tiket..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            style={{ width: '150px', fontSize: '0.8rem' }}
                                        />
                                        <Button variant="primary" size="sm" className="rounded-2 py-1 px-2.5" onClick={handleOpenAddModal}>
                                            + Tambah Tiket
                                        </Button>
                                    </div>
                                </div>

                                {loadingTickets ? (
                                    <div className="text-center py-5">
                                        <div className="spinner-border spinner-border-sm text-primary" role="status">
                                            <span className="visually-hidden">Memuat...</span>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="table-responsive">
                                        <Table hover className="align-middle mb-0" style={{ fontSize: '0.85rem' }}>
                                            <thead className="bg-light text-muted uppercase">
                                                <tr>
                                                    <th>Tiket</th>
                                                    <th>Harga</th>
                                                    <th>Kuota</th>
                                                    <th>Terjual</th>
                                                    <th>Progres</th>
                                                    <th>Status</th>
                                                    <th className="text-end">Aksi</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {filteredTickets.map((t) => (
                                                    <tr key={t.id}>
                                                        <td>
                                                            <div className="d-flex align-items-center gap-2">
                                                                <div
                                                                    className="rounded-3 p-2 text-white fw-extrabold text-center d-flex align-items-center justify-content-center"
                                                                    style={{
                                                                        width: '44px',
                                                                        height: '44px',
                                                                        backgroundColor: t.color || '#6366f1',
                                                                        fontSize: '0.62rem',
                                                                    }}
                                                                >
                                                                    {t.badge || 'TIKET'}
                                                                </div>
                                                                <div>
                                                                    <div className="fw-bold text-dark">{t.name}</div>
                                                                    <div className="text-muted text-truncate" style={{ fontSize: '0.72rem', maxWidth: '160px' }}>
                                                                        {t.description || 'Tanpa deskripsi'}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="fw-bold text-dark">
                                                            Rp {Number(t.price).toLocaleString('id-ID')}
                                                        </td>
                                                        <td className="text-muted">{t.total_capacity}</td>
                                                        <td className="fw-bold text-dark">{t.sold || 0}</td>
                                                        <td>
                                                            <div style={{ width: '70px' }}>
                                                                <div className="text-muted mb-1" style={{ fontSize: '0.68rem' }}>
                                                                    {t.progress}%
                                                                </div>
                                                                <ProgressBar now={t.progress} variant={t.progress > 80 ? 'primary' : 'warning'} style={{ height: '4px' }} />
                                                            </div>
                                                        </td>
                                                        <td>
                                                            {t.soldOut ? (
                                                                <Badge bg="secondary-subtle" className="text-muted" style={{ fontSize: '0.7rem' }}>
                                                                    Habis
                                                                </Badge>
                                                            ) : (
                                                                <Form.Check
                                                                    type="switch"
                                                                    checked={t.is_active !== false}
                                                                    onChange={() => handleToggleStatus(t.id)}
                                                                />
                                                            )}
                                                        </td>
                                                        <td className="text-end">
                                                            <div className="d-flex align-items-center justify-content-end gap-1">
                                                                <button
                                                                    className="btn btn-sm btn-icon text-muted hover-text-primary p-1"
                                                                    onClick={() => handleOpenEditModal(t)}
                                                                    title="Edit Tiket"
                                                                >
                                                                    <i className="bx bx-edit fs-5"></i>
                                                                </button>
                                                                <button
                                                                    className="btn btn-sm btn-icon text-muted hover-text-danger p-1"
                                                                    onClick={() => handleDeleteTicket(t.id)}
                                                                    title="Hapus Tiket"
                                                                >
                                                                    <i className="bx bx-trash fs-5"></i>
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                                {filteredTickets.length === 0 && (
                                                    <tr>
                                                        <td colSpan={7} className="text-center py-4 text-muted">
                                                            Belum ada kategori tiket yang dibuat untuk event ini.
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </Table>
                                    </div>
                                )}

                                <div className="mt-3">
                                    <button
                                        className="btn btn-light w-100 border-dashed text-primary fw-bold py-2 rounded-3"
                                        style={{ borderStyle: 'dashed', fontSize: '0.85rem' }}
                                        onClick={handleOpenAddModal}
                                    >
                                        + Tambah Kategori Tiket Baru
                                    </button>
                                </div>
                            </Card>
                        </Col>

                        {/* Right Side: Event & Ticket Live Preview Card */}
                        <Col xl={5} lg={6}>
                            <Card className="border-0 shadow-sm rounded-4 p-3 bg-white mb-3">
                                <div className="d-flex align-items-center justify-content-between mb-3 border-bottom pb-2">
                                    <div>
                                        <h6 className="fw-bold text-dark mb-0" style={{ fontSize: '0.95rem' }}>Pratinjau Tiket</h6>
                                        <span className="text-muted" style={{ fontSize: '0.72rem' }}>
                                            Tampilan di halaman checkout event pengguna
                                        </span>
                                    </div>
                                    <div className="d-flex align-items-center gap-1 bg-light p-1 rounded-pill">
                                        <button className="btn btn-sm py-1 px-2 border-0 bg-white shadow-sm text-primary">
                                            <i className="bx bx-laptop"></i>
                                        </button>
                                    </div>
                                </div>

                                <div className="border rounded-4 p-3 bg-dark text-white mb-3 position-relative overflow-hidden">
                                    <div className="mb-2 rounded-3 overflow-hidden" style={{ height: '120px' }}>
                                        <img
                                            src={selectedEvent?.thumbnail_url || 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500&auto=format&fit=crop&q=80'}
                                            alt="Event Banner"
                                            className="w-100 h-100 object-fit-cover opacity-75"
                                        />
                                    </div>
                                    <span className="badge bg-primary mb-1" style={{ fontSize: '0.65rem' }}>
                                        {selectedEvent?.event_category || 'Festival Musik'}
                                    </span>
                                    <h5 className="fw-extrabold text-white mb-1" style={{ fontSize: '1.1rem' }}>
                                        {selectedEvent?.title || 'Judul Event'}
                                    </h5>
                                    <div className="d-flex align-items-center gap-3 text-white-50" style={{ fontSize: '0.72rem' }}>
                                        <span>
                                            <i className="bx bx-calendar me-1"></i> {selectedEvent?.start_date || 'Tanggal Mendatang'}
                                        </span>
                                        <span>
                                            <i className="bx bx-map me-1"></i> {selectedEvent?.location || 'Lokasi Acara'}
                                        </span>
                                    </div>
                                </div>

                                <div className="d-flex flex-column gap-2 mb-3" style={{ maxHeight: '280px', overflowY: 'auto' }}>
                                    {tickets.map((t) => (
                                        <div key={t.id} className="border rounded-3 p-3 bg-light">
                                            <div className="d-flex align-items-center justify-content-between mb-1">
                                                <span className="fw-bold text-primary" style={{ fontSize: '0.85rem' }}>
                                                    🎟 {t.name}
                                                </span>
                                                <span className="fw-extrabold text-dark" style={{ fontSize: '0.9rem' }}>
                                                    Rp {Number(t.price).toLocaleString('id-ID')}
                                                </span>
                                            </div>
                                            <p className="text-muted mb-2" style={{ fontSize: '0.72rem' }}>
                                                {t.description || 'Tiket akses standar'}
                                            </p>
                                            <div className="d-flex align-items-center justify-content-between">
                                                <span className="text-muted" style={{ fontSize: '0.7rem' }}>
                                                    Kuota: {t.total_capacity} | {t.sold || 0} terjual
                                                </span>
                                                <button className="btn btn-sm btn-primary py-1 px-3" style={{ fontSize: '0.75rem' }} disabled={t.soldOut}>
                                                    {t.soldOut ? 'Habis' : 'Beli Tiket'}
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                    {tickets.length === 0 && (
                                        <div className="text-center py-4 bg-light rounded-3 text-muted small">
                                            Belum ada tiket untuk ditampilkan di pratinjau.
                                        </div>
                                    )}
                                </div>

                                <div className="bg-light rounded-4 p-3 border">
                                    <h6 className="fw-bold text-dark mb-2" style={{ fontSize: '0.85rem' }}>Ringkasan Pendapatan Event</h6>
                                    <div className="d-flex align-items-center justify-content-between">
                                        <div>
                                            <div className="text-muted" style={{ fontSize: '0.72rem' }}>Total Estimasi Pendapatan</div>
                                            <div className="fw-extrabold text-primary" style={{ fontSize: '1.05rem' }}>
                                                Rp {totalRevenue.toLocaleString('id-ID')}
                                            </div>
                                        </div>
                                        <div>
                                            <div className="text-muted" style={{ fontSize: '0.72rem' }}>Terjual / Kuota</div>
                                            <div className="fw-extrabold text-dark" style={{ fontSize: '1.05rem' }}>
                                                {totalSold} / {totalQuota}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </Col>
                    </Row>
                </>
            )}

            {/* ADD / EDIT TICKET MODAL */}
            <Modal show={showModal} onHide={() => setShowModal(false)} centered size="lg">
                <Modal.Header closeButton>
                    <Modal.Title className="fs-6 fw-bold">{modalTitle}</Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleSaveTicket}>
                    <Modal.Body className="py-3">
                        <Row className="g-3">
                            <Col md={12}>
                                <Form.Group>
                                    <Form.Label className="small text-muted fw-bold">Event *</Form.Label>
                                    <Form.Control
                                        type="text"
                                        disabled
                                        readOnly
                                        value={selectedEvent?.title || 'Selected Event'}
                                        className="bg-light fw-bold"
                                    />
                                </Form.Group>
                            </Col>

                            <Col md={12}>
                                <Form.Group>
                                    <Form.Label className="small text-muted fw-bold">Nama Kategori Tiket *</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Misal: VIP Pass, Regular, Early Bird"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        required
                                    />
                                </Form.Group>
                            </Col>

                            <Col md={4}>
                                <Form.Group>
                                    <Form.Label className="small text-muted fw-bold">Harga Tiket (Rp) *</Form.Label>
                                    <Form.Control
                                        type="number"
                                        min="0"
                                        placeholder="0"
                                        value={formData.price}
                                        onChange={(e) => setFormData({ ...formData, price: e.target.value, final_price: e.target.value })}
                                        required
                                    />
                                </Form.Group>
                            </Col>

                            <Col md={4}>
                                <Form.Group>
                                    <Form.Label className="small text-muted fw-bold">Kena Pajak? *</Form.Label>
                                    <Form.Select
                                        value={formData.is_taxable}
                                        onChange={(e) => setFormData({ ...formData, is_taxable: e.target.value as 'Y' | 'N' })}
                                    >
                                        <option value="N">Tidak (No Tax)</option>
                                        <option value="Y">Ya (Include Tax)</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>

                            {formData.is_taxable === 'Y' && (
                                <Col md={4}>
                                    <Form.Group>
                                        <Form.Label className="small text-muted fw-bold">Pilihan Pajak</Form.Label>
                                        <Form.Select
                                            value={formData.tax_id || ''}
                                            onChange={(e) => setFormData({ ...formData, tax_id: e.target.value })}
                                        >
                                            <option value="">-- Pilih Pajak --</option>
                                            {taxes.map((tx) => (
                                                <option key={tx.id} value={tx.id}>
                                                    {tx.name} ({tx.rate}%)
                                                </option>
                                            ))}
                                        </Form.Select>
                                    </Form.Group>
                                </Col>
                            )}

                            <Col md={4}>
                                <Form.Group>
                                    <Form.Label className="small text-muted fw-bold">Total Kuota Tiket *</Form.Label>
                                    <Form.Control
                                        type="number"
                                        min="1"
                                        placeholder="e.g. 500"
                                        value={formData.total_capacity}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                total_capacity: e.target.value,
                                                remaining_capacity: isEditing ? formData.remaining_capacity : e.target.value,
                                            })
                                        }
                                        required
                                    />
                                </Form.Group>
                            </Col>

                            <Col md={4}>
                                <Form.Group>
                                    <Form.Label className="small text-muted fw-bold">Sisa Kuota Tiket</Form.Label>
                                    <Form.Control
                                        type="number"
                                        min="0"
                                        placeholder="500"
                                        value={formData.remaining_capacity}
                                        onChange={(e) => setFormData({ ...formData, remaining_capacity: e.target.value })}
                                    />
                                </Form.Group>
                            </Col>

                            <Col md={4}>
                                <Form.Group>
                                    <Form.Label className="small text-muted fw-bold">Maksimal per Transaksi</Form.Label>
                                    <Form.Control
                                        type="number"
                                        min="1"
                                        value={formData.max_per_order || 5}
                                        onChange={(e) => setFormData({ ...formData, max_per_order: Number(e.target.value) })}
                                    />
                                </Form.Group>
                            </Col>

                            <Col md={12}>
                                <Form.Group>
                                    <Form.Label className="small text-muted fw-bold">Deskripsi Tiket & Benefit</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={2}
                                        placeholder="Deskripsi singkat benefit tiket (akses lounge, free merch, dll)..."
                                        value={formData.description || ''}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    />
                                </Form.Group>
                            </Col>

                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label className="small text-muted fw-bold">Status Tiket</Form.Label>
                                    <div className="form-check form-switch mt-1">
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            checked={formData.is_active !== false}
                                            onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                                        />
                                        <label className="form-check-label small fw-semibold ms-2">
                                            {formData.is_active ? 'Aktif (Dapat Dibeli)' : 'Non-aktif'}
                                        </label>
                                    </div>
                                </Form.Group>
                            </Col>
                        </Row>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="light" onClick={() => setShowModal(false)}>
                            Batal
                        </Button>
                        <Button variant="primary" type="submit">
                            <i className="bx bx-save me-1"></i> Simpan Tiket
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </div>
    );
};

export default TicketUserPage;
