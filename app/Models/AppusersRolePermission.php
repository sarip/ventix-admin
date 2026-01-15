<?php
/**
 * @author Sarip Hidayat <hidayatsarip2210@gmail.com>
 * @copyright Sarip Hidayat 2023
 * @date 2026-01-11
 */

namespace App\Models;

use CodeIgniter\Model;

class AppusersRolePermission extends Model
{
    protected $DBGroup          = 'default';
    protected $table            = 'appusers_role_permission';
    protected $primaryKey       = 'perm_name';
    protected $useAutoIncrement = true;
    protected $insertID         = 0;
    protected $returnType       = 'object';
    protected $useSoftDeletes   = false;
    protected $protectFields    = true;
    protected $allowedFields    = [
        'role_name', 'perm_name'
    ];

    // Dates
    protected $useTimestamps = true;
    protected $dateFormat    = 'datetime';
    protected $createdField  = 'created_at';
    protected $updatedField  = 'updated_at';
    protected $deletedField  = null;

    // Validation
    protected $validationRules      = [];
    protected $validationMessages   = [];
    protected $skipValidation       = false;
    protected $cleanValidationRules = true;

    // Callbacks
    protected $allowCallbacks = true;
    protected $beforeInsert   = [];
    protected $beforeUpdate   = [];
    protected $beforeFind     = [];
    protected $afterFind      = [];
    protected $beforeDelete   = ['logBeforeDelete'];
    protected $afterInsert = ['logAfterInsert'];
    protected $afterUpdate = ['logAfterUpdate'];
    protected $afterDelete = [];


     private function logUser($action, $note = '', $data = []) {
        $request = \Config\Services::request();
        $UserLog = new UserLog();
        // check if $request is not from cli
        if (!is_cli()) {
            $user_agent = $request->getUserAgent();
            $ip_address = $request->getIPAddress();
        }
        else
        {
            $user_agent = 'CLI';
            $ip_address = '127.0.0.1';
        }

        $UserLog->insert([
            'user_id' => $request->id  ?? -1,
            'event_section' => strtoupper($this->table),
            'event_action' => $action,
            'event_note' => $note.' From : ' . $user_agent,
            'ip_address' => $ip_address,
            'data' => json_encode($data)
        ]);
    }

    protected function logAfterInsert($data)
    {
        $this->logUser('ADD', 'Add '. strtoupper($this->table), $data);
    }

    protected function logBeforeDelete($data)
    {
        $ids = is_array($data['id'] ?? null) ? $data['id'] : [$data['id'] ?? null];
        $items = $this->whereIn($this->primaryKey, $ids)->findAll();

        foreach ($items as $row) {
            $this->logUser('DELETE', 'Delete ' . strtoupper($this->table), $row);
        }

    }

    protected function logAfterUpdate($data) {
        $this->logUser('MODIFY', 'Update '. strtoupper($this->table), $data);
    }
}
