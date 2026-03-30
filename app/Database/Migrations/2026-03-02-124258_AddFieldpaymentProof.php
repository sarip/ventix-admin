<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class AddFieldpaymentProof extends Migration
{
    public function up()
    {
        $this->db->query("
                    ALTER TABLE `facility_bookings`
                    ADD COLUMN `payment_proof` VARCHAR(255) NULL
                    AFTER `status`
                ");
        $this->db->query("ALTER TABLE `orders` ADD COLUMN `payment_proof` VARCHAR(255) NULL AFTER `status`;");
    }

    public function down()
    {
        $this->db->query("ALTER TABLE `facility_bookings` DROP COLUMN `payment_proof`;");
        $this->db->query("ALTER TABLE `orders` DROP COLUMN `payment_proof`;");
    }
}
