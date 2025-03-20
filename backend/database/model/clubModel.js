const mongoose = require('../../config/databaseConfig')
const Schema = mongoose.Schema;


const questionSchema = new mongoose.Schema({
    questionText: {
        type: String,
        required: true,
    },
    inputType: {
        type: String,
        required: true,
    },
    choices: [String],
});

const clubSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    imageUrl: {
        type: String,
    },
    cabinet: [
        {
            userId: {
                type: Schema.Types.ObjectId,
                ref: 'User',
            },
            role: String
        }
    ],
    application: {
        questions: [questionSchema],
    },
});


const Club = mongoose.model('Club', clubSchema);

module.exports = Club;