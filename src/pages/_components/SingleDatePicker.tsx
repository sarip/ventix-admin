/**
 * @author Sarip Hidayat <hidayatsarip2210@gmail.com>
 * @copyright Sarip Hidayat 2024
 * @date 10/09/25
 */

// components/SingleDatePicker.tsx
import React, { useState, useEffect } from "react";
import DateRangePicker from "react-bootstrap-daterangepicker";
import "bootstrap-daterangepicker/daterangepicker.css";

interface SingleDatePickerProps {
    name: string;
    value?: string;
    placeholder?: string;
    parentEl?: string; // id modal atau container untuk positioning
    onChange: (name: string, value: string) => void;
    error?: string;
    label?: string;
}

const SingleDatePicker: React.FC<SingleDatePickerProps> = ({
                                                               name,
                                                               value = "",
                                                               placeholder = "Select date",
                                                               parentEl,
                                                               onChange,
                                                               error,
                                                               label,
                                                           }) => {
    const [selectedDate, setSelectedDate] = useState(value);

    useEffect(() => {
        setSelectedDate(value);
    }, [value]);

    const handleApply = (_e: any, picker: any) => {
        const date = picker.startDate.format("YYYY-MM-DD");
        setSelectedDate(date);
        onChange(name, date);
    };

    return (
        <div className="mb-3">
            {label && <label className="form-label">{label}</label>}
            <DateRangePicker
                initialSettings={{
                    singleDatePicker: true,
                    showDropdowns: true,
                    autoUpdateInput: false,
                    parentEl: parentEl,
                    locale: {
                        format: "YYYY-MM-DD",
                    },
                }}
                onApply={handleApply}
            >
                <input
                    type="text"
                    name={name}
                    value={selectedDate}
                    placeholder={placeholder}
                    readOnly
                    className={`form-control ${error ? "is-invalid" : ""}`}
                />
            </DateRangePicker>
            {error && <div className="invalid-feedback">{error}</div>}
        </div>
    );
};

export default SingleDatePicker;

