/**
 * User Point Rules - List Page
 * Display all point earning rules configuration
 * @author Sarip Hidayat <hidayatsarip2210@gmail.com>
 * @date 2026-01-19
 */

import React, { useEffect, useState } from 'react';
import { UserPointRule, InUserPointRule } from '@/models/UserPointRule';
import { showToast } from '@/utils/toast';
import useBlockUI from '@/pages/_components/useBlockUI';

export default function UserPointRulesPage() {
    const { blockUI, unblockUI } = useBlockUI();
    const [rules, setRules] = useState<InUserPointRule[]>([]);
    const [isInitialLoad, setIsInitialLoad] = useState<boolean>(true);

    const Model = new UserPointRule();

    const listData = async () => {
        if (isInitialLoad) blockUI();

        try {
            const response = await Model.list();
            setRules(response.userpoint_rules || []);
        } catch (error: any) {
            console.error('Error loading user point rules:', error);
            showToast('Failed to load user point rules', 'error');
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
                <h4 className="py-2 breadcrumb-wrapper mb-0">User Point Rules</h4>
                <p className="text-muted">Point earning rules and configurations</p>
            </div>

            {/* Header */}
            <div className="card mb-3">
                <div className="card-header">
                    <h5 className="mb-0">Point Rules Configuration</h5>
                </div>
            </div>

            {/* Table */}
            <div className="card">
                <div className="table-responsive">
                    <table className="table table-hover">
                        <thead>
                            <tr>
                                <th>Activity Name</th>
                                <th className="text-end">Points</th>
                                <th className="text-end">Max / Day</th>
                                <th className="text-end">Cooldown (min)</th>
                                <th className="text-end">Expiry (days)</th>
                                <th className="text-center">Active Status</th>
                                <th>Updated At</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rules.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="text-center py-4">
                                        <i className="bx bx-info-circle fs-3 text-muted d-block mb-2"></i>
                                        <p className="text-muted mb-0">No rules found</p>
                                    </td>
                                </tr>
                            ) : (
                                rules.map((rule, index) => (
                                    <tr key={index}>
                                        <td>
                                            <code className="bg-light px-2 py-1 rounded">
                                                {rule.activity_name}
                                            </code>
                                            <div className="text-muted small mt-1">
                                                {rule.description}
                                            </div>
                                        </td>
                                        <td className="text-end">
                                            <strong className="text-primary">{rule.points}</strong>
                                        </td>
                                        <td className="text-end">
                                            {rule.max_times_per_day}
                                        </td>
                                        <td className="text-end">
                                            {rule.cooldown_minutes}
                                        </td>
                                        <td className="text-end">
                                            {rule.point_expiry_days}
                                        </td>
                                        <td className="text-center">
                                            <span className={`badge ${rule.is_active === 1 ? 'bg-success' : 'bg-secondary'}`}>
                                                {rule.is_active === 1 ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td>
                                            <small>{rule.updated_at}</small>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Footer Info */}
                {rules.length > 0 && (
                    <div className="card-footer">
                        <div className="dataTables_info">
                            Total {rules.length} rule(s)
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
