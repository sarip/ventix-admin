<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class AddVerificationToEO extends Migration
{
    public function up()
    {
        $this->forge->addColumn('events_organizer', [
            'verification_status' => [
                'type' => 'ENUM',
                'constraint' => ['Pending', 'Approved', 'Rejected'],
                'default' => 'Pending',
                'after' => 'legal_doc_path'
            ],
            'verified_at' => [
                'type' => 'DATETIME',
                'null' => true,
                'after' => 'verification_status'
            ],
            'verified_by' => [
                'type' => 'INT',
                'constraint' => 11,
                'unsigned' => true,
                'null' => true,
                'after' => 'verified_at'
            ],
            'verification_note' => [
                'type' => 'TEXT',
                'null' => true,
                'after' => 'verified_by'
            ],
        ]);
    }

    public function down()
    {
        $this->forge->dropColumn('events_organizer', ['verification_status', 'verified_at', 'verified_by', 'verification_note']);
    }
}
