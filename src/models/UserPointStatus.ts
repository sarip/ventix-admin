/**
 * UserPointStatus Model - API Client
 * @author Sarip Hidayat <hidayatsarip2210@gmail.com>
 * @date 2026-01-19
 */

import APIClient from '../lib/ApiClient';

export interface InUserPointStatus {
    name: string;
    description: string;
}

class UserPointStatus {
    async list(): Promise<{ userpoint_status: InUserPointStatus[] }> {
        return await APIClient.get('userpoint_status');
    }
}

export { UserPointStatus };
