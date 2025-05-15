// Get the API URL based on environment
const getApiUrl = () => {
    if (import.meta.env.DEV) {
        return '/api';  // Use the proxy in development
    }
    // Force HTTPS in production
    const apiUrl = import.meta.env.VITE_API_URL || 'https://clubpage-api-env.eba-rstfvjmj.us-west-1.elasticbeanstalk.com';
    return apiUrl.replace('http://', 'https://');
};

export const API_URL = getApiUrl();

export const axiosConfig = {
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
}; 