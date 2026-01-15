/**
 * @author Sarip Hidayat <hidayatsarip2210@gmail.com>
 * @copyright Sarip Hidayat 2024
 * @date 12/09/25
 */

import React, { useEffect, useState } from "react";

interface SingleTimeDropdownProps {
    name: string;
    value?: string; // format "HH:mm:ss"
    label?: string;
    placeholder?: string;
    onChange: (name: string, value: string) => void;
    error?: string;
    interval?: number; // interval menit (default 30)
}

const SingleTimeDropdown: React.FC<SingleTimeDropdownProps> = ({
                                                                   name,
                                                                   value = "",
                                                                   label,
                                                                   placeholder = "Select time",
                                                                   onChange,
                                                                   error,
                                                                   interval = 30,
                                                               }) => {
    const [times, setTimes] = useState<string[]>([]);
    const [selectedTime, setSelectedTime] = useState<string>("");

    // 🔹 Generate daftar waktu 00:00–23:59
    useEffect(() => {
        const generated: string[] = [];
        for (let hour = 0; hour < 24; hour++) {
            for (let minute = 0; minute < 60; minute += interval) {
                const hh = hour.toString().padStart(2, "0");
                const mm = minute.toString().padStart(2, "0");
                generated.push(`${hh}:${mm}:00`);
            }
        }
        setTimes(generated);
    }, [interval]);

    // 🔹 Sinkronisasi value dari parent ke state internal
    useEffect(() => {
        setSelectedTime(value || "");
    }, [value]);

    // 🔹 Event onChange
    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const time = e.target.value;
        setSelectedTime(time);
        onChange(name, time);
    };

    return (
        <div className="mb-3">
            {label && <label className="form-label">{label}</label>}
            <select
                name={name}
                value={selectedTime}
                onChange={handleChange}
                className={`form-select ${error ? "is-invalid" : ""}`}
            >
                <option value="">{placeholder}</option>
                {times.map((t) => (
                    <option key={t} value={t}>
                        {t.slice(0, 5)} {/* tampilkan HH:mm */}
                    </option>
                ))}
            </select>
            {error && <div className="invalid-feedback">{error}</div>}
        </div>
    );
};

export default SingleTimeDropdown;
