import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Row, Col, Card, Form, Button, Modal } from 'react-bootstrap';
import Link from 'next/link';
import { useRouter } from 'next/router';
import $ from 'jquery';
import 'select2/dist/js/select2.min.js';
import 'select2/dist/css/select2.min.css';
import swal from 'sweetalert2';
import useBlockUI from '@/pages/_components/useBlockUI';
import { showToast } from '@/utils/toast';
import Select2Component from '@/pages/_components/Select2';
import SingleDateTimePicker from '@/pages/_components/SingleDateTimePicker';
import { Event, InEventForm } from '@/models/Event';
import { EventOrganizer } from '@/models/EventOrganizer';
import { User } from '@/models/User';
import { EventCat } from '@/models/EventCat';
import { RegProvince } from '@/models/RegProvince';
import { MasterTaxe, InMasterTaxe } from '@/models/MasterTaxe';
import { InEventAgendaForm } from '@/models/EventAgenda';
import { InEventTicketForm } from '@/models/EventTicket';

interface AgendaRow extends InEventAgendaForm {
    _isNew?: boolean;
    _isDeleted?: boolean;
    _tempId?: number;
}

interface TicketRow extends InEventTicketForm {
    _isNew?: boolean;
    _isDeleted?: boolean;
    _tempId?: number;
}

interface SponsorLogo {
    id?: number;
    url?: string;
    file?: File;
    _isNew?: boolean;
    _isDeleted?: boolean;
    _tempId?: number;
}

interface AdImage {
    id?: number | null;
    file?: File | null;
    preview_url?: string | null;
    _isNew?: boolean;
    _isDeleted?: boolean;
}

const emptyFormData: InEventForm = {
    id: null,
    is_external: 'N',
    external_url: '',
    events_organizer_id: null,
    user_id_pic: null,
    event_category: '',
    title: '',
    description: '',
    start_date: '',
    end_date: '',
    location_name: '',
    location: '',
    latitude: '',
    longitude: '',
    price_pool: '',
    registration_fee: '',
    thumbnail_url: null,
    events_status: '',
};

const formatTimeRange = (start: string, end: string | null): string => {
    if (start && end) return `${start} - ${end}`;
    return start || '';
};

const formatCurrency = (val: number) => {
    if (!val) return 'FREE';
    return `IDR ${val.toLocaleString('id-ID')}`;
};

const calculateFinalPrice = (price: number, taxId: number | string, taxes: InMasterTaxe[]) => {
    if (!taxId) return price;
    const tax = taxes.find((t) => t.id === Number(taxId));
    if (!tax) return price;
    return price + price * (parseFloat(tax.rate) / 100);
};

interface StepMeta {
    step: number;
    label: string;
    hint: string;
}

const STEPS: StepMeta[] = [
    { step: 1, label: 'Event Info', hint: 'Basic information' },
    { step: 2, label: 'Agenda', hint: 'Optional' },
    { step: 3, label: 'Tickets', hint: 'Ticket & pricing' },
    { step: 4, label: 'Sponsors', hint: 'Optional' },
    { step: 5, label: 'Ad Images', hint: 'Optional' },
];

