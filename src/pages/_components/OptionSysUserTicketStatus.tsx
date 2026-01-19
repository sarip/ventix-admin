
"use client";

import React, { useEffect, useState } from "react";
import { SysUserTicketStatus, InSysUserTicketStatus } from "@/models/SysUserTicketStatus";

interface OptionSysUserTicketStatusProps {
    show?: "name" | "description";
}

const OptionSysUserTicketStatus: React.FC<OptionSysUserTicketStatusProps> = ({
                                                                 show = "name",
                                                             }) => {
    const [status, setStatus] = useState<InSysUserTicketStatus[]>([]);
    const model = new SysUserTicketStatus();

    useEffect(() => {
        model
            .list({ per_page: 1000000 })
            .then((response) => {
                setStatus(response.sys_userticket_status ?? []);
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

export default OptionSysUserTicketStatus;
