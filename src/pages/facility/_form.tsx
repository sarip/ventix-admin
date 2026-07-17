/**
 * Facility Form Modal
 * Step-based form with profiling and Save All functionality
 */

import React, { useState, useEffect, useRef } from 'react';
import 'select2/dist/js/select2.min.js';
import { Button, Form as BootstrapForm, Row, Col, Nav, ProgressBar } from 'react-bootstrap';
import { InFacilityForm, Facility } from '@/models/Facility';
import { FacilityOrganizer } from '@/models/FacilityOrganizer';
import { User } from '@/models/User';
import Select2Component from '@/pages/_components/Select2';
import { showToast } from '@/utils/toast';

// Import profiling components
import FacilityGalleryTab from './profiling/_gallery';
import FacilityAmenitiesTab from './profiling/_amenities';
import FacilityFeaturesTab from './profiling/_features';
import FacilityOperatingHoursTab from './profiling/_operating-hours';
import FacilityRulesTab from './profiling/_rules';

enum FormStep {
    BASIC_INFO = 'basic-info',
    GALLERY = 'gallery',
    AMENITIES = 'amenities',
    FEATURES = 'features',
    OPERATING_HOURS = 'operating-hours',
    RULES = 'rules'
}

interface FormProps {
    title: string;
    data: InFacilityForm;
    onHide: () => void;
    onSave: (data: InFacilityForm) => void;
    validationError?: { field: string; message: string }[];
}

