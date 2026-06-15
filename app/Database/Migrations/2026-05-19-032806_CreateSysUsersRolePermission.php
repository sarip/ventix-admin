<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class CreateSysUsersRolePermission extends Migration
{
    public function up()
    {
        $this->forge->dropTable(
            'sys_users_role_permission',
            true
        );

        $this->forge->addField([

            'id' => [
                'type' => 'BIGINT',
                'unsigned' => true,
                'auto_increment' => true,
            ],

            'role_name' => [
                'type' => 'VARCHAR',
                'constraint' => 50,
            ],

            'module_slug' => [
                'type' => 'VARCHAR',
                'constraint' => 100,
            ],

            'can_read' => [
                'type' => 'TINYINT',
                'constraint' => 1,
                'default' => 0,
            ],

            'can_create' => [
                'type' => 'TINYINT',
                'constraint' => 1,
                'default' => 0,
            ],

            'can_update' => [
                'type' => 'TINYINT',
                'constraint' => 1,
                'default' => 0,
            ],

            'can_delete' => [
                'type' => 'TINYINT',
                'constraint' => 1,
                'default' => 0,
            ],

            'created_at' => [
                'type' => 'DATETIME',
                'null' => true,
            ],
        ]);

        $this->forge->addKey(
            'id',
            true
        );

        $this->forge->addUniqueKey(
            ['role_name', 'module_slug'],
            'uq_role_module'
        );

        // $this->forge->addForeignKey(
        //     'role_name',
        //     'sys_users_role',
        //     'role_name',
        //     'CASCADE',
        //     'CASCADE'
        // );

        // $this->forge->addForeignKey(
        //     'module_slug',
        //     'sys_modules',
        //     'module_slug',
        //     'CASCADE',
        //     'CASCADE'
        // );

        $this->forge->createTable(
            'sys_users_role_permission'
        );
    }

    public function down()
    {
        $this->forge->dropTable(
            'sys_users_role_permission',
            true
        );
    }
}