const mongoose = require('../../config/databaseConfig')
const Schema = mongoose.Schema;

const AnnouncementSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
   authorId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
   },
    clubId: {
        type: Schema.Types.ObjectId,
        ref: 'Club',
    },
    attachments: [{
        type: String,
    }
    ],
    isActive: {
        type: Boolean,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    lastUpdatedAt: {
        type: Date,
        default: Date.now,
    },
    lastUpdatedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
});

const Announcement = mongoose.model('Announcement', AnnouncementSchema);
module.exports = Announcement;