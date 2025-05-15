export const API_URL = import.meta.env.VITE_API_URL;

export const axiosConfig = {
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
}; 