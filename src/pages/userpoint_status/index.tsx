/**
 * User Point Status - List Page
 * Display master status list for user points
 * @author Sarip Hidayat <hidayatsarip2210@gmail.com>
 * @date 2026-01-19
 */

import React, { useEffect, useState } from 'react';
import { UserPointStatus, InUserPointStatus } from '@/models/UserPointStatus';
import { showToast } from '@/utils/toast';
import useBlockUI from '@/pages/_components/useBlockUI';

export default function UserPointStatusPage() {
    const { blockUI, unblockUI } = useBlockUI();
    const [statuses, setStatuses] = useState<InUserPointStatus[]>([]);
    const [isInitialLoad, setIsInitialLoad] = useState<boolean>(true);

    const Model = new UserPointStatus();

    const listData = async () => {
        if (isInitialLoad) blockUI();

        try {
            const response = await Model.list();
            setStatuses(response.userpoint_status || []);
        } catch (error: any) {
            console.error('Error loading user point statuses:', error);
            showToast('Failed to load user point statuses', 'error');
        } finally {
            if (isInitialLoad) {
                unblockUI();
                setIsInitialLoad(false);
            }
        }
    };

    useEffect(() => {
        listData();
    }, []);

    return (
        <>
            <div className="flex-grow-1 container-p-y">
                <h4 className="py-2 breadcrumb-wrapper mb-0">User Point Status</h4>
                <p className="text-muted">Master status list for user point system</p>
            </div>

            {/* Header */}
            <div className="card mb-3">
                <div className="card-header">
                    <h5 className="mb-0">Point Status List</h5>
                </div>
            </div>

            {/* Table */}
            <div className="card">
                <div className="table-responsive">
                    <table className="table table-hover">
                        <thead>
                            <tr>
                                <th style={{ width: '50px' }}>#</th>
                                <th>Name</th>
                                <th>Description</th>
                            </tr>
                        </thead>
                        <tbody>
                            {statuses.length === 0 ? (
                                <tr>
                                    <td colSpan={3} className="text-center py-4">
                                        <i className="bx bx-info-circle fs-3 text-muted d-block mb-2"></i>
                                        <p className="text-muted mb-0">No statuses found</p>
                                    </td>
                                </tr>
                            ) : (
                                statuses.map((status, index) => (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>
                                            <span className="badge bg-primary">{status.name}</span>
                                        </td>
                                        <td>
                                            <span className="text-muted">{status.description}</span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Footer Info */}
                {statuses.length > 0 && (
                    <div className="card-footer">
                        <div className="dataTables_info">
                            Total {statuses.length} status(es)
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
