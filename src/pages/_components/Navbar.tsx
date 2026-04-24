/**
 * @author Sarip Hidayat <hidayatsarip2210@gmail.com>
 * @copyright Sarip Hidayat 2024
 * @date 03/08/24
 */

import React, { useEffect, useState } from 'react';
import Axios from 'axios';
import { useRouter } from 'next/router';
import { showToast } from '@/utils/toast';
import Link from "next/link";
import { deleteCookie, setCookie } from "cookies-next";
import NotificationPopup from '@/components/NotificationPopup';
import { getCookie } from 'cookies-next';


const Navbar: React.FC = () => {
    const router = useRouter();
    const [theme, setTheme] = useState<string>('light');
    const [isClient, setIsClient] = useState<boolean>(false);

    // const changeTheme = (newTheme: string) => {
    //     setTheme(newTheme);
    //     localStorage.setItem('theme', newTheme);
    //     localStorage.setItem('templateCustomizer-vertical-menu-template-starter--Style', newTheme);
    //     document.documentElement.setAttribute('data-theme', newTheme);
    // };
    //
    // const handleThemeChange = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    //     event.preventDefault();
    //     const newTheme = event.currentTarget.getAttribute('data-theme');
    //     if (newTheme) {
    //         changeTheme(newTheme);
    //     }
    // };
    //
    // useEffect(() => {
    //     setIsClient(true);
    //     const currentTheme = localStorage.getItem('theme') || 'light';
    //     setTheme(currentTheme);
    //     document.documentElement.setAttribute('data-theme', currentTheme);
    // }, []);

    useEffect(() => {
        setIsClient(true);
        const currentTheme = localStorage.getItem('theme') || 'light';
        setTheme(currentTheme);
        document.documentElement.setAttribute('data-theme', currentTheme);
    }, []);

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
    }, [theme]);

    const changeTheme = (newTheme: string) => {
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
        localStorage.setItem('templateCustomizer-vertical-menu-template-starter--Style', newTheme);
        window.location.reload();
    };

    const handleThemeChange = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        event.preventDefault();
        const newTheme = event.currentTarget.getAttribute('data-theme');
        if (newTheme) {
            changeTheme(newTheme);
        }
    };


    const logout = () => {
        if (!localStorage.getItem('key')) {
            router.push('/login')
        } else {

            let key = localStorage.getItem('key');
            let api_url = process.env.NEXT_PUBLIC_BASE_URL + "logout";
            Axios.get(api_url, {

                headers: {
                    "Content-Type": "application/json",
                    key
                }
            }).then((resp) => {
                showToast('Logout berhasil, silahkan tunggu ...', 'success');
                localStorage.removeItem('key');
                localStorage.removeItem('fullname');
                localStorage.removeItem('username');
                // deleteCookie('id');
                // deleteCookie('username');
                // deleteCookie('fullname');
                // deleteCookie('email');
                // deleteCookie('role');
                setTimeout(() => {
                    // window.location.href = '/login';
                    router.push('/login')
                }, 2000)

            })
        }
        console.log({ 'logout': 'true' });
    }



    const [userId, setUserId] = useState<number | null>(null);
    const [token, setToken] = useState<string | null>(null);

    useEffect(() => {
        // Get user ID dan token dari cookies/localStorage
        const id = getCookie('id');
        const key = localStorage.getItem('key');

        if (id) setUserId(Number(id));
        if (key) setToken(key);
    }, []);


    return (
        <nav className="layout-navbar navbar navbar-expand-xl align-items-center bg-navbar-theme" id="layout-navbar">
            <div className="container-xxl">
                <div className="layout-menu-toggle navbar-nav align-items-xl-center me-3 me-xl-0 d-xl-none">
                    <a className="nav-item nav-link px-0 me-xl-4" href="">
                        <i className="bx bx-menu bx-sm"></i>
                    </a>
                </div>
                <div className="navbar-nav-right d-flex align-items-center" id="navbar-collapse">
                    <div className="navbar-nav align-items-center">
                        <div className="nav-item dropdown-style-switcher dropdown me-2 me-xl-0">
                            <a className="nav-link dropdown-toggle hide-arrow" data-bs-toggle="dropdown">
                                <i className={`bx bx-sm ${theme === 'dark' ? 'bx-moon' : 'bx-sun'}`}></i>
                            </a>
                            <ul className="dropdown-menu dropdown-menu-start dropdown-styles">
                                <li>
                                    <a className="dropdown-item" onClick={handleThemeChange} data-theme="light">
                                        <span className="align-middle"><i className="bx bx-sun me-2"></i>Light</span>
                                    </a>
                                </li>
                                <li>
                                    <a className="dropdown-item" onClick={handleThemeChange} data-theme="dark">
                                        <span className="align-middle"><i className="bx bx-moon me-2"></i>Dark</span>
                                    </a>
                                </li>
                                <li>
                                    <a className="dropdown-item" onClick={handleThemeChange} data-theme="system">
                                        <span className="align-middle"><i className="bx bx-sm bx-desktop me-2"></i>System</span>
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <ul className="navbar-nav flex-row align-items-center ms-auto">
                        {/* NOTIFICATION */}
                        <NotificationPopup
                            userId={userId}
                            token={token}
                        />
                        <li className="nav-item navbar-dropdown dropdown-user dropdown">
                            <a className="nav-link dropdown-toggle hide-arrow" href="" data-bs-toggle="dropdown">
                                <div className="avatar avatar-online">
                                    <img src="/assets/img/avatars/1.png" alt="profile" className="rounded-circle" />
                                </div>
                            </a>
                            <ul className="dropdown-menu dropdown-menu-end">
                                <li>
                                    <a className="dropdown-item" href="#">
                                        <div className="d-flex">
                                            <div className="flex-shrink-0 me-3">
                                                <div className="avatar avatar-online">
                                                    <img src="/assets/img/avatars/1.png" alt="profile" className="rounded-circle" />
                                                </div>
                                            </div>
                                            <div className="flex-grow-1">
                                                <span className="fw-medium d-block lh-1">{localStorage.getItem('username')}</span>
                                                <small>{localStorage.getItem('fullname')}</small>
                                            </div>
                                        </div>
                                    </a>
                                </li>
                                <li>
                                    <div className="dropdown-divider"></div>
                                </li>
                                <li>
                                    <Link className="dropdown-item" href="/profile">
                                        <i className="bx bx-user me-2"></i>
                                        <span className="align-middle">My Profile</span>
                                    </Link>
                                </li>
                                {/*<li>*/}
                                {/*    <a className="dropdown-item" href="#">*/}
                                {/*        <i className="bx bx-cog me-2"></i>*/}
                                {/*        <span className="align-middle">Settings</span>*/}
                                {/*    </a>*/}
                                {/*</li>*/}
                                {/*<li>*/}
                                {/*    <a className="dropdown-item" href="#">*/}
                                {/*        <span className="d-flex align-items-center align-middle">*/}
                                {/*          <i className="flex-shrink-0 bx bx-credit-card me-2"></i>*/}
                                {/*          <span className="flex-grow-1 align-middle">Billing</span>*/}
                                {/*          <span className="flex-shrink-0 badge badge-center rounded-pill bg-danger w-px-20 h-px-20">4</span>*/}
                                {/*        </span>*/}
                                {/*    </a>*/}
                                {/*</li>*/}
                                <li>
                                    <div className="dropdown-divider"></div>
                                </li>
                                <li>
                                    <a className="dropdown-item" onClick={logout}>
                                        <i className="bx bx-power-off me-2"></i>
                                        <span className="align-middle">Log Out</span>
                                    </a>
                                </li>
                            </ul>
                        </li>
                    </ul>
                </div>
            </div>
        </nav >
    );
};

export default Navbar;
