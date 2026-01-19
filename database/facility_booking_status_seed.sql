-- Sample data for facilitybooking_status table

INSERT INTO `facilitybooking_status` (`id`, `name`, `color_code`, `description`, `created_at`, `updated_at`) VALUES
(1, 'Pending', '#FFA500', 'Booking is pending confirmation', NOW(), NOW()),
(2, 'Confirmed', '#28A745', 'Booking has been confirmed', NOW(), NOW()),
(3, 'Completed', '#6C757D', 'Booking has been completed', NOW(), NOW()),
(4, 'Cancelled', '#DC3545', 'Booking has been cancelled', NOW(), NOW());
