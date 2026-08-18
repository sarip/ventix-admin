import React, { useState, useEffect, useCallback } from 'react';
import { Row, Col, Card, Button, Spinner } from 'react-bootstrap';
import Link from 'next/link';
import { useRouter } from 'next/router';
import $ from 'jquery';
import swal from 'sweetalert2';
import useBlockUI from '@/pages/_components/useBlockUI';
import { showToast } from '@/utils/toast';
import { Event, InEventForm } from '@/models/Event';
import EventInfoStep from './_info';
import EventAgendaStep from './_agenda';
import EventTicketsStep from './_tickets';
import EventSponsorsStep from './_sponsors';
import EventAdsStep, { AdImage } from './_ads';

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
    const [agendas, setAgendas] = useState<any[]>([]);
    const [tickets, setTickets] = useState<any[]>([]);
    const [sponsors, setSponsors] = useState<any[]>([]);
    const [ads, setAds] = useState<AdImage[]>([]);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [isSaving, setIsSaving] = useState<boolean>(false);

    const EventModel = new Event();

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
            setAgendas(data.events_agendas || []);
            setTickets(
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
            setSponsors(data.events_sponsors || []);
            setAds(data.events_ads || []);
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
            setAgendas([]);
            setTickets([]);
            setSponsors([]);
            setAds([]);
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
                    $(`select[name="${name}"]`).val('').trigger('change.select2');
                }, 10);
                setFormData((prev) => ({ ...prev, [name]: '' }));
                return;
            }
        }

        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleDateChange = (name: string, value: string) => {
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || !e.target.files[0]) return;
        setFormData((prev) => ({ ...prev, thumbnail_url: e.target.files![0] as any }));
    };

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

            fd.append('agendas', JSON.stringify(agendas));
            fd.append('tickets', JSON.stringify(tickets));

            sponsors.forEach((sponsor, index) => {
                if (sponsor.file) {
                    fd.append(`sponsor_logos[${index}]`, sponsor.file);
                }
            });
            fd.append('sponsors_info', JSON.stringify(sponsors.map((s) => ({
                id: s.id,
                _isDeleted: s._isDeleted,
                _isNew: s._isNew,
            }))));

            ads.forEach((ad, index) => {
                if (ad.file && !ad._isDeleted) {
                    fd.append(`ad_images[${index}]`, ad.file);
                }
            });
            fd.append('ads_info', JSON.stringify(ads.map((a) => ({
                id: a.id,
                _isDeleted: a._isDeleted,
                _isNew: a._isNew,
            }))));

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
                <Spinner animation="border" variant="primary" />
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
                                className={`d-flex align-items-center gap-2.5 cursor-pointer ${currentStep === s.step ? 'text-primary' : 'text-secondary'}`}
                                onClick={() => setCurrentStep(s.step)}
                            >
                                <div
                                    className={`rounded-circle d-flex align-items-center justify-content-center fw-bold ${currentStep > s.step ? 'bg-success text-white' : currentStep === s.step ? 'bg-primary text-white shadow-sm' : 'bg-light text-muted'}`}
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
                <EventInfoStep
                    formData={formData}
                    errors={errors}
                    onFieldChange={handleFieldChange}
                    onDateChange={handleDateChange}
                    onThumbnailChange={handleThumbnailChange}
                />
            )}

            {currentStep === 2 && (
                <Row className="g-4">
                    <Col xl={12}>
                        <Card className="border-0 shadow-sm rounded-4 p-4 bg-white mb-4">
                            <div className="border-bottom pb-3 mb-4">
                                <h6 className="fw-bold text-dark mb-0" style={{ fontSize: '1.1rem' }}>Event Agenda</h6>
                                <p className="text-muted small mb-0 mt-0.5">Add all activities, sessions, and key moments in your event.</p>
                            </div>
                            <EventAgendaStep eventId={formData.id} agendas={agendas} onChange={setAgendas} />
                        </Card>
                    </Col>
                </Row>
            )}

            {currentStep === 3 && (
                <Row className="g-4">
                    <Col xl={12}>
                        <Card className="border-0 shadow-sm rounded-4 p-4 bg-white mb-4">
                            <div className="border-bottom pb-3 mb-4">
                                <h6 className="fw-bold text-dark mb-0" style={{ fontSize: '1.1rem' }}>Ticket Types</h6>
                                <p className="text-muted small mb-0 mt-0.5">Every event must have at least one ticket type, even if it's free.</p>
                            </div>
                            <EventTicketsStep eventId={formData.id} tickets={tickets} onChange={setTickets} />
                        </Card>
                    </Col>
                </Row>
            )}

            {currentStep === 4 && (
                <Row className="g-4">
                    <Col xl={12}>
                        <Card className="border-0 shadow-sm rounded-4 p-4 bg-white mb-4">
                            <div className="border-bottom pb-3 mb-4">
                                <h6 className="fw-bold text-dark mb-0" style={{ fontSize: '1.1rem' }}>Sponsors & Partners</h6>
                                <p className="text-muted small mb-0 mt-0.5">Upload sponsor logos for your event. Optional.</p>
                            </div>
                            <EventSponsorsStep eventId={formData.id} logos={sponsors} onChange={setSponsors} />
                        </Card>
                    </Col>
                </Row>
            )}

            {currentStep === 5 && (
                <Row className="g-4">
                    <Col xl={12}>
                        <Card className="border-0 shadow-sm rounded-4 p-4 bg-white mb-4">
                            <div className="border-bottom pb-3 mb-4">
                                <h6 className="fw-bold text-dark mb-0" style={{ fontSize: '1.1rem' }}>Ad Images</h6>
                                <p className="text-muted small mb-0 mt-0.5">Upload banners and images to promote your event. Optional.</p>
                            </div>
                            <EventAdsStep eventId={formData.id} ads={ads} onChange={setAds} />
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
                                        <i className="bx bx-save me-1"></i>
                                        Save All
                                    </>
                                )}
                            </Button>
                        )}
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default CreateEventPage;
