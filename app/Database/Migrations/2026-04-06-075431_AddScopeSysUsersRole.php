<?php

namespace App\Database\Migrations;

use App\Models\SysUsersRole;
use CodeIgniter\Database\Migration;

class AddScopeSysUsersRole extends Migration
{
    public function up()
    {
        $fields = [
            'scope' => [
                'type'       => 'ENUM',
                'constraint' => ['SUPERADMIN', 'EO', 'GUEST'],
                'null'       => false,
                'after'      => 'description',
                'default'    => 'GUEST'
            ],
        ];
        $this->forge->addColumn('sys_users_role', $fields);


        $this->db->table('sys_users_role')
            ->whereIn('role_name', ['EO Admin', 'EO Finance', 'EO Staff', 'Vendor'])
            ->update(['scope' => 'EO']);
    }

    public function down()
    {
        $this->forge->dropColumn('sys_users_role', 'scope');
    }
}
