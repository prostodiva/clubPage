import axios from 'axios';
import { API_URL } from '../config';

export const memberService = {
    deleteMember: async (memberId, token) => {
        if (!memberId) {
            throw new Error('Member ID is required');
        }

        if (!token) {
            throw new Error('Authentication token is required');
        }

        try {
            const response = await axios.delete(`${API_URL}/users/${memberId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            return true;
        } catch (error) {
            console.error('Error deleting user', {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status
            });
            throw new Error(error.response?.data?.message || 'Failed to delete user');
        }
    }
};