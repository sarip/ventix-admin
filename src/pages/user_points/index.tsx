/**
 * User Points - List Page
 * Display all user points with search and detail view
 * @author Sarip Hidayat <hidayatsarip2210@gmail.com>
 * @date 2026-01-19
 */

import React, { useEffect, useState } from 'react';
import { UserPoint, InUserPoint } from '@/models/UserPoint';
import SearchBar from '@/components/SearchBar';
import Pagination from '@/pages/_components/Pagination';
import { showToast } from '@/utils/toast';
import useBlockUI from '@/pages/_components/useBlockUI';
import UserPointDetailModal from './_detail_modal';

export default function UserPointsPage() {
    const { blockUI, unblockUI } = useBlockUI();
    const [userPoints, setUserPoints] = useState<InUserPoint[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [perPage, setPerPage] = useState<number>(25);
    const [isInitialLoad, setIsInitialLoad] = useState<boolean>(true);
    const [showDetailModal, setShowDetailModal] = useState<boolean>(false);
    const [selectedUserPoint, setSelectedUserPoint] = useState<InUserPoint | null>(null);

    const Model = new UserPoint();

    const listData = async () => {
        if (isInitialLoad) blockUI();

        try {
            const query: Record<string, any> = {
                page: currentPage,
                per_page: perPage,
            };

            if (searchQuery) {
                query.search = searchQuery;
            }

            const response = await Model.list(query);
            setUserPoints(response.user_points || []);
        } catch (error: any) {
            console.error('Error loading user points:', error);
            showToast('Failed to load user points', 'error');
        } finally {
            if (isInitialLoad) {
                unblockUI();
                setIsInitialLoad(false);
            }
        }
    };

    useEffect(() => {
        if (!isInitialLoad) {
            setCurrentPage(1);
            listData();
        }
    }, [searchQuery, perPage]);

    useEffect(() => {
        if (!isInitialLoad) {
            listData();
        }
    }, [currentPage]);

    useEffect(() => {
        listData();
    }, []);

    const handleViewDetail = (userPoint: InUserPoint) => {
        setSelectedUserPoint(userPoint);
        setShowDetailModal(true);
    };

    const handleCloseModal = () => {
        setShowDetailModal(false);
        setSelectedUserPoint(null);
    };

    return (
        <>
            <div className="flex-grow-1 container-p-y">
                <h4 className="py-2 breadcrumb-wrapper mb-0">User Points</h4>
                <p className="text-muted">Monitor user point balances and activity</p>
            </div>

            {/* Header */}
            <div className="card mb-3">
                <div className="card-header">
                    <h5 className="mb-0">User Points List</h5>
                </div>
            </div>

            {/* Filters */}
            <div className="card mb-3">
                <div className="card-body">
                    <div className="row g-3">
                        <div className="col-md-6">
                            <SearchBar
                                onSearch={setSearchQuery}
                                placeholder="Search by name, username, email..."
                                className="w-100"
                            />
                        </div>

                        <div className="col-md-3">
                            <select
                                className="form-select"
                                value={perPage}
                                onChange={(e) => setPerPage(Number(e.target.value))}
                            >
                                <option value="10">10 per page</option>
                                <option value="25">25 per page</option>
                                <option value="50">50 per page</option>
                                <option value="100">100 per page</option>
                            </select>
                        </div>

                        <div className="col-md-3">
                            <button
                                className="btn btn-outline-secondary w-100"
                                onClick={() => {
                                    setSearchQuery('');
                                }}
                            >
                                <i className="bx bx-reset me-1"></i>
                                Clear
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="card">
                <div className="table-responsive">
                    <table className="table table-hover">
                        <thead>
                            <tr>
                                <th>User</th>
                                <th>Role</th>
                                <th className="text-center">Current Balance</th>
                                <th className="text-center">Total Earned</th>
                                <th>Last Updated</th>
                                <th className="text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {userPoints.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="text-center py-4">
                                        <i className="bx bx-info-circle fs-3 text-muted d-block mb-2"></i>
                                        <p className="text-muted mb-0">No user points found</p>
                                    </td>
                                </tr>
                            ) : (
                                userPoints.map((userPoint) => (
                                    <tr key={userPoint.user_id}>
                                        <td>
                                            <div>
                                                <strong>{userPoint.user.name}</strong>
                                                <div className="text-muted small">@{userPoint.user.username}</div>
                                            </div>
                                        </td>
                                        <td>
                                            <span className="badge bg-info">{userPoint.user.role}</span>
                                        </td>
                                        <td className="text-center">
                                            <strong className="text-primary">{userPoint.current_balance}</strong>
                                        </td>
                                        <td className="text-center">
                                            <span className="text-success">{userPoint.total_earned}</span>
                                        </td>
                                        <td>
                                            <small>{userPoint.last_updated}</small>
                                        </td>
                                        <td className="text-center">
                                            <button
                                                className="btn btn-sm btn-primary"
                                                onClick={() => handleViewDetail(userPoint)}
                                                title="View Details"
                                            >
                                                <i className="bx bx-show me-1"></i>
                                                View Detail
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination - Simple version since we don't have pagination info from API */}
                {userPoints.length > 0 && (
                    <div className="card-footer">
                        <div className="row align-items-center">
                            <div className="col-sm-12 col-md-6">
                                <div className="dataTables_info">
                                    Showing {userPoints.length} user points
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Detail Modal */}
            <UserPointDetailModal
                show={showDetailModal}
                onClose={handleCloseModal}
                data={selectedUserPoint}
            />
        </>
    );
}
