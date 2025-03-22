require('dotenv').config()
const mongoose = require('mongoose')

// Use the MONGO_URI environment variable (set in docker-compose) or fallback to a default
const mongoUrl = process.env.MONGO_URI || 'mongodb://mongo:27017/clubpage';
console.log(`Attempting to connect to MongoDB at ${mongoUrl}`);

mongoose.connect(mongoUrl)
    .then(r => console.log(`MongoDB connection started`))
    .catch(reason => {
        console.log(`Database connection failed --- ${reason}`)
        process.exit(-1);
    });

module.exports = mongoose;
