const express = require('express');                         //import the Express module
const cors = require('cors');                               //import the CORS module

const userRoutes = require('./api/route/userRoutes');       //import and attach API routes
const clubRoutes = require('./api/route/clubRoutes');

const app = express();                                      //creates a new Express application

app.use(cors());                                            //Enable CORS for all routes
app.use(express.json());                                    //Parse incoming requests with JSON payloads

app.use('/users', userRoutes);                              //Mount user routes at /users path
app.use('/clubs', clubRoutes);

module.exports = app;                                       //export the Express application