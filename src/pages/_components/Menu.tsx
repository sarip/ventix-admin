import React, { useEffect, useState } from "react";
import Link from 'next/link';
import { useRouter } from 'next/router';
import routes from '../../routes/routes_config';
import Auth from '@/models/Auth';
import TitleHead from "@/pages/_components/TitleHead";
import PerfectScrollbar from "perfect-scrollbar";

declare const window: any;


// Definisikan tipe untuk item menu dan permissions
interface MenuItem {
    path: string;
    title: string;
    icon: string;
    childrens?: MenuItem[];
}

interface Permission {
    endpoint: string;
    label: string;
    can_read: string;
}

const Menu: React.FC = () => {
    const [permissions, setPermissions] = useState<Permission[]>([]);
    const [menu, setMenu] = useState<MenuItem[]>([]);
    const [isOpen, setIsOpen] = useState<Record<number, boolean>>({});
    const [title, seTitle] = useState<string>('');
    const { pathname } = useRouter();

    const toggleMenu = (key: number) => {
        setIsOpen((prev) => ({
            ...prev,
            [key]: !prev[key],
        }));
    };

    const isActiveSub = (childrens: MenuItem[]) => {
        return childrens.some((child) => child.path === pathname);
    };

    useEffect(() => {
        const fetchPermissions = async () => {
            try {
                const response = await Auth.whoami();
                localStorage.setItem('fullname', response.fullname);
                localStorage.setItem('username', response.username);
                setPermissions(response.role_actions);
                // setMenu(filterMenuByPermissions(routes, response.role_actions));
                setMenu(filterRoutesByResource(routes, response.source));
            } catch (error) {
                console.error('Failed to fetch permissions:', error);
            }
        };

        fetchPermissions();
    }, []);

    function filterRoutesByResource(routes, resource) {
        // Jika resource = users, tampilkan semua
        if (resource === 'appusers') {
            return routes;
        }

        // Selain users → hapus is_superadmin = true
        return routes
            .filter(route => route.is_superadmin !== true)
            .map(route => {
                // Jika punya children, filter juga
                if (Array.isArray(route.childrens)) {
                    return {
                        ...route,
                        childrens: route.childrens.filter(
                            child => child.is_superadmin !== true
                        )
                    };
                }
                return route;
            });
    }

    useEffect(() => {
        const menuElement = $(".menu-inner")[0];
        if (menuElement) {
            const ps = new PerfectScrollbar(menuElement);

            return () => {
                ps.destroy();
            };
        }
    }, [menu]);

    const filterMenuByPermissions = (menu, permissions: Permission[]): MenuItem[] => {
        const hasReadPermission = (endpoint: string) => {
            const permission = permissions.find((perm) => perm.label === endpoint);
            return permission && permission.can_read === 'Y';
        };

        return menu.filter((item) => {
            if (item.childrens) {
                item.childrens = item.childrens.filter((child) => hasReadPermission(child.endpoint));
                return item.childrens.length > 0;
            }
            return !item.endpoint || hasReadPermission(item.endpoint);
        });
    };

    const isActive = (path: string) => {
        return pathname === path || (path === '#' && pathname.startsWith('/'));
    };

    const closeSidebarIfCollapsed = () => {
        document.documentElement.classList.remove('layout-menu-expanded');
    };



    return (
        <ul className="menu-inner py-1">
            <TitleHead title={title} />
            {menu.map((route, index) => (
                route.path === "?" ? (
                    menu[index + 1] && (
                        <li key={index} className="menu-header small text-uppercase">
                            <span className="menu-header-text" data-i18n={route.title}>{route.title}</span>
                        </li>
                    )
                ) : route.path === "#" && route.childrens && route.childrens.length > 0 ? (
                    <li key={index} className={`menu-item ${isOpen[index] ? 'open' : ''} ${isActiveSub(route.childrens) ? 'active open' : ''}`} onClick={() => toggleMenu(index)}>
                        <a className="menu-link menu-toggle">
                            <i className={`menu-icon tf-icons bx ${route.icon}`}></i>
                            <div data-i18n={route.title}>{route.title}</div>
                        </a>
                        {/*{isOpen[index] && (*/}
                        <ul className="menu-sub">
                            {route.childrens.map((child, childIndex) => (
                                <li key={childIndex} className={`menu-item ${pathname === child.path ? 'active' : ''}`}>
                                    <Link href={child.path} className="menu-link" onClick={() => {
                                        seTitle(child.title);
                                        closeSidebarIfCollapsed();
                                    }}>
                                        <div data-i18n={child.title}>{child.title}</div>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                        {/*)}*/}
                    </li>
                ) : (
                    <li key={index} className={`menu-item ${isActive(route.path) ? 'active' : ''}`}>
                        <Link href={route.path} className="menu-link" onClick={() => {
                            seTitle(route.title);
                            closeSidebarIfCollapsed();
                        }}>

                            <i className={`menu-icon tf-icons bx ${route.icon}`}></i>
                            <div data-i18n={route.title}>{route.title}</div>
                        </Link>
                    </li>
                )
            ))}
        </ul>
    );
};

export default Menu;
