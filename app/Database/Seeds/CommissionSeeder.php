<?php

namespace App\Database\Seeds;

use CodeIgniter\Database\Seeder;

class CommissionSeeder extends Seeder
{
    public function run()
    {
        $data = [
            // Event Organizer rules
            [
                'module' => 'event',
                'rule_key' => 'eo_fee',
                'percentage' => 6.00,
                'fixed_amount' => 0.00,
                'is_active' => 1,
                'created_at' => date('Y-m-d H:i:s'),
                'updated_at' => date('Y-m-d H:i:s'),
            ],
            [
                'module' => 'event',
                'rule_key' => 'guest_fee',
                'percentage' => 5.00,
                'fixed_amount' => 0.00,
                'is_active' => 1,
                'created_at' => date('Y-m-d H:i:s'),
                'updated_at' => date('Y-m-d H:i:s'),
            ],
            // Facility rules
            [
                'module' => 'facility',
                'rule_key' => 'facility_fee',
                'percentage' => 5.00,
                'fixed_amount' => 0.00,
                'is_active' => 1,
                'created_at' => date('Y-m-d H:i:s'),
                'updated_at' => date('Y-m-d H:i:s'),
            ],
            [
                'module' => 'facility',
                'rule_key' => 'guest_fee',
                'percentage' => 8.00,
                'fixed_amount' => 0.00,
                'is_active' => 1,
                'created_at' => date('Y-m-d H:i:s'),
                'updated_at' => date('Y-m-d H:i:s'),
            ],
        ];

        // Using Query Builder
        $this->db->table('commission_rules')->insertBatch($data);
    }
}
