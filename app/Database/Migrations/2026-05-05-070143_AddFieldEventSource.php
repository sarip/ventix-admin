<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class AddFieldEventSource extends Migration
{
    public function up()
    {
        $fields = [
            'is_external' => [
                'type'       => 'ENUM',
                'constraint' => ['Y', 'N'],
                'default'    => 'N',
                'null'       => false,
                'after'      => 'id', // opsional
            ],
            'external_url' => [
                'type'       => 'VARCHAR',
                'constraint' => 500,
                'null'       => true,
                'after'      => 'is_external',
            ],
        ];

        $this->forge->addColumn('events', $fields);
    }

    public function down()
    {
        $this->forge->dropColumn('events', ['is_external', 'external_url']);
    }
}