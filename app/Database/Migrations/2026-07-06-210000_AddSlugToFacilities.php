<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class AddSlugToFacilities extends Migration
{
    public function up()
    {
        // ── Add slug column ───────────────────────────────────────────────────
        $this->forge->addColumn('facilities', [
            'slug' => [
                'type' => 'VARCHAR',
                'constraint' => 255,
                'null' => true,
                'default' => null,
                'after' => 'name',
            ],
        ]);

        // ── Backfill existing rows ────────────────────────────────────────────
        // Generate slug from name for every existing facility.
        // Handles duplicates by appending the row id.
        $facilities = $this->db->table('facilities')
            ->select('id, name')
            ->get()
            ->getResultArray();

        $usedSlugs = [];

        foreach ($facilities as $facility) {
            $base = strtolower(preg_replace('/[^a-z0-9]+/i', '-', trim($facility['name'])));
            $base = trim($base, '-') ?: 'facility';

            $slug = $base;

            // Deduplicate within this batch
            if (in_array($slug, $usedSlugs)) {
                $slug = $base . '-' . $facility['id'];
            }

            $usedSlugs[] = $slug;

            $this->db->table('facilities')
                ->where('id', $facility['id'])
                ->update(['slug' => $slug]);
        }

        // ── Add unique index after backfill (no nulls left) ───────────────────
        $this->db->query('ALTER TABLE `facilities` ADD UNIQUE INDEX `idx_facilities_slug` (`slug`)');
    }

    public function down()
    {
        $this->db->query('ALTER TABLE `facilities` DROP INDEX `idx_facilities_slug`');
        $this->forge->dropColumn('facilities', 'slug');
    }
}