const FacilityFormModal: React.FC<FormProps> = ({ title, data, onHide, onSave, validationError = [] }) => {
    const [formData, setFormData] = useState<InFacilityForm>(data);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [currentStep, setCurrentStep] = useState<FormStep>(FormStep.BASIC_INFO);
    const [savedFacilityId, setSavedFacilityId] = useState<number | null>(data.id || null);
    const [galleryImages, setGalleryImages] = useState<any[]>([]);
    const [amenities, setAmenities] = useState<any[]>([]);
    const [features, setFeatures] = useState<any[]>([]);
    const [operatingHours, setOperatingHours] = useState<any[]>([]);
    const [rules, setRules] = useState<any[]>([]);
    const [bannerImage, setBannerImage] = useState<File | null>(null);
    const [bannerPreview, setBannerPreview] = useState<string>('');
    const [isSaving, setIsSaving] = useState(false);

    const isInitialMount = useRef(true);
    const previousDataId = useRef<number | undefined>(data.id);

    const FacilityModel = new Facility();
    const FacilityOrganizerModel = new FacilityOrganizer();
    const UserModel = new User();

    // ── Initialize / Reset form when facility changes ──────────────────────
    useEffect(() => {
        if (isInitialMount.current) {
            setFormData(data);
            setSavedFacilityId(data.id || null);
            setGalleryImages((data as any).facility_gallery || []);
            setAmenities((data as any).facility_amenities || []);
            setFeatures((data as any).facility_features || []);
            setOperatingHours((data as any).facility_operating_hours || []);
            setRules((data as any).facility_rules || []);
            // Initialize banner preview from existing data
            if ((data as any).banner_image) {
                setBannerPreview(`${API_BASE_URL}/${(data as any).banner_image}`);
            } else {
                setBannerPreview('');
            }
            setCurrentStep(FormStep.BASIC_INFO);
            isInitialMount.current = false;
            previousDataId.current = data.id;
        } else if (data.id !== previousDataId.current) {
            // Switched to a different facility — reset everything
            setFormData(data);
            setSavedFacilityId(data.id || null);
            setGalleryImages((data as any).facility_gallery || []);
            setAmenities((data as any).facility_amenities || []);
            setFeatures((data as any).facility_features || []);
            setOperatingHours((data as any).facility_operating_hours || []);
            setRules((data as any).facility_rules || []);
            // Reset banner
            if ((data as any).banner_image) {
                setBannerPreview(`${API_BASE_URL}/${(data as any).banner_image}`);
            } else {
                setBannerPreview('');
            }
            setBannerImage(null);
            setCurrentStep(FormStep.BASIC_INFO);
            previousDataId.current = data.id;
        }
        // If same facility (e.g., validation error re-render) — preserve user input
    }, [data]);

    // Map validation errors to field map
    useEffect(() => {
        const errorMap = validationError.reduce((acc: { [key: string]: string }, err) => {
            acc[err.field] = err.message;
            return acc;
        }, {});
        setErrors(errorMap);
    }, [validationError]);

    // Auto-generate slug from name
    const generateSlug = (name: string) =>
        name.toLowerCase()
            .replace(/[^a-z0-9\s-]/gi, '')
            .trim()
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-');

    const isSlugManuallyEdited = useRef(false);

    const handleInputChange = (e: any) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => {
            const updated = {
                ...prev,
                [name]: type === 'checkbox' ? checked : value
            };
            return updated;
        });
    };


    const steps = Object.values(FormStep);
    const currentIndex = steps.indexOf(currentStep);
    const nextStep = () => { if (currentIndex < steps.length - 1) setCurrentStep(steps[currentIndex + 1]); };
    const previousStep = () => { if (currentIndex > 0) setCurrentStep(steps[currentIndex - 1]); };
    const goToStep = (step: FormStep) => setCurrentStep(step);
    const getProgress = () => ((currentIndex + 1) / steps.length) * 100;

    const validateBasicInfo = (): boolean => {
        const errs: string[] = [];
        if (!formData.name?.trim()) errs.push('Facility name is required');
        if (!formData.facility_organizer_id) errs.push('Facility organizer is required');
        if (!formData.user_id_pic) errs.push('PIC user is required');
        if (!formData.category?.trim()) errs.push('Category is required');
        if (errs.length > 0) {
            errs.forEach(e => showToast(e, 'error'));
            return false;
        }
        return true;
    };

    const saveAll = async () => {
        if (!validateBasicInfo()) return;

        setIsSaving(true);
        try {
            const fd = new FormData();

            // Basic data — use facility_organizer_id (consistent with backend saveComplete)
            fd.append('facility_organizer_id', formData.facility_organizer_id.toString());
            fd.append('user_id_pic', formData.user_id_pic.toString());
            fd.append('name', formData.name.trim());
            fd.append('category', formData.category.trim());
            fd.append('description', formData.description?.trim() || '');
            fd.append('is_available', formData.is_available ? '1' : '0');
            fd.append('email', formData.email?.trim() || '');
            fd.append('phone', formData.phone?.trim() || '');
            fd.append('address', formData.address?.trim() || '');
            fd.append('latitude', formData.latitude?.toString() || '');
            fd.append('longitude', formData.longitude?.toString() || '');

            // Banner Image
            if (bannerImage) {
                fd.append('banner_image', bannerImage);
            }

            // Gallery
            const galleryInfo: any[] = [];
            galleryImages.forEach((image, index) => {
                galleryInfo.push({
                    id: image._isNew ? undefined : image.id,
                    title: image.title,
                    description: image.description,
                    sort_order: image.sort_order,
                    is_featured: image.is_featured,
                    _isDeleted: image._isDeleted || false,
                    _isNew: image._isNew || false,
                });
                if (image.file) {
                    fd.append(`gallery_images[${index}]`, image.file);
                }
            });
            fd.append('gallery_info', JSON.stringify(galleryInfo));

            // Amenities
            fd.append('amenities', JSON.stringify(amenities.map(a => ({
                id: a.id,
                _isDeleted: a._isDeleted || false,
                _isNew: a._isNew || false,
            }))));

            // Features
            fd.append('features', JSON.stringify(features.map(f => ({
                id: f.id,
                feature_name: f.feature_name,
                feature_value: f.feature_value,
                sort_order: f.sort_order,
                _isDeleted: f._isDeleted || false,
                _isNew: f._isNew || false,
            }))));

            // Operating hours — use the latest state updated by onDataChange
            fd.append('operating_hours', JSON.stringify(operatingHours.map(oh => ({
                id: oh.id,
                day_of_week: oh.day_of_week,
                open_time: oh.open_time,
                close_time: oh.close_time,
                is_closed: oh.is_closed,
                _isDeleted: oh._isDeleted || false,
                _isNew: oh._isNew || false,
            }))));

            // Rules
            fd.append('rules', JSON.stringify(rules.map(r => ({
                id: r.id,
                rule_text: r.rule_text,
                sort_order: r.sort_order,
                _isDeleted: r._isDeleted || false,
                _isNew: r._isNew || false,
            }))));

            await FacilityModel.saveComplete(savedFacilityId, fd);

            // Notify parent to refresh list and close modal
            onSave(formData);
        } catch (error: any) {
            console.error('Save error:', error);
            throw error; // Bubble up to parent error handler
        } finally {
            setIsSaving(false);
        }
    };

    // ── Step renderers ─────────────────────────────────────────────────────

    const renderBasicInfoStep = () => (
        <div>
            <h5 className="mb-4">
                <i className="bx bx-info-circle me-2"></i>
                Basic Information
            </h5>
            <Row className="g-3">
                <Col md={6}>
                    <BootstrapForm.Group>
                        <BootstrapForm.Label>Name *</BootstrapForm.Label>
                        <BootstrapForm.Control
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            isInvalid={!!errors.name}
                            required
                        />
                        {errors.name && (
                            <BootstrapForm.Control.Feedback type="invalid">
                                {errors.name}
                            </BootstrapForm.Control.Feedback>
                        )}
                    </BootstrapForm.Group>
                </Col>
                <Col md={6}>
                    <div className="form-group mb-3">
                        <label className="form-label" htmlFor="facility_organizer_id">Facility Organizer *</label>
                        <Select2Component
                            fetchData={FacilityOrganizerModel.list}
                            dropdownParent="#modal-facility"
                            placeholder="Select organizer"
                            name="facility_organizer_id"
                            onChange={handleInputChange}
                            validation={errors.facility_organizer_id}
                            selectedId={typeof formData.facility_organizer_id === 'number' ? formData.facility_organizer_id : undefined}
                            dataKey="facilities_organizer"
                            showKey="facility_name"
                            filterKey=""
                        />
                        {!!errors?.facility_organizer_id && (
                            <div className="invalid-feedback d-block">{errors.facility_organizer_id}</div>
                        )}
                    </div>
                </Col>

                <Col md={6}>
                    <BootstrapForm.Group>
                        <BootstrapForm.Label>Category *</BootstrapForm.Label>
                        <BootstrapForm.Select
                            name="category"
                            value={formData.category}
                            onChange={handleInputChange}
                            isInvalid={!!errors.category}
                            required
                        >
                            <option value="">Select Category</option>
                            <option value="Sports">Sports</option>
                            <option value="Gaming">Gaming</option>
                            <option value="Music">Music</option>
                            <option value="Others">Others</option>
                        </BootstrapForm.Select>
                        {errors.category && (
                            <BootstrapForm.Control.Feedback type="invalid">
                                {errors.category}
                            </BootstrapForm.Control.Feedback>
                        )}
                    </BootstrapForm.Group>
                </Col>

                <Col md={6}>
                    <BootstrapForm.Group>
                        <BootstrapForm.Label>Person in Charge *</BootstrapForm.Label>
                        <Select2Component
                            fetchData={UserModel.list}
                            dropdownParent="#modal-facility"
                            placeholder="Select PIC"
                            name="user_id_pic"
                            onChange={handleInputChange}
                            validation={errors.user_id_pic}
                            selectedId={formData.user_id_pic}
                            dataKey="users"
                            showKey="name"
                            id="id"
                        />
                    </BootstrapForm.Group>
                </Col>

                <Col md={12}>
                    <BootstrapForm.Group>
                        <BootstrapForm.Label>Description</BootstrapForm.Label>
                        <BootstrapForm.Control
                            as="textarea"
                            rows={3}
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                        />
                    </BootstrapForm.Group>
                </Col>

                <Col md={12}>
                    <BootstrapForm.Group>
                        <BootstrapForm.Check
                            type="switch"
                            id="is_available"
                            name="is_available"
                            label="Available for Booking"
                            checked={formData.is_available}
                            onChange={handleInputChange}
                        />
                    </BootstrapForm.Group>
                </Col>

                {/* Contact & Identity */}
                <Col md={12}>
                    <hr className="my-2" />
                    <h6 className="text-muted fw-semibold mb-3">
                        <i className="bx bx-envelope me-1"></i>
                        Contact & Identity
                    </h6>
                </Col>

                

                <Col md={6}>
                    <BootstrapForm.Group>
                        <BootstrapForm.Label>Email</BootstrapForm.Label>
                        <BootstrapForm.Control
                            type="email"
                            name="email"
                            placeholder="facility@example.com"
                            value={formData.email || ''}
                            onChange={handleInputChange}
                        />
                    </BootstrapForm.Group>
                </Col>

                <Col md={6}>
                    <BootstrapForm.Group>
                        <BootstrapForm.Label>Phone</BootstrapForm.Label>
                        <BootstrapForm.Control
                            type="text"
                            name="phone"
                            placeholder="+6281234567890"
                            value={formData.phone || ''}
                            onChange={handleInputChange}
                        />
                    </BootstrapForm.Group>
                </Col>

                {/* Location */}
                <Col md={12}>
                    <hr className="my-2" />
                    <h6 className="text-muted fw-semibold mb-3">
                        <i className="bx bx-map me-1"></i>
                        Location
                    </h6>
                </Col>

                <Col md={12}>
                    <BootstrapForm.Group>
                        <BootstrapForm.Label>Address</BootstrapForm.Label>
                        <BootstrapForm.Control
                            as="textarea"
                            rows={2}
                            name="address"
                            placeholder="Full address of the facility"
                            value={formData.address || ''}
                            onChange={handleInputChange}
                        />
                    </BootstrapForm.Group>
                </Col>

                <Col md={6}>
                    <BootstrapForm.Group>
                        <BootstrapForm.Label>Latitude</BootstrapForm.Label>
                        <BootstrapForm.Control
                            type="number"
                            step="any"
                            name="latitude"
                            placeholder="e.g. -6.200000"
                            value={formData.latitude ?? ''}
                            onChange={handleInputChange}
                        />
                    </BootstrapForm.Group>
                </Col>

                <Col md={6}>
                    <BootstrapForm.Group>
                        <BootstrapForm.Label>Longitude</BootstrapForm.Label>
                        <BootstrapForm.Control
                            type="number"
                            step="any"
                            name="longitude"
                            placeholder="e.g. 106.816666"
                            value={formData.longitude ?? ''}
                            onChange={handleInputChange}
                        />
                    </BootstrapForm.Group>
                </Col>

                {/* Banner Image */}
                <Col md={12}>
                    <hr className="my-2" />
                    <h6 className="text-muted fw-semibold mb-3">
                        <i className="bx bx-image me-1"></i>
                        Banner Image
                    </h6>
                </Col>

                <Col md={12}>
                    <BootstrapForm.Group>
                        <BootstrapForm.Label>Banner Image</BootstrapForm.Label>
                        <BootstrapForm.Control
                            type="file"
                            accept="image/jpeg,image/jpg,image/png,image/webp"
                            onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                    // Validate file size (max 5MB)
                                    if (file.size > 5 * 1024 * 1024) {
                                        showToast('File size must be less than 5MB', 'error');
                                        return;
                                    }
                                    setBannerImage(file);
                                    setBannerPreview(URL.createObjectURL(file));
                                }
                            }}
                        />
                        <BootstrapForm.Text className="text-muted">
                            Recommended size: 1200x400px. Max size: 5MB. Formats: JPG, PNG, WEBP
                        </BootstrapForm.Text>
                    </BootstrapForm.Group>
                </Col>

                {bannerPreview && (
                    <Col md={12}>
                        <div className="mt-2">
                            <BootstrapForm.Label>Preview</BootstrapForm.Label>
                            <div className="position-relative" style={{ borderRadius: '8px', overflow: 'hidden', maxHeight: '300px' }}>
                                <img
                                    src={bannerPreview}
                                    alt="Banner Preview"
                                    className="img-fluid w-100"
                                    style={{ objectFit: 'cover' }}
                                />
                                <Button
                                    variant="danger"
                                    size="sm"
                                    className="position-absolute top-0 end-0 m-2"
                                    onClick={() => {
                                        setBannerImage(null);
                                        setBannerPreview('');
                                    }}
                                >
                                    <i className="bx bx-trash"></i>
                                </Button>
                            </div>
                        </div>
                    </Col>
                )}
            </Row>
        </div>
    );

    const renderStepContent = () => {
        switch (currentStep) {
            case FormStep.BASIC_INFO:
                return renderBasicInfoStep();
            case FormStep.GALLERY:
                return (
                    <div>
                        <h5 className="mb-3"><i className="bx bx-image me-2"></i>Gallery Images</h5>
                        <p className="text-muted mb-3">Upload photos of your facility. You can upload multiple images and mark one as featured.</p>
                        <FacilityGalleryTab
                            facility={savedFacilityId ? { id: savedFacilityId, name: formData.name } as any : null}
                            refreshKey={0}
                            onRefresh={() => { }}
                            onDataChange={setGalleryImages}
                            isStepMode={true}
                            initialData={galleryImages}
                        />
                    </div>
                );
            case FormStep.AMENITIES:
                return (
                    <div>
                        <h5 className="mb-3"><i className="bx bx-grid-small me-2"></i>Amenities &amp; Facilities</h5>
                        <p className="text-muted mb-3">Select the amenities available at your venue.</p>
                        <FacilityAmenitiesTab
                            facility={savedFacilityId ? { id: savedFacilityId, name: formData.name } as any : null}
                            refreshKey={0}
                            onRefresh={() => { }}
                            onDataChange={setAmenities}
                            isStepMode={true}
                            initialData={amenities}
                        />
                    </div>
                );
            case FormStep.FEATURES:
                return (
                    <div>
                        <h5 className="mb-3"><i className="bx bx-list-ul me-2"></i>Technical Specifications</h5>
                        <p className="text-muted mb-3">Add technical specifications and features of your facility.</p>
                        <FacilityFeaturesTab
                            facility={savedFacilityId ? { id: savedFacilityId, name: formData.name } as any : null}
                            refreshKey={0}
                            onRefresh={() => { }}
                            onDataChange={setFeatures}
                            isStepMode={true}
                            initialData={features}
                        />
                    </div>
                );
            case FormStep.OPERATING_HOURS:
                return (
                    <div>
                        <h5 className="mb-3"><i className="bx bx-time-five me-2"></i>Operating Hours</h5>
                        <p className="text-muted mb-3">Set your facility's operating hours for each day of the week.</p>
                        <FacilityOperatingHoursTab
                            facility={savedFacilityId ? { id: savedFacilityId, name: formData.name } as any : null}
                            refreshKey={0}
                            onRefresh={() => { }}
                            onDataChange={setOperatingHours}
                            isStepMode={true}
                            initialData={operatingHours}
                        />
                    </div>
                );
            case FormStep.RULES:
                return (
                    <div>
                        <h5 className="mb-3"><i className="bx bx-file me-2"></i>Rules &amp; Policies</h5>
                        <p className="text-muted mb-3">Define rules and policies for using your facility.</p>
                        <FacilityRulesTab
                            facility={savedFacilityId ? { id: savedFacilityId, name: formData.name } as any : null}
                            refreshKey={0}
                            onRefresh={() => { }}
                            onDataChange={setRules}
                            isStepMode={true}
                            initialData={rules}
                        />
                    </div>
                );
            default:
                return null;
        }
    };

    const stepLabels: Record<FormStep, { icon: string; label: string }> = {
        [FormStep.BASIC_INFO]: { icon: 'bx-info-circle', label: 'Basic Info' },
        [FormStep.GALLERY]: { icon: 'bx-image', label: 'Gallery' },
        [FormStep.AMENITIES]: { icon: 'bx-grid-small', label: 'Amenities' },
        [FormStep.FEATURES]: { icon: 'bx-list-ul', label: 'Features' },
        [FormStep.OPERATING_HOURS]: { icon: 'bx-time-five', label: 'Hours' },
        [FormStep.RULES]: { icon: 'bx-file', label: 'Rules' },
    };

    return (
        <div className="modal fade show d-block" id="modal-facility" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-xl modal-dialog-scrollable">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">
                            <i className="bx bx-buildings me-2"></i>
                            {title}
                        </h5>
                        <button type="button" className="btn-close" onClick={onHide} disabled={isSaving}></button>
                    </div>

                    <div className="modal-body p-0">
                        {/* Progress Bar */}
                        <div className="px-4 pt-3">
                            <ProgressBar now={getProgress()} className="mb-2" style={{ height: '6px' }} />
                            <div className="d-flex justify-content-between mb-3">
                                <small className="text-muted">Step {currentIndex + 1} of {steps.length}</small>
                                <small className="text-muted">{Math.round(getProgress())}% Complete</small>
                            </div>
                        </div>

                        {/* Step Navigation */}
                        <div className="px-4 mb-3">
                            <Nav variant="pills" className="overflow-auto flex-nowrap">
                                {steps.map(step => (
                                    <Nav.Item key={step}>
                                        <Nav.Link
                                            active={currentStep === step}
                                            onClick={() => goToStep(step)}
                                            style={{ cursor: 'pointer', whiteSpace: 'nowrap' }}
                                        >
                                            <i className={`bx ${stepLabels[step].icon} me-1`}></i>
                                            {stepLabels[step].label}
                                        </Nav.Link>
                                    </Nav.Item>
                                ))}
                            </Nav>
                        </div>

                        {/* Step Content */}
                        <div className="p-4" style={{ minHeight: '400px', maxHeight: '60vh', overflowY: 'auto' }}>
                            {renderStepContent()}
                        </div>
                    </div>

                    <div className="modal-footer">
                        <Button variant="secondary" onClick={onHide} disabled={isSaving}>
                            Cancel
                        </Button>

                        {currentStep !== FormStep.BASIC_INFO && (
                            <Button variant="outline-primary" onClick={previousStep} disabled={isSaving}>
                                <i className="bx bx-left-arrow-alt me-1"></i>
                                Previous
                            </Button>
                        )}

                        {currentStep !== FormStep.RULES ? (
                            <Button variant="primary" onClick={nextStep} disabled={isSaving}>
                                Next
                                <i className="bx bx-right-arrow-alt ms-1"></i>
                            </Button>
                        ) : (
                            <Button
                                variant="success"
                                onClick={saveAll}
                                disabled={isSaving}
                                className="px-4"
                            >
                                <i className={`bx ${isSaving ? 'bx-loader-alt bx-spin' : 'bx-save'} me-1`}></i>
                                {isSaving ? 'Saving...' : 'Save All'}
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FacilityFormModal;
