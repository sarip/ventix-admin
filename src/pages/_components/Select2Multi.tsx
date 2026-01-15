import React, { useState, useCallback } from "react";
import { AsyncPaginate } from "react-select-async-paginate";

interface ModernSelectProps {
    name: string;
    placeholder?: string;
    value: any | any[] | null;
    onChange: (val: any | any[] | null) => void;
    fetchData: (query: { search?: string; page: number; per_page: number }) => Promise<{
        data: any[];
        total: number;
    }>;
    labelKey: string;
    valueKey: string;
    isMulti?: boolean;
}

const ModernSelect: React.FC<ModernSelectProps> = ({
                                                       name,
                                                       placeholder,
                                                       value,
                                                       onChange,
                                                       fetchData,
                                                       labelKey,
                                                       valueKey,
                                                       isMulti = true,
                                                   }) => {
    const [perPage] = useState(10);

    const loadOptions = useCallback(
        async (search: string, loadedOptions: any[], { page }: any) => {
            const res = await fetchData({ search, page, per_page: perPage });

            const options = res.data.map((item) => ({
                value: item[valueKey],
                label: item[labelKey],
                full: item,
            }));

            return {
                options,
                hasMore: page * perPage < res.total,
                additional: { page: page + 1 },
            };
        },
        [fetchData, valueKey, labelKey, perPage]
    );

    // 🧠 Mapping value tergantung mode
    const mappedValue = isMulti
        ? (value as any[])?.map((v) => ({
        value: v[valueKey],
        label: v[labelKey],
        full: v,
    })) ?? []
        : value
            ? {
                value: value[valueKey],
                label: value[labelKey],
                full: value,
            }
            : null;

    return (
        <AsyncPaginate
            name={name}
            placeholder={placeholder}
            value={mappedValue}
            loadOptions={loadOptions}
            additional={{ page: 1 }}
            isMulti={isMulti}
            isClearable
            onChange={(selected) => {
                if (isMulti) {
                    const mapped = (selected as any[]).map((s) => s.full);
                    onChange(mapped);
                } else {
                    onChange(selected ? (selected as any).full : null);
                }
            }}
            classNamePrefix="react-select"
        />
    );
};

export default ModernSelect;
