import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Card, Row, Col, Button, Form, Spinner, Badge, Nav, Tab, Modal, ButtonGroup } from 'react-bootstrap';
import CertificateTemplateModel from '@/models/CertificateTemplateModel';
import Swal from 'sweetalert2';

interface ElementItem {
    id: string;
    type: 'text' | 'qr' | 'image';
    content: string;
    top: number;
    left: number;
    width: number;
    height: number;
    fontSize: number;
    color: string;
    textAlign: 'left' | 'center' | 'right';
    fontWeight?: 'normal' | 'bold';
    fontStyle?: 'normal' | 'italic';
    fontFamily?: string;
    isLocked?: boolean;
}

const FONT_FAMILIES = [
    { label: 'Sans-Serif (Arial)', value: 'Arial, sans-serif' },
    { label: 'Helvetica', value: 'Helvetica, sans-serif' },
    { label: 'Serif (Times New Roman)', value: 'Times New Roman, serif' },
    { label: 'Georgia', value: 'Georgia, serif' },
    { label: 'Monospace (Courier)', value: "'Courier New', monospace" },
    { label: 'Montserrat', value: 'Montserrat, sans-serif' },
    { label: 'Playfair Display', value: "'Playfair Display', serif" },
    { label: 'Inter', value: 'Inter, sans-serif' },
];

const PRESET_PLACEHOLDERS = [
    { label: 'Participant Name', code: '{{participant_name}}', type: 'text', icon: 'bx-user' },
    { label: 'Event Name', code: '{{event_name}}', type: 'text', icon: 'bx-calendar-event' },
    { label: 'Event Date', code: '{{event_date}}', type: 'text', icon: 'bx-time-five' },
    { label: 'Organizer Name', code: '{{organizer_name}}', type: 'text', icon: 'bx-buildings' },
    { label: 'Certificate Number', code: '{{certificate_number}}', type: 'text', icon: 'bx-barcode' },
    { label: 'QR Code', code: '{{qr_code}}', type: 'qr', icon: 'bx-qr-scan' },
    { label: 'Custom Text', code: 'Text Label', type: 'text', icon: 'bx-text' },
];

const DUMMY_DATA: Record<string, string> = {
    '{{participant_name}}': 'Budi Santoso',
    '{{event_name}}': 'Indonesia Tech Summit 2026',
    '{{event_date}}': '15 Agustus 2026',
    '{{organizer_name}}': 'Venntix Event Organizer',
    '{{certificate_number}}': 'CERT/2026/08/ITS-9942',
    '{{qr_code}}': 'https://qrexplore.com/download/26/08/07/EViL88/123456.png',
};

