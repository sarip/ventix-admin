<?php

namespace App\Filters;

use CodeIgniter\HTTP\RequestInterface;
use CodeIgniter\HTTP\ResponseInterface;
use CodeIgniter\Filters\FilterInterface;
use Throwable;

class ExceptionFilter implements FilterInterface
{
    public function before(RequestInterface $request, $arguments = null)
    {
        // Do something before request
    }

    public function after(RequestInterface $request, ResponseInterface $response, $arguments = null)
    {
        if (isset($response->exception) && $response->exception instanceof Throwable) {
            $response->setStatusCode(500);
            $response->setBody(json_encode([
                'title' => 'Error',
                'type' => 'Error',
                'code' => $response->getStatusCode(),
                'message' => $response->exception->getMessage()
            ]));
            $response->setContentType('application/json');
        }
    }
}
