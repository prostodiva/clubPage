import axios from 'axios';
import { API_URL } from '../config';

const userService = {
    getAllUsers: async (token) => {
        try {
            const response = await axios.get(`${API_URL}/users/all`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to fetch users');
        }
    }
};

export default userService; 