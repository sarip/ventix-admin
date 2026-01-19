-- Sample data for facilities table

INSERT INTO `facilities` (`name`, `category`, `description`, `user_id_pic`, `is_available`, `created_at`, `updated_at`) VALUES
('Meeting Room A', 'Meeting Room', 'Small meeting room for 6-8 people', 1, 1, NOW(), NOW()),
('Conference Hall', 'Conference Room', 'Large conference hall with projector and audio system', 1, 1, NOW(), NOW()),
('Basketball Court', 'Sport Hall', 'Indoor basketball court with proper flooring', 1, 1, NOW(), NOW()),
('Main Auditorium', 'Auditorium', 'Main auditorium with 200 seats capacity', 1, 1, NOW(), NOW()),
('Meeting Room B', 'Meeting Room', 'Medium meeting room for 10-12 people', 1, 0, NOW(), NOW());

-- Sample data for facility_pricing table

INSERT INTO `facility_pricing` (`facility_id`, `day_type`, `start_time`, `end_time`, `price_per_hour`, `created_at`, `updated_at`) VALUES
-- Meeting Room A pricing
(1, 'Weekday', '08:00:00', '17:00:00', 100000, NOW(), NOW()),
(1, 'Weekday', '17:00:00', '22:00:00', 150000, NOW(), NOW()),
(1, 'Weekend', '08:00:00', '22:00:00', 200000, NOW(), NOW()),

-- Conference Hall pricing
(2, 'Weekday', '08:00:00', '17:00:00', 300000, NOW(), NOW()),
(2, 'Weekday', '17:00:00', '22:00:00', 400000, NOW(), NOW()),
(2, 'Weekend', '08:00:00', '22:00:00', 500000, NOW(), NOW()),

-- Basketball Court pricing
(3, 'Weekday', '06:00:00', '18:00:00', 150000, NOW(), NOW()),
(3, 'Weekend', '06:00:00', '18:00:00', 200000, NOW(), NOW()),

-- Main Auditorium pricing
(4, 'Weekday', '08:00:00', '22:00:00', 1000000, NOW(), NOW()),
(4, 'Weekend', '08:00:00', '22:00:00', 1500000, NOW(), NOW()),
(4, 'Holiday', '08:00:00', '22:00:00', 2000000, NOW(), NOW());
