const express = require('express');                         //import the Express module
const cors = require('cors');                               //import the CORS module
const { securityMiddleware } = require('./api/middleware/securityMiddleware');

const userRoutes = require('./api/route/userRoutes');       //import and attach API routes
const clubRoutes = require('./api/route/clubRoutes');
const meetingRoutes = require('./api/route/meetingRoutes');
const notificationRoutes = require('./api/route/notificationRoutes');
const chatRoutes = require('./api/route/chatRoutes');
const messageRoutes = require('./api/route/messageRoutes');

const app = express();                                      //creates a new Express application

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

securityMiddleware(app);

// Configure CORS
const corsOptions = {
    origin: [
        'https://clubpage.pages.dev',
        'http://localhost:5173',
        'https://clubpage-api-env.eba-rstfvjmj.us-west-1.elasticbeanstalk.com'
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
};

app.use(cors(corsOptions));                                 //Enable CORS with specific options
app.use(express.json());                                    //Parse incoming requests with JSON payloads

app.use('/uploads', express.static('uploads'));

app.use('/users', userRoutes);                              //Mount user routes at /users path
app.use('/clubs', clubRoutes);
app.use('/meetings', meetingRoutes);
app.use('/notify', notificationRoutes);
app.use('/chats', chatRoutes);
app.use('/messages', messageRoutes);

module.exports = app;                                       //export the Express application