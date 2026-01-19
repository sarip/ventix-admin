/**
 * UsersAppPermissions Model
 */

import APIClient from '../lib/ApiClient';

export interface InUsersAppPermissions {
    perm_name: string;
    slug: string;
    description: string;
}

class UsersAppPermissions {
    async list(): Promise<{ sys_users_apppermissions: InUsersAppPermissions[] }> {
        return await APIClient.get('sys_users_apppermissions');
    }
}

export { UsersAppPermissions };
