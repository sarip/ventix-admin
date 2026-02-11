<?php

namespace App\Filters;


use App\Models\Appuser;
use App\Models\User;
use CodeIgniter\Filters\FilterInterface;
use CodeIgniter\HTTP\RequestInterface;
use CodeIgniter\HTTP\ResponseInterface;
use Config\Services;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;

class TokenFeFilter implements FilterInterface
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

        $token = $request->getHeaderLine("key");
        // check if token is null or empty
        if(is_null($token) || empty($token)) {
            $response = service('response');
            $response->setBody('Access denied');
            $response->setStatusCode(401);
            return $response;
        }
//
        try {
            $key = getenv('API_KEY_DEFAULT');


            if($token === $key) {
                $request->current_user = null;
                $request->id = null;
                return  $request;
            }else{
                $key = getenv('JWT_SECRET');
                $decoded = JWT::decode($token, new Key($key, 'HS256'));
                $User = new User();
                $user = $User->find($decoded->id);
                Services::request()->current_user = (array) $user;
                Services::request()->id = $user->id;
                $GLOBALS['endpoint'] = $request->getServer()['PATH_INFO'];
                $GLOBALS['user_role'] = $user->role;
                return $request;
            }

            $response = service('response');
            $response->setBody('Access denied 2');
            $response->setStatusCode(401);
            return $response;
        } catch (\Exception $ex) {
            $response = service('response');
            $response->setBody('Access denied 3');
            $response->setStatusCode(401);
            return $response;
        }
    }

    function Permission()
    {

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
    }
}
