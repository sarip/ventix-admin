/**
 * @author Sarip Hidayat <hidayatsarip2210@gmail.com>
 * @copyright Sarip Hidayat 2024
 * @date 12/09/25
 */

// components/SingleDateTimePicker.tsx
import React, { useState, useEffect } from "react";
import DateRangePicker from "react-bootstrap-daterangepicker";
import "bootstrap-daterangepicker/daterangepicker.css";

interface SingleDateTimePickerProps {
    name: string;
    value?: string;
    placeholder?: string;
    parentEl?: string; // id modal atau container untuk positioning
    onChange: (name: string, value: string) => void;
    error?: string;
    label?: string;
}

const SingleDateTimePicker: React.FC<SingleDateTimePickerProps> = ({
                                                                       name,
                                                                       value = "",
                                                                       placeholder = "Select date & time",
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
        const datetime = picker.startDate.format("YYYY-MM-DD HH:mm:ss");
        setSelectedDate(datetime);
        onChange(name, datetime);
    };

    return (
        <div className="mb-3">
            {label && <label className="form-label">{label}</label>}
            <DateRangePicker
                initialSettings={{
                    singleDatePicker: true,
                    showDropdowns: true,
                    timePicker: true,          // aktifkan time picker
                    timePicker24Hour: true,    // format 24 jam
                    autoUpdateInput: false,
                    parentEl: parentEl,
                    locale: {
                        format: "YYYY-MM-DD HH:mm:ss",
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

export default SingleDateTimePicker;
