import axios from 'axios';
import { API_URL } from '../config';

const messageService = {
    sendMessage: async (chatId, content, token) => {
        try {
            const response = await axios.post(
                `${API_URL}/chats/${chatId}/messages`,
                { content },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json' }
                }
            );
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to send message');
        }
    },

    getMessages: async (chatId, token, page = 1, limit = 20) => {
        try {
            const response = await axios.get(
                `${API_URL}/chats/${chatId}/messages`,
                {
                    params: { page, limit },
                    headers: {
                         Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json' }
                }
            );
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to fetch messages');
        }
    },

    updateMessage: async (chatId, messageId, content, token) => {
        try {
            const response = await axios.put(
                `${API_URL}/chats/${chatId}/messages/${messageId}`,
                { content },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json' }
                }
            );
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to update message');
        }
    },

    deleteMessage: async (chatId, messageId, token) => {
        try {
            const response = await axios.delete(
                `${API_URL}/chats/${chatId}/messages/${messageId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json' }
                }
            );
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to delete message');
        }
    },

    markAsRead: async (chatId, messageIds, token) => {
        try {
            const response = await axios.post(
                `${API_URL}/chats/${chatId}/messages/mark-read`,
                { messageIds },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json' }
                }
            );
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to mark messages as read');
        }
    },

    getUnreadCount: async (token) => {
        try {
            const response = await axios.get(
                `${API_URL}/chats/unread-count`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json' }
                }
            );
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to get unread count');
        }
    }
};

export default messageService; 