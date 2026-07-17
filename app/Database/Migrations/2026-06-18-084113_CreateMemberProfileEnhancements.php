<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class CreateMemberProfileEnhancements extends Migration
{
    public function up()
    {
        $db = \Config\Database::connect();

        // Add fields to users table defensively
        $fields = [];
        if (!$db->fieldExists('cover_photo', 'users')) {
            $fields['cover_photo'] = [
                'type' => 'VARCHAR',
                'constraint' => 255,
                'null' => true,
                'after' => 'profile_picture'
            ];
        }
        if (!$db->fieldExists('bio', 'users')) {
            $fields['bio'] = [
                'type' => 'TEXT',
                'null' => true,
                'after' => 'cover_photo'
            ];
        }
        if (!$db->fieldExists('show_ratings', 'users')) {
            $fields['show_ratings'] = [
                'type' => 'TINYINT',
                'constraint' => 1,
                'default' => 0,
                'after' => 'bio'
            ];
        }

        if (!empty($fields)) {
            $this->forge->addColumn('users', $fields);
        }

        // Member Follows Table
        $this->forge->addField([
            'id' => [
                'type' => 'INT',
                'constraint' => 11,
                'unsigned' => true,
                'auto_increment' => true,
            ],
            'follower_id' => [
                'type' => 'INT',
                'constraint' => 11,
            ],
            'following_id' => [
                'type' => 'INT',
                'constraint' => 11,
            ],
            'following_type' => [
                'type' => 'ENUM',
                'constraint' => ['EO', 'FACILITY', 'MEMBER'],
                'default' => 'EO',
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
        $this->forge->addForeignKey('follower_id', 'users', 'id', 'CASCADE', 'CASCADE');
        $this->forge->createTable('member_follows');

        // Member Experiences Table
        $this->forge->addField([
            'id' => [
                'type' => 'INT',
                'constraint' => 11,
                'unsigned' => true,
                'auto_increment' => true,
            ],
            'user_id' => [
                'type' => 'INT',
                'constraint' => 11,
            ],
            'title' => [
                'type' => 'VARCHAR',
                'constraint' => 255,
            ],
            'description' => [
                'type' => 'TEXT',
                'null' => true,
            ],
            'date' => [
                'type' => 'DATE',
                'null' => true,
            ],
            'type' => [
                'type' => 'ENUM',
                'constraint' => ['EVENT', 'FACILITY', 'MANUAL'],
                'default' => 'MANUAL',
            ],
            'reference_id' => [
                'type' => 'INT',
                'constraint' => 11,
                'null' => true,
            ],
            'is_public' => [
                'type' => 'TINYINT',
                'constraint' => 1,
                'default' => 1,
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
        $this->forge->addForeignKey('user_id', 'users', 'id', 'CASCADE', 'CASCADE');
        $this->forge->createTable('member_experiences');

        // Member Ratings Table
        $this->forge->addField([
            'id' => [
                'type' => 'INT',
                'constraint' => 11,
                'unsigned' => true,
                'auto_increment' => true,
            ],
            'user_id' => [
                'type' => 'INT',
                'constraint' => 11,
            ],
            'target_id' => [
                'type' => 'INT',
                'constraint' => 11,
            ],
            'target_type' => [
                'type' => 'ENUM',
                'constraint' => ['EVENT', 'FACILITY'],
            ],
            'rating' => [
                'type' => 'TINYINT',
                'constraint' => 1,
            ],
            'comment' => [
                'type' => 'TEXT',
                'null' => true,
            ],
            'is_public' => [
                'type' => 'TINYINT',
                'constraint' => 1,
                'default' => 0,
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
        $this->forge->addForeignKey('user_id', 'users', 'id', 'CASCADE', 'CASCADE');
        $this->forge->createTable('member_ratings');
    }

    public function down()
    {
        $this->forge->dropTable('member_ratings');
        $this->forge->dropTable('member_experiences');
        $this->forge->dropTable('member_follows');
        $this->forge->dropColumn('users', ['cover_photo', 'bio', 'show_ratings']);
    }
}
