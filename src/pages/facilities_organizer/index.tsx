/**
 * @author Sarip Hidayat <hidayatsarip2210@gmail.com>
 * @copyright Sarip Hidayat 2024
 * @date 2026-07-18
 */

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Offcanvas, Button, Badge } from 'react-bootstrap';
import Swal from 'sweetalert2';
import useBlockUI from '@/pages/_components/useBlockUI';
import Pagination from '@/pages/_components/Pagination';
import ConfirmDialog from '@/pages/_components/ConfirmDialog'
import Filter, { QueryParamsProps } from './_filter';
import Form from './_form';
import Profile from './_profile';
import { FacilityOrganizer, InFacilityOrganizer, InFacilityOrganizerForm } from '@/models/FacilityOrganizer';
import { showToast } from '@/utils/toast';
import { useRouter } from 'next/router';
import { ListResponse } from "@/types/apiTypes";
import OneGalery from "@/pages/_components/OneGalery";
import { useUserStore } from "@/store/store";

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



const FacilityOrganizerPage: React.FC = () => {
    const router = useRouter();
    const { blockUI, unblockUI } = useBlockUI();
    const [isInitialLoad, setIsInitialLoad] = useState<boolean>(true);
    const [FacilityOrganizers, setFacilityOrganizers] = useState<InFacilityOrganizer[]>([]);
    const [pagination, setPagination] = useState<PaginationProps | null>(null);
    const [pageCount, setPageCount] = useState<number>(0);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [lastQuery, setLastQuery] = useState<any>({});
    const [sortBy, setSortBy] = useState<string>('created_at');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
    const [showForm, setShowForm] = useState<boolean>(false);
    const user = useUserStore((state) => state.user);
    const [formData, setFormData] = useState<InFacilityOrganizerForm>({
        id: null,
        facility_name: "",
        company_name: "",
        email: "",
        phone: "",
        website: "",
        address: "",
        logo_path: "",
        tax_id: "",
        description: "",
        legal_doc_path: "",
    });
    const [validationError, SetValidationError] = useState<ValidationErrorProps[]>([]);
    const [showProfile, setShowProfile] = useState<boolean>(false);
    const [selectedFO, setSelectedFO] = useState<InFacilityOrganizer | null>(null);
    const Model = new FacilityOrganizer();

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
            const response: ListResponse<InFacilityOrganizer[]> = await Model.list(query);
            setLastQuery(query);
            setFacilityOrganizers(response.facilities_organizer);
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
        jQuery("#modal-FacilityOrganizer").modal('show');
    };

    const clearFormData = () => {
        setFormData({
            id: null,
            facility_name: "",
            company_name: "",
            email: "",
            phone: "",
            website: "",
            address: "",
            logo_path: "",
            tax_id: "",
            description: "",
            legal_doc_path: "",
        });
    }

    const update = (data: InFacilityOrganizerForm) => {
        clearFormData();
        SetValidationError([]);
        setFormData(data);
        jQuery("#modal-FacilityOrganizer").modal('show');
    };

    const viewProfile = (item: InFacilityOrganizer) => {
        setSelectedFO(item);
        setShowProfile(true);
    };

    const approveFO = async (id: number) => {
        try {
            await Model.verify(id, { status: 'Approved' });
            showToast("Facility Organizer approved successfully", "success");
            setShowProfile(false);
            listData(lastQuery);
        } catch (error: any) {
            showToast(error.message || "Failed to approve", "error");
        }
    };

    const rejectFO = async (id: number) => {
        const { value: note } = await Swal.fire({
            title: 'Reject Organizer',
            input: 'textarea',
            inputLabel: 'Reason for rejection',
            inputPlaceholder: 'Type your reason here...',
            inputAttributes: {
                'aria-label': 'Type your reason here'
            },
            showCancelButton: true
        });

        if (note) {
            try {
                await Model.verify(id, { status: 'Rejected', note });
                showToast("Facility Organizer rejected", "info");
                setShowProfile(false);
                listData(lastQuery);
            } catch (error: any) {
                showToast(error.message || "Failed to reject", "error");
            }
        }
    };



    const save = useCallback(async (data: InFacilityOrganizerForm) => {
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
            jQuery("#modal-FacilityOrganizer").modal('hide');
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
                <h4 className="py-2 breadcrumb-wrapper mb-0">Facility Organizers</h4>
                Manage your Facility Organizers
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
                                <th>Logo</th>
                                <th style={{ cursor: 'pointer' }} onClick={() => handleSort('facility_name')}>Facility Name {getSortIcon('facility_name')}</th>
                                <th style={{ cursor: 'pointer' }} onClick={() => handleSort('company_name')}>Company Name {getSortIcon('company_name')}</th>
                                <th style={{ cursor: 'pointer' }} onClick={() => handleSort('email')}>Email {getSortIcon('email')}</th>
                                <th style={{ cursor: 'pointer' }} onClick={() => handleSort('phone')}>Phone {getSortIcon('phone')}</th>
                                <th>Website</th>
                                <th>Address</th>
                                <th>Tax ID</th>
                                <th>Status</th>
                                <th>Legality</th>
                                <th>Description</th>
                                <th style={{ cursor: 'pointer' }} onClick={() => handleSort('created_at')}>Created At {getSortIcon('created_at')}</th>
                                <th style={{ cursor: 'pointer' }} onClick={() => handleSort('updated_at')}>Updated At {getSortIcon('updated_at')}</th>

                            </tr>
                        </thead>
                        <tbody className="table-border-bottom-0">
                            {FacilityOrganizers.map((item: InFacilityOrganizer, key: number) => (
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
                                        <OneGalery attachments={`/facilities_organizer/${item.logo_path}`} />
                                    </td>
                                    <td>{item.facility_name}</td>
                                    <td>{item.company_name}</td>
                                    <td>{item.email}</td>
                                    <td>{item.phone}</td>
                                    <td>{item.website}</td>
                                    <td>{item.address}</td>
                                    <td>{item.tax_id}</td>
                                    <td>
                                        <Badge bg={item.verification_status === 'Approved' ? 'success' : (item.verification_status === 'Rejected' ? 'danger' : 'warning')} text={item.verification_status !== 'Approved' && item.verification_status !== 'Rejected' ? 'dark' : undefined}>
                                            {item.verification_status || 'Pending'}
                                        </Badge>
                                    </td>
                                    <td>
                                        {item.legal_doc_path ? (
                                            <a href={`${process.env.NEXT_PUBLIC_BASE_URL?.replace('/api/v1/', '')}/uploads/legality/${item.legal_doc_path}`} target="_blank" rel="noreferrer" className="btn btn-xs btn-outline-primary">
                                                <i className="bx bx-file me-1"></i> View
                                            </a>
                                        ) : '-'}
                                    </td>
                                    <td>{item.description}</td>
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
                                    displaying {FacilityOrganizers.length} data
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
                data={selectedFO}
                onApprove={approveFO}
                onReject={rejectFO}
            />
        </>
    );
};

export default FacilityOrganizerPage;
