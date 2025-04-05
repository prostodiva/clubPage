const express = require('express');
const { createMeeting, deleteMeeting, updateMeeting, getAllMeetings, getMeetingById, getAllMeetingsAcrossClubs } = require('../service/meetingService');
const { authenticate } = require('../middleware/securityMiddleware');
const router = express.Router();


/*
POST   /clubs/:clubId/meetings              // Create meeting
GET    /clubs/:clubId/meetings              // Get all meetings
GET    /clubs/:clubId/meetings/:meetingId   // Get single meeting
PUT    /clubs/:clubId/meetings/:meetingId   // Update meeting
DELETE /clubs/:clubId/meetings/:meetingId   // Delete meeting
 */

router.post('/clubs/:clubId/meetings', authenticate, async (req, res, next) => {
    try {
        const meeting = await createMeeting(
            req.params.clubId,
            req.user.userId,
            req.body
        );
        res.status(201).json(meeting);
    } catch (error) {
        next(error);
    }
});

router.get('/clubs/:clubId/meetings', authenticate, async (req, res, next) => {
    try {
        const meetings = await getAllMeetings(
            req.params.clubId,
            req.user.userId
        );
        res.json(meetings);
    } catch (error) {
        next(error);
    }
});

router.put('/clubs/:clubId/meetings/:meetingId', authenticate, async (req, res, next) => {
    try {
        const meeting = await updateMeeting(
            req.params.meetingId,
            req.params.clubId,
            req.user.userId,
            req.body
        );
        res.json(meeting);
    } catch (error) {
        next(error);
    }
});

router.delete('/clubs/:clubId/meetings/:meetingId', authenticate, async (req, res, next) => {
    try {
        const result = await deleteMeeting(
            req.params.meetingId,
            req.user.userId,
            req.params.clubId
        );
        if (!result) {
            return res.status(404).json({ message: 'Meeting not found' });
        }
        res.status(204).send();
    } catch (error) {
        console.error('Delete meeting error:', error);
        if (error.message === 'Meeting not found') {
            return res.status(404).json({ message: 'Meeting not found' });
        }
        res.status(500).json({ message: error.message || 'Failed to delete meeting' });
    }
});

router.get('/clubs/:clubId/meetings/:meetingId', authenticate, async (req, res, next) => {
    try {
        const meeting = await getMeetingById(
            req.params.meetingId,
            req.params.clubId,
            req.user.userId
        );
        res.json(meeting);
    } catch (error) {
        next(error);
    }
});

// Get all meetings across all clubs (public endpoint)
router.get('/', async (req, res, next) => {
    try {
        const meetings = await getAllMeetingsAcrossClubs();
        res.json(meetings);
    } catch (error) {
        next(error);
    }
});

// Get a single meeting by ID (public endpoint)
router.get('/:meetingId', async (req, res, next) => {
    try {
        const meeting = await Meeting.findOne({
            _id: req.params.meetingId,
            isActive: true,
        })
            .select('title agenda date location createdAt attachments participants clubId')
            .populate('participants', 'name email')
            .populate('clubId', 'title')
            .exec();

        if (!meeting) {
            return res.status(404).json({ message: 'Meeting not found' });
        }
        res.json(meeting);
    } catch (error) {
        next(error);
    }
});

module.exports = router;