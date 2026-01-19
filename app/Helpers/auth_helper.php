<?php

/**
 * Authentication Helper Functions
 * @author Sarip Hidayat <hidayatsarip2210@gmail.com>
 * @date 2026-01-17
 */

if (!function_exists('generate_referral_code')) {
    /**
     * Generate unique referral code
     * Format: REF + 6-digit padded ID + 4-char hash
     * Example: REF000123AB4C
     * 
     * @param int $user_id
     * @param string $username
     * @return string
     */
    function generate_referral_code(int $user_id, string $username): string
    {
        $paddedId = str_pad($user_id, 6, '0', STR_PAD_LEFT);
        $hash = substr(md5($user_id . $username . time()), 0, 4);
        return 'REF' . $paddedId . strtoupper($hash);
    }
}

if (!function_exists('hash_password')) {
    /**
     * Hash password using bcrypt
     * 
     * @param string $password
     * @return string
     */
    function hash_password(string $password): string
    {
        return password_hash($password, PASSWORD_BCRYPT, ['cost' => 12]);
    }
}

if (!function_exists('verify_password')) {
    /**
     * Verify password against hash
     * 
     * @param string $password
     * @param string $hash
     * @return bool
     */
    function verify_password(string $password, string $hash): bool
    {
        return password_verify($password, $hash);
    }
}

if (!function_exists('generate_random_password')) {
    /**
     * Generate secure random password
     * 
     * @param int $length
     * @return string
     */
    function generate_random_password(int $length = 12): string
    {
        $uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        $lowercase = 'abcdefghijklmnopqrstuvwxyz';
        $numbers = '0123456789';
        $special = '!@#$%^&*';

        $all = $uppercase . $lowercase . $numbers . $special;

        // Ensure at least one of each type
        $password = '';
        $password .= $uppercase[random_int(0, strlen($uppercase) - 1)];
        $password .= $lowercase[random_int(0, strlen($lowercase) - 1)];
        $password .= $numbers[random_int(0, strlen($numbers) - 1)];
        $password .= $special[random_int(0, strlen($special) - 1)];

        // Fill the rest randomly
        for ($i = 4; $i < $length; $i++) {
            $password .= $all[random_int(0, strlen($all) - 1)];
        }

        // Shuffle the password
        return str_shuffle($password);
    }
}

if (!function_exists('validate_password_strength')) {
    /**
     * Validate password strength
     * 
     * @param string $password
     * @return array ['valid' => bool, 'errors' => array]
     */
    function validate_password_strength(string $password): array
    {
        $errors = [];

        if (strlen($password) < 8) {
            $errors[] = 'Password must be at least 8 characters long';
        }

        if (!preg_match('/[A-Z]/', $password)) {
            $errors[] = 'Password must contain at least one uppercase letter';
        }

        if (!preg_match('/[a-z]/', $password)) {
            $errors[] = 'Password must contain at least one lowercase letter';
        }

        if (!preg_match('/[0-9]/', $password)) {
            $errors[] = 'Password must contain at least one number';
        }

        return [
            'valid' => empty($errors),
            'errors' => $errors
        ];
    }
}

if (!function_exists('get_password_strength')) {
    /**
     * Get password strength indicator
     * 
     * @param string $password
     * @return string 'Weak', 'Medium', 'Strong'
     */
    function get_password_strength(string $password): string
    {
        $score = 0;

        if (strlen($password) >= 8)
            $score++;
        if (strlen($password) >= 12)
            $score++;
        if (preg_match('/[A-Z]/', $password))
            $score++;
        if (preg_match('/[a-z]/', $password))
            $score++;
        if (preg_match('/[0-9]/', $password))
            $score++;
        if (preg_match('/[^A-Za-z0-9]/', $password))
            $score++;

        if ($score <= 2)
            return 'Weak';
        if ($score <= 4)
            return 'Medium';
        return 'Strong';
    }
}

if (!function_exists('invalidate_user_sessions')) {
    /**
     * Invalidate all user sessions
     * 
     * @param int $user_id User ID
     * @return bool Success status
     */
    function invalidate_user_sessions(int $user_id): bool
    {
        try {
            $db = \Config\Database::connect();

            // Check if ci_sessions table exists
            if (!$db->tableExists('ci_sessions')) {
                // If sessions table doesn't exist, just log and return true
                // This means the project might be using different session driver (file, redis, etc)
                log_message('info', "Sessions table not found, skipping session invalidation for user {$user_id}");
                return true;
            }

            // Delete all sessions for this user
            $db->table('ci_sessions')
                ->where('data LIKE', '%"user_id";i:' . $user_id . ';%')
                ->delete();

            return true;
        } catch (\Exception $e) {
            // Log error but don't fail the operation
            log_message('error', 'Failed to invalidate sessions: ' . $e->getMessage());
            return false;
        }
    }
}

