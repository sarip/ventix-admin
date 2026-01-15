import React, {useCallback, useEffect, useState} from "react";
import {Button} from "react-bootstrap";
import {fromText, randomColor} from '@/utils/image'
import {convertUnixTimestampToDate} from '@/utils/date'
import Filter from "@/pages/user/_filter";
import {InUser, InUserForm, User} from "@/models/User";
import {useRouter} from "next/router";
import useBlockUI from "@/pages/_components/useBlockUI";
import {InItem, InItemForm} from "@/models/Item";
import Pagination from "@/pages/_components/Pagination";
import Link from "next/link";
import Form from "./_form";
import {showToast} from "@/utils/toast";
import Swal from "sweetalert2";


export default function UserPage() {
    const router = useRouter();
    const { blockUI, unblockUI } = useBlockUI();
    const [isInitialLoad, setIsInitialLoad] = useState<boolean>(true);
    const [users, setUsers] = useState<InUser[]>([]);
    const [pagination, setPagination] = useState<any>({});
    const [pageCount, setPageCount] = useState<number>(0);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [lastQuery, setLastQuery] = useState<any>({});
    const [showForm, setShowForm] = useState<boolean>(false);
    const [formData, setFormData] = useState<InUserForm>({id: undefined, role_id : '', username : '', password : '', fullname: ''});
    const [validationError, SetValidationError] = useState<{}>({});
    const Model = new User();


    const listData = async (query: any = {}) => {
        if (isInitialLoad) blockUI();
        try {
            query.page = currentPage;
            const response = await Model.list(query);
            setLastQuery(query);
            setUsers(response.users);
            setPagination(response.pagination);
            setPageCount(response.pagination.page_count);
        } catch (e){
            if(e.status === 403){
                router.push('/403');
            }
            unblockUI();
        }finally {
            if (isInitialLoad) {
                unblockUI();
                setIsInitialLoad(false);
            }
        }
    };

    const create = () => {
        SetValidationError({});
        setFormData({ id: undefined, role_id: '', username: '', password: '', fullname: '' });
        console.log({'create' : formData})
        setShowForm(true);
    };

    const update = (data: InUser) => {
        SetValidationError({});
        setFormData({ ...data, password: '' }); // Reset password field
        console.log({'update' : formData})
        setShowForm(true);
    };

    useEffect(() => {
        if (showForm) {
            jQuery("#modal-user").modal('show');
        } else {
            jQuery("#modal-user").modal('hide');
        }
    }, [showForm]);


    const save = useCallback(async (data: InUserForm) => {
        try {
            if (data.id) {
                await Model.update(data.id, data);
            } else {
                await Model.create(data);
            }
            showToast(`Berhasil di ${(data.id) ? 'update' : 'tambahkan'}`, "success");
            jQuery('#modal-user').modal('hide');
            listData(lastQuery);
        } catch (error) {
            let lines = error.message.trim().split('\n');
            let result = lines.map(line => {
                let [field, ...message] = line.split(' ');
                return {
                    field,
                    message: message.join(' ')
                };
            });
            SetValidationError(result)
        }
    }, [Model, lastQuery, listData]);

    const remove = async (id:number) => {
        Swal.fire({
            title: "Apa Anda Yakin?",
            text: "Setelah dihapus, anda tidak dapat mengembalikannya",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Ya, Hapus",
            cancelButtonText: "Tidak",
        }).then(async (result) => {
            if (result.isConfirmed) {
                const response = await Model.delete(id);
                if (response.success) {
                    showToast("Berhasil di hapus", "success");
                    listData(lastQuery);
                }
            }
        });
    }


        const background_image = randomColor();
    useEffect(() => {
        if (!isInitialLoad) listData(lastQuery);
    }, [currentPage]);
    return (
        <>
            <div className="flex-grow-1 container-p-y">
                <h4 className="py-2 breadcrumb-wrapper mb-0">User</h4>
                Halaman ini menampilkan data dari user
            </div>
            <div className="card mb-2">
                <h5 className="card-header d-flex border-top rounded-0 flex-wrap">
                    <div className="d-flex justify-content-start justify-content-md-end align-items-baseline ms-auto">
                        <Button variant="primary" onClick={() => create()}>
                            <span><i className="bx bx-plus me-0 me-sm-1"></i></span>
                            <span className="d-none d-sm-inline-block">Tambah Data</span>
                        </Button>
                    </div>
                </h5>
            </div>
            <Filter onSubmit={listData}/>
            <div className="row mt-2">
                {users.map((user: InUser, key) => (
                    <div className="col-md-4 mt-3" key={key}>
                        <div className="card h-100 shadow-sm">
                            <div className="card-body text-center">
                                <div
                                    className="profile-initials text-white rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3"
                                    style={{
                                        width: '100px',
                                        height: '100px',
                                        fontSize: '2rem',
                                        backgroundColor: randomColor()
                                    }}>
                                    {fromText(user.fullname)}
                                </div>
                                <h5 className="card-title">{user.username}</h5>
                                <p className="card-text">Role: {user.role?.name}</p>
                                <p className="card-text">Fullname: {user.fullname}</p>
                                <p className="card-text">Terdaftar: {convertUnixTimestampToDate(user.created_at)}</p>
                                {/*<Link href={`/user/${user.id}`} passHref className="btn btn-primary">Profile</Link>*/}

                            </div>
                            <div className="card-footer">
                                <div className="d-flex justify-content-center">
                                    <Link href={`/user/${user.id}`} passHref className="btn btn-primary btn-md me-2">
                                        <i className="fas fa-user me-1"></i> Profile
                                    </Link>
                                    <button className="btn btn-warning btn-md me-2" onClick={() => update(user) }>
                                        <i className="fas fa-edit me-1"></i> Edit
                                    </button>
                                    <button className="btn btn-danger btn-md" onClick={() => remove(user.id)}>
                                        <i className="fas fa-trash-alt me-1"></i> Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                ))}
                <div className="col-12 mt-4">
                    <div className="card">
                        {pagination && (
                            <div className="row mx-2 mt-4">
                                <div className="col-sm-12 col-md-6">
                                    <div className="dataTables_info" role="status" aria-live="polite">
                                        Ditemukan {pagination.filtered_total} dari total {pagination.total} data,
                                        ditampikan {users.length} data
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
                </div>

            <Form
                title={formData.id ? 'Update User' : 'Tambah User'}
                show={showForm}
                onClose={() => setShowForm(false)}
                data={formData}
                onSave={save}
                validationError={validationError}
            />

        </>
    );
}