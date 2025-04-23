const Chat = require('../../database/model/chatModel');
const User = require('../../database/model/userModel');
const mongoose = require('mongoose');
const { ensureOwnership } = require('../../api/service/authService');
const { UnauthorizedError, BadRequestError, NotFoundError } = require('../../api/errors/errors');

class ChatService {
    async getAllChats(userId) {
        try {
            const chats = await Chat.find({ participants: userId })
                .populate('participants', 'username email')
                .populate('messages.sender', 'username')
                .sort({ lastMessage: -1 });
            return chats;
        } catch (error) {
            throw new Error('Error fetching chats: ' + error.message);
        }
    }

    async getChatById(chatId, userId) {
        try {
            const chat = await Chat.findOne({
                _id: chatId,
                participants: userId
            })
            .populate('participants', 'username email')
            .populate('messages.sender', 'username');

            if (!chat) {
                throw new Error('Chat not found or access denied');
            }

            return chat;
        } catch (error) {
            throw new Error('Error fetching chat: ' + error.message);
        }
    }

    async createChat(title, creatorId, participantIds) {
        try {
            // Ensure creator is included in participants
            if (!participantIds.includes(creatorId)) {
                participantIds.push(creatorId);
            }

            // Verify all participants exist
            const participants = await User.find({
                _id: { $in: participantIds }
            });

            if (participants.length !== participantIds.length) {
                throw new Error('One or more participants not found');
            }

            const chat = new Chat({
                title,
                creator: creatorId,
                participants: participantIds
            });

            await chat.save();
            
            // Populate participant details before returning
            return await chat.populate('participants', 'username email');
        } catch (error) {
            throw new Error('Error creating chat: ' + error.message);
        }
    }

    async sendMessage(chatId, userId, content) {
        try {
            const chat = await Chat.findOne({
                _id: chatId,
                participants: userId
            });

            if (!chat) {
                throw new Error('Chat not found or access denied');
            }

            chat.messages.push({
                sender: userId,
                content,
                readBy: [userId]
            });

            chat.lastMessage = new Date();
            await chat.save();

            // Populate sender details for the new message
            await chat.populate('messages.sender', 'username');
            
            return chat.messages[chat.messages.length - 1];
        } catch (error) {
            throw new Error('Error sending message: ' + error.message);
        }
    }

    async updateChatTitle(chatId, userId, newTitle) {
        try {
            const chat = await Chat.findOne({
                _id: chatId,
                creator: userId // Only creator can update title
            });

            if (!chat) {
                throw new Error('Chat not found or not authorized to update');
            }

            chat.title = newTitle;
            await chat.save();

            return chat;
        } catch (error) {
            throw new Error('Error updating chat title: ' + error.message);
        }
    }

    async deleteChat(chatId, userId) {
        try {
            const chat = await Chat.findOne({
                _id: chatId,
                creator: userId // Only creator can delete chat
            });

            if (!chat) {
                throw new Error('Chat not found or not authorized to delete');
            }

            await chat.remove();
            return { message: 'Chat deleted successfully' };
        } catch (error) {
            throw new Error('Error deleting chat: ' + error.message);
        }
    }
}

module.exports = new ChatService();