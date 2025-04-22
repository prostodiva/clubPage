const express = require('express');
const { createNotification } = require('../service/notificationService');
const { authenticate } = require('../middleware/securityMiddleware');
const router = express.Router();

//for postman: /notify
router.post('/', authenticate, async (req, res, next) => {
    try {
        const notification = await createNotification(
            req.user.userId,
            req.body
        );
        res.status(201).json(notification);
    } catch(error) {
        return next(error);
    }
});

module.exports = router;
