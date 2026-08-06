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
        <aside id="layout-menu" className="layout-menu menu-vertical menu bg-menu-theme shadow-none border-end d-flex flex-column justify-content-between">
            <div>
                {/* Brand Logo Header */}
                <div className="app-brand demo py-3 px-4 d-flex align-items-center justify-content-between mb-2">
                    <Link href="/dashboard" className="app-brand-link d-flex align-items-center gap-2 text-decoration-none">
                        <div className="brand-logo-icon">
                            <span style={{ fontSize: '1.4rem', fontWeight: '900' }}>V</span>
                        </div>
                        <span className="brand-logo-text">VEENTIX</span>
                    </Link>
                    <a href="#" className="layout-menu-toggle menu-link text-large ms-auto d-block d-xl-none">
                        <i className="bx bx-chevron-left bx-sm align-middle"></i>
                    </a>
                </div>

                {/* Sidebar Navigation */}
                <MenuPage />
            </div>

            {/* Bottom Upgrade Card & User Profile */}
            <div className="pb-3 px-2">
                {/* Upgrade Banner */}
                <div className="sidebar-upgrade-card mb-3 text-start">
                    <div className="d-flex align-items-center gap-2 mb-1" style={{ color: '#6366f1', fontWeight: '700', fontSize: '0.85rem' }}>
                        <i className="bx bx-bolt-circle fs-5"></i>
                        <span>Upgrade to Veentix Pro</span>
                    </div>
                    <p className="text-muted small mb-2" style={{ fontSize: '0.75rem', lineHeight: '1.3' }}>
                        Unlock more powerful features and grow your events.
                    </p>
                    <button className="btn btn-sm btn-primary w-100 py-1 d-flex align-items-center justify-content-center gap-1" style={{ fontSize: '0.78rem', borderRadius: '8px' }}>
                        Upgrade Now <i className="bx bx-right-arrow-alt fs-6"></i>
                    </button>
                </div>

                {/* Profile Footer */}
                <div className="d-flex align-items-center gap-2 px-3 py-2 rounded-3 border bg-white shadow-sm cursor-pointer">
                    <div className="avatar avatar-sm rounded-circle text-white d-flex align-items-center justify-content-center fw-bold" style={{ width: '36px', height: '36px', background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)', fontSize: '0.9rem' }}>
                        {username ? username.charAt(0).toUpperCase() : 'A'}
                    </div>
                    <div className="d-flex flex-column flex-grow-1 overflow-hidden" style={{ minWidth: 0 }}>
                        <span className="fw-bold text-truncate" style={{ fontSize: '0.85rem', color: '#0f172a' }}>{username}</span>
                        <span className="text-muted text-truncate" style={{ fontSize: '0.72rem' }}>Event Organizer</span>
                    </div>
                    <i className="bx bx-chevron-down text-muted fs-5 ms-auto"></i>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;

