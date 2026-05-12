<?php

namespace App\Controllers\Api;


use App\Models\ApiToken;
use App\Models\Appuser;
use App\Models\EventsOrganizer;
use App\Models\Module;
use App\Models\RoleAction;
use App\Models\Role;
use App\Models\SysUsersRole;
use App\Models\User;
use App\Models\UserLog;
use Config\Services;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use App\Libraries\Validate;
use App\Models\UserLogged;
use App\Libraries\NotificationService;
use App\Libraries\RedisNotification;
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
            'username' => $username,
            'password' => $password
        ], $rules);
        if ($validate !== true) {
            return $this->errorOutput($validate, 400);
        }

        $user = $this->findUser($username, $password);



        if (!$user) {
            return $this->errorOutput("Invalid username or password", 401);
        }

        if ($user->status === 'Inactive') {
            return $this->errorOutput("Your account is " . $user->status . ". Please check your email for verification.", 401);
        }

        if ($user->status === 'Suspend') {
            return $this->errorOutput("Your account is " . $user->status . ". Please contact your administator.", 401);
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

        $User = new User();
        $User->update($user->id, [
            'last_login' => date("Y-m-d H:i:s"),
        ]);

        unset($user->password);
        return $this->successOutput([
            'key' => $token,
            'user' => $user
        ]);
    }


    /**
     * Login with Google SSO
     *
     * Verifies the Google ID token received from the frontend, looks up the user
     * by email or google_id, and returns a JWT if the user is Active.
     *
     * @api {post} /api/v1/auth/google Login With Google
     * @apiBody {String} id_token Google credential (ID token) from Google Sign-In
     * @apiSuccess {String} key JWT token for subsequent requests
     */
    public function loginWithGoogle()
    {
        $id_token = $this->request->getJsonVar('credential');

        if (empty($id_token)) {
            return $this->errorOutput('Google ID token is required', 400);
        }

        // Verify the token with Google
        $googleUser = $this->verifyGoogleToken($id_token);

        if (!$googleUser) {
            return $this->errorOutput('Google token tidak valid atau sudah expired', 401);
        }

        $email = $googleUser['email'] ?? null;
        $googleId = $googleUser['sub'] ?? null;
        $name = $googleUser['name'] ?? null;
        $picture = $googleUser['picture'] ?? null;

        if (empty($email) || empty($googleId)) {
            return $this->errorOutput('Tidak dapat mengambil informasi akun Google', 400);
        }

        // Find user by google_id first, then by email
        $UserModel = new User();
        $db = \Config\Database::connect();

        $user = $db->table('users')
            ->where('google_id', $googleId)
            ->get()->getRow();

        if (!$user) {
            // Try by email (user may have registered manually before)
            $user = $db->table('users')
                ->where('email', $email)
                ->get()->getRow();

            // If found by email, link the google_id for future logins
            if ($user) {
                $UserModel->skipValidation(true)->update($user->id, ['google_id' => $googleId]);
                $user->google_id = $googleId;
            }
        }

        // REGISTER
        $isNewUser = $this->request->getJsonVar('isNewUser');
        if($isNewUser && !$user) {
            $id = $UserModel->insert([
                'username' => $this->request->getJsonVar('username'),
                'google_id' => $googleId,
                'name' => $this->request->getJsonVar('name'),
                'email' => $this->request->getJsonVar('email'),
                'password' => $this->request->getJsonVar('password'),
                'phone' => $this->request->getJsonVar('phone'),
                'role' => 'General_User',
                'status' => 'Active',
                'created_at' => date('Y-m-d H:i:s'),
                'email_verified_at' => date('Y-m-d H:i:s'),
                'last_login' => date('Y-m-d H:i:s'),
            ]);
            $user = $UserModel->find($id);
        }

        if (!$user) {
            return $this->errorOutput(
                'Akun Google ini belum terdaftar. Silakan daftar terlebih dahulu.',
                404
            );
        }

        if ($user->status !== 'Active') {
            return $this->errorOutput(
                'Akun Anda berstatus ' . $user->status . '. Silakan cek email untuk verifikasi.',
                401
            );
        }


        $requestservice = Services::request();
        $request = $requestservice->getGet();
        if (!empty($request['role']) && $user) {
            $UserSysRole = new SysUsersRole();
            $usersysrole = $UserSysRole->where('role_name', $user->role)->first();

            if ($usersysrole->scope !== $request['role']) {
                return $this->errorOutput("Silahkan Login di halaman {$usersysrole->scope}");
            }
        }

        $user->source = 'users';
        $token = $this->generateToken($user);

        unset($user->password);
        return $this->successOutput([
            'key' => $token,
            'user' => $user,
        ]);
    }

    /**
     * Verify a Google ID token using Google's tokeninfo endpoint
     * @param string $id_token
     * @return array|null  Decoded token claims, or null on failure
     */
    private function verifyGoogleToken(string $accessToken): ?array
    {
        $ch = curl_init();

        curl_setopt_array($ch, [
            CURLOPT_URL => 'https://www.googleapis.com/oauth2/v3/userinfo',
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_TIMEOUT => 10,
            CURLOPT_HTTPHEADER => [
                'Authorization: Bearer ' . $accessToken,
            ],
        ]);

        $response = curl_exec($ch);

        $curlError = curl_error($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);

        curl_close($ch);


        if (!empty($curlError)) {
            return null;
        }

        if ($httpCode !== 200 || empty($response)) {
            return null;
        }

        $data = json_decode($response, true);

        return $data;
    }

    private function findUser(string $username, string $password): ?object
    {
        // 1. users table
        $db = \Config\Database::connect();


        $requestservice = Services::request();
        $request = $requestservice->getGet();

        $role = [];
        $user = $db->table('users')->where(['username' => $username])->get()->getRow();


        if (!empty($request['role']) && $user) {
            $UserSysRole = new SysUsersRole();
            $usersysrole = $UserSysRole->where('role_name', $user->role)->first();

            if ($usersysrole->scope !== $request['role']) {
                return null;
            }
        }

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

        if ($user) {
            $user->source = 'users';
            return $user;
        }

        // 2. appusers table
        $appUser = (new AppUser())
            ->find($id)
            ->first();

        if ($appUser) {
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
        if ($this->request->source === "users") {
            $User = new User();
            $user = $User->find($this->request->id);
            $fullname = $user->name;
        } else {
            $User = new Appuser();
            $user = $User->find($this->request->id);
            $fullname = $user->full_name;
            $user->fullName = $fullname;

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
    public function validateToken()
    {
        $ApiToken = new ApiToken();
        $token = $ApiToken->find($this->request->getHeaderLine('key'));
        if (!$token) {
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
    public function updatePassword()
    {
        $User = new User();
        $user = $User->find($this->request->id ?? null);
        if (empty($user)) {
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

        if (empty($password)) {
            return $this->errorOutput("Kata sandi tidak boleh kosong", 400);
        }

        if (empty($password) || empty($current_password)) {
            return $this->errorOutput("Kata sandi baru tidak boleh kosong ", 400);
        }

        if (hash('SHA256', $current_password) !== $user->password) {
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
            'username' => 'required|min_length[4]|max_length[30]|alpha_numeric|is_unique[users.username]',
            'name' => 'required|min_length[3]',
            'email' => 'required|valid_email|is_unique[users.email]',
            'password' => 'required|min_length[8]',
            'phone' => 'required|min_length[6]',


        ];

        if (!$this->validate($rules)) {
            return $this->errorOutput(json_encode($this->validator->getErrors()), 400);
        }
        $verification_token = bin2hex(random_bytes(32));

        $UserModel = new User();
        $userId = $UserModel->insert([
            'username' => $this->request->getJsonVar('username'),
            'name' => $this->request->getJsonVar('name'),
            'email' => $this->request->getJsonVar('email'),
            'password' => $this->request->getJsonVar('password'),
            'phone' => $this->request->getJsonVar('phone'),
            'role' => $this->request->getJsonVar('role'),
            'status' => 'Inactive',
            'verification_token' => $verification_token,
            'created_at' => date('Y-m-d H:i:s')
        ], true);
        if ($userId === false) {
            return $this->errorOutput(json_encode($UserModel->errors(), true), 400);

        }
        $user = $UserModel->find($userId);
        helper('email_helper');
        send_verification_email($user, $verification_token);

        return $this->successOutput(['user' => $user]);
    }

    public function updateMember()
    {
        helper(['form']);

        $UserModel = new User();

        // =============================
        // Get Request Data
        // =============================
        $user_id = $this->request->getJsonVar('user_id');

        if (empty($user_id)) {
            return $this->errorOutput("USERID NOT FOUND", 400);
        }

        // =============================
        // Find Existing User
        // =============================
        $user = $UserModel->find($user_id);

        if (!$user) {
            return $this->errorOutput("Username tidak ditemukan", 404);
        }

        $userId = $user->id; // pastikan model return array

        // =============================
        // Validation Rules (Basic Only)
        // =============================
        $rules = [
            'username' => 'required|min_length[4]|max_length[30]|alpha_numeric',
            'name' => 'required|min_length[3]',
            'email' => 'required|valid_email',
            'phone' => 'required|min_length[6]',
            'password' => 'permit_empty|min_length[8]',
        ];

        if (!$this->validate($rules)) {
            return $this->errorOutput(json_encode($this->validator->getErrors(), true), 400);
        }

        // =============================
        // Get Clean Input
        // =============================
        $input = [
            'username' => $this->request->getJsonVar('username'),
            'name' => $this->request->getJsonVar('name'),
            'email' => $this->request->getJsonVar('email'),
            'phone' => $this->request->getJsonVar('phone'),
        ];

        $password = $this->request->getJsonVar('password');

        // =============================
        // Uniqueness Check (Manual)
        // =============================

        // cek username
        $existUsername = $UserModel
            ->where('username', $input['username'])
            ->where('id !=', $userId)
            ->first();

        if ($existUsername) {
            return $this->errorOutput("Username sudah digunakan", 400);
        }

        // cek email
        $existEmail = $UserModel
            ->where('email', $input['email'])
            ->where('id !=', $userId)
            ->first();

        if ($existEmail) {
            return $this->errorOutput("Email sudah digunakan", 400);
        }

        // =============================
        // Prepare Update Data
        // =============================
        $data = [
            'username' => $input['username'],
            'name' => $input['name'],
            'email' => $input['email'],
            'phone' => $input['phone'],
            'updated_at' => date('Y-m-d H:i:s'),
        ];

        // optional password update
        if (!empty($password)) {
            $data['password'] = $password;
        }

        // optional: regenerate verification token jika email berubah
        if ($input['email'] !== $user->email) {
            $data['verification_token'] = bin2hex(random_bytes(32));
        }

        // =============================
        // Update Data
        // =============================
        if (!$UserModel->update($userId, $data)) {
            return $this->errorOutput(json_encode($UserModel->errors(), true), 400);
        }

        // =============================
        // Get Updated User
        // =============================
        $updatedUser = $UserModel->find($userId);

        // =============================
        // Send Email (optional)
        // =============================
        if (isset($data['verification_token'])) {
            helper('email_helper');
            send_verification_email($updatedUser, $data['verification_token']);
        }

        // =============================
        // Response
        // =============================
        return $this->successOutput([
            'user' => $updatedUser
        ]);
    }

    public function resendVerification()
    {
        $UserModel = new User();

        // =============================
        // Get Input
        // =============================
        $email = $this->request->getJsonVar('email');

        if (empty($email)) {
            return $this->errorOutput("Email wajib diisi", 400);
        }

        // =============================
        // Find User
        // =============================
        $user = $UserModel->where('email', $email)->first();

        if (!$user) {
            return $this->errorOutput("Email tidak terdaftar", 404);
        }

        // =============================
        // Check Already Verified
        // =============================
        if (!empty($user->email_verified_at)) {
            return $this->errorOutput("Email sudah terverifikasi", 400);
        }

        // =============================
        // Generate New Token
        // =============================
        $verificationToken = bin2hex(random_bytes(32));

        $updateData = [
            'verification_token' => $verificationToken,
            'updated_at' => date('Y-m-d H:i:s'),
        ];

        if (!$UserModel->update($user->id, $updateData)) {
            return $this->errorOutput(json_encode($UserModel->errors(), true), 400);
        }

        // =============================
        // Send Email
        // =============================
        helper('email_helper');
        send_verification_email($user, $verificationToken);

        // =============================
        // Response
        // =============================
        return $this->successOutput([
            'message' => 'Email verifikasi berhasil dikirim ulang'
        ]);
    }




    public function registerEo()
    {
        helper(['form']);

        // =============================
        // Validation Rules
        // =============================
        $rules = [
            'username' => 'required|is_unique[users.username]|min_length[4]|max_length[30]|alpha_numeric',
            'name' => 'required|min_length[3]',
            'email' => 'required|valid_email|is_unique[events_organizer.email]',
            'password' => 'required|min_length[8]',
            'phone' => 'required|min_length[6]',
            'eo_name' => 'required|is_unique[events_organizer.eo_name]',
            'company_name' => 'required',
            //            'legal_document' => [
//                'rules' => 'uploaded[legal_document]|max_size[legal_document,5120]|ext_in[legal_document,pdf,jpg,jpeg,png]',
//                'errors' => [
//                    'uploaded' => 'Dokumen legalitas wajib diupload',
//                    'max_size' => 'Ukuran dokumen maksimal 5MB',
//                    'ext_in' => 'Format dokumen harus PDF atau Gambar (JPG/PNG)',
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
            $logo = $this->request->getFile('logo');
            $logoName = null;
            if ($logo && $logo->isValid() && !$logo->hasMoved()) {
                $logoName = $logo->getRandomName();
                $uploadPath = FCPATH . 'uploads/event_organizer';
                $logo->move($uploadPath, $logoName);
            }

            // =============================
            // Upload Legality Document
            // =============================
            $legalityDoc = $this->request->getFile('legal_doc');
            $legalityDocName = null;
            if ($legalityDoc && $legalityDoc->isValid() && !$legalityDoc->hasMoved()) {
                $legalityDocName = $legalityDoc->getRandomName();
                $uploadPathLegality = FCPATH . 'uploads/legality';
                $legalityDoc->move($uploadPathLegality, $legalityDocName);
            }

            // =============================
            // Create User
            // =============================
            $userModel = new User();

            if ($userModel->where('email', $this->request->getPost('email'))->first()) {
                throw new \Exception('Email sudah terdaftar');
            }


            $eoModel = new EventsOrganizer();
            $eo_id = $eoModel->insert([
                'eo_name' => $this->request->getPost('eo_name'),
                'company_name' => $this->request->getPost('company_name'),
//                'organization_type' => $this->request->getPost('organization_type'),
                'legal_doc_path' => $legalityDocName,
                'website' => $this->request->getPost('website'),
                'address' => $this->request->getPost('address'),
                //                'tax_id'        => $this->request->getPost('tax_id'),
                'eo_slug' => generate_slug($this->request->getPost('eo_name')),
                'email' => $this->request->getPost('email'),
                'phone' => $this->request->getPost('phone'),
                'description' => $this->request->getPost('description'),
                'logo_path' => $logoName,
                'verification_status' => 'Pending',
                'created_at' => date('Y-m-d H:i:s'),
                'updated_at' => date('Y-m-d H:i:s')
            ], true);

            $verification_token = bin2hex(random_bytes(32));

            $userId = $userModel->insert([
                'eo_id' => $eo_id,
                'username' => $this->request->getPost('username'),
                'name' => $this->request->getPost('name'),
                'email' => $this->request->getPost('email'),
                'password' => $this->request->getPost('password'),
                'phone' => $this->request->getPost('phone'),
                'role' => 'EO Admin',
                'status' => 'Inactive',
                'verification_token' => $verification_token,
                'created_at' => date('Y-m-d H:i:s')
            ], true);



            if (!$userId) {
                $modelErrors = $userModel->errors();
                $dbError = $db->error();

                throw new \Exception('System bermasalah silahkan coba lagi');
            }

            $db->transCommit();


            // Send Verification Email

            $is_google = $this->request->getPost('is_google');
            if(empty($is_google)) {
                helper('email_helper');
                $userObj = $userModel->find($userId);
                send_verification_email($userObj, $verification_token);
            }


//            // Send notification to verification team (Admin/Validator)
//            $adminEmails = ['admin.utama@veentix.com', 'sarip@veentix.com'];
//            foreach ($adminEmails as $adminEmail) {
//                send_new_eo_registration_notification((object) [
//                    'eo_name' => $this->request->getPost('eo_name'),
//                    'company_name' => $this->request->getPost('company_name'),
//                    'organization_type' => $this->request->getPost('organization_type'),
//                    'email' => $this->request->getPost('email'),
//                ], $adminEmail);
//            }
            // =============================
            // Database & Real-time Notifications
            // =============================
            $notificationService = new NotificationService();
            $redisNotif = new RedisNotification('alerts');
            $appuserModel = new Appuser();
            $validators = $appuserModel->whereIn('role', ['super_admin'])->where('status', 'Active')->findAll();

            foreach ($validators as $validator) {
                // Database
                $notifId = $notificationService->create(
                    $validator->id,
                    'registration:new_eo',
                    'events_organizer',
                    $eo_id,
                    'New EO Registration',
                    "EO " . $this->request->getPost('eo_name') . " has registered and needs review.",
                    ['eo_name' => $this->request->getPost('eo_name'), 'company_name' => $this->request->getPost('company_name')]
                );

                // Real-time (WebSocket)
                if ($notifId) {
                    $redisNotif->publish('alert', [
                        'userId' => $validator->id,
                        'id' => $notifId,
                        'type' => 'registration:new_eo',
                        'message' => "EO " . $this->request->getPost('eo_name') . " has registered.",
                        'severity' => 'info'
                    ]);
                }
            }

            $is_google = $this->request->getPost('is_google');
            if(!empty($is_google)) {
                $google_token = $this->request->getPost('google_token');
                $googleUser = $this->verifyGoogleToken($google_token);

                if (!$googleUser) {
                    return $this->errorOutput('Google token tidak valid atau sudah expired', 401);
                }
                $googleId = $googleUser['sub'] ?? null;
                $userModel->skipValidation(true)->update($userId, [
                    'google_id'             => $googleId,
                    'email_verified_at'     => date('Y-m-d H:i:s'),
                    'status'                => 'Active',
                    'verification_token'    => ''
                ]);
                $userObj = $userModel->find($userId);

                $userObj->source = 'users';
                $token = $this->generateToken($userObj);

                unset($userObj->password);
                return $this->successOutput([
                    'key' => $token,
                    'user' => $userObj,
                ]);

            }

            return $this->successOutput(['data' => $userObj, 'message' => 'Registration successful. Please check your email for verification.']);

        } catch (\Throwable $e) {
            $db->transRollback();
            return $this->errorOutput($e->getMessage());
        }
    }


    public function updateEo()
    {
        helper(['form']);

        $db = db_connect();
        $db->transBegin();

        try {
            $userModel = new User();
            $eoModel = new EventsOrganizer();

            // =============================
            // Get Input (pakai ID sebagai acuan)
            // =============================
            $userId = $this->request->getPost('user_id');

            if (empty($userId)) {
                return $this->errorOutput("User ID wajib diisi", 400);
            }

            $user = $userModel->find($userId);
            if (!$user) {
                return $this->errorOutput("User tidak ditemukan", 404);
            }

            $eo = $eoModel->find($user->eo_id);
            if (!$eo) {
                return $this->errorOutput("Data EO tidak ditemukan", 404);
            }

            // =============================
            // Validation (basic only)
            // =============================
            $rules = [
                'username' => 'required|min_length[4]|max_length[30]|alpha_numeric',
                'name' => 'required|min_length[3]',
                'email' => 'required|valid_email',
                'phone' => 'required|min_length[6]',
                'eo_name' => 'required',
                'company_name' => 'required',
                'password' => 'permit_empty|min_length[8]',
            ];

            if (!$this->validate($rules)) {
                return $this->errorOutput(json_encode($this->validator->getErrors(), true), 400);
            }

            // =============================
            // Get Input Clean
            // =============================
            $input = [
                'username' => $this->request->getPost('username'),
                'name' => $this->request->getPost('name'),
                'email' => $this->request->getPost('email'),
                'phone' => $this->request->getPost('phone'),
                'eo_name' => $this->request->getPost('eo_name'),
                'company_name' => $this->request->getPost('company_name'),
                'website' => $this->request->getPost('website'),
                'address' => $this->request->getPost('address'),
                'description' => $this->request->getPost('description'),
            ];

            $password = $this->request->getPost('password');

            // =============================
            // Uniqueness Check
            // =============================

            // username
            $existUsername = $userModel
                ->where('username', $input['username'])
                ->where('id !=', $userId)
                ->first();

            if ($existUsername) {
                throw new \Exception("Username sudah digunakan");
            }

            // email (users)
            $existEmailUser = $userModel
                ->where('email', $input['email'])
                ->where('id !=', $userId)
                ->first();

            if ($existEmailUser) {
                throw new \Exception("Email sudah digunakan");
            }

            // email (EO)
            $existEmailEo = $eoModel
                ->where('email', $input['email'])
                ->where('id !=', $eo->id)
                ->first();

            if ($existEmailEo) {
                throw new \Exception("Email EO sudah digunakan");
            }

            // eo_name
            $existEoName = $eoModel
                ->where('eo_name', $input['eo_name'])
                ->where('id !=', $eo->id)
                ->first();

            if ($existEoName) {
                throw new \Exception("Nama EO sudah digunakan");
            }

            // =============================
            // Upload Logo (optional)
            // =============================
            $logo = $this->request->getFile('logo');
            $logoName = $eo->logo_path;

            if ($logo && $logo->isValid() && !$logo->hasMoved()) {
                $logoName = $logo->getRandomName();
                $uploadPath = FCPATH . 'uploads/event_organizer';

                $logo->move($uploadPath, $logoName);

                // optional: hapus logo lama
                if (!empty($eo->logo_path) && file_exists($uploadPath . '/' . $eo->logo_path)) {
                    unlink($uploadPath . '/' . $eo->logo_path);
                }
            }

            // =============================
            // Update EO
            // =============================
            $eoModel->update($eo->id, [
                'eo_name' => $input['eo_name'],
                'company_name' => $input['company_name'],
                'website' => $input['website'],
                'address' => $input['address'],
                'email' => $input['email'],
                'phone' => $input['phone'],
                'description' => $input['description'],
                'logo_path' => $logoName,
                'updated_at' => date('Y-m-d H:i:s')
            ]);

            // =============================
            // Prepare User Update
            // =============================
            $userData = [
                'username' => $input['username'],
                'name' => $input['name'],
                'email' => $input['email'],
                'phone' => $input['phone'],
                'updated_at' => date('Y-m-d H:i:s'),
            ];

            // password optional
            if (!empty($password)) {
                $userData['password'] = $password;
            }

            // =============================
            // Handle Email Change → Reverify
            // =============================
            if ($input['email'] !== $user->email) {
                $verification_token = bin2hex(random_bytes(32));

                $userData['verification_token'] = $verification_token;
                $userData['status'] = 'Inactive';

                helper('email_helper');
                send_verification_email($user, $verification_token);
            }

            // =============================
            // Update User
            // =============================
            $userModel->update($userId, $userData);

            // =============================
            // Commit
            // =============================
            $db->transCommit();

            return $this->successOutput([
                'message' => 'Data EO berhasil diperbarui'
            ]);

        } catch (\Throwable $e) {
            $db->transRollback();

            log_message('error', $e->getMessage());

            return $this->errorOutput($e->getMessage(), 400);
        }
    }

    /**
     * Verify email with token — renders a user-facing HTML page.
     * @param $token
     * @return string|\CodeIgniter\HTTP\ResponseInterface
     */
    public function verifyEmail($token)
    {
        $userModel = new User();
        $user = $userModel->where('verification_token', $token)->first();

        if (!$user) {
            return view('emails/verify_error');
        }

        $userModel->update($user->id, [
            'status' => 'Active',
            'verification_token' => null,
            'email_verified_at' => date('Y-m-d H:i:s'),
        ]);

        return view('emails/verify_success', ['user' => $user]);
    }

    /**
     * Forgot Password — step 1
     *
     * POST /api/v1/forgot-password
     * Body: { "email": "user@example.com" }
     *
     * Generates a secure password-reset token, stores it with a 1-hour expiry,
     * and sends a reset link to the user's email address.
     */
    public function forgotPassword()
    {
        $email = $this->request->getJsonVar('email');

        if (empty($email)) {
            return $this->errorOutput("Email wajib diisi", 400);
        }

        $UserModel = new User();
        $user = $UserModel->where('email', $email)->first();

        // Always respond with success to prevent email enumeration
        if (!$user) {
            return $this->successOutput([
                'message' => 'Jika email terdaftar, link reset password telah dikirim.'
            ]);
        }

        // Generate a secure reset token and set 1-hour expiry
        $resetToken = bin2hex(random_bytes(32));
        $resetExpiry = date('Y-m-d H:i:s', strtotime('+1 hour'));

        $UserModel->skipValidation(true)->update($user->id, [
            'verification_token' => $resetToken,
            'reset_token_expiry' => $resetExpiry,
        ]);
        $SysUserRole = new SysUsersRole();
        $sys_user_role = $SysUserRole->where('role_name', $user->role)->first();
        $frontendUrl = "";
        if ($sys_user_role) {
            if ($sys_user_role->scope === "EO") {
                $frontendUrl = env('NEXT_PUBLIC_SITE_URL');
            } else {
                $frontendUrl = env('NEXT_PUBLIC_API_BASE_URL') . '/auth';
            }
        }

        // Build the reset URL pointing to the frontend
        $resetUrl = $frontendUrl . '/reset-password?token=' . $resetToken;

        helper('email_helper');
        send_forgot_password_email($user, $resetToken, $resetUrl);

        return $this->successOutput([
            'message' => 'Jika email terdaftar, link reset password telah dikirim.'
        ]);
    }

    /**
     * Reset Password — step 2
     *
     * POST /api/v1/reset-password
     * Body: { "token": "...", "password": "newpassword123" }
     *
     * Validates the reset token (must exist and not be expired) then updates
     * the user password and clears the token.
     */
    public function resetPassword()
    {
        $token = $this->request->getJsonVar('otp');
        $password = $this->request->getJsonVar('new_password');

        if (empty($token) || empty($password)) {
            return $this->errorOutput("Token dan password wajib diisi", 400);
        }

        if (strlen($password) < 8) {
            return $this->errorOutput("Password minimal 8 karakter", 400);
        }

        $UserModel = new User();
        $user = $UserModel->where('verification_token', $token)->first();

        if (!$user) {
            return $this->errorOutput("Token tidak valid atau sudah digunakan", 400);
        }

        // Check expiry (column reset_token_expiry)
        if (!empty($user->reset_token_expiry) && strtotime($user->reset_token_expiry) < time()) {
            return $this->errorOutput("Token sudah kadaluarsa. Silakan minta link reset password baru.", 400);
        }

        // Update password and clear the token
        $UserModel->skipValidation(true)->update($user->id, [
            'password' => $password,
            'verification_token' => null,
            'reset_token_expiry' => null,
        ]);

        return $this->successOutput([
            'message' => 'Password berhasil direset. Silakan login dengan password baru Anda.'
        ]);
    }

}
