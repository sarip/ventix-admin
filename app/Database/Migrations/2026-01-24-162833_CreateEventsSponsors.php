<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class CreateEventsSponsors extends Migration
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
            'logo_url' => [
                'type' => 'VARCHAR',
                'constraint' => '255',
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
        $this->forge->createTable('events_sponsors');
    }

    public function down()
    {
        $this->forge->dropTable('events_sponsors');
    }
}
