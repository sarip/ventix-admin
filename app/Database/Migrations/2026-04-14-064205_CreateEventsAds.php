<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class CreateEventsAds extends Migration
{
    public function up()
    {
        $this->forge->addField([
            'id' => [
                'type' => 'INT',
                'constraint' => 11,
                'unsigned' => true,
                'auto_increment' => true,
            ],
            'events_id' => [
                'type' => 'INT',
                'constraint' => 11,
            ],
            'image_url' => [
                'type' => 'VARCHAR',
                'constraint' => '255',
            ],
            'sort_order' => [
                'type' => 'INT',
                'constraint' => 11,
                'default' => 0,
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
        $this->forge->addForeignKey('events_id', 'events', 'id', 'CASCADE', 'CASCADE');
        $this->forge->createTable('events_ads');
    }

    public function down()
    {
        $this->forge->dropTable('events_ads');
    }
}
