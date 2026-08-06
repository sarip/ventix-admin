import {STATUS} from "@/constants/status";
import React from "react";

interface StatusProps {
    is_active : "Y" | "N" | string;
}

const StatusBagde: React.FC<StatusProps> = ({is_active}) => {
    const status = STATUS.find(p => p.key === is_active);
    const badgeColor = is_active === "Y" ? "bg-success" : is_active === "N" ? "bg-danger" : (status?.color ?? "bg-secondary");
    
    return (
        <span className={`badge ${badgeColor} d-inline-flex align-items-center gap-1 shadow-xs`}>
            <i className={`bx ${is_active === 'Y' ? 'bx-check-circle' : 'bx-x-circle'} fs-7`}></i>
            {status?.value ?? "UNKNOWN"}
        </span>
    );
}

export default StatusBagde;