const express = require('express');
const { createNotification, createBroadcastNotification } = require('../service/notificationService');
const { authenticate } = require('../middleware/securityMiddleware');
const Notification = require('../../database/model/notificationModel');
const router = express.Router();

// Get all notifications for the authenticated user
router.get('/', authenticate, async (req, res, next) => {
    try {
        const notifications = await Notification.find({
            recipient: req.user.userId,
            scheduledForDeletion: false
        }).sort({ createdAt: -1 });
        res.json(notifications);
    } catch(error) {
        return next(error);
    }
});

//for postman: /notify
router.post('/', authenticate, async (req, res, next) => {
    try {
        const notification = await createNotification(
            req.user.userId,
            req.body
        );
        res.status(201).json(notification);
    } catch(error) {
        return next(error);
    }
});

// Broadcast notification to all users
router.post('/broadcast', authenticate, async (req, res, next) => {
    try {
        // Check if user is admin
        if (req.user.role !== 'Admin') {
            return res.status(403).json({ message: 'Only admins can broadcast notifications' });
        }

        const notifications = await createBroadcastNotification(
            req.user.userId,
            {
                ...req.body,
                sender: req.user.userId
            }
        );
        res.status(201).json(notifications);
    } catch(error) {
        return next(error);
    }
});

module.exports = router;
