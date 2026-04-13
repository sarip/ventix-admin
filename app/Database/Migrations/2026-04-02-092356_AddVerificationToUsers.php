<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class AddVerificationToUsers extends Migration
{
    public function up()
    {
        $fields = [
            'verification_token' => [
                'type' => 'VARCHAR',
                'constraint' => '100',
                'null' => true,
                'after' => 'status'
            ],
            'email_verified_at' => [
                'type' => 'DATETIME',
                'null' => true,
                'after' => 'verification_token'
            ],
        ];
        $this->forge->addColumn('users', $fields);
    }

    public function down()
    {
        $this->forge->dropColumn('users', ['verification_token', 'email_verified_at']);
    }
}
