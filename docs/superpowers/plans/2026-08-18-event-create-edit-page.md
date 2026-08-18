# Event Create/Edit Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make `/event/create` the real create **and** edit page for events (via `?id=`), using the existing wizard UI, wired to the real system exactly as it works today in the modal (`_form.tsx`) — no backend changes.

**Architecture:** Extract Step 1 (Event Info) into a new `_info.tsx` step component with real fields (replacing the fully-mocked ones). Rewrite `create.tsx` as the page shell: detects `?id=`, fetches the event when editing, holds all wizard state, renders `_info.tsx` for step 1 and the four already-working step components (`_agenda.tsx`, `_tickets.tsx`, `_sponsors.tsx`, `_ads.tsx`) unchanged for steps 2–5, and ports `saveAll()` from `_form.tsx`. Update `index.tsx` to link to this page instead of opening the modal.

**Tech Stack:** Next.js (pages router), React, TypeScript, react-bootstrap, jQuery + select2 (via `Select2Component`), no automated test runner in this project (verification is `tsc --noEmit` + manual browser check via the dev server).

## Global Constraints

- No backend/database changes — no new columns, no new endpoints (spec: `docs/superpowers/specs/2026-08-18-event-create-edit-page-design.md`).
- Do not modify `_agenda.tsx`, `_tickets.tsx`, `_sponsors.tsx`, `_ads.tsx` internals.
- Do not delete `_form.tsx` — just stop importing it from `index.tsx`.
- This repo has `typescript.ignoreBuildErrors: true` in `next.config.js` and already has pre-existing `tsc` errors in unrelated files — verification only requires that files touched by this plan (`src/pages/event/*.tsx`) produce zero new `tsc` errors, not a fully clean project-wide run.
- Follow existing conventions exactly where the spec says "port as-is" (e.g. `saveAll`, the EO pending/rejected guard) — don't improve or refactor that logic, just relocate it.

---

### Task 1: `_info.tsx` — real Step 1 (Event Info) component

**Files:**
- Create: `src/pages/event/_info.tsx`

**Interfaces:**
- Consumes: `InEventForm` type from `@/models/Event` (existing).
- Produces: default-exported `EventInfoStep` component with props:
  ```ts
  interface EventInfoStepProps {
      formData: InEventForm;
      errors: { [key: string]: string };
      onFieldChange: (e: React.ChangeEvent<any>, selectedItem?: any) => void;
      onDateChange: (name: string, value: string) => void;
      onThumbnailChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  }
  ```
  Task 2 will render `<EventInfoStep formData={...} errors={...} onFieldChange={...} onDateChange={...} onThumbnailChange={...} />` with exactly this prop shape.

- [ ] **Step 1: Write `src/pages/event/_info.tsx`**

