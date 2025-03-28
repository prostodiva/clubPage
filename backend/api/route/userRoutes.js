const express = require('express');
const { authenticate } = require('../middleware/securityMiddleware');
const { register, login, getUserProfileData, findUserById, contactRequest } = require('../../api/service/userService');
// const multer = require('multer');
// const path = require('path');
// const User = require('../../database/model/UserModel');

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


// // Configure multer for file upload
// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, 'uploads/') // Make sure this directory exists
//     },
//     filename: function (req, file, cb) {
//         cb(null, Date.now() + '-' + file.originalname)
//     }
// });
//
// const upload = multer({
//     storage: storage,
//     limits: {
//         fileSize: 5 * 1024 * 1024 // 5MB limit
//     },
//     fileFilter: (req, file, cb) => {
//         if (file.mimetype.startsWith('image/')) {
//             cb(null, true);
//         } else {
//             cb(new Error('Not an image! Please upload an image.'), false);
//         }
//     }
// });
//
//
// router.post('/upload-image', authenticate, upload.single('image'), async (req, res) => {
//     try {
//         if (!req.file) {
//             return res.status(400).json({ message: 'No file uploaded' });
//         }
//
//         const imageUrl = `${process.env.BASE_URL}/uploads/${req.file.filename}`;
//
//         // Update user's profile image URL in database
//         await User.findByIdAndUpdate(req.user.userId, {
//             profileImageUrl: imageUrl
//         });
//
//         res.json({ imageUrl });
//     } catch (error) {
//         console.error('Error uploading image:', error);
//         res.status(500).json({ message: 'Error uploading image' });
//     }
// });

module.exports = router;
