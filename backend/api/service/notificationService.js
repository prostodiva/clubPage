const Notification = require('../../database/model/notificationModel');
const User = require('../../database/model/userModel');
const { ensureOwnership } = require('../../api/service/authService');
const { UnauthorizedError, BadRequestError, NotFoundError } = require('../../api/errors/errors');

async function createNotification(userId, body) {
    const { recipient, sender, message, entityType } = body;
    if (!recipient || !sender || !message || !entityType) {
        throw new BadRequestError("All fields(recipient, sender, message, entityType) must be provided");
    }

    const notification = new Notification({
        recipient,
        sender,
        message,
        entityType,
        isRead: false,
        scheduledForDeletion: false,
        createdAt: new Date(),
    });

    await notification.save();
    return notification;
}

async function createBroadcastNotification(userId, body) {
    const { sender, message, entityType } = body;
    if (!sender || !message || !entityType) {
        throw new BadRequestError("All fields(sender, message, entityType) must be provided");
    }

    // Get all users except the sender
    const users = await User.find({ _id: { $ne: sender } }).select('_id');
    
    // Create notifications for all users
    const notifications = users.map(user => ({
        recipient: user._id,
        sender,
        message,
        entityType,
        isRead: false,
        scheduledForDeletion: false,
        createdAt: new Date(),
    }));

    // Save all notifications
    const savedNotifications = await Notification.insertMany(notifications);
    return savedNotifications;
}

module.exports = { createNotification, createBroadcastNotification };