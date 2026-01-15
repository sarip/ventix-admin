<?php
namespace App\Libraries;

use App\Models\Companie;
use App\Models\Propertie;
use App\Models\UserPropertie;
use CodeIgniter\Config\Services;

class WhereProperties
{
    /**
     * Simply Run Validation
     * @param array $current_user
     * @return string|true
     */
    public static function get(array $current_user, string $delimter = "AND", string $table = "") {

        $UserPropertie = new UserPropertie();
        $where_property = "";
        if ($current_user['level'] !== "ROOT") {
            $user_properties = $UserPropertie->where('user_id', $current_user['id'])->findAll();
            $property_ids = array_column($user_properties, 'property_id');

            switch ($current_user['level']) {
                case "ADMIN":
                    $where_property = !empty($property_ids)
                        ? $delimter ." ". $table ."property_id IN (" . implode(",", $property_ids) . ")"
                        : $delimter ." " . $table."property_id IS NULL";
                    break;

                case "STAFF":
                    $first_property = $user_properties[0]->property_id ?? null;
                    $where_property = $first_property
                        ? $delimter  ." ". $table ."property_id = '{$first_property}'"
                        : $delimter  ." ". $table . "property_id IS NULL";
                    break;

                case "SUPERADMIN":
                    $Company = new Companie();
                    $Propertie = new Propertie();
                    $company = $Company->where('user_id', $current_user['id'])->first();

                    if ($company) {
                        $properties = $Propertie->where('company_id', $company->id)->findAll();
                        $property_ids = array_column($properties, 'id');
                        $where_property = !empty($property_ids)
                            ? $delimter  ." ". $table . "property_id IN (" . implode(",", $property_ids) . ")"
                            : $delimter  ." ". $table . "property_id IS NULL";
                    } else {
                        $where_property = $delimter  ." ". $table . "property_id IS NULL";
                    }
                    break;
            }
        }
        return $where_property;
    }
}
