<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class CreateMasterTaxes extends Migration
{
    public function up()
    {
        $this->forge->addField([
            'id' => [
                'type'           => 'INT',
                'constraint'     => 11,
                'unsigned'       => true,
                'auto_increment' => true,
            ],
            'code' => [
                'type'       => 'VARCHAR',
                'constraint' => 20,
            ],
            'name' => [
                'type'       => 'VARCHAR',
                'constraint' => 100,
            ],
            'rate' => [
                'type'       => 'DECIMAL',
                'constraint' => '5,2',
                'default'    => 0,
            ],
            'is_active' => [
                'type'    => 'BOOLEAN',
                'default' => true,
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
        $this->forge->createTable('master_taxes');


        $data = [
            [
                'code' => 'PPN',
                'name' => 'PPN Jasa Event Organizer',
                'rate' => 11.00,
            ],
            [
                'code' => 'PPH21',
                'name' => 'PPh 21 Honor Talent / MC',
                'rate' => 5.00,
            ],
            [
                'code' => 'PPH23',
                'name' => 'PPh 23 Vendor Jasa',
                'rate' => 2.00,
            ],
            [
                'code' => 'PPH4_2',
                'name' => 'PPh Final 4(2) Sewa Gedung',
                'rate' => 10.00,
            ],
        ];

        $this->db->table('master_taxes')->insertBatch($data);
    }

    public function down()
    {
        $this->forge->dropTable('master_taxes');
    }
}
