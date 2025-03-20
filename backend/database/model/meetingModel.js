const mongoose = require('../../config/databaseConfig')
const Schema = mongoose.Schema;

const MeetingSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    agenda: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    attachments: [
        {
            type: String,
        }
    ],
    participants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
    isActive: {
        type: Boolean,
        default: false,
    },
    authorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    clubId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Club',
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    },
    lastUpdatedAt: {
        type: Date
    },
    lastUpdatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }
});

const Meeting = mongoose.model('Meeting', MeetingSchema);
module.exports = Meeting;