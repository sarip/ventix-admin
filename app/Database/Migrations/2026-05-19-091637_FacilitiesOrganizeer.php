<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class FacilitiesOrganizeer extends Migration
{
    public function up()
    {
        $this->db->query("CREATE TABLE `facilities_organizer` (
                    `id` int NOT NULL AUTO_INCREMENT,
                    `owner_user_id` int DEFAULT NULL,
                    `facility_name` varchar(255) NOT NULL,
                    `company_name` varchar(255) DEFAULT NULL,
                    `legal_doc_path` varchar(255) DEFAULT NULL,
                    `verification_status` enum('Pending','Approved','Rejected') DEFAULT 'Pending',
                    `verified_at` datetime DEFAULT NULL,
                    `verified_by` int unsigned DEFAULT NULL,
                    `verification_note` text,
                    `email` varchar(100) NOT NULL,
                    `phone` varchar(20) DEFAULT NULL,
                    `website` varchar(255) DEFAULT NULL,
                    `address` text,
                    `logo_path` varchar(255) DEFAULT NULL,
                    `tax_id` varchar(50) DEFAULT NULL,
                    `description` text,
                    `facility_slug` varchar(100) DEFAULT NULL,
                    `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
                    `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                    PRIMARY KEY (`id`),
                    UNIQUE KEY `email` (`email`),
                    UNIQUE KEY `facility_slug` (`facility_slug`),
                    KEY `idx_owner_user_id` (`owner_user_id`)
            )");
    }

    public function down()
    {
        $this->db->query("DROP TABLE IF EXISTS `facilities_organizer`");
    }
}
