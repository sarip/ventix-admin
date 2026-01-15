import React, { useState, useEffect, useCallback } from 'react';
import { buildQuery } from '@/lib/FilterDriver';

interface FilterProps {
    onSubmit: (query: any) => void;
}

const Filter: React.FC<FilterProps> = ({ onSubmit }) => {
    const [search, setSearch] = useState<string>('');
    const [sortBy, setSortBy] = useState<string>('created_at:desc');
    const [perPage, setPerPage] = useState<number>(12);
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
        setPerPage(12);
    };

    return (
        <div className="card">
            <div className="card-header d-flex border-top rounded-0 flex-wrap p-3">
                <div className="me-4 pe-4">
                    <label className="form-label">Pencarian</label>
                    <div className="input-group input-group-merge">
                        <span className="input-group-text" id="basic-addon-search31">
                            <i className="bx bx-search"></i>
                        </span>
                        <input
                            type="search"
                            className="form-control"
                            placeholder="Cari..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>
                <div className="d-flex flex-column flex-md-row align-items-start align-items-md-end ms-auto gap-3">
                    <div>
                        <label className="form-label">Urutkan</label>
                        <select className="form-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                            <option value="created_at:desc">Terbaru</option>
                            <option value="created_at:asc">Terlama</option>
                        </select>
                    </div>
                    <div>
                        <label className="form-label">Tampilkan</label>
                        <select className="form-select" value={perPage} onChange={(e) => setPerPage(parseInt(e.target.value))}>
                            <option value="12">12</option>
                            <option value="22">22</option>
                            <option value="52">52</option>
                            <option value="72">72</option>
                            <option value="102">120</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Filter;
