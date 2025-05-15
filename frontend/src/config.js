// Get the API URL based on environment
const getApiUrl = () => {
    if (import.meta.env.DEV) {
        return '/api';  // Use the proxy in development
    }
    return import.meta.env.VITE_API_URL || 'http://clubpage-api-env.eba-rstfvjmj.us-west-1.elasticbeanstalk.com';
};

export const API_URL = getApiUrl();

export const axiosConfig = {
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
}; 