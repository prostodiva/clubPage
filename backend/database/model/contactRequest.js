const mongoose = require('../../config/databaseConfig')
const Schema = mongoose.Schema;

const contactRequestSchema = new Schema({
    requester: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    recipient: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    message: {
        type: String,
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'declined'],
        default: 'pending',
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    lastUpdatedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});

const ContactRequest = mongoose.model('ContactRequest', contactRequestSchema);
exports.ContactRequest = ContactRequest;