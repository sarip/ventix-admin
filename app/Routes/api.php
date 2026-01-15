<?php

namespace Config;

$routes = Services::routes(true);

// Login and Authentication

$routes->get('items', 'Home::coba');
// API V1
$routes->group('api/v1', ['namespace' => 'App\\Controllers\\Api'], function ($routes) {

    $routes->options('(:any)', 'ApiController::options');

    // API TOKEN AUTHENTICATION
    $routes->get('validate_token', 'AuthController::validateToken', ['filter' => 'tokenFilter']);


    // ADMINISTRATOR AUTHENTICATION
    $routes->post('login', 'AuthController::login');
    $routes->get('logout', 'AuthController::logout', ['filter' => 'tokenFilter']);
    $routes->get('whoami', 'AuthController::whoami', ['filter' => 'tokenFilter']);

    $routes->get('test', 'TestController::test', ['filter' => 'tokenFilter']);

    $routes->put('password', 'AuthController::updatePassword', ['filter' => 'tokenFilter']);

    $routes->get('users', 'UserController::index', ['filter' => 'PermissionFilter']);
    $routes->get('users-lists', 'UserController::lists', ['filter' => 'PermissionFilter']);
    $routes->post('user', 'UserController::create', ['filter' => 'PermissionFilter']);
    $routes->put('user/(:num)', 'UserController::update/$1', ['filter' => 'PermissionFilter']);
    $routes->delete('user/(:num)', 'UserController::delete/$1', ['filter' => 'PermissionFilter']);


    $routes->get('actions', 'ActionController::index', ['filter' => 'PermissionFilter']);
    $routes->post('action', 'ActionController::create', ['filter' => 'PermissionFilter']);
    $routes->put('action/(:num)', 'ActionController::update/$1', ['filter' => 'PermissionFilter']);
    $routes->delete('action/(:num)', 'ActionController::delete/$1', ['filter' => 'PermissionFilter']);

    $routes->get('actions/scope', 'ActionController::scope', ['filter' => 'PermissionFilter']);

    $routes->get('user_logs', 'UserLogController::index', ['filter' => 'PermissionFilter']);
    $routes->post('userlog', 'UserLogController::create', ['filter' => 'PermissionFilter']);
    $routes->put('userlog/(:num)', 'UserLogController::update/$1', ['filter' => 'PermissionFilter']);
    $routes->delete('userlog/(:num)', 'UserLogController::delete/$1', ['filter' => 'PermissionFilter']);

    $routes->get('role_actions', 'RoleActionController::index', ['filter' => 'PermissionFilter']);
    $routes->post('roleaction', 'RoleActionController::create', ['filter' => 'PermissionFilter']);
    $routes->put('roleaction/(:num)', 'RoleActionController::update/$1', ['filter' => 'PermissionFilter']);
    $routes->delete('roleaction/(:num)', 'RoleActionController::delete/$1', ['filter' => 'PermissionFilter']);
    $routes->delete('roleaction/truncate/(:num)', 'RoleActionController::truncate/$1', ['filter' => 'PermissionFilter']);

    $routes->get('roles', 'RoleController::index', ['filter' => 'PermissionFilter']);
    $routes->post('role', 'RoleController::create', ['filter' => 'PermissionFilter']);
    $routes->put('role/(:num)', 'RoleController::update/$1', ['filter' => 'PermissionFilter']);
    $routes->delete('role/(:num)', 'RoleController::delete/$1', ['filter' => 'PermissionFilter']);


    $routes->get('events_cat', 'EventsCatController::index', ['filter' => 'PermissionFilter']);
    $routes->post('eventscat', 'EventsCatController::create', ['filter' => 'PermissionFilter']);
    $routes->put('eventscat/(:any)', 'EventsCatController::update/$1', ['filter' => 'PermissionFilter']);
    $routes->delete('eventscat/(:any)', 'EventsCatController::delete/$1', ['filter' => 'PermissionFilter']);

    $routes->get('events_status', 'EventsStatuController::index', ['filter' => 'PermissionFilter']);
    $routes->post('eventsstatu', 'EventsStatuController::create', ['filter' => 'PermissionFilter']);
    $routes->put('eventsstatu/(:any)', 'EventsStatuController::update/$1', ['filter' => 'PermissionFilter']);
    $routes->delete('eventsstatu/(:any)', 'EventsStatuController::delete/$1', ['filter' => 'PermissionFilter']);

    $routes->get('events_organizer', 'EventsOrganizerController::index', ['filter' => 'PermissionFilter']);
    $routes->post('eventsorganizer', 'EventsOrganizerController::create', ['filter' => 'PermissionFilter']);
    $routes->post('eventsorganizer/(:num)', 'EventsOrganizerController::update/$1', ['filter' => 'PermissionFilter']);
    $routes->delete('eventsorganizer/(:num)', 'EventsOrganizerController::delete/$1', ['filter' => 'PermissionFilter']);

    $routes->get('events', 'EventController::index', ['filter' => 'PermissionFilter']);
    $routes->post('event', 'EventController::create', ['filter' => 'PermissionFilter']);
    $routes->post('event/saveAll', 'EventController::saveAll', ['filter' => 'PermissionFilter']);
    $routes->put('event/(:num)', 'EventController::update/$1', ['filter' => 'PermissionFilter']);
    $routes->delete('event/(:num)', 'EventController::delete/$1', ['filter' => 'PermissionFilter']);

    $routes->get('events_agendas', 'EventsAgendaController::index', ['filter' => 'PermissionFilter']);
    $routes->post('eventsagenda', 'EventsAgendaController::create', ['filter' => 'PermissionFilter']);
    $routes->put('eventsagenda/(:num)', 'EventsAgendaController::update/$1', ['filter' => 'PermissionFilter']);
    $routes->delete('eventsagenda/(:num)', 'EventsAgendaController::delete/$1', ['filter' => 'PermissionFilter']);

    $routes->get('user_tickets', 'UserTicketController::index', ['filter' => 'PermissionFilter']);
    $routes->post('userticket', 'UserTicketController::create', ['filter' => 'PermissionFilter']);
    $routes->put('userticket/(:num)', 'UserTicketController::update/$1', ['filter' => 'PermissionFilter']);
    $routes->delete('userticket/(:num)', 'UserTicketController::delete/$1', ['filter' => 'PermissionFilter']);

    $routes->get('event_ticket', 'EventTicketController::index', ['filter' => 'PermissionFilter']);
    $routes->post('eventticket', 'EventTicketController::create', ['filter' => 'PermissionFilter']);
    $routes->put('eventticket/(:num)', 'EventTicketController::update/$1', ['filter' => 'PermissionFilter']);
    $routes->delete('eventticket/(:num)', 'EventTicketController::delete/$1', ['filter' => 'PermissionFilter']);

    $routes->get('sys_users_role', 'SysUsersRoleController::index', ['filter' => 'PermissionFilter']);
    $routes->post('sysusersrole', 'SysUsersRoleController::create', ['filter' => 'PermissionFilter']);
    $routes->put('sysusersrole/(:num)', 'SysUsersRoleController::update/$1', ['filter' => 'PermissionFilter']);
    $routes->delete('sysusersrole/(:num)', 'SysUsersRoleController::delete/$1', ['filter' => 'PermissionFilter']);

    $routes->get('sys_users_apppermissions', 'SysUsersApppermissionController::index', ['filter' => 'PermissionFilter']);
    $routes->post('sysusersapppermission', 'SysUsersApppermissionController::create', ['filter' => 'PermissionFilter']);
    $routes->put('sysusersapppermission/(:num)', 'SysUsersApppermissionController::update/$1', ['filter' => 'PermissionFilter']);
    $routes->delete('sysusersapppermission/(:num)', 'SysUsersApppermissionController::delete/$1', ['filter' => 'PermissionFilter']);

    $routes->get('sys_users_role_permission', 'SysUsersRolePermissionController::index', ['filter' => 'PermissionFilter']);
    $routes->post('sysusersrolepermission', 'SysUsersRolePermissionController::create', ['filter' => 'PermissionFilter']);
    $routes->put('sysusersrolepermission/(:num)', 'SysUsersRolePermissionController::update/$1', ['filter' => 'PermissionFilter']);
    $routes->delete('sysusersrolepermission/(:num)', 'SysUsersRolePermissionController::delete/$1', ['filter' => 'PermissionFilter']);

    $routes->get('sys_userticket_status', 'SysUserticketStatuController::index', ['filter' => 'PermissionFilter']);
    $routes->post('sysuserticketstatu', 'SysUserticketStatuController::create', ['filter' => 'PermissionFilter']);
    $routes->put('sysuserticketstatu/(:num)', 'SysUserticketStatuController::update/$1', ['filter' => 'PermissionFilter']);
    $routes->delete('sysuserticketstatu/(:num)', 'SysUserticketStatuController::delete/$1', ['filter' => 'PermissionFilter']);

    $routes->get('sys_userpoint_cat', 'SysUserpointCatController::index', ['filter' => 'PermissionFilter']);
    $routes->post('sysuserpointcat', 'SysUserpointCatController::create', ['filter' => 'PermissionFilter']);
    $routes->put('sysuserpointcat/(:num)', 'SysUserpointCatController::update/$1', ['filter' => 'PermissionFilter']);
    $routes->delete('sysuserpointcat/(:num)', 'SysUserpointCatController::delete/$1', ['filter' => 'PermissionFilter']);

    $routes->get('userpoint_status', 'UserpointStatuController::index', ['filter' => 'PermissionFilter']);
    $routes->post('userpointstatu', 'UserpointStatuController::create', ['filter' => 'PermissionFilter']);
    $routes->put('userpointstatu/(:num)', 'UserpointStatuController::update/$1', ['filter' => 'PermissionFilter']);
    $routes->delete('userpointstatu/(:num)', 'UserpointStatuController::delete/$1', ['filter' => 'PermissionFilter']);

    $routes->get('users_status', 'UsersStatuController::index', ['filter' => 'PermissionFilter']);
    $routes->post('usersstatu', 'UsersStatuController::create', ['filter' => 'PermissionFilter']);
    $routes->put('usersstatu/(:num)', 'UsersStatuController::update/$1', ['filter' => 'PermissionFilter']);
    $routes->delete('usersstatu/(:num)', 'UsersStatuController::delete/$1', ['filter' => 'PermissionFilter']);

    $routes->get('orders', 'OrderController::index', ['filter' => 'PermissionFilter']);
    $routes->post('order', 'OrderController::create', ['filter' => 'PermissionFilter']);
    $routes->put('order/(:num)', 'OrderController::update/$1', ['filter' => 'PermissionFilter']);
    $routes->delete('order/(:num)', 'OrderController::delete/$1', ['filter' => 'PermissionFilter']);

    $routes->get('facilities', 'FacilitieController::index', ['filter' => 'PermissionFilter']);
    $routes->post('facilitie', 'FacilitieController::create', ['filter' => 'PermissionFilter']);
    $routes->put('facilitie/(:num)', 'FacilitieController::update/$1', ['filter' => 'PermissionFilter']);
    $routes->delete('facilitie/(:num)', 'FacilitieController::delete/$1', ['filter' => 'PermissionFilter']);

    $routes->get('facility_bookings', 'FacilityBookingController::index', ['filter' => 'PermissionFilter']);
    $routes->post('facilitybooking', 'FacilityBookingController::create', ['filter' => 'PermissionFilter']);
    $routes->put('facilitybooking/(:num)', 'FacilityBookingController::update/$1', ['filter' => 'PermissionFilter']);
    $routes->delete('facilitybooking/(:num)', 'FacilityBookingController::delete/$1', ['filter' => 'PermissionFilter']);

    $routes->get('facilitybooking_status', 'FacilitybookingStatuController::index', ['filter' => 'PermissionFilter']);
    $routes->post('facilitybookingstatu', 'FacilitybookingStatuController::create', ['filter' => 'PermissionFilter']);
    $routes->put('facilitybookingstatu/(:num)', 'FacilitybookingStatuController::update/$1', ['filter' => 'PermissionFilter']);
    $routes->delete('facilitybookingstatu/(:num)', 'FacilitybookingStatuController::delete/$1', ['filter' => 'PermissionFilter']);

    $routes->get('users', 'UserController::index', ['filter' => 'PermissionModel']);
    $routes->post('user', 'UserController::create', ['filter' => 'PermissionModel']);
    $routes->put('user/(:num)', 'UserController::update/$1', ['filter' => 'PermissionModel']);
    $routes->delete('user/(:num)', 'UserController::delete/$1', ['filter' => 'PermissionModel']);

    // OTHER API REQUEST //
});
