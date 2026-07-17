/**
 * Facility Gallery Tab Component
 */

import React, { useState, useEffect } from 'react';
import { Button, Card, Row, Col, Badge, Form, Modal } from 'react-bootstrap';
import { InFacility, Facility } from '@/models/Facility';
import {
    FacilityGallery,
    FacilityGalleryFormData,
    FACILITY_GALLERY_VALIDATION
} from '@/types/facility';
import useBlockUI from '@/pages/_components/useBlockUI';
import { showToast } from '@/utils/toast';
import { API_BASE_URL } from '@/lib/ApiClient';

interface GalleryTabProps {
    facility: InFacility | null;
    refreshKey: number;
    onRefresh: () => void;
    onDataChange?: (data: any[]) => void;
    isStepMode?: boolean;
    initialData?: any[];
}

const FacilityGalleryTab: React.FC<GalleryTabProps> = ({ facility, refreshKey, onRefresh, onDataChange, isStepMode = false, initialData }) => {
    const { blockUI, unblockUI } = useBlockUI();
    const [galleries, setGalleries] = useState<FacilityGallery[]>(initialData || []);
    const FacilityModel = new Facility();
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [uploadData, setUploadData] = useState<{
        file: File | null;
        title: string;
        description: string;
    }>({
        file: null,
        title: '',
        description: ''
    });
    const [editData, setEditData] = useState<{
        id: number;
        title: string;
        description: string;
        sort_order: number;
    }>({
        id: 0,
        title: '',
        description: '',
        sort_order: 0
    });
    const [previewUrl, setPreviewUrl] = useState<string>('');

    // Notify parent of data changes
    useEffect(() => {
        if (onDataChange) {
            onDataChange(galleries);
        }
    }, [galleries, onDataChange]);

    // Sync with initialData when provided (useful for validation error scenarios)
    useEffect(() => {
        if (initialData && initialData.length > 0 && isStepMode) {
            setGalleries(initialData);
        }
    }, [initialData, isStepMode]);

    useEffect(() => {
        // Load gallery whenever the facility exists (including step mode for editing)
        if (facility && facility.id && !isStepMode) {
            loadGallery();
        } else if (!facility?.id && isStepMode && !initialData) {
            // Only clear galleries if in step mode without initial data
            setGalleries([]);
        }
    }, [refreshKey, facility?.id, isStepMode, initialData]);

    const loadGallery = async () => {
        if (!facility || !facility.id) return;

        blockUI();
        try {
            const response = await FacilityModel.getGallery(facility.id);
            setGalleries(response.gallery);
        } catch (error) {
            showToast('Failed to load gallery', 'error');
        } finally {
            unblockUI();
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file size
        if (file.size > FACILITY_GALLERY_VALIDATION.max_file_size_mb * 1024 * 1024) {
            showToast(`File size must be less than ${FACILITY_GALLERY_VALIDATION.max_file_size_mb}MB`, 'error');
            return;
        }

        // Validate file extension
        const ext = file.name.split('.').pop()?.toLowerCase() || '';
        if (!FACILITY_GALLERY_VALIDATION.allowed_extensions.includes(ext)) {
            showToast(`Allowed file types: ${FACILITY_GALLERY_VALIDATION.allowed_extensions.join(', ')}`, 'error');
            return;
        }

        setUploadData(prev => ({ ...prev, file }));
        setPreviewUrl(URL.createObjectURL(file));
    };

    const handleUpload = async () => {
        if (!uploadData.file) {
            showToast('Please select a file', 'warning');
            return;
        }

        // In step mode, just add to local state
        if (isStepMode) {
            const newGallery: any = {
                id: Date.now(), // Temporary ID
                file: uploadData.file,
                image: URL.createObjectURL(uploadData.file),
                title: uploadData.title,
                description: uploadData.description,
                sort_order: galleries.length,
                is_featured: galleries.length === 0, // Auto-feature first image
                _isNew: true
            };
            setGalleries([...galleries, newGallery]);
            setShowUploadModal(false);
            setUploadData({ file: null, title: '', description: '' });
            setPreviewUrl('');
            showToast('Image added! Will be saved when you submit the form', 'success');
            return;
        }

        if (!facility || !facility.id) {
            showToast('Please save the facility first', 'warning');
            return;
        }

        blockUI();
        const formData = new FormData();
        formData.append('image', uploadData.file);
        if (uploadData.title) formData.append('title', uploadData.title);
        if (uploadData.description) formData.append('description', uploadData.description);

        try {
            await FacilityModel.uploadGalleryImage(facility.id, formData);
            showToast('Image uploaded successfully', 'success');
            setShowUploadModal(false);
            setUploadData({ file: null, title: '', description: '' });
            setPreviewUrl('');
            onRefresh();
        } catch (error: any) {
            showToast(error.response?.data?.message || 'Upload failed', 'error');
        } finally {
            unblockUI();
        }
    };

    const handleSetFeatured = async (id: number) => {
        // In step mode, just update local state
        if (isStepMode) {
            const updated = galleries.map(g => ({
                ...g,
                is_featured: g.id === id
            }));
            setGalleries(updated);
            showToast('Featured image updated', 'success');
            return;
        }

        if (!facility || !facility.id) {
            showToast('Please save the facility first', 'warning');
            return;
        }

        blockUI();
        try {
            await FacilityModel.setFeaturedGalleryImage(facility.id, id);
            showToast('Featured image updated', 'success');
            onRefresh();
        } catch (error) {
            showToast('Failed to set featured image', 'error');
        } finally {
            unblockUI();
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this image?')) return;

        // In step mode, just mark as deleted in local state
        if (isStepMode) {
            const updated = galleries.map(g => {
                if (g.id === id) {
                    return { ...g, _isDeleted: true };
                }
                return g;
            });
            // .filter(g => !g._isDeleted);
            setGalleries(updated);
            showToast('Image removed', 'success');
            return;
        }

        // if (!facility || !facility.id) {
        //     showToast('Please save the facility first', 'warning');
        //     return;
        // }

        // blockUI();
        // try {
        //     await FacilityModel.deleteGalleryImage(facility.id, id);
        //     showToast('Image deleted successfully', 'success');
        //     onRefresh();
        // } catch (error) {
        //     showToast('Failed to delete image', 'error');
        // } finally {
        //     unblockUI();
        // }
    };

    const handleEdit = (gallery: FacilityGallery) => {
        setEditData({
            id: gallery.id,
            title: gallery.title || '',
            description: gallery.description || '',
            sort_order: gallery.sort_order
        });
        setShowEditModal(true);
    };

    const handleUpdate = async () => {
        // In step mode, just update local state
        if (isStepMode) {
            const updated = galleries.map(g => {
                if (g.id === editData.id) {
                    return {
                        ...g,
                        title: editData.title,
                        description: editData.description,
                        sort_order: editData.sort_order
                    };
                }
                return g;
            });
            setGalleries(updated);
            setShowEditModal(false);
            showToast('Image updated successfully', 'success');
            return;
        }

        if (!facility || !facility.id) {
            showToast('Please save the facility first', 'warning');
            return;
        }

        blockUI();
        try {
            await FacilityModel.updateGalleryImage(facility.id, editData.id, {
                title: editData.title,
                description: editData.description,
                sort_order: editData.sort_order
            });
            showToast('Image updated successfully', 'success');
            setShowEditModal(false);
            onRefresh();
        } catch (error) {
            showToast('Failed to update image', 'error');
        } finally {
            unblockUI();
        }
    };

    return (
        <div>
            {!facility && !isStepMode && (
                <div className="alert alert-info mb-3">
                    <i className="bx bx-info-circle me-2"></i>
                    Please save the facility basic information first before managing gallery.
                </div>
            )}
            <div className="d-flex justify-content-between align-items-center mb-3">
                <div>
                    <h5 className="mb-1">
                        <i className="bx bx-image me-2"></i>
                        Photo Gallery
                    </h5>
                    <small className="text-muted">
                        {galleries.length} / {FACILITY_GALLERY_VALIDATION.max_images} images
                    </small>
                </div>
                <Button
                    variant="primary"
                    size="sm"
                    onClick={() => setShowUploadModal(true)}
                    disabled={(!isStepMode && !facility) || galleries.length >= FACILITY_GALLERY_VALIDATION.max_images}
                >
                    <i className="bx bx-upload me-2"></i>
                    Upload Photo
                </Button>
            </div>

            {galleries.length === 0 ? (
                <Card className="text-center p-5">
                    <i className="bx bx-image-add bx-lg text-muted mb-3 d-block"></i>
                    <p className="text-muted mb-3">No photos uploaded yet</p>
                    <Button variant="outline-primary" onClick={() => setShowUploadModal(true)}>
                        <i className="bx bx-plus me-2"></i>
                        Add First Photo
                    </Button>
                </Card>
            ) : (
                <Row className="g-3">
                    {galleries.filter(g => !g._isDeleted).map((gallery) => (
                        <Col key={gallery.id} xs={12} sm={6} md={4} lg={3}>
                            <Card className="h-100">
                                <div className="position-relative" style={{ paddingTop: '75%' }}>
                                    <img
                                        src={
                                            gallery._isNew
                                                ? gallery.image
                                                : `${API_BASE_URL}/${gallery.image}`
                                        }
                                        alt={gallery.title || 'Gallery image'}
                                        className="position-absolute top-0 start-0 w-100 h-100 object-fit-cover"
                                        style={{ borderTopLeftRadius: '8px', borderTopRightRadius: '8px' }}
                                        // onError={(e) => {
                                        //     (e.target as HTMLImageElement).src = '/placeholder-image.jpg';
                                        // }}
                                    />
                                    {gallery.is_featured && (
                                        <Badge
                                            bg="warning"
                                            className="position-absolute top-0 end-0 m-2"
                                        >
                                            <i className="bx bx-star me-1"></i>
                                            Featured
                                        </Badge>
                                    )}
                                </div>
                                <Card.Body className="p-2">
                                    <div className="fw-bold text-truncate" title={gallery.title}>
                                        {gallery.title || 'Untitled'}
                                    </div>
                                    <small className="text-muted text-truncate d-block">
                                        {gallery.description}
                                    </small>
                                </Card.Body>
                                <Card.Footer className="p-2 d-flex gap-1 justify-content-between">
                                    <div>
                                        {!gallery.is_featured && (
                                            <Button
                                                variant="outline-warning"
                                                size="sm"
                                                onClick={() => handleSetFeatured(gallery.id)}
                                                title="Set as Featured"
                                            >
                                                <i className="bx bx-star"></i>
                                            </Button>
                                        )}
                                        <Button
                                            variant="outline-primary"
                                            size="sm"
                                            onClick={() => handleEdit(gallery)}
                                            title="Edit"
                                        >
                                            <i className="bx bx-edit"></i>
                                        </Button>
                                    </div>
                                    <Button
                                        variant="outline-danger"
                                        size="sm"
                                        onClick={() => handleDelete(gallery.id)}
                                        title="Delete"
                                    >
                                        <i className="bx bx-trash"></i>
                                    </Button>
                                </Card.Footer>
                            </Card>
                        </Col>
                    ))}
                </Row>
            )}

            {/* Upload Modal */}
            <Modal show={showUploadModal} onHide={() => setShowUploadModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>
                        <i className="bx bx-upload me-2"></i>
                        Upload Photo
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group className="mb-3">
                        <Form.Label>Image *</Form.Label>
                        <Form.Control
                            type="file"
                            accept={FACILITY_GALLERY_VALIDATION.allowed_extensions.map(ext => `.${ext}`).join(',')}
                            onChange={handleFileChange}
                            isInvalid={!uploadData.file}
                        />
                        <Form.Text>
                            Max {FACILITY_GALLERY_VALIDATION.max_file_size_mb}MB. Allowed:{' '}
                            {FACILITY_GALLERY_VALIDATION.allowed_extensions.join(', ')}
                        </Form.Text>
                    </Form.Group>

                    {previewUrl && (
                        <div className="mb-3 text-center">
                            <img
                                src={previewUrl}
                                alt="Preview"
                                className="img-fluid rounded"
                                style={{ maxHeight: '300px' }}
                            />
                        </div>
                    )}

                    <Form.Group className="mb-3">
                        <Form.Label>Title</Form.Label>
                        <Form.Control
                            type="text"
                            value={uploadData.title}
                            onChange={(e) => setUploadData(prev => ({ ...prev, title: e.target.value }))}
                            placeholder="Image title"
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Description</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            value={uploadData.description}
                            onChange={(e) => setUploadData(prev => ({ ...prev, description: e.target.value }))}
                            placeholder="Image description"
                        />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowUploadModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleUpload}>
                        <i className="bx bx-upload me-2"></i>
                        Upload
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Edit Modal */}
            <Modal show={showEditModal} onHide={() => setShowEditModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>
                        <i className="bx bx-edit me-2"></i>
                        Edit Photo Details
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group className="mb-3">
                        <Form.Label>Title</Form.Label>
                        <Form.Control
                            type="text"
                            value={editData.title}
                            onChange={(e) => setEditData(prev => ({ ...prev, title: e.target.value }))}
                            placeholder="Image title"
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Description</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            value={editData.description}
                            onChange={(e) => setEditData(prev => ({ ...prev, description: e.target.value }))}
                            placeholder="Image description"
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Sort Order</Form.Label>
                        <Form.Control
                            type="number"
                            value={editData.sort_order}
                            onChange={(e) => setEditData(prev => ({ ...prev, sort_order: parseInt(e.target.value) }))}
                        />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowEditModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleUpdate}>
                        <i className="bx bx-check me-2"></i>
                        Update
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default FacilityGalleryTab;
