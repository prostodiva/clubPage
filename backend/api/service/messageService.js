const Message = require('../../database/model/messageModel');
const Chat = require('../../database/model/chatModel');
const User = require('../../database/model/userModel');

class MessageService {
    async sendMessage(chatId, userId, content) {
        try {
            // Verify chat exists and user is a participant
            const chat = await Chat.findOne({
                _id: chatId,
                participants: userId
            });

            if (!chat) {
                throw new Error('Chat not found or user not authorized');
            }

            // Create new message
            const message = new Message({
                chat: chatId,
                sender: userId,
                content,
                readBy: [userId]
            });

            await message.save();

            // Update chat's last message
            chat.lastMessage = message._id;
            chat.lastMessageAt = new Date();
            await chat.save();

            // Populate sender details
            await message.populate('sender', 'username email');

            return message;
        } catch (error) {
            throw new Error(error.message || 'Failed to send message');
        }
    }

    async getMessages(chatId, userId, page = 1, limit = 20) {
        try {
            // Verify chat exists and user is a participant
            const chat = await Chat.findOne({
                _id: chatId,
                participants: userId
            });

            if (!chat) {
                throw new Error('Chat not found or user not authorized');
            }

            // Get messages with pagination
            const messages = await Message.find({ chat: chatId })
                .sort({ createdAt: -1 })
                .skip((page - 1) * limit)
                .limit(limit)
                .populate('sender', 'username email');

            return messages;
        } catch (error) {
            throw new Error(error.message || 'Failed to fetch messages');
        }
    }

    async updateMessage(chatId, messageId, userId, content) {
        try {
            // Verify message exists and user is the sender
            const message = await Message.findOne({
                _id: messageId,
                chat: chatId,
                sender: userId
            });

            if (!message) {
                throw new Error('Message not found or user not authorized');
            }

            // Update message content
            message.content = content;
            message.edited = true;
            await message.save();

            return message;
        } catch (error) {
            throw new Error(error.message || 'Failed to update message');
        }
    }

    async deleteMessage(chatId, messageId, userId) {
        try {
            // Verify message exists and user is the sender
            const message = await Message.findOne({
                _id: messageId,
                chat: chatId,
                sender: userId
            });

            if (!message) {
                throw new Error('Message not found or user not authorized');
            }

            // Soft delete the message
            message.deleted = true;
            await message.save();

            return message;
        } catch (error) {
            throw new Error(error.message || 'Failed to delete message');
        }
    }

    async markAsRead(chatId, messageIds, userId) {
        try {
            // Verify chat exists and user is a participant
            const chat = await Chat.findOne({
                _id: chatId,
                participants: userId
            });

            if (!chat) {
                throw new Error('Chat not found or user not authorized');
            }

            // Update messages to mark as read
            const result = await Message.updateMany(
                {
                    _id: { $in: messageIds },
                    chat: chatId,
                    readBy: { $ne: userId }
                },
                { $push: { readBy: userId } }
            );

            return result;
        } catch (error) {
            throw new Error(error.message || 'Failed to mark messages as read');
        }
    }

    async getUnreadCount(userId) {
        try {
            // Get all chats where user is a participant
            const chats = await Chat.find({ participants: userId });

            // Get unread message count for each chat
            const unreadCounts = await Promise.all(
                chats.map(async (chat) => {
                    const count = await Message.countDocuments({
                        chat: chat._id,
                        sender: { $ne: userId },
                        readBy: { $ne: userId }
                    });
                    return {
                        chatId: chat._id,
                        count
                    };
                })
            );

            return unreadCounts;
        } catch (error) {
            throw new Error(error.message || 'Failed to get unread count');
        }
    }
}

module.exports = new MessageService();
