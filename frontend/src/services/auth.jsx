import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

axios.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error('API Error:', error.response?.data || error.message);
        throw error.response?.data || { message: 'An error occurred' };
    }
);

export const authService = {
        register: async (userData) => {
            try {
                const response = await axios.post('http://localhost:8080/users/register', userData);
                return response.data;
            } catch (error) {
                // Throw the exact error message from the backend
                throw {
                    message: error.response?.data?.message || 'Registration failed',
                    status: error.response?.status
                };
            }
        },

        login: async (credentials) => {
            try {
                const response = await axios.post('http://localhost:8080/users/login', credentials);
                return response.data;
            } catch (error) {
                // Throw the exact error message from the backend
                throw {
                    message: error.response?.data?.message || 'Login failed',
                    status: error.response?.status
                };
            }
        }
};