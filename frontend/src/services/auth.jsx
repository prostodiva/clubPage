import axios from 'axios';
import { API_URL } from '../config';

// Determine if we're in development mode
const isDevelopment = import.meta.env.DEV;

// Get the base URL based on environment
const getBaseUrl = () => {
    if (isDevelopment) {
        return '/api';  // Use the proxy in development
    }
    return API_URL;     // Use the direct URL in production
};

// Create axios instance with default config
const api = axios.create({
    baseURL: getBaseUrl(),
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    },
    timeout: 10000
});

// Global axios interceptor for error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error('API Error:', {
            message: error.message,
            code: error.code,
            url: error.config?.url,
            baseURL: error.config?.baseURL,
            status: error.response?.status,
            data: error.response?.data
        });
        throw error;
    }
);

// Add health check function
export const checkApiHealth = async () => {
    try {
        console.log('Checking API health...');
        console.log('Environment:', isDevelopment ? 'Development' : 'Production');
        console.log('Base URL:', getBaseUrl());
        
        const response = await api.get('/');
        
        console.log('API health check response:', {
            status: response.status,
            statusText: response.statusText,
            data: response.data
        });
        
        return true;
    } catch (error) {
        console.error('API health check failed:', {
            message: error.message,
            code: error.code,
            baseURL: getBaseUrl()
        });
        return false;
    }
};

export const authService = {
    register: async (userData) => {
        try {
            const response = await axios.post(`${API_URL}/users/register`, userData, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            });
            return response.data;
        } catch (error) {
            throw {
                message: error.message || 'Registration failed',
                status: error.response?.status || 500,
                details: error.details
            };
        }
    },

    login: async (credentials) => {
        try {
            console.log('Attempting login...');
            console.log('Environment:', isDevelopment ? 'Development' : 'Production');
            console.log('Base URL:', getBaseUrl());
            
            const response = await api.post('/users/login', credentials);

            console.log('Login response:', {
                status: response.status,
                hasToken: !!response.data.token
            });

            if (!response.data.token) {
                throw new Error('No token received from server');
            }

            return {
                token: response.data.token
            };
        } catch (error) {
            console.error('Login error:', {
                message: error.message,
                code: error.code,
                status: error.response?.status,
                data: error.response?.data
            });

            throw {
                message: error.response?.data?.message || error.message || 'Login failed',
                status: error.response?.status || 500,
                details: error.response?.data
            };
        }
    }
};