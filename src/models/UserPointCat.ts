/**
 * UserPointCat Model
 */

import APIClient from '../lib/ApiClient';

export interface InUserPointCat {
    name: string;
    description: string;
}

class UserPointCat {
    async list(): Promise<{ sys_userpoint_cat: InUserPointCat[] }> {
        return await APIClient.get('sys_userpoint_cat');
    }
}

export { UserPointCat };
