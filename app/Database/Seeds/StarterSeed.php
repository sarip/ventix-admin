<?php

namespace App\Database\Seeds;

use CodeIgniter\Database\Seeder;

class StarterSeed extends Seeder
{
    public function run()
    {
        $sql_file = APPPATH . '/sql/starter_seed.sql';
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

        $this->db->query('SET FOREIGN_KEY_CHECKS=1');
    }
}
