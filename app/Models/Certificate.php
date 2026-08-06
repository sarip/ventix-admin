<?php

namespace App\Models;

use CodeIgniter\Model;

class Certificate extends Model
{
    protected $DBGroup          = 'default';
    protected $table            = 'certificates';
    protected $primaryKey       = 'id';
    protected $useAutoIncrement = true;
    protected $returnType       = 'object';
    protected $useSoftDeletes   = false;
    protected $protectFields    = true;
    protected $allowedFields    = [
        'event_id', 'ticket_id', 'user_id', 'certificate_number', 'template_id', 'recipient_name', 'certificate_title', 'certificate_file', 'status', 'generated_at', 'sent_at'
    ];

    protected $useTimestamps = false;
    protected $dateFormat    = 'datetime';
    protected $createdField  = 'created_at';

    protected $validationRules      = [];
    protected $validationMessages   = [];
    protected $skipValidation       = false;
    protected $cleanValidationRules = true;
}
