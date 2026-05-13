<?php
/**
 * Enhanced User Controller with Role-Based Access Control
 * @author Sarip Hidayat <hidayatsarip2210@gmail.com>
 * @copyright Sarip Hidayat 2026
 * @date 2026-01-17
 */

namespace App\Controllers\Api;

use App\Filters\SearchFilter;
use App\Models\Role;
use App\Models\SysUsersRole;
use App\Models\User;
use App\Models\EventsOrganizer;
use App\Models\UserLog;
use function PHPUnit\Framework\throwException;

class UserController extends ApiController
{
    protected $userModel;

    public function __construct()
    {
        parent::__construct();
        $this->userModel = new User();
        helper(['auth', 'email']);
    }

    /**
     * List Users with Role-Based Filtering
     * 
     * @api {get} /api/v1/users List User
     * @apiName List-User
     * @apiGroup User   
     * @apiVersion 2.0.0
     * @apiHeader {String} key Token
     * @apiQuery {String} search Search (username, name, email)
     * @apiQuery {String} role Filter by role
     * @apiQuery {String} status Filter by status
     * @apiQuery {String} eo_id Filter by Events Organizer ID
     * @apiQuery {String} sort_by Sort by column (username, name, email, last_login, created_at)
     * @apiQuery {String} sort_order Sort order (asc, desc)
     * @apiQuery {Number} per_page Items per page
     * @apiQuery {Number} page Page number
     */

    public function index()
    {
        // Get current user from session/request
        $currentUser = $this->getCurrentUser();

        if (!$currentUser) {
            return $this->failUnauthorized('User not authenticated');
        }

        // Start with base query including relationships
        $builder = $this->userModel->getWithRelations();

        // Apply role-based filtering
        $builder = $this->applyRoleBasedFilter($builder, $currentUser);

        // Apply search
        $search = $this->request->getGet('search');
        if ($search) {
            $builder->groupStart()
                ->like('users.username', $search)
                ->orLike('users.name', $search)
                ->orLike('users.email', $search)
                ->groupEnd();
        }

        // Apply filters
        $role = $this->request->getGet('role');
        if ($role) {
            $builder->where('users.role', $role);
        }

        $status = $this->request->getGet('status');
        if ($status) {
            $builder->where('users.status', $status);
        }

        $current_user = $this->request->current_user;
        if (!empty($current_user['eo_id'])) {
            $builder->where('users.eo_id', $current_user['eo_id']);
        }

        // Apply sorting
        $sortBy = $this->request->getGet('sort_by') ?? 'created_at';
        $sortOrder = $this->request->getGet('sort_order') ?? 'desc';

        // Validate sort column
        $allowedSort = ['username', 'name', 'email', 'last_login', 'created_at'];
        if (in_array($sortBy, $allowedSort)) {
            $builder->orderBy('users.' . $sortBy, $sortOrder);
        }

        // Pagination
        $perPage = $this->request->getGet('per_page') ?? 25;
        $page = $this->request->getGet('page') ?? 1;

        // Get total count before pagination
        $total = $builder->countAllResults(false);

        // Apply pagination
        $offset = ($page - 1) * $perPage;
        $users = $builder->limit($perPage, $offset)->find();

        // Format user data
        foreach ($users as &$user) {
            unset($user->password);
            $user->role_detail = [
                'role_name' => $user->role_name ?? null,
                'role_slug' => $user->role_slug ?? null,
                'description' => $user->role_description ?? null
            ];
            $user->eo_detail = null;
            if ($user->eo_id) {
                $user->eo_detail = [
                    'id' => $user->eo_id,
                    'eo_name' => $user->eo_name ?? null,
                    'company_name' => $user->company_name ?? null
                ];
            }
        }

        $output = [
            'users' => $users,
            'pagination' => [
                'page' => (int) $page,
                'per_page' => (int) $perPage,
                'total' => $total,
                'filtered_total' => $total,
                'page_count' => ceil($total / $perPage)
            ]
        ];

        return $this->successOutput($output);
    }

     public function lists()
    {
        $Model = new User();

        // Define searchable column on this model
        $searchable_column = [
            'search' => ['eo_id', 'username', 'name', 'email', 'password', 'phone', 'role', 'profile_picture', 'refferalcode', 'status', 'google_id', 'verification_token', 'reset_token_expiry', 'email_verified_at', 'last_login', 'updated_at'],
        ];

        // Execute search filter
        $output = SearchFilter::execute($Model, $searchable_column, 'users');

        // Return output
        return $this->successOutput($output);
    }


