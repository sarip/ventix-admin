<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class AddLegalityToEO extends Migration
{
    public function up()
    {
        $fields = [
            'organization_type' => [
                'type' => 'ENUM',
                'constraint' => ['PT', 'UMKM', 'Komunitas'],
                'null' => true,
                'after' => 'company_name'
            ],
            'legal_doc_path' => [
                'type' => 'VARCHAR',
                'constraint' => 255,
                'null' => true,
                'after' => 'organization_type'
            ],
        ];
        $this->forge->addColumn('events_organizer', $fields);
    }

    public function down()
    {
        $this->forge->dropColumn('events_organizer', 'organization_type');
        $this->forge->dropColumn('events_organizer', 'legal_doc_path');
    }
}
