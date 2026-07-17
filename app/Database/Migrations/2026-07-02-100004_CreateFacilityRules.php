<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class CreateFacilityRules extends Migration
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
            'facility_id' => [
                'type' => 'INT',
                'constraint' => 11,
                'unsigned' => true,
                'null' => false,
            ],
            'rule_text' => [
                'type' => 'TEXT',
                'null' => false,
                'comment' => 'Rule description',
            ],
            'sort_order' => [
                'type' => 'INT',
                'constraint' => 11,
                'default' => 0,
                'comment' => 'Order for display',
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
        $this->forge->addKey('facility_id');
        $this->forge->createTable('facility_rules');
    }

    public function down()
    {
        $this->forge->dropTable('facility_rules');
    }
}
