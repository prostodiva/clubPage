const mongoose = require('../../config/databaseConfig')
const Schema = mongoose.Schema;

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,                     //it means required validation
    },
    password: {
        type: String,
        required: true,
    },
    profileImageUrl: {
        type: String,
        default: 'https://ui-avatars.com/api/?name=John+Doe&background=random',
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

const User = mongoose.model('User', userSchema);        //creates a mongoose model called User

module.exports = User;