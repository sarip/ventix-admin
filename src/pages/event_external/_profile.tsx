import React from 'react';
import { Modal, Button, Badge } from 'react-bootstrap';
import OneGalery from "@/pages/_components/OneGalery";
import {InEvent} from "@/models/Event";

interface ProfileProps {
    show: boolean;
    onHide: () => void;
    data: InEvent | null;
}

const Profile: React.FC<ProfileProps> = ({ show, onHide, data, onApprove, onReject }) => {
    if (!data) return null;



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
                            {data.thumbnail_url ? (
                                <OneGalery attachments={`/event/${data.thumbnail_url}`} />
                            ) : (
                                <div className="bg-label-secondary rounded d-flex align-items-center justify-content-center" style={{ width: '80px', height: '80px' }}>
                                    <i className="bx bx-buildings fs-1"></i>
                                </div>
                            )}
                        </div>
                        <div className="flex-grow-1">
                            <h4 className="mb-1">{data.title}</h4>
                            <div className="d-flex align-items-center flex-wrap">
                                <span className="text-muted me-3"><i className="bx bx-location-plus me-1"></i>{data.location}</span>
                            </div>
                        </div>
                    </div>

                    <div className="row g-4">
                        <div className="col-md-6">
                            <h6 className="text-uppercase text-muted fw-bold small mb-3">Information</h6>
                            <div className="mb-2 d-flex align-items-start">
                                <i className="bx bx-category text-primary me-2 mt-1"></i>
                                <div>
                                    <div className="small text-muted">Category</div>
                                    <div>{data.event_category}</div>
                                </div>
                            </div>
                            <div className="mb-2 d-flex align-items-start">
                                <i className="bx bx-show text-primary me-2 mt-1"></i>
                                <div>
                                    <div className="small text-muted">Status</div>
                                    <div>{data.events_status}</div>
                                </div>
                            </div>
                            <div className="mb-2 d-flex align-items-start">
                                <i className="bx bx-show text-primary me-2 mt-1"></i>
                                <div>
                                    <div className="small text-muted">Date</div>
                                    <div>{data.start_date} - {data.start_date}</div>
                                </div>
                            </div>
                            <div className="mb-2 d-flex align-items-start">
                                <i className="bx bx-globe text-primary me-2 mt-1"></i>
                                <div>
                                    <div className="small text-muted">Event Url</div>
                                    <a href={data.external_url} target="_blank" rel="noreferrer"
                                       className="text-break">{data.external_url || '-'}</a>
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
            </Modal.Footer>
        </Modal>
    );
};

export default Profile;