    public function member() {
        $Model = new User();

        // Define searchable column on this model
        $searchable_column = [
            'search' => [
                'eo_id',
                'username',
                'name',
                'email',
                'password',
                'phone',
                'role',
                'profile_picture',
                'refferalcode',
                'status',
                'last_login',
                'updated_at'
            ],
        ];

        // Execute search filter
        $output = SearchFilter::execute($Model, $searchable_column, 'users', ['eo_id' => null]);

        array_walk($output['users'], function(&$item) {
            $Role = new SysUsersRole();
            $item->role_detail = $Role->where('role_name', $item->role)->first() ?? [];

            $EventsOrganizer = new EventsOrganizer();
            $item->eo_detail = $EventsOrganizer->find($item->eo_id) ?? [];
        });

        // Return output
        return $this->successOutput($output);
    }

    /**
     * Get Single User Detail
     * 
     * @api {get} /api/v1/user/:id Get User Detail
     * @apiParam {Number} id User ID
     */
    public function show($id)
    {
        $currentUser = $this->getCurrentUser();

        if (!$currentUser) {
            return $this->failUnauthorized('User not authenticated');
        }

        $user = $this->userModel->getWithRelations($id);

        if (!$user) {
            return $this->failNotFound('User not found');
        }

        // Check access permission
//        if (!$this->canAccessUser($currentUser, $user)) {
//            return $this->failForbidden('You do not have permission to view this user');
//        }

        // Format response
        unset($user->password);
        $user->role_detail = [
            'role_name' => $user->role_name ?? null,
            'role_slug' => $user->role_slug ?? null,
            'description' => $user->role_description ?? null
        ];
        $user->eo_detail = null;
        if ($user->eo_id) {
            $user->eo_detail = [
                'id' => $user->eo_id,
                'eo_name' => $user->eo_name ?? null,
                'company_name' => $user->company_name ?? null
            ];
        }

        return $this->successOutput(['user' => $user]);
    }

    /**
     * Create New User
     * 
     * @api {post} /api/v1/user Create User
     * @apiBody {String} username Username
     * @apiBody {String} name Full name
     * @apiBody {String} email Email address
     * @apiBody {String} password Password
     * @apiBody {String} phone Phone number
     * @apiBody {String} role User role
     * @apiBody {Number} [eo_id] Events Organizer ID (required for EO roles)
     * @apiBody {String} [status=Active] User status
     * @apiBody {String} [profile_picture] Profile picture URL
     */
    public function create()
    {
        $currentUser = $this->getCurrentUser();

        if (!$currentUser) {
            return $this->failUnauthorized('User not authenticated');
        }

        $data = [
            'username' => $this->request->getJsonVar('username'),
            'name' => $this->request->getJsonVar('name'),
            'email' => $this->request->getJsonVar('email'),
            'password' => $this->request->getJsonVar('password'),
            'phone' => $this->request->getJsonVar('phone'),
            'role' => $this->request->getJsonVar('role'),
            'eo_id' => $this->request->getJsonVar('eo_id'),
            'status' => $this->request->getJsonVar('status') ?? 'Active',
            'profile_picture' => $this->request->getJsonVar('profile_picture')
        ];

        // Validate role authorization
        if (!$this->canCreateUserWithRole($currentUser, $data['role'])) {
            return $this->failForbidden('You do not have permission to create user with this role');
        }

        // Validate EO assignment
        if (in_array($data['role'], ['EO Owner', 'EO Staff'])) {
            if (!$data['eo_id']) {
                return $this->failValidationErrors(['eo_id' => 'Events Organizer is required for EO roles']);
            }
            // EO Owner can only create for their own EO
            if ($currentUser->role === 'EO Owner' && $data['eo_id'] != $currentUser->eo_id) {
                return $this->failForbidden('You can only create users for your own Events Organizer');
            }
        } else {
            // Non-EO roles should not have eo_id
            $data['eo_id'] = null;
        }

        // Validate password strength
        $passwordValidation = validate_password_strength($data['password']);
        if (!$passwordValidation['valid']) {
            return $this->failValidationErrors(['password' => implode(', ', $passwordValidation['errors'])]);
        }

        // Insert user
        $userId = $this->userModel->insert($data);

        if (!$userId) {
            $errors = $this->userModel->errors();
            return $this->failValidationErrors($errors);
        }

        // Update referral code with actual user ID
        $this->userModel->updateReferralCode($userId, $data['username']);

        // Get created user
        $user = $this->userModel->getWithRelations($userId);
        unset($user->password);

        // Send welcome email (optional)
        // send_welcome_email($user);

        return $this->successOutput(['user' => $user, 'id' => $userId], 201);
    }

