
import { logout } from '@/store/slices/authSlice';
import axios from 'axios';

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    }
});

export const setupInterceptors = (store) => {
    console.log(store);
    
    // Request interceptor
    apiClient.interceptors.request.use(
        (config) => {
            const token = localStorage.getItem('vibe-token')
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        },
        (error) => {
            return Promise.reject(error);
        }
    );

    // Response interceptor
    apiClient.interceptors.response.use(
        (response) => response,
        (error) => {
            if (error.response?.status === 401) {
                const state = store.getState();
                // state.auth.user = null
                // state.auth.token = null
                // Handle token expiration
                // localStorage.removeItem('vibe-token');
                // window.location.href = '/login';
                store.dispatch(logout())
            }
            console.log(error);
            return Promise.reject(error);

        }
    );
}

export default apiClient;