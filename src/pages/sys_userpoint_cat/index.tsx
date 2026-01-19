/**
 * User Point Category Page
 */

import React, { useEffect, useState } from 'react';
import useBlockUI from '@/pages/_components/useBlockUI';
import { UserPointCat, InUserPointCat } from '@/models/UserPointCat';
import { showToast } from '@/utils/toast';

const UserPointCategoryPage: React.FC = () => {
    const { blockUI, unblockUI } = useBlockUI();
    const [categories, setCategories] = useState<InUserPointCat[]>([]);
    const [isInitialLoad, setIsInitialLoad] = useState<boolean>(true);
    const UserPointCatModel = new UserPointCat();

    const loadCategories = async () => {
        if (isInitialLoad) blockUI();
        try {
            const response = await UserPointCatModel.list();
            setCategories(response.sys_userpoint_cat || []);
        } catch (error) {
            showToast('Failed to load user point categories', 'error');
        } finally {
            if (isInitialLoad) {
                unblockUI();
                setIsInitialLoad(false);
            }
        }
    };

    useEffect(() => {
        loadCategories();
    }, []);

    return (
        <>
            <div className="container-p-y">
                <h4 className="py-2 breadcrumb-wrapper mb-0">User Point Categories</h4>
                Manage user point category types
            </div>
            <div className="card mt-2">
                <h5 className="card-header border-top rounded-0">
                    Point Category List
                </h5>

                <div className="card-body">
                    {/* TABLE */}
                    <div className="table-responsive">
                        <table className="table table-hover">
                            <thead className="table-light">
                                <tr>
                                    <th style={{ width: '50px' }}>#</th>
                                    <th>Name</th>
                                    <th>Description</th>
                                </tr>
                            </thead>
                            <tbody>
                                {categories.length === 0 ? (
                                    <tr>
                                        <td colSpan={3} className="text-center py-4 text-muted">
                                            <i className="bx bx-info-circle bx-lg mb-2 d-block"></i>
                                            No categories found
                                        </td>
                                    </tr>
                                ) : (
                                    categories.map((category, index) => (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>
                                                <div className="fw-semibold">{category.name}</div>
                                            </td>
                                            <td>
                                                <span className="text-muted">{category.description}</span>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
};

export default UserPointCategoryPage;
