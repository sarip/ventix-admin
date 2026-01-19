import React, { useState, useEffect, useCallback } from 'react';
import { buildQuery } from '@/lib/FilterDriver';

interface FilterProps {
    onSubmit: (query: any) => void;
}

export interface QueryParamsProps {
    search?: string;
    filter?: string;
    sort_by?: string;
    per_page?: number;
    page?: number;
}
const Filter: React.FC<FilterProps> = ({ onSubmit }) => {
    const [search, setSearch] = useState<string>('');
    const [sortBy, setSortBy] = useState<string>('created_at:desc');
    const [perPage, setPerPage] = useState<number>(10);
    const [typing, setTyping] = useState<NodeJS.Timeout | null>(null);

    const getQuery = useCallback(() => {
        const query = {};
        return {
            search,
            filter: buildQuery(query),
            sort_by: sortBy,
            per_page: perPage,
        };
    }, [search, sortBy, perPage]);

    const debouncedSubmit = useCallback(() => {
        if (typing) clearTimeout(typing);
        const newTyping = setTimeout(() => {
            submit();
        }, 1000);
        setTyping(newTyping);
    }, [typing, search, sortBy, perPage]);

    const submit = () => {
        const query = getQuery();
        console.log({"query" : query})
        onSubmit(query);
    };

    useEffect(() => {
        debouncedSubmit();
        return () => {
            if (typing) clearTimeout(typing);
        };
    }, [search, sortBy, perPage]);

    const resetFilter = () => {
        setSearch('');
        setSortBy('created_at:desc');
        setPerPage(10);
    };

    return (
        <div className="card">
            <div className="card-header d-flex border-top rounded-0 flex-wrap p-3">
                <div className="me-4 pe-4">
                    <label className="form-label">Searching</label>
                    <div className="input-group input-group-merge">
                        <span className="input-group-text" id="basic-addon-search31">
                            <i className="bx bx-search"></i>
                        </span>
                        <input
                            type="search"
                            className="form-control"
                            placeholder="Search..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>
                <div className="d-flex flex-column flex-md-row align-items-start align-items-md-end ms-auto gap-3">
                    <div>
                        <label className="form-label">Sort</label>
                        <select className="form-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                            <option value="created_at:desc">Newest</option>
                            <option value="created_at:asc">Oldest</option>
                        </select>
                    </div>
                    <div>
                        <label className="form-label">Show</label>
                        <select className="form-select" value={perPage} onChange={(e) => setPerPage(parseInt(e.target.value))}>
                            <option value="10">10</option>
                            <option value="20">20</option>
                            <option value="50">50</option>
                            <option value="70">70</option>
                            <option value="100">100</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Filter;
