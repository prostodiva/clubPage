export const API_URL = import.meta.env.VITE_API_URL || 'http://clubpage-api-env.eba-rstfvjmj.us-west-1.elasticbeanstalk.com';

export const axiosConfig = {
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
}; 