import axios from 'axios';
import { API_URL } from '../config';

export const meetingService = {
    getAllMeetings: async () => {
        try {
            const response = await axios.get(`${API_URL}/meetings`);
            return response.data;
        } catch (error) {
            console.error('API Error:', {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status
            });
            throw {
                message: error.response?.data?.message || 'Failed to fetch meetings',
                status: error.response?.status || 500
            };
        }
    },

    getClubMeetings: async (clubId, token) => {
        try {
            const response = await axios.get(`${API_URL}/meetings/clubs/${clubId}/meetings`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            throw {
                message: error.response?.data?.message || 'Failed to fetch club meetings',
                status: error.response?.status || 500
            };
        }
    },

    createMeeting: async (clubId, meetingData, token) => {
        try {
            const response = await axios.post(
                `${API_URL}/meetings/clubs/${clubId}/meetings`,
                meetingData,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            return response.data;
        } catch (error) {
            throw {
                message: error.response?.data?.message || 'Failed to create meeting',
                status: error.response?.status || 500
            };
        }
    },

    updateMeeting: async (clubId, meetingId, meetingData, token) => {
        try {
            const response = await axios.put(
                `${API_URL}/meetings/clubs/${clubId}/meetings/${meetingId}`,
                meetingData,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            return response.data;
        } catch (error) {
            throw {
                message: error.response?.data?.message || 'Failed to update meeting',
                status: error.response?.status || 500
            };
        }
    },

    deleteMeeting: async (clubId, meetingId, token) => {
        try {
            await axios.delete(
                `${API_URL}/meetings/clubs/${clubId}/meetings/${meetingId}`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
        } catch (error) {
            throw {
                message: error.response?.data?.message || 'Failed to delete meeting',
                status: error.response?.status || 500
            };
        }
    }
}; 