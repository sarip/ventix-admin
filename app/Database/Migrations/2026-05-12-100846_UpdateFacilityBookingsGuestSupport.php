<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class UpdateFacilityBookingsGuestSupport extends Migration
{
    public function up()
    {
        /**
         * MODIFY user_id nullable
         */
        $this->forge->modifyColumn('facility_bookings', [
            'user_id' => [
                'type' => 'INT',
                'null' => true,
            ],
        ]);

        /**
         * ADD guest support columns
         */
        $this->forge->addColumn('facility_bookings', [
            'guest_name' => [
                'type'       => 'VARCHAR',
                'constraint' => 150,
                'null'       => true,
                'after'      => 'user_id',
            ],

            'guest_email' => [
                'type'       => 'VARCHAR',
                'constraint' => 100,
                'null'       => true,
                'after'      => 'guest_name',
            ],

            'guest_phone' => [
                'type'       => 'VARCHAR',
                'constraint' => 20,
                'null'       => true,
                'after'      => 'guest_email',
            ],

            'booking_source' => [
                'type'       => 'ENUM',
                'constraint' => ['MEMBER', 'GUEST'],
                'default'    => 'MEMBER',
                'after'      => 'guest_phone',
            ],

            'subtotal_amount' => [
                'type'       => 'DECIMAL',
                'constraint' => '15,2',
                'default'    => 0,
                'after'      => 'total_price',
            ],

            'admin_fee_amount' => [
                'type'       => 'DECIMAL',
                'constraint' => '15,2',
                'default'    => 0,
                'after'      => 'subtotal_amount',
            ],

            'access_token' => [
                'type'       => 'VARCHAR',
                'constraint' => 100,
                'null'       => true,
                'after'      => 'facility_code',
            ]
        ]);

        /**
         * Sync existing booking data
         */
        $this->db->query("
            UPDATE facility_bookings
            SET
                subtotal_amount = total_price,
                admin_fee_amount = 0
            WHERE
                subtotal_amount IS NULL
                OR subtotal_amount = 0
        ");

       
    }

    public function down()
    {
        /**
         * Remove added columns
         */
        $this->forge->dropColumn('facility_bookings', [
            'guest_name',
            'guest_email',
            'guest_phone',
            'booking_source',
            'subtotal_amount',
            'admin_fee_amount',
            'access_token',
        ]);

        /**
         * Restore user_id NOT NULL
         */
        $this->forge->modifyColumn('facility_bookings', [
            'user_id' => [
                'type' => 'INT',
                'null' => false,
            ],
        ]);

        
    }
}
