<?php

namespace App\Controllers\Api;


use App\Models\ApiToken;
use App\Models\Appuser;
use App\Models\EventsOrganizer;
use App\Models\Module;
use App\Models\RoleAction;
use App\Models\Role;
use App\Models\User;
use App\Models\UserLog;
use Config\Services;
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

        unset($user->password);
        return $this->successOutput([
            'key' => $token,
            'user' => $user
        ]);
    }


    private function findUser(string $username, string $password): ?object
    {
        // 1. users table
        $db = \Config\Database::connect();


        $requestservice = Services::request();
        $request = $requestservice->getGet();

        $role = [];
        $User = $db->table('users')->where(['username' => $username]);


        if(!empty($request['role'])) {
            if($request['role'] === 'GUEST') {
                $User->whereIn('role', ['VIP Member', 'General_User']);
            }
        }

        $user = $User->get()->getRow();

        if ($user && password_verify($password, $user->password)) {
            $user->source = 'users';
            return $user;
        }

        if(!empty($request['role'])) {
            if ($request['role'] === 'GUEST') {
                return null;
            }
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




        $fullname = "";
        if($this->request->source === "users") {
            $User = new User();
            $user = $User->find($this->request->id);
            $fullname = $user->name;
        }else{
            $User = new Appuser();
            $user = $User->find($this->request->id);
            $fullname = $user->full_name;

        }

        return $this->successOutput([
            'id' => $user->id,
            'source' => $this->request->source,
            'username' => $user->username,
//            'scope' => $user->role_id,
            'fullname' => $fullname,
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

    public function registerMember()
    {
        helper(['form']);

        // =============================
        // Validation Rules
        // =============================
        $rules = [
            'username'      => 'required|min_length[4]|max_length[30]|alpha_numeric',
            'name'          => 'required|min_length[3]',
            'email'         => 'required|valid_email',
            'password'      => 'required|min_length[8]',
            'phone'         => 'required|min_length[6]',


        ];

        if (!$this->validate($rules)) {
            return $this->errorOutput(json_encode($this->validator->getErrors()), 400);
        }
        $UserModel = new User();
        $userId = $UserModel->insert([
            'username'   => $this->request->getJsonVar('username'),
            'name'       => $this->request->getJsonVar('name'),
            'email'      => $this->request->getJsonVar('email'),
            'password'   => $this->request->getJsonVar('password'),
            'phone'      => $this->request->getJsonVar('phone'),
            'role'      => $this->request->getJsonVar('role'),
            'status'      => $this->request->getJsonVar('status'),
            'created_at'=> date('Y-m-d H:i:s')
        ], true);
        if ($userId === false) {
            return  $this->errorOutput(json_encode($UserModel->errors(), true), 400);

        }
        $user = $UserModel->find($userId);

        return $this->successOutput(['user' => $user]);
    }




    public function registerEo()
    {
        helper(['form']);

        // =============================
        // Validation Rules
        // =============================
        $rules = [
            'username'      => 'required|min_length[4]|max_length[30]|alpha_numeric',
            'name'          => 'required|min_length[3]',
            'email'         => 'required|valid_email',
            'password'      => 'required|min_length[8]',
            'phone'         => 'required|min_length[6]',
            'eo_name'       => 'required',
            'company_name'  => 'required',
            'website'       => 'permit_empty|valid_url',
            'address'       => 'required',
//            'tax_id'        => 'required',
            'description'  => 'permit_empty|max_length[500]',
//            'logo'          => [
//                'rules' => 'uploaded[logo]|max_size[logo,2048]|is_image[logo]|mime_in[logo,image/png,image/jpg,image/jpeg]',
//                'errors' => [
//                    'uploaded' => 'Logo wajib diupload',
//                    'max_size' => 'Ukuran logo maksimal 2MB',
//                    'is_image' => 'File harus berupa gambar',
//                ]
//            ]
        ];

        if (!$this->validate($rules)) {
            return $this->errorOutput(json_encode($this->validator->getErrors()), 400);
        }

        $db = db_connect();
        $db->transBegin();

        try {
            // =============================
            // Upload Logo
            // =============================
            $logo      = $this->request->getFile('logo');
            $logoName  = $logo->getRandomName();
            $uploadPath = FCPATH . 'uploads/event_organizer';
            $logo->move($uploadPath, $logoName);

            // =============================
            // Create User
            // =============================
            $userModel = new User();

            if ($userModel->where('email', $this->request->getPost('email'))->first()) {
                throw new \Exception('Email sudah terdaftar');
            }


            $eoModel = new EventsOrganizer();
            $eo_id = $eoModel->insert([
                'eo_name'       => $this->request->getPost('eo_name'),
                'company_name'  => $this->request->getPost('company_name'),
                'website'       => $this->request->getPost('website'),
                'address'       => $this->request->getPost('address'),
//                'tax_id'        => $this->request->getPost('tax_id'),
                'eo_slug'       => generate_slug($this->request->getPost('eo_name')),
                'email'      => $this->request->getPost('email'),
                'phone'      => $this->request->getPost('phone'),
                'description'  => $this->request->getPost('description'),
                'logo_path'          => $logoName,
                'created_at'    => date('Y-m-d H:i:s')
            ], true);

            $userId = $userModel->insert([
                'eo_id'     => $eo_id,
                'username'   => $this->request->getPost('username'),
                'name'       => $this->request->getPost('name'),
                'email'      => $this->request->getPost('email'),
                'password'   => $this->request->getPost('password'),
                'phone'      => $this->request->getPost('phone'),
                'role'       => 'EO Admin',
                'is_active'  => 1,
                'created_at'=> date('Y-m-d H:i:s')
            ], true);




            $db->transCommit();
            return $this->successOutput(['data' => $userId]);

        } catch (\Throwable $e) {
            $db->transRollback();
            return $this->errorOutput($e->getMessage());
        }
    }

}
