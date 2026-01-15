<?php
namespace App\Libraries;

use CodeIgniter\Database\BaseConnection;
use CodeIgniter\Config\Services;

class Room
{
    /**
     * Cek ketersediaan kamar berdasarkan parameter array
     *
     * @param string $room_type_id
     * @param string $room_number
     * @param string $check_in_date
     * @param string $check_out_date
     * @return bool
     */
    public static function cekAvailable(string $room_type_id, string $room_number, string $check_in_date,  string $check_out_date): bool
    {
        $db = \Config\Database::connect();
        $builder = $db->table('booking_room br');
        $builder->join('bookings b', 'b.id = br.booking_id');
        $builder->where('br.room_type_id', $room_type_id);
        $builder->where('br.room_number', $room_number);
        $builder->groupStart()
            ->where('b.check_in_date <', $check_out_date)
            ->where('b.check_out_date >', $check_in_date)
            ->groupEnd();

        $result = $builder->countAllResults();

        return $result === 0;
    }
}
