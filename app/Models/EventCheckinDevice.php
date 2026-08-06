<?php

namespace App\Models;

use CodeIgniter\Model;

class EventCheckinDevice extends Model
{
    protected $DBGroup          = 'default';
    protected $table            = 'event_checkin_devices';
    protected $primaryKey       = 'id';
    protected $useAutoIncrement = true;
    protected $returnType       = 'object';
    protected $useSoftDeletes   = false;
    protected $protectFields    = true;
    protected $allowedFields    = [
        'event_id', 'device_name', 'device_token', 'location', 'status', 'created_at'
    ];

    protected $useTimestamps = false;
    protected $dateFormat    = 'datetime';
}
