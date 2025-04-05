const express = require('express');                         //import the Express module
const cors = require('cors');                               //import the CORS module
const { securityMiddleware } = require('./api/middleware/securityMiddleware');

const userRoutes = require('./api/route/userRoutes');       //import and attach API routes
const clubRoutes = require('./api/route/clubRoutes');
const meetingRoutes = require('./api/route/meetingRoutes');

const app = express();                                      //creates a new Express application

securityMiddleware(app);

app.use(cors());                                            //Enable CORS for all routes
app.use(express.json());                                    //Parse incoming requests with JSON payloads

app.use('/uploads', express.static('uploads'));

app.use('/users', userRoutes);                              //Mount user routes at /users path
app.use('/clubs', clubRoutes);
app.use('/meetings', meetingRoutes);

module.exports = app;                                       //export the Express application