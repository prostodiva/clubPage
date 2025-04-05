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
        await deleteMeeting(req.params.meetingId, req.params.clubId, req.user.userId);
        res.status(204).send();
    } catch (error) {
        next(error);
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

module.exports = router;