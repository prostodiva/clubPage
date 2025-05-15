import axios from 'axios';
import { API_URL } from '../config';

// Global axios interceptor for error handling
axios.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error('API Error:', {
            message: error.response?.data?.message || error.message,
            status: error.response?.status,
            data: error.response?.data
        });
        throw error.response?.data || { message: 'An error occurred' };
    }
);

export const authService = {
    register: async (userData) => {
        try {
            const response = await axios.post(`${API_URL}/users/register`, userData, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            return response.data;
        } catch (error) {
            throw {
                message: error.message || 'Registration failed',
                status: error.response?.status || 500
            };
        }
    },

    login: async (credentials) => {
        try {
            console.log('Attempting login with credentials:', { email: credentials.email });
            console.log('API URL:', `${API_URL}/users/login`);
            
            const response = await axios.post(`${API_URL}/users/login`, credentials, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            });

            console.log('Login response:', {
                status: response.status,
                hasToken: !!response.data.token,
                data: response.data
            });

            if (!response.data.token) {
                throw new Error('No token received from server');
            }

            return {
                token: response.data.token,
                // Add any other user data you need
            };
        } catch (error) {
            console.error('Login error details:', {
                status: error.response?.status,
                data: error.response?.data,
                message: error.response?.data?.message || error.message,
                headers: error.response?.headers,
                config: {
                    url: error.config?.url,
                    method: error.config?.method,
                    headers: error.config?.headers
                }
            });

            throw {
                message: error.response?.data?.message || 'Login failed',
                status: error.response?.status || 500,
                details: error.response?.data
            };
        }
    }
};