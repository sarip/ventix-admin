<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class AddCategoryAndStatusEvent extends Migration
{
    public function up()
    {
        $db = \Config\Database::connect();
        $db->transStart();

        // Insert ke tabel event status
        $db->table('events_status')->insert([
            'name' => 'closed',
            'description' => 'Pendaftaran telah ditutup / Event tidak lagi tersedia'
        ]);

        // Insert batch ke tabel event categories
        $eventCategories = [
            [ 'name' => "career_expo", 'description' => "Pameran karier dan peluang kerja" ],
            [ 'name' => "meetup", 'description' => "Pertemuan komunitas atau networking informal" ],
            [ 'name' => "webinar", 'description' => "Acara edukasi atau presentasi secara online" ],
            [ 'name' => "competition", 'description' => "Lomba atau kompetisi non-game"]
        ];

        $db->table('events_cat')->insertBatch($eventCategories);

        $db->transComplete();
    }

    public function down()
    {
        $db = \Config\Database::connect();
        $db->transStart();

        // Delete status
        $db->table('events_status')
            ->where('name', 'closed')
            ->delete();

        // Delete categories
        $db->table('events_categories')
            ->whereIn('name', ['career_expo','meetup','webinar','competition'])
            ->delete();

        $db->transComplete();
    }
}