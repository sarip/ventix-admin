<?php

namespace App\Commands;

use CodeIgniter\CLI\BaseCommand;
use CodeIgniter\CLI\CLI;

class MakeController extends BaseCommand
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
    protected $name = 'generate:controller';

    /**
     * The Command's Description
     *
     * @var string
     */
    protected $description = 'Generate Controller based on Model';

    /**
     * The Command's Usage
     *
     * @var string
     */
    protected $usage = 'generate:controller ModelName FilterName';

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
        $modelName = $params[0] ?? CLI::prompt('Model Name');
        $filterName = $params[1] ?? CLI::prompt('Filter Name');
        // get model based on input
        $model = model($modelName);
        // get table name
        $table = $model->table;
        $table_no_s = $table;
        if (substr($table, -1) == 's')
        {
            $table_no_s = substr($table, 0, -1);
        }
        // get allowed fields
        $fields = $model->allowedFields;
        // get primary key
        $primaryKey = $model->primaryKey;

        $searchable_column = $fields[0];

        // get template
        $file = file_get_contents(APPPATH . 'templates/ctrl.txt');
        // replace model name
        $file = str_replace('#MODEL_NAME#', $modelName, $file);
        $file = str_replace('#MODEL_NAME_LOWER#', strtolower($modelName), $file);
        // replace Table name
        $file = str_replace('#TABLE_NAME#', $table, $file);
        $file = str_replace('#TABLE_NAME_NO_S#', $table_no_s, $file);
        // replace search column
        $file = str_replace('#SEARCHABLE_COLUMN#', $searchable_column, $file);
        // replace primary key
        $file = str_replace('#PRIMARY_KEY#', $primaryKey, $file);

        $api_body_create = "";

        foreach($fields as $field) {
            $api_body_create .= "     * @apiBody {String} " . $field . " " . $field . "\n";
        }

        // replace api body create
        $file = str_replace('#API_BODY_CREATE#', $api_body_create, $file);

        $api_create = [];
        foreach($fields as $field) {
            $api_create[] = "            '{$field}' => \$this->request->getJsonVar('{$field}')";
        }

        // replace api create
        $file = str_replace('#API_CREATE#', implode(",\n", $api_create), $file);

        // replace current date
        $file = str_replace('#CURRENT_DATE#', date('Y-m-d'), $file);

        // save controller
        $file_name = ucfirst($modelName) . 'Controller.php';
        $file_path = APPPATH . 'Controllers/Api/' . $file_name;
        if (file_exists($file_path))
        {
            CLI::error('Controller already exists');
            return;
        }
        file_put_contents($file_path, $file);
        CLI::write('Controller created: ' . $file_name);

        $f = "\$routes->get('".$table."', '{$modelName}Controller::index', ['filter' => '{$filterName}']);
    \$routes->post('".strtolower($modelName)."', '{$modelName}Controller::create', ['filter' => '{$filterName}']);
    \$routes->put('".strtolower($modelName)."/(:num)', '{$modelName}Controller::update/$1', ['filter' => '{$filterName}']);
    \$routes->delete('".strtolower($modelName)."/(:num)', '{$modelName}Controller::delete/$1', ['filter' => '{$filterName}']);";

        $file_path = APPPATH . 'Routes/api.php';
        $file = file_get_contents($file_path);
        $file = str_replace('// OTHER API REQUEST //', $f."\n\n    // OTHER API REQUEST //", $file);
        file_put_contents($file_path, $file);
        CLI::write('Routes created: ' . $file_name);


    }

    private function makeUIStarter($table, $modelname, $fields, $primaryKey, $searchable_column) {

    }

    private function makeUIindex() {

    }
}
