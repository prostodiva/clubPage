const Meeting = require('../../database/model/meetingModel');
const User = require('../../database/model/userModel');
const Club = require('../../database/model/clubModel');
const { findUserById } = require('../../api/service/userService');
const { UnauthorizedError, BadRequestError, NotFoundError } = require('../../api/errors/errors');
const { ensureOwnership } = require('../../api/service/authService');

async function createMeeting(clubId, userId, body) {
    const role = await ensureOwnership(clubId, userId);

    if (role === 'Member') {
        throw new UnauthorizedError("Unauthorized");
    }

    const { title, agenda, date, location, attachments } = body;

    if (!title || !agenda || !date || !location || !attachments) {
        throw new BadRequestError("All fields (title, agenda, date, location) must be provided and non-null.");
    }

    const meeting = new Meeting({
        title,
        agenda,
        date,
        location,
        attachments,
        authorId: userId,
        clubId,
        participants: [userId]
    });

    await meeting.save();
    return meeting;
}

async function updateMeeting(meetingId, clubId, userId, body) {
    const role = await ensureOwnership(clubId, userId);
    if (role === 'Member') {
        throw new UnauthorizedError("Unauthorized");
    }

    const { title, agenda, date, location, attachments } = body;

    const meeting = await Meeting.findOne({
        _id: meetingId,
        clubId: clubId,
        isActive: true
    });

    if (!meeting) {
        throw new NotFoundError("Not Found");
    }

    const updates = {
        ...(title && { title }),
        ...(agenda && { agenda }),
        ...(date && { date }),
        ...(location && { location }),
        ...(attachments && { attachments }),
        lastUpdatedAt: new Date(),
        lastUpdatedBy: userId
    }

    const updatedMeeting = await Meeting.findByIdAndUpdate(
        meetingId,
        { $set: updates },
        { new: true }
    );

    return updatedMeeting;
}

async function deleteMeeting(meetingId, clubId, userId) {
    const role = await ensureOwnership(clubId, userId);

    if (role === 'Member') {
        throw new UnauthorizedError("Unauthorized");
    }

    const meeting = await Meeting.findOne({
        _id: meetingId,
        clubId,
        isActive: true
    });

    if (!meeting) {
        throw new NotFoundError(`Meeting not found with id ${meetingId}`);
    }

    const deletedMeeting = await Meeting.findByIdAndUpdate(
        meetingId,
        {
            $set: {
                isActive: false,
                lastUpdatedAt: new Date(),
                lastUpdatedBy: userId
            }
        },
        { new: true }
    );

    return deletedMeeting;
}

async function getAllMeetings(clubId, userId) {
    await ensureOwnership(clubId, userId);

    const meetings = await Meeting.find({
        clubId,
        isActive: true,
    })
        .select('title agenda date location createdAt attachments participants')
        .populate('participants', 'name email')
        .sort({ date : -1 })
        .exec();

    return meetings;
}

async function getMeetingById(meetingId, clubId, userId) {
    await ensureOwnership(clubId, userId);

    const meeting = await Meeting.findOne({
        _id: meetingId,
        clubId,
        isActive: true,
    })
        .select('title agenda date location createdAt attachments participants')
        .populate('participants', 'name email')
        .populate('authorId', 'name email')
        .exec();

    if (!meeting) {
        throw new NotFoundError(`Meeting not found with id ${meetingId}`);
    }

    return meeting;
}

async function getAllMeetingsAcrossClubs() {
    const meetings = await Meeting.find({
        isActive: true,
    })
        .select('title agenda date location createdAt attachments participants clubId')
        .populate('participants', 'name email')
        .populate('clubId', 'title')
        .sort({ date: -1 })
        .exec();

    return meetings;
}

module.exports = {
    createMeeting, deleteMeeting, updateMeeting, getAllMeetings, getMeetingById, getAllMeetingsAcrossClubs
};