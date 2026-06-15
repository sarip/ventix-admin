<?php

namespace App\Database\Seeds;

use CodeIgniter\Database\Seeder;

class SysUsersRoleFOSeeder extends Seeder
{
    public function run()
    {
        $db = \Config\Database::connect();

        // Ambil semua role dengan scope EO
        $eoRoles = $db->table('sys_users_role')
            ->where('scope', 'EO')
            ->get()
            ->getResultArray();

        $insertData = [];

        foreach ($eoRoles as $role) {
            // Skip jika role FO sudah ada
            $exists = $db->table('sys_users_role')
                ->where('role_slug', str_replace('eo_', 'fo_', strtolower($role['role_slug'])))
                ->countAllResults();

            if ($exists > 0) {
                continue;
            }

            $newRoleName = str_replace('EO', 'FO', $role['role_name']);
            $newDisplayName = str_replace('EO', 'FO', $role['display_name']);
            $newRoleSlug = str_replace('eo_', 'fo_', strtolower($role['role_slug']));
            $newDescription = str_replace('EO', 'FO', $role['description']);

            // fallback jika tidak ada prefix eo_
            if ($newRoleSlug === strtolower($role['role_slug'])) {
                $newRoleSlug = 'fo_' . strtolower($role['role_slug']);
            }

            $insertData[] = [
                'role_name'   => $newRoleName,
                'display_name'=> $newDisplayName,
                'role_slug'   => $newRoleSlug,
                'description' => $newDescription,
                'scope'       => 'EO',
                'created_at'  => date('Y-m-d H:i:s'),
                'updated_at'  => date('Y-m-d H:i:s'),
            ];
        }

        if (!empty($insertData)) {
            $db->table('sys_users_role')->insertBatch($insertData);
        }
    }
}