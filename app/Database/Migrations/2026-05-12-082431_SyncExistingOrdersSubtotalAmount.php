<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class SyncExistingOrdersSubtotalAmount extends Migration
{
    public function up()
    {
        /**
         * Sync existing orders:
         * subtotal_amount = total_amount
         * admin_fee_amount = 0
         *
         * Because old orders previously
         * did not have admin fee.
         */

        $this->db->query("
            UPDATE orders
            SET
                subtotal_amount = total_amount,
                admin_fee_amount = 0
            WHERE
                subtotal_amount IS NULL
                OR subtotal_amount = 0
        ");
    }

    public function down()
    {
        /**
         * Optional rollback
         * Reset synced values
         */

        $this->db->query("
            UPDATE orders
            SET
                subtotal_amount = 0,
                admin_fee_amount = 0
        ");
    }
}
