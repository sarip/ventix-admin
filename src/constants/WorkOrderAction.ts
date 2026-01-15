// 📌 types.ts
export type Role =
    | "superadmin"
    | "supervisor"
    | "teknisi"
    | "admin"
    | "tenant";

export type WorkOrderStatus =
    | "scheduled"
    | "dispatched"
    | "en_route"
    | "on_site"
    | "done"
    | "verified"
    | "revision";

export interface StatusConfig {
    next: WorkOrderStatus | null;
    label: string | null;
    className: string | null;
    access: Role[];
}

export interface WorkOrder {
    id: number;
    status: WorkOrderStatus;
}

// 📌 constants.ts
import { Role, StatusConfig } from "./types";

export const ROLE: Record<Uppercase<Role>, Role> = {
    SUPERADMIN: "superadmin",
    SUPERVISOR: "supervisor",
    TEKNISI: "teknisi",
    ADMIN: "admin",
    TENANT: "tenant",
};

export const STATUS_MAP: Record<string, StatusConfig> = {
    scheduled: {
        next: "dispatched",
        label: "Set Dispatched",
        className: "btn btn-info",
        access: [ROLE.SUPERADMIN, ROLE.SUPERVISOR],
    },
    dispatched: {
        next: "en_route",
        label: "Set En Route",
        className: "btn btn-info",
        access: [ROLE.TEKNISI],
    },
    en_route: {
        next: "on_site",
        label: "Set On Site",
        className: "btn btn-warning",
        access: [ROLE.TEKNISI],
    },
    on_site: {
        next: "done",
        label: "Set Done",
        className: "btn btn-success",
        access: [ROLE.TEKNISI],
    },
    done: {
        next: null,
        label: null,
        className: null,
        access: [],
    },
    verified: {
        next: null,
        label: null,
        className: null,
        access: [],
    },
    revision: {
        next: "done",
        label: "Fix Revision",
        className: "btn btn-success",
        access: [ROLE.TEKNISI],
    },
};

export const AFTER_DONE_ACTIONS: StatusConfig[] = [
    {
        label: "Set Verified",
        next: "verified",
        className: "btn btn-success",
        access: [ROLE.SUPERADMIN, ROLE.SUPERVISOR, ROLE.ADMIN],
    },
    // TODO :: DISABLE DULU
    // {
    //     label: "Set Revision",
    //     next: "revision",
    //     className: "btn btn-danger",
    //     access: [ROLE.SUPERADMIN, ROLE.SUPERVISOR, ROLE.ADMIN],
    // },
];
