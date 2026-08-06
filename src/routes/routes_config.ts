type Route = {
    side_menu: boolean;
    path: string;
    title: string;
    tooltip?: string;
    icon?: string;
    endpoint?: string;
    group?: string;
    childrens?: Route[];
    is_superadmin?: boolean;
};

const routes: Route[] = [
    {
        path: '/dashboard',
        side_menu: true,
        tooltip: "Dashboard",
        icon: 'bx-grid-alt',
        title: 'Dashboard',
        is_superadmin: false,
    },
    {
        path: '/event',
        side_menu: true,
        tooltip: "Events",
        icon: 'bx-calendar',
        title: 'Events',
        is_superadmin: false,
    },
    {
        path: '/ticket_user',
        side_menu: true,
        tooltip: "Tickets",
        icon: 'bx-purchase-tag-alt',
        title: 'Tickets',
        is_superadmin: false,
    },
    {
        path: '/ticket_order',
        side_menu: true,
        tooltip: "Orders",
        icon: 'bx-receipt',
        title: 'Orders',
        is_superadmin: false,
    },
    {
        path: '/customers',
        side_menu: true,
        tooltip: "Customers",
        icon: 'bx-group',
        title: 'Customers',
        is_superadmin: false,
    },
    {
        path: '/ticket_event',
        side_menu: true,
        tooltip: "Check-in",
        icon: 'bx-qr-scan',
        title: 'Check-in',
        is_superadmin: false,
    },
    {
        path: '/promotions',
        side_menu: true,
        tooltip: "Promotions",
        icon: 'bx-offer',
        title: 'Promotions',
        is_superadmin: false,
    },
    {
        path: '/reports',
        side_menu: true,
        tooltip: "Reports",
        icon: 'bx-bar-chart-alt-2',
        title: 'Reports',
        is_superadmin: false,
    },
    {
        path: '/payouts',
        side_menu: true,
        tooltip: "Payouts",
        icon: 'bx-wallet',
        title: 'Payouts',
        is_superadmin: false,
    },
    {
        path: '/settings',
        side_menu: true,
        tooltip: "Settings",
        icon: 'bx-cog',
        title: 'Settings',
        is_superadmin: false,
    },
    // Superadmin specific routes
    {
        path: '/commission_analysis',
        side_menu: true,
        tooltip: "Commission Analysis",
        icon: 'bx-money',
        title: 'Commission Analysis',
        is_superadmin: true,
    },
    {
        path: '/eo_verification',
        side_menu: true,
        tooltip: "EO Verification",
        icon: 'bx-list-ol',
        title: 'EO Verification',
        is_superadmin: true,
    },
    {
        path: '/event_external',
        side_menu: true,
        tooltip: "Event External",
        icon: 'bx-calendar-event',
        title: 'Event External',
        is_superadmin: true,
    },
];

export default routes;

