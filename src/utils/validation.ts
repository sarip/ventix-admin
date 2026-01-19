/**
 * Form Validation Utilities
 * @author Sarip Hidayat <hidayatsarip2210@gmail.com>
 * @date 2026-01-17
 */

import { PasswordStrength } from '@/types/user';

/**
 * Validate username format
 */
export function validateUsername(username: string): { valid: boolean; error: string } {
    if (!username || username.length < 4) {
        return { valid: false, error: 'Username must be at least 4 characters' };
    }

    if (username.length > 50) {
        return { valid: false, error: 'Username must not exceed 50 characters' };
    }

    const usernameRegex = /^[a-zA-Z0-9_]+$/;
    if (!usernameRegex.test(username)) {
        return { valid: false, error: 'Username can only contain letters, numbers, and underscores' };
    }

    return { valid: true, error: '' };
}

/**
 * Validate email format
 */
export function validateEmail(email: string): { valid: boolean; error: string } {
    if (!email) {
        return { valid: false, error: 'Email is required' };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return { valid: false, error: 'Invalid email format' };
    }

    return { valid: true, error: '' };
}

/**
 * Validate password strength
 */
export function validatePassword(password: string): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!password || password.length < 8) {
        errors.push('Password must be at least 8 characters long');
    }

    if (!/[A-Z]/.test(password)) {
        errors.push('Password must contain at least one uppercase letter');
    }

    if (!/[a-z]/.test(password)) {
        errors.push('Password must contain at least one lowercase letter');
    }

    if (!/[0-9]/.test(password)) {
        errors.push('Password must contain at least one number');
    }

    return {
        valid: errors.length === 0,
        errors
    };
}

/**
 * Get password strength indicator
 */
export function getPasswordStrength(password: string): PasswordStrength {
    if (!password) return 'Weak';

    let score = 0;

    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (score <= 2) return 'Weak';
    if (score <= 4) return 'Medium';
    return 'Strong';
}

/**
 * Validate phone number format
 */
export function validatePhone(phone: string): { valid: boolean; error: string } {
    if (!phone) {
        return { valid: true, error: '' }; // Phone is optional
    }

    if (phone.length < 8) {
        return { valid: false, error: 'Phone number must be at least 8 digits' };
    }

    if (phone.length > 20) {
        return { valid: false, error: 'Phone number must not exceed 20 characters' };
    }

    const phoneRegex = /^[0-9+\-\s()]+$/;
    if (!phoneRegex.test(phone)) {
        return { valid: false, error: 'Phone number contains invalid characters' };
    }

    return { valid: true, error: '' };
}

/**
 * Validate passwords match
 */
export function validatePasswordsMatch(password: string, confirmPassword: string): { valid: boolean; error: string } {
    if (password !== confirmPassword) {
        return { valid: false, error: 'Passwords do not match' };
    }

    return { valid: true, error: '' };
}

/**
 * Get password strength color for UI
 */
export function getPasswordStrengthColor(strength: PasswordStrength): string {
    switch (strength) {
        case 'Weak':
            return 'danger';
        case 'Medium':
            return 'warning';
        case 'Strong':
            return 'success';
        default:
            return 'secondary';
    }
}
