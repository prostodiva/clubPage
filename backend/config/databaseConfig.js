require('dotenv').config()
const mongoose = require('mongoose')

mongoose.connect(process.env.MONGO_URL)
    .then(r => console.log(`MongoDB connection started`))
    .catch(reason => {
        console.log(`Database connection failed --- ${reason}`)
        process.exit(-1);
    });

module.exports = mongoose;