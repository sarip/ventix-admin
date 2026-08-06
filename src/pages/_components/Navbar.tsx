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
import NotificationPopup from '@/components/NotificationPopup';
import { getCookie } from 'cookies-next';

const Navbar: React.FC = () => {
    const router = useRouter();
    const [theme, setTheme] = useState<string>('light');
    const [isClient, setIsClient] = useState<boolean>(false);
    const [username, setUsername] = useState<string>('');
    const [fullname, setFullname] = useState<string>('');

    useEffect(() => {
        setIsClient(true);
        const currentTheme = localStorage.getItem('theme') || 'light';
        setTheme(currentTheme);
        document.documentElement.setAttribute('data-theme', currentTheme);
        setUsername(localStorage.getItem('username') || '');
        setFullname(localStorage.getItem('fullname') || '');
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
            router.push('/login');
        } else {
            let key = localStorage.getItem('key');
            let api_url = (process.env.NEXT_PUBLIC_BASE_URL || '') + "logout";
            Axios.get(api_url, {
                headers: {
                    "Content-Type": "application/json",
                    key
                }
            }).then(() => {
                showToast('Logout berhasil, silahkan tunggu ...', 'success');
                localStorage.removeItem('key');
                localStorage.removeItem('fullname');
                localStorage.removeItem('username');
                setTimeout(() => {
                    router.push('/login');
                }, 2000);
            }).catch(() => {
                localStorage.removeItem('key');
                router.push('/login');
            });
        }
    };

    const [userId, setUserId] = useState<number | null>(null);
    const [token, setToken] = useState<string | null>(null);

    useEffect(() => {
        const id = getCookie('id');
        const key = localStorage.getItem('key');
        if (id) setUserId(Number(id));
        if (key) setToken(key);
    }, []);

    return (
        <nav className="layout-navbar navbar navbar-expand-xl align-items-center bg-white border-bottom px-4 py-2" id="layout-navbar" style={{ height: '70px' }}>
            <div className="container-fluid d-flex align-items-center justify-content-between px-0">
                <div className="d-flex align-items-center gap-3">
                    <div className="layout-menu-toggle navbar-nav align-items-xl-center me-3 me-xl-0 d-xl-none">
                        <a className="nav-item nav-link px-0 me-xl-4" href="#" onClick={(e) => e.preventDefault()}>
                            <i className="bx bx-menu bx-sm"></i>
                        </a>
                    </div>
                </div>

                {/* Search Bar in Middle */}
                <div className="d-none d-md-flex align-items-center ms-3">
                    <div className="search-input-pill">
                        <i className="bx bx-search fs-5 text-muted"></i>
                        <input type="text" placeholder="Search events, tickets, customers..." />
                        <span className="badge bg-light text-muted border py-1 px-2" style={{ fontSize: '0.7rem' }}>⌘K</span>
                    </div>
                </div>

                {/* Right Utilities */}
                <div className="navbar-nav-right d-flex align-items-center gap-3 ms-auto" id="navbar-collapse">
                    {/* Dark / Light Mode Switcher */}
                    <div className="nav-item dropdown-style-switcher dropdown">
                        <a className="nav-link dropdown-toggle hide-arrow cursor-pointer" data-bs-toggle="dropdown">
                            <i className={`bx fs-4 ${theme === 'dark' ? 'bx-moon' : 'bx-sun'}`}></i>
                        </a>
                        <ul className="dropdown-menu dropdown-menu-end">
                            <li>
                                <a className="dropdown-item cursor-pointer" onClick={handleThemeChange} data-theme="light">
                                    <span className="align-middle"><i className="bx bx-sun me-2"></i>Light</span>
                                </a>
                            </li>
                            <li>
                                <a className="dropdown-item cursor-pointer" onClick={handleThemeChange} data-theme="dark">
                                    <span className="align-middle"><i className="bx bx-moon me-2"></i>Dark</span>
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Language Selector */}
                    <div className="d-flex align-items-center gap-2 cursor-pointer">
                        <i className="bx bx-globe"></i>
                        <span>ID</span>
                        <span className="text-muted">|</span>
                        <span>EN</span>
                    </div>

                    {/* NOTIFICATION */}
                    <NotificationPopup
                        userId={userId}
                        token={token}
                    />

                    {/* Create Event Quick Button */}
                    {router.pathname === '/dashboard' && (
                        <Link
                            href="/event/create"
                            className="btn btn-primary btn-sm d-flex align-items-center gap-1 px-3 py-2"
                        >
                            <i className="bx bx-plus fs-5"></i>
                            <span>Create Event</span>
                            <i
                                className="bx bx-chevron-down ms-1"
                                style={{ fontSize: '0.8rem' }}
                            ></i>
                        </Link>
                    )}

                    {/* User Profile Menu */}
                    <li className="nav-item navbar-dropdown dropdown-user dropdown list-unstyled">
                        <a className="nav-link dropdown-toggle hide-arrow p-0" href="#" data-bs-toggle="dropdown">
                            <div className="avatar avatar-online">
                                <div className="rounded-circle text-white d-flex align-items-center justify-content-center fw-bold shadow-sm" style={{ width: '38px', height: '38px', background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)', fontSize: '0.95rem' }}>
                                    {username ? username.charAt(0).toUpperCase() : 'A'}
                                </div>
                            </div>
                        </a>
                        <ul className="dropdown-menu dropdown-menu-end shadow-lg border-0">
                            <li>
                                <a className="dropdown-item" href="#">
                                    <div className="d-flex">
                                        <div className="flex-shrink-0 me-3">
                                            <div className="avatar avatar-online">
                                                <div className="rounded-circle text-white d-flex align-items-center justify-content-center fw-bold" style={{ width: '38px', height: '38px', background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)' }}>
                                                    {username ? username.charAt(0).toUpperCase() : 'A'}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex-grow-1">
                                            <span className="fw-bold d-block lh-1">{username || 'Admin'}</span>
                                            <small className="text-muted">{fullname || 'Event Organizer'}</small>
                                        </div>
                                    </div>
                                </a>
                            </li>
                            <li>
                                <div className="dropdown-divider"></div>
                            </li>
                            <li>
                                <Link className="dropdown-item" href="/settings">
                                    <i className="bx bx-user me-2"></i>
                                    <span className="align-middle">Organization Profile</span>
                                </Link>
                            </li>
                            <li>
                                <div className="dropdown-divider"></div>
                            </li>
                            <li>
                                <a className="dropdown-item cursor-pointer text-danger" onClick={logout}>
                                    <i className="bx bx-power-off me-2"></i>
                                    <span className="align-middle">Log Out</span>
                                </a>
                            </li>
                        </ul>
                    </li>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
