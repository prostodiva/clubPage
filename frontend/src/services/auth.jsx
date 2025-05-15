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

// Global axios interceptor for error handling
axios.interceptors.response.use(
    (response) => response,
    (error) => {
        // Network error or CORS error
        if (!error.response) {
            console.error('Network Error:', {
                message: error.message,
                code: error.code,
                stack: error.stack,
                url: error.config?.url,
                baseURL: error.config?.baseURL
            });
            throw {
                message: 'Network error - Unable to reach the server',
                details: error.message,
                code: error.code
            };
        }
        
        // Server response error
        console.error('API Error:', {
            message: error.response?.data?.message || error.message,
            status: error.response?.status,
            data: error.response?.data
        });
        throw error.response?.data || { message: 'An error occurred' };
    }
);

// Add health check function
export const checkApiHealth = async () => {
    try {
        const baseUrl = getBaseUrl();
        const url = `${baseUrl}`;
        console.log('Checking API health at:', url);
        console.log('Environment:', isDevelopment ? 'Development' : 'Production');
        console.log('Base URL:', baseUrl);
        
        const response = await axios.get(url, {
            timeout: 5000,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });
        
        console.log('API health check response:', {
            status: response.status,
            statusText: response.statusText,
            headers: response.headers,
            data: response.data
        });
        
        return true;
    } catch (error) {
        console.error('API health check failed:', {
            name: error.name,
            message: error.message,
            code: error.code,
            url: getBaseUrl(),
            stack: error.stack
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
            const baseUrl = getBaseUrl();
            console.log('Attempting login with credentials:', { email: credentials.email });
            console.log('API URL:', `${baseUrl}/users/login`);
            console.log('Environment:', isDevelopment ? 'Development' : 'Production');
            
            const response = await axios.post(`${baseUrl}/users/login`, credentials, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            });

            console.log('Login response:', {
                status: response.status,
                hasToken: !!response.data.token,
                data: response.data,
                headers: response.headers
            });

            if (!response.data.token) {
                throw new Error('No token received from server');
            }

            return {
                token: response.data.token,
            };
        } catch (error) {
            console.error('Login error details:', {
                name: error.name,
                message: error.message,
                code: error.code,
                stack: error.stack,
                url: getBaseUrl()
            });

            throw {
                message: error.message || 'Login failed',
                status: error.response?.status || 500,
                details: error.response?.data
            };
        }
    }
};