```tsx
import React from 'react';
import { Row, Col, Card, Form as BootstrapForm } from 'react-bootstrap';
import $ from 'jquery';
import 'select2/dist/js/select2.min.js';
import 'select2/dist/css/select2.min.css';
import Select2Component from '@/pages/_components/Select2';
import SingleDatePicker from '@/pages/_components/SingleDatePicker';
import OptionEventStatus from '@/pages/_components/OptionEventStatus';
import { InEventForm } from '@/models/Event';
import { EventOrganizer } from '@/models/EventOrganizer';
import { User } from '@/models/User';
import { EventCat } from '@/models/EventCat';
import { RegProvince } from '@/models/RegProvince';

interface EventInfoStepProps {
    formData: InEventForm;
    errors: { [key: string]: string };
    onFieldChange: (e: React.ChangeEvent<any>, selectedItem?: any) => void;
    onDateChange: (name: string, value: string) => void;
    onThumbnailChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const EventInfoStep: React.FC<EventInfoStepProps> = ({
    formData,
    errors,
    onFieldChange,
    onDateChange,
    onThumbnailChange,
}) => {
    const EventOrganizerModel = new EventOrganizer();
    const UserModel = new User();
    const EventCatModel = new EventCat();
    const RegProvinceModel = new RegProvince();

    return (
        <Row className="g-4">
            <Col xl={8} lg={7}>
                <Card className="border-0 shadow-sm rounded-4 p-4 bg-white mb-4">
                    <div className="mb-4 border-bottom pb-3">
                        <h6 className="fw-bold text-dark mb-1" style={{ fontSize: '1.1rem' }}>Event Information</h6>
                        <p className="text-muted small mb-0">Let's start with the basic information about your event.</p>
                    </div>

                    <BootstrapForm>
                        <h6 className="fw-bold text-primary mb-3" style={{ fontSize: '0.9rem' }}>Basic Details</h6>

                        <Row className="g-3 mb-3">
                            <Col md={6}>
                                <BootstrapForm.Label className="fw-semibold small text-dark">EO / Organizer *</BootstrapForm.Label>
                                <Select2Component
                                    fetchData={EventOrganizerModel.list}
                                    placeholder="Pilih EO"
                                    name="events_organizer_id"
                                    onChange={onFieldChange}
                                    validation={errors.events_organizer_id}
                                    selectedId={formData.events_organizer_id as number}
                                    dataKey="events_organizer"
                                    showKey="eo_name"
                                    filterKey=""
                                />
                                {!!errors.events_organizer_id && (
                                    <div className="invalid-feedback d-block">{errors.events_organizer_id}</div>
                                )}
                            </Col>
                            <Col md={6}>
                                <BootstrapForm.Label className="fw-semibold small text-dark">PIC (Person in Charge) *</BootstrapForm.Label>
                                <Select2Component
                                    fetchData={UserModel.lists}
                                    placeholder="Pilih PIC"
                                    name="user_id_pic"
                                    onChange={onFieldChange}
                                    validation={errors.user_id_pic}
                                    selectedId={formData.user_id_pic as number}
                                    dataKey="users"
                                    showKey="name"
                                    filterKey={`eo_id:${formData.events_organizer_id}`}
                                    id="id"
                                />
                                {!!errors.user_id_pic && (
                                    <div className="invalid-feedback d-block">{errors.user_id_pic}</div>
                                )}
                            </Col>
                        </Row>

                        <Row className="g-3 mb-3">
                            <Col md={6}>
                                <BootstrapForm.Label className="fw-semibold small text-dark">Category *</BootstrapForm.Label>
                                <Select2Component
                                    fetchData={EventCatModel.list}
                                    placeholder="Pilih Kategori"
                                    name="event_category"
                                    onChange={onFieldChange}
                                    validation={errors.event_category}
                                    selectedId={formData.event_category}
                                    dataKey="events_cat"
                                    showKey="name"
                                    id="name"
                                />
                                {!!errors.event_category && (
                                    <div className="invalid-feedback d-block">{errors.event_category}</div>
                                )}
                            </Col>
                            <Col md={6}>
                                <BootstrapForm.Label className="fw-semibold small text-dark">Event Status</BootstrapForm.Label>
                                <BootstrapForm.Select
                                    name="events_status"
                                    value={formData.events_status}
                                    onChange={onFieldChange}
                                    className={`py-2 ${errors.events_status ? 'is-invalid' : ''}`}
                                >
                                    <option value="">-- Select --</option>
                                    <OptionEventStatus />
                                </BootstrapForm.Select>
                                {!!errors.events_status && (
                                    <div className="invalid-feedback">{errors.events_status}</div>
                                )}
                            </Col>
                        </Row>

                        <BootstrapForm.Group className="mb-3">
                            <BootstrapForm.Label className="fw-semibold small text-dark">Event Title *</BootstrapForm.Label>
                            <BootstrapForm.Control
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={onFieldChange}
                                placeholder="Enter event title"
                                className={`py-2 ${errors.title ? 'is-invalid' : ''}`}
                            />
                            {!!errors.title && <div className="invalid-feedback">{errors.title}</div>}
                        </BootstrapForm.Group>

                        <BootstrapForm.Group className="mb-4">
                            <BootstrapForm.Label className="fw-semibold small text-dark">Description *</BootstrapForm.Label>
                            <BootstrapForm.Control
                                as="textarea"
                                rows={3}
                                name="description"
                                value={formData.description}
                                onChange={onFieldChange}
                                placeholder="Describe your event"
                                className={errors.description ? 'is-invalid' : ''}
                            />
                            {!!errors.description && <div className="invalid-feedback">{errors.description}</div>}
                        </BootstrapForm.Group>

                        <Row className="g-3 mb-4">
                            <Col md={6}>
                                <SingleDatePicker
                                    name="start_date"
                                    label="Start Date *"
                                    value={formData.start_date}
                                    onChange={onDateChange}
                                    error={errors.start_date}
                                />
                            </Col>
                            <Col md={6}>
                                <SingleDatePicker
                                    name="end_date"
                                    label="End Date *"
                                    value={formData.end_date}
                                    onChange={onDateChange}
                                    error={errors.end_date}
                                />
                            </Col>
                        </Row>

                        <hr className="my-4" />

                        <h6 className="fw-bold text-primary mb-3" style={{ fontSize: '0.9rem' }}>Location</h6>
                        <Row className="g-3 mb-3">
                            <Col md={6}>
                                <BootstrapForm.Label className="fw-semibold small text-dark">Province *</BootstrapForm.Label>
                                <Select2Component
                                    fetchData={RegProvinceModel.list}
                                    placeholder="Pilih Provinsi"
                                    name="location"
                                    onChange={onFieldChange}
                                    validation={errors.location}
                                    selectedId={formData.location}
                                    dataKey="reg_provinces"
                                    showKey="name"
                                    id="name"
                                />
                                {!!errors.location && (
                                    <div className="invalid-feedback d-block">{errors.location}</div>
                                )}
                            </Col>
                            <Col md={6}>
                                <BootstrapForm.Label className="fw-semibold small text-dark">Location Name / Venue *</BootstrapForm.Label>
                                <BootstrapForm.Control
                                    as="textarea"
                                    rows={1}
                                    name="location_name"
                                    value={formData.location_name}
                                    onChange={onFieldChange}
                                    placeholder="Enter venue / full address"
                                    className={errors.location_name ? 'is-invalid' : ''}
                                />
                                {!!errors.location_name && (
                                    <div className="invalid-feedback">{errors.location_name}</div>
                                )}
                            </Col>
                        </Row>

                        <Row className="g-3 mb-4">
                            <Col md={6}>
                                <BootstrapForm.Label className="fw-semibold small text-dark">Latitude (Optional)</BootstrapForm.Label>
                                <BootstrapForm.Control
                                    type="text"
                                    name="latitude"
                                    value={formData.latitude}
                                    onChange={onFieldChange}
                                    className="py-2"
                                />
                            </Col>
                            <Col md={6}>
                                <BootstrapForm.Label className="fw-semibold small text-dark">Longitude (Optional)</BootstrapForm.Label>
                                <BootstrapForm.Control
                                    type="text"
                                    name="longitude"
                                    value={formData.longitude}
                                    onChange={onFieldChange}
                                    className="py-2"
                                />
                            </Col>
                        </Row>

                        <hr className="my-4" />

                        <h6 className="fw-bold text-primary mb-3" style={{ fontSize: '0.9rem' }}>Additional Details</h6>
                        <Row className="g-3 mb-3">
                            <Col md={6}>
                                <BootstrapForm.Label className="fw-semibold small text-dark">Price Pool (Optional)</BootstrapForm.Label>
                                <BootstrapForm.Control
                                    type="number"
                                    name="price_pool"
                                    value={formData.price_pool}
                                    onChange={onFieldChange}
                                    placeholder="0"
                                    className="py-2"
                                />
                            </Col>
                            <Col md={6}>
                                <BootstrapForm.Label className="fw-semibold small text-dark">Registration Fee (Optional)</BootstrapForm.Label>
                                <BootstrapForm.Control
                                    type="number"
                                    name="registration_fee"
                                    value={formData.registration_fee}
                                    onChange={onFieldChange}
                                    placeholder="0"
                                    className="py-2"
                                />
                            </Col>
                        </Row>

                        <BootstrapForm.Group>
                            <BootstrapForm.Label className="fw-semibold small text-dark">Thumbnail (Optional)</BootstrapForm.Label>
                            <BootstrapForm.Control
                                type="file"
                                name="thumbnail_url"
                                accept="image/*"
                                onChange={onThumbnailChange}
                                className={errors.thumbnail_url ? 'is-invalid' : ''}
                            />
                            {typeof formData.thumbnail_url === 'string' && formData.thumbnail_url && (
                                <small className="text-muted d-block mt-1">Current thumbnail: {formData.thumbnail_url}</small>
                            )}
                            {!!errors.thumbnail_url && <div className="invalid-feedback">{errors.thumbnail_url}</div>}
                        </BootstrapForm.Group>
                    </BootstrapForm>
                </Card>
            </Col>

            <Col xl={4} lg={5}>
                <Card className="border-0 shadow-sm rounded-4 p-3 bg-white mb-4">
                    <div className="d-flex align-items-center gap-2 mb-3 pb-2 border-bottom">
                        <i className="bx bx-show fs-5 text-primary"></i>
                        <h6 className="fw-bold text-dark mb-0" style={{ fontSize: '0.95rem' }}>Event Preview</h6>
                    </div>
                    <div className="d-flex flex-column gap-2 text-muted" style={{ fontSize: '0.82rem' }}>
                        <div className="d-flex align-items-center gap-2 py-1 border-bottom">
                            <i className="bx bx-heading text-primary fs-5"></i>
                            <div><span className="text-muted">Title:</span> <strong className="text-dark ms-1">{formData.title || '-'}</strong></div>
                        </div>
                        <div className="d-flex align-items-center gap-2 py-1 border-bottom">
                            <i className="bx bx-calendar text-primary fs-5"></i>
                            <div><span className="text-muted">Start Date:</span> <strong className="text-dark ms-1">{formData.start_date || '-'}</strong></div>
                        </div>
                        <div className="d-flex align-items-center gap-2 py-1 border-bottom">
                            <i className="bx bx-map text-primary fs-5"></i>
                            <div><span className="text-muted">Location:</span> <strong className="text-dark ms-1">{formData.location_name || '-'}</strong></div>
                        </div>
                        <div className="d-flex align-items-center gap-2 py-1">
                            <i className="bx bx-tag text-primary fs-5"></i>
                            <div><span className="text-muted">Category:</span> <strong className="text-dark ms-1">{formData.event_category || '-'}</strong></div>
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
                        <li className="d-flex align-items-center gap-2"><i className="bx bx-check-circle text-primary fs-6"></i> Upload an attractive thumbnail</li>
                    </ul>
                </Card>
            </Col>
        </Row>
    );
};

export default EventInfoStep;
```

