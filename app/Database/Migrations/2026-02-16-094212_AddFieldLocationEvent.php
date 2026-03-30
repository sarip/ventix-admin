<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class AddFieldLocationEvent extends Migration
{
    public function up()
    {
        $this->forge->addColumn('events', [
            'location' => [
                'type'       => 'VARCHAR',
                'constraint' => 255,
                'null'       => true,
                'default'    => null,
                'after'      => 'location_name',
            ],
        ]);
    }

    public function down()
    {
        $this->forge->dropColumn('events', 'location');
    }
}
