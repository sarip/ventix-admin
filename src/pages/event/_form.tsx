import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Offcanvas, Button, Form as BootstrapForm, Nav, Tab } from 'react-bootstrap';
import { InEventForm } from "@/models/Event";
import { Event } from "@/models/Event";
import { Role } from '@/models/Role';
import $ from "jquery";
import 'select2/dist/js/select2.min.js';
import 'select2/dist/css/select2.min.css';
import swal from "sweetalert2";
import Select2Component from "@/pages/_components/Select2";
import DateRangePicker from "react-bootstrap-daterangepicker";
import "bootstrap-daterangepicker/daterangepicker.css";
import SingleDatePicker from "@/pages/_components/SingleDatePicker";
import MetadataEditor from "@/pages/_components/MetadataEditor";
import { EventOrganizer } from "@/models/EventOrganizer";
import { User } from "@/models/User";
import { EventCat } from "@/models/EventCat";
import OptionEventStatus from "@/pages/_components/OptionEventStatus";
import EventAgendaStep from "./_agenda";
import EventTicketsStep from "./_tickets";
import { InEventAgendaForm, EventAgenda } from "@/models/EventAgenda";
import { InEventTicketForm, EventTicket } from "@/models/EventTicket";
import { showToast } from '@/utils/toast';

import dynamic from "next/dynamic";

const MapPicker = dynamic(
    () => import("@/pages/_components/MapPicker/MapPicker"),
    { ssr: false }
);

enum FormStep {
    EVENT_INFO = 'event-info',
    EVENT_AGENDA = 'event-agenda',
    EVENT_TICKETS = 'event-tickets'
}




interface FormProps {
    title: string,
    data: InEventForm,
    onSave: (data: InEventForm) => void,
    validationError?: { field: string; message: string }[]
}

