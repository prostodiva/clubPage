const Chat = require('../../database/model/chatModel');
const User = require('../../database/model/userModel');
const mongoose = require('mongoose');
const { ensureOwnership } = require('../../api/service/authService');
const { UnauthorizedError, BadRequestError, NotFoundError } = require('../../api/errors/errors');
const Meeting = require("../../database/model/meetingModel");

class ChatService {
    async getAllChats(userId) {
        try {
            const chats = await Chat.find({ participants: userId })
                .populate('participants', 'name email')
                .populate('messages.sender', 'name')
                .sort({ lastMessageAt: -1 });
            
            // Format the chats for frontend
            return chats.map(chat => {
                const lastMessage = chat.messages.length > 0 ? chat.messages[chat.messages.length - 1] : null;
                
                return {
                    _id: chat._id,
                    title: chat.title,
                    participants: chat.participants.map(p => ({
                        _id: p._id,
                        name: p.name,
                        email: p.email
                    })),
                    lastMessage: lastMessage ? {
                        content: lastMessage.content,
                        sender: lastMessage.sender,
                        createdAt: lastMessage.timestamp
                    } : null,
                    createdAt: chat.createdAt
                };
            });
        } catch (error) {
            console.error('Error fetching chats:', error);
            throw new Error('Failed to fetch chats');
        }
    }

    async getChatById(chatId, userId) {
        try {
            const chat = await Chat.findOne({
                _id: chatId,
                participants: userId
            })
            .populate('participants', 'name email')
            .populate('messages.sender', 'name');

            if (!chat) {
                throw new Error('Chat not found or access denied');
            }

            return {
                _id: chat._id,
                title: chat.title,
                participants: chat.participants.map(p => ({
                    _id: p._id,
                    name: p.name,
                    email: p.email
                })),
                messages: chat.messages.map(msg => ({
                    _id: msg._id,
                    content: msg.content,
                    senderId: msg.sender._id,
                    senderName: msg.sender.name,
                    createdAt: msg.timestamp
                }))
            };
        } catch (error) {
            console.error('Error fetching chat:', error);
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
            const chat = await Chat.findById(chatId);
            if (!chat) {
                throw new Error('Chat not found');
            }

            if (!chat.participants.includes(userId)) {
                throw new Error('User is not a participant in this chat');
            }

            // Get the sender's information
            const sender = await User.findById(userId).select('name');
            if (!sender) {
                throw new Error('Sender not found');
            }

            const message = {
                sender: userId,
                content,
                timestamp: new Date()
            };

            // Add the message to the chat
            chat.messages.push(message);
            
            // Update the lastMessageAt timestamp
            chat.lastMessageAt = new Date();
            
            // Remove lastMessage field if it exists (we're not using it)
            chat.lastMessage = undefined;
            
            await chat.save();

            // Return formatted message for frontend
            const newMessage = chat.messages[chat.messages.length - 1];
            return {
                _id: newMessage._id,
                content: newMessage.content,
                senderId: userId,
                senderName: sender.name,
                createdAt: newMessage.timestamp
            };
        } catch (error) {
            console.error('Error sending message:', error);
            throw new Error('Failed to send message');
        }
    }

    async getMessages(chatId, userId) {
        try {
            const chat = await Chat.findOne({
                _id: chatId,
                participants: userId
            }).populate({
                path: 'messages.sender',
                select: 'name'
            });

            if (!chat) {
                throw new Error('Chat not found or access denied');
            }

            // Format messages for frontend
            const formattedMessages = chat.messages.map(msg => {
                if (!msg.sender) {
                    console.error('Message sender not populated:', msg);
                    return null;
                }
                return {
                    _id: msg._id,
                    content: msg.content,
                    senderId: msg.sender._id,
                    senderName: msg.sender.name,
                    createdAt: msg.timestamp
                };
            }).filter(Boolean); // Remove any null messages

            return formattedMessages;
        } catch (error) {
            console.error('Error fetching messages:', error);
            throw new Error('Failed to fetch messages');
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
        // First check if the user is an admin
        const user = await User.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }

        // Find the chat and check if user is either creator or admin
        const chat = await Chat.findOne({
            _id: chatId,
            $or: [
                { creator: userId },
                { participants: userId }
            ]
        });

        if (!chat) {
            throw new Error('Chat not found or not authorized to delete');
        }

        // Only allow deletion if user is creator or admin
        if (chat.creator.toString() !== userId.toString() && user.role !== 'Admin') {
            throw new Error('Not authorized to delete this chat');
        }

        // Actually delete the chat instead of just marking it as inactive
        const deletedChat = await Chat.findByIdAndDelete(chatId);
        
        if (!deletedChat) {
            throw new Error('Failed to delete chat');
        }

        return { message: 'Chat deleted successfully' };
    }

    async leaveChat(chatId, userId) {
        const chat = await Chat.findOne({
            _id: chatId,
            participants: userId
        });

        if (!chat) {
            throw new Error('Chat not found or user is not a participant');
        }

        // Remove user from participants array
        chat.participants = chat.participants.filter(id => id.toString() !== userId.toString());
        
        // If no participants left, delete the chat
        if (chat.participants.length === 0) {
            await Chat.findByIdAndDelete(chatId);
            return { message: 'Chat deleted as no participants remain' };
        }

        // If the user was the creator, assign a new creator
        if (chat.creator.toString() === userId.toString()) {
            chat.creator = chat.participants[0];
        }

        await chat.save();
        return { message: 'Successfully left the chat' };
    }
}

module.exports = new ChatService();