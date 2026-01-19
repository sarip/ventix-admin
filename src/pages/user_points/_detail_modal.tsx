/**
 * User Point Detail Modal
 * Display user point details with point logs table
 * @author Sarip Hidayat <hidayatsarip2210@gmail.com>
 * @date 2026-01-19
 */

import React, { useEffect } from 'react';
import { InUserPoint } from '@/models/UserPoint';

interface UserPointDetailModalProps {
    show: boolean;
    onClose: () => void;
    data: InUserPoint | null;
}

const UserPointDetailModal: React.FC<UserPointDetailModalProps> = ({ show, onClose, data }) => {
    useEffect(() => {
        const modalElement = document.getElementById('modal-userpoint-detail');
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

    if (!data) return null;

    return (
        <div className="modal fade" id="modal-userpoint-detail" tabIndex={-1} aria-hidden="true">
            <div className="modal-dialog modal-xl modal-dialog-centered" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">User Point Details</h5>
                        <button
                            type="button"
                            className="btn-close"
                            data-bs-dismiss="modal"
                            aria-label="Close"
                            onClick={onClose}
                        />
                    </div>
                    <div className="modal-body">
                        {/* User Information */}
                        <div className="card mb-3">
                            <div className="card-header">
                                <h6 className="mb-0">User Information</h6>
                            </div>
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="mb-2">
                                            <strong>Name:</strong> {data.user.name}
                                        </div>
                                        <div className="mb-2">
                                            <strong>Username:</strong> {data.user.username}
                                        </div>
                                        <div className="mb-2">
                                            <strong>Email:</strong> {data.user.email}
                                        </div>
                                        <div className="mb-2">
                                            <strong>Phone:</strong> {data.user.phone}
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="mb-2">
                                            <strong>Role:</strong> <span className="badge bg-info">{data.user.role}</span>
                                        </div>
                                        <div className="mb-2">
                                            <strong>Status:</strong> <span className="badge bg-success">{data.user.status}</span>
                                        </div>
                                        <div className="mb-2">
                                            <strong>Created:</strong> {data.user.created_at}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Point Summary */}
                        <div className="card mb-3">
                            <div className="card-header">
                                <h6 className="mb-0">Point Summary</h6>
                            </div>
                            <div className="card-body">
                                <div className="row text-center">
                                    <div className="col-md-4">
                                        <div className="mb-2">
                                            <small className="text-muted">Current Balance</small>
                                            <h4 className="mb-0 text-primary">{data.current_balance}</h4>
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="mb-2">
                                            <small className="text-muted">Total Earned</small>
                                            <h4 className="mb-0 text-success">{data.total_earned}</h4>
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="mb-2">
                                            <small className="text-muted">Last Updated</small>
                                            <h6 className="mb-0">{data.last_updated}</h6>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Point Logs */}
                        <div className="card">
                            <div className="card-header">
                                <h6 className="mb-0">Point Logs</h6>
                            </div>
                            <div className="table-responsive">
                                <table className="table table-hover mb-0">
                                    <thead className="table-light">
                                        <tr>
                                            <th>Activity Type</th>
                                            <th className="text-end">Amount</th>
                                            <th>Status</th>
                                            <th>Description</th>
                                            <th>Expiry Date</th>
                                            <th>Created At</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {data.point_logs && data.point_logs.length > 0 ? (
                                            data.point_logs.map((log, index) => (
                                                <tr key={log.id || index}>
                                                    <td>
                                                        <code className="bg-light px-2 py-1 rounded">
                                                            {log.activity_type}
                                                        </code>
                                                    </td>
                                                    <td className="text-end">
                                                        <span className={`badge ${log.amount > 0 ? 'bg-success' : 'bg-danger'}`}>
                                                            {log.amount > 0 ? '+' : ''}{log.amount}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <span className={`badge ${log.point_status === 'activated' ? 'bg-success' :
                                                                log.point_status === 'pending' ? 'bg-warning' :
                                                                    'bg-secondary'
                                                            }`}>
                                                            {log.point_status}
                                                        </span>
                                                    </td>
                                                    <td>{log.description}</td>
                                                    <td>{log.expiry_date}</td>
                                                    <td>{log.created_at}</td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={6} className="text-center py-4 text-muted">
                                                    <i className="bx bx-info-circle bx-lg mb-2 d-block"></i>
                                                    No point logs found
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button
                            type="button"
                            className="btn btn-secondary"
                            data-bs-dismiss="modal"
                            onClick={onClose}
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserPointDetailModal;
