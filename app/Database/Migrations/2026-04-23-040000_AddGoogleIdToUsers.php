<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class AddGoogleIdToUsers extends Migration
{
    public function up()
    {
        $fields = [
            'google_id' => [
                'type' => 'VARCHAR',
                'constraint' => 255,
                'null' => true,
                'default' => null,
                'after' => 'email',
            ],
        ];
        $this->forge->addColumn('users', $fields);

        // Add unique index so one Google account links to one user
        $this->forge->addKey('google_id', false, true, 'google_id_unique');
        // Note: addKey with unique=true after table creation
        // Use direct query for unique index
        $this->db->query('ALTER TABLE `users` ADD UNIQUE INDEX `google_id_unique` (`google_id`)');
    }

    public function down()
    {
        $this->forge->dropColumn('users', 'google_id');
    }
}
