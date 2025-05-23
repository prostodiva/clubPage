const mongoose = require('../../config/databaseConfig')
const Schema = mongoose.Schema;

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    profileImageUrl: {
        type: String,
        default: 'https://ui-avatars.com/api/?name=User&background=F3F4F6&color=374151',
    },
    associations: [                             //array of associations
        {
            type: Schema.Types.ObjectId,        //a relationship between the User model and another model called Association
            ref: 'Association',
        }
    ],
    role: {
        type: String,
        required: true,
        default: 'User'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    joinedAt: {
        type: Date,
        default: Date.now
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User;