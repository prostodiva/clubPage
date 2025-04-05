const express = require('express');
const { authenticate } = require('../middleware/securityMiddleware');
const { register, login, getUserProfileData, findUserById, contactRequest, getAllUsers } = require('../../api/service/userService');

const {
    BadRequestError,
    DuplicateUserError,
    NotFoundError,
    PasswordValidationError
} = require('../errors/errors');

const router = express.Router();

router.post('/register', async (req, res, next) => {
    try {
        const { email, password, name, role } = req.body;
        const userId = await register(email, password, name, role);
        res.status(201).json({
            id: userId,
            email,
            name,
            role
        });
    } catch (error) {
        // Handle specific error types
        if (error instanceof DuplicateUserError) {
            return res.status(409).json({
                message: error.message // 'The user is already registered'
            });
        }
        if (error instanceof BadRequestError) {
            return res.status(400).json({
                message: error.message // 'email and password are required' or 'Password must be at least 6 characters'
            });
        }
        // Log unexpected errors
        console.error('Registration error:', error);
        next(error);
    }
});

router.post('/login', async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // Add debug logging
        console.log('Login attempt for email:', email);

        if (!email || !password) {
            return res.status(400).json({
                message: 'Email and password are required'
            });
        }

        const token = await login(email, password);
        res.status(200).json({ token });
    } catch (error) {
        console.error('Login error:', {
            message: error.message,
            name: error.name,
            stack: error.stack
        });

        if (error instanceof NotFoundError) {
            return res.status(404).json({
                message: error.message
            });
        }
        if (error instanceof PasswordValidationError) {
            return res.status(401).json({
                message: error.message
            });
        }
        if (error instanceof BadRequestError) {
            return res.status(400).json({
                message: error.message
            });
        }

        next(error);
    }
});

router.get('/info/:userId', authenticate, async (req, res, next) => {
    try {
        const targetUserId = req.params['userId'];
        const userId = req.user.userId;

        const targetUserData = await getUserProfileData(userId, targetUserId);
        res.status(200).json(targetUserData);
    } catch (error) {
        next(error);
    }
});

router.post('/:userId', authenticate, async (req, res, next) => {
    try {
        const targetUserId = req.params['userId'];
        const userId = req.user.userId;

        const notificationId = await contactRequest(userId, targetUserId);
        res.status(201).json({ notificationId });
    } catch (error) {
        next(error)
    }
});

router.get('/all', async (req, res, next) => {
    try {
        const users = await getAllUsers();
        res.status(200).json(users);
    } catch (error) {
        next(error);
    }
});


module.exports = router;
