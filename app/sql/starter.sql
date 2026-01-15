-- ======================
-- 1. events_cat
-- ======================
CREATE TABLE events_cat (
    name VARCHAR(50) UNIQUE PRIMARY KEY,
		description VARCHAR(255)
);

-- ======================
-- 2. events_status
-- 'draft', 'upcoming', 'ongoing', 'finished'
-- ======================
CREATE TABLE events_status (
    name VARCHAR(50) UNIQUE PRIMARY KEY, 
		description VARCHAR(255)
);

-- ======================
-- 3. events_organizer
-- ======================
CREATE TABLE events_organizer (
    id INT PRIMARY KEY AUTO_INCREMENT,
    eo_name VARCHAR(255) NOT NULL,
    company_name VARCHAR(255), 
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20),
    website VARCHAR(255),
    address TEXT,
    logo_path VARCHAR(255), -- Path file logo
    tax_id VARCHAR(50), -- NPWP atau nomor pajak
    description TEXT,
		eo_slug VARCHAR(100) UNIQUE, -- Untuk URL (misal: veentix.com/nama-eo)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ======================
-- 4. events
-- ======================
CREATE TABLE events (
    id INT PRIMARY KEY AUTO_INCREMENT,
    events_organizer_id INT,
		user_id_pic INT,
		event_category VARCHAR(50) REFERENCES events_cat(name),
    title VARCHAR(255),
    description TEXT,
    start_date VARCHAR(16),
    end_date VARCHAR(16),
    location_name VARCHAR(255),
    latitude VARCHAR(16),
    longitude VARCHAR(16),
    price_pool DECIMAL(15, 2),
    registration_fee DECIMAL(15, 2) DEFAULT 0.00,
    thumbnail_url VARCHAR(255),
		events_status VARCHAR(50) REFERENCES events_status(name),
	  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ======================
-- 5. events_agendas
-- ======================
CREATE TABLE events_agendas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    events_id INT NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    start_time VARCHAR(16) NOT NULL,
    end_time VARCHAR(16),
    activity_name VARCHAR(255) NOT NULL,
    notes TEXT
);

-- ======================
-- 6. events_guests
-- ======================
CREATE TABLE events_guests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    event_id INT NOT NULL REFERENCES events(id) ON DELETE CASCADE,
	ticket_id INT NOT NULL,
    username VARCHAR(150) NOT NULL,
    email VARCHAR(100),
    phone VARCHAR(20),
    invitation_status ENUM('Pending', 'Confirmed', 'Declined') DEFAULT 'Pending',
    attendance_status ENUM('Absent', 'Present') DEFAULT 'Absent'
);

-- ======================
-- 7. apppermissions
-- ======================
-- Contoh: 'edit event', 'delete_user'
-- ======================

CREATE TABLE `appusers_apppermissions` (
	`perm_name` VARCHAR(100) UNIQUE PRIMARY KEY NOT NULL, 
  `slug` VARCHAR(100) NOT NULL, -- Contoh: 'edit_event', 'delete_user'
  `description` VARCHAR(255) DEFAULT NULL
);

-- ======================
-- 8. appusers_role_permission
-- ======================
-- Menghubungkan Role dengan Permission (Many-to-Many)
DROP TABLE IF EXISTS `appusers_role_permission`;
CREATE TABLE `appusers_role_permission` (
  `role_name` VARCHAR(100) NOT NULL REFERENCES appusers_role(role_name),
  `perm_name` VARCHAR(100) NOT NULL REFERENCES appusers_apppermissions(perm_name),
  PRIMARY KEY (`role_name`, `perm_name`)
);

