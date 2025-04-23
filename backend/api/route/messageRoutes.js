const express = require('express');
const router = express.Router();
const messageService = require('../service/messageService');
const { authenticate } = require('../../api/middleware/securityMiddleware');

// Send a new message
router.post('/chats/:chatId/messages', authenticate, async (req, res) => {
    try {
        const { content } = req.body;
        const message = await messageService.sendMessage(
            req.params.chatId,
            req.user._id,
            content
        );
        res.status(201).json(message);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Get messages from a chat
router.get('/chats/:chatId/messages', authenticate, async (req, res) => {
    try {
        const { page = 1, limit = 20 } = req.query;
        const messages = await messageService.getMessages(
            req.params.chatId,
            req.user._id,
            parseInt(page),
            parseInt(limit)
        );
        res.json(messages);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Update a message
router.put('/chats/:chatId/messages/:messageId', authenticate, async (req, res) => {
    try {
        const { content } = req.body;
        const message = await messageService.updateMessage(
            req.params.chatId,
            req.params.messageId,
            req.user._id,
            content
        );
        res.json(message);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete a message
router.delete('/chats/:chatId/messages/:messageId', authenticate, async (req, res) => {
    try {
        const message = await messageService.deleteMessage(
            req.params.chatId,
            req.params.messageId,
            req.user._id
        );
        res.json(message);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Mark messages as read
router.post('/chats/:chatId/messages/mark-read', authenticate, async (req, res) => {
    try {
        const { messageIds } = req.body;
        const result = await messageService.markAsRead(
            req.params.chatId,
            messageIds,
            req.user._id
        );
        res.json(result);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Get unread message count
router.get('/chats/unread-count', authenticate, async (req, res) => {
    try {
        const unreadCounts = await messageService.getUnreadCount(req.user._id);
        res.json(unreadCounts);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;
