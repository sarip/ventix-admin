import React, { useState } from 'react';
import { Modal, Button, Badge } from 'react-bootstrap';
import { InEventOrganizer } from '@/models/EventOrganizer';
import OneGalery from '@/pages/_components/OneGalery';

interface DetailModalProps {
    show: boolean;
    onHide: () => void;
    data: InEventOrganizer | null;
    onApprove: (id: number) => void;
    onReject: (id: number) => void;
}

const getStatusBadge = (status: string | undefined) => {
    switch (status) {
        case 'Approved':
            return <Badge bg="success">Approved</Badge>;
        case 'Rejected':
            return <Badge bg="danger">Rejected</Badge>;
        default:
            return <Badge bg="warning" text="dark">Pending Review</Badge>;
    }
};

const LegalDocPreview: React.FC<{ docPath: string; baseUrl: string }> = ({ docPath, baseUrl }) => {
    const docUrl = `${baseUrl}/uploads/legality/${docPath}`;
    const ext = docPath.split('.').pop()?.toLowerCase();
    const isImage = ['jpg', 'jpeg', 'png'].includes(ext ?? '');
    const isPdf = ext === 'pdf';

    return (
        <div className="border rounded overflow-hidden" style={{ height: '340px', background: '#f8f9fa' }}>
            {isPdf && (
                <iframe
                    src={docUrl}
                    width="100%"
                    height="100%"
                    title="Legal Document"
                    style={{ border: 'none' }}
                />
            )}
            {isImage && (
                <div className="d-flex align-items-center justify-content-center h-100 p-2">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={docUrl}
                        alt="Legal Document"
                        style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', cursor: 'zoom-in' }}
                        onClick={() => window.open(docUrl, '_blank')}
                    />
                </div>
            )}
            {!isPdf && !isImage && (
                <div className="d-flex align-items-center justify-content-center h-100 text-muted">
                    <div className="text-center">
                        <i className="bx bx-file-blank fs-1 mb-2 d-block" />
                        <span>Preview not available for this file type</span>
                    </div>
                </div>
            )}
        </div>
    );
};

