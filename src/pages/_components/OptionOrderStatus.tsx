"use client";

import React, { useEffect, useState } from "react";
import { OrderStatus, InOrderStatus } from "@/models/OrderStatus";

interface OptionOrderStatusProps {
    show?: "name" | "display_name" | "description";
    value?: "name" | "display_name" | "description";
}

const OptionOrderStatus: React.FC<OptionOrderStatusProps> = ({
                                                                 value = "name",
                                                                 show = "name",
                                                             }) => {
    const [status, setStatus] = useState<InOrderStatus[]>([]);
    const [loaded, setLoaded] = useState(false);
    const model = new OrderStatus();

    useEffect(() => {
        model
            .list({ per_page: 1000000 })
            .then((response) => {
                setStatus(response.orders_status ?? []);
                setLoaded(true);
            })
            .catch(console.error);
    }, []);

    if (!loaded) {
        return <option value="">Loading...</option>;
    }

    return (
        <>
            {status.map((p) => (
                <option key={p.name} value={p.name.toLowerCase()}>
                    {p.display_name.toUpperCase()}
                </option>
            ))}
        </>
    );
};


export default OptionOrderStatus;
