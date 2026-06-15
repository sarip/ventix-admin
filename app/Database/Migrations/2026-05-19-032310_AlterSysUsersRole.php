<?php

namespace App\Database\Migrations;

use App\Models\SysUsersRole;
use CodeIgniter\Database\Migration;

class AlterSysUsersRole extends Migration
{
    public function up()
    {
        $fields = [

            'display_name' => [
                'type' => 'VARCHAR',
                'constraint' => 100,
                'null' => true,
                'after' => 'role_name',
            ],

        
        ];

        $this->forge->addColumn(
            'sys_users_role',
            $fields
        );


        $Model = new SysUsersRole();
        $datas = $Model->findAll();
        $db = \Config\Database::connect();
        
        foreach ($datas as $data) {
           $db->table('sys_users_role')->where('role_name', $data->role_name)->update(
                [
                    'display_name' => $data->role_name,
                ]
            );
        }
    }

    public function down()
    {
        $this->forge->dropColumn(
            'sys_users_role',
            [
                'display_name',
                'description',
                'scope',
                'created_at',
            ]
        );
    }
}