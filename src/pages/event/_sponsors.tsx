import React, { useState, useEffect } from 'react';
import { Button, Form as BootstrapForm, Card, Row, Col } from 'react-bootstrap';

interface SponsorLogo {
    id?: number;
    url?: string;
    file?: File;
    _isNew?: boolean;
    _isDeleted?: boolean;
    _tempId?: number;
}

interface EventSponsorsStepProps {
    eventId: number | null;
    logos: SponsorLogo[];
    onChange: (logos: SponsorLogo[]) => void;
}

const EventSponsorsStep: React.FC<EventSponsorsStepProps> = ({ eventId, logos, onChange }) => {
    const nextTempId = React.useRef(1);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;

        const newFiles = Array.from(e.target.files);
        const newLogos: SponsorLogo[] = newFiles.map(file => ({
            file,
            url: URL.createObjectURL(file), // For preview
            _isNew: true,
            _tempId: nextTempId.current++
        }));

        onChange([...logos, ...newLogos]);
        // Reset input value so same file can be selected again if removed
        e.target.value = '';
    };

    const removeLogo = (index: number) => {
        const logo = logos[index];
        if (logo._isNew) {
            // Revoke object URL to avoid memory leaks
            if (logo.url) URL.revokeObjectURL(logo.url);
            onChange(logos.filter((_, i) => i !== index));
        } else {
            const updated = [...logos];
            updated[index] = { ...updated[index], _isDeleted: true };
            onChange(updated);
        }
    };

    const activeLogos = logos.filter(l => !l._isDeleted);

    return (
        <div className="event-sponsors-step">
            <div className="mb-3">
                <h6>Sponsor Logos</h6>
                <p className="text-muted small">
                    Upload logos of the event sponsors. You can select multiple files at once.
                </p>
            </div>

            <div className="form-group mb-4">
                <BootstrapForm.Label className="btn btn-outline-primary cursor-pointer">
                    <i className="bx bx-upload me-1"></i>
                    Upload Sponsor Logos
                    <BootstrapForm.Control
                        type="file"
                        multiple
                        accept="image/*"
                        className="d-none"
                        onChange={handleFileChange}
                    />
                </BootstrapForm.Label>
                <div className="text-muted small mt-1">Accepted formats: JPG, PNG, WEBP. Max size: 2MB per file.</div>
            </div>

            {activeLogos.length === 0 ? (
                <div className="text-center py-4 bg-light rounded border-dashed">
                    <i className="bx bx-images bx-lg text-muted mb-2"></i>
                    <p className="text-muted mb-0">No sponsor logos uploaded yet</p>
                </div>
            ) : (
                <Row className="g-3">
                    {activeLogos.map((logo, index) => {
                        const actualIndex = logos.indexOf(logo);
                        return (
                            <Col xs={6} sm={4} md={3} lg={2} key={logo.id || logo._tempId || index}>
                                <Card className="h-100 position-relative">
                                    <div className="ratio ratio-1x1 bg-light d-flex align-items-center justify-content-center p-2">
                                        <img
                                            src={logo.url}
                                            alt={`Sponsor ${index + 1}`}
                                            className="img-fluid object-fit-contain"
                                            style={{ maxHeight: '100px' }}
                                        />
                                    </div>
                                    <Button
                                        variant="danger"
                                        size="sm"
                                        className="position-absolute top-0 end-0 m-1 p-0 rounded-circle"
                                        style={{ width: '24px', height: '24px', lineHeight: '20px' }}
                                        onClick={() => removeLogo(actualIndex)}
                                        title="Remove"
                                    >
                                        <i className="bx bx-x small"></i>
                                    </Button>
                                    {logo._isNew && (
                                        <span className="badge bg-success position-absolute bottom-0 start-0 m-1">New</span>
                                    )}
                                </Card>
                            </Col>
                        );
                    })}
                </Row>
            )}
        </div>
    );
};

export default EventSponsorsStep;
