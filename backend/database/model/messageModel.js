const mongoose = require ('mongoose');
const Schema = mongoose.Schema;

const messageSchema = new mongoose.Schema({
    messageId: {
        type: String,
        required: true,
    },
    chatId: {
        type: Schema.Types.ObjectId,
        ref: 'Chat',
        required: true,
    },
    senderId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
    messageType: {
        enum: ['text', 'image', 'file', 'video'],
        required: true,
    },
    readBy: [{
        type: Schema.Types.ObjectId,
        ref: 'User',
    }],
    isDeleted: {
        type: Boolean,
        default: false,
    }
});

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;