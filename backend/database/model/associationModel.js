const mongoose = require('../../config/databaseConfig')
const Schema = mongoose.Schema;

const associationSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    clubId: {
        type: Schema.Types.ObjectId,
        ref: 'Club',
    },
    role: {
        type: String,
        default: 'member',
    }
});

const Association = mongoose.model('Association', associationSchema);

module.exports = Association;