const CreateEventPage: React.FC = () => {
    const router = useRouter();
    const { blockUI, unblockUI } = useBlockUI();
    const { id } = router.query;
    const eventId = typeof id === 'string' ? parseInt(id, 10) : null;
    const isEditMode = !!eventId;

    const [loading, setLoading] = useState<boolean>(isEditMode);
    const [currentStep, setCurrentStep] = useState<number>(1);
    const [formData, setFormData] = useState<InEventForm>(emptyFormData);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [isSaving, setIsSaving] = useState<boolean>(false);

    const [taxes, setTaxes] = useState<InMasterTaxe[]>([]);

    const [agendaList, setAgendaList] = useState<AgendaRow[]>([]);
    const [showAgendaModal, setShowAgendaModal] = useState(false);
    const [editingAgendaIndex, setEditingAgendaIndex] = useState<number | null>(null);
    const [agendaForm, setAgendaForm] = useState<{ start_time: string; end_time: string; activity_name: string; notes: string }>({
        start_time: '',
        end_time: '',
        activity_name: '',
        notes: '',
    });

    const [ticketList, setTicketList] = useState<TicketRow[]>([]);
    const [showTicketModal, setShowTicketModal] = useState(false);
    const [editingTicketIndex, setEditingTicketIndex] = useState<number | null>(null);
    const [ticketForm, setTicketForm] = useState<{
        name: string;
        description: string;
        price: string;
        is_taxable: 'Y' | 'N';
        tax_id: string;
        total_capacity: string;
        remaining_capacity: string;
        max_per_order: string;
        sales_start_date: string;
        sales_end_date: string;
        is_active: boolean;
    }>({
        name: '',
        description: '',
        price: '',
        is_taxable: 'N',
        tax_id: '',
        total_capacity: '',
        remaining_capacity: '',
        max_per_order: '5',
        sales_start_date: '',
        sales_end_date: '',
        is_active: true,
    });

    const [sponsorList, setSponsorList] = useState<SponsorLogo[]>([]);
    const sponsorFileInputRef = useRef<HTMLInputElement>(null);

    const [adImages, setAdImages] = useState<AdImage[]>([]);
    const adFileInputRef = useRef<HTMLInputElement>(null);

    const nextTempId = useRef<number>(1);

    const EventModel = new Event();
    const EventOrganizerModel = new EventOrganizer();
    const UserModel = new User();
    const EventCatModel = new EventCat();
    const RegProvinceModel = new RegProvince();
    const MasterTaxeModel = new MasterTaxe();

    useEffect(() => {
        MasterTaxeModel.list({ per_page: 1000000000000 }).then((res: any) => setTaxes(res.master_taxes || []));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const loadEvent = useCallback(async (targetId: number) => {
        blockUI();
        try {
            const response: any = await EventModel.list({ filter: `id:${targetId}`, per_page: 1 });
            const data = response.events?.[0];
            if (!data) {
                showToast('Event not found', 'error');
                router.push('/event');
                return;
            }
            setFormData({
                id: data.id,
                is_external: data.is_external ?? 'N',
                external_url: data.external_url ?? '',
                events_organizer_id: data.events_organizer_id,
                user_id_pic: data.user_id_pic,
                event_category: data.event_category ?? '',
                title: data.title ?? '',
                description: data.description ?? '',
                start_date: data.start_date ?? '',
                end_date: data.end_date ?? '',
                location_name: data.location_name ?? '',
                location: data.location ?? '',
                latitude: data.latitude ?? '',
                longitude: data.longitude ?? '',
                price_pool: data.price_pool ?? '',
                registration_fee: data.registration_fee ?? '',
                thumbnail_url: data.thumbnail_url ?? null,
                events_status: data.events_status ?? '',
            });
            setAgendaList(data.events_agendas || []);
            setTicketList(
                (data.events_tickets || []).map((ticket: any) => ({
                    ...ticket,
                    price: Number(ticket.price),
                    final_price: Number(ticket.final_price),
                    total_capacity: Number(ticket.total_capacity),
                    remaining_capacity: Number(ticket.remaining_capacity),
                    max_per_order: Number(ticket.max_per_order),
                    sort_order: Number(ticket.sort_order),
                }))
            );
            setSponsorList(data.events_sponsors || []);
            setAdImages(data.events_ads || []);
        } catch (error) {
            console.error(error);
            showToast('Failed to load event', 'error');
            router.push('/event');
        } finally {
            unblockUI();
            setLoading(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (!router.isReady) return;
        if (eventId) {
            loadEvent(eventId);
        } else {
            setFormData(emptyFormData);
            setAgendaList([]);
            setTicketList([]);
            setSponsorList([]);
            setAdImages([]);
            setLoading(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [router.isReady, eventId]);

    const handleFieldChange = (e: React.ChangeEvent<any>, selectedItem?: any) => {
        const { name, value } = e.target;

        if (name === 'events_organizer_id' && selectedItem) {
            const status = selectedItem.verification_status;
            if (status === 'Pending' || status === 'Rejected') {
                swal.fire(
                    'EO Tidak Aktif',
                    `Status event organizer ini masih ${status}. Silakan pilih coba lagi nanti.`,
                    'warning'
                );
                setTimeout(() => {
                    $(`select[name="${name}"]`).val(null as any).trigger('change.select2');
                }, 10);
                setFormData((prev) => ({ ...prev, [name]: '' }));
                return;
            }
        }

        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const openAddAgendaModal = () => {
        setEditingAgendaIndex(null);
        setAgendaForm({ start_time: '', end_time: '', activity_name: '', notes: '' });
        setShowAgendaModal(true);
    };

    const openEditAgendaModal = (index: number) => {
        const row = agendaList[index];
        setEditingAgendaIndex(index);
        setAgendaForm({
            start_time: row.start_time,
            end_time: row.end_time || '',
            activity_name: row.activity_name,
            notes: row.notes || '',
        });
        setShowAgendaModal(true);
    };

    const saveAgendaModal = () => {
        const start_time = agendaForm.start_time;
        const end_time = agendaForm.end_time || null;
        if (editingAgendaIndex !== null) {
            setAgendaList((prev) =>
                prev.map((row, i) =>
                    i === editingAgendaIndex
                        ? { ...row, start_time, end_time, activity_name: agendaForm.activity_name, notes: agendaForm.notes || null }
                        : row
                )
            );
        } else {
            setAgendaList((prev) => [
                ...prev,
                {
                    events_id: formData.id || 0,
                    start_time,
                    end_time,
                    activity_name: agendaForm.activity_name,
                    notes: agendaForm.notes || null,
                    _isNew: true,
                    _tempId: nextTempId.current++,
                },
            ]);
        }
        setShowAgendaModal(false);
    };

    const removeAgenda = (index: number) => {
        const row = agendaList[index];
        if (row._isNew) {
            setAgendaList((prev) => prev.filter((_, i) => i !== index));
        } else {
            setAgendaList((prev) => prev.map((r, i) => (i === index ? { ...r, _isDeleted: true } : r)));
        }
    };

    const visibleAgendas = agendaList.filter((a) => !a._isDeleted);

    const openAddTicketModal = () => {
        setEditingTicketIndex(null);
        setTicketForm({
            name: '',
            description: '',
            price: '',
            is_taxable: 'N',
            tax_id: '',
            total_capacity: '',
            remaining_capacity: '',
            max_per_order: '5',
            sales_start_date: '',
            sales_end_date: '',
            is_active: true,
        });
        setShowTicketModal(true);
    };

    const openEditTicketModal = (index: number) => {
        const row = ticketList[index];
        setEditingTicketIndex(index);
        setTicketForm({
            name: row.name,
            description: row.description || '',
            price: String(row.price ?? ''),
            is_taxable: row.is_taxable || 'N',
            tax_id: row.tax_id ? String(row.tax_id) : '',
            total_capacity: String(row.total_capacity ?? ''),
            remaining_capacity: String(row.remaining_capacity ?? ''),
            max_per_order: String(row.max_per_order ?? 5),
            sales_start_date: row.sales_start_date || '',
            sales_end_date: row.sales_end_date || '',
            is_active: row.is_active !== false,
        });
        setShowTicketModal(true);
    };

    const saveTicketModal = () => {
        const price = Number(ticketForm.price) || 0;
        const total_capacity = Number(ticketForm.total_capacity) || 0;
        const remaining_capacity = ticketForm.remaining_capacity === '' ? total_capacity : Number(ticketForm.remaining_capacity);
        const final_price = ticketForm.is_taxable === 'Y' ? calculateFinalPrice(price, ticketForm.tax_id, taxes) : price;

        const commonFields = {
            name: ticketForm.name,
            description: ticketForm.description || null,
            price,
            final_price,
            is_taxable: ticketForm.is_taxable,
            tax_id: ticketForm.is_taxable === 'Y' ? ticketForm.tax_id : '',
            total_capacity,
            remaining_capacity,
            max_per_order: Number(ticketForm.max_per_order) || 5,
            sales_start_date: ticketForm.sales_start_date || null,
            sales_end_date: ticketForm.sales_end_date || null,
            is_active: ticketForm.is_active,
        };

        if (editingTicketIndex !== null) {
            setTicketList((prev) =>
                prev.map((row, i) => (i === editingTicketIndex ? { ...row, ...commonFields } : row))
            );
        } else {
            setTicketList((prev) => [
                ...prev,
                {
                    event_id: formData.id || 0,
                    ...commonFields,
                    sort_order: prev.filter((t) => !t._isDeleted).length,
                    _isNew: true,
                    _tempId: nextTempId.current++,
                },
            ]);
        }
        setShowTicketModal(false);
    };

    const removeTicket = (index: number) => {
        const row = ticketList[index];
        if (row._isNew) {
            setTicketList((prev) => prev.filter((_, i) => i !== index));
        } else {
            setTicketList((prev) => prev.map((r, i) => (i === index ? { ...r, _isDeleted: true } : r)));
        }
    };

    const visibleTickets = ticketList.filter((t) => !t._isDeleted);
    const totalTicketTypes = visibleTickets.length;
    const totalCapacity = visibleTickets.reduce((acc, t) => acc + (Number(t.total_capacity) || 0), 0);
    const activeTicketsCount = visibleTickets.filter((t) => t.is_active !== false).length;
    const totalPotentialRevenue = visibleTickets.reduce((acc, t) => acc + (Number(t.price) || 0) * (Number(t.total_capacity) || 0), 0);

    const handleSponsorFilesSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;
        const newLogos: SponsorLogo[] = Array.from(e.target.files).map((file) => ({
            file,
            url: URL.createObjectURL(file),
            _isNew: true,
            _tempId: nextTempId.current++,
        }));
        setSponsorList((prev) => [...prev, ...newLogos]);
        e.target.value = '';
    };

    const removeSponsor = (index: number) => {
        const logo = sponsorList[index];
        if (logo._isNew) {
            if (logo.url) URL.revokeObjectURL(logo.url);
            setSponsorList((prev) => prev.filter((_, i) => i !== index));
        } else {
            setSponsorList((prev) => prev.map((l, i) => (i === index ? { ...l, _isDeleted: true } : l)));
        }
    };

    const visibleSponsors = sponsorList.filter((s) => !s._isDeleted);

    const handleAdFilesSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;
        const newAds: AdImage[] = Array.from(e.target.files).map((file) => ({
            id: null,
            file,
            preview_url: URL.createObjectURL(file),
            _isNew: true,
            _isDeleted: false,
        }));
        setAdImages((prev) => [...prev, ...newAds]);
        e.target.value = '';
    };

    const removeAdImage = (index: number) => {
        setAdImages((prev) => prev.map((a, i) => (i === index ? { ...a, _isDeleted: true } : a)));
    };

    const visibleAds = adImages.filter((a) => !a._isDeleted);

    const handleNextStep = () => {
        if (currentStep < 5) setCurrentStep(currentStep + 1);
    };

    const handleBackStep = () => {
        if (currentStep > 1) setCurrentStep(currentStep - 1);
    };

    const handleSaveAll = async () => {
        setIsSaving(true);
        try {
            const fd = new FormData();
            Object.entries(formData).forEach(([k, v]) => {
                if (v !== null && v !== undefined) {
                    fd.append(k, v as any);
                }
            });

            fd.append('agendas', JSON.stringify(agendaList));
            fd.append('tickets', JSON.stringify(ticketList));

            sponsorList.forEach((sponsor, index) => {
                if (sponsor.file) {
                    fd.append(`sponsor_logos[${index}]`, sponsor.file);
                }
            });
            fd.append(
                'sponsors_info',
                JSON.stringify(sponsorList.map((s) => ({ id: s.id, _isDeleted: s._isDeleted, _isNew: s._isNew })))
            );

            adImages.forEach((ad, index) => {
                if (ad.file && !ad._isDeleted) {
                    fd.append(`ad_images[${index}]`, ad.file);
                }
            });
            fd.append(
                'ads_info',
                JSON.stringify(adImages.map((a) => ({ id: a.id, _isDeleted: a._isDeleted, _isNew: a._isNew })))
            );

            await EventModel.saveAll(fd as any);

            showToast(`Event successfully ${isEditMode ? 'updated' : 'created'}`, 'success');
            router.push('/event');
        } catch (error: any) {
            const lines = (error.message || '').trim().split('\n').filter(Boolean);
            const errorMap: { [key: string]: string } = {};
            lines.forEach((line: string) => {
                const [field, ...message] = line.split(' ');
                errorMap[field] = message.join(' ');
            });
            setErrors(errorMap);
            if (Object.keys(errorMap).length > 0) setCurrentStep(1);
            showToast('Failed to save. Please check the highlighted fields.', 'error');
        } finally {
            setIsSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="py-5 text-center">
                <div className="spinner-border text-primary" role="status"></div>
                <p className="mt-3 text-muted">Loading event...</p>
            </div>
        );
    }

    return (
        <div className="py-2 px-1">
            <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between mb-3 gap-2">
                <div>
                    <div className="d-flex align-items-center gap-2 mb-1">
                        <Link href="/event" className="text-decoration-none text-muted small hover-text-primary d-inline-flex align-items-center gap-1">
                            <i className="bx bx-arrow-back fs-6"></i> Back to Events
                        </Link>
                    </div>
                    <h4 className="fw-extrabold text-dark mb-0" style={{ fontSize: '1.4rem' }}>
                        {isEditMode ? 'Edit Event' : 'Create New Event'}
                    </h4>
                    <p className="text-muted small mb-0 mt-0.5">
                        {STEPS[currentStep - 1].label} &mdash; {STEPS[currentStep - 1].hint}
                    </p>
                </div>
            </div>

            <Card className="border-0 shadow-sm rounded-4 p-3 bg-white mb-4">
                <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
                    {STEPS.map((s, idx) => (
                        <React.Fragment key={s.step}>
                            <div
                                className={`d-flex align-items-center gap-2 cursor-pointer ${currentStep === s.step ? 'text-primary' : 'text-secondary'}`}
                                onClick={() => setCurrentStep(s.step)}
                            >
                                <div
                                    className={`rounded-circle  d-flex align-items-center justify-content-center fw-bold ${currentStep > s.step ? 'bg-success text-white' : currentStep === s.step ? 'bg-primary text-white shadow-sm' : 'bg-light text-muted'}`}
                                    style={{ width: '32px', height: '32px', fontSize: '0.85rem' }}
                                >
                                    {currentStep > s.step ? <i className="bx bx-check fs-5"></i> : s.step}
                                </div>
                                <div>
                                    <div className="fw-bold" style={{ fontSize: '0.88rem' }}>{s.label}</div>
                                    <div className="text-muted" style={{ fontSize: '0.72rem' }}>
                                        {currentStep > s.step ? <span className="text-success fw-semibold">Completed</span> : s.hint}
                                    </div>
                                </div>
                            </div>
                            {idx < STEPS.length - 1 && (
                                <i className="bx bx-chevron-right text-muted opacity-50 d-none d-md-block fs-5"></i>
                            )}
                        </React.Fragment>
                    ))}
                </div>
            </Card>

            {currentStep === 1 && (
                <Row className="g-4">
                    <Col xl={8} lg={7}>
                        <Card className="border-0 shadow-sm rounded-4 p-4 bg-white mb-4">
                            <div className="mb-4 border-bottom pb-3">
                                <h6 className="fw-bold text-dark mb-1" style={{ fontSize: '1.1rem' }}>Event Information</h6>
                                <p className="text-muted small mb-0">Let's start with the basic information about your event.</p>
                            </div>

                            <Form>
                                <h6 className="fw-bold text-primary mb-3" style={{ fontSize: '0.9rem' }}>Basic Details</h6>
                                <Form.Group className="mb-3">
                                    <Form.Label className="fw-semibold small text-dark">Event Title *</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleFieldChange}
                                        placeholder="Enter event title"
                                        className={`py-2 ${errors.title ? 'is-invalid' : ''}`}
                                    />
                                    {!!errors.title && <div className="invalid-feedback d-block">{errors.title}</div>}
                                </Form.Group>

                                <Row className="g-3 mb-3">
                                    <Col md={6}>
                                        <Form.Label className="fw-semibold small text-dark">Category *</Form.Label>
                                        <Select2Component
                                            fetchData={EventCatModel.list}
                                            placeholder="Pilih Kategori"
                                            name="event_category"
                                            onChange={handleFieldChange}
                                            validation={errors.event_category}
                                            selectedId={formData.event_category}
                                            dataKey="events_cat"
                                            showKey="name"
                                            id="name"
                                        />
                                        {!!errors.event_category && <div className="invalid-feedback d-block">{errors.event_category}</div>}
                                    </Col>
                                    <Col md={6}>
                                        <Form.Label className="fw-semibold small text-dark">EO / Organizer *</Form.Label>
                                        <Select2Component
                                            fetchData={EventOrganizerModel.list}
                                            placeholder="Pilih EO"
                                            name="events_organizer_id"
                                            onChange={handleFieldChange}
                                            validation={errors.events_organizer_id}
                                            selectedId={formData.events_organizer_id as number}
                                            dataKey="events_organizer"
                                            showKey="eo_name"
                                            filterKey=""
                                        />
                                        {!!errors.events_organizer_id && <div className="invalid-feedback d-block">{errors.events_organizer_id}</div>}
                                    </Col>
                                </Row>

                                <Row className="g-3 mb-3">
                                    <Col md={4}>
                                        <Form.Label className="fw-semibold small text-dark">PIC (Person in Charge) *</Form.Label>
                                        <Select2Component
                                            fetchData={UserModel.lists}
                                            placeholder="Pilih PIC"
                                            name="user_id_pic"
                                            onChange={handleFieldChange}
                                            validation={errors.user_id_pic}
                                            selectedId={formData.user_id_pic as number}
                                            dataKey="users"
                                            showKey="name"
                                            filterKey={`eo_id:${formData.events_organizer_id}`}
                                            id="id"
                                            disabled={!formData.events_organizer_id}
                                        />
                                        {!!errors.user_id_pic && <div className="invalid-feedback d-block">{errors.user_id_pic}</div>}
                                    </Col>
                                    <Col md={4}>
                                        <Form.Label className="fw-semibold small text-dark">Start Date *</Form.Label>
                                        <Form.Control type="date" name="start_date" value={formData.start_date} onChange={handleFieldChange} className={`py-2 ${errors.start_date ? 'is-invalid' : ''}`} />
                                        {!!errors.start_date && <div className="invalid-feedback d-block">{errors.start_date}</div>}
                                    </Col>
                                    <Col md={4}>
                                        <Form.Label className="fw-semibold small text-dark">End Date *</Form.Label>
                                        <Form.Control type="date" name="end_date" value={formData.end_date} onChange={handleFieldChange} className={`py-2 ${errors.end_date ? 'is-invalid' : ''}`} />
                                        {!!errors.end_date && <div className="invalid-feedback d-block">{errors.end_date}</div>}
                                    </Col>
                                </Row>

                                <hr className="my-4" />

                                <h6 className="fw-bold text-primary mb-3" style={{ fontSize: '0.9rem' }}>Location</h6>
                                <Form.Group className="mb-3">
                                    <Form.Label className="fw-semibold small text-dark">Location Name *</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="location_name"
                                        value={formData.location_name}
                                        onChange={handleFieldChange}
                                        placeholder="Enter location name"
                                        className={`py-2 ${errors.location_name ? 'is-invalid' : ''}`}
                                    />
                                    {!!errors.location_name && <div className="invalid-feedback d-block">{errors.location_name}</div>}
                                </Form.Group>

                                <Row className="g-3 mb-3">
                                    <Col md={4}>
                                        <Form.Label className="fw-semibold small text-dark">Province *</Form.Label>
                                        <Select2Component
                                            fetchData={RegProvinceModel.list}
                                            placeholder="Pilih Provinsi"
                                            name="location"
                                            onChange={handleFieldChange}
                                            validation={errors.location}
                                            selectedId={formData.location}
                                            dataKey="reg_provinces"
                                            showKey="name"
                                            id="name"
                                        />
                                        {!!errors.location && <div className="invalid-feedback d-block">{errors.location}</div>}
                                    </Col>
                                    <Col md={4}>
                                        <Form.Label className="fw-semibold small text-dark">Latitude (Optional)</Form.Label>
                                        <Form.Control type="text" name="latitude" value={formData.latitude} onChange={handleFieldChange} className="py-2" />
                                    </Col>
                                    <Col md={4}>
                                        <Form.Label className="fw-semibold small text-dark">Longitude (Optional)</Form.Label>
                                        <Form.Control type="text" name="longitude" value={formData.longitude} onChange={handleFieldChange} className="py-2" />
                                    </Col>
                                </Row>
                            </Form>
                        </Card>
                    </Col>

                    <Col xl={4} lg={5}>
                        <Card className="border-0 shadow-sm rounded-4 p-3 bg-white mb-4">
                            <div className="d-flex align-items-center gap-2 mb-3 pb-2 border-bottom">
                                <i className="bx bx-show fs-5 text-primary"></i>
                                <h6 className="fw-bold text-dark mb-0" style={{ fontSize: '0.95rem' }}>Event Preview</h6>
                            </div>
                            <div className="border rounded-4 p-4 text-center bg-light-subtle mb-3 d-flex flex-column align-items-center justify-content-center" style={{ minHeight: '180px', borderStyle: 'dashed' }}>
                                <div className="rounded-circle bg-primary-subtle text-primary p-3 mb-2">
                                    <i className="bx bx-image fs-2"></i>
                                </div>
                                <div className="fw-bold text-dark mb-1" style={{ fontSize: '0.85rem' }}>No image selected</div>
                                <div className="text-muted small mb-1">Upload banner in Step 5</div>
                                <span className="badge bg-light text-muted border">Recommended size 1200x628px</span>
                            </div>
                            <div className="d-flex flex-column gap-2 text-muted" style={{ fontSize: '0.82rem' }}>
                                <div className="d-flex align-items-center gap-2 py-1 border-bottom">
                                    <i className="bx bx-calendar text-primary fs-5"></i>
                                    <div>
                                        <span className="text-muted">Start Date:</span> <strong className="text-dark ms-1">{formData.start_date || '-'}</strong>
                                    </div>
                                </div>
                                <div className="d-flex align-items-center gap-2 py-1 border-bottom">
                                    <i className="bx bx-map text-primary fs-5"></i>
                                    <div>
                                        <span className="text-muted">Location:</span> <strong className="text-dark ms-1">{formData.location_name || '-'}</strong>
                                    </div>
                                </div>
                                <div className="d-flex align-items-center gap-2 py-1">
                                    <i className="bx bx-tag text-primary fs-5"></i>
                                    <div>
                                        <span className="text-muted">Category:</span> <strong className="text-dark ms-1">{formData.event_category || '-'}</strong>
                                    </div>
                                </div>
                            </div>
                        </Card>

                        <Card className="border-0 shadow-sm rounded-4 p-3 bg-primary-subtle text-primary border-primary">
                            <div className="d-flex align-items-center gap-2 mb-2">
                                <i className="bx bx-bulb fs-5"></i>
                                <h6 className="fw-bold mb-0" style={{ fontSize: '0.9rem' }}>Tips for a great event</h6>
                            </div>
                            <ul className="list-unstyled mb-0 d-flex flex-column gap-1.5" style={{ fontSize: '0.78rem' }}>
                                <li className="d-flex align-items-center gap-2"><i className="bx bx-check-circle text-primary fs-6"></i> Use a clear and engaging title</li>
                                <li className="d-flex align-items-center gap-2"><i className="bx bx-check-circle text-primary fs-6"></i> Choose the right category</li>
                                <li className="d-flex align-items-center gap-2"><i className="bx bx-check-circle text-primary fs-6"></i> Add a compelling description</li>
                                <li className="d-flex align-items-center gap-2"><i className="bx bx-check-circle text-primary fs-6"></i> Upload an attractive banner</li>
                            </ul>
                        </Card>
                    </Col>
                </Row>
            )}

            {currentStep === 2 && (
                <Row className="g-4">
                    <Col xl={8} lg={7}>
                        <Card className="border-0 shadow-sm rounded-4 p-4 bg-white mb-4">
                            <div className="d-flex align-items-center justify-content-between border-bottom pb-3 mb-4">
                                <div>
                                    <div className="d-flex align-items-center gap-2">
                                        <i className="bx bx-calendar-event text-primary fs-5"></i>
                                        <h6 className="fw-bold text-dark mb-0" style={{ fontSize: '1.1rem' }}>Event Agenda</h6>
                                    </div>
                                    <p className="text-muted small mb-0 mt-0.5">Add all activities, sessions, and key moments in your event.</p>
                                </div>
                                <Button variant="primary" size="sm" className="rounded-3 d-flex align-items-center gap-1" onClick={openAddAgendaModal}>
                                    <i className="bx bx-plus"></i> Add Agenda Item
                                </Button>
                            </div>

                            <div className="d-flex flex-column gap-3 mb-4">
                                {visibleAgendas.map((item) => {
                                    const actualIndex = agendaList.indexOf(item);
                                    return (
                                        <div key={item.id || item._tempId} className="border rounded-4 p-3 bg-white shadow-sm hover-shadow transition-all d-flex align-items-start justify-content-between gap-3">
                                            <div className="d-flex align-items-start gap-3">
                                                <div className="text-muted pt-1">
                                                    <i className="bx bx-dots-vertical-rounded fs-4"></i>
                                                </div>
                                                <div>
                                                    <div className="d-flex align-items-center gap-2 mb-1">
                                                        <span className="fw-bold text-primary" style={{ fontSize: '0.85rem' }}>{formatTimeRange(item.start_time, item.end_time ?? null)}</span>
                                                    </div>
                                                    <h6 className="fw-bold text-dark mb-1" style={{ fontSize: '0.95rem' }}>{item.activity_name}</h6>
                                                    {!!item.notes && (
                                                        <p className="text-muted small mb-0" style={{ fontSize: '0.8rem', lineHeight: '1.4' }}>{item.notes}</p>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="d-flex align-items-center gap-1">
                                                <button className="btn btn-sm btn-icon text-muted hover-text-primary p-1" onClick={() => openEditAgendaModal(actualIndex)}>
                                                    <i className="bx bx-pencil fs-5"></i>
                                                </button>
                                                <button className="btn btn-sm btn-icon text-danger hover-bg-danger-subtle p-1" onClick={() => removeAgenda(actualIndex)}>
                                                    <i className="bx bx-trash fs-5"></i>
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            <Button
                                variant="outline-primary"
                                className="w-100 py-2.5 rounded-4 d-flex align-items-center justify-content-center gap-2 border-dashed"
                                style={{ borderStyle: 'dashed' }}
                                onClick={openAddAgendaModal}
                            >
                                <i className="bx bx-plus fs-5"></i> Add Agenda Item
                            </Button>
                        </Card>
                    </Col>

                    <Col xl={4} lg={5}>
                        <Card className="border-0 shadow-sm rounded-4 p-3 bg-white mb-4">
                            <div className="d-flex align-items-center justify-content-between pb-2 mb-3 border-bottom">
                                <div className="d-flex align-items-center gap-2">
                                    <i className="bx bx-show fs-5 text-primary"></i>
                                    <h6 className="fw-bold text-dark mb-0" style={{ fontSize: '0.95rem' }}>Schedule Preview</h6>
                                </div>
                            </div>
                            <div className="text-muted small mb-3">{visibleAgendas.length} items</div>

                            <div className="timeline-wrapper position-relative ps-3">
                                <div className="position-absolute top-0 bottom-0 start-0 border-start border-2 border-primary" style={{ left: '8px' }}></div>
                                <div className="d-flex flex-column gap-3">
                                    {visibleAgendas.map((item) => (
                                        <div key={item.id || item._tempId} className="position-relative ps-3">
                                            <div className="position-absolute top-0 start-0 translate-middle-x rounded-circle bg-primary" style={{ width: '10px', height: '10px', left: '-1px', marginTop: '5px' }}></div>
                                            <div className="fw-bold text-dark" style={{ fontSize: '0.78rem' }}>{formatTimeRange(item.start_time, item.end_time ?? null)}</div>
                                            <div className="fw-bold text-dark" style={{ fontSize: '0.85rem' }}>{item.activity_name}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </Card>

                        <Card className="border-0 shadow-sm rounded-4 p-3 bg-primary-subtle text-primary border-primary">
                            <div className="d-flex align-items-center gap-2 mb-2">
                                <i className="bx bx-bulb fs-5"></i>
                                <h6 className="fw-bold mb-0" style={{ fontSize: '0.9rem' }}>Tips for Great Agenda</h6>
                            </div>
                            <ul className="list-unstyled mb-0 d-flex flex-column gap-1.5" style={{ fontSize: '0.78rem' }}>
                                <li className="d-flex align-items-center gap-2"><i className="bx bx-check-circle text-primary fs-6"></i> Start with an engaging opening</li>
                                <li className="d-flex align-items-center gap-2"><i className="bx bx-check-circle text-primary fs-6"></i> Keep sessions 45-90 minutes</li>
                                <li className="d-flex align-items-center gap-2"><i className="bx bx-check-circle text-primary fs-6"></i> Add breaks between sessions</li>
                                <li className="d-flex align-items-center gap-2"><i className="bx bx-check-circle text-primary fs-6"></i> End with a memorable closing</li>
                            </ul>
                        </Card>
                    </Col>
                </Row>
            )}

            {currentStep === 3 && (
                <Row className="g-4">
                    <Col xl={8} lg={7}>
                        <div className="border rounded-4 p-3 bg-primary-subtle border-primary text-primary d-flex align-items-center gap-3 mb-4">
                            <div className="rounded-circle bg-white p-2 text-primary shadow-sm flex-shrink-0">
                                <i className="bx bx-purchase-tag-alt fs-3"></i>
                            </div>
                            <div>
                                <h6 className="fw-bold mb-0" style={{ fontSize: '0.92rem' }}>Tickets are required</h6>
                                <p className="mb-0 text-muted" style={{ fontSize: '0.78rem' }}>
                                    Every event must have at least one ticket type, even if it's free. You can create multiple ticket categories.
                                </p>
                            </div>
                        </div>

                        <Card className="border-0 shadow-sm rounded-4 p-4 bg-white mb-4">
                            <div className="d-flex align-items-center justify-content-between border-bottom pb-3 mb-4">
                                <div>
                                    <h6 className="fw-bold text-dark mb-0" style={{ fontSize: '1.1rem' }}>Ticket Types</h6>
                                    <p className="text-muted small mb-0 mt-0.5">Create ticket categories for your event</p>
                                </div>
                                <Button variant="outline-primary" size="sm" className="rounded-3 d-flex align-items-center gap-1" onClick={openAddTicketModal}>
                                    <i className="bx bx-plus"></i> Add Ticket Type
                                </Button>
                            </div>

                            <div className="d-flex flex-column gap-3 mb-4">
                                {visibleTickets.map((ticket) => {
                                    const actualIndex = ticketList.indexOf(ticket);
                                    return (
                                        <div key={ticket.id || ticket._tempId} className="border rounded-4 p-3 bg-white shadow-sm">
                                            <div className="d-flex align-items-center justify-content-between mb-2">
                                                <div className="d-flex align-items-center gap-2">
                                                    <i className="bx bx-dots-vertical-rounded text-muted fs-4"></i>
                                                    <div className="rounded-circle bg-primary-subtle text-primary p-1.5">
                                                        <i className="bx bx-star fs-6"></i>
                                                    </div>
                                                    <span className="fw-bold text-dark" style={{ fontSize: '1rem' }}>{ticket.name}</span>
                                                    <span className={`badge px-2 py-0.5 ${ticket.is_active !== false ? 'bg-success-subtle text-success' : 'bg-secondary-subtle text-secondary'}`} style={{ fontSize: '0.68rem' }}>
                                                        {ticket.is_active !== false ? 'Active' : 'Inactive'}
                                                    </span>
                                                    {ticket.is_taxable === 'Y' && (
                                                        <span className="badge bg-info-subtle text-info px-2 py-0.5" style={{ fontSize: '0.68rem' }}>Taxable</span>
                                                    )}
                                                </div>
                                                <div className="d-flex align-items-center gap-1">
                                                    <button className="btn btn-sm btn-icon text-muted p-1 hover-text-primary" onClick={() => openEditTicketModal(actualIndex)}><i className="bx bx-pencil fs-5"></i></button>
                                                    <button className="btn btn-sm btn-icon text-danger p-1 hover-bg-danger-subtle" onClick={() => removeTicket(actualIndex)}><i className="bx bx-trash fs-5"></i></button>
                                                </div>
                                            </div>

                                            <div className="d-flex align-items-center justify-content-between text-muted" style={{ fontSize: '0.82rem' }}>
                                                <div>{ticket.description}</div>
                                                <div className="d-flex align-items-center gap-3">
                                                    <span className="fw-bold text-dark">{formatCurrency(Number(ticket.final_price))}</span>
                                                    <span className="badge bg-light text-muted border">{ticket.remaining_capacity}/{ticket.total_capacity} available</span>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            <Button
                                variant="outline-primary"
                                className="w-100 py-2.5 rounded-4 d-flex align-items-center justify-content-center gap-2 border-dashed"
                                style={{ borderStyle: 'dashed' }}
                                onClick={openAddTicketModal}
                            >
                                <i className="bx bx-plus fs-5"></i> Add Another Ticket Type
                            </Button>
                        </Card>
                    </Col>

                    <Col xl={4} lg={5}>
                        <Card className="border-0 shadow-sm rounded-4 p-3 bg-white mb-4">
                            <div className="d-flex align-items-center justify-content-between pb-2 mb-3 border-bottom">
                                <div className="d-flex align-items-center gap-2">
                                    <i className="bx bx-show fs-5 text-primary"></i>
                                    <h6 className="fw-bold text-dark mb-0" style={{ fontSize: '0.95rem' }}>Ticket Preview</h6>
                                </div>
                                <span className="text-muted" style={{ fontSize: '0.75rem' }}>{visibleTickets.length} ticket types</span>
                            </div>

                            <div className="d-flex flex-column gap-2 mb-3">
                                {visibleTickets.map((t) => (
                                    <div key={t.id || t._tempId} className="border rounded-3 p-3 bg-white shadow-sm d-flex align-items-center justify-content-between">
                                        <div>
                                            <div className="d-flex align-items-center gap-2">
                                                <i className="bx bx-star text-primary"></i>
                                                <span className="fw-bold text-dark" style={{ fontSize: '0.88rem' }}>{t.name}</span>
                                            </div>
                                            <div className="text-muted mt-1" style={{ fontSize: '0.72rem' }}>
                                                {t.total_capacity} available
                                            </div>
                                        </div>
                                        <div className="fw-extrabold text-primary" style={{ fontSize: '0.9rem' }}>
                                            {formatCurrency(Number(t.price))}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="border rounded-3 p-3 bg-light-subtle">
                                <h6 className="fw-bold text-dark mb-2" style={{ fontSize: '0.88rem' }}>Summary</h6>
                                <div className="d-flex justify-content-between py-1 border-bottom" style={{ fontSize: '0.78rem' }}>
                                    <span className="text-muted">Total Ticket Types</span>
                                    <span className="fw-bold text-dark">{totalTicketTypes}</span>
                                </div>
                                <div className="d-flex justify-content-between py-1 border-bottom" style={{ fontSize: '0.78rem' }}>
                                    <span className="text-muted">Total Capacity</span>
                                    <span className="fw-bold text-dark">{totalCapacity.toLocaleString('id-ID')}</span>
                                </div>
                                <div className="d-flex justify-content-between py-1 border-bottom" style={{ fontSize: '0.78rem' }}>
                                    <span className="text-muted">Active Tickets</span>
                                    <span className="fw-bold text-dark">{activeTicketsCount}</span>
                                </div>
                                <div className="d-flex justify-content-between py-1.5" style={{ fontSize: '0.82rem' }}>
                                    <span className="fw-bold text-dark">Total Potential Revenue</span>
                                    <span className="fw-extrabold text-primary">IDR {totalPotentialRevenue.toLocaleString('id-ID')}</span>
                                </div>
                            </div>
                        </Card>

                        <Card className="border-0 shadow-sm rounded-4 p-3 bg-primary-subtle text-primary border-primary">
                            <div className="d-flex align-items-center gap-2 mb-2">
                                <i className="bx bx-bulb fs-5"></i>
                                <h6 className="fw-bold mb-0" style={{ fontSize: '0.9rem' }}>Tips</h6>
                            </div>
                            <ul className="list-unstyled mb-0 d-flex flex-column gap-1.5" style={{ fontSize: '0.78rem' }}>
                                <li className="d-flex align-items-center gap-2"><i className="bx bx-check-circle text-primary fs-6"></i> You can set free ticket price to 0</li>
                                <li className="d-flex align-items-center gap-2"><i className="bx bx-check-circle text-primary fs-6"></i> Use clear names and descriptions</li>
                                <li className="d-flex align-items-center gap-2"><i className="bx bx-check-circle text-primary fs-6"></i> Set limited capacity to create urgency</li>
                                <li className="d-flex align-items-center gap-2"><i className="bx bx-check-circle text-primary fs-6"></i> Differentiate prices based on benefits</li>
                            </ul>
                        </Card>
                    </Col>
                </Row>
            )}

            {currentStep === 4 && (
                <Row className="g-4">
                    <Col xl={8} lg={7}>
                        <div className="border rounded-4 p-3 bg-warning-subtle border-warning text-warning-emphasis d-flex align-items-center justify-content-between mb-4">
                            <div className="d-flex align-items-center gap-3">
                                <div className="rounded-circle bg-white p-2 text-warning shadow-sm flex-shrink-0">
                                    <i className="bx bx-star fs-3"></i>
                                </div>
                                <div>
                                    <h6 className="fw-bold mb-0 text-dark" style={{ fontSize: '0.92rem' }}>Sponsors are optional</h6>
                                    <p className="mb-0 text-muted" style={{ fontSize: '0.78rem' }}>
                                        Add sponsors and partners who support your event. You can update this information anytime later.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <Card className="border-0 shadow-sm rounded-4 p-4 bg-white mb-4">
                            <div className="d-flex align-items-center justify-content-between border-bottom pb-3 mb-3">
                                <div>
                                    <h6 className="fw-bold text-dark mb-0" style={{ fontSize: '1.1rem' }}>Sponsors & Partners</h6>
                                    <p className="text-muted small mb-0 mt-0.5">Upload sponsor logos for your event</p>
                                </div>
                                <Button variant="outline-primary" size="sm" className="rounded-3 d-flex align-items-center gap-1" onClick={() => sponsorFileInputRef.current?.click()}>
                                    <i className="bx bx-plus"></i> Add Sponsor
                                </Button>
                            </div>

                            <input
                                ref={sponsorFileInputRef}
                                type="file"
                                multiple
                                accept="image/*"
                                className="d-none"
                                onChange={handleSponsorFilesSelected}
                            />

                            <Row className="g-3 mb-4">
                                {visibleSponsors.map((sponsor) => {
                                    const actualIndex = sponsorList.indexOf(sponsor);
                                    return (
                                        <Col xs={6} md={4} lg={3} key={sponsor.id || sponsor._tempId}>
                                            <div className="border rounded-4 p-3 bg-white shadow-sm h-100 position-relative">
                                                <div className="ratio ratio-1x1 bg-light-subtle rounded-3 d-flex align-items-center justify-content-center overflow-hidden mb-2">
                                                    <img src={sponsor.url} alt="Sponsor logo" className="img-fluid object-fit-contain p-2" />
                                                </div>
                                                <button
                                                    className="btn btn-sm btn-icon text-danger position-absolute top-0 end-0 m-2 bg-white rounded-circle shadow-sm"
                                                    onClick={() => removeSponsor(actualIndex)}
                                                    title="Remove"
                                                >
                                                    <i className="bx bx-trash fs-6"></i>
                                                </button>
                                            </div>
                                        </Col>
                                    );
                                })}
                            </Row>

                            {visibleSponsors.length === 0 && (
                                <div className="text-center py-4 bg-light-subtle rounded-4 border" style={{ borderStyle: 'dashed' }}>
                                    <i className="bx bx-images text-muted mb-2" style={{ fontSize: '2rem' }}></i>
                                    <p className="text-muted mb-0">No sponsor logos uploaded yet</p>
                                </div>
                            )}

                            <Button
                                variant="outline-primary"
                                className="w-100 py-2.5 rounded-4 d-flex align-items-center justify-content-center gap-2 border-dashed mt-3"
                                style={{ borderStyle: 'dashed' }}
                                onClick={() => sponsorFileInputRef.current?.click()}
                            >
                                <i className="bx bx-plus fs-5"></i> Add Another Sponsor
                            </Button>
                        </Card>
                    </Col>

                    <Col xl={4} lg={5}>
                        <Card className="border-0 shadow-sm rounded-4 p-3 bg-white mb-4">
                            <div className="d-flex align-items-center justify-content-between pb-2 mb-3 border-bottom">
                                <div className="d-flex align-items-center gap-2">
                                    <i className="bx bx-show fs-5 text-primary"></i>
                                    <h6 className="fw-bold text-dark mb-0" style={{ fontSize: '0.95rem' }}>Sponsor Preview</h6>
                                </div>
                            </div>
                            <p className="text-muted small mb-3">This is how sponsors will appear on your event page</p>

                            {visibleSponsors.length === 0 ? (
                                <div className="text-muted small text-center py-3">No sponsors added yet</div>
                            ) : (
                                <Row className="g-2">
                                    {visibleSponsors.map((sponsor) => (
                                        <Col xs={4} key={sponsor.id || sponsor._tempId}>
                                            <div className="ratio ratio-1x1 bg-light-subtle rounded-3 d-flex align-items-center justify-content-center overflow-hidden">
                                                <img src={sponsor.url} alt="Sponsor logo" className="img-fluid object-fit-contain p-1" />
                                            </div>
                                        </Col>
                                    ))}
                                </Row>
                            )}
                        </Card>

                        <Card className="border-0 shadow-sm rounded-4 p-3 bg-primary-subtle text-primary border-primary">
                            <div className="d-flex align-items-center gap-2 mb-2">
                                <i className="bx bx-bulb fs-5"></i>
                                <h6 className="fw-bold mb-0" style={{ fontSize: '0.9rem' }}>Tips</h6>
                            </div>
                            <ul className="list-unstyled mb-0 d-flex flex-column gap-1.5" style={{ fontSize: '0.78rem' }}>
                                <li className="d-flex align-items-center gap-2"><i className="bx bx-check-circle text-primary fs-6"></i> Use high resolution logos (PNG/SVG recommended)</li>
                                <li className="d-flex align-items-center gap-2"><i className="bx bx-check-circle text-primary fs-6"></i> Sponsors will be displayed on your event page</li>
                                <li className="d-flex align-items-center gap-2"><i className="bx bx-check-circle text-primary fs-6"></i> You can select multiple logo files at once</li>
                            </ul>
                        </Card>
                    </Col>
                </Row>
            )}

            {currentStep === 5 && (
                <Row className="g-4">
                    <Col xl={8} lg={7}>
                        <div className="border rounded-4 p-3 bg-purple-subtle border-purple text-purple d-flex align-items-center justify-content-between mb-4" style={{ backgroundColor: 'rgba(147, 51, 234, 0.1)', color: '#9333ea' }}>
                            <div className="d-flex align-items-center gap-3">
                                <div className="rounded-circle bg-white p-2 text-purple shadow-sm flex-shrink-0" style={{ color: '#9333ea' }}>
                                    <i className="bx bx-image-alt fs-3"></i>
                                </div>
                                <div>
                                    <h6 className="fw-bold mb-0 text-dark" style={{ fontSize: '0.92rem' }}>Ad Images are optional</h6>
                                    <p className="mb-0 text-muted" style={{ fontSize: '0.78rem' }}>
                                        Add banners and media to make your event more attractive. You can upload now or edit later.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <Card className="border-0 shadow-sm rounded-4 p-4 bg-white mb-4">
                            <div className="d-flex align-items-center justify-content-between border-bottom pb-3 mb-3">
                                <div>
                                    <h6 className="fw-bold text-dark mb-0" style={{ fontSize: '1.1rem' }}>Upload Ad Images</h6>
                                    <p className="text-muted small mb-0 mt-0.5">Recommended format: JPG, PNG or WebP. Max file size 5MB.</p>
                                </div>
                                <Button variant="outline-primary" size="sm" className="rounded-3 d-flex align-items-center gap-1" onClick={() => adFileInputRef.current?.click()}>
                                    <i className="bx bx-upload"></i> Upload Image
                                </Button>
                            </div>

                            <input
                                ref={adFileInputRef}
                                type="file"
                                multiple
                                accept="image/*"
                                className="d-none"
                                onChange={handleAdFilesSelected}
                            />

                            <div
                                className="border rounded-4 p-4 text-center bg-light-subtle mb-4 cursor-pointer hover-bg-light transition-all"
                                style={{ borderStyle: 'dashed', borderWidth: '2px' }}
                                onClick={() => adFileInputRef.current?.click()}
                            >
                                <div className="rounded-circle bg-primary-subtle text-primary p-3 d-inline-flex mb-2">
                                    <i className="bx bx-cloud-upload fs-1"></i>
                                </div>
                                <h6 className="fw-bold text-dark mb-1" style={{ fontSize: '0.95rem' }}>Click to upload your files</h6>
                                <p className="text-muted small mb-3">or use the Upload Image button above</p>
                                <span className="badge bg-light text-muted border px-2.5 py-1">Max size 5MB per file • JPG, PNG, WEBP</span>
                            </div>

                            <div className="d-flex align-items-center gap-2 mb-4 flex-wrap" style={{ fontSize: '0.78rem' }}>
                                <span className="text-muted">Recommended sizes:</span>
                                <span className="badge bg-light text-secondary border px-2 py-1">Hero Banner 1920x1080px</span>
                                <span className="badge bg-light text-secondary border px-2 py-1">Square Banner 1080x1080px</span>
                                <span className="badge bg-light text-secondary border px-2 py-1">Rectangle 1200x628px</span>
                            </div>

                            <div className="d-flex align-items-center justify-content-between mb-3 border-top pt-3">
                                <h6 className="fw-bold text-dark mb-0" style={{ fontSize: '0.95rem' }}>Uploaded Images ({visibleAds.length})</h6>
                            </div>

                            <Row className="g-3 mb-4">
                                {visibleAds.map((img) => {
                                    const actualIndex = adImages.indexOf(img);
                                    return (
                                        <Col md={6} key={img.id || actualIndex}>
                                            <div className="border rounded-4 p-3 bg-white shadow-sm h-100 d-flex flex-column justify-content-between">
                                                <div>
                                                    <div className="position-relative rounded-3 overflow-hidden mb-2" style={{ height: '120px' }}>
                                                        {img.preview_url ? (
                                                            <img src={img.preview_url} alt={img.file?.name || 'Ad image'} className="w-100 h-100 object-fit-cover" />
                                                        ) : (
                                                            <div className="w-100 h-100 bg-light d-flex align-items-center justify-content-center">
                                                                <i className="bx bx-image text-muted fs-1"></i>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="fw-bold text-dark mb-0.5 text-truncate" style={{ fontSize: '0.85rem' }}>
                                                        {img.file?.name || `Image #${img.id}`}
                                                    </div>
                                                </div>

                                                <div className="d-flex align-items-center justify-content-end border-top pt-2 mt-2">
                                                    <button className="btn btn-sm btn-icon text-danger p-1 hover-bg-danger-subtle" onClick={() => removeAdImage(actualIndex)}><i className="bx bx-trash fs-5"></i></button>
                                                </div>
                                            </div>
                                        </Col>
                                    );
                                })}
                            </Row>

                            {visibleAds.length === 0 && (
                                <div className="text-center py-4 bg-light-subtle rounded-4 border" style={{ borderStyle: 'dashed' }}>
                                    <i className="bx bx-image text-muted mb-2" style={{ fontSize: '2rem' }}></i>
                                    <p className="text-muted mb-0">No ad images uploaded yet</p>
                                </div>
                            )}

                            <div className="border rounded-3 p-3 bg-light-subtle d-flex align-items-center justify-content-between text-muted" style={{ fontSize: '0.78rem' }}>
                                <div className="d-flex align-items-center gap-2">
                                    <i className="bx bx-bulb text-warning fs-5"></i>
                                    <span>Tips: Use high quality images with clear text and good contrast for the best result across all devices.</span>
                                </div>
                            </div>
                        </Card>
                    </Col>

                    <Col xl={4} lg={5}>
                        <Card className="border-0 shadow-sm rounded-4 p-3 bg-white mb-4">
                            <div className="d-flex align-items-center justify-content-between pb-2 mb-3 border-bottom">
                                <div className="d-flex align-items-center gap-2">
                                    <i className="bx bx-show fs-5 text-primary"></i>
                                    <h6 className="fw-bold text-dark mb-0" style={{ fontSize: '0.95rem' }}>Preview on Event Page</h6>
                                </div>
                            </div>

                            <div className="border shadow-sm rounded-4 overflow-hidden bg-dark text-white mb-3">
                                <div className="position-relative" style={{ height: '140px' }}>
                                    {visibleAds[0]?.preview_url ? (
                                        <img src={visibleAds[0].preview_url} alt="Header Preview" className="w-100 h-100 object-fit-cover opacity-75" />
                                    ) : (
                                        <div className="w-100 h-100 bg-secondary d-flex align-items-center justify-content-center">
                                            <i className="bx bx-image text-white fs-1"></i>
                                        </div>
                                    )}
                                    <div className="position-absolute top-0 start-0 end-0 p-3 bg-gradient-to-b text-white">
                                        <h6 className="fw-extrabold text-white mb-0" style={{ letterSpacing: '1px' }}>{formData.title || 'YOUR EVENT'}</h6>
                                    </div>
                                </div>
                            </div>
                        </Card>

                        <Card className="border-0 shadow-sm rounded-4 p-3 bg-primary-subtle text-primary border-primary">
                            <div className="d-flex align-items-center gap-2 mb-2">
                                <i className="bx bx-bulb fs-5"></i>
                                <h6 className="fw-bold mb-0" style={{ fontSize: '0.9rem' }}>Guidelines</h6>
                            </div>
                            <ul className="list-unstyled mb-0 d-flex flex-column gap-1.5" style={{ fontSize: '0.78rem' }}>
                                <li className="d-flex align-items-center gap-2"><i className="bx bx-check-circle text-primary fs-6"></i> Use high resolution images</li>
                                <li className="d-flex align-items-center gap-2"><i className="bx bx-check-circle text-primary fs-6"></i> Keep important text in the center</li>
                                <li className="d-flex align-items-center gap-2"><i className="bx bx-check-circle text-primary fs-6"></i> Avoid too much text on banners</li>
                                <li className="d-flex align-items-center gap-2"><i className="bx bx-check-circle text-primary fs-6"></i> Use consistent colors with your theme</li>
                            </ul>
                        </Card>
                    </Col>
                </Row>
            )}

            <Card className="border-0 shadow-sm rounded-4 p-3 bg-white mt-4">
                <div className="d-flex align-items-center justify-content-between">
                    <Link href="/event" className="btn btn-light border rounded-pill px-4">
                        Cancel
                    </Link>

                    <div className="d-flex align-items-center gap-2">
                        {currentStep > 1 && (
                            <Button variant="outline-secondary" className="rounded-pill px-4 d-flex align-items-center gap-1" onClick={handleBackStep}>
                                <i className="bx bx-left-arrow-alt"></i> Back
                            </Button>
                        )}

                        {currentStep < 5 ? (
                            <Button variant="primary" className="rounded-pill px-4 d-flex align-items-center gap-1" onClick={handleNextStep}>
                                Next Step <i className="bx bx-right-arrow-alt"></i>
                            </Button>
                        ) : (
                            <Button
                                variant="primary"
                                className="rounded-pill px-4 d-flex align-items-center gap-1 fw-bold border-0"
                                style={{ background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)' }}
                                onClick={handleSaveAll}
                                disabled={isSaving}
                            >
                                {isSaving ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-1"></span>
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <i className="bx bx-check fs-5 me-1"></i>
                                        {isEditMode ? 'Update Event' : 'Create Event'}
                                    </>
                                )}
                            </Button>
                        )}
                    </div>
                </div>
            </Card>

            <Modal show={showAgendaModal} onHide={() => setShowAgendaModal(false)} centered>
                <Modal.Header closeButton className="border-0 pb-0">
                    <Modal.Title className="fw-bold text-dark fs-5">
                        {editingAgendaIndex !== null ? "Edit Agenda Item" : "Add Agenda Item"}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="pt-3">
                    <Form>
                        <Row className="g-3 mb-3">
                            <Col md={6}>
                                <Form.Label className="fw-semibold small text-dark">Start Time *</Form.Label>
                                <Form.Control
                                    type="time"
                                    value={agendaForm.start_time}
                                    onChange={(e) => setAgendaForm({ ...agendaForm, start_time: e.target.value })}
                                />
                            </Col>
                            <Col md={6}>
                                <Form.Label className="fw-semibold small text-dark">End Time</Form.Label>
                                <Form.Control
                                    type="time"
                                    value={agendaForm.end_time}
                                    onChange={(e) => setAgendaForm({ ...agendaForm, end_time: e.target.value })}
                                />
                            </Col>
                        </Row>

                        <Form.Group className="mb-3">
                            <Form.Label className="fw-semibold small text-dark">Title *</Form.Label>
                            <Form.Control
                                type="text"
                                value={agendaForm.activity_name}
                                onChange={(e) => setAgendaForm({ ...agendaForm, activity_name: e.target.value })}
                                placeholder="Session / activity title"
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label className="fw-semibold small text-dark">Notes</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={2}
                                value={agendaForm.notes}
                                onChange={(e) => setAgendaForm({ ...agendaForm, notes: e.target.value })}
                                placeholder="Brief description of the session"
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer className="border-0 pt-0">
                    <Button variant="light" className="rounded-pill px-3" onClick={() => setShowAgendaModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="primary" className="rounded-pill px-4" onClick={saveAgendaModal}>
                        Save Agenda Item
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal show={showTicketModal} onHide={() => setShowTicketModal(false)} centered size="lg">
                <Modal.Header closeButton className="border-0 pb-0">
                    <Modal.Title className="fw-bold text-dark fs-5">
                        {editingTicketIndex !== null ? 'Edit Ticket Category' : 'Add Ticket Category'}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="pt-3">
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label className="fw-semibold small text-dark">Ticket Name *</Form.Label>
                            <Form.Control
                                type="text"
                                value={ticketForm.name}
                                onChange={(e) => setTicketForm({ ...ticketForm, name: e.target.value })}
                                placeholder="e.g. Early Bird Pass"
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label className="fw-semibold small text-dark">Description</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={2}
                                value={ticketForm.description}
                                onChange={(e) => setTicketForm({ ...ticketForm, description: e.target.value })}
                                placeholder="Describe what benefits ticket holders will get"
                            />
                        </Form.Group>

                        <Row className="g-3 mb-3">
                            <Col md={4}>
                                <Form.Label className="fw-semibold small text-dark">Price (IDR) *</Form.Label>
                                <Form.Control
                                    type="number"
                                    value={ticketForm.price}
                                    onChange={(e) => setTicketForm({ ...ticketForm, price: e.target.value })}
                                    placeholder="0 for Free ticket"
                                />
                            </Col>
                            <Col md={4}>
                                <Form.Label className="fw-semibold small text-dark">Is Taxable? *</Form.Label>
                                <Form.Select
                                    value={ticketForm.is_taxable}
                                    onChange={(e) => setTicketForm({ ...ticketForm, is_taxable: e.target.value as 'Y' | 'N', tax_id: e.target.value === 'N' ? '' : ticketForm.tax_id })}
                                >
                                    <option value="N">No</option>
                                    <option value="Y">Yes</option>
                                </Form.Select>
                            </Col>
                            <Col md={4}>
                                {ticketForm.is_taxable === 'Y' ? (
                                    <>
                                        <Form.Label className="fw-semibold small text-dark">Tax *</Form.Label>
                                        <Form.Select
                                            value={ticketForm.tax_id}
                                            onChange={(e) => setTicketForm({ ...ticketForm, tax_id: e.target.value })}
                                        >
                                            <option value="">-- Select Tax --</option>
                                            {taxes.map((tax) => (
                                                <option key={tax.id} value={tax.id}>{tax.name} ({tax.rate}%)</option>
                                            ))}
                                        </Form.Select>
                                    </>
                                ) : (
                                    <>
                                        <Form.Label className="fw-semibold small text-dark">Final Price (IDR)</Form.Label>
                                        <Form.Control type="text" value={formatCurrency(Number(ticketForm.price) || 0)} disabled />
                                    </>
                                )}
                            </Col>
                        </Row>

                        {ticketForm.is_taxable === 'Y' && (
                            <div className="mb-3 p-2 bg-light rounded border" style={{ fontSize: '0.8rem' }}>
                                <span className="text-muted">Final Price (incl. tax): </span>
                                <span className="fw-bold text-primary">
                                    {formatCurrency(calculateFinalPrice(Number(ticketForm.price) || 0, ticketForm.tax_id, taxes))}
                                </span>
                            </div>
                        )}

                        <Row className="g-3 mb-3">
                            <Col md={4}>
                                <Form.Label className="fw-semibold small text-dark">Total Capacity *</Form.Label>
                                <Form.Control
                                    type="number"
                                    value={ticketForm.total_capacity}
                                    onChange={(e) => setTicketForm({
                                        ...ticketForm,
                                        total_capacity: e.target.value,
                                        remaining_capacity: editingTicketIndex === null ? e.target.value : ticketForm.remaining_capacity,
                                    })}
                                />
                            </Col>
                            <Col md={4}>
                                <Form.Label className="fw-semibold small text-dark">Remaining Capacity *</Form.Label>
                                <Form.Control
                                    type="number"
                                    value={ticketForm.remaining_capacity}
                                    onChange={(e) => setTicketForm({ ...ticketForm, remaining_capacity: e.target.value })}
                                />
                            </Col>
                            <Col md={4}>
                                <Form.Label className="fw-semibold small text-dark">Max Per Order</Form.Label>
                                <Form.Control
                                    type="number"
                                    value={ticketForm.max_per_order}
                                    onChange={(e) => setTicketForm({ ...ticketForm, max_per_order: e.target.value })}
                                />
                            </Col>
                        </Row>

                        <Row className="g-3 mb-3">
                            <Col md={6}>
                                <SingleDateTimePicker
                                    name="sales_start_date"
                                    label="Sales Start Date"
                                    parentEl=""
                                    value={ticketForm.sales_start_date}
                                    onChange={(name, value) => setTicketForm({ ...ticketForm, sales_start_date: value })}
                                />
                            </Col>
                            <Col md={6}>
                                <SingleDateTimePicker
                                    name="sales_end_date"
                                    label="Sales End Date"
                                    parentEl=""
                                    value={ticketForm.sales_end_date}
                                    onChange={(name, value) => setTicketForm({ ...ticketForm, sales_end_date: value })}
                                />
                            </Col>
                        </Row>

                        <Form.Group>
                            <Form.Check
                                type="switch"
                                label={ticketForm.is_active ? 'Active' : 'Inactive'}
                                checked={ticketForm.is_active}
                                onChange={(e) => setTicketForm({ ...ticketForm, is_active: e.target.checked })}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer className="border-0 pt-0">
                    <Button variant="light" className="rounded-pill px-3" onClick={() => setShowTicketModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="primary" className="rounded-pill px-4" onClick={saveTicketModal}>
                        Save Ticket Type
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default CreateEventPage;
