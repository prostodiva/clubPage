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
            throw new Error(error.response?.data?.message || 'Failed to fetch meetings');
        }
    },

    getClubMeetings: async (clubId, token) => {
        try {
            const response = await axios.get(`${API_URL}/clubs/${clubId}/meetings`, {
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

    createMeeting: async (meetingData, token, clubId) => {
        try {
            if (!clubId) {
                // First try to get the club ID from the user's first club
                const response = await axios.get(`${API_URL}/clubs`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                const clubs = response.data;
                if (!clubs || clubs.length === 0) {
                    throw new Error('No clubs found. Please create a club first.');
                }
                clubId = clubs[0]._id;
            }

            const response = await axios.post(
                `${API_URL}/clubs/${clubId}/meetings`,
                meetingData,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
            return response.data;
        } catch (error) {
            console.error('Create meeting error:', {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status
            });
            throw new Error(error.response?.data?.message || 'Failed to create meeting');
        }
    },

    updateMeeting: async (meetingId, clubId, meetingData, token) => {
        try {
            const response = await axios.put(
                `${API_URL}/clubs/${clubId}/meetings/${meetingId}`,
                meetingData,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
            return response.data;
        } catch (error) {
            console.error('Update meeting error:', {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status
            });
            throw new Error(error.response?.data?.message || 'Failed to update meeting');
        }
    },

    deleteMeeting: async (meetingId, clubId, token) => {
        try {
            await axios.delete(
                `${API_URL}/clubs/${clubId}/meetings/${meetingId}`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            return true;
        } catch (error) {
            console.error('Delete meeting error:', {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status
            });
            throw new Error(error.response?.data?.message || 'Failed to delete meeting');
        }
    },

    getMeetingById: async (meetingId, token) => {
        try {
            const response = await axios.get(
                `${API_URL}/meetings/${meetingId}`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            return response.data;
        } catch (error) {
            console.error('Get meeting error:', {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status
            });
            throw new Error(error.response?.data?.message || 'Failed to get meeting');
        }
    }
}; 