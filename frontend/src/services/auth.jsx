import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

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
            // Use API_URL constant instead of hardcoded URL
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
            // Use API_URL constant instead of hardcoded URL
            const response = await axios.post(`${API_URL}/users/login`, credentials, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            return response.data;
        } catch (error) {
            throw {
                message: error.message || 'Login failed',
                status: error.response?.status || 500
            };
        }
    }
};