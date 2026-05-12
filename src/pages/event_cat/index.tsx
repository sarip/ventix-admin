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
import { EventCat, InEventCat, InEventCatForm } from '@/models/EventCat';
import { showToast } from '@/utils/toast';
import { useRouter } from 'next/router';
import { ListResponse } from "@/types/apiTypes";

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



const EventCatPage: React.FC = () => {
    const router = useRouter();
    const { blockUI, unblockUI } = useBlockUI();
    const [isInitialLoad, setIsInitialLoad] = useState<boolean>(true);
    const [EventCats, setEventCats] = useState<InEventCat[]>([]);
    const [pagination, setPagination] = useState<PaginationProps | null>(null);
    const [pageCount, setPageCount] = useState<number>(0);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [lastQuery, setLastQuery] = useState<any>({});
    const [sortBy, setSortBy] = useState<string>('name');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
    const [showForm, setShowForm] = useState<boolean>(false);
    const [formData, setFormData] = useState<InEventCatForm>({
        id: null,
        name: "",
        description: ""
    });
    const [validationError, SetValidationError] = useState<ValidationErrorProps[]>([]);
    const Model = new EventCat();

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
            const response: ListResponse<InEventCat[]> = await Model.list(query);
            setLastQuery(query);
            setEventCats(response.events_cat);
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
        jQuery("#modal-EventCat").modal('show');
    };

    const clearFormData = () => {
        setFormData({
            id: null,
            name: "",
            description: ""
        });
    }

    const update = (data: InEventCatForm) => {
        clearFormData();
        SetValidationError([]);
        setFormData(data);
        jQuery("#modal-EventCat").modal('show');
    };



    const save = useCallback(async (data: InEventCatForm) => {
        try {
            if (data.id) {
                await Model.update(data.id, data);
            } else {
                await Model.create(data);
            }
            showToast(`Successfully ${(data.name) ? 'updated' : 'added'}`, "success");
            jQuery("#modal-EventCat").modal('hide');
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



    useEffect(() => {
        if (!isInitialLoad) listData(lastQuery);
    }, [currentPage]);

    useEffect(() => {
        if (!isInitialLoad) listData(lastQuery);
    }, [sortBy, sortOrder]);


    return (
        <>
            <div className=" container-p-y">
                <h4 className="py-2 breadcrumb-wrapper mb-0">Event Kategori</h4>
                Manage your event kategori
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
                                <th style={{width: '10%'}}>Actions</th>
                                <th style={{ cursor: 'pointer' }} onClick={() => handleSort('name')}>Name {getSortIcon('name')}</th>
                                <th>Description</th>

                            </tr>
                        </thead>
                        <tbody className="table-border-bottom-0">
                            {EventCats.map((item: InEventCat, key: number) => (
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
                                    <td>{item.name}</td>
                                    <td>{item.description}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {pagination && (
                        <div className="row mx-2 mt-4">
                            <div className="col-sm-12 col-md-6">
                                <div className="dataTables_info" role="status" aria-live="polite">
                                    Found {pagination.filtered_total} of {pagination.total} data,
                                    displaying {EventCats.length} data
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
                title={formData.name ? 'Update Data' : 'Add Data'}
                data={formData}
                onSave={save}
                validationError={validationError}
            />
        </>
    );
};

export default EventCatPage;
