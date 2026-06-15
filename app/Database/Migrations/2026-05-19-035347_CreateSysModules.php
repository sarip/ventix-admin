<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class CreateSysModules extends Migration
{
    public function up()
    {
        $this->forge->dropTable(
            'sys_modules',
            true
        );

        $this->forge->addField([

            'id' => [
                'type'           => 'BIGINT',
                'constraint'     => 20,
                'unsigned'       => true,
                'auto_increment' => true,
            ],

            'parent_id' => [
                'type'       => 'BIGINT',
                'constraint' => 20,
                'unsigned'   => true,
                'null'       => true,
            ],

            'module_name' => [
                'type'       => 'VARCHAR',
                'constraint' => 100,
            ],

            'module_slug' => [
                'type'       => 'VARCHAR',
                'constraint' => 100,
            ],

            'group_name' => [
                'type'       => 'VARCHAR',
                'constraint' => 100,
                'null'       => true,
            ],

            'path' => [
                'type'       => 'VARCHAR',
                'constraint' => 255,
                'null'       => true,
            ],

            'icon' => [
                'type'       => 'VARCHAR',
                'constraint' => 100,
                'null'       => true,
            ],

            'endpoint' => [
                'type'       => 'VARCHAR',
                'constraint' => 255,
                'null'       => true,
            ],

            'tooltip' => [
                'type'       => 'VARCHAR',
                'constraint' => 255,
                'null'       => true,
            ],

            'is_sidebar' => [
                'type'       => 'TINYINT',
                'constraint' => 1,
                'default'    => 1,
            ],

            'is_group' => [
                'type'       => 'TINYINT',
                'constraint' => 1,
                'default'    => 0,
            ],

            'is_superadmin' => [
                'type'       => 'TINYINT',
                'constraint' => 1,
                'default'    => 0,
            ],

            'sort_order' => [
                'type'       => 'INT',
                'default'    => 0,
            ],

            'created_at' => [
                'type' => 'DATETIME',
                'null' => true,
            ],

            'updated_at' => [
                'type' => 'DATETIME',
                'null' => true,
            ],
        ]);

        $this->forge->addKey('id', true);

        $this->forge->addUniqueKey(
            'module_slug',
            'uq_module_slug'
        );

        $this->forge->addKey('parent_id');
        $this->forge->addKey('group_name');

        $this->forge->createTable('sys_modules');

        // $this->db->query("
        //     ALTER TABLE sys_modules
        //     ADD CONSTRAINT fk_sys_modules_parent
        //     FOREIGN KEY (parent_id)
        //     REFERENCES sys_modules(id)
        //     ON DELETE CASCADE
        //     ON UPDATE CASCADE
        // ");
    }

    public function down()
    {
        $this->forge->dropTable(
            'sys_modules',
            true
        );
    }
}