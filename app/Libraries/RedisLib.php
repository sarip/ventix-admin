<?php namespace App\Libraries;

use Redis;

class RedisLib
{
    public static function publish($channel, $message)
    {
        $redis = new Redis();
        $redis->connect('127.0.0.1', 6379);
        $redis->publish($channel, json_encode($message));
    }
}
