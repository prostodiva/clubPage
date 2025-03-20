const mongoose = require('../../config/databaseConfig')
const Announcement = require("./announcementModel");
const Schema = mongoose.Schema;

const NotificationSchema = new Schema({
    recipient: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    sender: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    message: {
        type: String,
        required: true,
    },
    entityType: {
        type: String,
        enum: [ 'Announcement', 'Meeting', 'ContactRequest'],
        required: true,
    },
    isRead: {
        type: Boolean,
        default: false,
    },
    scheduledForDeletion: {
        type: Boolean,
        default: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

const Notification = mongoose.model('Notification', NotificationSchema);
module.exports = Notification;