const DetailModal: React.FC<DetailModalProps> = ({ show, onHide, data, onApprove, onReject }) => {
    if (!data) return null;

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL?.replace('/api/v1/', '') || '';

    return (
        <Modal show={show} onHide={onHide} size="lg" centered scrollable>
            <Modal.Header closeButton className="bg-light">
                <Modal.Title>
                    <i className="bx bx-shield-quarter me-2 text-primary" />
                    EO Verification Review
                </Modal.Title>
            </Modal.Header>

            <Modal.Body className="p-0">
                <div className="p-4">

                    {/* Header — EO branding + status */}
                    <div className="d-flex align-items-center mb-4 pb-3 border-bottom">
                        <div className="avatar avatar-xl me-3">
                            {data.logo_path ? (
                                <OneGalery attachments={`/event_organizer/${data.logo_path}`} />
                            ) : (
                                <div
                                    className="bg-label-secondary rounded d-flex align-items-center justify-content-center"
                                    style={{ width: '72px', height: '72px' }}
                                >
                                    <i className="bx bx-buildings fs-1" />
                                </div>
                            )}
                        </div>
                        <div className="flex-grow-1">
                            <h4 className="mb-1">{data.eo_name}</h4>
                            <div className="d-flex align-items-center flex-wrap gap-2">
                                <span className="text-muted">
                                    <i className="bx bx-buildings me-1" />
                                    {data.company_name}
                                </span>
                                {getStatusBadge(data.verification_status)}
                                {data.organization_type && (
                                    <span className="badge bg-label-info">{data.organization_type}</span>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="row g-4">

                        {/* Contact info */}
                        <div className="col-md-6">
                            <h6 className="text-uppercase text-muted fw-bold small mb-3">Contact Information</h6>
                            <div className="mb-2 d-flex align-items-start">
                                <i className="bx bx-envelope text-primary me-2 mt-1" />
                                <div>
                                    <div className="small text-muted">Email Address</div>
                                    <div>{data.email}</div>
                                </div>
                            </div>
                            <div className="mb-2 d-flex align-items-start">
                                <i className="bx bx-phone text-primary me-2 mt-1" />
                                <div>
                                    <div className="small text-muted">Phone Number</div>
                                    <div>{data.phone}</div>
                                </div>
                            </div>
                            {data.website && (
                                <div className="mb-2 d-flex align-items-start">
                                    <i className="bx bx-globe text-primary me-2 mt-1" />
                                    <div>
                                        <div className="small text-muted">Website</div>
                                        <a href={data.website} target="_blank" rel="noreferrer" className="text-break">
                                            {data.website}
                                        </a>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Organization details */}
                        <div className="col-md-6">
                            <h6 className="text-uppercase text-muted fw-bold small mb-3">Organization Details</h6>
                            <div className="mb-2 d-flex align-items-start">
                                <i className="bx bx-id-card text-primary me-2 mt-1" />
                                <div>
                                    <div className="small text-muted">Tax ID / NPWP</div>
                                    <div>{data.tax_id || '-'}</div>
                                </div>
                            </div>
                            <div className="mb-2 d-flex align-items-start">
                                <i className="bx bx-map text-primary me-2 mt-1" />
                                <div>
                                    <div className="small text-muted">Office Address</div>
                                    <div className="text-wrap">{data.address || '-'}</div>
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        {data.description && (
                            <div className="col-12">
                                <h6 className="text-uppercase text-muted fw-bold small mb-3">Description</h6>
                                <div className="bg-light p-3 rounded" style={{ minHeight: '70px' }}>
                                    {data.description}
                                </div>
                            </div>
                        )}

                        {/* Legal document preview */}
                        <div className="col-12">
                            <h6 className="text-uppercase text-muted fw-bold small mb-3">
                                <i className="bx bx-file-blank me-1" />Legal Compliance Document
                            </h6>
                            {data.legal_doc_path ? (
                                <>
                                    <LegalDocPreview docPath={data.legal_doc_path} baseUrl={baseUrl} />
                                    <div className="mt-2 d-flex gap-2">
                                        <a
                                            href={`${baseUrl}/uploads/legality/${data.legal_doc_path}`}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="btn btn-sm btn-outline-primary"
                                        >
                                            <i className="bx bx-link-external me-1" />Open Full View
                                        </a>
                                        <a
                                            href={`${baseUrl}/uploads/legality/${data.legal_doc_path}`}
                                            download
                                            className="btn btn-sm btn-outline-secondary"
                                        >
                                            <i className="bx bx-download me-1" />Download
                                        </a>
                                    </div>
                                </>
                            ) : (
                                <div className="alert alert-secondary py-2 mb-0">
                                    <i className="bx bx-info-circle me-1" />No legal document uploaded.
                                </div>
                            )}
                        </div>

                        {/* Verification history */}
                        {data.verified_at && (
                            <div className="col-12">
                                <div
                                    className={`alert py-2 px-3 mb-0 d-flex align-items-start ${data.verification_status === 'Approved' ? 'alert-success' : 'alert-danger'
                                        }`}
                                >
                                    <i className="bx bx-history me-2 mt-1" />
                                    <div>
                                        <strong>
                                            {data.verification_status === 'Approved' ? 'Approved' : 'Rejected'}
                                        </strong>{' '}
                                        on {data.verified_at}
                                        {data.verification_note && (
                                            <div className="small mt-1 border-top pt-1">
                                                <strong>Note:</strong> {data.verification_note}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                    </div>
                </div>
            </Modal.Body>

            <Modal.Footer className="bg-light d-flex justify-content-between">
                <Button variant="label-dark" onClick={onHide}>Close</Button>
                {(!data.verification_status || data.verification_status === 'Pending') && (
                    <div className="d-flex gap-2">
                        <Button variant="danger" onClick={() => onReject(data.id)}>
                            <i className="bx bx-x me-1" />Reject
                        </Button>
                        <Button variant="success" onClick={() => onApprove(data.id)}>
                            <i className="bx bx-check me-1" />Approve Organizer
                        </Button>
                    </div>
                )}
            </Modal.Footer>
        </Modal>
    );
};

export default DetailModal;
