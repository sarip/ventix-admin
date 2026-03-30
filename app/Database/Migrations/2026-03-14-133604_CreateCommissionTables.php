<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class CreateCommissionTables extends Migration
{
    public function up()
    {
        // Commission Rules Table
        $this->forge->addField([
            'id' => [
                'type' => 'INT',
                'constraint' => 11,
                'unsigned' => true,
                'auto_increment' => true,
            ],
            'module' => [
                'type' => 'VARCHAR',
                'constraint' => '50',
                'null' => false,
                'comment' => 'e.g., event, facility, merchant',
            ],
            'rule_key' => [
                'type' => 'VARCHAR',
                'constraint' => '50',
                'null' => false,
                'comment' => 'e.g., eo_fee, guest_fee',
            ],
            'percentage' => [
                'type' => 'DECIMAL',
                'constraint' => '5,2',
                'default' => 0.00,
            ],
            'fixed_amount' => [
                'type' => 'DECIMAL',
                'constraint' => '15,2',
                'default' => 0.00,
            ],
            'is_active' => [
                'type' => 'TINYINT',
                'constraint' => 1,
                'default' => 1,
            ],
            'created_at' => [
                'type' => 'DATETIME',
                'null' => true,
            ],
            'updated_at' => [
                'type' => 'DATETIME',
                'null' => true,
            ],
        ]);
        $this->forge->addKey('id', true);
        $this->forge->addUniqueKey(['module', 'rule_key']);
        $this->forge->createTable('commission_rules');

        // Order Commissions Table (Audit/History)
        $this->forge->addField([
            'id' => [
                'type' => 'INT',
                'constraint' => 11,
                'unsigned' => true,
                'auto_increment' => true,
            ],
            'order_id' => [
                'type' => 'INT',
                'constraint' => 11,
                'unsigned' => true,
            ],
            'module' => [
                'type' => 'VARCHAR',
                'constraint' => '50',
                'null' => false,
            ],
            'rule_key' => [
                'type' => 'VARCHAR',
                'constraint' => '50',
                'null' => false,
            ],
            'base_amount' => [
                'type' => 'DECIMAL',
                'constraint' => '15,2',
                'null' => false,
                'comment' => 'Ticket price or Booking price',
            ],
            'calculated_amount' => [
                'type' => 'DECIMAL',
                'constraint' => '15,2',
                'null' => false,
            ],
            'created_at' => [
                'type' => 'DATETIME',
                'null' => true,
            ],
        ]);
        $this->forge->addKey('id', true);
        $this->forge->addKey('order_id');
        $this->forge->createTable('order_commissions');
    }

    public function down()
    {
        $this->forge->dropTable('order_commissions');
        $this->forge->dropTable('commission_rules');
    }
}
