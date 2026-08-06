import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Button, Form, Spinner } from 'react-bootstrap';
import CertificateTemplateModel, { CertificateTemplate } from '@/models/CertificateTemplateModel';
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
}

const CertificateTemplatePage: React.FC = () => {
    const [templates, setTemplates] = useState<any[]>([]);
    const [selectedTemplateId, setSelectedTemplateId] = useState<number | null>(null);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [orientation, setOrientation] = useState<'LANDSCAPE' | 'PORTRAIT'>('LANDSCAPE');
    const [backgroundImage, setBackgroundImage] = useState<File | null>(null);
    const [bgPreview, setBgPreview] = useState<string>('');
    const [elements, setElements] = useState<ElementItem[]>([]);
    const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

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

    const handleAddElement = (placeholder: string) => {
        const newEl: ElementItem = {
            id: 'el_' + Date.now(),
            type: placeholder === '{{qr_code}}' ? 'qr' : 'text',
            content: placeholder,
            top: 100 + elements.length * 30,
            left: 100,
            width: placeholder === '{{qr_code}}' ? 100 : 300,
            height: placeholder === '{{qr_code}}' ? 100 : 40,
            fontSize: placeholder.includes('participant') ? 32 : 18,
            color: '#1a1a2e',
            textAlign: 'center',
        };
        setElements([...elements, newEl]);
        setSelectedElementId(newEl.id);
    };

    const updateSelectedElement = (key: keyof ElementItem, val: any) => {
        if (!selectedElementId) return;
        setElements(elements.map(el => el.id === selectedElementId ? { ...el, [key]: val } : el));
    };

    const removeElement = (id: string) => {
        setElements(elements.filter(el => el.id !== id));
        if (selectedElementId === id) setSelectedElementId(null);
    };

    const handleBgUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setBackgroundImage(file);
            setBgPreview(URL.createObjectURL(file));
        }
    };

    const handleSaveTemplate = async () => {
        if (!name) {
            Swal.fire('Error', 'Template Name is required', 'error');
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
                Swal.fire('Success', 'Template updated', 'success');
            } else {
                await CertificateTemplateModel.create(formData);
                Swal.fire('Success', 'Template created', 'success');
            }
            loadTemplates();
        } catch (err: any) {
            Swal.fire('Error', err?.message || 'Save failed', 'error');
        } finally {
            setLoading(false);
        }
    };

    const selectedEl = elements.find(e => e.id === selectedElementId);

    return (
        <div className="py-3 px-2">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <div>
                    <h4 className="fw-bold text-dark mb-1">Certificate Template Builder</h4>
                    <p className="text-muted small mb-0">Custom design certificate template drag & drop layout</p>
                </div>
                <Button variant="primary" className="rounded-pill px-4" onClick={handleSaveTemplate} disabled={loading}>
                    {loading ? <Spinner size="sm" animation="border" /> : <><i className="bx bx-save me-1"></i> Save Template</>}
                </Button>
            </div>

            <Row className="g-3">
                {/* LEFT TOOLBAR & TEMPLATE SELECTOR */}
                <Col xl={3} lg={4}>
                    <Card className="border-0 shadow-sm rounded-4 p-3 mb-3">
                        <h6 className="fw-bold mb-2">Saved Templates</h6>
                        <Form.Select className="mb-3" value={selectedTemplateId || ''} onChange={(e) => {
                            const id = Number(e.target.value);
                            if (!id) {
                                setSelectedTemplateId(null);
                                setName('');
                                setElements([]);
                                return;
                            }
                            const t = templates.find(item => item.id === id);
                            if (t) {
                                setSelectedTemplateId(t.id);
                                setName(t.name);
                                setDescription(t.description || '');
                                setOrientation(t.orientation || 'LANDSCAPE');
                                setElements(t.template_json ? JSON.parse(t.template_json) : []);
                            }
                        }}>
                            <option value="">-- Create New Template --</option>
                            {templates.map(t => (
                                <option key={t.id} value={t.id}>{t.name}</option>
                            ))}
                        </Form.Select>

                        <h6 className="fw-bold mb-2">Template Info</h6>
                        <Form.Group className="mb-2">
                            <Form.Label className="small fw-semibold">Template Name</Form.Label>
                            <Form.Control size="sm" type="text" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Jakarta Festival 2026 Template" />
                        </Form.Group>
                        <Form.Group className="mb-2">
                            <Form.Label className="small fw-semibold">Orientation</Form.Label>
                            <Form.Select size="sm" value={orientation} onChange={e => setOrientation(e.target.value as any)}>
                                <option value="LANDSCAPE">Landscape (A4)</option>
                                <option value="PORTRAIT">Portrait (A4)</option>
                            </Form.Select>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label className="small fw-semibold">Background Image</Form.Label>
                            <Form.Control size="sm" type="file" accept="image/*" onChange={handleBgUpload} />
                        </Form.Group>

                        <h6 className="fw-bold mb-2">Drag Elements</h6>
                        <div className="d-flex flex-wrap gap-2">
                            <Button size="sm" variant="light" className="border" onClick={() => handleAddElement('{{participant_name}}')}>+ Participant Name</Button>
                            <Button size="sm" variant="light" className="border" onClick={() => handleAddElement('{{event_name}}')}>+ Event Name</Button>
                            <Button size="sm" variant="light" className="border" onClick={() => handleAddElement('{{event_date}}')}>+ Event Date</Button>
                            <Button size="sm" variant="light" className="border" onClick={() => handleAddElement('{{organizer_name}}')}>+ Organizer Name</Button>
                            <Button size="sm" variant="light" className="border" onClick={() => handleAddElement('{{certificate_number}}')}>+ Cert Number</Button>
                            <Button size="sm" variant="light" className="border" onClick={() => handleAddElement('{{qr_code}}')}>+ QR Code</Button>
                        </div>
                    </Card>

                    {/* SELECTED ELEMENT PROPERTIES */}
                    {selectedEl && (
                        <Card className="border-0 shadow-sm rounded-4 p-3">
                            <div className="d-flex justify-content-between align-items-center mb-2">
                                <h6 className="fw-bold mb-0">Element Inspector</h6>
                                <Button variant="outline-danger" size="sm" onClick={() => removeElement(selectedEl.id)}>Delete</Button>
                            </div>
                            <Form.Group className="mb-2">
                                <Form.Label className="small mb-1">Content / Placeholder</Form.Label>
                                <Form.Control size="sm" type="text" value={selectedEl.content} onChange={e => updateSelectedElement('content', e.target.value)} />
                            </Form.Group>
                            <Row className="g-2 mb-2">
                                <Col xs={6}>
                                    <Form.Label className="small mb-1">Top (px)</Form.Label>
                                    <Form.Control size="sm" type="number" value={selectedEl.top} onChange={e => updateSelectedElement('top', Number(e.target.value))} />
                                </Col>
                                <Col xs={6}>
                                    <Form.Label className="small mb-1">Left (px)</Form.Label>
                                    <Form.Control size="sm" type="number" value={selectedEl.left} onChange={e => updateSelectedElement('left', Number(e.target.value))} />
                                </Col>
                            </Row>
                            <Row className="g-2 mb-2">
                                <Col xs={6}>
                                    <Form.Label className="small mb-1">Font Size (px)</Form.Label>
                                    <Form.Control size="sm" type="number" value={selectedEl.fontSize} onChange={e => updateSelectedElement('fontSize', Number(e.target.value))} />
                                </Col>
                                <Col xs={6}>
                                    <Form.Label className="small mb-1">Text Align</Form.Label>
                                    <Form.Select size="sm" value={selectedEl.textAlign} onChange={e => updateSelectedElement('textAlign', e.target.value)}>
                                        <option value="left">Left</option>
                                        <option value="center">Center</option>
                                        <option value="right">Right</option>
                                    </Form.Select>
                                </Col>
                            </Row>
                        </Card>
                    )}
                </Col>

                {/* CANVAS AREA */}
                <Col xl={9} lg={8}>
                    <Card className="border-0 shadow-sm rounded-4 p-3 bg-white">
                        <h6 className="fw-bold mb-2">Canvas Editor ({orientation})</h6>
                        <div
                            className="position-relative border rounded shadow-sm mx-auto overflow-hidden bg-white"
                            style={{
                                width: orientation === 'LANDSCAPE' ? '800px' : '560px',
                                height: orientation === 'LANDSCAPE' ? '560px' : '800px',
                                backgroundImage: bgPreview ? `url(${bgPreview})` : 'none',
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                            }}
                        >
                            {elements.map((el) => {
                                const isSelected = el.id === selectedElementId;
                                return (
                                    <div
                                        key={el.id}
                                        onClick={() => setSelectedElementId(el.id)}
                                        style={{
                                            position: 'absolute',
                                            top: `${el.top}px`,
                                            left: `${el.left}px`,
                                            width: `${el.width}px`,
                                            height: `${el.height}px`,
                                            fontSize: `${el.fontSize}px`,
                                            color: el.color,
                                            textAlign: el.textAlign,
                                            border: isSelected ? '2px dashed #6C47FF' : '1px dotted #ccc',
                                            cursor: 'pointer',
                                            userSelect: 'none',
                                            padding: '4px',
                                            backgroundColor: isSelected ? 'rgba(108, 71, 255, 0.08)' : 'transparent',
                                        }}
                                    >
                                        {el.type === 'qr' ? (
                                            <div className="bg-dark text-white d-flex align-items-center justify-content-center h-100 rounded small">
                                                [QR CODE]
                                            </div>
                                        ) : (
                                            el.content
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default CertificateTemplatePage;
