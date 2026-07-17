<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class CreateFacilityFeatures extends Migration
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
            'feature_name' => [
                'type' => 'VARCHAR',
                'constraint' => '255',
                'null' => false,
                'comment' => 'e.g., Total Court, Capacity, Lighting',
            ],
            'feature_value' => [
                'type' => 'VARCHAR',
                'constraint' => '255',
                'null' => false,
                'comment' => 'e.g., 8, 500, LED',
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
        $this->forge->createTable('facility_features');
    }

    public function down()
    {
        $this->forge->dropTable('facility_features');
    }
}
