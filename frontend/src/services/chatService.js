import axios from 'axios';
import { API_URL } from '../config';

const chatService = {
    getAllChats: async (token) => {
        try {
            const response = await axios.get(`${API_URL}/chats`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to fetch chats');
        }
    },

    getChatById: async (chatId, token) => {
        try {
            const response = await axios.get(`${API_URL}/chats/${chatId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to fetch chat');
        }
    },

    createChat: async (chatData, token) => {
        try {
            const response = await axios.post(`${API_URL}/chats`, chatData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to create chat');
        }
    },

    sendMessage: async (chatId, messageData, token) => {
        try {
            const response = await axios.post(
                `${API_URL}/chats/${chatId}/messages`,
                messageData,
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to send message');
        }
    },

    getMessages: async (chatId, token) => {
        try {
            const response = await axios.get(`${API_URL}/chats/${chatId}/messages`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to fetch messages');
        }
    },

    updateChat: async (chatId, updateData, token) => {
        try {
            const response = await axios.put(
                `${API_URL}/chats/${chatId}`,
                updateData,
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to update chat');
        }
    },

    deleteChat: async (chatId, token) => {
        try {
            const response = await axios.delete(`${API_URL}/chats/${chatId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to delete chat');
        }
    },

    // Add participants to a chat
    addParticipants: async (chatId, participantIds, token) => {
        try {
            const response = await axios.post(
                `${API_URL}/chats/${chatId}/participants`,
                { participantIds },
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to add participants');
        }
    },

    // Remove a participant from a chat
    removeParticipant: async (chatId, participantId, token) => {
        try {
            const response = await axios.delete(
                `${API_URL}/chats/${chatId}/participants/${participantId}`,
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to remove participant');
        }
    }
};

export default chatService; 