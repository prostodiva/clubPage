// Force HTTPS URL for production
const PRODUCTION_API_URL = 'https://clubpage.pages.dev/api';

// Get the API URL based on environment
const getApiUrl = () => {
    // Always use the proxy URL in production
    if (!import.meta.env.DEV) {
        console.log('Using production API URL:', PRODUCTION_API_URL);
        return PRODUCTION_API_URL;
    }
    console.log('Using development API URL');
    return '/api';  // Use the proxy in development
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