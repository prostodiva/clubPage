const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
    const authHeader = req.header('Authorization');
    const token = authHeader && authHeader.split(' ')[1];  // This removes the 'Bearer' prefix

    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(400).json({ message: 'Invalid token' });
    }
};

const securityMiddleware = (app) => {
    // CORS setup with environment-based origin
    app.use((req, res, next) => {
        const allowedOrigins = [
            'http://localhost:5173',  // Development
            'http://clubpage-api-env.eba-rstfvjmj.us-west-1.elasticbeanstalk.com'  // Production
        ];
        
        const origin = req.headers.origin;
        if (allowedOrigins.includes(origin)) {
            res.setHeader('Access-Control-Allow-Origin', origin);
        }
        
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        res.setHeader('Access-Control-Allow-Credentials', 'true');
        next();
    });
};

module.exports = {
    securityMiddleware,
    authenticate
};