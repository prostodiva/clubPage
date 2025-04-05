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
            const response = await axios.post(`${API_URL}/users/login`, credentials);

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
                message: error.response?.data?.message || error.message
            });

            throw {
                message: error.response?.data?.message || 'Login failed',
                status: error.response?.status || 500
            };
        }
    }
};