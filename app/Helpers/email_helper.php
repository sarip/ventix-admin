<?php

/**
 * Email Helper Functions
 * @author Sarip Hidayat <hidayatsarip2210@gmail.com>
 * @date 2026-01-17
 */

if (!function_exists('send_welcome_email')) {
    /**
     * Send welcome email to new user
     * 
     * @param object $user User object
     * @param string $password Plain text password (only for new users)
     * @return bool
     */
    function send_welcome_email(object $user, string $password = null): bool
    {
        $email = \Config\Services::email();

        $email->setFrom('noreply@venntix.com', 'Venntix Admin System');
        $email->setTo($user->email);
        $email->setSubject('Welcome to Venntix Admin System');

        $message = view('emails/welcome', [
            'user' => $user,
            'password' => $password,
            'login_url' => base_url('login')
        ]);

        $email->setMessage($message);

        if ($email->send()) {
            log_message('info', 'Welcome email sent to user: ' . $user->email);
            return true;
        } else {
            log_message('error', 'Failed to send welcome email to: ' . $user->email . ' - ' . $email->printDebugger(['headers']));
            return false;
        }
    }
}

if (!function_exists('send_password_reset_email')) {
    /**
     * Send password reset email
     * 
     * @param object $user User object
     * @param string $new_password New plain text password
     * @return bool
     */
    function send_password_reset_email(object $user, string $new_password): bool
    {
        $email = \Config\Services::email();

        $email->setFrom('noreply@venntix.com', 'Venntix Admin System');
        $email->setTo($user->email);
        $email->setSubject('Password Reset - Venntix Admin System');

        $message = view('emails/password_reset', [
            'user' => $user,
            'new_password' => $new_password,
            'login_url' => base_url('login')
        ]);

        $email->setMessage($message);

        if ($email->send()) {
            log_message('info', 'Password reset email sent to user: ' . $user->email);
            return true;
        } else {
            log_message('error', 'Failed to send password reset email to: ' . $user->email . ' - ' . $email->printDebugger(['headers']));
            return false;
        }
    }
}

if (!function_exists('send_status_change_email')) {
    /**
     * Send status change notification email
     * 
     * @param object $user User object
     * @param string $old_status Previous status
     * @param string $new_status New status
     * @param string $reason Reason for change
     * @return bool
     */
    function send_status_change_email(object $user, string $old_status, string $new_status, string $reason = ''): bool
    {
        $email = \Config\Services::email();

        $email->setFrom('noreply@venntix.com', 'Venntix Admin System');
        $email->setTo($user->email);
        $email->setSubject('Account Status Update - Venntix Admin System');

        $message = view('emails/status_change', [
            'user' => $user,
            'old_status' => $old_status,
            'new_status' => $new_status,
            'reason' => $reason,
            'support_email' => 'support@venntix.com'
        ]);

        $email->setMessage($message);

        if ($email->send()) {
            log_message('info', 'Status change email sent to user: ' . $user->email);
            return true;
        } else {
            log_message('error', 'Failed to send status change email to: ' . $user->email . ' - ' . $email->printDebugger(['headers']));
            return false;
        }
    }
}
if (!function_exists('send_verification_email')) {
    /**
     * Send email verification link
     * 
     * @param object $user User object
     * @param string $token Verification token
     * @return bool
     */
    function send_verification_email(object $user, string $token): bool
    {
        $email = \Config\Services::email();

        $email->setFrom('veentixindo@gmail.com', 'Venntix Admin System');
        $email->setTo($user->email);
        $email->setSubject('Email Verification - Venntix Admin System');

        $message = view('emails/verify_email', [
            'user' => $user,
            'verification_url' => base_url('api/v1/verify-email/' . $token)
        ]);

        $email->setMessage($message);

        if ($email->send()) {
            return true;
        } else {
            echo $email->printDebugger(['headers', 'subject', 'body']);
            die();
            log_message('error', 'Failed to send verification email to: ' . $user->email . ' - ' . $email->printDebugger(['headers']));
            return false;
        }
    }
}
