<?php
/**
 * @author Sarip Hidayat <hidayatsarip2210@gmail.com>
 * @copyright Sarip Hidayat 2023
 * @date 2026-01-11
 */

namespace App\Models;

use CodeIgniter\Model;

class User extends Model
{
    protected $DBGroup = 'default';
    protected $table = 'users';
    protected $primaryKey = 'id';
    protected $useAutoIncrement = true;
    protected $insertID = 0;
    protected $returnType = 'object';
    protected $useSoftDeletes = false;
    protected $protectFields = true;
    protected $allowedFields = [
        'eo_id',
        'username',
        'name',
        'email',
        'password',
        'phone',
        'role',
        'profile_picture',
        'refferalcode',
        'status',
        'google_id',
        'verification_token',
        'reset_token_expiry',
        'email_verified_at',
        'last_login',
        'updated_at'
    ];

    // Dates
    protected $useTimestamps = true;
    protected $dateFormat = 'datetime';
    protected $createdField = 'created_at';
    protected $updatedField = 'updated_at';
    protected $deletedField = null;

    // Validation
    protected $validationRules = [
        //        'username' => 'required|min_length[4]|max_length[50]|alpha_numeric_punct|is_unique[users.username,id,{id}]',
        'name' => 'required|min_length[3]|max_length[150]',
        //        'email' => 'required|valid_email|is_unique[users.email,id,{id}]',
        'password' => 'required|min_length[8]',
        'phone' => 'permit_empty|min_length[8]|max_length[20]',
        'role' => 'required|max_length[50]',
        'status' => 'permit_empty|in_list[Active,Inactive,Suspended]'
    ];
    protected $validationMessages = [
        'username' => [
            'required' => 'Username is required',
            'is_unique' => 'Username already exists',
            'min_length' => 'Username must be at least 4 characters',
            'alpha_numeric_punct' => 'Username can only contain letters, numbers, and underscores'
        ],
        'email' => [
            'required' => 'Email is required',
            'valid_email' => 'Email must be a valid email address',
            'is_unique' => 'Email already exists'
        ],
        'password' => [
            'required' => 'Password is required',
            'min_length' => 'Password must be at least 8 characters'
        ]
    ];
    protected $skipValidation = false;
    protected $cleanValidationRules = true;

    // Callbacks
    protected $allowCallbacks = true;
    protected $beforeInsert = ['hashPassword', 'generateReferralCode', 'setDefaultStatus'];
    protected $beforeUpdate = ['hashPassword'];
    protected $beforeFind = [];
    protected $afterFind = ['removePassword'];
    protected $beforeDelete = ['logBeforeDelete'];
    protected $afterInsert = ['logAfterInsert'];
    protected $afterUpdate = ['logAfterUpdate'];
    protected $afterDelete = [];


    public function __construct()
    {
        parent::__construct();
        helper(['auth', 'email']);
    }

    /**
     * Hash password before insert/update
     */
    protected function hashPassword($data)
    {
        if (isset($data['data']['password']) && !empty($data['data']['password'])) {
            $data['data']['password'] = hash_password($data['data']['password']);
        }
        return $data;
    }

    /**
     * Generate referral code before insert
     */
    protected function generateReferralCode($data)
    {
        if (!isset($data['data']['refferalcode']) || empty($data['data']['refferalcode'])) {
            // Generate temporary code, will be updated after insert with actual ID
            $data['data']['refferalcode'] = 'TEMP_' . uniqid();
        }
        return $data;
    }

    /**
     * Set default status before insert
     */
    protected function setDefaultStatus($data)
    {
        if (!isset($data['data']['status']) || empty($data['data']['status'])) {
            $data['data']['status'] = 'Inactive';
        }
        return $data;
    }

    /**
     * Implement soft delete by setting status to Inactive instead of deleting
     */
    protected function softDeleteInstead($data)
    {
        $ids = is_array($data['id'] ?? null) ? $data['id'] : [$data['id'] ?? null];

        foreach ($ids as $id) {
            $this->update($id, ['status' => 'Inactive']);
        }

        // Prevent actual deletion by returning false
        $data['purge'] = false;
        return $data;
    }

    /**
     * Get user with role details
     */
    public function getWithRole($id = null)
    {
        $builder = $this->select('users.*, sys_users_role.role_name, sys_users_role.role_slug, sys_users_role.description as role_description')
            ->join('sys_users_role', 'sys_users_role.role_name = users.role', 'left');

        if ($id !== null) {
            return $builder->where('users.id', $id)->first();
        }

        return $builder;
    }

    /**
     * Get user with Events Organizer details
     */
    public function getWithEO($id = null)
    {
        $builder = $this->select('users.*, events_organizer.eo_name, events_organizer.company_name, events_organizer.email as eo_email')
            ->join('events_organizer', 'events_organizer.id = users.eo_id', 'left');

        if ($id !== null) {
            return $builder->where('users.id', $id)->first();
        }

        return $builder;
    }

    /**
     * Get user with all relationships
     */
    public function getWithRelations($id = null)
    {
        $builder = $this->select('users.*, 
                                  sys_users_role.role_name, 
                                  sys_users_role.role_slug, 
                                  sys_users_role.description as role_description,
                                  events_organizer.eo_name, 
                                  events_organizer.company_name')
            ->join('sys_users_role', 'sys_users_role.role_name = users.role', 'left')
            ->join('events_organizer', 'events_organizer.id = users.eo_id', 'left');

        if ($id !== null) {
            return $builder->where('users.id', $id)->first();
        }

        return $builder;
    }

    /**
     * Update referral code after insert (callback from controller)
     */
    public function updateReferralCode($user_id, $username)
    {
        $refCode = generate_referral_code($user_id, $username);
        $this->skipValidation(true)->update($user_id, ['refferalcode' => $refCode]);
    }

    private function logUser($action, $note = '', $data = [])
    {
        $request = \Config\Services::request();
        $UserLog = new UserLog();
        // check if $request is not from cli
        if (!is_cli()) {
            $user_agent = $request->getUserAgent();
            $ip_address = $request->getIPAddress();
        } else {
            $user_agent = 'CLI';
            $ip_address = '127.0.0.1';
        }

        $UserLog->insert([
            'user_id' => $request->id ?? -1,
            'event_section' => strtoupper($this->table),
            'event_action' => $action,
            'event_note' => $note . ' From : ' . $user_agent,
            'ip_address' => $ip_address,
            'data' => json_encode($data)
        ]);
    }

    protected function logAfterInsert($data)
    {
        $this->logUser('ADD', 'Add ' . strtoupper($this->table), $data);
    }

    protected function logBeforeDelete($data)
    {
        $ids = is_array($data['id'] ?? null) ? $data['id'] : [$data['id'] ?? null];
        $items = $this->whereIn($this->primaryKey, $ids)->findAll();

        foreach ($items as $row) {
            $this->logUser('DELETE', 'Delete ' . strtoupper($this->table), $row);
        }

    }

    protected function removePassword($data)
    {
        if (isset($data['data'])) {
            if (is_object($data['data'])) {
                unset($data['data']->password);
            } elseif (is_array($data['data'])) {
                foreach ($data['data'] as $row) {
                    if (is_object($row)) {
                        unset($row->password);
                    }
                }
            }
        }
        return $data;
    }

    protected function logAfterUpdate($data)
    {
        $this->logUser('MODIFY', 'Update ' . strtoupper($this->table), $data);
    }
}
