<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class CreateCheckinTables extends Migration
{
    public function up()
    {
        // 1. Update user_tickets
        $fields = [
            'qr_token' => [
                'type'       => 'VARCHAR',
                'constraint' => 255,
                'null'       => true,
                'after'      => 'ticket_code',
            ],
            'qr_generated_at' => [
                'type' => 'DATETIME',
                'null' => true,
                'after' => 'qr_token',
            ],
            'check_in_device' => [
                'type'       => 'VARCHAR',
                'constraint' => 100,
                'null'       => true,
                'after'      => 'check_in_by',
            ],
        ];
        $this->forge->addColumn('user_tickets', $fields);

        // Add index on qr_token
        $this->db->query('ALTER TABLE user_tickets ADD INDEX idx_user_tickets_qr_token (qr_token)');

        // 2. Create Table event_ticket_checkins
        $this->forge->addField([
            'id' => [
                'type'           => 'BIGINT',
                'constraint'     => 20,
                'unsigned'       => true,
                'auto_increment' => true,
            ],
            'ticket_id' => [
                'type'       => 'INT',
                'constraint' => 11,
                'null'       => false,
            ],
            'event_id' => [
                'type'       => 'INT',
                'constraint' => 11,
                'null'       => false,
            ],
            'scan_token' => [
                'type'       => 'VARCHAR',
                'constraint' => 255,
                'null'       => false,
            ],
            'status' => [
                'type'       => 'ENUM',
                'constraint' => ['SUCCESS', 'FAILED', 'INVALID', 'ALREADY_CHECKED'],
                'default'    => 'SUCCESS',
            ],
            'message' => [
                'type'       => 'VARCHAR',
                'constraint' => 255,
                'null'       => true,
            ],
            'scanned_by' => [
                'type'       => 'INT',
                'constraint' => 11,
                'null'       => true,
            ],
            'device_id' => [
                'type'       => 'VARCHAR',
                'constraint' => 100,
                'null'       => true,
            ],
            'ip_address' => [
                'type'       => 'VARCHAR',
                'constraint' => 45,
                'null'       => true,
            ],
            'created_at' => [
                'type'    => 'DATETIME',
                'null'    => true,
            ],
        ]);
        $this->forge->addKey('id', true);
        $this->forge->addKey('ticket_id');
        $this->forge->addKey('event_id');
        $this->forge->addKey('created_at');
        $this->forge->createTable('event_ticket_checkins', true);

        // 3. Create Table event_checkin_devices
        $this->forge->addField([
            'id' => [
                'type'           => 'INT',
                'constraint'     => 11,
                'auto_increment' => true,
            ],
            'event_id' => [
                'type'       => 'INT',
                'constraint' => 11,
                'null'       => false,
            ],
            'device_name' => [
                'type'       => 'VARCHAR',
                'constraint' => 100,
                'null'       => true,
            ],
            'device_token' => [
                'type'       => 'VARCHAR',
                'constraint' => 255,
                'null'       => true,
            ],
            'location' => [
                'type'       => 'VARCHAR',
                'constraint' => 100,
                'null'       => true,
            ],
            'status' => [
                'type'       => 'ENUM',
                'constraint' => ['ACTIVE', 'INACTIVE'],
                'default'    => 'ACTIVE',
            ],
            'created_at' => [
                'type'    => 'DATETIME',
                'null'    => true,
            ],
        ]);
        $this->forge->addKey('id', true);
        $this->forge->createTable('event_checkin_devices', true);
    }

    public function down()
    {
        $this->forge->dropTable('event_checkin_devices', true);
        $this->forge->dropTable('event_ticket_checkins', true);
        $this->forge->dropColumn('user_tickets', ['qr_token', 'qr_generated_at', 'check_in_device']);
    }
}
