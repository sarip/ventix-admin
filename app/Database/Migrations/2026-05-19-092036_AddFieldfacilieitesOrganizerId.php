<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class UpdateFacilitiesOrganizerField extends Migration
{
    public function up()
    {
        // Hapus field lama jika ada
        if ($this->db->fieldExists('event_organizer_id', 'facilities')) {
            $this->forge->dropColumn('facilities', 'event_organizer_id');
        }

        // Tambah field baru jika belum ada
        if (! $this->db->fieldExists('facility_organizer_id', 'facilities')) {

            $this->forge->addColumn('facilities', [
                'facility_organizer_id' => [
                    'type'       => 'INT',
                    'constraint' => 11,
                    'null'       => true,
                    'after'      => 'id',
                ],
            ]);

            // Add index
            $this->db->query("
                ALTER TABLE facilities
                ADD INDEX idx_facility_organizer_id (facility_organizer_id)
            ");
        }
    }

    public function down()
    {
        // Drop index
        $this->db->query("
            ALTER TABLE facilities
            DROP INDEX idx_facility_organizer_id
        ");

        // Drop field baru
        if ($this->db->fieldExists('facility_organizer_id', 'facilities')) {
            $this->forge->dropColumn('facilities', 'facility_organizer_id');
        }

        // Restore field lama
        if (! $this->db->fieldExists('event_organizer_id', 'facilities')) {

            $this->forge->addColumn('facilities', [
                'event_organizer_id' => [
                    'type'       => 'INT',
                    'constraint' => 11,
                    'null'       => true,
                    'after'      => 'id',
                ],
            ]);
        }
    }
}