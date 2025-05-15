// API URLs
const PRODUCTION_API_URL = 'https://clubpage-api-env.eba-rstfvjmj.us-west-1.elasticbeanstalk.com';
const DEVELOPMENT_API_URL = '/api';

// Get the API URL based on environment
const getApiUrl = () => {
    // In production, always use the Elastic Beanstalk URL
    if (!import.meta.env.DEV) {
        console.log('Using production API URL:', PRODUCTION_API_URL);
        return PRODUCTION_API_URL;
    }

    // In development, check for environment variable
    const envUrl = import.meta.env.VITE_API_URL;
    if (envUrl) {
        console.log('Using API URL from environment variable:', envUrl);
        return envUrl;
    }

    // Fall back to development URL
    console.log('Using development API URL:', DEVELOPMENT_API_URL);
    return DEVELOPMENT_API_URL;
};

// Export the API URL
export const API_URL = getApiUrl();

// Log the final URL being used
console.log('Final API_URL:', API_URL);

// Export axios configuration
export const axiosConfig = {
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    },
    timeout: 30000, // Increase timeout to 30 seconds
    validateStatus: function (status) {
        return status >= 200 && status < 500; // Accept all responses for better error handling
    }
}; 