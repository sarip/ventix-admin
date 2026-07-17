/**
 * @author Sarip Hidayat <hidayatsarip2210@gmail.com>
 * @copyright Sarip Hidayat 2026
 * @date 2026-01-17
 */

import APIClient from '../lib/ApiClient';
import { ListResponse, PostResponse, PutResponse, DeleteResponse } from '@/types/apiTypes';
import { UserRole, UserStatus } from '@/types/user';

// Role Detail Interface
export interface RoleDetail {
    role_name: string;
    role_slug: string;
    description: string | null;
}

// Events Organizer Detail Interface
export interface EODetail {
    id: number;
    eo_name: string;
    company_name: string;
}

// User Interface (from API response)
export interface InUser {
    id: number;
    eo_id: number | null;
    username: string;
    name: string;
    email: string;
    phone: string;
    role: UserRole;
    profile_picture: string | null;
    cover_photo: string | null;
    bio: string | null;
    show_ratings: boolean | number;
    refferalcode: string;
    status: UserStatus;
    last_login: string | null;
    created_at: string;
    updated_at?: string;

    // Joined data from backend
    role_name?: string;
    role_slug?: string;
    role_description?: string;
    role_detail?: RoleDetail;

    eo_name?: string;
    company_name?: string;
    eo_detail?: EODetail | null;

    // Profile data
    followers_count?: number;
    following_count?: number;
    experiences?: any[];
    ratings?: any[];
}

// User Form Interface (for create/edit)
export interface InUserForm {
    id?: number;
    eo_id: number | null | string;
    username: string;
    name: string;
    email: string;
    phone: string;
    role: UserRole | string;
    status: UserStatus;
    password?: string;
    confirm_password?: string;
    profile_picture?: string;
}

// Empty user form template
export const userForm: InUserForm = {
    eo_id: null,
    username: '',
    name: '',
    email: '',
    phone: '',
    role: '',
    status: 'Active',
    password: '',
    confirm_password: '',
    profile_picture: ''
};

// User List Query Parameters
export interface UserListQuery {
    search?: string;
    role?: UserRole | string;
    status?: UserStatus | string;
    eo_id?: number | string;
    sort_by?: string;
    sort_order?: 'asc' | 'desc';
    per_page?: number;
    page?: number;
}

// Change Status Request
export interface ChangeStatusRequest {
    status: UserStatus;
    reason?: string;
}

// Reset Password Request
export interface ResetPasswordRequest {
    new_password: string;  // Admin provides new password
    send_email?: boolean;  // Optional: send password via email
}

class User {
    /**
     * Get list of users with filters and pagination
     */
    async list(query: UserListQuery = {}): Promise<ListResponse<InUser[]>> {
        return await APIClient.get('users', query);
    }

    async lists(query: UserListQuery = {}): Promise<ListResponse<InUser[]>> {
        return await APIClient.get('users-lists', query);
    }

    async member(query: UserListQuery = {}): Promise<ListResponse<InUser[]>> {
        return await APIClient.get('users-member', query);
    }

    /**
     * Get single user detail
     */
    async show(id: number): Promise<{ user: InUser }> {
        return await APIClient.get(`user/${id}`);
    }

    /**
     * Create new user
     */
    async create(user: InUserForm): Promise<PostResponse> {
        // Remove confirm_password before sending
        const { confirm_password, ...userData } = user;
        return await APIClient.post('/user', userData);
    }

    /**
     * Update existing user
     */
    async update(id: number, user: Partial<InUserForm>): Promise<PutResponse<InUser>> {
        // Remove fields that shouldn't be updated
        const { confirm_password, username, email, ...userData } = user as any;
        return await APIClient.put(`/user/${id}`, userData);
    }

    /**
     * Change user status
     */
    async changeStatus(id: number, request: ChangeStatusRequest): Promise<any> {
        return await APIClient.post(`/user/${id}/status`, request);
    }

    /**
     * Reset user password
     */
    async resetPassword(id: number, request: ResetPasswordRequest = {}): Promise<any> {
        return await APIClient.post(`/user/${id}/reset-password`, request);
    }

    /**
     * Delete user (soft delete - sets status to Inactive)
     * @deprecated Use changeStatus instead
     */
    async delete(id: number): Promise<DeleteResponse> {
        return await APIClient.delete(`/user/${id}`);
    }

    /**
     * Get public profile by username
     */
    async getProfile(username: string): Promise<{ profile: any }> {
        return await APIClient.get(`profile/${username}`);
    }

    /**
     * Update own profile
     */
    async updateProfile(data: any): Promise<any> {
        return await APIClient.post('profile/update', data);
    }

    /**
     * Follow/Unfollow
     */
    async toggleFollow(data: { following_id: number, following_type: 'EO' | 'FACILITY' | 'MEMBER' }): Promise<any> {
        return await APIClient.post('profile/follow', data);
    }

    /**
     * Get following list
     */
    async getFollowing(): Promise<{ following: any[] }> {
        return await APIClient.get('profile/following');
    }

    /**
     * Manage experience
     */
    async manageExperience(data: any): Promise<any> {
        return await APIClient.post('profile/experience', data);
    }

    /**
     * Manage rating
     */
    async manageRating(data: any): Promise<any> {
        return await APIClient.post('profile/rating', data);
    }
}

export type { InUserForm, InUser };
export { User };