-- ======================
-- 9. appusers_role
-- ======================
-- `role_name` -- Contoh: 'Super Admin', 'Validator'
-- `role_slug` -- Contoh: 'super_admin', 'validator' (untuk pengecekan di kode)
-- ======================
CREATE TABLE `appusers_role` (
  `role_name` VARCHAR(50) UNIQUE NOT NULL PRIMARY KEY, -- Contoh: 'Super Admin', 'Validator'
  `role_slug` VARCHAR(50) UNIQUE KEY NOT NULL, -- Contoh: 'super_admin', 'validator' (untuk pengecekan di kode)
  `description` VARCHAR(255) DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ======================
-- 10. appusers
-- ======================
DROP TABLE IF EXISTS `appusers`;
CREATE TABLE `appusers` (
  `id` INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `username` VARCHAR(50) NOT NULL UNIQUE KEY,
  `full_name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(100) NOT NULL UNIQUE KEY,
  `password` VARCHAR(255) NOT NULL,
  `role` VARCHAR(50) REFERENCES appusers_role(role_name),
  `avatar` VARCHAR(255) DEFAULT NULL,
  `status` VARCHAR(50) REFERENCES users_status(name),
  -- Tracking & Security
  `last_login_at` DATETIME DEFAULT NULL,
  `last_login_ip` VARCHAR(45) DEFAULT NULL, -- Mendukung IPv4 & IPv6
  `rememberme_token` VARCHAR(100) DEFAULT NULL,-- rememberme_token, "agar tidak perlu login lagi"
  
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ======================
-- 11. users
-- ======================
DROP TABLE IF EXISTS `users`;
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
		eo_id INT NULL, -- Terisi jika user adalah staf/pemilik dari perusahaan EO tertentu
		username VARCHAR(50) UNIQUE NOT NULL,
    -- full_name VARCHAR(100) NOT NULL,
    name VARCHAR(150) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL, -- Simpan dengan hash
    phone VARCHAR(20),
    role VARCHAR(50) REFERENCES sys_users_role(role_name),
		profile_picture VARCHAR(255),
		refferalcode VARCHAR(30),
		status VARCHAR(50) REFERENCES sys_user_status(name),
    last_login DATETIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (eo_id) REFERENCES events_organizer(id) ON DELETE SET NULL
);

-- ======================
-- 12. sys_users_role
-- ======================
DROP TABLE IF EXISTS `sys_users_role`;
CREATE TABLE `sys_users_role` (
  `role_name` VARCHAR(50) UNIQUE NOT NULL PRIMARY KEY, -- Contoh: 'EO Admin','EO_Staff', 'General_User'
  `role_slug` VARCHAR(50) UNIQUE NOT NULL, -- Contoh: 'eo_admin', 'eo_staff' (untuk pengecekan di kode)
  `description` VARCHAR(255) DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ======================
-- 13. sys_users_role_permission
-- ======================
-- Menghubungkan Role dengan Permission (Many-to-Many)
-- ======================
DROP TABLE IF EXISTS `sys_users_role_permission`;
CREATE TABLE `sys_users_role_permission` (
  `role_name` VARCHAR(100) NOT NULL REFERENCES sys_users_role(role_name),
  `perm_name` VARCHAR(100) NOT NULL REFERENCES sys_users_apppermissions(perm_name),
  PRIMARY KEY (`role_name`, `perm_name`)
);

-- ======================
-- 14. userpoint_rules
-- ======================
/*  
    activity_name : Contoh: 'Daily_Checkin', 'Event_Attendance'
		description : deskripsi event
		min_transaction_amount : Minimal belanja untuk dapat poin
    max_times_per_day : Batasan berapa kali aktivitas ini dipoin per hari
    cooldown_minutes : Jeda waktu antar aktivitas (mencegah spam)
    start_date : Masa berlaku promo poin (awal)
    end_date : Masa berlaku promo poin (akhir)
    point_expiry_days : Berapa hari poin ini hangus setelah didapat
	*/
-- ======================
DROP TABLE IF EXISTS `userpoint_rules`;
CREATE TABLE userpoint_rules (
    activity_name VARCHAR(100) UNIQUE NOT NULL PRIMARY KEY, 
		description VARCHAR(255) DEFAULT NULL,
    points INT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    -- Kolom Aturan Tambahan --
    min_transaction_amount DECIMAL(15, 2) DEFAULT 0,
    max_times_per_day INT DEFAULT NULL,              
    cooldown_minutes INT DEFAULT 0,                
    start_date DATETIME NULL,                    
    end_date DATETIME NULL,                      
    point_expiry_days INT DEFAULT NULL,      
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ======================
-- 15. sys_userpoint_cat
-- ======================
-- 'Transactional', -- Pembelian tiket, merchandise
-- 'Engagement',    -- Login harian, lengkapi profil, review
-- 'Attendance',    -- Scan QR masuk, ikut sesi
-- 'Referral',      -- Ajak teman
-- 'Adjustment'     -- Perbaikan manual oleh admin
-- ======================
DROP TABLE IF EXISTS `sys_userpoint_cat`;
CREATE TABLE sys_userpoint_cat (
    name VARCHAR(50) UNIQUE PRIMARY KEY,
		description VARCHAR(255)
);

-- ======================
-- 16. userpoint_status
-- ======================
-- Status,Skenario,Kapan Berubah?
/*
-- Pending : User membeli tiket, tapi status pembayaran masih diverifikasi atau acara belum berlangsung. -- Default saat data masuk.
-- Active : Pembayaran sukses atau user sudah melakukan Scan QR kehadiran di lokasi. -- Diupdate manual oleh sistem/admin setelah syarat terpenuhi.
-- Inactive : Poin yang sengaja dinonaktifkan oleh admin karena adanya sengketa atau pengecekan data. -- Diupdate manual oleh Admin.
-- Expired : Poin sudah melewati expiry_date. -- Dicek secara berkala oleh sistem (Cron Job).
-- Cancelled : User membatalkan pesanan (Refund), maka poin yang didapat otomatis dibatalkan. -- Saat proses Refund sukses.
*/
-- ======================
CREATE TABLE userpoint_status (
    name VARCHAR(50) UNIQUE PRIMARY KEY,
		description VARCHAR(255)
);

-- ======================
-- 17. userpoint_logs
-- ======================
-- source_id :  ID dari sumber
-- source_type : ORD => order, FAC => Faciliies 
-- source_code : order / facility code
-- activity_type :
-- 	Point Category	Activity Type (Label Spesifik)
-- 	Transactional		TICKET_PURCHASE 
-- 	Transactional		REDEEM_MERCHANDISE 
-- 	Engagement			DAILY_LOGIN 
-- 	Engagement			PROFILE_COMPLETION 
-- 	Attendance			EVENT_CHECKIN 
-- 	Referral				REFERRAL_SUCCESS 
-- 	Adjustment			ADMIN_GIFT

-- ======================
-- tambah point
DROP TABLE IF EXISTS userpoint_logs;
CREATE TABLE userpoint_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    source_id INT,  -- ID dari sumber
		source_type VARCHAR(5) NOT NULL , --  ORD : order, FAC : Faciliies 
		source_code VARCHAR(50) NOT NULL ,  
    point_cat VARCHAR(50) NOT NULL REFERENCES sys_userpoint_cat(name),
    activity_type VARCHAR(100),
    amount INT NOT NULL, 
    point_status VARCHAR(50) NOT NULL REFERENCES userpoint_status(name),  
    description TEXT,
    expiry_date DATE NULL, 
    activated_at DATETIME NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ======================
-- 18. userpoints
-- ======================
CREATE TABLE user_points (
    user_id INT PRIMARY KEY,
    current_balance INT DEFAULT 0,
    total_earned INT DEFAULT 0, -- Total poin yang pernah didapat (untuk leveling/rank)
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ======================
-- 19. user_status
-- ======================
CREATE TABLE users_status (
    name VARCHAR(50) UNIQUE PRIMARY KEY,
		description VARCHAR(255)
);

-- ======================
-- 20. sys_users_apppermissions
-- ======================
-- Contoh: 'edit event', 'delete_user'
-- ======================
DROP TABLE IF EXISTS sys_users_apppermissions;
CREATE TABLE `sys_users_apppermissions` (
	`perm_name` VARCHAR(100) UNIQUE PRIMARY KEY NOT NULL, 
  `slug` VARCHAR(100) NOT NULL, -- Contoh: 'edit_event', 'delete_user'
  `description` VARCHAR(255) DEFAULT NULL
);

-- ======================
-- 21. event_ticket
-- ======================
-- name      					: Contoh: 'VIP', 'Early Bird'
-- description        : Detail fasilitas (misal: 'Termasuk makan siang & sertifikat')
-- total_capacity     : Kuota awal
-- remaining_capacity : Sisa stok
-- max_per_order 			: Maksimal pembelian dalam satu kali transaksi
-- sales_start_date 	: Kapan tiket mulai bisa dibeli
-- sales_end_date 		: Kapan penjualan ditutup (misal: H-1 acara)
-- sort_order INT 		: Untuk urutan tampilan di aplikasi (VIP di atas, early bird dll)
-- ======================
CREATE TABLE event_ticket (
    id INT AUTO_INCREMENT PRIMARY KEY,
    event_id INT NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,      
    description TEXT,               
    price DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
    total_capacity INT NOT NULL,     
    remaining_capacity INT NOT NULL, 
		max_per_order INT DEFAULT 5,
    sales_start_date DATETIME,
    sales_end_date DATETIME,
    is_active BOOLEAN DEFAULT TRUE,
		sort_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ======================
-- 22. user_tickets
-- ======================
-- user_id 					: pemilik tiket
-- event_ticket_id 	: Jenis tiket apa (FK ke event_ticket)
-- order_id 				: Dari transaksi mana (FK ke orders)
-- check_in_at			: Waktu hadir
-- check_in_by 			: Staff yang melakukan scan (FK ke users)
-- ticket_code 			: Kode unik untuk QR Code
-- status
--     * Valid						: Tiket sah dan siap digunakan untuk masuk.
--     * Used							: Peserta sudah datang dan QR Code sudah di-scan (Check-in). Tiket ini tidak bisa di-scan lagi (mencegah duplikasi).
--  	 * Cancelled/Expired: Tiket tidak berlaku lagi karena transaksi dibatalkan atau acara sudah lewat tanpa dihadiri.
-- ======================
DROP TABLE IF EXISTS `user_tickets`;
CREATE TABLE user_tickets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    event_ticket_id INT NOT NULL REFERENCES event_ticket(id) ON DELETE CASCADE,      
    ticket_code VARCHAR(100) UNIQUE, 
    status VARCHAR(50) NOT NULL REFERENCES sys_userticket_status(name),
    check_in_at DATETIME NULL,     
    check_in_by INT NULL,          
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ======================
-- 23. sys_userticket_status
-- ======================
-- status.  							: 
--     * Valid						: Tiket sah dan siap digunakan untuk masuk.
--     * Used							: Peserta sudah datang dan QR Code sudah di-scan (Check-in). Tiket ini tidak bisa di-scan lagi (mencegah duplikasi).
--  	 * Cancelled/Expired: Tiket tidak berlaku lagi karena transaksi dibatalkan atau acara sudah lewat tanpa dihadiri.
-- display_name 					: Nama untuk User (misal: 'Siap Digunakan')
-- description  					: Penjelasan fungsi status
-- color_code 						: Kode warna untuk UI (misal: '#28a745')
-- ======================
DROP TABLE IF EXISTS `sys_userticket_status`;
CREATE TABLE sys_userticket_status (
    name VARCHAR(50) UNIQUE PRIMARY KEY, 
		display_name VARCHAR(50) NOT NULL, 
		description VARCHAR(255),
		color_code VARCHAR(10)
);


-- ======================
-- 24. orders_status
-- ======================
-- status 								: ('pending', 'paid', 'cancelled', 'refunded') 
-- display_name 					: Nama untuk User (misal: 'Siap Digunakan')
-- description  					: Penjelasan fungsi status
-- color_code 						: Kode warna untuk UI (misal: '#28a745')
-- ======================
DROP TABLE IF EXISTS `orders_status`;
CREATE TABLE orders_status (
    name VARCHAR(50) UNIQUE PRIMARY KEY, 
		display_name VARCHAR(50) NOT NULL, 
		description VARCHAR(255),
		color_code VARCHAR(10)
);

-- ======================
-- 25. orders
-- ======================
-- Tabel Utama Pesanan
DROP TABLE IF EXISTS `orders`;
CREATE TABLE `orders` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `user_id` INT NOT NULL,
    `order_code` VARCHAR(50) UNIQUE NOT NULL,
    `total_amount` DECIMAL(15, 2) NOT NULL,
		`status` VARCHAR(50) NOT NULL REFERENCES orders_status(name),
    `payment_method` VARCHAR(50),
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ======================
-- 26. order_items
-- ======================

DROP TABLE IF EXISTS `order_items`;
CREATE TABLE `order_items` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `order_id` INT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    `event_ticket_id` INT NOT NULL REFERENCES event_ticket(id),
		`event_date` DATETIME NOT NULL,     
    `quantity` INT NOT NULL,
    `unit_price` DECIMAL(15, 2) NOT NULL,
    `subtotal` DECIMAL(15, 2) NOT NULL
);


-- ======================
-- 27. facilities
-- ======================
DROP TABLE IF EXISTS `facilities`;
CREATE TABLE facilities (
    id INT AUTO_INCREMENT PRIMARY KEY,
		events_organizer_id INT NOT NULL REFERENCES events_organizer(id) ON DELETE CASCADE,
		user_id_pic INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,      -- Contoh: 'Lapangan Tenis A', 'PS5 Room 1'
    category ENUM('Sports', 'Gaming', 'Music', 'Others') NOT NULL,
    description TEXT,
    is_available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ======================
-- 28. facility_pricing
-- ======================
CREATE TABLE facility_pricing (
    id INT AUTO_INCREMENT PRIMARY KEY,
    facility_id INT NOT NULL REFERENCES facilities(id) ON DELETE CASCADE,
    day_type ENUM('Weekday', 'Weekend', 'Holiday') DEFAULT 'Weekday',
    start_time TIME,                 -- Jam operasional mulai (08:00)
    end_time TIME,                   -- Jam operasional selesai (22:00)
    price_per_hour DECIMAL(15, 2) NOT NULL
);

-- ======================
-- 29. facility_bookings
-- ======================
CREATE TABLE facility_bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    facility_id INT NOT NULL REFERENCES facilities(id) ON DELETE CASCADE,
		facility_code VARCHAR(50) UNIQUE NOT NULL,
    booking_date DATE NOT NULL,
    start_time TIME NOT NULL,        -- Jam mulai sewa
    end_time TIME NOT NULL,          -- Jam selesai sewa
    total_hours DECIMAL(4,2),        -- Contoh: 2.5 jam
    total_price DECIMAL(15, 2),
    status  VARCHAR(50) NOT NULL REFERENCES facilitybooking_status(name),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ======================
-- 30. facilitybooking_status
-- ======================
-- status 								: ('pending', 'paid', 'cancelled', 'refunded') 
-- display_name 					: Nama untuk User (misal: 'Siap Digunakan')
-- description  					: Penjelasan fungsi status
-- color_code 						: Kode warna untuk UI (misal: '#28a745')
-- ======================
DROP TABLE IF EXISTS `facilitybooking_status`;
CREATE TABLE facilitybooking_status (
    name VARCHAR(50) UNIQUE PRIMARY KEY, 
		display_name VARCHAR(50) NOT NULL, 
		description VARCHAR(255),
		color_code VARCHAR(10)
);



