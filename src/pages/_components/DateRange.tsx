// components/DateRange.tsx
import React from "react";

interface DateRangeProps {
    start?: string | null;
    end?: string | null;
    hideSameDate?: boolean; // kalau true → kalau tanggal sama, hanya tampil 1x tanggal
}

function formatDate(dateString: string | null | undefined) {
    if (!dateString) return null;
    return new Date(dateString).toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
}

function formatTime(dateString: string | null | undefined) {
    if (!dateString) return null;
    return new Date(dateString).toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
    });
}

const DateRange: React.FC<DateRangeProps> = ({ start, end, hideSameDate = true }) => {
    if (!start) return <span>-</span>;

    const startDate = new Date(start);
    const endDate = end ? new Date(end) : null;

    if (!endDate) {
        return (
            <span>
        {formatDate(start)} {formatTime(start)}
      </span>
        );
    }

    const sameDay =
        hideSameDate &&
        startDate.getFullYear() === endDate.getFullYear() &&
        startDate.getMonth() === endDate.getMonth() &&
        startDate.getDate() === endDate.getDate();

    if (sameDay) {
        // contoh: "25 Sep 2025, 00.00 - 02.00"
        return (
            <span>
        {formatDate(start)}, {formatTime(start)} - {formatTime(end)}
      </span>
        );
    }

    return (
        <span>
      {formatDate(start)} {formatTime(start)} - <br />
            {formatDate(end)} {formatTime(end)}
    </span>
    );
};

export default DateRange;
