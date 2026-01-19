/**
 * UsersRole Model
 */

import APIClient from '../lib/ApiClient';

export interface InUsersRole {
    role_name: string;
    role_slug: string;
    description: string;
    created_at: string;
    updated_at: string;
}

class UsersRole {
    async list(): Promise<{ success: boolean; sys_users_role: InUsersRole[] }> {
        return await APIClient.get('sys_users_role');
    }
}

export { UsersRole };
