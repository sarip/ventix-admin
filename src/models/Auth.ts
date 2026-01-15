import Axios from 'axios';
import APIClient from '../lib/ApiClient';
class Auth {
    async login(username:string, password:string) {
        const response = await Axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/login`, {
            username,
            password
        });
        return response.data;
    }

    async  whoami() {
        const response = await APIClient.get('whoami');
        return response;
    }

    async updatePassword(data) {
        const response = await APIClient.put('password', data);
        return response;
    }
}

export default new Auth();
