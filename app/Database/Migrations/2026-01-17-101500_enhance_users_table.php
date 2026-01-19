<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class EnhanceUsersTable extends Migration
{
    public function up()
    {
        // Add updated_at column if it doesn't exist
        $fields = $this->db->getFieldNames('users');
        if (!in_array('updated_at', $fields)) {
            $newFields = [
                'updated_at' => [
                    'type' => 'TIMESTAMP',
                    'null' => true,
                    'default' => NULL,
                    'on_update' => 'CURRENT_TIMESTAMP'
                ]
            ];
            $this->forge->addColumn('users', $newFields);
        }

        // Add indexes for performance
        $this->db->query('CREATE INDEX IF NOT EXISTS idx_users_eo_id ON users(eo_id)');
        $this->db->query('CREATE INDEX IF NOT EXISTS idx_users_role ON users(role)');
        $this->db->query('CREATE INDEX IF NOT EXISTS idx_users_status ON users(status)');
        $this->db->query('CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at)');
        $this->db->query('CREATE INDEX IF NOT EXISTS idx_users_last_login ON users(last_login)');

        // Ensure default statuses exist in users_status table
        $this->db->query("
            INSERT IGNORE INTO users_status (name, description) VALUES
            ('Active', 'User is active and can access the system'),
            ('Inactive', 'User is inactive and cannot login'),
            ('Suspended', 'User is temporarily suspended')
        ");

        // Set default status for existing users without status
        $this->db->query("
            UPDATE users 
            SET status = 'Active' 
            WHERE status IS NULL OR status = ''
        ");

        // Ensure all existing users have a referral code
        $this->db->query("
            UPDATE users 
            SET refferalcode = CONCAT('REF', LPAD(id, 6, '0'), SUBSTRING(MD5(CONCAT(id, username)), 1, 4))
            WHERE refferalcode IS NULL OR refferalcode = ''
        ");
    }

    public function down()
    {
        // Drop indexes
        $this->db->query('DROP INDEX IF EXISTS idx_users_eo_id ON users');
        $this->db->query('DROP INDEX IF EXISTS idx_users_role ON users');
        $this->db->query('DROP INDEX IF EXISTS idx_users_status ON users');
        $this->db->query('DROP INDEX IF EXISTS idx_users_created_at ON users');
        $this->db->query('DROP INDEX IF EXISTS idx_users_last_login ON users');

        // Remove updated_at column
        $fields = $this->db->getFieldNames('users');
        if (in_array('updated_at', $fields)) {
            $this->forge->dropColumn('users', 'updated_at');
        }
    }
}
