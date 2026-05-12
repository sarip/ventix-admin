<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class UpdateEventStatusWorkflow extends Migration
{
    public function up()
    {
        /**
         * ============================================
         * 1. HAPUS STATUS LAMA
         * ============================================
         */

        $this->db->table('events_status')
            ->whereIn('name', [
                'upcoming',
                'ongoing',
                'finished'
            ])
            ->delete();

        /**
         * ============================================
         * 2. TAMBAH STATUS LAUNCH
         * ============================================
         */

        $exists = $this->db->table('events_status')
            ->where('name', 'launch')
            ->countAllResults();

        if (!$exists) {
            $this->db->table('events_status')->insert([
                'name'        => 'launch',
                'description' => 'Event dipublish'
            ]);
        }

        /**
         * ============================================
         * 3. MIGRASI DATA EVENT
         * ============================================
         */

        $this->db->table('events')
            ->whereIn('events_status', [
                'upcoming',
                'ongoing',
                'finished'
            ])
            ->update([
                'events_status' => 'launch'
            ]);
    }

    public function down()
    {
        /**
         * ============================================
         * 1. HAPUS STATUS LAUNCH
         * ============================================
         */

        $this->db->table('events_status')
            ->where('name', 'launch')
            ->delete();

        /**
         * ============================================
         * 2. RESTORE STATUS LAMA
         * ============================================
         */

        $statuses = [
            [
                'name' => 'upcoming',
                'description' => 'Pendaftaran dibuka / segera hadir'
            ],
            [
                'name' => 'ongoing',
                'description' => 'Event sedang berlangsung'
            ],
            [
                'name' => 'finished',
                'description' => 'Event telah selesai dilaksanakan'
            ]
        ];

        foreach ($statuses as $status) {

            $exists = $this->db->table('events_status')
                ->where('name', $status['name'])
                ->countAllResults();

            if (!$exists) {
                $this->db->table('events_status')
                    ->insert($status);
            }
        }

        /**
         * ============================================
         * 3. ROLLBACK EVENT STATUS
         * ============================================
         */

        $this->db->table('events')
            ->where('events_status', 'launch')
            ->update([
                'events_status' => 'upcoming'
            ]);
    }
}