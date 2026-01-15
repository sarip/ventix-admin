type Route = {
    side_menu: boolean;
    path: string;
    title: string;
    tooltip?: string;
    icon?: string;
    endpoint?: string;
    group?: string;
    childrens?: Route[];
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
    },


    {
        path: '/tenant',
        side_menu: true,
        tooltip: "Tenant",
        icon: 'bxs-dashboard',
        title: 'Tenant',
    },

    {
        path: '#',
        side_menu: true,
        tooltip: "Ticket",
        icon: 'bx-calendar-check',
        title: 'Ticket',
        group: 'Users',
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
        path: '#',
        side_menu: true,
        tooltip: "Event",
        icon: 'bx-calendar-event',
        title: 'Event',
        group: 'Users',
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
        childrens: [
            {
                path: '/user',
                side_menu: true,
                tooltip: "Users",
                icon: 'bx-users',
                title: 'Users',
                endpoint: 'api/v1/users',
            },
            {
                path: '/roles',
                side_menu: true,
                tooltip: "Roles",
                icon: 'bx-user',
                title: 'Roles',
                endpoint: 'api/v1/users',
            }
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
