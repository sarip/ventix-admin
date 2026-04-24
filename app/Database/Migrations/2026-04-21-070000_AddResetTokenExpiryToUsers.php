<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class AddResetTokenExpiryToUsers extends Migration
{
    public function up()
    {
        $fields = [
            'reset_token_expiry' => [
                'type' => 'DATETIME',
                'null' => true,
                'after' => 'verification_token',
            ],
        ];
        $this->forge->addColumn('users', $fields);
    }

    public function down()
    {
        $this->forge->dropColumn('users', ['reset_token_expiry']);
    }
}