const Form: React.FC<FormProps> = ({ title, data, onSave, validationError = [] }) => {
    const [formData, setFormData] = useState<InEventForm>({
        id: null,
        events_organizer_id: null,
        user_id_pic: null,
        event_category: "",
        title: "",
        description: "",
        start_date: "",
        end_date: "",
        location_name: "",
        latitude: "",
        longitude: "",
        price_pool: "",
        registration_fee: "",
        thumbnail_url: null,
        events_status: "",
    });
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [currentStep, setCurrentStep] = useState<FormStep>(FormStep.EVENT_INFO);
    const [savedEventId, setSavedEventId] = useState<number | null>(null);
    const [agendas, setAgendas] = useState<any[]>([]);
    const [tickets, setTickets] = useState<any[]>([]);
    const [isSaving, setIsSaving] = useState(false);
    const EventModel = new Event();
    const EventAgendaModel = new EventAgenda();
    const EventTicketModel = new EventTicket();

    useEffect(() => {
        setFormData(data);
        setSavedEventId(data.id);
        // Load existing agendas and tickets when editing
        setAgendas((data as any).events_agendas || []);
        setTickets((data as any).events_tickets || []);
        setCurrentStep(FormStep.EVENT_INFO);
    }, [data]);


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleMapChange = useCallback((lat: string, lng: string, name?: string) => {
        setFormData((prev) => ({
            ...prev,
            latitude: lat,
            longitude: lng,
            location_name: name ?? prev.location_name,
        }));
    }, []);




    const nextStep = () => {
        if (currentStep === FormStep.EVENT_INFO) {
            setCurrentStep(FormStep.EVENT_AGENDA);
        } else if (currentStep === FormStep.EVENT_AGENDA) {
            setCurrentStep(FormStep.EVENT_TICKETS);
        }
    };

    const saveAll = async () => {
        setIsSaving(true);
        try {
            // Step 1: Save Event
            // let eventId = formData.id;
            // console.log({'formData' : formData, 'agendas' : agendas, 'tickets': tickets})
            // if (eventId) {
            //     await EventModel.update(eventId, formData);
            // } else {
            //     const response = await EventModel.create(formData);
            //     eventId = response.id;
            //     setFormData(prev => ({ ...prev, id: eventId }));
            // }
            //
            // // Step 2: Save Agendas
            // const activeAgendas = agendas.filter(a => !a._isDeleted);
            // for (const agenda of activeAgendas) {
            //     const payload: InEventAgendaForm = {
            //         events_id: eventId,
            //         start_time: agenda.start_time,
            //         end_time: agenda.end_time || null,
            //         activity_name: agenda.activity_name,
            //         notes: agenda.notes || null
            //     };
            //     if (agenda._isNew) {
            //         await EventAgendaModel.create(payload);
            //     } else if (agenda.id) {
            //         await EventAgendaModel.update(agenda.id, payload);
            //     }
            // }
            //
            // // Step 3: Save Tickets
            // const activeTickets = tickets.filter(t => !t._isDeleted);
            // for (const ticket of activeTickets) {
            //     const payload: InEventTicketForm = {
            //         event_id: eventId,
            //         name: ticket.name,
            //         description: ticket.description || null,
            //         price: ticket.price,
            //         total_capacity: ticket.total_capacity,
            //         remaining_capacity: ticket.remaining_capacity,
            //         max_per_order: ticket.max_per_order || 5,
            //         sales_start_date: ticket.sales_start_date || null,
            //         sales_end_date: ticket.sales_end_date || null,
            //         is_active: ticket.is_active !== false,
            //         sort_order: ticket.sort_order || 0
            //     };
            //     if (ticket._isNew) {
            //         await EventTicketModel.create(payload);
            //     } else if (ticket.id) {
            //         await EventTicketModel.update(ticket.id, payload);
            //     }
            // }

            // showToast('Event, agendas, and tickets saved successfully!', 'success');
            // jQuery("#modal-Event").modal('hide');
            const data = {
                ...formData,
                agendas,
                tickets
            };

            const fd = new FormData();

            Object.entries(formData).forEach(([k, v]) => {
                if (v !== null && v !== undefined) {
                    fd.append(k, v as any);
                }
            });

            fd.append('agendas', JSON.stringify(agendas));
            fd.append('tickets', JSON.stringify(tickets));

            console.log({'data' : data})
            onSave(fd);

        } catch (error) {
            let lines = error.message.trim().split('\n');
            let result = lines.map(line => {
                let [field, ...message] = line.split(' ');
                return { field, message: message.join(' ') };
            });
            const errorMap = result.reduce((acc: { [key: string]: string }, error) => {
                acc[error.field] = error.message;
                return acc;
            }, {});
            setErrors(errorMap);
            console.log({'error' : error})
            showToast('Failed to save. Please check errors.', 'error');
        } finally {
            setIsSaving(false);
        }
    };

    const onClose = () => {
        jQuery("#modal-Event").modal('hide');
    }

    useEffect(() => {
        setErrors({});
        if (validationError.length > 0) {
            const errorMap = validationError.reduce((acc: { [key: string]: string }, error) => {
                acc[error.field] = error.message;
                return acc;
            }, {});
            setErrors(errorMap);
        }
    }, [validationError]);

    const [selectedDate, setSelectedDate] = useState("");

    const handleApply = (event: any, picker: any) => {
        setSelectedDate(picker.startDate.format("YYYY-MM-DD"));
    };

    const EventOrganizerModel = new EventOrganizer();
    const UserModel = new User();
    const EventCatModel = new EventCat();

    const handleFileChange = (e) => {
        if (!e.target.files) return;
        setFormData(prev => ({
            ...prev,
            thumbnail_url: e.target.files[0],
        }));
    };



    return (

        <div className="modal fade" id="modal-Event" aria-hidden="true" data-bs-backdrop="static" data-bs-keyboard="false" >
            <div className="modal-dialog modal-xl" role="document">
                <div className="modal-content ">
                    <div className="modal-header">
                        <h5 className="modal-title" id="exampleModalLabel1">{title}</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={onClose}></button>
                    </div>
                    <div className="modal-body ">
                        <Tab.Container activeKey={currentStep} onSelect={(k) => setCurrentStep(k as FormStep)}>
                            <Nav variant="tabs" className="mb-3">
                                <Nav.Item>
                                    <Nav.Link eventKey={FormStep.EVENT_INFO}>
                                        <i className="bx bx-info-circle me-1"></i>
                                        Step 1: Event Info
                                    </Nav.Link>
                                </Nav.Item>
                                <Nav.Item>
                                    <Nav.Link eventKey={FormStep.EVENT_AGENDA}>
                                        <i className="bx bx-calendar-event me-1"></i>
                                        Step 2: Agenda
                                    </Nav.Link>
                                </Nav.Item>
                                <Nav.Item>
                                    <Nav.Link eventKey={FormStep.EVENT_TICKETS}>
                                        <i className="bx bx-ticket me-1"></i>
                                        Step 3: Tickets
                                    </Nav.Link>
                                </Nav.Item>
                            </Nav>

                            <Tab.Content>
                                <Tab.Pane eventKey={FormStep.EVENT_INFO}>
                                    <div className="row g-2">
                                        <div className="col">
                                            <div className="form-group mb-3">
                                                <label className="form-label" htmlFor="events_organizer_id">EO</label>
                                                <Select2Component
                                                    fetchData={EventOrganizerModel.list}
                                                    dropdownParent="#modal-Event"
                                                    placeholder="Pilih opsi"
                                                    name="events_organizer_id"
                                                    onChange={handleInputChange}
                                                    validation={errors.events_organizer_id}
                                                    selectedId={formData.events_organizer_id as number}
                                                    dataKey="events_organizer"
                                                    showKey="eo_name"
                                                    filterKey=""
                                                />
                                                {!!errors?.events_organizer_id && (
                                                    <div className="invalid-feedback">{errors.events_organizer_id}</div>
                                                )}
                                            </div>
                                            <div className="form-group mb-3">
                                                <label className="form-label" htmlFor="events_organizer_id">PIC</label>
                                                <Select2Component
                                                    fetchData={UserModel.list}
                                                    dropdownParent="#modal-Event"
                                                    placeholder="Pilih opsi"
                                                    name="user_id_pic"
                                                    onChange={handleInputChange}
                                                    validation={errors.user_id_pic}
                                                    selectedId={formData.user_id_pic}
                                                    dataKey="users"
                                                    showKey="name"
                                                />
                                                {!!errors?.user_id_pic && (
                                                    <div className="invalid-feedback">{errors.user_id_pic}</div>
                                                )}
                                            </div>
                                            <div className="form-group mb-3">
                                                <label className="form-label" htmlFor="event_category">Category</label>
                                                <Select2Component
                                                    fetchData={EventCatModel.list}
                                                    dropdownParent="#modal-Event"
                                                    placeholder="Pilih opsi"
                                                    name="event_category"
                                                    onChange={handleInputChange}
                                                    validation={errors.event_category}
                                                    selectedId={formData.event_category}
                                                    dataKey="events_cat"
                                                    showKey="name"
                                                    id="name"
                                                />
                                                {!!errors?.event_category && (
                                                    <div className="invalid-feedback">{errors.event_category}</div>
                                                )}
                                            </div>
                                            <div className="form-group mb-3">
                                                <label className="form-label" htmlFor="title">Title</label>
                                                <input
                                                    type="text"
                                                    id="title"
                                                    name="title"
                                                    className={`form-control ${!!errors?.title ? 'is-invalid' : ''}`}
                                                    placeholder="title"
                                                    value={formData.title}
                                                    onChange={handleInputChange}
                                                />
                                                {!!errors?.title && (
                                                    <div className="invalid-feedback">{errors.title}</div>
                                                )}
                                            </div>
                                            <div className="form-group mb-3">
                                                <label className="form-label" htmlFor="description">Description</label>
                                                <textarea
                                                    id="description"
                                                    name="description"
                                                    className={`form-control ${!!errors?.description ? 'is-invalid' : ''}`}
                                                    placeholder="description"
                                                    value={formData.description}
                                                    onChange={handleInputChange}
                                                />
                                                {!!errors?.description && (
                                                    <div className="invalid-feedback">{errors.description}</div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="col mb-3">
                                            <div className="row">
                                                <div className="col">
                                                    <SingleDatePicker
                                                        name="start_date"
                                                        label="Start Date"
                                                        parentEl="#modal-Event"
                                                        value={formData.start_date}
                                                        onChange={(name, value) =>
                                                            setFormData((prev) => ({ ...prev, [name]: value }))
                                                        }
                                                        error={errors.start_date}
                                                    />

                                                </div>
                                                <div className="col">
                                                    <SingleDatePicker
                                                        name="end_date"
                                                        label="End Date"
                                                        parentEl="#modal-Event"
                                                        value={formData.end_date}
                                                        onChange={(name, value) =>
                                                            setFormData((prev) => ({ ...prev, [name]: value }))
                                                        }
                                                        error={errors.end_date}
                                                    />
                                                </div>
                                            </div>

                                            <div className="row mb-3">
                                                <div className="col">
                                                    <div className="form-group">
                                                        <label className="form-label" htmlFor="price_pool">Price Pool</label>
                                                        <input
                                                            id="price_pool"
                                                            type="number"
                                                            name="price_pool"
                                                            className={`form-control ${!!errors?.price_pool ? 'is-invalid' : ''}`}
                                                            placeholder="price pool"
                                                            value={formData.price_pool}
                                                            onChange={handleInputChange}
                                                        />
                                                        {!!errors?.price_pool && (
                                                            <div className="invalid-feedback">{errors.price_pool}</div>
                                                        )}
                                                    </div>

                                                </div>
                                                <div className="col">
                                                    <div className="form-group">
                                                        <label className="form-label" htmlFor="registration_fee">Registration
                                                            fee</label>
                                                        <input
                                                            id="registration_fee"
                                                            type="number"
                                                            name="registration_fee"
                                                            className={`form-control ${!!errors?.registration_fee ? 'is-invalid' : ''}`}
                                                            placeholder="Registration Fee"
                                                            value={formData.registration_fee}
                                                            onChange={handleInputChange}
                                                        />
                                                        {!!errors?.registration_fee && (
                                                            <div className="invalid-feedback">{errors.registration_fee}</div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="form-group mb-3">
                                                <label className="form-label" htmlFor="events_status">Event Status</label>
                                                <select
                                                    id="events_status"
                                                    name="events_status"
                                                    className={`form-control ${!!errors?.events_status ? 'is-invalid' : ''}`}
                                                    value={formData.events_status}
                                                    onChange={handleInputChange}
                                                >
                                                    <option value="">-- Select --</option>
                                                    <OptionEventStatus />
                                                </select>
                                                {!!errors?.events_status && (
                                                    <div className="invalid-feedback">{errors.location_name}</div>
                                                )}
                                            </div>


                                            <div className="form-group mb-3">
                                                <label className="form-label" htmlFor="thumbnail_url">Thumbnail</label>
                                                <input
                                                    type="file"
                                                    id="thumbnail_url"
                                                    name="thumbnail_url"
                                                    className={`form-control ${!!errors?.thumbnail_url ? 'is-invalid' : ''}`}
                                                    placeholder="thumbnail_url"
                                                    onChange={handleFileChange}
                                                />
                                                {!!errors?.thumbnail_url && (
                                                    <div className="invalid-feedback">{errors.thumbnail_url}</div>
                                                )}
                                            </div>

                                            <div className="mb-3">
                                                <label className="form-label">Lokasi Event</label>
                                                <MapPicker
                                                    latitude={formData.latitude}
                                                    longitude={formData.longitude}
                                                    onChange={handleMapChange}
                                                />
                                            </div>

                                        </div>

                                    </div>
                                </Tab.Pane>

                                <Tab.Pane eventKey={FormStep.EVENT_AGENDA}>
                                    <EventAgendaStep
                                        eventId={savedEventId}
                                        agendas={agendas}
                                        onChange={setAgendas}
                                    />
                                </Tab.Pane>

                                <Tab.Pane eventKey={FormStep.EVENT_TICKETS}>
                                    <EventTicketsStep
                                        eventId={savedEventId}
                                        tickets={tickets}
                                        onChange={setTickets}
                                    />
                                </Tab.Pane>
                            </Tab.Content>
                        </Tab.Container>
                    </div>


                    <div className="modal-footer">
                        <button type="reset" className="btn btn-label-secondary" data-bs-dismiss="modal"
                            aria-label="Close" onClick={onClose}>Cancel
                        </button>

                        {currentStep !== FormStep.EVENT_INFO && (
                            <button
                                type="button"
                                className="btn btn-outline-secondary"
                                onClick={() => {
                                    if (currentStep === FormStep.EVENT_TICKETS) setCurrentStep(FormStep.EVENT_AGENDA);
                                    else if (currentStep === FormStep.EVENT_AGENDA) setCurrentStep(FormStep.EVENT_INFO);
                                }}
                            >
                                <i className="bx bx-arrow-back me-1"></i>
                                Back
                            </button>
                        )}

                        {currentStep !== FormStep.EVENT_TICKETS ? (
                            <button type="button" className="btn btn-primary" onClick={nextStep}>
                                Next
                                <i className="bx bx-arrow-right ms-1"></i>
                            </button>
                        ) : (
                            <button
                                type="button"
                                className="btn btn-success"
                                onClick={saveAll}
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
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Form;
