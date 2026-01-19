/**
 * Search Bar Component
 * Debounced search input for filtering data
 * @author Sarip Hidayat <hidayatsarip2210@gmail.com>
 * @date 2026-01-17
 */

import React, { useState, useEffect, useCallback } from 'react';

interface SearchBarProps {
    onSearch: (query: string) => void;
    placeholder?: string;
    debounceMs?: number;
    className?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
    onSearch,
    placeholder = 'Search...',
    debounceMs = 500,
    className = ''
}) => {
    const [searchTerm, setSearchTerm] = useState('');

    // Debounced search effect
    useEffect(() => {
        const timer = setTimeout(() => {
            onSearch(searchTerm);
        }, debounceMs);

        return () => clearTimeout(timer);
    }, [searchTerm, debounceMs, onSearch]);

    const handleClear = () => {
        setSearchTerm('');
        onSearch('');
    };

    return (
        <div className={`input-group ${className}`}>
            <span className="input-group-text">
                <i className="bx bx-search"></i>
            </span>
            <input
                type="text"
                className="form-control"
                placeholder={placeholder}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
                <button
                    className="btn btn-outline-secondary"
                    type="button"
                    onClick={handleClear}
                >
                    <i className="bx bx-x"></i>
                </button>
            )}
        </div>
    );
};

export default SearchBar;
