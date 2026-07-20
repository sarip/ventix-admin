<?php

namespace Config;

$routes = Services::routes(true);

// Login and Authentication

$routes->get('items', 'Home::coba');

$routes->group('frontend/api/v1', ['namespace' => 'App\\Controllers\\FrontEnd'], function ($routes) {
    $routes->get('events_cat', 'EventsCatController::index', ['filter' => 'TokenFeFilter']);
    $routes->get('events', 'EventController::index', ['filter' => 'TokenFeFilter']);
    $routes->get('events/(:num)', 'EventController::find/$1', ['filter' => 'TokenFeFilter']);
    $routes->get('events/slug/(:any)', 'EventController::findSlug/$1', ['filter' => 'TokenFeFilter']);


    $routes->get('facilities', 'FacilitieController::index', ['filter' => 'TokenFeFilter']);
    $routes->get('facility-booking-status', 'FacilitieController::bookingStatus', ['filter' => 'TokenFeFilter']);
    $routes->get('facility-bookings', 'FacilitieController::myBooking', ['filter' => 'TokenFeFilter']);
    $routes->get('facility-bookings/(:any)', 'FacilitieController::findMyBook/$1', ['filter' => 'TokenFeFilter']);
    $routes->post('facility-bookings/(:num)/upload-payment', 'FacilitieController::uploadPayment/$1', ['filter' => 'TokenFeFilter']);
    $routes->post('facilities/book', 'FacilitieController::booking', ['filter' => 'TokenFeFilter']);
    $routes->get('facilities/(:num)', 'FacilitieController::detail/$1', ['filter' => 'TokenFeFilter']);

    // FACILITY PROFILE LANDING PAGE APIs
    $routes->get('facilities/profile/(:segment)', 'FacilityProfileController::show/$1', ['filter' => 'TokenFeFilter']);
    $routes->get('facilities/profile/(:segment)/reviews', 'FacilityProfileController::reviews/$1', ['filter' => 'TokenFeFilter']);
    $routes->get('facilities/profile/(:segment)/related', 'FacilityProfileController::related/$1', ['filter' => 'TokenFeFilter']);
    $routes->post('facilities/profile/(:segment)/follow', 'FacilityProfileController::follow/$1', ['filter' => 'TokenFeFilter']);
    $routes->get('facilities/profile/(:segment)/statistics', 'FacilityProfileController::statistics/$1', ['filter' => 'TokenFeFilter']);
    $routes->get('facilities/profile/(:segment)/follow-status', 'FacilityProfileController::followStatus/$1', ['filter' => 'TokenFeFilter']);
    $routes->get('reg_provinces', 'RegProvinceController::index', ['filter' => 'TokenFeFilter']);

    $routes->get('orders', 'OrderController::index', ['filter' => 'TokenFeFilter']);
    $routes->post('orders', 'OrderController::create', ['filter' => 'TokenFeFilter']);
    $routes->get('orders/(:any)', 'OrderController::findByOrderCode/$1', ['filter' => 'TokenFeFilter']);
    $routes->post('orders/(:any)/upload-payment', 'OrderController::uploadPayment/$1', ['filter' => 'TokenFeFilter']);

    $routes->get('tickets/my', 'TicketController::index', ['filter' => 'TokenFeFilter']);



    // MEMBER PROFILES & SOCIAL

    $routes->post('profile/update', 'ProfileController::update', ['filter' => 'TokenFeFilter']);
    $routes->post('profile/follow', 'ProfileController::follow', ['filter' => 'TokenFeFilter']);

    $routes->post('profile/experience', 'ProfileController::experience', ['filter' => 'TokenFeFilter']);
    $routes->post('profile/rating', 'ProfileController::rating', ['filter' => 'TokenFeFilter']);

    $routes->get('profile/following', 'ProfileController::following', ['filter' => 'TokenFeFilter']);
    $routes->get('profile/following/(:segment)', 'ProfileController::following/$1', ['filter' => 'TokenFeFilter']);

    $routes->get('profile/followers', 'ProfileController::followers', ['filter' => 'TokenFeFilter']);
    $routes->get('profile/followers/(:segment)', 'ProfileController::followers/$1', ['filter' => 'TokenFeFilter']);

    $routes->get('profile/experiences', 'ProfileController::experiences', ['filter' => 'TokenFeFilter']);
    $routes->get('profile/experiences/(:segment)', 'ProfileController::experiences/$1', ['filter' => 'TokenFeFilter']);

    $routes->get('profile/ratings', 'ProfileController::ratings', ['filter' => 'TokenFeFilter']);
    $routes->get('profile/ratings/(:segment)', 'ProfileController::ratings/$1', ['filter' => 'TokenFeFilter']);

    $routes->get('profile/activity-summary', 'ProfileController::activitySummary', ['filter' => 'TokenFeFilter']);
    $routes->get('profile/activity-summary/(:segment)', 'ProfileController::activitySummary/$1', ['filter' => 'TokenFeFilter']);

    $routes->get('profile/activities', 'ProfileController::activities', ['filter' => 'TokenFeFilter']);
    $routes->get('profile/activities/(:segment)', 'ProfileController::activities/$1', ['filter' => 'TokenFeFilter']);

    // PALING BAWAH
    $routes->get('notifications', 'ProfileController::notifications', ['filter' => 'TokenFeFilter']);
    $routes->put('notifications/read', 'ProfileController::readNotification', ['filter' => 'TokenFeFilter']);

    $routes->get('members-list', 'ProfileController::members', ['filter' => 'TokenFeFilter']);
    $routes->get('profile/(:segment)', 'ProfileController::show/$1', ['filter' => 'TokenFeFilter']);
});
// API V1
$routes->group('api/v1', ['namespace' => 'App\\Controllers\\Api'], function ($routes) {

    $routes->options('(:any)', 'ApiController::options');

    // API TOKEN AUTHENTICATION
    $routes->get('validate_token', 'AuthController::validateToken', ['filter' => 'tokenFilter']);


    // ADMINISTRATOR AUTHENTICATION
    $routes->post('login', 'AuthController::login');
    $routes->post('auth/google', 'AuthController::loginWithGoogle');
    $routes->post('register-eo', 'AuthController::registerEo');
    $routes->post('register-fo', 'AuthController::registerFo');
    $routes->get('verify-email/(:any)', 'AuthController::verifyEmail/$1');
    $routes->post('register-member', 'AuthController::registerMember');
    $routes->put('update-member', 'AuthController::updateMember');
    $routes->post('update-eo', 'AuthController::updateEo');
    $routes->post('update-fo', 'AuthController::updateFo');
    $routes->post('resend-verification', 'AuthController::resendVerification');
    $routes->post('forgot-password', 'AuthController::forgotPassword');
    $routes->post('reset-password', 'AuthController::resetPassword');

    $routes->get('logout', 'AuthController::logout', ['filter' => 'tokenFilter']);
    $routes->get('whoami', 'AuthController::whoami', ['filter' => 'tokenFilter']);

    $routes->get('test', 'TestController::test', ['filter' => 'tokenFilter']);

    $routes->put('password', 'AuthController::updatePassword', ['filter' => 'tokenFilter']);

    // DASHBOARD
    $routes->get('dashboard/facility', 'DashboardController::facilityDashboard', ['filter' => 'PermissionFilter']);

    $routes->get('users', 'UserController::index', ['filter' => 'PermissionFilter']);
    $routes->get('users-member', 'UserController::member', ['filter' => 'PermissionFilter']);
    $routes->get('user/(:num)', 'UserController::show/$1', ['filter' => 'PermissionFilter']);
    $routes->get('users-lists', 'UserController::lists', ['filter' => 'PermissionFilter']);
    $routes->post('user', 'UserController::create', ['filter' => 'PermissionFilter']);
    $routes->put('user/(:num)', 'UserController::update/$1', ['filter' => 'PermissionFilter']);
    $routes->delete('user/(:num)', 'UserController::delete/$1', ['filter' => 'PermissionFilter']);
    $routes->post('user/(:num)/status', 'UserController::changeStatus/$1', ['filter' => 'PermissionFilter']);
    $routes->post('user/(:num)/reset-password', 'UserController::resetPassword/$1', ['filter' => 'PermissionFilter']);


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
    $routes->put('eventscat/(:num)', 'EventsCatController::update/$1', ['filter' => 'PermissionFilter']);
    $routes->delete('eventscat/(:num)', 'EventsCatController::delete/$1', ['filter' => 'PermissionFilter']);

    $routes->get('events_status', 'EventsStatuController::index', ['filter' => 'PermissionFilter']);
    $routes->post('eventsstatu', 'EventsStatuController::create', ['filter' => 'PermissionFilter']);
    $routes->put('eventsstatu/(:any)', 'EventsStatuController::update/$1', ['filter' => 'PermissionFilter']);
    $routes->delete('eventsstatu/(:any)', 'EventsStatuController::delete/$1', ['filter' => 'PermissionFilter']);

    $routes->get('events_organizer', 'EventsOrganizerController::index', ['filter' => 'PermissionFilter']);
    $routes->post('eventsorganizer', 'EventsOrganizerController::create', ['filter' => 'PermissionFilter']);
    $routes->post('eventsorganizer/(:num)', 'EventsOrganizerController::update/$1', ['filter' => 'PermissionFilter']);
    $routes->post('eventsorganizer/(:num)/verify', 'EventsOrganizerController::verify/$1', ['filter' => 'PermissionFilter']);
    $routes->delete('eventsorganizer/(:num)', 'EventsOrganizerController::delete/$1', ['filter' => 'PermissionFilter']);

    $routes->get('events', 'EventController::index', ['filter' => 'PermissionFilter']);
    $routes->get('events-external', 'EventController::external', ['filter' => 'PermissionFilter']);
    $routes->post('event', 'EventController::create', ['filter' => 'PermissionFilter']);
    $routes->post('event/saveAll', 'EventController::saveAll', ['filter' => 'PermissionFilter']);
    $routes->post('event/(:num)', 'EventController::update/$1', ['filter' => 'PermissionFilter']);
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
    $routes->get('event_ticket/find', 'EventTicketController::find', ['filter' => 'PermissionFilter']);
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
    $routes->post('order/preview-commission', 'OrderController::previewCommission', ['filter' => 'PermissionFilter']);

    $routes->get('facilities', 'FacilitieController::index', ['filter' => 'PermissionFilter']);
    $routes->get('facilities/(:num)', 'FacilitieController::detail/$1', ['filter' => 'PermissionFilter']);
    $routes->post('facilities', 'FacilitieController::saveComplete', ['filter' => 'PermissionFilter']);
    $routes->post('facilities/(:num)', 'FacilitieController::saveComplete/$1', ['filter' => 'PermissionFilter']);
    $routes->delete('facilities/(:num)', 'FacilitieController::delete/$1', ['filter' => 'PermissionFilter']);

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

    $routes->get('orders_status', 'OrdersStatuController::index', ['filter' => 'PermissionFilter']);
    $routes->post('ordersstatu', 'OrdersStatuController::create', ['filter' => 'PermissionFilter']);
    $routes->put('ordersstatu/(:num)', 'OrdersStatuController::update/$1', ['filter' => 'PermissionFilter']);
    $routes->delete('ordersstatu/(:num)', 'OrdersStatuController::delete/$1', ['filter' => 'PermissionFilter']);

    // FACILITY MANAGEMENT SYSTEM
    // Facilities
    $routes->get('facilities', 'FacilityController::index', ['filter' => 'PermissionFilter']);
    $routes->get('facility/(:num)', 'FacilityController::show/$1', ['filter' => 'PermissionFilter']);
    $routes->post('facility', 'FacilityController::create', ['filter' => 'PermissionFilter']);
    $routes->post('facility/(:num)', 'FacilityController::update/$1', ['filter' => 'PermissionFilter']);
    $routes->delete('facility/(:num)', 'FacilityController::delete/$1', ['filter' => 'PermissionFilter']);

    // Facility Pricing
    $routes->get('facility_pricings', 'FacilityPricingController::index', ['filter' => 'PermissionFilter']);
    $routes->get('facility_pricing/(:num)', 'FacilityPricingController::show/$1', ['filter' => 'PermissionFilter']);
    $routes->post('facility_pricing', 'FacilityPricingController::create', ['filter' => 'PermissionFilter']);
    $routes->put('facility_pricing/(:num)', 'FacilityPricingController::update/$1', ['filter' => 'PermissionFilter']);
    $routes->delete('facility_pricing/(:num)', 'FacilityPricingController::delete/$1', ['filter' => 'PermissionFilter']);
    $routes->post('facility_pricing/check_overlap', 'FacilityPricingController::checkOverlap', ['filter' => 'PermissionFilter']);

    // Facility Bookings
    $routes->get('facility_bookings', 'FacilityBookingController::index', ['filter' => 'PermissionFilter']);
    $routes->get('facility_booking/(:num)', 'FacilityBookingController::show/$1', ['filter' => 'PermissionFilter']);
    $routes->post('facility_booking', 'FacilityBookingController::create', ['filter' => 'PermissionFilter']);
    $routes->put('facility_booking/(:num)', 'FacilityBookingController::update/$1', ['filter' => 'PermissionFilter']);
    $routes->delete('facility_booking/(:num)', 'FacilityBookingController::delete/$1', ['filter' => 'PermissionFilter']);
    $routes->put('facility_booking/(:num)/status', 'FacilityBookingController::updateStatus/$1', ['filter' => 'PermissionFilter']);
    $routes->post('facility_booking/check_availability', 'FacilityBookingController::checkAvailability', ['filter' => 'PermissionFilter']);
    $routes->post('facility_booking/calculate_price', 'FacilityBookingController::calculatePrice', ['filter' => 'PermissionFilter']);

    // Facility Booking Status
    $routes->get('facility_booking_statuses', 'FacilitybookingStatuController::index', ['filter' => 'PermissionFilter']);
    $routes->get('facility_booking_status/(:num)', 'FacilitybookingStatuController::show/$1', ['filter' => 'PermissionFilter']);

    $routes->get('facility_pricing', 'FacilityPricingController::index', ['filter' => 'PermissionFilter']);
    $routes->post('facilitypricing', 'FacilityPricingController::create', ['filter' => 'PermissionFilter']);
    $routes->put('facilitypricing/(:num)', 'FacilityPricingController::update/$1', ['filter' => 'PermissionFilter']);
    $routes->delete('facilitypricing/(:num)', 'FacilityPricingController::delete/$1', ['filter' => 'PermissionFilter']);

    // FACILITY PROFILING
    // Facility Gallery
    $routes->get('facilities/(:num)/gallery', 'FacilityGalleryController::index/$1', ['filter' => 'PermissionFilter']);
    $routes->post('facilities/(:num)/gallery', 'FacilityGalleryController::create/$1', ['filter' => 'PermissionFilter']);
    $routes->put('facilities/(:num)/gallery/(:num)', 'FacilityGalleryController::update/$1/$2', ['filter' => 'PermissionFilter']);
    $routes->put('facilities/(:num)/gallery/(:num)/featured', 'FacilityGalleryController::setFeatured/$1/$2', ['filter' => 'PermissionFilter']);
    $routes->post('facilities/(:num)/gallery/reorder', 'FacilityGalleryController::reorder/$1', ['filter' => 'PermissionFilter']);
    $routes->delete('facilities/(:num)/gallery/(:num)', 'FacilityGalleryController::delete/$1/$2', ['filter' => 'PermissionFilter']);

    // Facility Amenities (Master)
    $routes->get('amenities', 'FacilityAmenityController::index', ['filter' => 'PermissionFilter']);
    $routes->post('amenities', 'FacilityAmenityController::create', ['filter' => 'PermissionFilter']);
    $routes->put('amenities/(:num)', 'FacilityAmenityController::update/$1', ['filter' => 'PermissionFilter']);
    $routes->delete('amenities/(:num)', 'FacilityAmenityController::delete/$1', ['filter' => 'PermissionFilter']);

    // Facility Amenities (Per Facility)
    $routes->get('facilities/(:num)/amenities', 'FacilityAmenityController::getFacilityAmenities/$1', ['filter' => 'PermissionFilter']);
    $routes->post('facilities/(:num)/amenities/sync', 'FacilityAmenityController::sync/$1', ['filter' => 'PermissionFilter']);

    // Facility Features (Specifications)
    $routes->get('facilities/(:num)/features', 'FacilityFeatureController::index/$1', ['filter' => 'PermissionFilter']);
    $routes->post('facilities/(:num)/features', 'FacilityFeatureController::create/$1', ['filter' => 'PermissionFilter']);
    $routes->put('facilities/(:num)/features/(:num)', 'FacilityFeatureController::update/$1/$2', ['filter' => 'PermissionFilter']);
    $routes->post('facilities/(:num)/features/reorder', 'FacilityFeatureController::reorder/$1', ['filter' => 'PermissionFilter']);
    $routes->delete('facilities/(:num)/features/(:num)', 'FacilityFeatureController::delete/$1/$2', ['filter' => 'PermissionFilter']);

    // Facility Operating Hours
    $routes->get('facilities/(:num)/operating-hours', 'FacilityOperatingHourController::index/$1', ['filter' => 'PermissionFilter']);
    $routes->post('facilities/(:num)/operating-hours', 'FacilityOperatingHourController::create/$1', ['filter' => 'PermissionFilter']);
    $routes->put('facilities/(:num)/operating-hours/(:num)', 'FacilityOperatingHourController::update/$1/$2', ['filter' => 'PermissionFilter']);
    $routes->post('facilities/(:num)/operating-hours/sync', 'FacilityOperatingHourController::sync/$1', ['filter' => 'PermissionFilter']);
    $routes->post('facilities/(:num)/operating-hours/copy', 'FacilityOperatingHourController::copy/$1', ['filter' => 'PermissionFilter']);
    $routes->delete('facilities/(:num)/operating-hours/(:num)', 'FacilityOperatingHourController::delete/$1/$2', ['filter' => 'PermissionFilter']);

    // Facility Rules
    $routes->get('facilities/(:num)/rules', 'FacilityRuleController::index/$1', ['filter' => 'PermissionFilter']);
    $routes->post('facilities/(:num)/rules', 'FacilityRuleController::create/$1', ['filter' => 'PermissionFilter']);
    $routes->put('facilities/(:num)/rules/(:num)', 'FacilityRuleController::update/$1/$2', ['filter' => 'PermissionFilter']);
    $routes->post('facilities/(:num)/rules/reorder', 'FacilityRuleController::reorder/$1', ['filter' => 'PermissionFilter']);
    $routes->delete('facilities/(:num)/rules/(:num)', 'FacilityRuleController::delete/$1/$2', ['filter' => 'PermissionFilter']);

    // Facility Statistics
    $routes->get('facilities/(:num)/statistics', 'FacilityStatisticController::index/$1', ['filter' => 'PermissionFilter']);
    $routes->post('facilities/(:num)/statistics/calculate', 'FacilityStatisticController::calculate/$1', ['filter' => 'PermissionFilter']);
    $routes->post('facilities/(:num)/statistics/increment', 'FacilityStatisticController::increment/$1', ['filter' => 'PermissionFilter']);

    $routes->get('user_points', 'UserPointController::index', ['filter' => 'PermissionFilter']);
    $routes->post('userpoint', 'UserPointController::create', ['filter' => 'PermissionFilter']);
    $routes->put('userpoint/(:num)', 'UserPointController::update/$1', ['filter' => 'PermissionFilter']);
    $routes->delete('userpoint/(:num)', 'UserPointController::delete/$1', ['filter' => 'PermissionFilter']);

    $routes->get('userpoint_rules', 'UserpointRuleController::index', ['filter' => 'PermissionFilter']);
    $routes->post('userpointrule', 'UserpointRuleController::create', ['filter' => 'PermissionFilter']);
    $routes->put('userpointrule/(:num)', 'UserpointRuleController::update/$1', ['filter' => 'PermissionFilter']);
    $routes->delete('userpointrule/(:num)', 'UserpointRuleController::delete/$1', ['filter' => 'PermissionFilter']);



    // HANYA UNTUK TESTING
    $routes->get('point/earn', 'PointTestingController::earn', ['filter' => 'PermissionFilter']);
    $routes->get('point/redeem', 'PointTestingController::redeem', ['filter' => 'PermissionFilter']);

    $routes->get('master_taxes', 'MasterTaxeController::index', ['filter' => 'PermissionFilter']);
    $routes->post('mastertaxe', 'MasterTaxeController::create', ['filter' => 'PermissionFilter']);
    $routes->put('mastertaxe/(:num)', 'MasterTaxeController::update/$1', ['filter' => 'PermissionFilter']);
    $routes->delete('mastertaxe/(:num)', 'MasterTaxeController::delete/$1', ['filter' => 'PermissionFilter']);


    $routes->get('reg_provinces', 'RegProvinceController::index', ['filter' => 'PermissionFilter']);
    $routes->post('regprovince', 'RegProvinceController::create', ['filter' => 'PermissionFilter']);
    $routes->put('regprovince/(:num)', 'RegProvinceController::update/$1', ['filter' => 'PermissionFilter']);
    $routes->delete('regprovince/(:num)', 'RegProvinceController::delete/$1', ['filter' => 'PermissionFilter']);

    // COMMISSION ANALYSIS
    $routes->get('commissions', 'CommissionController::index', ['filter' => 'PermissionFilter']);
    $routes->get('commissions/analysis', 'CommissionController::analysis', ['filter' => 'PermissionFilter']);

    $routes->get('commission_rules', 'CommissionRuleController::index', ['filter' => 'PermissionFilter']);
    $routes->post('commissionrule', 'CommissionRuleController::create', ['filter' => 'PermissionFilter']);
    $routes->put('commissionrule/(:num)', 'CommissionRuleController::update/$1', ['filter' => 'PermissionFilter']);
    $routes->delete('commissionrule/(:num)', 'CommissionRuleController::delete/$1', ['filter' => 'PermissionFilter']);

    // EO VERIFICATION MODERATION
    $routes->get('admin/eo/verifications', 'EoVerificationController::index', ['filter' => 'PermissionFilter']);
    $routes->get('admin/eo/verifications/(:num)', 'EoVerificationController::show/$1', ['filter' => 'PermissionFilter']);
    $routes->post('admin/eo/approve', 'EoVerificationController::approve', ['filter' => 'PermissionFilter']);
    $routes->post('admin/eo/reject', 'EoVerificationController::reject', ['filter' => 'PermissionFilter']);

    // FACILITY VERIFICATION MODERATION
    $routes->get('admin/facility/verifications', 'EoVerificationController::facilityIndex', ['filter' => 'PermissionFilter']);
    $routes->get('admin/facility/verifications/(:num)', 'EoVerificationController::facilityShow/$1', ['filter' => 'PermissionFilter']);
    $routes->post('admin/facility/approve', 'EoVerificationController::facilityApprove', ['filter' => 'PermissionFilter']);
    $routes->post('admin/facility/reject', 'EoVerificationController::facilityReject', ['filter' => 'PermissionFilter']);

    // NOTIFICATIONS
    $routes->get('notifications', 'NotificationController::index', ['filter' => 'tokenFilter']);
    $routes->get('notifications/unread-count', 'NotificationController::unreadCount', ['filter' => 'tokenFilter']);
    $routes->post('notifications/(:num)/read', 'NotificationController::markAsRead/$1', ['filter' => 'tokenFilter']);
    $routes->post('notifications/read-all', 'NotificationController::markAllAsRead', ['filter' => 'tokenFilter']);
    $routes->delete('notifications/(:num)', 'NotificationController::delete/$1', ['filter' => 'tokenFilter']);

    // MEMBER PROFILES & SOCIAL
    $routes->get('profile/(:any)', 'ProfileController::show/$1', ['filter' => 'tokenFilter']);
    $routes->post('profile/update', 'ProfileController::update', ['filter' => 'tokenFilter']);
    $routes->post('profile/follow', 'ProfileController::follow', ['filter' => 'tokenFilter']);
    $routes->get('profile/following', 'ProfileController::following', ['filter' => 'tokenFilter']);
    $routes->post('profile/experience', 'ProfileController::experience', ['filter' => 'tokenFilter']);
    $routes->post('profile/rating', 'ProfileController::rating', ['filter' => 'tokenFilter']);

    $routes->get('facilities_organizer', 'FacilitiesOrganizerController::index', ['filter' => 'PermissionFilter']);
    $routes->post('facilitiesorganizer', 'FacilitiesOrganizerController::create', ['filter' => 'PermissionFilter']);
    $routes->put('facilitiesorganizer/(:num)', 'FacilitiesOrganizerController::update/$1', ['filter' => 'PermissionFilter']);
    $routes->delete('facilitiesorganizer/(:num)', 'FacilitiesOrganizerController::delete/$1', ['filter' => 'PermissionFilter']);
    $routes->post('facilitiesorganizer/(:num)/verify', 'FacilitiesOrganizerController::verify/$1', ['filter' => 'PermissionFilter']);

    // OTHER API REQUEST //

});
