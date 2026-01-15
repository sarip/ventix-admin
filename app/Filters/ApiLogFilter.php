<?php

namespace App\Filters;

use CodeIgniter\Filters\FilterInterface;
use CodeIgniter\HTTP\RequestInterface;
use CodeIgniter\HTTP\ResponseInterface;

class ApiLogFilter implements FilterInterface
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
        //
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
        $id = $request->id ?? -1;
        $path = $request->uri->getPath();
        $method = $request->getMethod();
        $ip = $request->getIPAddress();
        $userAgent = $request->getUserAgent();
        $responseCode = $response->getStatusCode();
        $responseBody = $response->getBody();
        $requestBody = $request->getBody();


        $data = [
            'user_id' => $id,
            'path' => $path,
            'method' => $method,
            'ip' => $ip,
            'user_agent' => $userAgent,
            'response_code' => $responseCode,
            'response' => $responseBody,
            'request' => json_encode($request),
        ];

        // BYPASS LOG FOR API TRANSAKSI ONLY
        $paths = explode('/', $data['path']);
        if(in_array('transaction', $paths) || in_array('transaction_ipg', $paths)) {
            if($method !== 'get') {
                $ApiLog = new \App\Models\ApiLog();
                $ApiLog->insert($data);
            }
        }
    }
}
