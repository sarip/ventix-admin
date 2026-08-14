import React, { useState } from 'react';
import { Row, Col, Card, Form, Button, Modal, Badge } from 'react-bootstrap';
import Link from 'next/link';

// Types
interface AgendaItem {
    id: number;
    time: string;
    category: 'OPENING' | 'TALKSHOW' | 'BREAK' | 'WORKSHOP' | 'PANEL';
    title: string;
    description: string;
    location: string;
}

interface TicketType {
    id: number;
    name: string;
    description: string;
    price: number;
    isTaxable: boolean;
    capacity: number;
    remaining: number;
    maxPerOrder: number;
    salesStart: string;
    salesEnd: string;
    status: 'Active' | 'Inactive';
}

interface SponsorItem {
    id: number;
    name: string;
    type: 'Title Sponsor' | 'Gold Sponsor' | 'Silver Sponsor' | 'Event Partner';
    tagline: string;
    logoUrl?: string;
    logoText?: string;
    logoBg?: string;
    logoColor?: string;
    status: 'Active' | 'Inactive';
}

interface AdImageItem {
    id: number;
    type: 'HERO' | 'SQUARE' | 'RECTANGLE';
    fileName: string;
    resolution: string;
    size: string;
    timeAgo: string;
    status: 'Active' | 'Inactive';
    imageSrc: string;
}

