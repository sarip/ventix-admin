<?php

namespace App\Filters;

use App\Models\Role;
use App\Models\RoleAction;
use App\Models\User;
use CodeIgniter\Filters\FilterInterface;
use CodeIgniter\HTTP\RequestInterface;
use CodeIgniter\HTTP\ResponseInterface;
use Config\Services;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;

class PermissionFilter implements FilterInterface
{
    /**
     * Do whatever processing this filter needs to do.
     * By default it should not return anything during
     * normal execution. However, when an abnormal state
     * is found, it should return an instance of
     * CodeIgniter\HTTP\Response. If it does, script
     * execution will end and that Response will be
     * sent back to the client, allowing for error pages,
     * redirects, etc.
     *
     * @param RequestInterface $request
     * @param array|null       $arguments
     *
     * @return mixed
     */
    public function before(RequestInterface $request, $arguments = null)
    {
        header('Access-Control-Allow-Origin: *');
        header("Access-Control-Allow-Headers: *");
        header("Access-Control-Allow-Methods: *");

        $http_method = $_SERVER['REQUEST_METHOD'];
        $hasAccess = $this->roleCanDo($http_method);
        if(!$hasAccess){
            return Services::response()
                ->setJSON(['message' => 'Anda tidak memiliki akses'])
                ->setStatusCode(ResponseInterface::HTTP_FORBIDDEN);
        }
    }

    public function roleMustHaveAccess(string $access) {
        $roleModel = new Role();
        $roleActionModel = new RoleAction();

//        $hasAccess = false;
//        $roleId = $GLOBALS['user_role_id'] ?? null;
//        if ($roleId) {
//            $hasAccess = false;
//        }
//
//        $role = $roleModel->find($roleId);
//        if (!$role) {
//            $hasAccess = false;
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
//        $roleAction = $roleActionModel->where('role_id', $role->id)->where('endpoint', $endpoint)->first();
//        $roleAction = (array) $roleAction;
//        if(empty($roleAction) || $roleAction[$access] == 'Y') {
//            $hasAccess = true;
//        };

        $hasAccess = true;
        return $hasAccess;
    }

    public function roleCanRead() {
        $this->roleMustHaveAccess('can_read');
    }

    public function roleCanWrite() {
        $this->roleMustHaveAccess('can_write');
    }

    public function roleCanDelete() {
        $this->roleMustHaveAccess('can_delete');
    }

    public function roleCanUpdate() {
        $this->roleMustHaveAccess('can_update');
    }

    public function roleCanDo($method) {
        if($method === "GET") {
            $method = "read";
        }
        else if($method === "POST") {
            $method = "create";
        }
        else if($method === "PUT") {
            $method = "update";
        }
        else if($method === "DELETE") {
            $method = "delete";
        }
        else {
            throw new \Exception("Method not supported", 405);
        }

        return $this->roleMustHaveAccess('can_' . $method);
    }

    /**
     * Allows After filters to inspect and modify the response
     * object as needed. This method does not allow any way
     * to stop execution of other after filters, short of
     * throwing an Exception or Error.
     *
     * @param RequestInterface  $request
     * @param ResponseInterface $response
     * @param array|null        $arguments
     *
     * @return mixed
     */
    public function after(RequestInterface $request, ResponseInterface $response, $arguments = null)
    {
        //
//        sleep(5);
    }
}
