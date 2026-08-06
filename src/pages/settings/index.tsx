/**
 * EO Organization Settings Page - PDF Page 10 High Fidelity Implementation
 */

import React, { useState } from 'react';
import { Card, Row, Col, Form, Button, Badge } from 'react-bootstrap';

const SettingsPage: React.FC = () => {
    const [activeSection, setActiveSection] = useState('profile');
    const [orgName, setOrgName] = useState('Veentix Event Organizer');
    const [tagline, setTagline] = useState('Create. Connect. Celebrate.');
    const [description, setDescription] = useState('Platform ticketing & event management yang membantu Event Organizer membuat, menjual, dan mengelola event dengan mudah dan profesional.');
    const [email, setEmail] = useState('hello@veentix.com');
    const [phone, setPhone] = useState('+62 812-3456-7890');
    const [website, setWebsite] = useState('https://www.veentix.com');
    const [address, setAddress] = useState('Jl. Jend. Sudirman Kav. 52-53 Jakarta Selatan, DKI Jakarta 12190');
    const [country, setCountry] = useState('Indonesia');
    const [timezone, setTimezone] = useState('(GMT+7) Jakarta');
    const [industry, setIndustry] = useState('Event & Entertainment');

    const subMenuItems = [
        { id: 'profile', label: 'Organization Profile', icon: 'bx-building' },
        { id: 'team', label: 'Team Members', icon: 'bx-group' },
        { id: 'billing', label: 'Billing & Subscription', icon: 'bx-credit-card' },
        { id: 'payment', label: 'Payment Methods', icon: 'bx-wallet' },
        { id: 'checkout', label: 'Checkout Settings', icon: 'bx-cart' },
        { id: 'notifications', label: 'Notifications', icon: 'bx-bell' },
        { id: 'email', label: 'Email Templates', icon: 'bx-envelope' },
        { id: 'roles', label: 'Roles & Permissions', icon: 'bx-shield-quarter' },
        { id: 'integrations', label: 'Integrations', icon: 'bx-plug' },
        { id: 'security', label: 'Security', icon: 'bx-lock-alt' },
        { id: 'api', label: 'API Keys', icon: 'bx-code-alt' },
        { id: 'audit', label: 'Audit Logs', icon: 'bx-history' }
    ];

    return (
        <div className="py-3 px-1">
            {/* HEADER */}
            <div className="mb-3">
                <h4 className="fw-extrabold text-dark mb-1" style={{ fontSize: '1.45rem' }}>Settings</h4>
                <p className="text-muted small mb-0">Kelola pengaturan akun, event organizer, pembayaran, dan notifikasi.</p>
            </div>

            <Row className="g-4">
                {/* Left Side: Settings Vertical Sub-Menu */}
                <Col xl={3} lg={4}>
                    <Card className="border-0 shadow-sm rounded-4 p-2 bg-white mb-3">
                        <div className="d-flex flex-column gap-1">
                            {subMenuItems.map((item) => (
                                <button
                                    key={item.id}
                                    className={`btn btn-sm text-start d-flex align-items-center gap-2 py-2 px-3 border-0 rounded-3 ${activeSection === item.id ? 'btn-primary' : 'btn-light text-muted bg-transparent hover-bg-light'}`}
                                    onClick={() => setActiveSection(item.id)}
                                    style={{ fontSize: '0.85rem' }}
                                >
                                    <i className={`bx ${item.icon} fs-5`}></i>
                                    <span>{item.label}</span>
                                </button>
                            ))}
                        </div>
                    </Card>
                </Col>

                {/* Middle: Organization Profile Form */}
                <Col xl={6} lg={5}>
                    <Card className="border-0 shadow-sm rounded-4 p-4 bg-white mb-4">
                        <div className="d-flex align-items-center justify-content-between border-bottom pb-3 mb-3">
                            <div>
                                <h6 className="fw-bold text-dark mb-0" style={{ fontSize: '1.05rem' }}>Organization Profile</h6>
                                <span className="text-muted small">Informasi dasar tentang organisasi Anda.</span>
                            </div>
                            <Button variant="outline-primary" size="sm" className="rounded-pill px-3">
                                <i className="bx bx-edit me-1"></i> Edit Profile
                            </Button>
                        </div>

                        <Form>
                            {/* Logo Uploader */}
                            <Form.Group className="mb-4">
                                <Form.Label className="fw-bold small text-dark mb-1">Logo</Form.Label>
                                <div className="d-flex align-items-center gap-3">
                                    <div className="brand-logo-icon rounded-3 p-3 text-white fw-extrabold d-flex align-items-center justify-content-center" style={{ width: '64px', height: '64px', fontSize: '1.8rem', background: 'black' }}>
                                        V
                                    </div>
                                    <div>
                                        <button type="button" className="btn btn-sm btn-outline-primary rounded-pill px-3 mb-1" style={{ fontSize: '0.78rem' }}>
                                            <i className="bx bx-upload me-1"></i> Upload Logo
                                        </button>
                                        <p className="text-muted mb-0" style={{ fontSize: '0.72rem' }}>PNG atau JPG, maks. 2MB</p>
                                    </div>
                                </div>
                            </Form.Group>

                            {/* Org Name & Tagline */}
                            <Form.Group className="mb-3">
                                <Form.Label className="fw-bold small text-dark mb-1">Organization Name</Form.Label>
                                <Form.Control type="text" value={orgName} onChange={(e) => setOrgName(e.target.value)} />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label className="fw-bold small text-dark mb-1">Tagline (Optional)</Form.Label>
                                <Form.Control type="text" value={tagline} onChange={(e) => setTagline(e.target.value)} />
                            </Form.Group>

                            {/* Description */}
                            <Form.Group className="mb-3">
                                <div className="d-flex justify-content-between align-items-center mb-1">
                                    <Form.Label className="fw-bold small text-dark mb-0">Description</Form.Label>
                                    <span className="text-muted" style={{ fontSize: '0.72rem' }}>{description.length}/300</span>
                                </div>
                                <Form.Control as="textarea" rows={3} value={description} onChange={(e) => setDescription(e.target.value)} />
                            </Form.Group>

                            {/* Contact Details */}
                            <Row className="g-3 mb-3">
                                <Col md={6}>
                                    <Form.Label className="fw-bold small text-dark mb-1">Email</Form.Label>
                                    <Form.Control type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                                </Col>
                                <Col md={6}>
                                    <Form.Label className="fw-bold small text-dark mb-1">Phone</Form.Label>
                                    <Form.Control type="text" value={phone} onChange={(e) => setPhone(e.target.value)} />
                                </Col>
                            </Row>

                            <Form.Group className="mb-3">
                                <Form.Label className="fw-bold small text-dark mb-1">Address</Form.Label>
                                <Form.Control type="text" value={address} onChange={(e) => setAddress(e.target.value)} />
                            </Form.Group>

                            <Row className="g-3 mb-3">
                                <Col md={6}>
                                    <Form.Label className="fw-bold small text-dark mb-1">Country</Form.Label>
                                    <Form.Select value={country} onChange={(e) => setCountry(e.target.value)}>
                                        <option>Indonesia</option>
                                        <option>Singapore</option>
                                    </Form.Select>
                                </Col>
                                <Col md={6}>
                                    <Form.Label className="fw-bold small text-dark mb-1">Time Zone</Form.Label>
                                    <Form.Select value={timezone} onChange={(e) => setTimezone(e.target.value)}>
                                        <option>(GMT+7) Jakarta</option>
                                        <option>(GMT+8) Bali</option>
                                    </Form.Select>
                                </Col>
                            </Row>

                            <Form.Group className="mb-4">
                                <Form.Label className="fw-bold small text-dark mb-1">Industry</Form.Label>
                                <Form.Select value={industry} onChange={(e) => setIndustry(e.target.value)}>
                                    <option>Event & Entertainment</option>
                                    <option>Education</option>
                                    <option>Technology</option>
                                </Form.Select>
                            </Form.Group>

                            <div className="text-end border-top pt-3 mb-4">
                                <Button variant="primary" className="rounded-pill px-4">Save Changes</Button>
                            </div>

                            {/* Social Media Links */}
                            <div className="border-top pt-3">
                                <h6 className="fw-bold text-dark mb-2" style={{ fontSize: '0.95rem' }}>Social Media</h6>
                                <p className="text-muted small mb-3" style={{ fontSize: '0.75rem' }}>Tautkan akun media sosial Anda (opsional).</p>

                                <div className="d-flex flex-column gap-2">
                                    <div className="d-flex align-items-center gap-2">
                                        <i className="bx bxl-instagram fs-4 text-danger"></i>
                                        <Form.Control type="text" defaultValue="https://instagram.com/veentix.id" className="form-control-sm" />
                                    </div>
                                    <div className="d-flex align-items-center gap-2">
                                        <i className="bx bxl-twitter fs-4 text-dark"></i>
                                        <Form.Control type="text" defaultValue="https://twitter.com/veentix_id" className="form-control-sm" />
                                    </div>
                                    <div className="d-flex align-items-center gap-2">
                                        <i className="bx bxl-facebook-circle fs-4 text-primary"></i>
                                        <Form.Control type="text" defaultValue="https://facebook.com/veentix.id" className="form-control-sm" />
                                    </div>
                                </div>
                            </div>
                        </Form>
                    </Card>
                </Col>

                {/* Right Side: Account Plan & System Format Cards */}
                <Col xl={3} lg={3}>
                    {/* Account Plan */}
                    <Card className="border-0 shadow-sm rounded-4 p-3 bg-white mb-3">
                        <h6 className="fw-bold text-dark mb-2" style={{ fontSize: '0.95rem' }}>Account Plan</h6>
                        <div className="p-3 bg-purple-subtle rounded-3 border border-purple mb-3" style={{ backgroundColor: 'rgba(124, 58, 237, 0.08)' }}>
                            <div className="d-flex align-items-center justify-content-between mb-2">
                                <div>
                                    <div className="text-muted" style={{ fontSize: '0.68rem' }}>Current Plan</div>
                                    <div className="fw-extrabold text-purple" style={{ color: '#7c3aed', fontSize: '1.1rem' }}>Pro Plan</div>
                                </div>
                                <span className="badge badge-published">Active</span>
                            </div>
                            <ul className="list-unstyled text-muted mb-0 d-flex flex-column gap-1" style={{ fontSize: '0.75rem' }}>
                                <li>✓ Unlimited Events</li>
                                <li>✓ Custom Domain</li>
                                <li>✓ Advanced Analytics</li>
                                <li>✓ Priority Support</li>
                            </ul>
                        </div>
                        <Button variant="outline-primary" size="sm" className="w-100 rounded-pill">
                            <i className="bx bx-cog me-1"></i> Manage Subscription
                        </Button>
                    </Card>

                    {/* Organization ID */}
                    <Card className="border-0 shadow-sm rounded-4 p-3 bg-white mb-3">
                        <h6 className="fw-bold text-dark mb-2" style={{ fontSize: '0.95rem' }}>Organization ID</h6>
                        <div className="d-flex align-items-center justify-content-between bg-light p-2 rounded-3 mb-1">
                            <span className="font-monospace fw-bold text-primary" style={{ fontSize: '0.82rem' }}>ORG-VEENTIX-2026</span>
                            <button className="btn btn-sm btn-icon text-muted p-0"><i className="bx bx-copy"></i></button>
                        </div>
                        <span className="text-muted" style={{ fontSize: '0.68rem' }}>Dibuat pada 12 Jan 2026</span>
                    </Card>

                    {/* Default Currency */}
                    <Card className="border-0 shadow-sm rounded-4 p-3 bg-white mb-3">
                        <h6 className="fw-bold text-dark mb-2" style={{ fontSize: '0.95rem' }}>Default Currency</h6>
                        <Form.Select className="form-select-sm mb-1" style={{ fontSize: '0.8rem' }}>
                            <option>IDR - Indonesian Rupiah</option>
                            <option>USD - US Dollar</option>
                        </Form.Select>
                        <span className="text-muted" style={{ fontSize: '0.68rem' }}>Mata uang default yang digunakan untuk semua transaksi.</span>
                    </Card>

                    {/* Date & Time Format */}
                    <Card className="border-0 shadow-sm rounded-4 p-3 bg-white">
                        <h6 className="fw-bold text-dark mb-2" style={{ fontSize: '0.95rem' }}>Date & Time Format</h6>
                        <div className="mb-2">
                            <Form.Label className="small text-muted mb-1" style={{ fontSize: '0.72rem' }}>Date Format</Form.Label>
                            <Form.Select className="form-select-sm" style={{ fontSize: '0.8rem' }}>
                                <option>20 May 2026</option>
                                <option>2026-05-20</option>
                            </Form.Select>
                        </div>
                        <div className="mb-2">
                            <Form.Label className="small text-muted mb-1" style={{ fontSize: '0.72rem' }}>Time Format</Form.Label>
                            <Form.Select className="form-select-sm" style={{ fontSize: '0.8rem' }}>
                                <option>24 Hours (14:30)</option>
                                <option>12 Hours (02:30 PM)</option>
                            </Form.Select>
                        </div>
                        <span className="text-muted" style={{ fontSize: '0.68rem' }}>Format ini akan digunakan di seluruh platform.</span>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default SettingsPage;
