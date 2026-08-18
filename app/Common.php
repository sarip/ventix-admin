<?php

/**
 * The goal of this file is to allow developers a location
 * where they can overwrite core procedural functions and
 * replace them with their own. This file is loaded during
 * the bootstrap process and is called during the framework's
 * execution.
 *
 * This can be looked at as a `master helper` file that is
 * loaded early on, and may also contain additional functions
 * that you'd like to use throughout your entire application
 *
 * @see: https://codeigniter.com/user_guide/extending/common.html
 */

if (!function_exists('iconv')) {
    function iconv($from_encoding, $to_encoding, $string)
    {
        if (function_exists('mb_convert_encoding')) {
            return mb_convert_encoding($string, $to_encoding, $from_encoding);
        }
        return $string;
    }
}