const CreateEventPage: React.FC = () => {
    // Current Step (1 to 5)
    const [currentStep, setCurrentStep] = useState<number>(1);

    // Step 1 State: Event Info
    const [eventName, setEventName] = useState('Summer Music Festival 2026');
    const [category, setCategory] = useState('Music Festival');
    const [organizer, setOrganizer] = useState('Tech Talks ID');
    const [pic, setPic] = useState('LM 1');
    const [startDate, setStartDate] = useState('2026-05-24');
    const [endDate, setEndDate] = useState('2026-05-26');
    const [timeRange, setTimeRange] = useState('10:00 - 22:00');
    const [locationName, setLocationName] = useState('Jakarta International Expo');
    const [fullAddress, setFullAddress] = useState('Jl. Benyamin Sueb No.1, RW.10, Pademangan Timur, Jakarta Utara');
    const [province, setProvince] = useState('DKI Jakarta');
    const [city, setCity] = useState('Jakarta Utara');
    const [latitude, setLatitude] = useState('-6.2088');
    const [longitude, setLongitude] = useState('106.8456');
    const [additionalInfo, setAdditionalInfo] = useState('');

    // Step 2 State: Agenda
    const [agendaList, setAgendaList] = useState<AgendaItem[]>([
        { id: 1, time: '09:00 - 09:30', category: 'OPENING', title: 'Opening Ceremony', description: 'Welcome speech and opening remarks', location: 'Main Stage' },
        { id: 2, time: '09:30 - 10:30', category: 'TALKSHOW', title: 'The Future of Technology', description: 'Keynote talk by industry leaders', location: 'Main Stage' },
        { id: 3, time: '10:30 - 10:45', category: 'BREAK', title: 'Coffee Break', description: 'Networking and refreshment', location: 'Lobby Area' },
        { id: 4, time: '10:45 - 12:00', category: 'WORKSHOP', title: 'Hands-on Workshop', description: 'Practical session and Q&A', location: 'Room 1' },
        { id: 5, time: '13:00 - 14:00', category: 'PANEL', title: 'Panel Discussion', description: 'Industry experts panel', location: 'Main Stage' }
    ]);
    const [showAgendaModal, setShowAgendaModal] = useState(false);
    const [editingAgendaId, setEditingAgendaId] = useState<number | null>(null);
    const [agendaForm, setAgendaForm] = useState<Omit<AgendaItem, 'id'>>({
        time: '14:00 - 15:00',
        category: 'TALKSHOW',
        title: '',
        description: '',
        location: 'Main Stage'
    });

    // Step 3 State: Tickets
    const [ticketList, setTicketList] = useState<TicketType[]>([
        {
            id: 1,
            name: 'General Admission',
            description: 'Akses masuk standar untuk semua peserta',
            price: 0,
            isTaxable: false,
            capacity: 1000,
            remaining: 1000,
            maxPerOrder: 10,
            salesStart: '12 May 2026 09:00',
            salesEnd: '30 Jun 2026 23:59',
            status: 'Active'
        },
        {
            id: 2,
            name: 'VIP',
            description: 'Akses VIP area depan dan merchandise eksklusif',
            price: 250000,
            isTaxable: false,
            capacity: 200,
            remaining: 200,
            maxPerOrder: 5,
            salesStart: '12 May 2026 09:00',
            salesEnd: '30 Jun 2026 23:59',
            status: 'Active'
        },
        {
            id: 3,
            name: 'VVIP',
            description: 'Akses VIP lounge, Meet & Greet, dan merchandise premium',
            price: 500000,
            isTaxable: false,
            capacity: 50,
            remaining: 50,
            maxPerOrder: 2,
            salesStart: '12 May 2026 09:00',
            salesEnd: '30 Jun 2026 23:59',
            status: 'Active'
        }
    ]);
    const [showTicketModal, setShowTicketModal] = useState(false);
    const [ticketForm, setTicketForm] = useState<Omit<TicketType, 'id'>>({
        name: '',
        description: '',
        price: 150000,
        isTaxable: false,
        capacity: 100,
        remaining: 100,
        maxPerOrder: 5,
        salesStart: '12 May 2026 09:00',
        salesEnd: '30 Jun 2026 23:59',
        status: 'Active'
    });

    // Step 4 State: Sponsors
    const [sponsorFilter, setSponsorFilter] = useState<'all' | 'Title Sponsor' | 'Gold Sponsor' | 'Silver Sponsor' | 'Event Partner'>('all');
    const [sponsorList, setSponsorList] = useState<SponsorItem[]>([
        { id: 1, name: 'Bank Central Asia (BCA)', type: 'Title Sponsor', tagline: 'Senantiasa di Sisi Anda', logoText: 'BCA', logoBg: '#005caa', logoColor: '#fff', status: 'Active' },
        { id: 2, name: 'Telkomsel', type: 'Gold Sponsor', tagline: 'Terus Terdepan Menghubungkan Indonesia', logoText: 'Telkomsel', logoBg: '#ed1d24', logoColor: '#fff', status: 'Active' },
        { id: 3, name: 'Mizuno', type: 'Silver Sponsor', tagline: 'REACH BEYOND', logoText: 'Mizuno', logoBg: '#001e62', logoColor: '#fff', status: 'Active' },
        { id: 4, name: 'Grab', type: 'Event Partner', tagline: 'Your Everyday Everything App', logoText: 'Grab', logoBg: '#00b14f', logoColor: '#fff', status: 'Active' }
    ]);
    const [showSponsorModal, setShowSponsorModal] = useState(false);
    const [sponsorForm, setSponsorForm] = useState<Omit<SponsorItem, 'id'>>({
        name: '',
        type: 'Gold Sponsor',
        tagline: '',
        logoText: 'SPONSOR',
        logoBg: '#6366f1',
        logoColor: '#ffffff',
        status: 'Active'
    });

    // Step 5 State: Ad Images
    const [adImages, setAdImages] = useState<AdImageItem[]>([
        { id: 1, type: 'HERO', fileName: 'hero-banner.jpg', resolution: '1920 x 1080', size: '1.2 MB', timeAgo: 'Uploaded just now', status: 'Active', imageSrc: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&auto=format&fit=crop&q=80' },
        { id: 2, type: 'SQUARE', fileName: 'square-poster.png', resolution: '1080 x 1080', size: '800 KB', timeAgo: '2 minutes ago', status: 'Active', imageSrc: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&auto=format&fit=crop&q=80' },
        { id: 3, type: 'RECTANGLE', fileName: 'speaker-banner.jpg', resolution: '1200 x 628', size: '950 KB', timeAgo: '5 minutes ago', status: 'Active', imageSrc: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop&q=80' },
        { id: 4, type: 'RECTANGLE', fileName: 'cta-banner.jpg', resolution: '1200 x 628', size: '1.1 MB', timeAgo: '8 minutes ago', status: 'Active', imageSrc: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600&auto=format&fit=crop&q=80' }
    ]);
    const [adPreviewDevice, setAdPreviewDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

    // Navigation handlers
    const handleNextStep = () => {
        if (currentStep < 5) setCurrentStep(currentStep + 1);
    };

    const handleBackStep = () => {
        if (currentStep > 1) setCurrentStep(currentStep - 1);
    };

    // Helper formatting currency
    const formatCurrency = (val: number) => {
        if (val === 0) return 'FREE';
        return `IDR ${val.toLocaleString('id-ID')}`;
    };

    // Category Badge helper for Agenda
    const getAgendaCategoryBadge = (cat: string) => {
        switch (cat) {
            case 'OPENING': return <span className="badge rounded-pill bg-purple-subtle text-purple px-2 py-1" style={{ backgroundColor: 'rgba(147, 51, 234, 0.12)', color: '#9333ea', fontSize: '0.68rem', fontWeight: 700 }}>OPENING</span>;
            case 'TALKSHOW': return <span className="badge rounded-pill bg-info-subtle text-info px-2 py-1" style={{ fontSize: '0.68rem', fontWeight: 700 }}>TALKSHOW</span>;
            case 'BREAK': return <span className="badge rounded-pill bg-warning-subtle text-warning px-2 py-1" style={{ fontSize: '0.68rem', fontWeight: 700 }}>BREAK</span>;
            case 'WORKSHOP': return <span className="badge rounded-pill bg-success-subtle text-success px-2 py-1" style={{ fontSize: '0.68rem', fontWeight: 700 }}>WORKSHOP</span>;
            case 'PANEL': return <span className="badge rounded-pill bg-primary-subtle text-primary px-2 py-1" style={{ fontSize: '0.68rem', fontWeight: 700 }}>PANEL</span>;
            default: return <span className="badge bg-secondary-subtle text-secondary px-2 py-1" style={{ fontSize: '0.68rem', fontWeight: 700 }}>{cat}</span>;
        }
    };

    // Sponsor Tag helper
    const getSponsorTypeBadge = (type: string) => {
        switch (type) {
            case 'Title Sponsor': return <span className="badge bg-warning-subtle text-warning border border-warning px-2 py-1" style={{ fontSize: '0.68rem', fontWeight: 700 }}>TITLE SPONSOR</span>;
            case 'Gold Sponsor': return <span className="badge bg-amber-subtle text-amber border border-amber px-2 py-1" style={{ backgroundColor: 'rgba(217, 119, 6, 0.12)', color: '#d97706', fontSize: '0.68rem', fontWeight: 700 }}>GOLD SPONSOR</span>;
            case 'Silver Sponsor': return <span className="badge bg-secondary-subtle text-secondary border px-2 py-1" style={{ fontSize: '0.68rem', fontWeight: 700 }}>SILVER SPONSOR</span>;
            case 'Event Partner': return <span className="badge bg-purple-subtle text-purple border border-purple px-2 py-1" style={{ backgroundColor: 'rgba(124, 58, 237, 0.12)', color: '#7c3aed', fontSize: '0.68rem', fontWeight: 700 }}>EVENT PARTNER</span>;
            default: return <span className="badge bg-light text-dark px-2 py-1" style={{ fontSize: '0.68rem' }}>{type}</span>;
        }
    };

    // Calculations for Step 3 Summary
    const totalTicketTypes = ticketList.length;
    const totalCapacity = ticketList.reduce((acc, t) => acc + t.capacity, 0);
    const activeTicketsCount = ticketList.filter(t => t.status === 'Active').length;
    const totalPotentialRevenue = ticketList.reduce((acc, t) => acc + (t.price * t.capacity), 0);

    return (
        <div className="py-2 px-1">
            {/* Top Page Header */}
            <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between mb-3 gap-2">
                <div>
                    <div className="d-flex align-items-center gap-2 mb-1">
                        <Link href="/event" className="text-decoration-none text-muted small hover-text-primary d-inline-flex align-items-center gap-1">
                            <i className="bx bx-arrow-back fs-6"></i> Back to Events
                        </Link>
                    </div>
                    <div className="d-flex align-items-center gap-3">
                        <h4 className="fw-extrabold text-dark mb-0" style={{ fontSize: '1.4rem' }}>
                            {currentStep === 1 && "Create New Event"}
                            {currentStep === 2 && "Create Event"}
                            {currentStep === 3 && "Create New Event"}
                            {currentStep === 4 && "Create New Event"}
                            {currentStep === 5 && "Create New Event"}
                        </h4>
                        <span className="badge bg-success-subtle text-success d-inline-flex align-items-center gap-1 px-2.5 py-1" style={{ fontSize: '0.72rem' }}>
                            <i className="bx bx-check-circle fs-6"></i> Auto saved
                        </span>
                    </div>
                    <p className="text-muted small mb-0 mt-0.5">
                        {currentStep === 1 && "Fill in the details to create your event. You can always edit later."}
                        {currentStep === 2 && "Add agenda items and build your event schedule"}
                        {currentStep === 3 && "Add ticket types and set pricing for your event"}
                        {currentStep === 4 && "Add sponsors who support your event"}
                        {currentStep === 5 && "Upload banners and images to promote your event"}
                    </p>
                </div>
            </div>

            {/* Stepper Navigation Bar */}
            <Card className="border-0 shadow-sm rounded-4 p-3 bg-white mb-4">
                <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
                    {/* Step 1 */}
                    <div className={`d-flex align-items-center gap-2.5 cursor-pointer ${currentStep === 1 ? 'text-primary' : 'text-secondary'}`} onClick={() => setCurrentStep(1)}>
                        <div className={`rounded-circle d-flex align-items-center justify-content-center fw-bold ${currentStep > 1 ? 'bg-success text-white' : currentStep === 1 ? 'bg-primary text-white shadow-sm' : 'bg-light text-muted'}`} style={{ width: '32px', height: '32px', fontSize: '0.85rem' }}>
                            {currentStep > 1 ? <i className="bx bx-check fs-5"></i> : '1'}
                        </div>
                        <div>
                            <div className="fw-bold" style={{ fontSize: '0.88rem' }}>Event Info</div>
                            <div className="text-muted" style={{ fontSize: '0.72rem' }}>
                                {currentStep > 1 ? <span className="text-success fw-semibold">Completed</span> : currentStep === 1 ? 'Basic information' : 'Basic information'}
                            </div>
                        </div>
                    </div>

                    <i className="bx bx-chevron-right text-muted opacity-50 d-none d-md-block fs-5"></i>

                    {/* Step 2 */}
                    <div className={`d-flex align-items-center gap-2.5 cursor-pointer ${currentStep === 2 ? 'text-primary' : 'text-secondary'}`} onClick={() => setCurrentStep(2)}>
                        <div className={`rounded-circle d-flex align-items-center justify-content-center fw-bold ${currentStep > 2 ? 'bg-success text-white' : currentStep === 2 ? 'bg-primary text-white shadow-sm' : 'bg-light text-muted'}`} style={{ width: '32px', height: '32px', fontSize: '0.85rem' }}>
                            {currentStep > 2 ? <i className="bx bx-check fs-5"></i> : '2'}
                        </div>
                        <div>
                            <div className="fw-bold" style={{ fontSize: '0.88rem' }}>Agenda</div>
                            <div className="text-muted" style={{ fontSize: '0.72rem' }}>
                                {currentStep > 2 ? <span className="text-success fw-semibold">Completed</span> : currentStep === 2 ? 'In Progress' : 'Optional'}
                            </div>
                        </div>
                    </div>

                    <i className="bx bx-chevron-right text-muted opacity-50 d-none d-md-block fs-5"></i>

                    {/* Step 3 */}
                    <div className={`d-flex align-items-center gap-2.5 cursor-pointer ${currentStep === 3 ? 'text-primary' : 'text-secondary'}`} onClick={() => setCurrentStep(3)}>
                        <div className={`rounded-circle d-flex align-items-center justify-content-center fw-bold ${currentStep > 3 ? 'bg-success text-white' : currentStep === 3 ? 'bg-primary text-white shadow-sm' : 'bg-light text-muted'}`} style={{ width: '32px', height: '32px', fontSize: '0.85rem' }}>
                            {currentStep > 3 ? <i className="bx bx-check fs-5"></i> : '3'}
                        </div>
                        <div>
                            <div className="fw-bold" style={{ fontSize: '0.88rem' }}>Tickets</div>
                            <div className="text-muted" style={{ fontSize: '0.72rem' }}>
                                {currentStep > 3 ? <span className="text-success fw-semibold">Completed</span> : currentStep === 3 ? 'In Progress' : 'Ticket & pricing'}
                            </div>
                        </div>
                    </div>

                    <i className="bx bx-chevron-right text-muted opacity-50 d-none d-md-block fs-5"></i>

                    {/* Step 4 */}
                    <div className={`d-flex align-items-center gap-2.5 cursor-pointer ${currentStep === 4 ? 'text-primary' : 'text-secondary'}`} onClick={() => setCurrentStep(4)}>
                        <div className={`rounded-circle d-flex align-items-center justify-content-center fw-bold ${currentStep > 4 ? 'bg-success text-white' : currentStep === 4 ? 'bg-primary text-white shadow-sm' : 'bg-light text-muted'}`} style={{ width: '32px', height: '32px', fontSize: '0.85rem' }}>
                            {currentStep > 4 ? <i className="bx bx-check fs-5"></i> : '4'}
                        </div>
                        <div>
                            <div className="fw-bold" style={{ fontSize: '0.88rem' }}>Sponsors</div>
                            <div className="text-muted" style={{ fontSize: '0.72rem' }}>
                                {currentStep > 4 ? <span className="text-success fw-semibold">Completed</span> : currentStep === 4 ? 'In Progress' : 'Optional'}
                            </div>
                        </div>
                    </div>

                    <i className="bx bx-chevron-right text-muted opacity-50 d-none d-md-block fs-5"></i>

                    {/* Step 5 */}
                    <div className={`d-flex align-items-center gap-2.5 cursor-pointer ${currentStep === 5 ? 'text-primary' : 'text-secondary'}`} onClick={() => setCurrentStep(5)}>
                        <div className={`rounded-circle d-flex align-items-center justify-content-center fw-bold ${currentStep === 5 ? 'bg-primary text-white shadow-sm' : 'bg-light text-muted'}`} style={{ width: '32px', height: '32px', fontSize: '0.85rem' }}>
                            5
                        </div>
                        <div>
                            <div className="fw-bold" style={{ fontSize: '0.88rem' }}>Ad Images</div>
                            <div className="text-muted" style={{ fontSize: '0.72rem' }}>
                                {currentStep === 5 ? 'In Progress' : 'Optional'}
                            </div>
                        </div>
                    </div>
                </div>
            </Card>

            {/* STEP CONTENT BODY */}
            {/* STEP 1: EVENT INFO */}
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
                                        value={eventName}
                                        onChange={(e) => setEventName(e.target.value)}
                                        placeholder="Enter event title"
                                        className="py-2"
                                    />
                                </Form.Group>

                                <Row className="g-3 mb-3">
                                    <Col md={6}>
                                        <Form.Label className="fw-semibold small text-dark">Category *</Form.Label>
                                        <Form.Select value={category} onChange={(e) => setCategory(e.target.value)} className="py-2">
                                            <option>Music Festival</option>
                                            <option>Tech Talks</option>
                                            <option>Conference</option>
                                            <option>Exhibition</option>
                                            <option>Workshop</option>
                                        </Form.Select>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Label className="fw-semibold small text-dark">EO / Organizer *</Form.Label>
                                        <Form.Select value={organizer} onChange={(e) => setOrganizer(e.target.value)} className="py-2">
                                            <option>Tech Talks ID</option>
                                            <option>Veentix Organizer</option>
                                            <option>Global Event Corp</option>
                                        </Form.Select>
                                    </Col>
                                </Row>

                                <Row className="g-3 mb-3">
                                    <Col md={4}>
                                        <Form.Label className="fw-semibold small text-dark">PIC (Person in Charge) *</Form.Label>
                                        <Form.Select value={pic} onChange={(e) => setPic(e.target.value)} className="py-2">
                                            <option>LM 1</option>
                                            <option>Sarip Hidayat</option>
                                            <option>Admin Team</option>
                                        </Form.Select>
                                    </Col>
                                    <Col md={4}>
                                        <Form.Label className="fw-semibold small text-dark">Start Date *</Form.Label>
                                        <Form.Control type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="py-2" />
                                    </Col>
                                    <Col md={4}>
                                        <Form.Label className="fw-semibold small text-dark">End Date *</Form.Label>
                                        <Form.Control type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="py-2" />
                                    </Col>
                                </Row>

                                <Form.Group className="mb-4">
                                    <Form.Label className="fw-semibold small text-dark">Time *</Form.Label>
                                    <Form.Control type="text" value={timeRange} onChange={(e) => setTimeRange(e.target.value)} placeholder="Start time - End time (e.g. 10:00 - 22:00)" className="py-2" />
                                </Form.Group>

                                <hr className="my-4" />

                                <h6 className="fw-bold text-primary mb-3" style={{ fontSize: '0.9rem' }}>Location</h6>
                                <Form.Group className="mb-3">
                                    <Form.Label className="fw-semibold small text-dark">Location Name *</Form.Label>
                                    <Form.Control type="text" value={locationName} onChange={(e) => setLocationName(e.target.value)} placeholder="Enter location name" className="py-2" />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <div className="d-flex justify-content-between align-items-center mb-1">
                                        <Form.Label className="fw-semibold small text-dark mb-0">Full Address *</Form.Label>
                                        <span className="text-muted" style={{ fontSize: '0.72rem' }}>{fullAddress.length}/300</span>
                                    </div>
                                    <Form.Control
                                        as="textarea"
                                        rows={3}
                                        value={fullAddress}
                                        onChange={(e) => setFullAddress(e.target.value)}
                                        placeholder="Enter full address"
                                    />
                                </Form.Group>

                                <Row className="g-3 mb-3">
                                    <Col md={3}>
                                        <Form.Label className="fw-semibold small text-dark">Province *</Form.Label>
                                        <Form.Select value={province} onChange={(e) => setProvince(e.target.value)} className="py-2">
                                            <option>DKI Jakarta</option>
                                            <option>Jawa Barat</option>
                                            <option>Banten</option>
                                        </Form.Select>
                                    </Col>
                                    <Col md={3}>
                                        <Form.Label className="fw-semibold small text-dark">City / Regency *</Form.Label>
                                        <Form.Select value={city} onChange={(e) => setCity(e.target.value)} className="py-2">
                                            <option>Jakarta Utara</option>
                                            <option>Jakarta Pusat</option>
                                            <option>Tangerang</option>
                                        </Form.Select>
                                    </Col>
                                    <Col md={3}>
                                        <Form.Label className="fw-semibold small text-dark">Latitude (Optional)</Form.Label>
                                        <Form.Control type="text" value={latitude} onChange={(e) => setLatitude(e.target.value)} className="py-2" />
                                    </Col>
                                    <Col md={3}>
                                        <Form.Label className="fw-semibold small text-dark">Longitude (Optional)</Form.Label>
                                        <Form.Control type="text" value={longitude} onChange={(e) => setLongitude(e.target.value)} className="py-2" />
                                    </Col>
                                </Row>

                                <div className="border rounded-3 p-3 bg-light mt-4">
                                    <div className="d-flex align-items-center justify-content-between cursor-pointer">
                                        <span className="fw-semibold text-dark small">Additional Information (Optional)</span>
                                        <i className="bx bx-chevron-down text-muted fs-5"></i>
                                    </div>
                                </div>
                            </Form>
                        </Card>
                    </Col>

                    {/* Step 1 Right Column: Event Preview & Tips */}
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
                                        <span className="text-muted">Start Date:</span> <strong className="text-dark ms-1">{startDate || '-'}</strong>
                                    </div>
                                </div>
                                <div className="d-flex align-items-center gap-2 py-1 border-bottom">
                                    <i className="bx bx-map text-primary fs-5"></i>
                                    <div>
                                        <span className="text-muted">Location:</span> <strong className="text-dark ms-1">{locationName || '-'}</strong>
                                    </div>
                                </div>
                                <div className="d-flex align-items-center gap-2 py-1">
                                    <i className="bx bx-tag text-primary fs-5"></i>
                                    <div>
                                        <span className="text-muted">Category:</span> <strong className="text-dark ms-1">{category || '-'}</strong>
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

            {/* STEP 2: AGENDA */}
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
                                <div className="d-flex align-items-center gap-2">
                                    <Button variant="outline-secondary" size="sm" className="rounded-3 d-flex align-items-center gap-1">
                                        <i className="bx bx-reorder"></i> Reorder
                                    </Button>
                                    <Button variant="primary" size="sm" className="rounded-3 d-flex align-items-center gap-1" onClick={() => { setEditingAgendaId(null); setShowAgendaModal(true); }}>
                                        <i className="bx bx-plus"></i> Add Agenda Item
                                    </Button>
                                </div>
                            </div>

                            {/* Agenda Items List */}
                            <div className="d-flex flex-column gap-3 mb-4">
                                {agendaList.map((item) => (
                                    <div key={item.id} className="border rounded-4 p-3 bg-white shadow-sm hover-shadow transition-all d-flex align-items-start justify-content-between gap-3">
                                        <div className="d-flex align-items-start gap-3">
                                            <div className="text-muted cursor-move pt-1">
                                                <i className="bx bx-dots-vertical-rounded fs-4"></i>
                                            </div>
                                            <div>
                                                <div className="d-flex align-items-center gap-2 mb-1">
                                                    <span className="fw-bold text-primary" style={{ fontSize: '0.85rem' }}>{item.time}</span>
                                                    {getAgendaCategoryBadge(item.category)}
                                                </div>
                                                <h6 className="fw-bold text-dark mb-1" style={{ fontSize: '0.95rem' }}>{item.title}</h6>
                                                <p className="text-muted small mb-2" style={{ fontSize: '0.8rem', lineHeight: '1.4' }}>{item.description}</p>
                                                <div className="text-muted d-flex align-items-center gap-1" style={{ fontSize: '0.75rem' }}>
                                                    <i className="bx bx-map text-secondary"></i> {item.location}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="d-flex align-items-center gap-1">
                                            <button className="btn btn-sm btn-icon text-muted hover-text-primary p-1" onClick={() => {
                                                setEditingAgendaId(item.id);
                                                setAgendaForm({
                                                    time: item.time,
                                                    category: item.category,
                                                    title: item.title,
                                                    description: item.description,
                                                    location: item.location
                                                });
                                                setShowAgendaModal(true);
                                            }}>
                                                <i className="bx bx-pencil fs-5"></i>
                                            </button>
                                            <button className="btn btn-sm btn-icon text-danger hover-bg-danger-subtle p-1" onClick={() => setAgendaList(agendaList.filter(a => a.id !== item.id))}>
                                                <i className="bx bx-trash fs-5"></i>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <Button
                                variant="outline-primary"
                                className="w-100 py-2.5 rounded-4 d-flex align-items-center justify-content-center gap-2 border-dashed"
                                style={{ borderStyle: 'dashed' }}
                                onClick={() => { setEditingAgendaId(null); setShowAgendaModal(true); }}
                            >
                                <i className="bx bx-plus fs-5"></i> Add Agenda Item
                            </Button>
                        </Card>
                    </Col>

                    {/* Step 2 Right Column: Schedule Preview & Tips */}
                    <Col xl={4} lg={5}>
                        <Card className="border-0 shadow-sm rounded-4 p-3 bg-white mb-4">
                            <div className="d-flex align-items-center justify-content-between pb-2 mb-3 border-bottom">
                                <div className="d-flex align-items-center gap-2">
                                    <i className="bx bx-show fs-5 text-primary"></i>
                                    <h6 className="fw-bold text-dark mb-0" style={{ fontSize: '0.95rem' }}>Schedule Preview</h6>
                                </div>
                            </div>
                            <div className="text-muted small mb-3">Total duration: 5h 00m • {agendaList.length} items</div>

                            <div className="timeline-wrapper position-relative ps-3">
                                <div className="position-absolute top-0 bottom-0 start-0 border-start border-2 border-primary" style={{ left: '8px' }}></div>
                                <div className="d-flex flex-column gap-3">
                                    {agendaList.map((item) => (
                                        <div key={item.id} className="position-relative ps-3">
                                            <div className="position-absolute top-0 start-0 translate-middle-x rounded-circle bg-primary" style={{ width: '10px', height: '10px', left: '-1px', marginTop: '5px' }}></div>
                                            <div className="d-flex align-items-center gap-2 mb-0.5">
                                                <span className="fw-bold text-dark" style={{ fontSize: '0.78rem' }}>{item.time}</span>
                                                {getAgendaCategoryBadge(item.category)}
                                            </div>
                                            <div className="fw-bold text-dark" style={{ fontSize: '0.85rem' }}>{item.title}</div>
                                            <div className="text-muted" style={{ fontSize: '0.72rem' }}>📍 {item.location}</div>
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

            {/* STEP 3: TICKETS */}
            {currentStep === 3 && (
                <Row className="g-4">
                    <Col xl={8} lg={7}>
                        {/* Information banner */}
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
                                <Button variant="outline-primary" size="sm" className="rounded-3 d-flex align-items-center gap-1" onClick={() => setShowTicketModal(true)}>
                                    <i className="bx bx-plus"></i> Add Ticket Type
                                </Button>
                            </div>

                            {/* Ticket List Items */}
                            <div className="d-flex flex-column gap-3 mb-4">
                                {ticketList.map((ticket, idx) => (
                                    <div key={ticket.id} className="border rounded-4 p-3 bg-white shadow-sm">
                                        <div className="d-flex align-items-center justify-content-between mb-2">
                                            <div className="d-flex align-items-center gap-2">
                                                <i className="bx bx-dots-vertical-rounded text-muted fs-4"></i>
                                                <div className="rounded-circle bg-primary-subtle text-primary p-1.5">
                                                    <i className="bx bx-star fs-6"></i>
                                                </div>
                                                <span className="fw-bold text-dark" style={{ fontSize: '1rem' }}>{ticket.name}</span>
                                                <span className="badge bg-success-subtle text-success px-2 py-0.5" style={{ fontSize: '0.68rem' }}>{ticket.status}</span>
                                            </div>
                                            <div className="d-flex align-items-center gap-1">
                                                <button className="btn btn-sm btn-icon text-muted p-1 hover-text-primary"><i className="bx bx-pencil fs-5"></i></button>
                                                <button className="btn btn-sm btn-icon text-danger p-1 hover-bg-danger-subtle" onClick={() => setTicketList(ticketList.filter(t => t.id !== ticket.id))}><i className="bx bx-trash fs-5"></i></button>
                                            </div>
                                        </div>

                                        {idx === 0 ? (
                                            /* Expanded Form for First Item matching screenshot */
                                            <div className="bg-light-subtle rounded-3 p-3 border mt-2">
                                                <Row className="g-3 mb-3">
                                                    <Col md={6}>
                                                        <Form.Label className="fw-semibold small text-dark mb-1">Ticket Name *</Form.Label>
                                                        <Form.Control type="text" value={ticket.name} readOnly className="bg-white" />
                                                    </Col>
                                                    <Col md={6}>
                                                        <Form.Label className="fw-semibold small text-dark mb-1">Description</Form.Label>
                                                        <Form.Control type="text" value={ticket.description} readOnly className="bg-white" />
                                                    </Col>
                                                </Row>
                                                <Row className="g-3 mb-3">
                                                    <Col md={4}>
                                                        <Form.Label className="fw-semibold small text-dark mb-1">Price (IDR) *</Form.Label>
                                                        <div className="input-group">
                                                            <Form.Control type="number" value={ticket.price} readOnly className="bg-white" />
                                                            <span className="input-group-text bg-primary-subtle text-primary fw-bold" style={{ fontSize: '0.75rem' }}>FREE</span>
                                                        </div>
                                                    </Col>
                                                    <Col md={4}>
                                                        <Form.Label className="fw-semibold small text-dark mb-1">Is Taxable?</Form.Label>
                                                        <Form.Select value={ticket.isTaxable ? 'Yes' : 'No'} disabled className="bg-white">
                                                            <option>No</option>
                                                            <option>Yes</option>
                                                        </Form.Select>
                                                    </Col>
                                                    <Col md={4}>
                                                        <Form.Label className="fw-semibold small text-dark mb-1">Final Price (IDR)</Form.Label>
                                                        <Form.Control type="text" value={ticket.price} readOnly className="bg-light" />
                                                    </Col>
                                                </Row>
                                                <Row className="g-3 mb-3">
                                                    <Col md={4}>
                                                        <Form.Label className="fw-semibold small text-dark mb-1">Total Capacity *</Form.Label>
                                                        <Form.Control type="number" value={ticket.capacity} readOnly className="bg-white" />
                                                    </Col>
                                                    <Col md={4}>
                                                        <Form.Label className="fw-semibold small text-dark mb-1">Remaining</Form.Label>
                                                        <Form.Control type="number" value={ticket.remaining} readOnly className="bg-light text-success fw-bold" />
                                                    </Col>
                                                    <Col md={4}>
                                                        <Form.Label className="fw-semibold small text-dark mb-1">Max Per Order</Form.Label>
                                                        <Form.Control type="number" value={ticket.maxPerOrder} readOnly className="bg-white" />
                                                    </Col>
                                                </Row>
                                                <Row className="g-3">
                                                    <Col md={6}>
                                                        <Form.Label className="fw-semibold small text-dark mb-1">Sales Start Date *</Form.Label>
                                                        <Form.Control type="text" value={ticket.salesStart} readOnly className="bg-white" />
                                                    </Col>
                                                    <Col md={6}>
                                                        <Form.Label className="fw-semibold small text-dark mb-1">Sales End Date *</Form.Label>
                                                        <Form.Control type="text" value={ticket.salesEnd} readOnly className="bg-white" />
                                                    </Col>
                                                </Row>
                                            </div>
                                        ) : (
                                            /* Compact view for second and third items */
                                            <div className="d-flex align-items-center justify-content-between text-muted" style={{ fontSize: '0.82rem' }}>
                                                <div>{ticket.description}</div>
                                                <div className="d-flex align-items-center gap-3">
                                                    <span className="fw-bold text-dark">{formatCurrency(ticket.price)}</span>
                                                    <span className="badge bg-light text-muted border">{ticket.capacity} available</span>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>

                            <Button
                                variant="outline-primary"
                                className="w-100 py-2.5 rounded-4 d-flex align-items-center justify-content-center gap-2 border-dashed"
                                style={{ borderStyle: 'dashed' }}
                                onClick={() => setShowTicketModal(true)}
                            >
                                <i className="bx bx-plus fs-5"></i> Add Another Ticket Type
                            </Button>
                        </Card>
                    </Col>

                    {/* Step 3 Right Column: Ticket Preview & Summary */}
                    <Col xl={4} lg={5}>
                        <Card className="border-0 shadow-sm rounded-4 p-3 bg-white mb-4">
                            <div className="d-flex align-items-center justify-content-between pb-2 mb-3 border-bottom">
                                <div className="d-flex align-items-center gap-2">
                                    <i className="bx bx-show fs-5 text-primary"></i>
                                    <h6 className="fw-bold text-dark mb-0" style={{ fontSize: '0.95rem' }}>Ticket Preview</h6>
                                </div>
                                <span className="text-muted" style={{ fontSize: '0.75rem' }}>{ticketList.length} ticket types</span>
                            </div>

                            <div className="d-flex flex-column gap-2 mb-3">
                                {ticketList.map((t) => (
                                    <div key={t.id} className="border rounded-3 p-3 bg-white shadow-sm d-flex align-items-center justify-content-between">
                                        <div>
                                            <div className="d-flex align-items-center gap-2">
                                                <i className={`bx ${t.name.includes('VIP') ? 'bx-crown text-amber' : 'bx-star text-primary'}`}></i>
                                                <span className="fw-bold text-dark" style={{ fontSize: '0.88rem' }}>{t.name}</span>
                                                <span className="badge bg-success-subtle text-success py-0.5 px-1.5" style={{ fontSize: '0.62rem' }}>{t.status}</span>
                                            </div>
                                            <div className="text-muted mt-1" style={{ fontSize: '0.72rem' }}>
                                                {t.capacity} available • 12 May - 30 Jun 2026
                                            </div>
                                        </div>
                                        <div className="fw-extrabold text-primary" style={{ fontSize: '0.9rem' }}>
                                            {formatCurrency(t.price)}
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

            {/* STEP 4: SPONSORS */}
            {currentStep === 4 && (
                <Row className="g-4">
                    <Col xl={8} lg={7}>
                        {/* Notice Banner */}
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
                            <button className="btn btn-sm btn-icon text-muted border-0"><i className="bx bx-x fs-4"></i></button>
                        </div>

                        <Card className="border-0 shadow-sm rounded-4 p-4 bg-white mb-4">
                            <div className="d-flex align-items-center justify-content-between border-bottom pb-3 mb-3">
                                <div>
                                    <h6 className="fw-bold text-dark mb-0" style={{ fontSize: '1.1rem' }}>Sponsors & Partners</h6>
                                    <p className="text-muted small mb-0 mt-0.5">Add and manage sponsors for your event</p>
                                </div>
                                <Button variant="outline-primary" size="sm" className="rounded-3 d-flex align-items-center gap-1" onClick={() => setShowSponsorModal(true)}>
                                    <i className="bx bx-plus"></i> Add Sponsor
                                </Button>
                            </div>

                            {/* Filter Tabs */}
                            <div className="d-flex align-items-center gap-2 mb-3 overflow-auto pb-1" style={{ fontSize: '0.8rem' }}>
                                {[
                                    { key: 'all', label: `All Sponsors (${sponsorList.length})` },
                                    { key: 'Title Sponsor', label: 'Title Sponsor (1)' },
                                    { key: 'Gold Sponsor', label: 'Gold (1)' },
                                    { key: 'Silver Sponsor', label: 'Silver (1)' },
                                    { key: 'Event Partner', label: 'Partner (1)' }
                                ].map((tab) => (
                                    <button
                                        key={tab.key}
                                        className={`btn btn-sm rounded-pill px-3 py-1 fw-semibold ${sponsorFilter === tab.key ? 'btn-primary' : 'btn-light border text-secondary'}`}
                                        onClick={() => setSponsorFilter(tab.key as any)}
                                    >
                                        {tab.label}
                                    </button>
                                ))}
                            </div>

                            {/* Sponsor List */}
                            <div className="d-flex flex-column gap-3 mb-4">
                                {sponsorList
                                    .filter(s => sponsorFilter === 'all' || s.type === sponsorFilter)
                                    .map((sponsor) => (
                                        <div key={sponsor.id} className="border rounded-4 p-3 bg-white shadow-sm d-flex align-items-center justify-content-between">
                                            <div className="d-flex align-items-center gap-3">
                                                <i className="bx bx-dots-vertical-rounded text-muted fs-4"></i>
                                                <div className="rounded-3 p-2 text-white fw-bold d-flex align-items-center justify-content-center shadow-sm" style={{ width: '60px', height: '40px', backgroundColor: sponsor.logoBg || '#6366f1', fontSize: '0.75rem' }}>
                                                    {sponsor.logoText || sponsor.name.substring(0, 4)}
                                                </div>
                                                <div>
                                                    <div className="d-flex align-items-center gap-2 mb-0.5">
                                                        {getSponsorTypeBadge(sponsor.type)}
                                                    </div>
                                                    <h6 className="fw-bold text-dark mb-0" style={{ fontSize: '0.92rem' }}>{sponsor.name}</h6>
                                                    <small className="text-muted" style={{ fontSize: '0.75rem' }}>{sponsor.tagline}</small>
                                                </div>
                                            </div>
                                            <div className="d-flex align-items-center gap-3">
                                                <span className="badge bg-success-subtle text-success py-1 px-2" style={{ fontSize: '0.7rem' }}>● Active</span>
                                                <button className="btn btn-sm btn-icon text-muted p-1 hover-text-primary"><i className="bx bx-pencil fs-5"></i></button>
                                                <button className="btn btn-sm btn-icon text-danger p-1 hover-bg-danger-subtle" onClick={() => setSponsorList(sponsorList.filter(s => s.id !== sponsor.id))}><i className="bx bx-trash fs-5"></i></button>
                                            </div>
                                        </div>
                                    ))}
                            </div>

                            <Button
                                variant="outline-primary"
                                className="w-100 py-2.5 rounded-4 d-flex align-items-center justify-content-center gap-2 border-dashed"
                                style={{ borderStyle: 'dashed' }}
                                onClick={() => setShowSponsorModal(true)}
                            >
                                <i className="bx bx-plus fs-5"></i> Add Another Sponsor
                            </Button>
                        </Card>
                    </Col>

                    {/* Step 4 Right Column: Sponsor Preview */}
                    <Col xl={4} lg={5}>
                        <Card className="border-0 shadow-sm rounded-4 p-3 bg-white mb-4">
                            <div className="d-flex align-items-center justify-content-between pb-2 mb-3 border-bottom">
                                <div className="d-flex align-items-center gap-2">
                                    <i className="bx bx-show fs-5 text-primary"></i>
                                    <h6 className="fw-bold text-dark mb-0" style={{ fontSize: '0.95rem' }}>Sponsor Preview</h6>
                                </div>
                            </div>
                            <p className="text-muted small mb-3">This is how sponsors will appear on your event page</p>

                            <div className="border rounded-3 p-3 bg-light-subtle text-center d-flex flex-column gap-3 mb-3">
                                <div>
                                    <div className="text-muted uppercase fw-bold mb-1" style={{ fontSize: '0.65rem', letterSpacing: '0.5px' }}>Title Sponsor</div>
                                    <div className="d-flex justify-content-center">
                                        <div className="rounded-3 p-2 bg-primary text-white fw-extrabold shadow-sm" style={{ minWidth: '120px', fontSize: '1rem', backgroundColor: '#005caa' }}>
                                            BCA
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <div className="text-muted uppercase fw-bold mb-1" style={{ fontSize: '0.65rem', letterSpacing: '0.5px' }}>Gold Sponsor</div>
                                    <div className="d-flex justify-content-center">
                                        <div className="fw-extrabold text-danger" style={{ fontSize: '1.1rem' }}>
                                            Telkomsel
                                        </div>
                                    </div>
                                </div>

                                <Row className="g-2 pt-2 border-top">
                                    <Col xs={6}>
                                        <div className="text-muted uppercase fw-bold mb-1" style={{ fontSize: '0.62rem' }}>Silver Sponsor</div>
                                        <div className="fw-bold text-dark" style={{ fontSize: '0.85rem' }}>Mizuno</div>
                                    </Col>
                                    <Col xs={6}>
                                        <div className="text-muted uppercase fw-bold mb-1" style={{ fontSize: '0.62rem' }}>Event Partner</div>
                                        <div className="fw-bold text-success" style={{ fontSize: '0.85rem' }}>Grab</div>
                                    </Col>
                                </Row>
                            </div>
                            <small className="text-muted italic text-center d-block" style={{ fontSize: '0.7rem' }}>* Order can be changed by drag & drop</small>
                        </Card>

                        <Card className="border-0 shadow-sm rounded-4 p-3 bg-primary-subtle text-primary border-primary">
                            <div className="d-flex align-items-center gap-2 mb-2">
                                <i className="bx bx-bulb fs-5"></i>
                                <h6 className="fw-bold mb-0" style={{ fontSize: '0.9rem' }}>Tips</h6>
                            </div>
                            <ul className="list-unstyled mb-0 d-flex flex-column gap-1.5" style={{ fontSize: '0.78rem' }}>
                                <li className="d-flex align-items-center gap-2"><i className="bx bx-check-circle text-primary fs-6"></i> Add your main sponsor as Title Sponsor</li>
                                <li className="d-flex align-items-center gap-2"><i className="bx bx-check-circle text-primary fs-6"></i> Use high resolution logos (PNG/SVG recommended)</li>
                                <li className="d-flex align-items-center gap-2"><i className="bx bx-check-circle text-primary fs-6"></i> Sponsors will be displayed on your event page</li>
                                <li className="d-flex align-items-center gap-2"><i className="bx bx-check-circle text-primary fs-6"></i> You can change order by dragging items</li>
                            </ul>
                        </Card>
                    </Col>
                </Row>
            )}

            {/* STEP 5: AD IMAGES */}
            {currentStep === 5 && (
                <Row className="g-4">
                    <Col xl={8} lg={7}>
                        {/* Banner Notice */}
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
                            <button className="btn btn-sm btn-icon text-muted border-0"><i className="bx bx-x fs-4"></i></button>
                        </div>

                        <Card className="border-0 shadow-sm rounded-4 p-4 bg-white mb-4">
                            <div className="d-flex align-items-center justify-content-between border-bottom pb-3 mb-3">
                                <div>
                                    <h6 className="fw-bold text-dark mb-0" style={{ fontSize: '1.1rem' }}>Upload Ad Images</h6>
                                    <p className="text-muted small mb-0 mt-0.5">Recommended format: JPG, PNG or WebP. Max file size 5MB.</p>
                                </div>
                                <Button variant="outline-primary" size="sm" className="rounded-3 d-flex align-items-center gap-1">
                                    <i className="bx bx-upload"></i> Upload Image
                                </Button>
                            </div>

                            {/* Drag & Drop Box */}
                            <div className="border rounded-4 p-4 text-center bg-light-subtle mb-4 cursor-pointer hover-bg-light transition-all" style={{ borderStyle: 'dashed', borderWidth: '2px' }}>
                                <div className="rounded-circle bg-primary-subtle text-primary p-3 d-inline-flex mb-2">
                                    <i className="bx bx-cloud-upload fs-1"></i>
                                </div>
                                <h6 className="fw-bold text-dark mb-1" style={{ fontSize: '0.95rem' }}>Drag and drop your files here</h6>
                                <p className="text-muted small mb-3">or click to browse</p>
                                <span className="badge bg-light text-muted border px-2.5 py-1">Max size 5MB per file • JPG, PNG, WEBP</span>
                            </div>

                            {/* Recommended sizes pills */}
                            <div className="d-flex align-items-center gap-2 mb-4 flex-wrap" style={{ fontSize: '0.78rem' }}>
                                <span className="text-muted">Recommended sizes:</span>
                                <span className="badge bg-light text-secondary border px-2 py-1">Hero Banner 1920x1080px</span>
                                <span className="badge bg-light text-secondary border px-2 py-1">Square Banner 1080x1080px</span>
                                <span className="badge bg-light text-secondary border px-2 py-1">Rectangle 1200x628px</span>
                            </div>

                            {/* Uploaded Images List Grid */}
                            <div className="d-flex align-items-center justify-content-between mb-3 border-top pt-3">
                                <h6 className="fw-bold text-dark mb-0" style={{ fontSize: '0.95rem' }}>Uploaded Images ({adImages.length})</h6>
                                <select className="form-select form-select-sm border bg-light text-muted w-auto" style={{ fontSize: '0.78rem' }}>
                                    <option>Sort by: Newest</option>
                                    <option>Sort by: Type</option>
                                </select>
                            </div>

                            <Row className="g-3 mb-4">
                                {adImages.map((img) => (
                                    <Col md={6} key={img.id}>
                                        <div className="border rounded-4 p-3 bg-white shadow-sm h-100 d-flex flex-column justify-content-between">
                                            <div>
                                                <div className="position-relative rounded-3 overflow-hidden mb-2" style={{ height: '120px' }}>
                                                    <img src={img.imageSrc} alt={img.fileName} className="w-100 h-100 object-fit-cover" />
                                                    <span className="position-absolute top-0 start-0 m-2 badge bg-dark opacity-75 text-white" style={{ fontSize: '0.65rem' }}>
                                                        {img.type}
                                                    </span>
                                                </div>
                                                <div className="fw-bold text-dark mb-0.5 text-truncate" style={{ fontSize: '0.85rem' }}>{img.fileName}</div>
                                                <div className="d-flex justify-content-between text-muted" style={{ fontSize: '0.72rem' }}>
                                                    <span>{img.resolution}</span>
                                                    <span>{img.size} • {img.timeAgo}</span>
                                                </div>
                                            </div>

                                            <div className="d-flex align-items-center justify-content-between border-top pt-2 mt-2">
                                                <span className="badge bg-success-subtle text-success px-2 py-0.5" style={{ fontSize: '0.68rem' }}>● Active</span>
                                                <div className="d-flex align-items-center gap-1">
                                                    <button className="btn btn-sm btn-icon text-muted p-1 hover-text-primary"><i className="bx bx-pencil fs-5"></i></button>
                                                    <button className="btn btn-sm btn-icon text-danger p-1 hover-bg-danger-subtle" onClick={() => setAdImages(adImages.filter(a => a.id !== img.id))}><i className="bx bx-trash fs-5"></i></button>
                                                </div>
                                            </div>
                                        </div>
                                    </Col>
                                ))}
                            </Row>

                            {/* Banner Tip Bottom */}
                            <div className="border rounded-3 p-3 bg-light-subtle d-flex align-items-center justify-content-between text-muted" style={{ fontSize: '0.78rem' }}>
                                <div className="d-flex align-items-center gap-2">
                                    <i className="bx bx-bulb text-warning fs-5"></i>
                                    <span>Tips: Use high quality images with clear text and good contrast for the best result across all devices.</span>
                                </div>
                                <i className="bx bx-x cursor-pointer fs-5"></i>
                            </div>
                        </Card>
                    </Col>

                    {/* Step 5 Right Column: Preview on Event Page */}
                    <Col xl={4} lg={5}>
                        <Card className="border-0 shadow-sm rounded-4 p-3 bg-white mb-4">
                            <div className="d-flex align-items-center justify-content-between pb-2 mb-3 border-bottom">
                                <div className="d-flex align-items-center gap-2">
                                    <i className="bx bx-show fs-5 text-primary"></i>
                                    <h6 className="fw-bold text-dark mb-0" style={{ fontSize: '0.95rem' }}>Preview on Event Page</h6>
                                </div>
                            </div>

                            {/* Event Banner Card Preview */}
                            <div className="border shadow-sm rounded-4 overflow-hidden bg-dark text-white mb-3">
                                <div className="position-relative" style={{ height: '140px' }}>
                                    <img src={adImages[0]?.imageSrc || "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&auto=format&fit=crop&q=80"} alt="Header Preview" className="w-100 h-100 object-fit-cover opacity-75" />
                                    <div className="position-absolute top-0 start-0 end-0 p-3 bg-gradient-to-b text-white">
                                        <h6 className="fw-extrabold text-white mb-0" style={{ letterSpacing: '1px' }}>TECH TALKS 2026</h6>
                                    </div>
                                </div>
                                <div className="p-3 bg-white text-dark">
                                    <div className="d-flex gap-2 mb-2">
                                        <div className="bg-primary-subtle rounded-3" style={{ width: '40px', height: '40px' }}></div>
                                        <div className="bg-light rounded-3 flex-grow-1" style={{ height: '40px' }}></div>
                                    </div>
                                    <div className="d-flex gap-2">
                                        <div className="bg-light rounded-3" style={{ width: '30%', height: '30px' }}></div>
                                        <div className="bg-light rounded-3" style={{ width: '30%', height: '30px' }}></div>
                                        <div className="bg-light rounded-3" style={{ width: '30%', height: '30px' }}></div>
                                    </div>
                                </div>
                            </div>

                            {/* Device view switcher */}
                            <div className="d-flex align-items-center justify-content-center gap-3 bg-light p-2 rounded-3 mb-3" style={{ fontSize: '0.8rem' }}>
                                <span className={`cursor-pointer d-flex align-items-center gap-1 px-2 py-1 rounded ${adPreviewDevice === 'desktop' ? 'bg-white text-primary shadow-sm fw-bold' : 'text-muted'}`} onClick={() => setAdPreviewDevice('desktop')}>
                                    <i className="bx bx-laptop fs-5"></i> Desktop
                                </span>
                                <span className={`cursor-pointer d-flex align-items-center gap-1 px-2 py-1 rounded ${adPreviewDevice === 'tablet' ? 'bg-white text-primary shadow-sm fw-bold' : 'text-muted'}`} onClick={() => setAdPreviewDevice('tablet')}>
                                    <i className="bx bx-tab fs-5"></i> Tablet
                                </span>
                                <span className={`cursor-pointer d-flex align-items-center gap-1 px-2 py-1 rounded ${adPreviewDevice === 'mobile' ? 'bg-white text-primary shadow-sm fw-bold' : 'text-muted'}`} onClick={() => setAdPreviewDevice('mobile')}>
                                    <i className="bx bx-mobile-alt fs-5"></i> Mobile
                                </span>
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
                                <li className="d-flex align-items-center gap-2"><i className="bx bx-check-circle text-primary fs-6"></i> Images will be optimized automatically</li>
                            </ul>
                        </Card>
                    </Col>
                </Row>
            )}

            {/* BOTTOM NAVIGATION FOOTER */}
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
                            <Button variant="primary" className="rounded-pill px-4 d-flex align-items-center gap-1 fw-bold bg-primary border-0" style={{ background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)' }}>
                                Create Event <i className="bx bx-check fs-5"></i>
                            </Button>
                        )}
                    </div>
                </div>
            </Card>

            {/* MODAL: ADD AGENDA ITEM */}
            <Modal show={showAgendaModal} onHide={() => setShowAgendaModal(false)} centered>
                <Modal.Header closeButton className="border-0 pb-0">
                    <Modal.Title className="fw-bold text-dark fs-5">
                        {editingAgendaId ? "Edit Agenda Item" : "Add Agenda Item"}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="pt-3">
                    <Form>
                        <Row className="g-3 mb-3">
                            <Col md={6}>
                                <Form.Label className="fw-semibold small text-dark">Time Range *</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={agendaForm.time}
                                    onChange={(e) => setAgendaForm({ ...agendaForm, time: e.target.value })}
                                    placeholder="e.g. 09:00 - 10:00"
                                />
                            </Col>
                            <Col md={6}>
                                <Form.Label className="fw-semibold small text-dark">Category *</Form.Label>
                                <Form.Select
                                    value={agendaForm.category}
                                    onChange={(e) => setAgendaForm({ ...agendaForm, category: e.target.value as any })}
                                >
                                    <option value="OPENING">OPENING</option>
                                    <option value="TALKSHOW">TALKSHOW</option>
                                    <option value="BREAK">BREAK</option>
                                    <option value="WORKSHOP">WORKSHOP</option>
                                    <option value="PANEL">PANEL</option>
                                </Form.Select>
                            </Col>
                        </Row>

                        <Form.Group className="mb-3">
                            <Form.Label className="fw-semibold small text-dark">Title *</Form.Label>
                            <Form.Control
                                type="text"
                                value={agendaForm.title}
                                onChange={(e) => setAgendaForm({ ...agendaForm, title: e.target.value })}
                                placeholder="Session / activity title"
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label className="fw-semibold small text-dark">Description</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={2}
                                value={agendaForm.description}
                                onChange={(e) => setAgendaForm({ ...agendaForm, description: e.target.value })}
                                placeholder="Brief description of the session"
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label className="fw-semibold small text-dark">Location / Room</Form.Label>
                            <Form.Control
                                type="text"
                                value={agendaForm.location}
                                onChange={(e) => setAgendaForm({ ...agendaForm, location: e.target.value })}
                                placeholder="e.g. Main Stage, Room 1"
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer className="border-0 pt-0">
                    <Button variant="light" className="rounded-pill px-3" onClick={() => setShowAgendaModal(false)}>
                        Cancel
                    </Button>
                    <Button
                        variant="primary"
                        className="rounded-pill px-4"
                        onClick={() => {
                            if (editingAgendaId) {
                                setAgendaList(agendaList.map(a => a.id === editingAgendaId ? { ...agendaForm, id: editingAgendaId } : a));
                            } else {
                                setAgendaList([...agendaList, { ...agendaForm, id: Date.now() }]);
                            }
                            setShowAgendaModal(false);
                        }}
                    >
                        Save Agenda Item
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* MODAL: ADD TICKET TYPE */}
            <Modal show={showTicketModal} onHide={() => setShowTicketModal(false)} centered size="lg">
                <Modal.Header closeButton className="border-0 pb-0">
                    <Modal.Title className="fw-bold text-dark fs-5">Add Ticket Category</Modal.Title>
                </Modal.Header>
                <Modal.Body className="pt-3">
                    <Form>
                        <Row className="g-3 mb-3">
                            <Col md={6}>
                                <Form.Label className="fw-semibold small text-dark">Ticket Name *</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={ticketForm.name}
                                    onChange={(e) => setTicketForm({ ...ticketForm, name: e.target.value })}
                                    placeholder="e.g. Early Bird Pass"
                                />
                            </Col>
                            <Col md={6}>
                                <Form.Label className="fw-semibold small text-dark">Price (IDR) *</Form.Label>
                                <Form.Control
                                    type="number"
                                    value={ticketForm.price}
                                    onChange={(e) => setTicketForm({ ...ticketForm, price: Number(e.target.value) })}
                                    placeholder="0 for Free ticket"
                                />
                            </Col>
                        </Row>

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
                            <Col md={6}>
                                <Form.Label className="fw-semibold small text-dark">Total Capacity *</Form.Label>
                                <Form.Control
                                    type="number"
                                    value={ticketForm.capacity}
                                    onChange={(e) => setTicketForm({ ...ticketForm, capacity: Number(e.target.value), remaining: Number(e.target.value) })}
                                />
                            </Col>
                            <Col md={6}>
                                <Form.Label className="fw-semibold small text-dark">Max Per Order</Form.Label>
                                <Form.Control
                                    type="number"
                                    value={ticketForm.maxPerOrder}
                                    onChange={(e) => setTicketForm({ ...ticketForm, maxPerOrder: Number(e.target.value) })}
                                />
                            </Col>
                        </Row>
                    </Form>
                </Modal.Body>
                <Modal.Footer className="border-0 pt-0">
                    <Button variant="light" className="rounded-pill px-3" onClick={() => setShowTicketModal(false)}>
                        Cancel
                    </Button>
                    <Button
                        variant="primary"
                        className="rounded-pill px-4"
                        onClick={() => {
                            setTicketList([...ticketList, { ...ticketForm, id: Date.now(), remaining: ticketForm.capacity }]);
                            setShowTicketModal(false);
                        }}
                    >
                        Save Ticket Type
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* MODAL: ADD SPONSOR */}
            <Modal show={showSponsorModal} onHide={() => setShowSponsorModal(false)} centered>
                <Modal.Header closeButton className="border-0 pb-0">
                    <Modal.Title className="fw-bold text-dark fs-5">Add Sponsor / Partner</Modal.Title>
                </Modal.Header>
                <Modal.Body className="pt-3">
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label className="fw-semibold small text-dark">Sponsor / Partner Name *</Form.Label>
                            <Form.Control
                                type="text"
                                value={sponsorForm.name}
                                onChange={(e) => setSponsorForm({ ...sponsorForm, name: e.target.value })}
                                placeholder="e.g. Bank Central Asia"
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label className="fw-semibold small text-dark">Sponsor Type *</Form.Label>
                            <Form.Select
                                value={sponsorForm.type}
                                onChange={(e) => setSponsorForm({ ...sponsorForm, type: e.target.value as any })}
                            >
                                <option value="Title Sponsor">Title Sponsor</option>
                                <option value="Gold Sponsor">Gold Sponsor</option>
                                <option value="Silver Sponsor">Silver Sponsor</option>
                                <option value="Event Partner">Event Partner</option>
                            </Form.Select>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label className="fw-semibold small text-dark">Tagline / Slogan</Form.Label>
                            <Form.Control
                                type="text"
                                value={sponsorForm.tagline}
                                onChange={(e) => setSponsorForm({ ...sponsorForm, tagline: e.target.value })}
                                placeholder="e.g. Senantiasa di Sisi Anda"
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer className="border-0 pt-0">
                    <Button variant="light" className="rounded-pill px-3" onClick={() => setShowSponsorModal(false)}>
                        Cancel
                    </Button>
                    <Button
                        variant="primary"
                        className="rounded-pill px-4"
                        onClick={() => {
                            setSponsorList([...sponsorList, { ...sponsorForm, id: Date.now(), logoText: sponsorForm.name.substring(0, 4) }]);
                            setShowSponsorModal(false);
                        }}
                    >
                        Save Sponsor
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default CreateEventPage;
