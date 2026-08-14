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
import { Event, InEvent, InEventForm } from '@/models/Event';
import { showToast } from '@/utils/toast';
import { useRouter } from 'next/router';
import { ListResponse } from "@/types/apiTypes";
import EventStatusBadge from "@/pages/_components/EventStatusBadge";

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
    const [events, setEvents] = useState<InEvent[]>([]);
    const [pagination, setPagination] = useState<PaginationProps | null>(null);
    const [pageCount, setPageCount] = useState<number>(0);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [lastQuery, setLastQuery] = useState<any>({});
    const [sortBy, setSortBy] = useState<string>('created_at');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
    const [showForm, setShowForm] = useState<boolean>(false);
    const [formData, setFormData] = useState<InEventForm>({
        id: null,
        is_external: "N",
        external_url: "",
        events_organizer_id: null,
        user_id_pic: null,
        event_category: "",
        title: "",
        description: "",
        start_date: "",
        end_date: "",
        location_name: "",
        location: "",
        latitude: "",
        longitude: "",
        price_pool: "",
        registration_fee: "",
        thumbnail_url: null,
        events_status: "",
    });
    const [validationError, SetValidationError] = useState<ValidationErrorProps[]>([]);
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
            const response: ListResponse<InEvent[]> = await Model.list(query);
            setLastQuery(query);
            setEvents(response.events);
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
        jQuery("#modal-Event").modal('show');
    };

    const clearFormData = () => {
        setFormData({
            id: null,
            events_organizer_id: null,
            is_external: "N",
            external_url: "",
            user_id_pic: null,
            event_category: "",
            title: "",
            description: "",
            start_date: "",
            end_date: "",
            location: "",
            location_name: "",
            latitude: "",
            longitude: "",
            price_pool: "",
            registration_fee: "",
            thumbnail_url: null,
            events_status: "",
        });
    }

    const update = (data: InEventForm) => {
        clearFormData();
        SetValidationError([]);
        setFormData(data);
        jQuery("#modal-Event").modal('show');
    };



    const save = useCallback(async (data: InEventForm) => {
        console.log({ 'save': data })
        try {
            // if (data.id) {
            //     await Model.update(data.id, data);
            // } else {
            //     await Model.create(data);
            // }


            await Model.saveAll(data);

            showToast(`Successfully ${(data.id) ? 'updated' : 'added'}`, "success");
            jQuery("#modal-Event").modal('hide');
            listData(lastQuery);
            setTimeout(() => {
                window.location.reload();
            }, 1000);
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

    const slugify = (text: string) =>
        text
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, '')
            .replace(/[\s_]+/g, '-')
            .replace(/^-+|-+$/g, '');


    return (
        <>
            <div className=" container-p-y">
                <h4 className="py-2 breadcrumb-wrapper mb-0">Events</h4>
                Manage your Events
            </div>
            <Filter onSubmit={listData} />
            <div className="card mt-2">
                <h5 className="card-header d-flex border-top rounded-0 flex-wrap">
                    <div className="d-flex justify-content-start justify-content-md-end align-items-baseline ms-auto">
                        <Button variant="primary" onClick={create}>
                            <span><i className="bx bx-plus me-0 me-sm-1"></i></span>
                            <span className="d-none d-sm-inline-block">Create Event</span>
                        </Button>
                    </div>
                </h5>
                <div className="table-responsive text-nowrap">
                    <table className="table">
                        <thead className="border-top">
                        <tr>
                            <th style={{width: '10%'}}>Actions</th>
                            <th style={{cursor: 'pointer'}}
                                onClick={() => handleSort('eo_name')}>EO {getSortIcon('eo_name')}</th>
                            <th>PIC</th>
                            <th style={{cursor: 'pointer'}}
                                onClick={() => handleSort('title')}>Title {getSortIcon('title')}</th>
                            <th>Description</th>
                            <th style={{cursor: 'pointer'}}
                                onClick={() => handleSort('start_date')}>Date {getSortIcon('start_date')}</th>
                            <th style={{cursor: 'pointer'}} onClick={() => handleSort('events_status')}>Event
                                Status {getSortIcon('events_status')}</th>
                            <th>Dashboard Status</th>
                            <th>Location</th>
                            <th style={{cursor: 'pointer'}} onClick={() => handleSort('price_pool')}>Price
                                Pool {getSortIcon('price_pool')}</th>
                            <th style={{cursor: 'pointer'}} onClick={() => handleSort('registration_fee')}>Registration
                                Fee {getSortIcon('registration_fee')}</th>
                            <th style={{cursor: 'pointer'}} onClick={() => handleSort('created_at')}>Created
                                At {getSortIcon('created_at')}</th>
                            <th style={{cursor: 'pointer'}} onClick={() => handleSort('updated_at')}>Updated
                                At {getSortIcon('updated_at')}</th>

                        </tr>
                        </thead>
                        <tbody className="table-border-bottom-0">
                        {events.map((item: InEvent, key: number) => (
                                <tr className="odd" key={key}>
                                    <td>
                                        <div className="d-flex align-items-sm-center justify-content-sm-center">
                                            <a
                                                href={`${process.env.NEXT_PUBLIC_LANDING_PAGE_URL}/events/${slugify(item.title)}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="btn btn-md btn-icon btn-info me-2"
                                            >
                                                <i className="bx bx-show"></i>
                                            </a>

                                            <div className="d-flex align-items-sm-center justify-content-sm-center">
                                                <button className="btn btn-md btn-icon btn-danger me-2"
                                                        onClick={() => remove(item.id)}><i className="bx bx-trash"></i>
                                                </button>
                                                <button className="btn btn-md btn-icon btn-warning"
                                                        onClick={() => update(item)}><i className="bx bx-edit"></i>
                                                </button>
                                            </div>
                                        </div>
                                    </td>
                                    <td>{item.event_organizer?.eo_name}</td>
                                    <td>{item.user?.name}</td>
                                    <td>{item.title}</td>
                                    <td>{item.description}</td>
                                    <td>{item.start_date} - {item.end_date}</td>
                                    <td>
                                        <EventStatusBadge
                                            status={item.events_status}
                                        />
                                    </td>
                                    <td>
                                        <EventStatusBadge
                                            status={item.dashboard_status}
                                        />
                                    </td>
                                    <td>{item.location_name}</td>
                                    <td>{item.price_pool}</td>
                                    <td>{item.registration_fee}</td>
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
                                    displaying {events.length} data
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
                title={formData.id ? 'Edit Event' : 'Create Event'}
                data={formData}
                onSave={save}
                validationError={validationError}
            />
        </>
    );
};

export default EventPage;
