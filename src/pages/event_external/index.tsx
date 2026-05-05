/**
 * @author Sarip Hidayat <hidayatsarip2210@gmail.com>
 * @copyright Sarip Hidayat 2024
 * @date 02/08/24
 */

import React, { useEffect, useState, useRef, useCallback } from 'react';
import {Offcanvas, Button, Badge} from 'react-bootstrap';
import Swal from 'sweetalert2';
import useBlockUI from '@/pages/_components/useBlockUI';
import Pagination from '@/pages/_components/Pagination';
import ConfirmDialog from '@/pages/_components/ConfirmDialog'
import Filter, { QueryParamsProps } from './_filter';
import Form from './_form';
import Profile from './_profile';
import {Event, InEvent, InEventForm, InExternalForm} from '@/models/Event';
import { showToast } from '@/utils/toast';
import { useRouter } from 'next/router';
import { ListResponse } from "@/types/apiTypes";
import OneGalery from "@/pages/_components/OneGalery";
import {useUserStore} from "@/store/store";

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



const EventPage: React.FC = () => {
    const router = useRouter();
    const { blockUI, unblockUI } = useBlockUI();
    const [isInitialLoad, setIsInitialLoad] = useState<boolean>(true);
    const [Events, setEvents] = useState<InEvent[]>([]);
    const [pagination, setPagination] = useState<PaginationProps | null>(null);
    const [pageCount, setPageCount] = useState<number>(0);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [lastQuery, setLastQuery] = useState<any>({});
    const [sortBy, setSortBy] = useState<string>('created_at');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
    const [showForm, setShowForm] = useState<boolean>(false);
    const user = useUserStore((state) => state.user);
    const [formData, setFormData] = useState<InExternalForm>({
        id: null,
        is_external: "N",
        external_url: "",
        title: "",
        location: "",
        start_date: "",
        end_date: "",
        event_category: "",
        events_status: "",
        thumbnail_url: "",
    });
    const [validationError, SetValidationError] = useState<ValidationErrorProps[]>([]);
    const [showProfile, setShowProfile] = useState<boolean>(false);
    const [selectedEvent, setSelectedEvent] = useState<InEvent | null>(null);
    const Model = new Event();

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
            const response: ListResponse<InEvent[]> = await Model.listExternal(query);
            setLastQuery(query);
            setEvents(response.events);
            setPagination(response.pagination);
            setPageCount(response.pagination.page_count);
        } catch (e: any) {
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
        jQuery("#modal-Event-external").modal('show');
    };

    const clearFormData = () => {
        setFormData({
            id: null,
            is_external: "N",
            external_url: "",
            title: "",
            start_date: "",
            end_date: "",
            location: "",
            event_category: "",
            events_status: "",
            thumbnail_url: "",
        });
    }

    const update = (data: InEventForm) => {
        clearFormData();
        SetValidationError([]);
        setFormData(data);
        jQuery("#modal-Event-external").modal('show');
    };

    const viewProfile = (item: InEvent) => {
        setSelectedEvent(item);
        setShowProfile(true);
    };



    const save = useCallback(async (data: InEventForm) => {
        try {
            const payload = new FormData();

            Object.entries(data).forEach(([key, value]) => {
                if (value !== null && value !== undefined) {
                    payload.append(key, value as any);
                }
            });

            if (data.id) {
                await Model.update(data.id, payload);
            } else {
                await Model.create(payload);
            }
            showToast(`Successfully ${(data.id) ? 'updated' : 'added'}`, "success");
            jQuery("#modal-Event-external").modal('hide');
            listData(lastQuery);
        } catch (error: any) {
            let lines = error.message.trim().split('\n');
            let result: ValidationErrorProps[] = lines.map((line: string) => {
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
                <h4 className="py-2 breadcrumb-wrapper mb-0">Event External</h4>
                Manage your Event External
            </div>
            <Filter onSubmit={listData} />
            <div className="card mt-2">
                <h5 className="card-header d-flex border-top rounded-0 flex-wrap">
                    <div className="d-flex justify-content-start justify-content-md-end align-items-baseline ms-auto">
                        {user.role === 'super_admin' && (
                            <Button variant="primary" onClick={create}>
                                <span><i className="bx bx-plus me-0 me-sm-1"></i></span>
                                <span className="d-none d-sm-inline-block">Add Data</span>
                            </Button>
                        )}
                    </div>
                </h5>
                <div className="table-responsive text-nowrap">
                    <table className="table">
                        <thead className="border-top">
                            <tr>
                                <th style={{ width: '10%' }}>Actions</th>
                                <th>Thumbnail</th>
                                <th>URL EVENT</th>
                                <th style={{ cursor: 'pointer' }} onClick={() => handleSort('title')}>Title {getSortIcon('title')}</th>
                                <th style={{ cursor: 'pointer' }} onClick={() => handleSort('event_category')}>Category {getSortIcon('event_category')}</th>
                                <th style={{ cursor: 'pointer' }} onClick={() => handleSort('event_status')}>Status {getSortIcon('event_status')}</th>
                                <th style={{ cursor: 'pointer' }} onClick={() => handleSort('location')}>Location {getSortIcon('location')}</th>
                                <th>Date</th>
                                <th style={{ cursor: 'pointer' }} onClick={() => handleSort('created_at')}>Created At {getSortIcon('created_at')}</th>
                                <th style={{ cursor: 'pointer' }} onClick={() => handleSort('updated_at')}>Updated At {getSortIcon('updated_at')}</th>

                            </tr>
                        </thead>
                        <tbody className="table-border-bottom-0">
                            {Events.map((item: InEvent, key: number) => (
                                <tr className="odd" key={key}>
                                    <td>
                                        <div className="d-flex align-items-sm-center justify-content-sm-center">
                                            <button className="btn btn-md btn-icon btn-primary me-2"
                                                    onClick={() => viewProfile(item)} title="View Profile">
                                                <i className="bx bx-show"></i>
                                            </button>
                                            {user.role === 'super_admin' && (
                                                <button className="btn btn-md btn-icon btn-danger me-2"
                                                        onClick={() => remove(item.id)} title="Delete">
                                                    <i className="bx bx-trash"></i>
                                                </button>
                                            )}
                                            <button className="btn btn-md btn-icon btn-warning"
                                                    onClick={() => update(item)} title="Edit">
                                                <i className="bx bx-edit"></i>
                                            </button>
                                        </div>
                                    </td>
                                    <td>
                                        <OneGalery attachments={`/event/${item.thumbnail_url}`}/>
                                    </td>
                                    <td>
                                        <a
                                            href={item.external_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-600 hover:underline"
                                        >
                                            {item.external_url}
                                        </a>
                                    </td>
                                    <td>{item.title}</td>
                                    <td>{item.event_category}</td>
                                    <td>{item.events_status}</td>
                                    <td>{item.location}</td>
                                    <td>{item.start_date} - {item.end_date}</td>
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
                                    displaying {Events.length} data
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
            <Profile
                show={showProfile}
                onHide={() => setShowProfile(false)}
                data={selectedEvent}
            />
        </>
    );
};

export default EventPage;
