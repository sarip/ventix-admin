<?php
/**
 * @author Herlangga Sefani Wijaya <herlangga.sefani@gmail.com>
 * @copyright Herlangga Sefani Wijaya 2023
 * Added 14/03/23-March-2023
 */

namespace App\Libraries;

use CodeIgniter\Config\Services;

class Validate
{
    /**
     * Simply Run Validation
     * @param array $data
     * @param array $rules
     * @return string|true
     */
    public static function run(array $data, array $rules) {
        $validation = Services::validation();
        $validation->setRules($rules);

        if (!$validation->run($data)) {
            $errors = $validation->getErrors();
            $error_msg = "";
            foreach ($errors as $key => $error) {
                $error_msg .= $key . ' '. $error . "\n";
            }

            return $error_msg;
        }

        return true;
    }
}
