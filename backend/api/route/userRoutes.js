const express = require('express');
const { register, login, getAllUsers } = require('../../api/service/userService');

const {
    BadRequestError,
    DuplicateUserError,
    NotFoundError,
    PasswordValidationError
} = require('../errors/errors');

const router = express.Router();

router.post('/register', async (req, res, next) => {
    try {
        const { email, password, name } = req.body;
        const userId = await register(email, password, name);
        res.status(201).json({
            id: userId,
            email,
            name,
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
        const token = await login(email, password);
        res.status(200).json({ token });
    } catch (error) {
        // Handle specific error types
        if (error instanceof NotFoundError) {
            return res.status(404).json({
                message: error.message // 'User does not exist'
            });
        }
        if (error instanceof PasswordValidationError) {
            return res.status(401).json({
                message: error.message // 'Password does not match'
            });
        }
        if (error instanceof BadRequestError) {
            return res.status(400).json({
                message: error.message // 'email and password are required'
            });
        }
        // Log unexpected errors
        console.error('Login error:', error);
        next(error);
    }
});

module.exports = router;
