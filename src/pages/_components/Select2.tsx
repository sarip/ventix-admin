import React, { useEffect, useRef, useId } from "react";
import $ from "jquery";
import "select2/dist/css/select2.min.css";
import Swal from "sweetalert2";

interface Select2ComponentProps {
    fetchData: (query: Record<string, any>, spesial_request: boolean) => Promise<any>;
    dropdownParent?: string;
    placeholder: string;
    name: string;
    onChange: (e: any) => void;
    validation?: string;
    selectedId?: number | string;
    dataKey: string;
    showKey: string;
    filterKey?: string;
    id?: string; // optional
    disabled?: boolean
}

const Select2Component: React.FC<Select2ComponentProps> = ({
                                                               fetchData,
                                                               dropdownParent = "",
                                                               placeholder,
                                                               name,
                                                               onChange,
                                                               validation,
                                                               selectedId,
                                                               dataKey,
                                                               showKey,
                                                               filterKey = "name",
                                                               id="id",
                                                               disabled = false
                                                           }) => {
    const selectRef = useRef<HTMLSelectElement>(null);
    const autoId = useId(); // ✅ generate unique ID per component

    useEffect(() => {
        if (!selectRef.current) return;

        const $select = $(selectRef.current);

        // 🧹 destroy instance lama sebelum buat baru
        if ($select.data("select2")) {
            $select.select2("destroy");
        }

        const select2Options = {
            placeholder,
            allowClear: true,
            dropdownParent: dropdownParent ? $(dropdownParent) : undefined,
            ajax: {
                transport: async (params: any, success: any, failure: any) => {
                    try {
                        const term = params.data.term || "";
                        const page = params.data.page || 1;

                        const filter: Record<string, any> = {
                            search: term,
                            per_page: 10,
                            page,
                        };

                        if (filterKey) filter.filter = filterKey;

                        const data = await fetchData(filter, true);
                        const results = (Array.isArray(data[dataKey]) ? data[dataKey] : []).map(
                            (item: any) => ({
                                id: item[id],
                                text: item[showKey],
                            })
                        );
                        console.log({'results': results});

                        success({
                            results,
                            pagination: {
                                more: data.pagination?.current_page < data.pagination?.page_count,
                            },
                        });
                    } catch (err) {
                        failure();
                        Swal.fire("Error", "Failed to load options", "error");
                    }
                },
                delay: 250,
            },
        };

        // 🧩 Init baru Select2
        $select
            .select2(select2Options)
            .on("select2:select", (e: any) => {
                const selected = e.params.data;
                console.log({'selected' : selected})
                onChange({ target: { name, value: selected.id } });
            })
            .on("select2:clear", () => {
                onChange({ target: { name, value: "" } });
            });

        // 🧭 Load selected item jika ada
        if (selectedId) {
            const option = new Option("Loading...", selectedId.toString(), true, true);
            $select.append(option).trigger("change");

            fetchData({ filter: `${id}:${selectedId}` }, true)
                .then((res) => {
                    const items = res[dataKey] || [];
                    const found = items.find((x: any) => x[id] == selectedId);
                    console.log({'found' : found})
                    if (found) {
                        const newOption = new Option(found[showKey], found[id].toString(), true, true);
                        $select.empty().append(newOption).trigger("change");
                    }
                })
                .catch(() => {});
        }

        // ✅ Style error jika ada
        const $container = $select.data("select2").$container;
        $container.find(".select2-selection--single").css({
            borderColor: validation ? "#dc3545" : "",
        });

        // 🧹 Cleanup setiap unmount
        return () => {
            if ($select.data("select2")) {
                $select.select2("destroy");
            }
        };
    }, [fetchData, dropdownParent, placeholder, selectedId, validation]);

    return (
        <select
            disabled={disabled}
            id={autoId}
            ref={selectRef}
            name={name}
            className={`form-select ${validation ? "is-invalid" : ""}`}
        >
            <option value="">{placeholder}</option>
        </select>
    );
};

export default Select2Component;
