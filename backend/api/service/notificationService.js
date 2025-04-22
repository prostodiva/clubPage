const Notification = require('../../database/model/notificationModel');
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

module.exports = { createNotification };