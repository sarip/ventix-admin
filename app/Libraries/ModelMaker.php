<?php
/**
 * @author Herlangga Sefani Wijaya <herlangga.sefani@gmail.com>
 * @copyright Herlangga Sefani Wijaya 2023
 * Added 25/02/23-February-2023
 */


namespace App\Libraries;

class ModelMaker
{
    public static function generateModelName($table)
    {
        $modelName = '';
        $table = explode('_', $table);
        foreach($table as $t) {
            $modelName .= ucfirst($t);
        }
        // remove ending s and ies
        if(substr($modelName, -1) == 's') {
            $modelName = substr($modelName, 0, -1);
        }
        if(substr($modelName, -3) == 'ies') {
            $modelName = substr($modelName, 0, -3) . 'y';
        }

        return $modelName;
    }
}
