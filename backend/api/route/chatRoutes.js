const express = require('express');
const router = express.Router();
const chatService = require('../service/chatService');
const { authenticate } = require('../middleware/securityMiddleware');

// Get all chats for the authenticated user
router.get('/', authenticate, async (req, res) => {
    try {
        const chats = await chatService.getAllChats(req.user.userId);
        res.json(chats);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get a specific chat by ID
router.get('/:chatId', authenticate, async (req, res) => {
    try {
        const chat = await chatService.getChatById(req.params.chatId, req.user.userId);
        res.json(chat);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

// Create a new chat
router.post('/', authenticate, async (req, res) => {
    try {
        const { title, participants } = req.body;
        
        if (!title || !participants || !Array.isArray(participants)) {
            return res.status(400).json({ error: 'Invalid request body' });
        }

        const chat = await chatService.createChat(title, req.user.userId, participants);
        res.status(201).json(chat);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Get messages from a chat
router.get('/:chatId/messages', authenticate, async (req, res) => {
    try {
        const messages = await chatService.getMessages(req.params.chatId, req.user.userId);
        res.json(messages);
    } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(400).json({ error: error.message });
    }
});

// Send a message in a chat
router.post('/:chatId/messages', authenticate, async (req, res) => {
    try {
        const { content } = req.body;
        
        if (!content) {
            return res.status(400).json({ error: 'Message content is required' });
        }

        const message = await chatService.sendMessage(
            req.params.chatId,
            req.user.userId,
            content
        );
        res.status(201).json(message);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Update chat title
router.patch('/:chatId', authenticate, async (req, res) => {
    try {
        const { title } = req.body;
        
        if (!title) {
            return res.status(400).json({ error: 'Title is required' });
        }

        const chat = await chatService.updateChatTitle(
            req.params.chatId,
            req.user.userId,
            title
        );
        res.json(chat);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Delete a chat
router.delete('/:chatId', authenticate, async (req, res) => {
    try {
        const result = await chatService.deleteChat(req.params.chatId, req.user.userId);
        res.json(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Leave a chat
router.post('/:chatId/leave', authenticate, async (req, res) => {
    try {
        const result = await chatService.leaveChat(req.params.chatId, req.user.userId);
        res.json(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;
