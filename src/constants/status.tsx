export type PriorityType = "low" | "medium" | "high" | "critical";
export type StatusAlert = "open" | "closed" | "escalated";
export type StatusWorkOrder = 'scheduled' | 'dispatched' | 'en_route' | 'on_site' | 'done' | 'verified' | 'closed';
export type StatusScheduleRun = 'in_progress'
                                // 'not_started'
                                | 'waiting_for_approval'
                                // | 'approval'
                                | 'approve'
                                | 'rejected'
                                | 'completed';
export type TicketStatusType =
    | "new"
    | "open"
    | "assigned"
    | "in_progress"
    | "on_hold"
    | "resolved"
    | "closed"
    | "cancelled";

export type IncidentStatusType =
    | "reported"
    | "investigating"
    | "resolved"
    | "closed";

export type TypeInventoryTransaction =
    | "in"
    | "out"
    | "adjust"
    | "transfer";

export type RefundRequest =
    | "submitted"
    | "approved"
    | "rejected"
    | "paid";



export type ScheduleStatus = "pending" | "in_progress" | "completed" | "overdue";
export type MaintenanceStatusResult = "pending" | "in_progress" | "submitted" | "approved" | "rejected";
interface MaintenanceStatusResultConfig {
    status: MaintenanceStatusResult;
    color: string;
}
interface PriorityConfig {
    status: PriorityType;
    color: string;
}

interface TicketStatusConfig {
    status: TicketStatusType;
    color: string;
}

interface StatusWorkOrderConfig {
    status: StatusWorkOrder;
    color: string;
}

interface ScheduleStatusConfig {
    status: ScheduleStatus;
    color: string;
}

interface StatusScheduleRunConfig {
    status: StatusScheduleRun;
    color: string;
}

interface StatusAlertConfig {
    status: StatusAlert;
    color: string;
}

interface StatusIncidentConfig {
    status: IncidentStatusType;
    color: string;
}

interface InventoryTypeTransactionConfig {
    status: TypeInventoryTransaction;
    color: string;
}

interface RefundRequestConfig {
    status: RefundRequest;
    color: string;
}


export const PRIORITY_STATUS: PriorityConfig[] = [
    { status: "low", color: "bg-success" },
    { status: "medium", color: "bg-warning" },
    { status: "high", color: "bg-danger" },
    { status: "critical", color: "bg-critical" },
];

export const TYPE_INVENTORY_TRANSACTION: InventoryTypeTransactionConfig[] = [
    { status: "in", color: "bg-success" },
    { status: "out", color: "bg-danger" },
    { status: "adjust", color: "bg-warning" },
    { status: "transfer", color: "bg-info" },
];

export const STATUS_REFUND_REQUEST: RefundRequestConfig[] = [
    { status: "submitted", color: "bg-warning" },
    { status: "approved", color: "bg-primary" },
    { status: "rejected", color: "bg-danger" },
    { status: "paid", color: "bg-success" },
];


export const INCIDENT_STATUS: StatusIncidentConfig[] = [
    { status: "reported", color: "bg-info" },
    { status: "investigating", color: "bg-warning" },
    { status: "resolved", color: "bg-success" },
    { status: "closed", color: "bg-secondary" },
];


export const STATUS_ALERT: StatusAlertConfig[] = [
    { status: "open", color: "bg-danger" },
    { status: "closed", color: "bg-success" },
    { status: "escalated", color: "bg-warning" },
];

export const TICKET_STATUS: TicketStatusConfig[] = [
    { status: "new", color: "bg-primary" },
    { status: "open", color: "bg-info" },
    { status: "assigned", color: "bg-secondary" },
    { status: "in_progress", color: "bg-warning" },
    { status: "on_hold", color: "bg-dark" },
    { status: "resolved", color: "bg-success" },
    { status: "closed", color: "bg-secondary" },
    { status: "cancelled", color: "bg-danger" },
];


export const STATUS_WORK_ORDER: StatusWorkOrderConfig[] = [
    { status: "scheduled",  color: "bg-secondary" },   // Jadwal sudah dibuat
    { status: "dispatched", color: "bg-primary" },     // Tim sudah ditugaskan
    { status: "en_route",   color: "bg-info" },        // Tim sedang menuju lokasi
    { status: "on_site",    color: "bg-warning text-white" }, // Tim sudah di lokasi, pekerjaan berlangsung
    { status: "done",       color: "bg-success" },     // Pekerjaan selesai
    { status: "verified",   color: "bg-success" },     // Sudah diverifikasi oleh supervisor
    { status: "closed",     color: "bg-dark" }        // WO ditutup
];

export const STATUS_SCHEDULE: ScheduleStatusConfig[] = [
    { status: "pending",  color: "bg-warning" },   // Jadwal sudah dibuat
    { status: "in_progress", color: "bg-info" },     // Tim sudah ditugaskan
    { status: "completed",   color: "bg-success" },        // Tim sedang menuju lokasi
    { status: "overdue",     color: "bg-danger" }        // WO ditutup
];

export const MAINTENANCE_STATUS_RESULT: MaintenanceStatusResultConfig[] = [
    { status: "pending",  color: "bg-warning" },
    { status: "in_progress",  color: "bg-info" },
    { status: "submitted",  color: "bg-primary" },
    { status: "approved",   color: "bg-success" },
    { status: "rejected",     color: "bg-danger" }
];

export const STATUS_SCHEDULE_RUN: StatusScheduleRunConfig[] = [
    // {
    //     status: 'not_started',
    //     color: 'bg-secondary', // abu-abu
    // },
    {
        status: 'in_progress',
        color: 'bg-primary', // biru
    },
    {
        status: 'waiting_for_approval',
        color: 'bg-warning text-dark', // kuning
    },
    // {
    //     status: 'approval',
    //     color: 'bg-info text-dark', // biru muda
    // },
    {
        status: 'approve',
        color: 'bg-success', // hijau
    },
    {
        status: 'rejected',
        color: 'bg-danger', // merah
    },
    {
        status: 'completed',
        color: 'bg-dark', // hitam/gelap
    },
];


export const STATUS = [
    { key: "Y", value: "ACTIVE", color: "bg-success" },
    { key: "N", value: "INACTIVE", color: "bg-danger" },
];

