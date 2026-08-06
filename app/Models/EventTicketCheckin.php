<?php

namespace App\Models;

use CodeIgniter\Model;

class EventTicketCheckin extends Model
{
    protected $DBGroup          = 'default';
    protected $table            = 'event_ticket_checkins';
    protected $primaryKey       = 'id';
    protected $useAutoIncrement = true;
    protected $returnType       = 'object';
    protected $useSoftDeletes   = false;
    protected $protectFields    = true;
    protected $allowedFields    = [
        'ticket_id', 'event_id', 'scan_token', 'status', 'message', 'scanned_by', 'device_id', 'ip_address', 'created_at'
    ];

    protected $useTimestamps = false;
    protected $dateFormat    = 'datetime';
}
