<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class CreateFacilityGallery extends Migration
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
            'image' => [
                'type' => 'VARCHAR',
                'constraint' => '255',
                'null' => false,
                'comment' => 'Path to image file',
            ],
            'title' => [
                'type' => 'VARCHAR',
                'constraint' => '255',
                'null' => true,
            ],
            'description' => [
                'type' => 'TEXT',
                'null' => true,
            ],
            'sort_order' => [
                'type' => 'INT',
                'constraint' => 11,
                'default' => 0,
                'comment' => 'Order for display',
            ],
            'is_featured' => [
                'type' => 'TINYINT',
                'constraint' => 1,
                'default' => 0,
                'comment' => '1 if this is featured image',
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
        $this->forge->addKey('is_featured');
        $this->forge->createTable('facility_gallery');
    }

    public function down()
    {
        $this->forge->dropTable('facility_gallery');
    }
}
