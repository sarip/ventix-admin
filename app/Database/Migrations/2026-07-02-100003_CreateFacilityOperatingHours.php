<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class CreateFacilityOperatingHours extends Migration
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
            'day_of_week' => [
                'type' => 'TINYINT',
                'constraint' => 1,
                'null' => false,
                'comment' => '1=Monday, 2=Tuesday, ..., 7=Sunday',
            ],
            'open_time' => [
                'type' => 'TIME',
                'null' => true,
                'comment' => 'Opening time',
            ],
            'close_time' => [
                'type' => 'TIME',
                'null' => true,
                'comment' => 'Closing time',
            ],
            'is_closed' => [
                'type' => 'TINYINT',
                'constraint' => 1,
                'default' => 0,
                'comment' => '1 if facility is closed on this day',
            ],
            'is_holiday_schedule' => [
                'type' => 'TINYINT',
                'constraint' => 1,
                'default' => 0,
                'comment' => '1 if this is special holiday schedule',
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
        $this->forge->addKey('day_of_week');
        $this->forge->addUniqueKey(['facility_id', 'day_of_week']);
        $this->forge->createTable('facility_operating_hours');
    }

    public function down()
    {
        $this->forge->dropTable('facility_operating_hours');
    }
}