- [ ] **Step 2: Typecheck the new file**

Run: `cd /home/sarip/project/venntix-admin && npx tsc --noEmit 2>&1 | grep "src/pages/event/_info.tsx"`
Expected: no output (no errors in this file). It's fine if unrelated files elsewhere still show pre-existing errors — that's the repo baseline (`ignoreBuildErrors: true`), not something this task changes.

- [ ] **Step 3: Commit**

```bash
cd /home/sarip/project/venntix-admin
git add src/pages/event/_info.tsx
git commit -m "feat(event): add real Event Info step component for the create/edit wizard"
```

---

### Task 2: Rewrite `create.tsx` as the real create/edit page

**Files:**
- Modify (full rewrite): `src/pages/event/create.tsx`

**Interfaces:**
- Consumes:
  - `EventInfoStep` from `./_info` (Task 1) — props as defined above.
  - `EventAgendaStep` from `./_agenda`, props `{ eventId: number | null; agendas: any[]; onChange: (a: any[]) => void }` (existing, unchanged).
  - `EventTicketsStep` from `./_tickets`, props `{ eventId: number | null; tickets: any[]; onChange: (t: any[]) => void }` (existing, unchanged).
  - `EventSponsorsStep` from `./_sponsors`, props `{ eventId: number | null; logos: any[]; onChange: (l: any[]) => void }` (existing, unchanged).
  - `EventAdsStep`, `AdImage` from `./_ads`, props `{ eventId: number | null; ads: AdImage[]; onChange: (a: AdImage[]) => void }` (existing, unchanged).
  - `Event`, `InEventForm` from `@/models/Event` — `Event.list(query)` returns `{ events: any[] }`; `Event.saveAll(data)` posts to `/event/saveAll`.
  - `useBlockUI` from `@/pages/_components/useBlockUI` — `{ blockUI, unblockUI }`.
  - `showToast` from `@/utils/toast`.
