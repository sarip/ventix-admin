<?php

namespace App\Database\Seeds;

use CodeIgniter\Database\Seeder;

class SysModulesSeeder extends Seeder
{
    public function run()
    {
        $modules = [

            // MAIN

            [
                'parent_id' => null,
                'module_name' => 'Dashboard',
                'module_slug' => 'dashboard',
                'group_name' => 'Main',
                'path' => '/dashboard',
                'icon' => 'bxs-dashboard',
                'endpoint' => null,
                'tooltip' => 'Dashboard',
                'is_sidebar' => 1,
                'is_group' => 0,
                'is_superadmin' => 0,
                'sort_order' => 1,
            ],

            [
                'parent_id' => null,
                'module_name' => 'Commission Analysis',
                'module_slug' => 'commission_analysis',
                'group_name' => 'Main',
                'path' => '/commission_analysis',
                'icon' => 'bx-money',
                'endpoint' => null,
                'tooltip' => 'Commission Analysis',
                'is_sidebar' => 1,
                'is_group' => 0,
                'is_superadmin' => 1,
                'sort_order' => 2,
            ],

            [
                'parent_id' => null,
                'module_name' => 'EO Verification',
                'module_slug' => 'eo_verification',
                'group_name' => 'Main',
                'path' => '/eo_verification',
                'icon' => 'bx-list-ol',
                'endpoint' => null,
                'tooltip' => 'EO Verification',
                'is_sidebar' => 1,
                'is_group' => 0,
                'is_superadmin' => 1,
                'sort_order' => 3,
            ],

            [
                'parent_id' => null,
                'module_name' => 'Event External',
                'module_slug' => 'event_external',
                'group_name' => 'Main',
                'path' => '/event_external',
                'icon' => 'bx-calendar-event',
                'endpoint' => null,
                'tooltip' => 'Event External',
                'is_sidebar' => 1,
                'is_group' => 0,
                'is_superadmin' => 1,
                'sort_order' => 4,
            ],

            // TICKET GROUP

            [
                'parent_id' => null,
                'module_name' => 'Ticket',
                'module_slug' => 'ticket',
                'group_name' => 'Users',
                'path' => '#',
                'icon' => 'bx-calendar-check',
                'endpoint' => null,
                'tooltip' => 'Ticket',
                'is_sidebar' => 1,
                'is_group' => 1,
                'is_superadmin' => 0,
                'sort_order' => 10,
            ],

            // EVENT GROUP

            [
                'parent_id' => null,
                'module_name' => 'Event',
                'module_slug' => 'event',
                'group_name' => 'Users',
                'path' => '#',
                'icon' => 'bx-calendar-event',
                'endpoint' => null,
                'tooltip' => 'Event',
                'is_sidebar' => 1,
                'is_group' => 1,
                'is_superadmin' => 0,
                'sort_order' => 20,
            ],

            // FACILITY GROUP

            [
                'parent_id' => null,
                'module_name' => 'Facility',
                'module_slug' => 'facility',
                'group_name' => 'Facility',
                'path' => '#',
                'icon' => 'bx-buildings',
                'endpoint' => null,
                'tooltip' => 'Facility',
                'is_sidebar' => 1,
                'is_group' => 1,
                'is_superadmin' => 0,
                'sort_order' => 30,
            ],

            // USER POINT GROUP

            [
                'parent_id' => null,
                'module_name' => 'User Points',
                'module_slug' => 'user_points_group',
                'group_name' => 'Users',
                'path' => '#',
                'icon' => 'bx-medal',
                'endpoint' => null,
                'tooltip' => 'User Points',
                'is_sidebar' => 1,
                'is_group' => 1,
                'is_superadmin' => 1,
                'sort_order' => 40,
            ],

            // USER MANAGEMENT GROUP

            [
                'parent_id' => null,
                'module_name' => 'User Management',
                'module_slug' => 'user_management',
                'group_name' => 'Users',
                'path' => '#',
                'icon' => 'bx-user-circle',
                'endpoint' => null,
                'tooltip' => 'User Management',
                'is_sidebar' => 1,
                'is_group' => 1,
                'is_superadmin' => 1,
                'sort_order' => 50,
            ],

            // SYSTEM APP GROUP

            [
                'parent_id' => null,
                'module_name' => 'System App',
                'module_slug' => 'system_app',
                'group_name' => 'Users',
                'path' => '#',
                'icon' => 'bx-cog',
                'endpoint' => null,
                'tooltip' => 'System App',
                'is_sidebar' => 1,
                'is_group' => 1,
                'is_superadmin' => 1,
                'sort_order' => 60,
            ],
        ];

        $this->db
            ->table('sys_modules')
            ->insertBatch($modules);

        // GET PARENT IDS

        $ticketGroup = $this->db
            ->table('sys_modules')
            ->where('module_slug', 'ticket')
            ->get()
            ->getRowArray();

        $eventGroup = $this->db
            ->table('sys_modules')
            ->where('module_slug', 'event')
            ->get()
            ->getRowArray();

        $facilityGroup = $this->db
            ->table('sys_modules')
            ->where('module_slug', 'facility')
            ->get()
            ->getRowArray();

        $userPointGroup = $this->db
            ->table('sys_modules')
            ->where('module_slug', 'user_points_group')
            ->get()
            ->getRowArray();

        $userManagementGroup = $this->db
            ->table('sys_modules')
            ->where('module_slug', 'user_management')
            ->get()
            ->getRowArray();

        $systemAppGroup = $this->db
            ->table('sys_modules')
            ->where('module_slug', 'system_app')
            ->get()
            ->getRowArray();

        $childrens = [

            // TICKET

            [
                'parent_id' => $ticketGroup['id'],
                'module_name' => 'Ticket Analytics',
                'module_slug' => 'ticket_analytics',
                'group_name' => 'Users',
                'path' => '/ticket_analytics',
                'icon' => 'bx-users',
                'endpoint' => 'api/v1/users',
                'tooltip' => 'Ticket Analytics',
                'is_sidebar' => 1,
                'is_group' => 0,
                'is_superadmin' => 0,
                'sort_order' => 11,
            ],

            [
                'parent_id' => $ticketGroup['id'],
                'module_name' => 'Ticket User',
                'module_slug' => 'ticket_user',
                'group_name' => 'Users',
                'path' => '/ticket_user',
                'icon' => 'bx-users',
                'endpoint' => 'api/v1/users',
                'tooltip' => 'Ticket User',
                'is_sidebar' => 1,
                'is_group' => 0,
                'is_superadmin' => 0,
                'sort_order' => 12,
            ],

            [
                'parent_id' => $ticketGroup['id'],
                'module_name' => 'Ticket Order',
                'module_slug' => 'ticket_order',
                'group_name' => 'Users',
                'path' => '/ticket_order',
                'icon' => 'bx-users',
                'endpoint' => 'api/v1/users',
                'tooltip' => 'Ticket Order',
                'is_sidebar' => 1,
                'is_group' => 0,
                'is_superadmin' => 0,
                'sort_order' => 13,
            ],

            [
                'parent_id' => $ticketGroup['id'],
                'module_name' => 'Ticket Event',
                'module_slug' => 'ticket_event',
                'group_name' => 'Users',
                'path' => '/ticket_event',
                'icon' => 'bx-users',
                'endpoint' => 'api/v1/users',
                'tooltip' => 'Ticket Event',
                'is_sidebar' => 1,
                'is_group' => 0,
                'is_superadmin' => 0,
                'sort_order' => 14,
            ],

            // EVENT

            [
                'parent_id' => $eventGroup['id'],
                'module_name' => 'Event',
                'module_slug' => 'event_management',
                'group_name' => 'Users',
                'path' => '/event',
                'icon' => 'bx-users',
                'endpoint' => 'api/v1/users',
                'tooltip' => 'Event',
                'is_sidebar' => 1,
                'is_group' => 0,
                'is_superadmin' => 0,
                'sort_order' => 21,
            ],

            [
                'parent_id' => $eventGroup['id'],
                'module_name' => 'Event Organizer',
                'module_slug' => 'event_organizer',
                'group_name' => 'Users',
                'path' => '/event_organizer',
                'icon' => 'bx-users',
                'endpoint' => 'api/v1/users',
                'tooltip' => 'Event Organizer',
                'is_sidebar' => 1,
                'is_group' => 0,
                'is_superadmin' => 0,
                'sort_order' => 22,
            ],

            [
                'parent_id' => $eventGroup['id'],
                'module_name' => 'Event Status',
                'module_slug' => 'event_status',
                'group_name' => 'Users',
                'path' => '/event_status',
                'icon' => 'bx-users',
                'endpoint' => 'api/v1/users',
                'tooltip' => 'Event Status',
                'is_sidebar' => 1,
                'is_group' => 0,
                'is_superadmin' => 0,
                'sort_order' => 23,
            ],

            [
                'parent_id' => $eventGroup['id'],
                'module_name' => 'Event Categories',
                'module_slug' => 'event_cat',
                'group_name' => 'Users',
                'path' => '/event_cat',
                'icon' => 'bx-users',
                'endpoint' => 'api/v1/users',
                'tooltip' => 'Event Categories',
                'is_sidebar' => 1,
                'is_group' => 0,
                'is_superadmin' => 1,
                'sort_order' => 24,
            ],

            // FACILITY

            [
                'parent_id' => $facilityGroup['id'],
                'module_name' => 'Facility Management',
                'module_slug' => 'facility_management',
                'group_name' => 'Facility',
                'path' => '/facility',
                'icon' => 'bx-building',
                'endpoint' => 'api/v1/facilities',
                'tooltip' => 'Facility Management',
                'is_sidebar' => 1,
                'is_group' => 0,
                'is_superadmin' => 0,
                'sort_order' => 31,
            ],

            [
                'parent_id' => $facilityGroup['id'],
                'module_name' => 'Facility Booking',
                'module_slug' => 'facility_booking',
                'group_name' => 'Facility',
                'path' => '/facility_booking',
                'icon' => 'bx-calendar-check',
                'endpoint' => 'api/v1/facility_bookings',
                'tooltip' => 'Facility Booking',
                'is_sidebar' => 1,
                'is_group' => 0,
                'is_superadmin' => 0,
                'sort_order' => 32,
            ],
        ];

        $this->db
            ->table('sys_modules')
            ->insertBatch($childrens);
    }
}