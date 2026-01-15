import React, { useEffect } from 'react';

interface ModalDataPageProps {
    show: boolean;
    onClose: () => void;
    data: any;
}

const ModalDataPage: React.FC<ModalDataPageProps> = ({ show, onClose, data }) => {
    useEffect(() => {
        const modalElement = document.getElementById('modalCenter');
        if (modalElement) {
            if (show) {
                const bootstrapModal = new window.bootstrap.Modal(modalElement);
                bootstrapModal.show();
            } else {
                const bootstrapModal = window.bootstrap.Modal.getInstance(modalElement);
                if (bootstrapModal) {
                    bootstrapModal.hide();
                }
            }
        }
    }, [show]);

    return (
        <div className="modal fade" id="modalCenter" tabIndex="-1" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="modalCenterTitle">Data</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={onClose}></button>
                    </div>
                    <div className="modal-body">
                        <div className="row">
                            <div className="col mb-3">
                                {data != 'null' && data ? (
                                    Object.entries(JSON.parse(data)).map(([key, value]) => {
                                            console.log({'value': value});
                                            if (key === 'created_at' || key === 'updated_at') {
                                                value = new Date(value * 1000).toLocaleString();
                                            } else if (Array.isArray(value)) {
                                                value = value.join(', ');
                                            } else if (typeof value === 'object' && value !== null) {
                                                value = JSON.stringify(value, null, 2);
                                            }

                                            return (
                                                <div key={key}>
                                                    <div>
                                                        <strong>{key.replace(/_/g, ' ')}:</strong>
                                                        <pre className="bg-light p-2 rounded">{String(value)}</pre>
                                                    </div>
                                                </div>
                                            );
                                    })

                                ) : (
                                    <div className="alert alert-solid-info" role="alert">
                                        <span>Data tidak ditemukan</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-label-secondary" data-bs-dismiss="modal" onClick={onClose}>Close</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ModalDataPage;
