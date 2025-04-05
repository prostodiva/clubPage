const mongoose = require('../../config/databaseConfig')
const Schema = mongoose.Schema;

const MeetingSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true
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
        default: true,
        required: true,
    },
    authorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    clubId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Club',
        required: true
    },
    lastUpdatedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    }
}, {
    timestamps: {
        createdAt: 'createdAt',
        updatedAt: 'updatedAt'
    }
});

MeetingSchema.index({clubId: 1, isActive: 1});
MeetingSchema.index({date: -1});

MeetingSchema.methods.isParticipant = function (userId) {
    return this.participants.includes(userId);
};

const Meeting = mongoose.model('Meeting', MeetingSchema);
module.exports = Meeting;