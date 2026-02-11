<?php

namespace App\Database\backup;

use CodeIgniter\Database\Migration;

class Starter extends Migration
{
    public function up()
    {
        $sql_file = APPPATH . '/sql/starter.sql';
        $commands = file_get_contents($sql_file);

        // Disable FK check
        $this->db->query('SET FOREIGN_KEY_CHECKS=0');

        $commands = explode(';', $commands);
        foreach ($commands as $command) {
            $command = trim($command);
            if ($command !== '') {
                $this->db->query($command);
            }
        }

        // Enable FK check
        $this->db->query('SET FOREIGN_KEY_CHECKS=1');
    }

    public function down()
    {

    }
}
