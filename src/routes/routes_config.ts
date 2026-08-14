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
        tooltip: "Event",
        icon: 'bx-calendar',
        title: 'Event',
        is_superadmin: false,
    },
    {
        path: '/ticket_user',
        side_menu: true,
        tooltip: "Tiket",
        icon: 'bx-purchase-tag-alt',
        title: 'Tiket',
        is_superadmin: false,
    },
    {
        path: '/ticket_order',
        side_menu: true,
        tooltip: "Pesanan",
        icon: 'bx-receipt',
        title: 'Pesanan',
        is_superadmin: false,
    },
    {
        path: '/customers',
        side_menu: true,
        tooltip: "Pelanggan",
        icon: 'bx-group',
        title: 'Pelanggan',
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
        path: '/certificate/manage',
        side_menu: true,
        tooltip: "Sertifikat",
        icon: 'bx-award',
        title: 'Sertifikat',
        is_superadmin: false,
    },
    {
        path: '/promotions',
        side_menu: true,
        tooltip: "Promosi",
        icon: 'bx-gift',
        title: 'Promosi',
        is_superadmin: false,
    },
    {
        path: '/reports',
        side_menu: true,
        tooltip: "Laporan",
        icon: 'bx-bar-chart-alt-2',
        title: 'Laporan',
        is_superadmin: false,
    },
    {
        path: '/payouts',
        side_menu: true,
        tooltip: "Pencairan Dana",
        icon: 'bx-wallet',
        title: 'Pencairan Dana',
        is_superadmin: false,
    },
    {
        path: '/settings',
        side_menu: true,
        tooltip: "Pengaturan",
        icon: 'bx-cog',
        title: 'Pengaturan',
        is_superadmin: false,
    },
    // Superadmin specific routes
    {
        path: '/commission_analysis',
        side_menu: true,
        tooltip: "Analisis Komisi",
        icon: 'bx-money',
        title: 'Analisis Komisi',
        is_superadmin: true,
    },
    {
        path: '/eo_verification',
        side_menu: true,
        tooltip: "Verifikasi EO & Fasilitas",
        icon: 'bx-list-ol',
        title: 'Verifikasi EO & Fasilitas',
        is_superadmin: true,
    },
    {
        path: '/payout_approval',
        side_menu: true,
        tooltip: "Antrean Tarik Tunai",
        icon: 'bx-money-withdraw',
        title: 'Antrean Tarik Tunai',
        is_superadmin: true,
    },
    {
        path: '/event_external',
        side_menu: true,
        tooltip: "Event Eksternal",
        icon: 'bx-calendar-event',
        title: 'Event Eksternal',
        is_superadmin: true,
    },
];

export default routes;

