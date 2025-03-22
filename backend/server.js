//the starting point of the program
require('dotenv').config()                                      //load the environment variables
const app = require('./app')                                    //import the express app from app.js
const http = require('http')                                    //import required Node.js module
process.env.NODE_ENV = process.env.NODE_ENV || 'development'    //sets the NODE_ENV environment variable to 'development'
const PORT = process.env.PORT || 8080;
const mongoose = require('./config/databaseConfig')             //connect to database

const server = http.createServer(app);                          //create HTTP server with the app
server.listen(PORT, () => {                           //start server on configured port
    console.log(`Server listening on port ${PORT}`);           //log that the server has started
});

module.exports = { port: PORT, server };                              //export modules