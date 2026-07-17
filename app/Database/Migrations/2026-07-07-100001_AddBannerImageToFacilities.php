<?php

/**
 * Migration file for adding banner_image field to facilities table
 * @author Sarip Hidayat <hidayatsarip2210@gmail.com>
 * @date 2026-07-07
 */

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class AddBannerImageToFacilities extends Migration
{
    public function up()
    {
        $this->forge->addColumn('facilities', [
            'banner_image' => [
                'type' => 'VARCHAR',
                'constraint' => 255,
                'null' => true,
                'after' => 'longitude',
                'comment' => 'Banner image for facility display'
            ]
        ]);
    }

    public function down()
    {
        $this->forge->dropColumn('facilities', 'banner_image');
    }
}
