<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class WilayahIndonesia extends Migration
{
    public function up()
    {
        $sql_file = APPPATH . '/sql/wilayah_indonesia.sql';
        $commands = file_get_contents($sql_file);


        $commands = explode(';', $commands);
        foreach ($commands as $command) {
            $command = trim($command);
            if ($command !== '') {
                $this->db->query($command);
            }
        }
    }

    public function down()
    {
        //
    }
}
