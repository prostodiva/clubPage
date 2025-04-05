const express = require('express');
const { authenticate } = require('../middleware/securityMiddleware');
const clubService = require('../../api/service/clubService');

const router = express.Router();

// Create a new club (requires authentication)
router.post('/create', authenticate, async (req, res, next) => {
    try {
        const { title, content, imageUrl } = req.body;
        const club = await clubService.createClub(title, content, imageUrl, req.user.userId);
        res.status(201).json(club);
    } catch (error) {
        next(error);
    }
});

// Get all active clubs
router.get('/all', async (req, res, next) => {
    try {
        const clubs = await clubService.getAllClubs();
        res.status(200).json(clubs);
    } catch (error) {
        next(error);
    }
});

// Get club by ID
router.get('/:id', async (req, res, next) => {
    try {
        const club = await clubService.getClubById(req.params.id);
        res.status(200).json(club);
    } catch (error) {
        next(error);
    }
});

// Search clubs by title
router.get('/search/:query', async (req, res, next) => {
    try {
        const clubs = await clubService.searchClubs(req.params.query);
        res.status(200).json(clubs);
    } catch (error) {
        next(error);
    }
});

// Get club members (requires authentication)
router.get('/:clubId/members', authenticate, async (req, res, next) => {
    try {
        const members = await clubService.getClubMembers(req.params.clubId, req.user.userId);
        res.status(200).json(members);
    } catch (error) {
        next(error);
    }
});

// Join a club (requires authentication)
router.post('/:clubId/join', authenticate, async (req, res, next) => {
    try {
        const result = await clubService.joinClub(req.params.clubId, req.user.userId);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
});

// Leave a club (requires authentication)
router.post('/:clubId/leave', authenticate, async (req, res, next) => {
    try {
        await clubService.leaveClub(req.params.clubId, req.user.userId);
        res.status(200).json({ message: 'Successfully left the club' });
    } catch (error) {
        next(error);
    }
});

// Submit club application (requires authentication)
router.post('/:clubId/application', authenticate, async (req, res, next) => {
    try {
        await clubService.submitApplication(req.params.clubId, req.user.userId, req.body.answers);
        res.status(200).json({ message: 'Application submitted successfully' });
    } catch (error) {
        next(error);
    }
});

module.exports = router;