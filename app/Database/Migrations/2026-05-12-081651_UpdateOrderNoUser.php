<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class UpdateOrderNoUser extends Migration
{
    public function up()
    {
        /**
         * ORDERS TABLE
         */
        $this->forge->modifyColumn('orders', [
            'user_id' => [
                'type'       => 'INT',
                'null'       => true,
            ],
        ]);

        $this->forge->addColumn('orders', [
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
            'order_source' => [
                'type'       => 'ENUM',
                'constraint' => ['MEMBER', 'GUEST'],
                'default'    => 'MEMBER',
                'after'      => 'guest_phone',
            ],
            'subtotal_amount' => [
                'type'       => 'DECIMAL',
                'constraint' => '15,2',
                'default'    => 0,
                'after'      => 'total_amount',
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
                'after'      => 'order_code',
            ],
        ]);

        /**
         * USER TICKETS TABLE
         */
        $this->forge->modifyColumn('user_tickets', [
            'user_id' => [
                'type'       => 'INT',
                'null'       => true,
            ],
        ]);

        $this->forge->addColumn('user_tickets', [
            'guest_name' => [
                'type'       => 'VARCHAR',
                'constraint' => 150,
                'null'       => true,
            ],
            'guest_email' => [
                'type'       => 'VARCHAR',
                'constraint' => 100,
                'null'       => true,
            ],
            'guest_phone' => [
                'type'       => 'VARCHAR',
                'constraint' => 20,
                'null'       => true,
            ],
        ]);

        /**
         * INSERT COMMISSION RULE
         */
        $existing = $this->db
            ->table('commission_rules')
            ->where('module', 'event')
            ->where('rule_key', 'guest_admin_fee')
            ->get()
            ->getRow();

        if (!$existing) {
            $this->db->table('commission_rules')->insert([
                'module'            => 'event',
                'rule_key'          => 'guest_admin_fee',
                'percentage'        => 2.00,
                'fixed_amount'      => 0,
                'is_active'         => 1,
                'created_at'        => date('Y-m-d H:i:s'),
                'updated_at'        => date('Y-m-d H:i:s'),
            ]);
        }
    }

    public function down()
    {
        /**
         * REMOVE COLUMNS ORDERS
         */
        $this->forge->dropColumn('orders', [
            'guest_name',
            'guest_email',
            'guest_phone',
            'order_source',
            'subtotal_amount',
            'admin_fee_amount',
            'access_token',
        ]);

        /**
         * RESTORE user_id NOT NULL
         */
        $this->forge->modifyColumn('orders', [
            'user_id' => [
                'type' => 'INT',
                'null' => false,
            ],
        ]);

        /**
         * REMOVE COLUMNS USER TICKETS
         */
        $this->forge->dropColumn('user_tickets', [
            'guest_name',
            'guest_email',
            'guest_phone',
        ]);

        /**
         * RESTORE user_id NOT NULL
         */
        $this->forge->modifyColumn('user_tickets', [
            'user_id' => [
                'type' => 'INT',
                'null' => false,
            ],
        ]);

        /**
         * REMOVE COMMISSION RULE
         */
        $this->db->table('commission_rules')
            ->where('module', 'event')
            ->where('rule_key', 'guest_admin_fee')
            ->delete();
    }
}
