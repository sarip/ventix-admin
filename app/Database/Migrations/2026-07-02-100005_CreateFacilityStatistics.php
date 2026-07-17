<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class CreateFacilityStatistics extends Migration
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
                'comment' => 'Foreign key to facilities table',
            ],
            'total_bookings' => [
                'type' => 'INT',
                'constraint' => 11,
                'default' => 0,
                'comment' => 'Total number of bookings',
            ],
            'total_revenue' => [
                'type' => 'DECIMAL',
                'constraint' => '15,2',
                'default' => 0.00,
                'comment' => 'Total revenue from bookings',
            ],
            'total_visitors' => [
                'type' => 'INT',
                'constraint' => 11,
                'default' => 0,
                'comment' => 'Total unique visitors',
            ],
            'total_events' => [
                'type' => 'INT',
                'constraint' => 11,
                'default' => 0,
                'comment' => 'Total events held at facility',
            ],
            'total_followers' => [
                'type' => 'INT',
                'constraint' => 11,
                'default' => 0,
                'comment' => 'Total followers of facility',
            ],
            'total_reviews' => [
                'type' => 'INT',
                'constraint' => 11,
                'default' => 0,
                'comment' => 'Total number of reviews',
            ],
            'average_rating' => [
                'type' => 'DECIMAL',
                'constraint' => '3,2',
                'default' => 0.00,
                'comment' => 'Average rating (0.00 - 5.00)',
            ],
            'last_calculated_at' => [
                'type' => 'DATETIME',
                'null' => true,
                'comment' => 'Last time statistics were calculated',
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
        // $this->forge->addUniqueKey('facility_id');
        $this->forge->createTable('facility_statistics');
    }

    public function down()
    {
        $this->forge->dropTable('facility_statistics');
    }
}
