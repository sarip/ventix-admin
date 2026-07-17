import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import Swal from 'sweetalert2';

// Export API base URL for image uploads
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';

class APIClient {
    private axiosInstance: AxiosInstance;
    private baseURL: string;

    constructor() {
        this.baseURL = process.env.NEXT_PUBLIC_BASE_URL || "";
        this.axiosInstance = axios.create({
            baseURL: this.baseURL,
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
        });

        // Tambahkan interceptor request
        this.axiosInstance.interceptors.request.use(this.addAuthToken);

        // Tambahkan interceptor response
        this.axiosInstance.interceptors.response.use(
            (response) => response,
            this.handleResponseError
        );
    }

    // Menambahkan token ke setiap request
    private addAuthToken = (config: AxiosRequestConfig): AxiosRequestConfig => {
        if (typeof window !== 'undefined') { // Pastikan hanya di client-side
            const apiKey = localStorage.getItem('key') || '';
            if (!config.headers) {
                config.headers = {};
            }
            if (apiKey) {
                config.headers['key'] = apiKey;
            }
        }
        return config;
    }

    // Menangani error pada response
    private handleResponseError = async (error: AxiosError) => {
        console.error('API error:', error);

        try {
            const audio = new Audio('/assets/audio/danger.mp3');
            await audio.play();
        } catch (audioError) {
            console.error('Audio playback failed:', audioError);
        }

        const status = error.response?.status;
        const message = error.response?.data?.message || 'Something went wrong!';

        if (status && status !== 400) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: message,
            });
        }

        return Promise.reject({ status, message });
    }

    private setRequestQuery(query?: Record<string, any>): AxiosRequestConfig {
        return { params: query };
    }

    // Metode HTTP
    public async get<T>(url: string, query?: Record<string, any>, config?: AxiosRequestConfig): Promise<T> {
        const response: AxiosResponse<T> = await this.axiosInstance.get<T>(url, {
            ...config,
            ...this.setRequestQuery(query),
        });
        return response.data;
    }

    public async post<T>(url: string, data: any, config?: AxiosRequestConfig): Promise<T> {
        const headers = data instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : {};
        const response: AxiosResponse<T> = await this.axiosInstance.post<T>(url, data, { ...config, headers });
        return response.data;
    }

    public async put<T>(url: string, data: any, config?: AxiosRequestConfig): Promise<T> {
        const headers = data instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : {};
        const response: AxiosResponse<T> = await this.axiosInstance.put<T>(url, data, { ...config, headers });
        return response.data;
    }

    public async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
        const response: AxiosResponse<T> = await this.axiosInstance.delete<T>(url, config);
        return response.data;
    }
}

export default new APIClient();
