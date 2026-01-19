/**
 * Menu Access Tree Component
 * Hierarchical menu selector for role access
 * @author Sarip Hidayat <hidayatsarip2210@gmail.com>
 * @date 2026-01-19
 */

import React from 'react';

interface MenuItem {
    key: string;
    label: string;
    icon?: string;
    children?: MenuItem[];
}

interface MenuAccessTreeProps {
    menus: MenuItem[];
    selectedMenus: string[];
    onChange: (selectedMenus: string[]) => void;
}

const MenuAccessTree: React.FC<MenuAccessTreeProps> = ({ menus, selectedMenus, onChange }) => {
    const handleToggle = (menuKey: string, hasChildren: boolean) => {
        const isSelected = selectedMenus.includes(menuKey);

        if (hasChildren) {
            // Find all children keys
            const menu = findMenu(menus, menuKey);
            const childKeys = menu ? getAllChildKeys(menu) : [];

            if (isSelected) {
                // Uncheck parent and all children
                onChange(selectedMenus.filter(k => k !== menuKey && !childKeys.includes(k)));
            } else {
                // Check parent and all children
                onChange([...selectedMenus, menuKey, ...childKeys.filter(k => !selectedMenus.includes(k))]);
            }
        } else {
            // Simple toggle for leaf nodes
            if (isSelected) {
                onChange(selectedMenus.filter(k => k !== menuKey));
            } else {
                onChange([...selectedMenus, menuKey]);
            }
        }
    };

    const findMenu = (items: MenuItem[], key: string): MenuItem | null => {
        for (const item of items) {
            if (item.key === key) return item;
            if (item.children) {
                const found = findMenu(item.children, key);
                if (found) return found;
            }
        }
        return null;
    };

    const getAllChildKeys = (menu: MenuItem): string[] => {
        if (!menu.children) return [];
        const keys: string[] = [];
        menu.children.forEach(child => {
            keys.push(child.key);
            if (child.children) {
                keys.push(...getAllChildKeys(child));
            }
        });
        return keys;
    };

    const renderMenu = (items: MenuItem[], level = 0) => {
        return items.map(item => {
            const hasChildren = item.children && item.children.length > 0;
            const isChecked = selectedMenus.includes(item.key);
            const indentClass = level > 0 ? `ps-${level * 4}` : '';

            return (
                <div key={item.key}>
                    <div className={`p-2 border-bottom ${indentClass}`}>
                        <div className="form-check">
                            <input
                                className="form-check-input"
                                type="checkbox"
                                id={`menu-${item.key}`}
                                checked={isChecked}
                                onChange={() => handleToggle(item.key, hasChildren)}
                            />
                            <label className="form-check-label d-flex align-items-center" htmlFor={`menu-${item.key}`}>
                                {item.icon && <i className={`${item.icon} me-2`}></i>}
                                <strong>{item.label}</strong>
                                {hasChildren && (
                                    <span className="badge bg-light text-dark ms-2">
                                        {item.children?.length} items
                                    </span>
                                )}
                            </label>
                        </div>
                    </div>
                    {hasChildren && renderMenu(item.children!, level + 1)}
                </div>
            );
        });
    };

    return (
        <div className="border rounded">
            <div className="p-3 bg-light border-bottom">
                <div className="d-flex justify-content-between align-items-center">
                    <strong>Menu Access Control</strong>
                    <div>
                        <button
                            className="btn btn-sm btn-outline-primary me-2"
                            onClick={() => onChange(menus.flatMap(m => [m.key, ...getAllChildKeys(m)]))}
                        >
                            Select All
                        </button>
                        <button
                            className="btn btn-sm btn-outline-secondary"
                            onClick={() => onChange([])}
                        >
                            Clear All
                        </button>
                    </div>
                </div>
            </div>
            <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
                {renderMenu(menus)}
            </div>
        </div>
    );
};

export default MenuAccessTree;
