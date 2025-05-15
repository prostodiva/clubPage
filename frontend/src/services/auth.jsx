import axios from 'axios';
import { API_URL, axiosConfig } from '../config';

// Create axios instance with configuration
const api = axios.create(axiosConfig);

// Add request interceptor for logging
api.interceptors.request.use(request => {
    console.log('Starting Request:', {
        url: request.url,
        method: request.method,
        baseURL: request.baseURL,
        headers: request.headers,
        environment: import.meta.env.DEV ? 'Development' : 'Production'
    });
    return request;
});

// Add response interceptor for error handling
api.interceptors.response.use(
    response => {
        console.log('Response:', {
            status: response.status,
            data: response.data,
            headers: response.headers
        });
        return response;
    },
    error => {
        console.error('API Error:', {
            message: error.message,
            code: error.code,
            url: error.config?.url,
            baseURL: error.config?.baseURL,
            status: error.response?.status,
            data: error.response?.data,
            environment: import.meta.env.DEV ? 'Development' : 'Production'
        });
        return Promise.reject(error);
    }
);

// Health check function
export const checkApiHealth = async () => {
    try {
        console.log('Checking API health...');
        console.log('Environment:', import.meta.env.DEV ? 'Development' : 'Production');
        console.log('API URL:', API_URL);
        
        const response = await api.get('/health');
        console.log('API health check response:', response.data);
        return response.data;
    } catch (error) {
        console.error('API health check failed:', {
            message: error.message,
            code: error.code,
            baseURL: error.config?.baseURL,
            url: error.config?.url,
            environment: import.meta.env.DEV ? 'Development' : 'Production'
        });
        throw error;
    }
};

// Login function
export const login = async (email, password) => {
    try {
        console.log('Attempting login...');
        console.log('Environment:', import.meta.env.DEV ? 'Development' : 'Production');
        console.log('API URL:', API_URL);
        
        const response = await api.post('/auth/login', { email, password });
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
            api.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
        }
        return response.data;
    } catch (error) {
        console.error('Login error:', {
            message: error.message,
            code: error.code,
            status: error.response?.status,
            data: error.response?.data,
            environment: import.meta.env.DEV ? 'Development' : 'Production'
        });
        throw error;
    }
};

// Logout function
export const logout = () => {
    localStorage.removeItem('token');
    delete api.defaults.headers.common['Authorization'];
};

// Get current user function
export const getCurrentUser = async () => {
    try {
        const response = await api.get('/auth/me');
        return response.data;
    } catch (error) {
        console.error('Get current user error:', error);
        throw error;
    }
};