- Produces: default-exported page component (unchanged export shape — still `CreateEventPage`), now reads `router.query.id`.

- [ ] **Step 1: Replace the full contents of `src/pages/event/create.tsx`**

```tsx
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
                    $(`select[name="${name}"]`).val(null).trigger('change.select2');
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
```

- [ ] **Step 2: Typecheck**

Run: `cd /home/sarip/project/venntix-admin && npx tsc --noEmit 2>&1 | grep "src/pages/event/create.tsx"`
Expected: no output.

- [ ] **Step 3: Commit**

```bash
cd /home/sarip/project/venntix-admin
git add src/pages/event/create.tsx
git commit -m "feat(event): wire create/edit wizard to the real event system"
```

---

### Task 3: Point `index.tsx` at the new page instead of the modal

**Files:**
- Modify: `src/pages/event/index.tsx`

**Interfaces:**
- Consumes: nothing new — this task only removes dead modal-wiring code and swaps two buttons for `Link`s to `/event/create` and `/event/create?id=X`.
- Produces: nothing consumed elsewhere; `remove()` (delete) keeps its current signature/behavior.

- [ ] **Step 1: Remove modal-only state and handlers**

In `src/pages/event/index.tsx`, delete these (currently at lines 47–67, 109–143, 147–176 per the pre-change file):
- `const [showForm, setShowForm] = useState<boolean>(false);`
- `const [formData, setFormData] = useState<InEventForm>({...});` (the whole block)
- `const [validationError, SetValidationError] = useState<ValidationErrorProps[]>([]);`
- `const create = () => {...}`
- `const clearFormData = () => {...}`
- `const update = (data: InEventForm) => {...}`
- `const save = useCallback(async (data: InEventForm) => {...}, [...]);`
- `interface ValidationErrorProps { field: string; message: string; }` (now unused once `validationError`/`SetValidationError` are gone)

