export const API_URL = import.meta.env.VITE_API_URL || '/api';

export const axiosConfig = {
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
}; 