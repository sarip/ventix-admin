<?php

namespace App\Controllers\Frontend;


use App\Controllers\Api\ApiController;
use App\Models\ApiToken;
use App\Models\Appuser;
use App\Models\Module;
use App\Models\RoleAction;
use App\Models\Role;
use App\Models\User;
use App\Models\UserLog;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use App\Libraries\Validate;
use App\Models\UserLogged;
use App\Models\Seting;
use App\Libraries\ValidatePassword;

class AuthController extends ApiController
{

    /**
     * Generate Token for user
     * @param $user
     * @return string
     */
    private function generateToken($user)
    {
        $key = getenv('JWT_SECRET');

        $payload = [
            'issuer' => "STARTER",
            'id' => $user->id,
            'role' => $user->role,
            'source' => $user->source,
            'username' => $user->username,
        ];

        return JWT::encode($payload, $key, 'HS256');
    }

    /**
     * Login user
     *
     * @author Herlangga Sefani <herlangga.sefani@gmail.com>
     *
     * @api {post} /api/v1/login Login User
     * @apiVersion 1.0.0
     * @apiName Login
     * @apiGroup Auth
     * @apiBody {String} username
     * @apiBody {String} password
     * @apiSuccess {String} key Token For Next Request
     * @apiError {String} message Error Message
     */
    public function login()
    {
        //
        $username = $this->request->getJsonVar('username');
        $password = $this->request->getJsonVar('password');
        $rules = [
            'username' => 'required',
            'password' => 'required',
        ];
        $validate = Validate::run([
            'username'  => $username,
            'password' => $password
        ], $rules);
        if($validate !== true) {
            return $this->errorOutput($validate, 400);
        }

        $user = $this->findUser($username, $password);

    

        if(!$user) {
            return $this->errorOutput("Invalid username or password", 401);
        }

      

        $token = $this->generateToken($user);
        

        // Log User
//        $UserLog = new UserLog();
//        $UserLog->insert([
//            'user_id' => $user->id,
//            'event_section' => "AUTH",
//            'event_action' => 'LOGIN',
//            'event_note' => "Logged in From : {$this->request->getUserAgent()}",
//            'ip_address' => $this->request->getIPAddress(),
//        ]);

        return $this->successOutput([
            'key' => $token,
        ]);
    }


    private function findUser(string $username, string $password): ?object
    {
        // 1. users table
        $user = (new User())
            ->where('username', $username)
            ->first();

        if ($user && password_verify($password, $user->password)) {
            $user->source = 'users';
            return $user;
        }

        // 2. appusers table
        $appUser = (new AppUser())
            ->where('username', $username)
            ->first();

        if ($appUser && password_verify($password, $appUser->password)) {
            $appUser->source = 'appusers';
            return $appUser;
        }

        return null;
    }


    private function findUserById(int $id): ?object
    {
        // 1. users table
        $user = (new User())
            ->find($id);

        if ($user ) {
            $user->source = 'users';
            return $user;
        }

        // 2. appusers table
        $appUser = (new AppUser())
            ->find($id)
            ->first();

        if ($appUser ) {
            $appUser->source = 'appusers';
            return $appUser;
        }

        return null;
    }

    /**
     * Detect who is this user
     *
     * @author Herlangga Sefani <herlangga.sefani@gmail.com>
     *
     * @api {get} api/v1/whoami Get Login User
     * @apiVersion 1.0.0
     * @apiName Get-User
     * @apiGroup Auth
     * @apiHeader {String} key Token
     * @apiSuccess {Integer} id User ID
     * @apiSuccess {String} username Username
     * @apiSuccess {String} role User Roles
     * @apiError {String} message Error Message
     *
     */
    public function whoami()
    {
//        $User = new User();
        $user = $this->findUserById($this->request->id ?? null);
//        if(!$user) {
//            return $this->errorOutput("Invalid token", 401);
//        }
//
//        $role = (new Role())->find($user->role_id);
//        $role_actions = (new RoleAction())->where('role_id', $role->id)->get()->getResult();
//        array_walk($role_actions, function(&$item) {
//            $Module = new Module();
//            $item->module = $Module->find($item->module_id);
//        });


        if($this->request->source === "users") {
            $User = new User();
            $user = $User->find($this->request->id);
        }else{
            $User = new Appuser();
            $user = $User->find($this->request->id);

        }

        return $this->successOutput([
            'id' => $user->id,
            'username' => $user->username,
//            'scope' => $user->role_id,
            'fullname' => $user->full_name,
            'user' => $user,
//            'role_actions' => $role_actions,
        ]);
    }

  
    /**
     * Validate Token API
     * @return mixed
     */
    public function validateToken() {
        $ApiToken = new ApiToken();
        $token = $ApiToken->find($this->request->getHeaderLine('key'));
        if(!$token) {
            return $this->errorOutput("Invalid token", 401);
        }
        return $this->successOutput([
            'id' => $token->id,
            'token' => $token->token
        ]);
    }

    /**
     * Update current user password
     * @return mixed|void
     */
    public function updatePassword() {
        $User = new User();
        $user = $User->find($this->request->id ?? null);
        if(empty($user)) {
            return $this->errorOutput("Invalid token", 401);
        }

        $password = $this->request->getJsonVar('password');
        $current_password = $this->request->getJsonVar('current_password');

//        $rules = [
//            'password'          => 'required|min_length[6]',
//            'current_password'  => 'required|min_length[6]'
//        ];
//        $validate = Validate::run([
//            'password' => $password,
//            'current_password' => $current_password
//        ], $rules);
//
//        if($validate !== true) {
//            return $this->errorOutput($validate, 400);
//        }

        if(empty($password)) {
            return $this->errorOutput("Kata sandi tidak boleh kosong", 400);
        }

        if(empty($password) || empty($current_password)) {
            return $this->errorOutput("Kata sandi baru tidak boleh kosong ", 400);
        }

        if(hash('SHA256', $current_password) !== $user->password) {
            return $this->errorOutput("Kata sandi saat ini tidak valid", 400);
        }


        $User->update($user->id, [
            'password' => $password,
            'last_update_password' => time()
        ]);

        

        return $this->successOutput([
            'message' => 'Password updated',
        ]);
    }

    

    public function logout()
    {
        $User = new User();
        $user = $User->find($this->request->id ?? null);
        echo json_encode($user); die();
        // Log User
        $UserLog = new UserLog();
        $UserLog->insert([
            'user_id' => $user->id,
            'event_section' => "AUTH",
            'event_action' => 'Logout', 
            'event_note' => "Logout in From : {$this->request->getUserAgent()}",
            'ip_address' => $this->request->getIPAddress(),
        ]); 
        
        return $this->successOutput(['user' => $user]);
    }

}