    /**
     * Update Existing User
     * 
     * @api {put} /api/v1/user/:id Update User
     * @apiParam {Number} id User ID
     * @apiBody {String} name Full name
     * @apiBody {String} phone Phone number
     * @apiBody {String} role User role
     * @apiBody {Number} [eo_id] Events Organizer ID
     * @apiBody {String} status User status
     * @apiBody {String} [profile_picture] Profile picture URL
     */
    public function update($id)
    {
        $currentUser = $this->getCurrentUser();

        if (!$currentUser) {
            return $this->failUnauthorized('User not authenticated');
        }

        $targetUser = $this->userModel->find($id);

        if (!$targetUser) {
            return $this->errorOutput('User not found', 404);
        }

        // Check access permission
        if (!$this->canAccessUser($currentUser, $targetUser)) {
            return $this->errorOutput('You do not have permission to edit this user', 403);
        }

        // Build update data (excluding readonly fields)
        $data = [
            'name' => $this->request->getJsonVar('name'),
            'phone' => $this->request->getJsonVar('phone'),
            'role' => $this->request->getJsonVar('role'),
//            'eo_id' => $this->request->getJsonVar('eo_id'),
            'status' => $this->request->getJsonVar('status'),
//            'profile_picture' => $this->request->getJsonVar('profile_picture')
        ];

        // Validate role change
        if ($data['role'] !== $targetUser->role) {
            if (!$this->canCreateUserWithRole($currentUser, $data['role'])) {
                return $this->failForbidden('You do not have permission to change role to this value');
            }
        }

        // Validate EO assignment
        if (in_array($data['role'], ['EO Owner', 'EO Staff'])) {
            if (!$data['eo_id']) {
                return $this->failValidationErrors(['eo_id' => 'Events Organizer is required for EO roles']);
            }
        } else {
            $data['eo_id'] = null;
        }

        // Handle password update separately (only if provided)
        $password = $this->request->getJsonVar('password');
        if ($password && !empty($password)) {
            $passwordValidation = validate_password_strength($password);
            if (!$passwordValidation['valid']) {
                return $this->failValidationErrors(['password' => implode(', ', $passwordValidation['errors'])]);
            }
            $data['password'] = $password;
        }

        // Update user
        $updated = $this->userModel->update($id, $data);

        if (!$updated) {
            $errors = $this->userModel->errors();
            return $this->failValidationErrors($errors);
        }

        // Get updated user
        $user = $this->userModel->getWithRelations($id);
        unset($user->password);

        return $this->successOutput(['user' => $user]);
    }

    /**
     * Change User Status
     * 
     * @api {patch} /api/v1/user/:id/status Change User Status
     * @apiParam {Number} id User ID
     * @apiBody {String} status New status (Active, Inactive, Suspended)
     * @apiBody {String} [reason] Reason for status change
     */
    public function changeStatus($id)
    {
        $currentUser = $this->getCurrentUser();

        if (!$currentUser) {
            return $this->errorOutput('User not authenticated');
        }

        // Prevent changing own status
        if ($id == $currentUser['id']) {
            return $this->errorOutput('You cannot change your own status');
        }

        $targetUser = $this->userModel->find($id);

        if (!$targetUser) {
            return $this->errorOutput('User not found');
        }

        // Check access permission
//        if (!$this->canAccessUser($currentUser, $targetUser)) {
//            return $this->failForbidden('You do not have permission to change this user status');
//        }

        $newStatus = $this->request->getJsonVar('status');
        $reason = $this->request->getJsonVar('reason') ?? '';

        if (!in_array($newStatus, ['Active', 'Inactive', 'Suspended'])) {
            return $this->failValidationErrors(['status' => 'Invalid status value']);
        }

        $oldStatus = $targetUser->status;

        // Update status
        $this->userModel->update($id, ['status' => $newStatus]);

        // Invalidate sessions if status changed to Inactive or Suspended
        if (in_array($newStatus, ['Inactive', 'Suspended'])) {
            invalidate_user_sessions($id);
        }

        // Send email notification (optional)
        // send_status_change_email($targetUser, $oldStatus, $newStatus, $reason);

        return $this->successOutput([
            'message' => 'User status updated successfully',
            'old_status' => $oldStatus,
            'new_status' => $newStatus
        ]);
    }

