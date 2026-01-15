"use client";

import React, { useEffect, useState } from "react";
import { EventStatus, InEventStatus } from "@/models/EventStatus";

interface OptionEventStatusProps {
    show?: "name" | "description";
}

const OptionEventStatus: React.FC<OptionEventStatusProps> = ({
                                                                 show = "name",
                                                             }) => {
    const [status, setStatus] = useState<InEventStatus[]>([]);
    const model = new EventStatus();

    useEffect(() => {
        model
            .list({ per_page: 1000000 })
            .then((response) => {
                setStatus(response.events_status ?? []);
            })
            .catch(console.error);
    }, []);

    return (
        <>
            {status.map((p) => (
                <option key={p.name} value={p.name}>
                    {p[show].toUpperCase()}
                </option>
            ))}
        </>
    );
};

export default OptionEventStatus;
