/**
 * @author Sarip Hidayat <hidayatsarip2210@gmail.com>
 * @copyright Sarip Hidayat 2024
 * @date 02/08/24
 */

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Offcanvas, Button } from 'react-bootstrap';
import Swal from 'sweetalert2';
import useBlockUI from '@/pages/_components/useBlockUI';
import Pagination from '@/pages/_components/Pagination';
import ConfirmDialog from '@/pages/_components/ConfirmDialog'
import Filter, { QueryParamsProps } from './_filter';
import Form from './_form';
import { MasterTaxe, InMasterTaxe, InMasterTaxeForm } from '@/models/MasterTaxe';
import { showToast } from '@/utils/toast';
import { useRouter } from 'next/router';
import { ListResponse } from "@/types/apiTypes";
import { StatusBadgeColors } from "@/types/user";

interface ValidationErrorProps {
    field: string;
    message: string;
}

interface PaginationProps {
    current_page: number;
    total: number;
    filtered_total: number;
    page_count: number;
    per_page: number;
}



const MasterTaxePage: React.FC = () => {
    const router = useRouter();
    const { blockUI, unblockUI } = useBlockUI();
    const [MasterTaxes, setMasterTaxes] = useState<InMasterTaxe[]>([]);
    const [pagination, setPagination] = useState<PaginationProps | null>(null);
    const [isInitialLoad, setIsInitialLoad] = useState<boolean>(true);
    const [pageCount, setPageCount] = useState<number>(0);
    const [lastQuery, setLastQuery] = useState<any>({});
    const [sortBy, setSortBy] = useState<string>('created_at');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [showForm, setShowForm] = useState<boolean>(false);
    const [formData, setFormData] = useState<InMasterTaxeForm>({
        id: null,
        code: "",
        name: "",
        rate: "",
        is_active: 0,
    });
    const [validationError, SetValidationError] = useState<ValidationErrorProps[]>([]);
    const Model = new MasterTaxe();

    const handleSort = (column: string) => {
        if (sortBy === column) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(column);
            setSortOrder('asc');
        }
    };

    const getSortIcon = (column: string) => {
        if (sortBy !== column) return <i className="bx bx-sort ms-1"></i>;
        return sortOrder === 'asc'
            ? <i className="bx bx-sort-up ms-1"></i>
            : <i className="bx bx-sort-down ms-1"></i>;
    };

    const listData = async (query: QueryParamsProps = {}) => {
        if (isInitialLoad) blockUI();
        try {
            query.page = currentPage;
            query.sort_by = sortBy + ':' + sortOrder;
            const response: ListResponse<InMasterTaxe[]> = await Model.list(query);
            setLastQuery(query);
            setMasterTaxes(response.master_taxes);
            setPagination(response.pagination);
            setPageCount(response.pagination.page_count);
        } catch (e) {
            if (e.status === 403) {
                router.push('/403');
            }
            unblockUI();
        } finally {
            if (isInitialLoad) {
                unblockUI();
                setIsInitialLoad(false);
            }
        }
    };

    const create = () => {
        clearFormData();
        SetValidationError([]);
        jQuery("#modal-MasterTaxe").modal('show');
    };

    const clearFormData = () => {
        setFormData({
            id: null,
            code: "",
            name: "",
            rate: "",
            is_active: 0,
        });
    }

    const update = (data: InMasterTaxeForm) => {
        clearFormData();
        SetValidationError([]);
        setFormData(data);
        jQuery("#modal-MasterTaxe").modal('show');
    };



    const save = useCallback(async (data: InMasterTaxeForm) => {
        try {
            if (data.id) {
                await Model.update(data.id, data);
            } else {
                await Model.create(data);
            }
            showToast(`Successfully ${(data.id) ? 'updated' : 'added'}`, "success");
            jQuery("#modal-MasterTaxe").modal('hide');
            listData(lastQuery);
        } catch (error) {
            let lines = error.message.trim().split('\n');
            let result: ValidationErrorProps[] = lines.map(line => {
                let [field, ...message] = line.split(' ');
                return {
                    field,
                    message: message.join(' ')
                };
            });
            SetValidationError(result)
        }
    }, [Model, lastQuery, listData]);

    const remove = async (id: number) => {
        Swal.fire({
            title: "Are you sure?",
            text: "Once deleted, you will not be able to recover this data",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes",
            cancelButtonText: "No",
        }).then(async (result) => {
            if (result.isConfirmed) {
                const response = await Model.delete(id);
                if (response.success) {
                    showToast("Successfully Deleted", "success");
                    listData(lastQuery);
                }
            }
        });
    };

    const UserStatusBadge = (status) => {
        if (status == '1') {
            return (
                <span className={`badge bg-success`}>
                    Active
                </span>
            );
        } else {
            return (
                <span className={`badge bg-danger`}>
                    Inactive
                </span>
            );
        }
    };



    useEffect(() => {
        if (!isInitialLoad) listData(lastQuery);
    }, [currentPage]);

    useEffect(() => {
        if (!isInitialLoad) listData(lastQuery);
    }, [sortBy, sortOrder]);


    return (
        <>
            <div className=" container-p-y">
                <h4 className="py-2 breadcrumb-wrapper mb-0">Master Taxes</h4>
                Manage your Master Taxes
            </div>
            <Filter onSubmit={listData} />
            <div className="card mt-2">
                <h5 className="card-header d-flex border-top rounded-0 flex-wrap">
                    <div className="d-flex justify-content-start justify-content-md-end align-items-baseline ms-auto">
                        <Button variant="primary" onClick={create}>
                            <span><i className="bx bx-plus me-0 me-sm-1"></i></span>
                            <span className="d-none d-sm-inline-block">Add Data</span>
                        </Button>
                    </div>
                </h5>
                <div className="table-responsive text-nowrap">
                    <table className="table">
                        <thead className="border-top">
                            <tr>
                                <th style={{ width: '10%' }}>Actions</th>
                                <th style={{ cursor: 'pointer' }} onClick={() => handleSort('code')}>Code {getSortIcon('code')}</th>
                                <th style={{ cursor: 'pointer' }} onClick={() => handleSort('name')}>Name {getSortIcon('name')}</th>
                                <th style={{ cursor: 'pointer' }} onClick={() => handleSort('rate')}>Rate {getSortIcon('rate')}</th>
                                <th style={{ cursor: 'pointer' }} onClick={() => handleSort('is_active')}>Is Active {getSortIcon('is_active')}</th>
                                <th style={{ cursor: 'pointer' }} onClick={() => handleSort('created_at')}>Created At {getSortIcon('created_at')}</th>
                                <th style={{ cursor: 'pointer' }} onClick={() => handleSort('updated_at')}>Updated At {getSortIcon('updated_at')}</th>

                            </tr>
                        </thead>
                        <tbody className="table-border-bottom-0">
                            {MasterTaxes.map((item: InMasterTaxe, key: number) => (
                                <tr className="odd" key={key}>
                                    <td>
                                        <div className="d-flex align-items-sm-center justify-content-sm-center">
                                            <button className="btn btn-md btn-icon btn-danger me-2"
                                                onClick={() => remove(item.id)}><i className="bx bx-trash"></i>
                                            </button>
                                            <button className="btn btn-md btn-icon btn-warning"
                                                onClick={() => update(item)}><i className="bx bx-edit"></i></button>
                                        </div>
                                    </td>
                                    <td>{item.code}</td>
                                    <td>{item.name}</td>
                                    <td>{item.rate}%</td>
                                    <td>{UserStatusBadge(item.is_active)}</td>
                                    {/*<td>{item.unit_code}</td>*/}
                                    <td>{item.created_at}</td>
                                    <td>{item.updated_at}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {pagination && (
                        <div className="row mx-2 mt-4">
                            <div className="col-sm-12 col-md-6">
                                <div className="dataTables_info" role="status" aria-live="polite">
                                    Found {pagination.filtered_total} of {pagination.total} data,
                                    displaying {MasterTaxes.length} data
                                </div>
                            </div>
                            {pagination.page_count && (
                                <div className="col-sm-12 col-md-6 d-flex justify-content-end">
                                    <Pagination currentPage={currentPage} pageCount={pagination.page_count} onPageChange={setCurrentPage} />
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
            <Form
                title={formData.id ? 'Update Data' : 'Add Data'}
                data={formData}
                onSave={save}
                validationError={validationError}
            />
        </>
    );
};

export default MasterTaxePage;
