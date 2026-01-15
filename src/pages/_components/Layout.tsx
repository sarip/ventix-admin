import React, { useEffect, useState, ReactNode, useCallback } from "react";
import dynamic from 'next/dynamic';
import Navbar from './Navbar';
import { getCookie } from 'cookies-next';

// const Navbar = dynamic(() => import('./Navbar'), { ssr: false });
const Sidebar = dynamic(() => import('./Sidebar'), { ssr: false });

interface LayoutProps {
    children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <div className="layout-wrapper layout-content-navbar">
            <div className="layout-container">
                <Sidebar />
                <div className="layout-page">
                    <Navbar />
                    <div className="content-wrapper">
                        <div className="container-xxl flex-grow-1 container-p-y">
                            {children}
                        </div>
                        {/*<footer className="content-footer footer bg-footer-theme">*/}
                        {/*    <div className="container-xxl d-flex flex-wrap justify-content-between py-2 flex-md-row flex-column">*/}
                        {/*        <div className="mb-2 mb-md-0">*/}
                        {/*            © {new Date().getFullYear()}, made with ❤️ by*/}
                        {/*            <a href="#" target="_blank" className="footer-link fw-medium"></a>*/}
                        {/*        </div>*/}
                        {/*        <div className="d-none d-lg-inline-block">*/}
                        {/*            <a href="https://demos.pixinvent.com/frest-html-admin-template/documentation/" target="_blank" className="footer-link me-4">Documentation</a>*/}
                        {/*        </div>*/}
                        {/*    </div>*/}
                        {/*</footer>*/}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Layout;
