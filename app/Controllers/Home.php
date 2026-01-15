<?php

namespace App\Controllers;
use CodeIgniter\HTTP\ResponseInterface;
class Home extends BaseController
{
//    function __construct(){
//    header('Access-Control-Allow-Origin: *');
//
//    // Specify which request methods are allowed
//    header('Access-Control-Allow-Methods: PUT, GET, POST, DELETE, OPTIONS');
//
//    // Additional headers which may be sent along with the CORS request
//    header('Access-Control-Allow-Headers: X-Requested-With,Authorization,Content-Type');
//
//    }
    public function index(): string
    {
        return view('welcome_message');
    }

    public function coba()
    {
        return $this->response
            ->setStatusCode(ResponseInterface::HTTP_FORBIDDEN)
            ->setBody('Access Denied: User role not found');
    }
}
        return json_encode([
            'status' => 200,
            "data" => "hallo world"
        ]);