    /**
     * Reset User Password
     * 
     * @api {post} /api/v1/user/:id/reset-password Reset Password
     * @apiParam {Number} id User ID
     * @apiBody {Boolean} [send_email=true] Send password via email
     * @apiBody {Boolean} [force_change=true] Force password change on next login
     */
    public function resetPassword($id)
    {
        $currentUser = $this->getCurrentUser();

        if (!$currentUser) {
            return $this->failUnauthorized('User not authenticated');
        }

        $targetUser = $this->userModel->find($id);

        if (!$targetUser) {
            return $this->failNotFound('User not found');
        }

        // Check access permission
//        if (!$this->canAccessUser($currentUser, $targetUser)) {
//            return $this->failForbidden('You do not have permission to reset this user password');
//        }

        // Get new password from request (allow admin to set custom password)
        $newPassword = $this->request->getJsonVar('new_password');

        if (!$newPassword) {
            return $this->failValidationErrors(['new_password' => 'New password is required']);
        }

        // Validate password strength (optional but recommended)
        if (strlen($newPassword) < 8) {
            return $this->failValidationErrors(['new_password' => 'Password must be at least 8 characters']);
        }

        // Update password (will be hashed by model callback)
        $this->userModel->update($id, ['password' => $newPassword]);

        // Invalidate all sessions
//        invalidate_user_sessions($id);

        // Send email with new password (optional)
//        $sendEmail = $this->request->getJsonVar('send_email') ?? false;
//        if ($sendEmail) {
//            send_password_reset_email($targetUser, $newPassword);
//        }

        return $this->successOutput([
            'message' => 'Password reset successfully.',
//            'email_sent' => $sendEmail
        ]);
    }

    /**
     * Soft Delete User (Set status to Inactive)
     * 
     * @api {delete} /api/v1/user/:id Delete User
     * @apiParam {Number} id User ID
     * @deprecated Use changeStatus instead
     */
    public function delete($id)
    {
        $currentUser = $this->getCurrentUser();

        if (!$currentUser) {
            return $this->errorOutput('User not authenticated');
        }

        if ($id == $currentUser['id']) {
            return $this->errorOutput('You cannot delete your own account');
        }

        $targetUser = $this->userModel->find($id);

        if (!$targetUser) {
            return $this->errorOutput('User not found');
        }

        // Check access permission
        if (!$this->canAccessUser($currentUser, $targetUser)) {
            return $this->errorOutput('You do not have permission to delete this user');
        }

        // Soft delete: just set status to Inactive
        $this->userModel->delete($id); // This will trigger softDeleteInstead callback

        return $this->successOutput(['message' => 'User deactivated successfully']);
    }

    // ========== Helper Methods ==========

    /**
     * Get current user from session/request
     * TODO: Implement based on your auth system
     */
    protected function getCurrentUser()
    {
        return $this->request->current_user;
    }

    /**
     * Apply role-based filtering to query
     */
    protected function applyRoleBasedFilter($builder, $currentUser)
    {
        switch ($currentUser['role']) {
            case 'Super Admin':
                // No filter - can see all users
                break;

            case 'EO Owner':
                // Only see users from own EO
                $builder->where('users.eo_id', $currentUser->eo_id);
                break;

            case 'Admin':
                // Only see non-EO users
                $builder->where('users.eo_id IS NULL');
                break;

            case 'EO Staff':
                // Only see users from own EO (read-only)
                $builder->where('users.eo_id', $currentUser->eo_id);
                break;
        }

        return $builder;
    }

    /**
     * Check if current user can access target user
     */
    protected function canAccessUser($currentUser, $targetUser)
    {
        switch ($currentUser['role']) {
            case 'super_admin':
                return true;

            case 'EO Owner':
            case 'EO Staff':
                return $targetUser->eo_id == $currentUser['eo_id'];

            case 'Admin':
                return $targetUser->eo_id === null;

            default:
                return false;
        }
    }

    /**
     * Check if current user can create user with specified role
     */
    protected function canCreateUserWithRole($currentUser, $role)
    {
        $roleHierarchy = [
            'Super Admin' => ['Super Admin', 'EO Owner', 'Admin', 'EO Staff'],
            'EO Owner' => ['EO Owner', 'EO Staff'],
            'Admin' => ['Admin'],
            'EO Staff' => []
        ];

        $allowedRoles = $roleHierarchy[$currentUser->role] ?? [];

        return in_array($role, $allowedRoles);
    }
}
