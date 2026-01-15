<?php
namespace App\Libraries;


use CodeIgniter\Config\Services;

class DateMaker
{
    public static function parseRunDate($runDate) {
        // Jika tidak ada run_date → pakai awal–akhir bulan berjalan
        if (empty($runDate)) {
            return [
                'start' => date('Y-m-01'),
                'end'   => date('Y-m-t'),
            ];
        }

        // Ada run_date → parse
        $dates = explode('-', $runDate);

        return [
            'start' => str_replace('/', '-', trim($dates[0])),
            'end'   => str_replace('/', '-', trim($dates[1])),
        ];
    }


}