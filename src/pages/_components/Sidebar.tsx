import { FC, useEffect, useState } from "react";
import MenuPage from "./Menu";
import { useRouter } from "next/router";
import $ from "jquery";
import PerfectScrollbar from "perfect-scrollbar";
import Link from "next/link";

const Sidebar: FC = () => {
    const [isRtl, setIsRtl] = useState(false);
    const [isHorizontalLayout, setIsHorizontalLayout] = useState(false);
    const { pathname } = useRouter();
    const [username, setUsername] = useState("Admin Veentix");
    const [fullname, setFullname] = useState("Event Organizer");

    useEffect(() => {
        if (typeof window !== "undefined") {
            setIsRtl(window.Helpers?.isRtl() ?? false);
            setIsHorizontalLayout(
                document.getElementById("layout-menu")?.classList.contains("menu-horizontal") ?? false
            );
            const savedFullname = localStorage.getItem('fullname');
            const savedUsername = localStorage.getItem('username');
            if (savedUsername) setUsername(savedUsername);
            if (savedFullname) setFullname(savedFullname);
        }
    }, []);

    useEffect(() => {
        setTimeout(() => {
            window.Helpers?.initCustomOptionCheck();
        }, 1000);

        const menuElement = document.querySelectorAll("#layout-menu");
        menuElement.forEach((element) => {
            const menuInstance = new Menu(element, {
                orientation: isHorizontalLayout ? "horizontal" : "vertical",
                closeChildren: isHorizontalLayout,
                showDropdownOnHover:
                    localStorage.getItem("templateCustomizer-templateName--ShowDropdownOnHover") === "true" ||
                    window.templateCustomizer?.settings.defaultShowDropdownOnHover ||
                    true,
            });
            window.Helpers.scrollToActive(false);
            window.Helpers.mainMenu = menuInstance;
        });

        const menuTogglers = document.querySelectorAll(".layout-menu-toggle");
        menuTogglers.forEach((item) => {
            item.addEventListener("click", (event) => {
                event.preventDefault();
                window.Helpers?.toggleCollapsed();
            });
        });
    }, [isHorizontalLayout]);

    useEffect(() => {
        const menuElement = $(".menu-inner")[0];
        if (menuElement) {
            const ps = new PerfectScrollbar(menuElement);
            return () => ps.destroy();
        }
    }, [pathname]);

    return (
        <aside id="layout-menu" className="layout-menu menu-vertical menu bg-menu-theme shadow-none border-end">
            {/* Brand Logo Header */}
            <div className="app-brand demo py-3 px-4 d-flex align-items-center justify-content-between mb-1">
                <Link href="/dashboard" className="app-brand-link d-flex align-items-center gap-2 text-decoration-none">
                    <img src="/assets/img/favicon/favicon.ico" alt="VEENTIX Logo" width={45} height={45} style={{ objectFit: 'contain' }} />
                    <span className="brand-logo-text ms-1" style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '2px', fontFamily: "'Outfit', 'Montserrat', sans-serif", textTransform: 'uppercase' }}>VEENTIX</span>
                </Link>
                <a href="#" className="layout-menu-toggle menu-link text-large ms-auto d-block d-xl-none">
                    <i className="bx bx-chevron-left bx-sm align-middle"></i>
                </a>
            </div>

            {/* Sidebar Navigation */}
            <MenuPage />

            {/* Compact Bottom Upgrade Card & User Profile directly inside scrollable flow */}
            <div className="px-3 pt-2 pb-3 border-top mt-2">
                {/* Compact Upgrade Banner */}
                <div className="rounded-3 p-2 text-start mb-2" style={{ background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.08) 0%, rgba(79, 70, 229, 0.12) 100%)', border: '1px solid rgba(99, 102, 241, 0.2)' }}>
                    <div className="d-flex align-items-center gap-1.5 mb-1" style={{ color: '#4f46e5', fontWeight: '700', fontSize: '0.78rem' }}>
                        <i className="bx bx-bolt-circle fs-6"></i>
                        <span>Veentix Pro</span>
                    </div>
                    <p className="text-muted mb-1.5" style={{ fontSize: '0.7rem', lineHeight: '1.25' }}>
                        Tingkatkan performa event.
                    </p>
                    <button className="btn btn-sm btn-primary w-100 py-1 fw-semibold d-flex align-items-center justify-content-center gap-1" style={{ fontSize: '0.72rem', borderRadius: '5px' }}>
                        Tingkatkan Sekarang <i className="bx bx-right-arrow-alt fs-6"></i>
                    </button>
                </div>

                {/* Compact User Profile */}
                {/* <div className="d-flex align-items-center gap-2 p-1.5 rounded-3 border bg-white shadow-sm cursor-pointer hover-bg-light transition-all">
                    <div className="avatar avatar-sm rounded-circle text-white d-flex align-items-center justify-content-center fw-bold flex-shrink-0" style={{ width: '30px', height: '30px', background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)', fontSize: '0.8rem' }}>
                        {username ? username.charAt(0).toUpperCase() : 'A'}
                    </div>
                    <div className="d-flex flex-column flex-grow-1 overflow-hidden" style={{ minWidth: 0 }}>
                        <span className="fw-semibold text-truncate text-dark" style={{ fontSize: '0.78rem' }}>{username}</span>
                        <small className="text-muted text-truncate" style={{ fontSize: '0.68rem' }}>{fullname || 'Event Organizer'}</small>
                    </div>
                    <i className="bx bx-dots-vertical-rounded text-muted fs-6 flex-shrink-0"></i>
                </div> */}
            </div>
        </aside>
    );
};

export default Sidebar;

