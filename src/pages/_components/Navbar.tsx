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
        <nav className="layout-navbar navbar navbar-expand-xl align-items-center bg-white border-bottom px-3 px-md-4 py-0 sticky-top" id="layout-navbar" style={{ height: '64px' }}>
            <div className="w-100 d-flex align-items-center justify-content-between px-0 h-100">
                {/* Left section: Mobile Toggle + Search Bar */}
                <div className="d-flex align-items-center me-auto">
                    <div className="layout-menu-toggle navbar-nav align-items-xl-center d-xl-none me-3">
                        <a className="nav-item nav-link px-0 text-secondary" href="#" onClick={(e) => e.preventDefault()}>
                            <i className="bx bx-menu fs-3"></i>
                        </a>
                    </div>

                    {/* Search Bar */}
                    <div className="d-none d-md-flex align-items-center">
                        <div className="search-input-pill d-flex align-items-center rounded-pill px-3 py-1 bg-light border">
                            <i className="bx bx-search fs-5 text-muted me-2"></i>
                            <input type="text" className="bg-transparent border-0 outline-none me-2 fs-6" placeholder="Search events, tickets..." style={{ outline: 'none' }} />
                            <span className="badge bg-white text-muted border py-1 px-2 rounded-2" style={{ fontSize: '0.65rem' }}>⌘K</span>
                        </div>
                    </div>
                </div>

                {/* Right Utilities pushed completely to the right */}
                <div className="navbar-nav-right d-flex align-items-center gap-3 gap-md-4 ms-auto justify-content-end" id="navbar-collapse">
                    {/* Dark / Light Mode Switcher */}
                    <div className="nav-item dropdown-style-switcher dropdown">
                        <a className="nav-link dropdown-toggle hide-arrow cursor-pointer p-2 rounded-circle text-secondary hover-bg-light" data-bs-toggle="dropdown">
                            <i className={`bx fs-4 ${theme === 'dark' ? 'bx-moon' : 'bx-sun'}`}></i>
                        </a>
                        <ul className="dropdown-menu dropdown-menu-end shadow border-0 mt-2">
                            <li>
                                <a className="dropdown-item cursor-pointer d-flex align-items-center py-2" onClick={handleThemeChange} data-theme="light">
                                    <i className="bx bx-sun me-2 fs-5"></i>Light
                                </a>
                            </li>
                            <li>
                                <a className="dropdown-item cursor-pointer d-flex align-items-center py-2" onClick={handleThemeChange} data-theme="dark">
                                    <i className="bx bx-moon me-2 fs-5"></i>Dark
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Language Selector */}
                    <div className="d-flex align-items-center gap-1 text-secondary px-2 py-1 rounded cursor-pointer fs-7 fw-medium border">
                        <i className="bx bx-globe fs-5"></i>
                        <span>ID</span>
                        <span className="text-muted opacity-50">|</span>
                        <span className="text-muted">EN</span>
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
                            className="btn btn-primary btn-sm d-inline-flex align-items-center gap-1 px-3 py-2 fw-semibold rounded-2 shadow-sm"
                        >
                            <i className="bx bx-plus fs-5"></i>
                            <span>Create Event</span>
                        </Link>
                    )}

                    {/* User Profile Menu */}
                    <div className="nav-item navbar-dropdown dropdown-user dropdown list-unstyled">
                        <a className="nav-link dropdown-toggle hide-arrow p-0 d-flex align-items-center gap-2 cursor-pointer" data-bs-toggle="dropdown">
                            <div className="avatar avatar-online">
                                <div className="rounded-circle text-white d-flex align-items-center justify-content-center fw-bold shadow-sm" style={{ width: '36px', height: '36px', background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)', fontSize: '0.9rem' }}>
                                    {username ? username.charAt(0).toUpperCase() : 'A'}
                                </div>
                            </div>
                            <div className="d-none d-lg-block text-start lh-sm">
                                <span className="fw-semibold d-block fs-7 text-dark">{username || 'Admin'}</span>
                                <small className="text-muted fs-8" style={{ fontSize: '0.75rem' }}>{fullname || 'Event Organizer'}</small>
                            </div>
                        </a>
                        <ul className="dropdown-menu dropdown-menu-end shadow-lg border-0 mt-2 py-2">
                            <li className="px-3 py-2">
                                <div className="d-flex align-items-center">
                                    <div className="flex-shrink-0 me-3">
                                        <div className="avatar avatar-online">
                                            <div className="rounded-circle text-white d-flex align-items-center justify-content-center fw-bold" style={{ width: '40px', height: '40px', background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)' }}>
                                                {username ? username.charAt(0).toUpperCase() : 'A'}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex-grow-1">
                                        <span className="fw-bold d-block fs-6 mb-0 text-dark">{username || 'Admin'}</span>
                                        <small className="text-muted">{fullname || 'Event Organizer'}</small>
                                    </div>
                                </div>
                            </li>
                            <li><hr className="dropdown-divider my-2" /></li>
                            <li>
                                <Link className="dropdown-item d-flex align-items-center py-2" href="/settings">
                                    <i className="bx bx-user me-2 fs-5"></i>
                                    <span>Organization Profile</span>
                                </Link>
                            </li>
                            <li><hr className="dropdown-divider my-2" /></li>
                            <li>
                                <a className="dropdown-item cursor-pointer text-danger d-flex align-items-center py-2" onClick={logout}>
                                    <i className="bx bx-power-off me-2 fs-5"></i>
                                    <span>Log Out</span>
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
