// Force HTTPS URL for production
const PRODUCTION_API_URL = 'https://clubpage.pages.dev/api';

// Get the API URL based on environment
const getApiUrl = () => {
    if (import.meta.env.DEV) {
        console.log('Using development API URL');
        return '/api';  // Use the proxy in development
    }
    console.log('Using production API URL:', PRODUCTION_API_URL);
    return PRODUCTION_API_URL;
};

export const API_URL = getApiUrl();

console.log('Final API_URL:', API_URL);

export const axiosConfig = {
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    },
    timeout: 30000 // Increase timeout to 30 seconds
}; 