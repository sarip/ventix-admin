<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class AddTaxToEventTicket extends Migration
{
    public function up()
    {
        $this->forge->addColumn('event_ticket', [
            'final_price' => [
                'type'       => 'DECIMAL',
                'constraint' => '15,2',
                'default'    => '0.00',
                'after'      => 'price',
            ],
            'is_taxable' => [
                'type'       => 'ENUM',
                'constraint' => ['Y', 'N'],
                'default'    => 'N',
                'after'      => 'final_price',
            ],
            'tax_id' => [
                'type'       => 'INT',
                'constraint' => 11,
                'null'       => true,
                'after'      => 'is_taxable',
            ],
        ]);
    }

    public function down()
    {
        $this->forge->dropColumn('event_ticket', ['final_price', 'is_taxable', 'tax_id']);
    }
}
