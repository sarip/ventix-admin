<?php

namespace App\Controllers\Api;

use App\Controllers\BaseController;
use App\Models\Companie;
use App\Models\Propertie;
use App\Models\RoleAction;
use App\Models\Role;
use App\Models\UserPropertie;
use CodeIgniter\API\ResponseTrait;
use CodeIgniter\HTTP\Response;
use CodeIgniter\HTTP\Exceptions\HTTPException;
use Config\Services;


class ApiController extends BaseController
{

//     function __construct() {
//      header('Access-Control-Allow-Origin: *');
//
//             // Specify which request methods are allowed
//             header('Access-Control-Allow-Methods: PUT, GET, POST, DELETE, OPTIONS');
//
//             // Additional headers which may be sent along with the CORS request
//             header('Access-Control-Allow-Headers: X-Requested-With,Authorization,Content-Type');
//
//     }

    use ResponseTrait;
    protected $roleModel;
    protected $roleActionModel;

    protected $model_where;

    protected $properties_ids = [];

    public array $supportedResponseFormats = [
        'application/json',
        'application/xml',
    ];

    public array $formatters = [
        'application/json' => \CodeIgniter\Format\JSONFormatter::class,
        'application/xml' => \CodeIgniter\Format\XMLFormatter::class,
    ];

    public function __construct()
    {
        $this->roleModel = new Role();
        $this->roleActionModel = new RoleAction();

        // bypass some controllers for authentication
        $bypass_controllers = [
            'App\Controllers\Api\AuthController',
        ];

        $current_class = get_class($this);
        if(in_array($current_class, $bypass_controllers)) {
            return;
        }

        $http_method = $_SERVER['REQUEST_METHOD'];
//        $this->roleCanDo($http_method);


    }

    public function index()
    {
        //
    }

    public function options() {
        header('Access-Control-Allow-Origin: *');
        header('Access-Control-Allow-Headers: *');
        header('Access-Control-Allow-Methods: *');


        return $this->respondNoContent();
    }

    /**
     * Send Output to user auto detect success or error
     *
     * @param array $output [success, message, ..data]
     * @param null $code
     * @return mixed
     */
    public function sendOutput(array $output, $code=null)
    {
        $output['elapsed_time'] = '{elapsed_time} (s)';
        $output['memory_usage'] = memory_get_usage(true);
        if (empty($output['success'])) {
            $output['success'] = false;
            $output['message'] = $output['message'] ?? 'No error message returned';

//            return $this->respond($output, $code ?? 400);
        }

        return $this->respond($output, $code ?? 200);
    }

    /**
     * Send Success output directly to user
     *
     * @param array $data
     * @param int $code
     * @return mixed
     */
    public function successOutput(array $data, int $code=200)
    {
        $output['success'] = true;
        $output = array_merge($output, $data);
        return $this->sendOutput($output,$code);
    }

    /**
     * Send error output which is bad request 400
     *
     * @param string $message
     * @param int $code
     * @param array $args
     * @return mixed
     */
    public function errorOutput(string $message, int $code=400, array $args = [])
    {
        $output = [];
        $output['success'] = false;
        $output['message'] = $message;
        return $this->sendOutput($output, $code);
    }

//    public function roleMustHaveAccess(string $access) {
//        $roleId = $GLOBALS['user_role_id'] ?? null;
//        if (!$roleId) {
//            throw new \Exception("User role not found", 403);
//        }
//
//        $role = $this->roleModel->find($roleId);
//        if (!$role) {
//            throw new \Exception("Role not found", 403);
//        }
//
//        // remove first /
//        $endpoint = ltrim($GLOBALS['endpoint'], '/');
//
//        // remove last s
//        if (substr($endpoint, -1) === 's') {
//            $endpoint = substr($endpoint, 0, -1);
//        }
//
//        // Remove the last part after the slash
//        $lastSlashPos = strrpos($endpoint, '/');
//        if ($lastSlashPos !== false) {
//            $lastPart = substr($endpoint, $lastSlashPos + 1);
//
//            // Check if the last part is a number
//            if (is_numeric($lastPart)) {
//                // Remove the last part
//                $endpoint = substr($endpoint, 0, $lastSlashPos);
//            }
//        }
//
//        $roleAction = $this->roleActionModel->where('role_id', $role->id)->where('endpoint', $endpoint)->first();
//        $roleAction = (array) $roleAction;
//        if(empty($roleAction) || $roleAction[$access] !== 'Y') {
//            throw new \Exception("You don't have access {$access} to this endpoint  {$endpoint}", 403);
//        };
//
//
//
//
//    }
//
//    public function roleCanRead() {
//        $this->roleMustHaveAccess('can_read');
//    }
//
//    public function roleCanWrite() {
//        $this->roleMustHaveAccess('can_write');
//    }
//
//    public function roleCanDelete() {
//        $this->roleMustHaveAccess('can_delete');
//    }
//
//    public function roleCanUpdate() {
//        $this->roleMustHaveAccess('can_update');
//    }
//
//    public function roleCanDo($method) {
//        if($method === "GET") {
//            $method = "read";
//        }
//        else if($method === "POST") {
//            $method = "create";
//        }
//        else if($method === "PUT") {
//            $method = "update";
//        }
//        else if($method === "DELETE") {
//            $method = "delete";
//        }
//        else {
//            throw new \Exception("Method not supported", 405);
//        }
//
//        $this->roleMustHaveAccess('can_' . $method);
//    }

    protected function getUrl()
    {
        $url = ltrim($_SERVER['REQUEST_URI'], '/');
        return str_replace('\\', '', $url);
//        echo $url; die();
    }
}
