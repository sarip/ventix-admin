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
import  ConfirmDialog  from '@/pages/_components/ConfirmDialog'
import Filter from './_filter';
import Form from './_form';
import { Role, InRoleForm, InRole } from '@/models/Role';
import {InUser, User} from '@/models/User';
import {Action, InAction} from '@/models/Action';
import { showToast } from '@/utils/toast';
import { useRouter } from 'next/router';
import {fromText, randomColor} from "@/utils/image";
import {forEach} from "react-bootstrap/ElementChildren";
import {RoleAction} from "@/models/RoleAction";


const RolePage: React.FC = () => {
    const router = useRouter();
    const { blockUI, unblockUI } = useBlockUI();
    const [isInitialLoad, setIsInitialLoad] = useState<boolean>(true);
    const [roles, setRole] = useState<InRole[]>([]);
    const [pagination, setPagination] = useState<any>({});
    const [pageCount, setPageCount] = useState<number>(0);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [lastQuery, setLastQuery] = useState<any>({});
    const [showForm, setShowForm] = useState<boolean>(false);
    const [scopes, setScopes] = useState([]);
    const [formData, setFormData] = useState<InRoleForm>({
        id: undefined,
        name: '',
        scope: '',
    });
    const [validationError, SetValidationError] = useState<{}>({});


    const Model = new Role();


    const listData = async (query: any = {}) => {
        if (isInitialLoad) blockUI();
        try {
            query.page = currentPage;
            const response = await Model.list(query);
            const roles = await loadUser(response.roles);
            console.log({'roles' : roles})
            setLastQuery(query);
            setRole(roles);
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

    const create = async () => {
        SetValidationError({});
        setFormData({ id: undefined, scope: '', name: '' });
        setShowForm(true);
        jQuery('#modal-role').modal('show');
    };

    const update = async (data: InRoleForm) => {
        SetValidationError({});
        setFormData(data);
        jQuery('#modal-role').modal('show');
    };




    const RoleActionModel = new RoleAction();
    const save = useCallback(async (data: InRoleForm) => {
        try {
            if (data.id) {
                await Model.update(data.id, data);
            } else {
                await Model.create(data).then(response => {
                    // data.permissions.forEach(permission => {
                    //     permission.scope = data.scope;
                    //     permission.role_id = response.id;
                    //     RoleActionModel.create(permission);
                    //
                    // });
                });
            }
            showToast(`Berhasil di ${(data.id) ? 'update' : 'tambahkan'}`, "success");
            jQuery('#modal-role').modal('hide');
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
                if(response.success) {
                    showToast("Berhasil di hapus", "success");
                    listData(lastQuery);
                }
            }
        });

    };


    const UserModel = new User();
    const loadUser = async (roles) =>  {
        const promises = roles.map(async (role) => {
            const response = await UserModel.list({ filter: `role_id:${role.id}`, per_page: 5 });
            const users = response.users.map(user => ({
                id: user.id,
                username: user.username,
                fullname: user.fullname
            }));
            return {
                ...role,
                users: users
            };
        });
        return  await Promise.all(promises);
    }

    const ActionModel = new Action();
    const loadScope = async() => {
        await ActionModel.scope().then(response => {
            setScopes(response.scope);
        })
    }

    const navigateUser = (user_id:number) => {
        router.push('/user/'+user_id);
    }


    useEffect(() => {
        if (!isInitialLoad) listData(lastQuery);
    }, [currentPage]);




    return (
        <>
        <div className="flex-grow-1 container-p-y">


            <h4 className="py-3 breadcrumb-wrapper mb-2">Roles</h4>

            <p>Halaman ini digunakan untuk mengelola akses dari setiap role yang akan digunakan oleh pengguna.</p>
            <Filter onSubmit={listData}/>
            <div className="row g-4 mt-2">
                <div className="col-xl-4 col-lg-6 col-md-6">
                    <div className="card h-100">
                        <div className="row h-100">
                            <div className="col-sm-5 bx-wallet">
                                <div className="d-flex align-items-end h-100 justify-content-center mt-sm-0 mt-3">
                                    <img src="/assets/img/illustrations/lady-with-laptop-light.png"
                                         className="img-fluid" alt="Image" style={{width: '100px'}}
                                         data-app-light-img="/assets/illustrations/lady-with-laptop-light.png"
                                         data-app-dark-img="/assets/illustrations/lady-with-laptop-dark.html"/>
                                </div>
                            </div>
                            <div className="col-sm-7">
                                <div className="card-body text-sm-end text-center ps-sm-0">
                                    <button onClick={() => create()}
                                            className="btn btn-primary mb-3 text-nowrap ">Add New Role
                                    </button>
                                    <p className="mb-0">Add role, if it does not exist</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {roles.map((role: InRole, key: number) => (
                    <div className="col-xl-4 col-lg-6 col-md-6" key={key}>
                        <div className="card">
                            <div className="card-body">
                                <div className="d-flex justify-content-between mb-2">
                                    <h6 className="fw-normal">Total {role.total_users} users</h6>
                                    <ul className="list-unstyled d-flex align-items-center avatar-group mb-0">
                                        {role.users.map((user: InUser, key2: number) => (
                                            <li key={key2} data-bs-toggle="tooltip" data-popup="tooltip-custom"
                                                data-bs-placement="top" title={user.fullname}
                                                className="d-flex align-items-center justify-content-center text-white rounded-circle avatar avatar-sm pull-up"
                                                style={{
                                                    width: '30px',
                                                    height: '30px',
                                                    fontSize: '0.8rem',
                                                    backgroundColor: randomColor()
                                                }}
                                                onClick={() => navigateUser(user.id)}>
                                                {fromText(user.fullname)}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="d-flex justify-content-between align-items-end">
                                    <div className="role-heading">
                                        <h4 className="mb-1">{role.name}</h4>
                                        <p>{role.scope}</p>
                                        <a href="#" onClick={() => update(role)} className="role-edit-modal"><small>Edit
                                            Role</small></a>
                                    </div>
                                    <a onClick={() => remove(role.id)} className="text-danger"
                                       style={{cursor: 'pointer'}}><i className="bx bx-trash"></i></a>
                                </div>
                            </div>
                        </div>
                    </div>

                ))}

            </div>
            <div className="col-12 mt-4">
                <div className="card">
                    {pagination && (
                        <div className="row mx-2 mt-4">
                            <div className="col-sm-12 col-md-6">
                                <div className="dataTables_info" role="status" aria-live="polite">
                                    Ditemukan {pagination.filtered_total} dari total {pagination.total} data,
                                    ditampikan {roles.length} data
                                </div>
                            </div>
                            {pagination.page_count && (
                                <div className="col-sm-12 col-md-6 d-flex justify-content-end">
                                    <Pagination currentPage={currentPage} pageCount={pagination.page_count}
                                                onPageChange={setCurrentPage}/>
                                </div>
                            )}
                        </div>
                    )}

                </div>

            </div>
        </div>

    <Form
        title={formData.id ? 'Update Role' : 'Tambah Akses'}
        show={showForm}
        onClose={() => setShowForm(false)}
        data={formData}
        onSave={save}
        scopes={scopes}
        validationError={validationError}
    />
</>
)
    ;
};

export default RolePage;
