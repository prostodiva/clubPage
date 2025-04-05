const mongoose = require('../../config/databaseConfig');
const Schema = mongoose.Schema;

const questionSchema = new Schema({
    questionText: {
        type: String,
        required: true,
        trim: true
    },
    inputType: {
        type: String,
        required: true,
        enum: ['text', 'textarea', 'radio', 'checkbox', 'select']
    },
    choices: [{
        type: String,
        trim: true
    }],
    required: {
        type: Boolean,
        default: false
    }
});

const cabinetMemberSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    role: {
        type: String,
        required: true,
        enum: ['President', 'Vice President', 'Secretary', 'Treasurer', 'Member']
    }
});

const clubSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    content: {
        type: String,
        required: true,
        trim: true
    },
    imageUrl: {
        type: String,
        trim: true
    },
    cabinet: [cabinetMemberSchema],
    application: {
        questions: [questionSchema],
        isActive: {
            type: Boolean,
            default: false
        }
    },
    isActive: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

clubSchema.index({ title: 1 });
clubSchema.index({ 'cabinet.userId': 1 });

clubSchema.methods.isInCabinet = function(userId) {
    return this.cabinet.some(member => member.userId.toString() === userId.toString());
};

clubSchema.methods.getUserRole = function(userId) {
    const member = this.cabinet.find(member => member.userId.toString() === userId.toString());
    return member ? member.role : null;
};

const Club = mongoose.model('Club', clubSchema);

module.exports = Club;