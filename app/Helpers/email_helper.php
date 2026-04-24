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

        $email->setFrom('noreply@veentix.com', 'Veentix Admin System');
        $email->setTo($user->email);
        $email->setSubject('Welcome to Veentix Admin System');

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

        $email->setFrom('noreply@veentix.com', 'Veentix Admin System');
        $email->setTo($user->email);
        $email->setSubject('Password Reset - Veentix Admin System');

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

        $email->setFrom('noreply@veentix.com', 'Veentix Admin System');
        $email->setTo($user->email);
        $email->setSubject('Account Status Update - Veentix Admin System');

        $message = view('emails/status_change', [
            'user' => $user,
            'old_status' => $old_status,
            'new_status' => $new_status,
            'reason' => $reason,
            'support_email' => 'veentixindo@gmail.com'
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

        $email->setFrom('veentixindo@gmail.com', 'Veentix Admin System');
        $email->setTo($user->email);
        $email->setSubject('Email Verification - Veentix Admin System');

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

if (!function_exists('send_forgot_password_email')) {
    /**
     * Send forgot password reset link email
     *
     * @param object $user       User object
     * @param string $token      Password reset token
     * @param string $resetUrl   Full URL to the password reset page (frontend)
     * @return bool
     */
    function send_forgot_password_email(object $user, string $token, string $resetUrl): bool
    {
        $email = \Config\Services::email();

        $email->setFrom('veentixindo@gmail.com', 'Veentix Admin System');
        $email->setTo($user->email);
        $email->setSubject('Reset Password – Veentix');

        $message = view('emails/forgot_password', [
            'user' => $user,
            'reset_url' => $resetUrl,
        ]);

        $email->setMessage($message);

        if ($email->send()) {
            log_message('info', 'Password reset email sent to: ' . $user->email);
            return true;
        } else {
            log_message('error', 'Failed to send password reset email to: ' . $user->email . ' – ' . $email->printDebugger(['headers']));
            return false;
        }
    }
}

if (!function_exists('send_new_eo_registration_notification')) {
    /**
     * Send notification to admin/verification team for new EO registration
     * 
     * @param object $eo EO object
     * @param string $adminEmail Admin email address
     * @return bool
     */
    function send_new_eo_registration_notification(object $eo, string $adminEmail): bool
    {
        $email = \Config\Services::email();

        $email->setFrom('veentixindo@gmail.com', 'Veentix Admin System');
        $email->setTo($adminEmail);
        $email->setSubject('New Event Organizer Registration - Need Verification');

        $message = "
            <h3>New Event Organizer Registered</h3>
            <p>A new Event Organizer has registered and needs verification.</p>
            <ul>
                <li><strong>EO Name:</strong> " . ($eo->eo_name ?? '-') . "</li>
                <li><strong>Company Name:</strong> " . ($eo->company_name ?? '-') . "</li>
                <li><strong>Organization Type:</strong> " . ($eo->organization_type ?? '-') . "</li>
                <li><strong>Email:</strong> " . ($eo->email ?? '-') . "</li>
            </ul>
            <p>Please log in to the admin panel to review the legal documents and approve the registration.</p>
        ";

        $email->setMessage($message);

        return $email->send();
    }
}
