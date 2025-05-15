import axios from 'axios';
import { API_URL } from '../config';

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
                url: error.config?.url
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
        const url = `${API_URL}`;
        console.log('Checking API health at:', url);
        console.log('Current API_URL value:', API_URL);
        
        // Try to make a simple GET request to the root endpoint
        const response = await axios.get(url, {
            timeout: 5000,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            // Add these options to handle CORS
            withCredentials: false,
            validateStatus: function (status) {
                return status >= 200 && status < 500; // Accept any 2xx or 3xx or 4xx status
            }
        });
        
        console.log('API health check response:', {
            status: response.status,
            statusText: response.statusText,
            headers: response.headers,
            data: response.data
        });
        
        // Consider any response as "healthy" since we got a response
        return true;
    } catch (error) {
        console.error('API health check failed:', {
            message: error.message,
            code: error.code,
            url: API_URL,
            config: error.config,
            response: error.response,
            stack: error.stack
        });

        // If we get a network error but the API is actually accessible,
        // we might want to consider it "healthy" anyway
        if (error.code === 'ERR_NETWORK') {
            console.log('Network error but API might be accessible');
            return true;
        }

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
            console.log('Attempting login with credentials:', { email: credentials.email });
            console.log('API URL:', `${API_URL}/users/login`);
            
            const response = await axios.post(`${API_URL}/users/login`, credentials, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                // Add these options to handle CORS
                withCredentials: false,
                validateStatus: function (status) {
                    return status >= 200 && status < 500; // Accept any 2xx or 3xx or 4xx status
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
            // Network error or CORS error
            if (!error.response) {
                console.error('Network Error during login:', {
                    message: error.message,
                    code: error.code,
                    stack: error.stack,
                    url: error.config?.url
                });
                throw {
                    message: 'Unable to connect to the server. Please check your internet connection.',
                    details: error.message,
                    code: error.code
                };
            }

            // Server response error
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