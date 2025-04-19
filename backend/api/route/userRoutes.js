const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/securityMiddleware');
const userService = require('../service/userService');
const { NotFoundError } = require('../errors/errors');
const { ensureOwnership } = require('../service/authService');
const Association = require('../../database/model/associationModel');

const {
    BadRequestError,
    DuplicateUserError,
    PasswordValidationError
} = require('../errors/errors');

router.post('/register', async (req, res, next) => {
    try {
        const { email, password, name, role } = req.body;
        const userId = await userService.register(email, password, name, role);
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

        const token = await userService.login(email, password);
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

        const targetUserData = await userService.findUserById(userId, targetUserId);
        res.status(200).json(targetUserData);
    } catch (error) {
        next(error);
    }
});

router.get('/info/profile/:userId', authenticate, async (req, res, next) => {
    try {
        const targetUserId = req.params['userId'];
        const userId = req.user.userId;

        const targetUserData = await userService.getUserProfileData(userId, targetUserId);
        res.status(200).json(targetUserData);
    } catch (error) {
        next(error);
    }
});

router.post('/:userId', authenticate, async (req, res, next) => {
    try {
        const targetUserId = req.params['userId'];
        const userId = req.user.userId;

        const notificationId = await userService.contactRequest(userId, targetUserId);
        res.status(201).json({ notificationId });
    } catch (error) {
        next(error)
    }
});

router.get('/all', async (req, res, next) => {
    try {
        const users = await userService.getAllUsers();
        res.status(200).json(users);
    } catch (error) {
        next(error);
    }
});

router.delete('/:id', authenticate, async (req, res) => {
    try {
        const userId = req.params.id;
        const currentUserId = req.user.userId;

        if (req.user.role === 'Admin' || userId === currentUserId) {
            const deletedUser = await userService.deleteUserById(userId);
            return res.status(200).json({ message: 'User deleted successfully', user: deletedUser });
        }

        const user = await userService.findUserById(userId);
        if (!user) {
            throw new NotFoundError('User not found');
        }

        const associations = await Association.find({ userId: userId }).exec();
        for (const association of associations) {
            try {
                await ensureOwnership(association.clubId, currentUserId);
                // If we get here, the user has ownership of at least one club
                const deletedUser = await userService.deleteUserById(userId);
                return res.status(200).json({ message: 'User deleted successfully', user: deletedUser });
            } catch (error) {
                // Continue checking other clubs
                continue;
            }
        }

        return res.status(403).json({ error: 'You do not have permission to delete this user' });
    } catch (error) {
        console.error('Delete user error:', error);
        if (error instanceof NotFoundError) {
            return res.status(404).json({ error: error.message });
        }
        res.status(500).json({ error: 'Failed to delete user' });
    }
});

module.exports = router;
