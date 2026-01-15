import { FC, useEffect, useState } from "react";
import MenuPage from "./Menu";
import { useRouter } from "next/router";
import $ from "jquery";
import PerfectScrollbar from "perfect-scrollbar";

const Sidebar: FC = () => {
    const [isRtl, setIsRtl] = useState(false);
    const [isHorizontalLayout, setIsHorizontalLayout] = useState(false);
    const { pathname } = useRouter();

    useEffect(() => {
        if (typeof window !== "undefined") {
            setIsRtl(window.Helpers?.isRtl() ?? false);
            setIsHorizontalLayout(
                document.getElementById("layout-menu")?.classList.contains("menu-horizontal") ?? false
            );
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

                if (window.config?.enableMenuLocalStorage && !window.Helpers?.isSmallScreen()) {
                    try {
                        localStorage.setItem(
                            "templateCustomizer-templateName--LayoutCollapsed",
                            String(window.Helpers?.isCollapsed())
                        );

                        const layoutOptions = document.querySelector(".template-customizer-layouts-options");
                        if (layoutOptions) {
                            const layoutState = window.Helpers?.isCollapsed() ? "collapsed" : "expanded";
                            layoutOptions.querySelector(`input[value="${layoutState}"]`)?.click();
                        }
                    } catch (e) {
                        console.error("Error updating menu state:", e);
                    }
                }
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
        <aside id="layout-menu" className="layout-menu menu-vertical menu bg-menu-theme">
            <div className="app-brand demo">
                <a href="/" className="app-brand-link text-center">
                    <span className="app-brand-text demo menu-text fw-bolder">S-Facility</span><br/>
                    &nbsp;&nbsp;<span className="text-danger fw-semibold">Management</span>
                </a>
                <a href="#" className="layout-menu-toggle menu-link text-large ms-auto d-block d-xl-none">
                    <i className="bx bx-chevron-left bx-sm align-middle"></i>
                </a>
            </div>
            <div className="menu-inner-shadow"></div>
            <MenuPage />
        </aside>
    );
};

export default Sidebar;
