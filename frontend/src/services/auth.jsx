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
        
        // First try a simple fetch request
        const fetchResponse = await fetch(url, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            mode: 'cors'
        });
        
        console.log('Fetch response:', {
            status: fetchResponse.status,
            statusText: fetchResponse.statusText,
            ok: fetchResponse.ok,
            headers: Object.fromEntries(fetchResponse.headers.entries())
        });

        // If fetch works, try axios as well
        const axiosResponse = await axios.get(url, {
            timeout: 5000,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            withCredentials: false
        });
        
        console.log('Axios response:', {
            status: axiosResponse.status,
            statusText: axiosResponse.statusText,
            headers: axiosResponse.headers,
            data: axiosResponse.data
        });
        
        return true;
    } catch (error) {
        console.error('API health check failed:', {
            name: error.name,
            message: error.message,
            code: error.code,
            url: API_URL,
            stack: error.stack
        });

        // Try one more time with a different approach
        try {
            const response = await fetch(url, {
                method: 'GET',
                mode: 'no-cors'  // This will make the request without CORS
            });
            console.log('No-CORS fetch response:', {
                type: response.type,
                status: response.status,
                ok: response.ok
            });
            return true;  // If we get here, the API is probably accessible
        } catch (fetchError) {
            console.error('No-CORS fetch also failed:', fetchError);
            return false;
        }
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
            
            // Try axios first
            try {
                const response = await axios.post(`${API_URL}/users/login`, credentials, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    withCredentials: false
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
            } catch (axiosError) {
                console.log('Axios login failed, trying fetch:', axiosError);
                
                // If axios fails, try fetch
                const fetchResponse = await fetch(`${API_URL}/users/login`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify(credentials),
                    mode: 'cors'
                });

                const data = await fetchResponse.json();
                console.log('Fetch login response:', {
                    status: fetchResponse.status,
                    ok: fetchResponse.ok,
                    data
                });

                if (!data.token) {
                    throw new Error('No token received from server');
                }

                return {
                    token: data.token
                };
            }
        } catch (error) {
            console.error('Login error details:', {
                name: error.name,
                message: error.message,
                code: error.code,
                stack: error.stack
            });

            throw {
                message: error.message || 'Login failed',
                status: error.response?.status || 500,
                details: error.response?.data
            };
        }
    }
};