Also remove the now-unused imports this leaves behind: `Form` (the `./_form` default import) and `InEventForm`/`InEvent` — keep `InEvent` since the table still types `events` with it; drop `InEventForm` and the `Form` import. Remove `useCallback` from the `react` import only if nothing else in the file still uses it (check before removing — `listData` and other functions in this file don't use `useCallback`, so it can be dropped from the import list).

- [ ] **Step 2: Replace the "Create Event" button with a Link**

Find:
```tsx
<Button variant="primary" onClick={create}>
    <span><i className="bx bx-plus me-0 me-sm-1"></i></span>
    <span className="d-none d-sm-inline-block">Create Event</span>
</Button>
```

Replace with:
```tsx
<Link href="/event/create" className="btn btn-primary">
    <span><i className="bx bx-plus me-0 me-sm-1"></i></span>
    <span className="d-none d-sm-inline-block">Create Event</span>
</Link>
```

Add the import at the top of the file (next to the other imports): `import Link from 'next/link';`

- [ ] **Step 3: Replace the row-level edit button with a Link**

Find:
```tsx
<button className="btn btn-md btn-icon btn-warning"
        onClick={() => update(item)}><i className="bx bx-edit"></i>
</button>
```

Replace with:
```tsx
<Link href={`/event/create?id=${item.id}`} className="btn btn-md btn-icon btn-warning">
    <i className="bx bx-edit"></i>
</Link>
```

- [ ] **Step 4: Remove the modal `<Form .../>` render**

Find and delete this block near the end of the component's JSX (right before the closing `</>`):
```tsx
<Form
    title={formData.id ? 'Edit Event' : 'Create Event'}
    data={formData}
    onSave={save}
    validationError={validationError}
/>
```

- [ ] **Step 5: Typecheck**

Run: `cd /home/sarip/project/venntix-admin && npx tsc --noEmit 2>&1 | grep "src/pages/event/index.tsx"`
Expected: no output.

- [ ] **Step 6: Commit**

```bash
cd /home/sarip/project/venntix-admin
git add src/pages/event/index.tsx
git commit -m "feat(event): link create/edit actions to the wizard page instead of the modal"
```

---

### Task 4: Manual end-to-end verification

**Files:** none (verification only).

- [ ] **Step 1: Start the dev server**

Run: `cd /home/sarip/project/venntix-admin && npm run dev` (background — leave running for the rest of this task).

- [ ] **Step 2: Verify the create flow in a browser**

Navigate to `/event`, click "Create Event" → lands on `/event/create` with an empty wizard (no demo data prefilled). Fill Step 1 (EO, PIC, Category, Title, Description, Start/End Date, Province, Location Name), click through Steps 2–5 confirming each renders the real `_agenda`/`_tickets`/`_sponsors`/`_ads` components (add one agenda row, one ticket, one sponsor logo, one ad image), then click "Save All". Expect: success toast, redirect to `/event`, and the new event appears in the table.

- [ ] **Step 3: Verify the edit flow in a browser**

From `/event`, click the pencil/edit icon on the event created in Step 2 → lands on `/event/create?id=<id>` showing a loading spinner briefly, then the wizard prefilled with that event's data across all 5 steps (including the agenda/ticket/sponsor/ad rows saved earlier). Change the title, click "Save All". Expect: success toast, redirect to `/event`, updated title visible in the table.

- [ ] **Step 4: Verify the EO-status guard still works**

In Step 1, select an EO whose `verification_status` is `Pending` or `Rejected` (if one exists in this environment's data). Expect: a SweetAlert warning appears and the EO field is cleared, matching the original modal's behavior.

- [ ] **Step 5: Verify delete still works from the list page**

On `/event`, click the trash icon on any row. Expect: the existing confirm dialog + delete flow (unchanged by this plan) still works.

- [ ] **Step 6: Record the result**

If all of the above pass, mark this task complete. If something fails, note exactly which step and what happened before fixing — do not mark complete on a partial pass.
