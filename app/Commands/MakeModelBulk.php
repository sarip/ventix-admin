<?php

namespace App\Commands;

use App\Libraries\ModelMaker;
use CodeIgniter\CLI\BaseCommand;
use CodeIgniter\CLI\CLI;

class MakeModelBulk extends BaseCommand
{
    /**
     * The Command's Group
     *
     * @var string
     */
    protected $group = 'SARIP';

    /**
     * The Command's Name
     *
     * @var string
     */
    protected $name = 'generate:model_bulk';

    /**
     * The Command's Description
     *
     * @var string
     */
    protected $description = 'Generate Model Bulk based on table on database';

    /**
     * The Command's Usage
     *
     * @var string
     */
    protected $usage = 'generate:model_bulk';

    /**
     * The Command's Arguments
     *
     * @var array
     */
    protected $arguments = [];

    /**
     * The Command's Options
     *
     * @var array
     */
    protected $options = [];

    /**
     * Actually execute a command.
     *
     * @param array $params
     */
    public function run(array $params)
    {
        //
        $db = \Config\Database::connect();
        $tables = $db->listTables();
        foreach($tables as $table) {

            if($table === "migrations") continue;

            $modelName = ModelMaker::generateModelName($table);

            $path = APPPATH . 'Models/' . $modelName . '.php';
            if (file_exists($path)) {
                CLI::write('Model ' . $modelName . ' already exists', 'red');
                continue;
            }

            $fields = $db->getFieldData($table);
            $primary_key = 'id';
            $allowed_fields = [];
            foreach($fields as $field) {
                if($field->name != 'created_at' && $field->name != 'updated_at' && $field->name != 'deleted_at' && $field->name != 'id') {
                    $allowed_fields[] = $field->name;
                }
                if($field->primary_key) {
                    $primary_key = $field->name;
                }
            }


            $template = file_get_contents(APPPATH . 'templates/mdl.txt');
            $template = str_replace('{class}', $modelName, $template);
            $template = str_replace('{table}', $table, $template);
            $template = str_replace('{primaryKey}', $primary_key, $template);
            $template = str_replace('{allowedFields}', implode("', '", $allowed_fields), $template);
            $template = str_replace('{CURRENT_DATE}', date('Y-m-d'), $template);

            file_put_contents($path, $template);
            CLI::write('Model ' . $modelName . ' created', 'green');

        }
    }
}
