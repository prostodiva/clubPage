const mongoose = require ('mongoose');
const Schema = mongoose.Schema;

const chatSchema = new mongoose.Schema({
    chatId: {
        type: String,
        required: true,
    },
    chatName: {
        type: String,
        required: true,
    },
    chatType: {
        type: String,
        enum: ['group', 'direct'],
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    members: [{
        type: Schema.Types.ObjectId,
        ref: 'User',
    }],
    isActive: {
        type: Boolean,
        default: false,
    }
});

const Chat = mongoose.model('Chat', chatSchema);

module.exports = Chat;