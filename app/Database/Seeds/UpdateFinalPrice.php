<?php

namespace App\Database\Seeds;

use App\Models\EventTicket;
use CodeIgniter\Database\Seeder;

class UpdateFinalPrice extends Seeder
{
    public function run()
    {
        $Model = new EventTicket();

        $tickets = $Model->findAll();
        foreach ($tickets as $ticket) {
            $Model->update($ticket->id, $ticket);
        }
    }
}
