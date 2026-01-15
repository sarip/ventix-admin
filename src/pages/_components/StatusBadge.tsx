import {STATUS} from "@/constants/status";
import React from "react";

interface StatusProps {
    is_active : "Y" | "N" | string;
}


const StatusBagde: React.FC<StatusProps> = ({is_active}) => {
    console.log({'is_active': is_active});
    const status = STATUS.find(p => p.key === is_active);
    return (
        <span className={`badge ${status?.color ?? "bg-secondary"}`}>
      {status?.value ?? "UNKNOWN"}
    </span>
    );
}


export default StatusBagde;