import React, {useEffect, useState} from 'react';
import { useRouter } from 'next/router';
import RouteChangeBlocker from '@/pages/_components/RouteChangeBlocker';
import Activity from "@/pages/user/_activity";
import Security from "@/pages/user/_security";
import Role from "@/pages/user/_role";
import Link from "next/link";
import {User, InUser, userForm} from '@/models/User'
import {fromText, randomColor} from "@/utils/image";
import useBlockUI from "@/pages/_components/useBlockUI";
import {convertUnixTimestampToDate} from "@/utils/date";

const UserPage: () => (void) = () => {
    const router = useRouter();
    const { blockUI, unblockUI } = useBlockUI();
    const [user, setUser] = useState<InUser>();
    const [isInitialLoad, setIsInitialLoad] = useState<boolean>(true);
    const { id } = router.query;


    const [activeTab, setActiveTab] = useState<'activity' | 'security' | 'role'>('activity');

    const handleTabChange = (tab: 'activity' | 'security' | 'role') => {
        setActiveTab(tab);
    };

    const Model = new User();
    const getUser = async () => {
        await Model.list({ filter: `id:${id}` }).then(response => {
            setUser(response.users[0]);
        }).finally(() => {
            unblockUI();
        });
    };
    useEffect(() => {
        getUser();
    }, [id]); // Tambahkan `id` sebagai dependensi

    if(!user){
        return blockUI();
    }

    const background_color = randomColor();
    return (

        <div className="flex-grow-1 container-p-y">
            <h4 className="py-3 breadcrumb-wrapper mb-4">
                <Link href="/user" className="btn btn-success">Kembali</Link>
            </h4>
            <div className="row gy-4">
                <div className="col-xl-4 col-lg-5 col-md-5 order-1 order-md-0">
                    <div className="card mb-4">
                        <div className="card-body">
                            <div className="user-avatar-section">
                                <div className="d-flex align-items-center flex-column">
                                    <div
                                        className="profile-initials bg-primary text-white rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3"
                                        style={{
                                            width: '100px',
                                            height: '100px',
                                            fontSize: '2rem'
                                        }}>
                                        {fromText( user.fullname)}
                                    </div>
                                    <div className="user-info text-center">
                                        <h5 className="mb-2">{user && user.fullname}</h5>
                                        <span className="badge bg-label-secondary">{user && user.role.name}</span>
                                    </div>
                                </div>
                            </div>
                            <h5 className="pb-2 border-bottom mb-4 mt-4"></h5>
                            <div className="info-container">
                                <ul className="list-unstyled">
                                    <li className="mb-3">
                                        <span className="fw-bold me-2">Username:</span>
                                        <span>{user.username}</span>
                                    </li>
                                    <li className="mb-3">
                                        <span className="fw-bold me-2">Role:</span>
                                        <span className="badge bg-label-success">{user.role.name}</span>
                                    </li>
                                    <li className="mb-3">
                                        <span className="fw-bold me-2">Terdaftar:</span>
                                        <span>{ convertUnixTimestampToDate(user.created_at)}</span>
                                    </li>
                                    <li className="mb-3">
                                        <span className="fw-bold me-2">Terakhir di update</span>
                                        <span>{convertUnixTimestampToDate(user.updated_at)}</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                </div>

                <div className="col-xl-8 col-lg-7 col-md-7 order-0 order-md-1">
                    <ul className="nav nav-pills flex-column flex-md-row mb-3">
                        <li className="nav-item">
                            <a
                                className={`nav-link ${activeTab === 'activity' ? 'active' : ''}`}
                                href="#"
                                onClick={() => handleTabChange('activity')}
                            >
                                <i className="bx bx-history me-1"></i> Aktivitas
                            </a>
                        </li>
                        <li className="nav-item">
                            <a
                                className={`nav-link ${activeTab === 'security' ? 'active' : ''}`}
                                href="#"
                                onClick={() => handleTabChange('security')}
                            >
                                <i className="bx bx-lock-alt me-1"></i> Kemanan
                            </a>
                        </li>
                        <li className="nav-item">
                            <a
                                className={`nav-link ${activeTab === 'role' ? 'active' : ''}`}
                                href="#"
                                onClick={() => handleTabChange('role')}
                            >
                                <i className="bx bx-menu me-1"></i> Role
                            </a>
                        </li>
                    </ul>

                    {activeTab === 'activity' ? (
                        <Activity/>
                    ) : activeTab === 'security' ? (
                        <Security data={user}/>
                    ) : (
                        <Role role_action={user.role_action} />
                    )}

                </div>
            </div>
        </div>

    );
};

export default UserPage;
