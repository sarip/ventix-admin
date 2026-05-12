import React from 'react';
import { Modal, Button, Badge } from 'react-bootstrap';
import { InEventOrganizer } from '@/models/EventOrganizer';
import OneGalery from "@/pages/_components/OneGalery";

interface ProfileProps {
    show: boolean;
    onHide: () => void;
    data: InEventOrganizer | null;
    onApprove: (id: number) => void;
    onReject: (id: number) => void;
}

const Profile: React.FC<ProfileProps> = ({ show, onHide, data, onApprove, onReject }) => {
    if (!data) return null;

    const getStatusBadge = (status: string | undefined) => {
        switch (status) {
            case 'Approved': return <Badge bg="success">Approved</Badge>;
            case 'Rejected': return <Badge bg="danger">Rejected</Badge>;
            default: return <Badge bg="warning" text="dark">Pending Review</Badge>;
        }
    };

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL?.replace('/api/v1/', '') || '';

    return (
        <Modal show={show} onHide={onHide} size="lg" centered scrollable>
            <Modal.Header closeButton className="bg-light">
                <Modal.Title>Event Organizer Profile Review</Modal.Title>
            </Modal.Header>
            <Modal.Body className="p-0">
                <div className="p-4">
                    <div className="d-flex align-items-center mb-4 pb-3 border-bottom">
                        <div className="avatar avatar-xl me-3">
                            {data.logo_path ? (
                                <OneGalery attachments={`/event_organizer/${data.logo_path}`} />
                            ) : (
                                <div className="bg-label-secondary rounded d-flex align-items-center justify-content-center" style={{ width: '80px', height: '80px' }}>
                                    <i className="bx bx-buildings fs-1"></i>
                                </div>
                            )}
                        </div>
                        <div className="flex-grow-1">
                            <h4 className="mb-1">{data.eo_name}</h4>
                            <div className="d-flex align-items-center flex-wrap gap-2">
                                <span className="text-muted me-1"><i className="bx bx-buildings me-1"></i>{data.company_name}</span>
                                <span>{getStatusBadge(data.verification_status)}</span>
                                {data.organization_type && (
                                    <span className="badge bg-label-info">{data.organization_type}</span>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="row g-4">
                        <div className="col-md-6">
                            <h6 className="text-uppercase text-muted fw-bold small mb-3">Contact Information</h6>
                            <div className="mb-2 d-flex align-items-start">
                                <i className="bx bx-envelope text-primary me-2 mt-1"></i>
                                <div>
                                    <div className="small text-muted">Email Address</div>
                                    <div>{data.email}</div>
                                </div>
                            </div>
                            <div className="mb-2 d-flex align-items-start">
                                <i className="bx bx-phone text-primary me-2 mt-1"></i>
                                <div>
                                    <div className="small text-muted">Phone Number</div>
                                    <div>{data.phone}</div>
                                </div>
                            </div>
                            <div className="mb-2 d-flex align-items-start">
                                <i className="bx bx-globe text-primary me-2 mt-1"></i>
                                <div>
                                    <div className="small text-muted">Website</div>
                                    <a href={data.website} target="_blank" rel="noreferrer" className="text-break">{data.website || '-'}</a>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <h6 className="text-uppercase text-muted fw-bold small mb-3">Organization Details</h6>
                            <div className="mb-2 d-flex align-items-start">
                                <i className="bx bx-id-card text-primary me-2 mt-1"></i>
                                <div>
                                    <div className="small text-muted">Tax ID / NPWP</div>
                                    <div>{data.tax_id || '-'}</div>
                                </div>
                            </div>
                            <div className="mb-2 d-flex align-items-start">
                                <i className="bx bx-map text-primary me-2 mt-1"></i>
                                <div>
                                    <div className="small text-muted">Office Address</div>
                                    <div className="text-wrap">{data.address || '-'}</div>
                                </div>
                            </div>
                        </div>
                        <div className="col-12 mt-4">
                            <h6 className="text-uppercase text-muted fw-bold small mb-3">Description</h6>
                            <div className="bg-light p-3 rounded" style={{ minHeight: '80px' }}>
                                {data.description || <em className="text-muted">No description provided.</em>}
                            </div>
                        </div>
                        <div className="col-12 mt-4">
                            <h6 className="text-uppercase text-muted fw-bold small mb-3">Legal Verification</h6>
                            <div className="card border shadow-none">
                                <div className="card-body d-flex align-items-center p-3">
                                    <div className="avatar bg-label-primary rounded me-3 d-flex align-items-center justify-content-center" style={{ width: '48px', height: '48px' }}>
                                        <i className="bx bx-file-blank fs-3"></i>
                                    </div>
                                    <div className="flex-grow-1">
                                        <h6 className="mb-0">Legal Compliance Document</h6>
                                        <small className="text-muted">Filename: {data.legal_doc_path || 'Not uploaded'}</small>
                                    </div>
                                    {data.legal_doc_path && (
                                        <div className="ms-auto d-flex gap-2">
                                            <a
                                                href={`${baseUrl}/uploads/legality/${data.legal_doc_path}`}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="btn btn-sm btn-primary"
                                            >
                                                <i className="bx bx-show me-1"></i> View Document
                                            </a>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="col-12 mt-4">
                            <div
                                className={`alert py-2 px-3 d-flex align-items-start mb-0 ${
                                    data.verification_status === 'Approved'
                                        ? 'alert-success'
                                        : data.verification_status === 'Rejected'
                                            ? 'alert-danger'
                                            : 'alert-warning text-dark'
                                }`}
                            >
                                <i
                                    className={`bx me-2 mt-1 ${
                                        data.verification_status === 'Approved'
                                            ? 'bx-check-circle'
                                            : data.verification_status === 'Rejected'
                                                ? 'bx-x-circle'
                                                : 'bx-time-five'
                                    }`}
                                ></i>

                                <div>
                                    <strong>{data.verification_status}</strong>

                                    {data.verified_at && (
                                        <>
                                            {' '}on <strong>{data.verified_at}</strong>
                                        </>
                                    )}

                                    {data.verification_note && (
                                        <div className="small mt-1 border-top pt-1">
                                            Note: {data.verification_note}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer className="bg-light d-flex justify-content-between">
                <div>
                    <Button variant="label-dark" onClick={onHide}>Close</Button>
                </div>
                {/*{(!data.verification_status || data.verification_status === 'Pending') && (*/}
                {/*    <div className="d-flex gap-2">*/}
                {/*        <Button variant="danger" onClick={() => onReject(data.id)}>*/}
                {/*            <i className="bx bx-x me-1"></i> Reject*/}
                {/*        </Button>*/}
                {/*        <Button variant="success" onClick={() => onApprove(data.id)}>*/}
                {/*            <i className="bx bx-check me-1"></i> Approve Organizer*/}
                {/*        </Button>*/}
                {/*    </div>*/}
                {/*)}*/}
            </Modal.Footer>
        </Modal>
    );
};

export default Profile;
