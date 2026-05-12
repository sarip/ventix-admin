type Route = {
    side_menu: boolean;
    path: string;
    title: string;
    tooltip?: string;
    icon?: string;
    endpoint?: string;
    group?: string;
    childrens?: Route[];
    is_superadmin?: boolean,
};

const routes: Route[] = [
    {
        side_menu: true,
        path: "?",
        title: "Main",
    },
    {
        path: '/dashboard',
        side_menu: true,
        tooltip: "Dashboard",
        icon: 'bxs-dashboard',
        title: 'Dashboard',
        is_superadmin: false,
    },
    {
        path: '/commission_analysis',
        side_menu: true,
        tooltip: "Commission Analysis",
        icon: 'bx-money',
        title: 'Commission Analysis',
        is_superadmin: true,
    },


    {
        path: '#',
        side_menu: true,
        tooltip: "Ticket",
        icon: 'bx-calendar-check',
        title: 'Ticket',
        group: 'Users',
        is_superadmin: false,
        childrens: [
            {
                path: '/ticket_analytics',
                side_menu: true,
                tooltip: "Ticket Analytics",
                icon: 'bx-users',
                title: 'Ticket Analytics',
                endpoint: 'api/v1/users',
            },
            {
                path: '/ticket_user',
                side_menu: true,
                tooltip: "Ticket User",
                icon: 'bx-users',
                title: 'Ticket User',
                endpoint: 'api/v1/users',
            },
            {
                path: '/ticket_order',
                side_menu: true,
                tooltip: "Ticket Order",
                icon: 'bx-users',
                title: 'Ticket Order',
                endpoint: 'api/v1/users',
            },
            {
                path: '/ticket_event',
                side_menu: true,
                tooltip: "Ticket Event",
                icon: 'bx-users',
                title: 'Ticket Event',
                endpoint: 'api/v1/users',
            },
        ]
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


    {
        path: '#',
        side_menu: true,
        tooltip: "Event",
        icon: 'bx-calendar-event',
        title: 'Event',
        group: 'Users',
        is_superadmin: false,
        childrens: [
            {
                path: '/event',
                side_menu: true,
                tooltip: "Event",
                icon: 'bx-users',
                title: 'Event',
                endpoint: 'api/v1/users',
            },
            {
                path: '/event_organizer',
                side_menu: true,
                tooltip: "Event Organizer",
                icon: 'bx-users',
                title: 'Event Organizer',
                endpoint: 'api/v1/users',
            },
            {
                path: '/event_status',
                side_menu: true,
                tooltip: "Event Status",
                icon: 'bx-users',
                title: 'Event Status',
                endpoint: 'api/v1/users',
            },
            {
                path: '/event_cat',
                side_menu: true,
                tooltip: "Event Categories",
                icon: 'bx-users',
                title: 'Event Categories',
                endpoint: 'api/v1/users',
                is_superadmin: true,
            },

        ]
    },

    {
        path: '#',
        side_menu: true,
        tooltip: "Facility",
        icon: 'bx-buildings',
        title: 'Facility',
        group: 'Facility',
        is_superadmin: false,
        childrens: [
            {
                path: '/facility',
                side_menu: true,
                tooltip: "Facility Management",
                icon: 'bx-building',
                title: 'Facility Management',
                endpoint: 'api/v1/facilities',
            },
            {
                path: '/facility_booking',
                side_menu: true,
                tooltip: "Facility Booking",
                icon: 'bx-calendar-check',
                title: 'Facility Booking',
                endpoint: 'api/v1/facility_bookings',
            }
        ]
    },


    {

        path: '#',
        side_menu: true,
        tooltip: "User Points",
        icon: 'bx-medal',
        title: 'User Points',
        group: 'Users',
        is_superadmin: true,
        childrens: [
            {
                path: '/user_points',
                side_menu: true,
                tooltip: "User Points",
                title: 'User Points',
                endpoint: 'api/v1/users',
            },
            {
                path: '/userpoint_rules',
                side_menu: true,
                tooltip: "User Point Rules",
                title: 'User Point Rules',
                endpoint: 'api/v1/users',
            },
            {
                path: '/userpoint_status',
                side_menu: true,
                tooltip: "User Point Status",
                title: 'User Point Status',
                endpoint: 'api/v1/users',
            },
        ]
    },
    {
        path: '#',
        side_menu: true,
        tooltip: "User Management",
        icon: 'bx-user-circle',
        title: 'User Management',
        group: 'Users',
        is_superadmin: true,
        childrens: [
            {
                path: '/user',
                side_menu: true,
                tooltip: "Users",
                icon: 'bx-users',
                title: 'Users',
                endpoint: 'api/v1/users',
            },
            // {
            //     path: '/roles',
            //     side_menu: true,
            //     tooltip: "Roles",
            //     icon: 'bx-user',
            //     title: 'Roles',
            //     endpoint: 'api/v1/users',
            // }
        ]
    },
    {

        path: '#',
        side_menu: true,
        tooltip: "System App",
        icon: 'bx-cog',
        title: 'System App',
        group: 'Users',
        is_superadmin: true,
        childrens: [
            {
                path: '/commission_rules',
                side_menu: true,
                tooltip: "Commission Rules",
                title: 'Commission Rules',
                endpoint: 'api/v1/users',
            },
            {
                path: '/taxes',
                side_menu: true,
                tooltip: "Taxes",
                title: 'Taxes',
                endpoint: 'api/v1/users',
            },
            {
                path: '/sys_userpoint_cat',
                side_menu: true,
                tooltip: "User Point Category",
                title: 'User Point Category',
                endpoint: 'api/v1/users',
            },
            {
                path: '/sys_users_apppermissions',
                side_menu: true,
                tooltip: "User App Permission",
                title: 'User App Permission',
                endpoint: 'api/v1/users',
            },
            {
                path: '/sys_users_role',
                side_menu: true,
                tooltip: "User Ticket Status",
                title: 'User Ticket Status',
                endpoint: 'api/v1/users',
            },
        ]
    },
    // {
    //     path: '#',
    //     side_menu: true,
    //     tooltip: "Master2",
    //     icon: 'bx-list-ul',
    //     title: 'Master2',
    //     group: 'master2',
    //     childrens: [
    //         {
    //             path: '/list_2',
    //             side_menu: true,
    //             tooltip: "List",
    //             icon: 'bx-circle',
    //             title: 'List',
    //             endpoint: 'api/v1/list_2',
    //         },
    //         {
    //             path: '/user',
    //             side_menu: true,
    //             tooltip: "List",
    //             icon: 'bx-circle',
    //             title: 'List',
    //             endpoint: 'api/v1/list_2',
    //         },
    //     ]
    // }
];

export default routes;