const CertificateTemplatePage: React.FC = () => {
    const [templates, setTemplates] = useState<any[]>([]);
    const [selectedTemplateId, setSelectedTemplateId] = useState<number | null>(null);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [orientation, setOrientation] = useState<'LANDSCAPE' | 'PORTRAIT'>('LANDSCAPE');
    const [backgroundImage, setBackgroundImage] = useState<File | null>(null);
    const [bgPreview, setBgPreview] = useState<string>('');
    const [rawBgFile, setRawBgFile] = useState<File | null>(null);
    const [cropping, setCropping] = useState<boolean>(false);
    const [elements, setElements] = useState<ElementItem[]>([]);
    const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    // Canvas UI State
    const [zoom, setZoom] = useState<number>(100);
    const [showGrid, setShowGrid] = useState<boolean>(true);
    const [snapToGrid, setSnapToGrid] = useState<boolean>(true);
    const [activeTab, setActiveTab] = useState<string>('elements');
    const [showPreviewModal, setShowPreviewModal] = useState<boolean>(false);

    // Drag & Resize State
    const canvasRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [isResizing, setIsResizing] = useState<string | null>(null);
    const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
    const [initialDimensions, setInitialDimensions] = useState<{ top: number; left: number; width: number; height: number; mouseX: number; mouseY: number }>({
        top: 0, left: 0, width: 0, height: 0, mouseX: 0, mouseY: 0
    });

    useEffect(() => {
        loadTemplates();
    }, []);

    const loadTemplates = async () => {
        try {
            const res: any = await CertificateTemplateModel.list();
            if (res?.data) {
                setTemplates(res.data);
            }
        } catch (err) {
            console.error('Failed loading templates', err);
        }
    };

    const handleSelectTemplate = (idStr: string) => {
        const id = Number(idStr);
        if (!idStr || !id) {
            setSelectedTemplateId(null);
            setName('');
            setDescription('');
            setBgPreview('');
            setBackgroundImage(null);
            setRawBgFile(null);
            setElements([]);
            setSelectedElementId(null);
            return;
        }

        const t = templates.find((item) => item.id === id);
        if (t) {
            setSelectedTemplateId(t.id);
            setName(t.name || '');
            setDescription(t.description || '');
            setOrientation(t.orientation || 'LANDSCAPE');
            const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';
            const bgUrl = t.background_image
                ? t.background_image.startsWith('http')
                    ? t.background_image
                    : `${apiBase}/${t.background_image.replace(/^\//, '')}`
                : '';
            setBgPreview(bgUrl);
            setBackgroundImage(null);
            setRawBgFile(null);
            try {
                const parsed = typeof t.template_json === 'string' ? JSON.parse(t.template_json) : t.template_json;
                setElements(Array.isArray(parsed) ? parsed : []);
            } catch (e) {
                setElements([]);
            }
            setSelectedElementId(null);
        }
    };

    const handleAddElement = (code: string, type: 'text' | 'qr' | 'image' = 'text') => {
        const gridStep = snapToGrid ? 10 : 1;
        const isQr = type === 'qr' || code === '{{qr_code}}';
        const isName = code.includes('participant');

        const elWidth = isQr ? 120 : 340;
        const baseTop = Math.round((60 + elements.length * 20) / gridStep) * gridStep;
        // Center the box itself on the canvas so textAlign:'center' centers the whole
        // element on the certificate, not just the text within an off-center box.
        const baseLeft = Math.max(0, Math.round(((canvasBaseWidth - elWidth) / 2) / gridStep) * gridStep);

        const newEl: ElementItem = {
            id: 'el_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
            type: isQr ? 'qr' : 'text',
            content: code,
            top: baseTop,
            left: baseLeft,
            width: elWidth,
            height: isQr ? 120 : 48,
            fontSize: isName ? 32 : isQr ? 14 : 20,
            color: '#1a1a2e',
            textAlign: 'center',
            fontWeight: isName ? 'bold' : 'normal',
            fontStyle: 'normal',
            fontFamily: 'Arial, sans-serif',
            isLocked: false,
        };

        setElements((prev) => [...prev, newEl]);
        setSelectedElementId(newEl.id);
    };

    const updateSelectedElement = (key: keyof ElementItem, val: any) => {
        if (!selectedElementId) return;
        setElements((prev) =>
            prev.map((el) => {
                if (el.id !== selectedElementId) return el;
                return { ...el, [key]: val };
            })
        );
    };

    const removeElement = (id: string) => {
        setElements((prev) => prev.filter((el) => el.id !== id));
        if (selectedElementId === id) setSelectedElementId(null);
    };

    // Manual dragging is imprecise and easy to leave slightly off-center; these compute the
    // exact centered left/top from canvas + element dimensions so canvas, Preview, and the
    // generated PDF (which all read the same stored left/top) end up visually identical.
    const centerElementHorizontally = (id: string) => {
        setElements((prev) =>
            prev.map((el) => (el.id === id ? { ...el, left: Math.round((canvasBaseWidth - el.width) / 2) } : el))
        );
    };

    const centerElementVertically = (id: string) => {
        setElements((prev) =>
            prev.map((el) => (el.id === id ? { ...el, top: Math.round((canvasBaseHeight - el.height) / 2) } : el))
        );
    };

    const duplicateElement = (id: string) => {
        const target = elements.find((e) => e.id === id);
        if (!target) return;
        const newEl: ElementItem = {
            ...target,
            id: 'el_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
            top: target.top + 20,
            left: target.left + 20,
        };
        setElements((prev) => [...prev, newEl]);
        setSelectedElementId(newEl.id);
    };

    const bringForward = (id: string) => {
        const idx = elements.findIndex((e) => e.id === id);
        if (idx < 0 || idx >= elements.length - 1) return;
        const newArr = [...elements];
        const temp = newArr[idx];
        newArr[idx] = newArr[idx + 1];
        newArr[idx + 1] = temp;
        setElements(newArr);
    };

    const sendBackward = (id: string) => {
        const idx = elements.findIndex((e) => e.id === id);
        if (idx <= 0) return;
        const newArr = [...elements];
        const temp = newArr[idx];
        newArr[idx] = newArr[idx - 1];
        newArr[idx - 1] = temp;
        setElements(newArr);
    };

    // Certificates are rendered by Dompdf, which has no CSS `object-fit` support and always
    // stretches the background to fill the page exactly. Cropping the upload client-side to the
    // exact target aspect ratio up front guarantees that stretch never distorts the image, so the
    // canvas preview and the generated PDF always match pixel-for-pixel.
    const cropImageToAspect = (file: File, targetW: number, targetH: number): Promise<Blob> => {
        return new Promise((resolve, reject) => {
            const objectUrl = URL.createObjectURL(file);
            const img = new window.Image();
            img.onload = () => {
                const targetRatio = targetW / targetH;
                const srcRatio = img.width / img.height;
                let sx = 0, sy = 0, sw = img.width, sh = img.height;

                if (srcRatio > targetRatio) {
                    sw = img.height * targetRatio;
                    sx = (img.width - sw) / 2;
                } else if (srcRatio < targetRatio) {
                    sh = img.width / targetRatio;
                    sy = (img.height - sh) / 2;
                }

                const canvas = document.createElement('canvas');
                canvas.width = targetW;
                canvas.height = targetH;
                const ctx = canvas.getContext('2d');
                URL.revokeObjectURL(objectUrl);
                if (!ctx) {
                    reject(new Error('Canvas 2D context unavailable'));
                    return;
                }
                ctx.drawImage(img, sx, sy, sw, sh, 0, 0, targetW, targetH);
                canvas.toBlob((blob) => {
                    if (blob) resolve(blob);
                    else reject(new Error('Failed to export cropped image'));
                }, 'image/jpeg', 0.92);
            };
            img.onerror = () => {
                URL.revokeObjectURL(objectUrl);
                reject(new Error('Failed to load image for cropping'));
            };
            img.src = objectUrl;
        });
    };

    const applyBackgroundCrop = async (file: File, ori: 'LANDSCAPE' | 'PORTRAIT') => {
        const targetW = ori === 'LANDSCAPE' ? 3508 : 2480;
        const targetH = ori === 'LANDSCAPE' ? 2480 : 3508;
        setCropping(true);
        try {
            const blob = await cropImageToAspect(file, targetW, targetH);
            const croppedFile = new File([blob], file.name.replace(/\.[^.]+$/, '') + '_cropped.jpg', { type: 'image/jpeg' });
            setBackgroundImage(croppedFile);
            setBgPreview(URL.createObjectURL(croppedFile));
        } catch (err) {
            console.error('Failed to auto-crop background image, falling back to original file', err);
            setBackgroundImage(file);
            setBgPreview(URL.createObjectURL(file));
        } finally {
            setCropping(false);
        }
    };

    const handleBgUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setRawBgFile(file);
            applyBackgroundCrop(file, orientation);
        }
    };

    const handleOrientationChange = (ori: 'LANDSCAPE' | 'PORTRAIT') => {
        setOrientation(ori);
        if (rawBgFile) {
            applyBackgroundCrop(rawBgFile, ori);
        }
    };

    const handleRemoveBg = () => {
        setBackgroundImage(null);
        setBgPreview('');
        setRawBgFile(null);
    };

    const handleDeleteTemplate = async () => {
        if (!selectedTemplateId) return;
        const confirm = await Swal.fire({
            title: 'Delete Template?',
            text: 'This action cannot be undone!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!',
        });

        if (confirm.isConfirmed) {
            try {
                setLoading(true);
                await CertificateTemplateModel.delete(selectedTemplateId);
                Swal.fire('Deleted!', 'Template has been deleted.', 'success');
                setSelectedTemplateId(null);
                setName('');
                setDescription('');
                setBgPreview('');
                setElements([]);
                loadTemplates();
            } catch (err: any) {
                Swal.fire('Error', err?.message || 'Delete failed', 'error');
            } finally {
                setLoading(false);
            }
        }
    };

    const handleSaveTemplate = async () => {
        if (!name.trim()) {
            Swal.fire('Required Field', 'Template Name is required', 'error');
            return;
        }

        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('name', name);
            formData.append('description', description);
            formData.append('orientation', orientation);
            formData.append('width', orientation === 'LANDSCAPE' ? '3508' : '2480');
            formData.append('height', orientation === 'LANDSCAPE' ? '2480' : '3508');
            formData.append('template_json', JSON.stringify(elements));
            if (backgroundImage) {
                formData.append('background_image', backgroundImage);
            }

            if (selectedTemplateId) {
                await CertificateTemplateModel.update(selectedTemplateId, formData);
                Swal.fire('Success', 'Template updated successfully', 'success');
            } else {
                const res: any = await CertificateTemplateModel.create(formData);
                Swal.fire('Success', 'Template created successfully', 'success');
                if (res?.data?.id) {
                    setSelectedTemplateId(res.data.id);
                }
            }
            loadTemplates();
        } catch (err: any) {
            Swal.fire('Error', err?.message || 'Save failed', 'error');
        } finally {
            setLoading(false);
        }
    };

    // Canvas size dimensions in points/pixels
    const canvasBaseWidth = orientation === 'LANDSCAPE' ? 842 : 595;
    const canvasBaseHeight = orientation === 'LANDSCAPE' ? 595 : 842;

    // MOUSE DRAG & RESIZE HANDLERS WITH ACCURATE BOUNDING BOX CALCULATION
    const handleElementMouseDown = (e: React.MouseEvent, el: ElementItem) => {
        e.stopPropagation();
        if (el.isLocked) return;
        setSelectedElementId(el.id);
        setIsDragging(true);

        const rect = canvasRef.current?.getBoundingClientRect();
        if (!rect) return;

        const scale = zoom / 100;
        const mouseCanvasX = (e.clientX - rect.left) / scale;
        const mouseCanvasY = (e.clientY - rect.top) / scale;

        setDragOffset({
            x: mouseCanvasX - el.left,
            y: mouseCanvasY - el.top,
        });
    };

    const handleResizeMouseDown = (e: React.MouseEvent, el: ElementItem, handle: string) => {
        e.stopPropagation();
        if (el.isLocked) return;
        setSelectedElementId(el.id);
        setIsResizing(handle);

        const rect = canvasRef.current?.getBoundingClientRect();
        if (!rect) return;

        const scale = zoom / 100;
        const mouseCanvasX = (e.clientX - rect.left) / scale;
        const mouseCanvasY = (e.clientY - rect.top) / scale;

        setInitialDimensions({
            top: el.top,
            left: el.left,
            width: el.width,
            height: el.height,
            mouseX: mouseCanvasX,
            mouseY: mouseCanvasY,
        });
    };

    const handleGlobalMouseMove = useCallback(
        (e: MouseEvent) => {
            if (!selectedElementId || (!isDragging && !isResizing)) return;
            const rect = canvasRef.current?.getBoundingClientRect();
            if (!rect) return;

            const scale = zoom / 100;
            const gridStep = snapToGrid ? 5 : 1;
            const mouseCanvasX = (e.clientX - rect.left) / scale;
            const mouseCanvasY = (e.clientY - rect.top) / scale;

            if (isDragging) {
                const newLeft = mouseCanvasX - dragOffset.x;
                const newTop = mouseCanvasY - dragOffset.y;

                const snappedLeft = Math.round(newLeft / gridStep) * gridStep;
                const snappedTop = Math.round(newTop / gridStep) * gridStep;

                setElements((prev) =>
                    prev.map((item) =>
                        item.id === selectedElementId
                            ? {
                                  ...item,
                                  left: Math.max(0, Math.min(canvasBaseWidth - item.width, snappedLeft)),
                                  top: Math.max(0, Math.min(canvasBaseHeight - item.height, snappedTop)),
                              }
                            : item
                    )
                );
            } else if (isResizing) {
                const deltaX = mouseCanvasX - initialDimensions.mouseX;
                const deltaY = mouseCanvasY - initialDimensions.mouseY;

                setElements((prev) =>
                    prev.map((item) => {
                        if (item.id !== selectedElementId) return item;
                        let { top, left, width, height } = initialDimensions;

                        if (isResizing.includes('e')) width = Math.max(30, width + deltaX);
                        if (isResizing.includes('s')) height = Math.max(20, height + deltaY);
                        if (isResizing.includes('w')) {
                            const newWidth = Math.max(30, width - deltaX);
                            left = left + (width - newWidth);
                            width = newWidth;
                        }
                        if (isResizing.includes('n')) {
                            const newHeight = Math.max(20, height - deltaY);
                            top = top + (height - newHeight);
                            height = newHeight;
                        }

                        return {
                            ...item,
                            top: Math.round(top / gridStep) * gridStep,
                            left: Math.round(left / gridStep) * gridStep,
                            width: Math.round(width / gridStep) * gridStep,
                            height: Math.round(height / gridStep) * gridStep,
                        };
                    })
                );
            }
        },
        [selectedElementId, isDragging, isResizing, dragOffset, initialDimensions, zoom, snapToGrid, canvasBaseWidth, canvasBaseHeight]
    );

    const handleGlobalMouseUp = useCallback(() => {
        setIsDragging(false);
        setIsResizing(null);
    }, []);

    useEffect(() => {
        if (isDragging || isResizing) {
            window.addEventListener('mousemove', handleGlobalMouseMove);
            window.addEventListener('mouseup', handleGlobalMouseUp);
        } else {
            window.removeEventListener('mousemove', handleGlobalMouseMove);
            window.removeEventListener('mouseup', handleGlobalMouseUp);
        }
        return () => {
            window.removeEventListener('mousemove', handleGlobalMouseMove);
            window.removeEventListener('mouseup', handleGlobalMouseUp);
        };
    }, [isDragging, isResizing, handleGlobalMouseMove, handleGlobalMouseUp]);

    const renderRealContent = (content: string) => {
        let res = content;
        Object.keys(DUMMY_DATA).forEach((key) => {
            res = res.replace(new RegExp(key, 'g'), DUMMY_DATA[key]);
        });
        return res;
    };

    const selectedEl = elements.find((e) => e.id === selectedElementId);

    return (
        <div className="py-2 px-3 bg-light min-vh-100">
            {/* TOP BAR / CONTROL HEADER */}
            <Card className="border-0 shadow-sm rounded-4 mb-3">
                <Card.Body className="py-2 px-3">
                    <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
                        <div className="d-flex align-items-center gap-2">
                            <div className="bg-primary text-white p-2 rounded-3 d-flex align-items-center justify-content-center">
                                <i className="bx bx-award fs-4"></i>
                            </div>
                            <div>
                                <h5 className="fw-bold mb-0 text-dark">Certificate Studio</h5>
                                <p className="text-muted small mb-0">Customize visual layouts & dynamic placeholders</p>
                            </div>
                        </div>

                        {/* TEMPLATE QUICK SELECTOR & NAME */}
                        <div className="d-flex align-items-center gap-2 flex-grow-1 max-w-md mx-md-3">
                            <Form.Select
                                size="sm"
                                className="rounded-3 shadow-none border-secondary-subtle"
                                value={selectedTemplateId || ''}
                                onChange={(e) => handleSelectTemplate(e.target.value)}
                                style={{ minWidth: '180px' }}
                            >
                                <option value="">+ New Template</option>
                                {templates.map((t) => (
                                    <option key={t.id} value={t.id}>
                                        {t.name}
                                    </option>
                                ))}
                            </Form.Select>
                            <Form.Control
                                size="sm"
                                type="text"
                                className="rounded-3 fw-semibold shadow-none border-secondary-subtle"
                                placeholder="Template Title..."
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>

                        {/* ACTIONS & SAVING */}
                        <div className="d-flex align-items-center gap-2">
                            <Button
                                variant="outline-primary"
                                size="sm"
                                className="rounded-3 px-3 fw-semibold"
                                onClick={() => setShowPreviewModal(true)}
                            >
                                <i className="bx bx-show me-1"></i> Preview Result
                            </Button>
                            {selectedTemplateId && (
                                <Button
                                    variant="outline-danger"
                                    size="sm"
                                    className="rounded-3"
                                    onClick={handleDeleteTemplate}
                                    disabled={loading}
                                >
                                    <i className="bx bx-trash me-1"></i> Delete
                                </Button>
                            )}
                            <Button
                                variant="primary"
                                size="sm"
                                className="rounded-3 px-3 fw-semibold shadow-sm"
                                onClick={handleSaveTemplate}
                                disabled={loading}
                            >
                                {loading ? (
                                    <Spinner size="sm" animation="border" />
                                ) : (
                                    <>
                                        <i className="bx bx-save me-1"></i> Save Changes
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                </Card.Body>
            </Card>

            <Row className="g-3">
                {/* LEFT SIDEBAR: ELEMENTS PALETTE, SETTINGS, LAYERS */}
                <Col xl={2} lg={3}>
                    <Card className="border-0 shadow-sm rounded-4 overflow-hidden h-100">
                        <Tab.Container activeKey={activeTab} onSelect={(k) => setActiveTab(k || 'elements')}>
                            <Card.Header className="bg-white border-0 pt-3 pb-0">
                                <Nav variant="pills" className="nav-justified bg-light p-1 rounded-3 small fw-semibold">
                                    <Nav.Item>
                                        <Nav.Link eventKey="elements" className="rounded-3 py-1">
                                            <i className="bx bx-category me-1"></i> Elements
                                        </Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item>
                                        <Nav.Link eventKey="background" className="rounded-3 py-1">
                                            <i className="bx bx-image me-1"></i> Canvas
                                        </Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item>
                                        <Nav.Link eventKey="layers" className="rounded-3 py-1">
                                            <i className="bx bx-layer me-1"></i> Layers ({elements.length})
                                        </Nav.Link>
                                    </Nav.Item>
                                </Nav>
                            </Card.Header>

                            <Card.Body className="p-3">
                                <Tab.Content>
                                    {/* TAB 1: ADD ELEMENTS */}
                                    <Tab.Pane eventKey="elements">
                                        <h6 className="fw-bold text-dark small mb-2">Dynamic Placeholders</h6>
                                        <p className="text-muted extra-small mb-3" style={{ fontSize: '11px' }}>
                                            Click any button to inject dynamic variables into the certificate canvas.
                                        </p>
                                        <div className="d-grid gap-2">
                                            {PRESET_PLACEHOLDERS.map((preset) => (
                                                <Button
                                                    key={preset.code}
                                                    variant="outline-light"
                                                    className="text-start border text-dark bg-white rounded-3 p-2 d-flex align-items-center justify-content-between hover-shadow transition-all"
                                                    onClick={() => handleAddElement(preset.code, preset.type as any)}
                                                >
                                                    <div className="d-flex align-items-center gap-2">
                                                        <i className={`bx ${preset.icon} fs-5 text-primary`}></i>
                                                        <span className="small fw-semibold">{preset.label}</span>
                                                    </div>
                                                    <Badge bg="secondary-subtle" className="text-dark extra-small font-monospace">
                                                        {preset.code.length > 16 ? preset.code.substring(0, 14) + '..' : preset.code}
                                                    </Badge>
                                                </Button>
                                            ))}
                                        </div>
                                    </Tab.Pane>

                                    {/* TAB 2: CANVAS & BACKGROUND SETTINGS */}
                                    <Tab.Pane eventKey="background">
                                        <h6 className="fw-bold text-dark small mb-2">Orientation & Page Size</h6>
                                        <div className="d-flex gap-2 mb-3">
                                            <Button
                                                variant={orientation === 'LANDSCAPE' ? 'primary' : 'outline-secondary'}
                                                size="sm"
                                                className="w-50 rounded-3"
                                                onClick={() => handleOrientationChange('LANDSCAPE')}
                                            >
                                                <i className="bx bx-landscape me-1"></i> Landscape
                                            </Button>
                                            <Button
                                                variant={orientation === 'PORTRAIT' ? 'primary' : 'outline-secondary'}
                                                size="sm"
                                                className="w-50 rounded-3"
                                                onClick={() => handleOrientationChange('PORTRAIT')}
                                            >
                                                <i className="bx bx-portrait me-1"></i> Portrait
                                            </Button>
                                        </div>

                                        <h6 className="fw-bold text-dark small mb-2">Background Image</h6>
                                        <p className="text-muted extra-small mb-2" style={{ fontSize: '11px' }}>
                                            Gambar otomatis di-crop mengikuti rasio A4 {orientation.toLowerCase()} agar hasil PDF tidak melar/distorsi.
                                        </p>
                                        <Form.Group className="mb-3">
                                            <Form.Control
                                                size="sm"
                                                type="file"
                                                accept="image/*"
                                                className="rounded-3"
                                                onChange={handleBgUpload}
                                                disabled={cropping}
                                            />
                                        </Form.Group>

                                        {cropping && (
                                            <div className="text-center py-2 mb-2">
                                                <Spinner animation="border" size="sm" variant="primary" className="me-2" />
                                                <span className="small text-muted">Memproses gambar...</span>
                                            </div>
                                        )}

                                        {bgPreview ? (
                                            <div className="position-relative border rounded-3 p-1 mb-3 bg-light text-center">
                                                <img
                                                    src={bgPreview}
                                                    alt="Background preview"
                                                    className="img-fluid rounded-2 max-h-36 object-fit-contain"
                                                    style={{ maxHeight: '140px' }}
                                                />
                                                <Button
                                                    variant="danger"
                                                    size="sm"
                                                    className="position-absolute top-0 end-0 m-1 rounded-circle p-1"
                                                    style={{ width: '24px', height: '24px', lineHeight: '12px' }}
                                                    onClick={handleRemoveBg}
                                                >
                                                    &times;
                                                </Button>
                                            </div>
                                        ) : (
                                            <div className="p-3 text-center border border-dashed rounded-3 text-muted small mb-3">
                                                No background image uploaded. Default blank canvas will be used.
                                            </div>
                                        )}

                                        <Form.Group className="mb-2">
                                            <Form.Label className="small fw-semibold">Description / Notes</Form.Label>
                                            <Form.Control
                                                as="textarea"
                                                rows={3}
                                                size="sm"
                                                className="rounded-3"
                                                placeholder="Internal notes about this certificate template..."
                                                value={description}
                                                onChange={(e) => setDescription(e.target.value)}
                                            />
                                        </Form.Group>
                                    </Tab.Pane>

                                    {/* TAB 3: LAYERS & ELEMENT ORDER */}
                                    <Tab.Pane eventKey="layers">
                                        <h6 className="fw-bold text-dark small mb-2">Canvas Layers</h6>
                                        {elements.length === 0 ? (
                                            <p className="text-muted small text-center py-4">No elements added yet.</p>
                                        ) : (
                                            <div className="d-flex flex-column gap-2">
                                                {elements
                                                    .slice()
                                                    .reverse()
                                                    .map((el, idx) => {
                                                        const isSelected = el.id === selectedElementId;
                                                        return (
                                                            <div
                                                                key={el.id}
                                                                className={`p-2 rounded-3 border d-flex align-items-center justify-content-between cursor-pointer transition-all ${
                                                                    isSelected ? 'border-primary bg-primary-subtle' : 'bg-white'
                                                                }`}
                                                                onClick={() => setSelectedElementId(el.id)}
                                                            >
                                                                <div className="d-flex align-items-center gap-2 overflow-hidden me-2">
                                                                    <i className={`bx ${el.type === 'qr' ? 'bx-qr' : 'bx-font-size'} text-muted`}></i>
                                                                    <span className="small text-truncate fw-medium" style={{ maxWidth: '120px' }}>
                                                                        {el.content}
                                                                    </span>
                                                                </div>

                                                                <div className="d-flex align-items-center gap-1">
                                                                    <Button
                                                                        variant="light"
                                                                        size="sm"
                                                                        className="p-1 border-0"
                                                                        title="Bring Forward"
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            bringForward(el.id);
                                                                        }}
                                                                    >
                                                                        <i className="bx bx-chevron-up"></i>
                                                                    </Button>
                                                                    <Button
                                                                        variant="light"
                                                                        size="sm"
                                                                        className="p-1 border-0"
                                                                        title="Send Backward"
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            sendBackward(el.id);
                                                                        }}
                                                                    >
                                                                        <i className="bx bx-chevron-down"></i>
                                                                    </Button>
                                                                    <Button
                                                                        variant="light"
                                                                        size="sm"
                                                                        className="p-1 border-0 text-danger"
                                                                        title="Delete"
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            removeElement(el.id);
                                                                        }}
                                                                    >
                                                                        <i className="bx bx-trash"></i>
                                                                    </Button>
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                            </div>
                                        )}
                                    </Tab.Pane>
                                </Tab.Content>
                            </Card.Body>
                        </Tab.Container>
                    </Card>
                </Col>

                {/* CENTER: INTERACTIVE CANVAS VIEWPORT */}
                <Col xl={8} lg={9}>
                    <Card className="border-0 shadow-sm rounded-4 h-100 overflow-hidden d-flex flex-column">
                        {/* CANVAS TOOLBAR */}
                        <div className="p-2 border-bottom bg-white d-flex align-items-center justify-content-between px-3">
                            <div className="d-flex align-items-center gap-2">
                                <ButtonGroup size="sm">
                                    <Button
                                        variant="outline-secondary"
                                        onClick={() => setZoom(Math.max(50, zoom - 10))}
                                    >
                                        <i className="bx bx-zoom-out"></i>
                                    </Button>
                                    <Button variant="outline-secondary" disabled className="fw-semibold px-2 text-dark">
                                        {zoom}%
                                    </Button>
                                    <Button
                                        variant="outline-secondary"
                                        onClick={() => setZoom(Math.min(150, zoom + 10))}
                                    >
                                        <i className="bx bx-zoom-in"></i>
                                    </Button>
                                </ButtonGroup>
                                <Button
                                    variant={showGrid ? 'secondary' : 'outline-secondary'}
                                    size="sm"
                                    className="rounded-3"
                                    onClick={() => setShowGrid(!showGrid)}
                                >
                                    <i className="bx bx-grid-alt me-1"></i> Grid
                                </Button>
                                <Button
                                    variant={snapToGrid ? 'secondary' : 'outline-secondary'}
                                    size="sm"
                                    className="rounded-3"
                                    onClick={() => setSnapToGrid(!snapToGrid)}
                                >
                                    <i className="bx bx-magnet me-1"></i> Snap
                                </Button>
                            </div>

                            <div className="small text-muted fw-semibold">
                                A4 {orientation} ({canvasBaseWidth} &times; {canvasBaseHeight} pt)
                            </div>
                        </div>

                        {/* CANVAS WORKSPACE AREA */}
                        <div
                            className="flex-grow-1 p-4 bg-secondary-subtle overflow-auto d-flex align-items-center justify-content-center"
                            style={{ minHeight: '520px' }}
                            onClick={() => setSelectedElementId(null)}
                        >
                            <div
                                ref={canvasRef}
                                className="position-relative shadow-lg bg-white transition-all rounded-1"
                                style={{
                                    width: `${canvasBaseWidth * (zoom / 100)}px`,
                                    height: `${canvasBaseHeight * (zoom / 100)}px`,
                                    transformOrigin: 'top left',
                                    backgroundImage: bgPreview
                                        ? `url(${bgPreview})`
                                        : showGrid
                                        ? 'radial-gradient(#cbd5e1 1px, transparent 1px)'
                                        : 'none',
                                    backgroundSize: bgPreview ? '100% 100%' : '20px 20px',
                                    backgroundPosition: bgPreview ? '0 0' : 'center',
                                    backgroundRepeat: 'no-repeat',
                                    userSelect: 'none',
                                }}
                            >
                                {elements.map((el) => {
                                    const isSelected = el.id === selectedElementId;
                                    const scale = zoom / 100;

                                    return (
                                        <div
                                            key={el.id}
                                            onMouseDown={(e) => handleElementMouseDown(e, el)}
                                            style={{
                                                position: 'absolute',
                                                top: `${el.top * scale}px`,
                                                left: `${el.left * scale}px`,
                                                width: `${el.width * scale}px`,
                                                height: `${el.height * scale}px`,
                                                fontSize: `${el.fontSize * scale}px`,
                                                color: el.color,
                                                textAlign: el.textAlign,
                                                fontWeight: el.fontWeight || 'normal',
                                                fontStyle: el.fontStyle || 'normal',
                                                fontFamily: el.fontFamily || 'inherit',
                                                border: isSelected
                                                    ? '2px solid #6C47FF'
                                                    : '1px dashed #cbd5e1',
                                                cursor: el.isLocked ? 'not-allowed' : 'move',
                                                boxSizing: 'border-box',
                                                padding: '2px',
                                                lineHeight: '1.2',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent:
                                                    el.textAlign === 'center'
                                                        ? 'center'
                                                        : el.textAlign === 'right'
                                                        ? 'flex-end'
                                                        : 'flex-start',
                                                backgroundColor: isSelected ? 'rgba(108, 71, 255, 0.08)' : 'transparent',
                                                boxShadow: isSelected ? '0 0 10px rgba(108, 71, 255, 0.25)' : 'none',
                                            }}
                                        >
                                            {el.type === 'qr' ? (
                                                <div className="bg-dark text-white d-flex flex-column align-items-center justify-content-center h-100 w-100 rounded p-1">
                                                    <i className="bx bx-qr-scan fs-3"></i>
                                                    <span style={{ fontSize: `${Math.max(8, el.fontSize * scale * 0.7)}px` }}>
                                                        QR CODE
                                                    </span>
                                                </div>
                                            ) : (
                                                <span className="text-break">{renderRealContent(el.content)}</span>
                                            )}

                                            {/* RESIZE HANDLES FOR SELECTED ELEMENT */}
                                            {isSelected && !el.isLocked && (
                                                <>
                                                    <div
                                                        className="position-absolute bg-primary border border-white rounded-circle"
                                                        style={{
                                                            width: '10px',
                                                            height: '10px',
                                                            bottom: '-5px',
                                                            right: '-5px',
                                                            cursor: 'se-resize',
                                                        }}
                                                        onMouseDown={(e) => handleResizeMouseDown(e, el, 'se')}
                                                    />
                                                    <div
                                                        className="position-absolute bg-primary border border-white rounded-circle"
                                                        style={{
                                                            width: '10px',
                                                            height: '10px',
                                                            bottom: '-5px',
                                                            left: '-5px',
                                                            cursor: 'sw-resize',
                                                        }}
                                                        onMouseDown={(e) => handleResizeMouseDown(e, el, 'sw')}
                                                    />
                                                    <div
                                                        className="position-absolute bg-primary border border-white rounded-circle"
                                                        style={{
                                                            width: '10px',
                                                            height: '10px',
                                                            top: '-5px',
                                                            right: '-5px',
                                                            cursor: 'ne-resize',
                                                        }}
                                                        onMouseDown={(e) => handleResizeMouseDown(e, el, 'ne')}
                                                    />
                                                    <div
                                                        className="position-absolute bg-primary border border-white rounded-circle"
                                                        style={{
                                                            width: '10px',
                                                            height: '10px',
                                                            top: '-5px',
                                                            left: '-5px',
                                                            cursor: 'nw-resize',
                                                        }}
                                                        onMouseDown={(e) => handleResizeMouseDown(e, el, 'nw')}
                                                    />
                                                </>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </Card>
                </Col>

                {/* RIGHT SIDEBAR: ELEMENT INSPECTOR */}
                <Col xl={2} lg={12}>
                    <Card className="border-0 shadow-sm rounded-4 h-100">
                        <Card.Header className="bg-white border-0 pt-3 pb-2 d-flex align-items-center justify-content-between">
                            <h6 className="fw-bold text-dark mb-0">Element Inspector</h6>
                            {selectedEl && (
                                <div className="d-flex align-items-center gap-1">
                                    <Button
                                        variant="outline-secondary"
                                        size="sm"
                                        className="p-1"
                                        title="Duplicate"
                                        onClick={() => duplicateElement(selectedEl.id)}
                                    >
                                        <i className="bx bx-copy"></i>
                                    </Button>
                                    <Button
                                        variant="outline-danger"
                                        size="sm"
                                        className="p-1"
                                        title="Delete"
                                        onClick={() => removeElement(selectedEl.id)}
                                    >
                                        <i className="bx bx-trash"></i>
                                    </Button>
                                </div>
                            )}
                        </Card.Header>

                        <Card.Body className="p-3 pt-0">
                            {selectedEl ? (
                                <div>
                                    {/* CONTENT / VALUE */}
                                    <Form.Group className="mb-3">
                                        <Form.Label className="small fw-semibold">Content / Text</Form.Label>
                                        <Form.Control
                                            size="sm"
                                            type="text"
                                            className="rounded-3"
                                            value={selectedEl.content}
                                            onChange={(e) => updateSelectedElement('content', e.target.value)}
                                        />
                                    </Form.Group>

                                    {/* TYPOGRAPHY */}
                                    <h6 className="fw-bold text-dark extra-small mb-2 text-uppercase text-muted">Typography</h6>
                                    <Form.Group className="mb-2">
                                        <Form.Label className="small mb-1">Font Family</Form.Label>
                                        <Form.Select
                                            size="sm"
                                            className="rounded-3"
                                            value={selectedEl.fontFamily || 'Arial, sans-serif'}
                                            onChange={(e) => updateSelectedElement('fontFamily', e.target.value)}
                                        >
                                            {FONT_FAMILIES.map((f) => (
                                                <option key={f.value} value={f.value}>
                                                    {f.label}
                                                </option>
                                            ))}
                                        </Form.Select>
                                    </Form.Group>

                                    <Row className="g-2 mb-2">
                                        <Col xs={6}>
                                            <Form.Label className="small mb-1">Font Size (px)</Form.Label>
                                            <Form.Control
                                                size="sm"
                                                type="number"
                                                className="rounded-3"
                                                value={selectedEl.fontSize}
                                                onChange={(e) => updateSelectedElement('fontSize', Number(e.target.value))}
                                            />
                                        </Col>
                                        <Col xs={6}>
                                            <Form.Label className="small mb-1">Text Color</Form.Label>
                                            <div className="d-flex align-items-center gap-1">
                                                <Form.Control
                                                    size="sm"
                                                    type="color"
                                                    className="form-control-color w-100 rounded-3"
                                                    value={selectedEl.color}
                                                    onChange={(e) => updateSelectedElement('color', e.target.value)}
                                                />
                                            </div>
                                        </Col>
                                    </Row>

                                    {/* STYLES & ALIGNMENT */}
                                    <Form.Group className="mb-3">
                                        <Form.Label className="small mb-1">Text Alignment</Form.Label>
                                        <ButtonGroup size="sm" className="w-100">
                                            <Button
                                                variant={selectedEl.textAlign === 'left' ? 'primary' : 'outline-secondary'}
                                                onClick={() => updateSelectedElement('textAlign', 'left')}
                                            >
                                                <i className="bx bx-align-left"></i>
                                            </Button>
                                            <Button
                                                variant={selectedEl.textAlign === 'center' ? 'primary' : 'outline-secondary'}
                                                onClick={() => updateSelectedElement('textAlign', 'center')}
                                            >
                                                <i className="bx bx-align-middle"></i>
                                            </Button>
                                            <Button
                                                variant={selectedEl.textAlign === 'right' ? 'primary' : 'outline-secondary'}
                                                onClick={() => updateSelectedElement('textAlign', 'right')}
                                            >
                                                <i className="bx bx-align-right"></i>
                                            </Button>
                                        </ButtonGroup>
                                    </Form.Group>

                                    <Form.Group className="mb-3">
                                        <Form.Label className="small mb-1">Font Styling</Form.Label>
                                        <div className="d-flex gap-2">
                                            <Button
                                                size="sm"
                                                variant={selectedEl.fontWeight === 'bold' ? 'primary' : 'outline-secondary'}
                                                className="w-50 rounded-3 fw-bold"
                                                onClick={() =>
                                                    updateSelectedElement('fontWeight', selectedEl.fontWeight === 'bold' ? 'normal' : 'bold')
                                                }
                                            >
                                                Bold
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant={selectedEl.fontStyle === 'italic' ? 'primary' : 'outline-secondary'}
                                                className="w-50 rounded-3 fst-italic"
                                                onClick={() =>
                                                    updateSelectedElement('fontStyle', selectedEl.fontStyle === 'italic' ? 'normal' : 'italic')
                                                }
                                            >
                                                Italic
                                            </Button>
                                        </div>
                                    </Form.Group>

                                    {/* POSITION & DIMENSIONS */}
                                    <h6 className="fw-bold text-dark extra-small mb-2 text-uppercase text-muted">Layout & Position</h6>
                                    <div className="d-flex gap-2 mb-2">
                                        <Button
                                            size="sm"
                                            variant="outline-secondary"
                                            className="w-50 rounded-3"
                                            title="Center this element horizontally on the canvas"
                                            onClick={() => centerElementHorizontally(selectedEl.id)}
                                        >
                                            <i className="bx bx-horizontal-center me-1"></i> Center H
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="outline-secondary"
                                            className="w-50 rounded-3"
                                            title="Center this element vertically on the canvas"
                                            onClick={() => centerElementVertically(selectedEl.id)}
                                        >
                                            <i className="bx bx-vertical-center me-1"></i> Center V
                                        </Button>
                                    </div>
                                    <Row className="g-2 mb-2">
                                        <Col xs={6}>
                                            <Form.Label className="small mb-1">X Pos (px)</Form.Label>
                                            <Form.Control
                                                size="sm"
                                                type="number"
                                                className="rounded-3"
                                                value={selectedEl.left}
                                                onChange={(e) => updateSelectedElement('left', Number(e.target.value))}
                                            />
                                        </Col>
                                        <Col xs={6}>
                                            <Form.Label className="small mb-1">Y Pos (px)</Form.Label>
                                            <Form.Control
                                                size="sm"
                                                type="number"
                                                className="rounded-3"
                                                value={selectedEl.top}
                                                onChange={(e) => updateSelectedElement('top', Number(e.target.value))}
                                            />
                                        </Col>
                                    </Row>
                                    <Row className="g-2 mb-3">
                                        <Col xs={6}>
                                            <Form.Label className="small mb-1">Width (px)</Form.Label>
                                            <Form.Control
                                                size="sm"
                                                type="number"
                                                className="rounded-3"
                                                value={selectedEl.width}
                                                onChange={(e) => updateSelectedElement('width', Number(e.target.value))}
                                            />
                                        </Col>
                                        <Col xs={6}>
                                            <Form.Label className="small mb-1">Height (px)</Form.Label>
                                            <Form.Control
                                                size="sm"
                                                type="number"
                                                className="rounded-3"
                                                value={selectedEl.height}
                                                onChange={(e) => updateSelectedElement('height', Number(e.target.value))}
                                            />
                                        </Col>
                                    </Row>

                                    {/* LOCKING & ACTIONS */}
                                    <div className="d-flex align-items-center justify-content-between pt-2 border-top">
                                        <Form.Check
                                            type="switch"
                                            id="lock-switch"
                                            label="Lock Element Position"
                                            className="small fw-semibold"
                                            checked={!!selectedEl.isLocked}
                                            onChange={(e) => updateSelectedElement('isLocked', e.target.checked)}
                                        />
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-5 text-muted">
                                    <i className="bx bx-pointer fs-1 text-secondary mb-2"></i>
                                    <p className="small mb-0">Select an element on canvas or layer list to customize properties.</p>
                                </div>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* PREVIEW MODAL */}
            <Modal show={showPreviewModal} onHide={() => setShowPreviewModal(false)} size="xl" centered scrollable>
                <Modal.Header closeButton className="border-0 pb-2">
                    <Modal.Title className="h5 fw-bold d-flex align-items-center gap-2">
                        <i className="bx bx-show text-primary"></i>
                        Certificate Render Preview
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="bg-secondary-subtle p-4 d-flex justify-content-center align-items-center overflow-auto">
                    <div
                        className="position-relative shadow-lg bg-white rounded-1 flex-shrink-0"
                        style={{
                            width: `${canvasBaseWidth}px`,
                            height: `${canvasBaseHeight}px`,
                            backgroundImage: bgPreview ? `url(${bgPreview})` : 'none',
                            backgroundSize: '100% 100%',
                            backgroundPosition: '0 0',
                            backgroundRepeat: 'no-repeat',
                            overflow: 'hidden',
                        }}
                    >
                        {elements.map((el) => {
                            const renderedText = renderRealContent(el.content);
                            return (
                                <div
                                    key={el.id}
                                    style={{
                                        position: 'absolute',
                                        top: `${el.top}px`,
                                        left: `${el.left}px`,
                                        width: `${el.width}px`,
                                        height: `${el.height}px`,
                                        fontSize: `${el.fontSize}px`,
                                        color: el.color,
                                        textAlign: el.textAlign,
                                        fontWeight: el.fontWeight || 'normal',
                                        fontStyle: el.fontStyle || 'normal',
                                        fontFamily: el.fontFamily || 'inherit',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent:
                                            el.textAlign === 'center'
                                                ? 'center'
                                                : el.textAlign === 'right'
                                                ? 'flex-end'
                                                : 'flex-start',
                                        boxSizing: 'border-box',
                                        lineHeight: '1.2',
                                        padding: '2px',
                                    }}
                                >
                                    {el.type === 'qr' ? (
                                        <div className="bg-dark text-white d-flex flex-column align-items-center justify-content-center h-100 w-100 rounded p-1">
                                            <i className="bx bx-qr-scan fs-2"></i>
                                            <span style={{ fontSize: `${Math.max(9, el.fontSize * 0.7)}px` }}>VERIFIED</span>
                                        </div>
                                    ) : (
                                        <span className="text-break">{renderedText}</span>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </Modal.Body>
                <Modal.Footer className="border-0 pt-2">
                    <Button variant="secondary" size="sm" className="rounded-3 px-4" onClick={() => setShowPreviewModal(false)}>
                        Close Preview
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default CertificateTemplatePage;
