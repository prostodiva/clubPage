import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5173';

export const authService = {
    login: async (credentials) => {
        try {
            const response = await axios.post(`${API_URL}/api/auth/login`, credentials);
            if (response.data.token) {
                localStorage.setItem('user', JSON.stringify(response.data));
            }
            return response.data;
        } catch (error) {
            console.error('Login error:', error);
            throw error.response?.data || { message: 'Login failed' };
        }
    },

    register: async (userData) => {
        try {
            console.log('Registering user:', userData);
            const response = await axios.post(`${API_URL}/api/users`, userData);
            console.log('Registration response:', response.data);
            return response.data;
        } catch (error) {
            console.error('Registration error:', error);
            if (error.response?.data) {
                throw error.response.data;
            }
            throw { message: 'Registration failed. Please try again.' };
        }
    }
};