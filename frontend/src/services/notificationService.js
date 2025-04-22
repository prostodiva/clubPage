import axios from 'axios';
import { API_URL } from '../config';

const notificationService = {
    createNotification: async (notificationData, token) => {
        try {
            const response = await axios.post(
                `${API_URL}/notify`,
                {
                    recipient: notificationData.recipient,
                    sender: notificationData.sender,
                    message: notificationData.message,
                    entityType: notificationData.entityType
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
            return response.data;
        } catch(error) {
            console.error('Create notification', {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status
            });
            throw new Error(error.response?.data?.message || 'Failed to create notification');
        }
    },

    getNotifications: async (token) => {
        try {
            const response = await axios.get(
                `${API_URL}/notify`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
            return response.data;
        } catch(error) {
            console.error('Get notifications', {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status
            });
            throw new Error(error.response?.data?.message || 'Failed to fetch notifications');
        }
    }
};

export default notificationService;