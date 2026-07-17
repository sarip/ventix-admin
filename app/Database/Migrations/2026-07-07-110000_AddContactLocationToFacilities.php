<?php

/**
 * Migration: Add email and phone contact fields to facilities table.
 *
 * NOTE: address, latitude, longitude already exist in the schema.
 * This migration only adds the missing email and phone columns.
 *
 * @author Sarip Hidayat <hidayatsarip2210@gmail.com>
 * @date 2026-07-07
 */

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class AddContactLocationToFacilities extends Migration
{
    public function up()
    {
        $fields = $this->db->getFieldNames('facilities');

        $toAdd = [];

        if (!in_array('email', $fields)) {
            $toAdd['email'] = [
                'type' => 'VARCHAR',
                'constraint' => 100,
                'null' => true,
                'default' => null,
                'after' => 'description',
                'comment' => 'Contact email for the facility',
            ];
        }

        if (!in_array('phone', $fields)) {
            $toAdd['phone'] = [
                'type' => 'VARCHAR',
                'constraint' => 20,
                'null' => true,
                'default' => null,
                'after' => 'email',
                'comment' => 'Contact phone number for the facility',
            ];
        }

        if (!empty($toAdd)) {
            $this->forge->addColumn('facilities', $toAdd);
        }
    }

    public function down()
    {
        $fields = $this->db->getFieldNames('facilities');

        $toDrop = array_intersect(['email', 'phone'], $fields);

        if (!empty($toDrop)) {
            $this->forge->dropColumn('facilities', $toDrop);
        }
    }
}
