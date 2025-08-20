// api/route/searchRoutes.js
const express = require('express');
const router = express.Router();
const Club = require('../../database/model/clubModel');
const User = require('../../database/model/userModel');
const Meeting = require('../../database/model/meetingModel');

router.get('/', async (req, res, next) => {
    try {
        const { term } = req.query;
        console.log('🔍 Backend: Search term:', term);

        if (!term) {
            return res.status(400).json({ message: 'Search term is required' });
        }

        const searchTerm = term.toLowerCase();
        
        // If searching for categories, fetch all data instead of searching
        if (searchTerm === 'users' || searchTerm === 'user') {
            console.log('🔍 Backend: Fetching all users for category search');
            const allUsers = await User.find({}).select('name email profileImageUrl role').limit(50);
            
            const objects = allUsers.map(user => ({ user, type: 'user' }));
            return res.json({ objects, searchType: 'category', category: 'users' });
        }
        
        if (searchTerm === 'meetings' || searchTerm === 'meeting') {
            console.log('🔍 Backend: Fetching all meetings for category search');
            const allMeetings = await Meeting.find({ isActive: true }).select('title agenda date location clubId').limit(50);
            
            const objects = allMeetings.map(meeting => ({ meeting, type: 'meeting' }));
            return res.json({ objects, searchType: 'category', category: 'meetings' });
        }
        
        if (searchTerm === 'clubs' || searchTerm === 'club') {
            console.log('🔍 Backend: Fetching all clubs for category search');
            const allClubs = await Club.find({ isActive: true }).select('title description imageUrl createdAt').limit(50);
            
            const objects = allClubs.map(club => ({ club, type: 'club' }));
            return res.json({ objects, searchType: 'category', category: 'clubs' });
        }

        // Regular content search for other terms
        const searchRegex = new RegExp(term, 'i');
        
        const [clubs, users, meetings] = await Promise.all([
            Club.find({
                $or: [
                    { title: searchRegex },
                    { description: searchRegex }
                ],
                isActive: true
            }).select('title description imageUrl createdAt').limit(10),

            User.find({
                $or: [
                    { name: searchRegex },
                    { email: searchRegex }
                ]
            }).select('name email profileImageUrl role').limit(10),

            Meeting.find({
                $or: [
                    { title: searchRegex },
                    { agenda: searchRegex },
                    { location: searchRegex }
                ],
                isActive: true
            }).select('title agenda date location clubId').limit(10)
        ]);

        const objects = [
            ...clubs.map(club => ({ club, type: 'club' })),
            ...users.map(user => ({ user, type: 'user' })),
            ...meetings.map(meeting => ({ meeting, type: 'meeting' }))
        ];

        res.json({ objects, searchType: 'content' });
    } catch (error) {
        console.error('❌ Backend Search error:', error);
        next(error);
    }
});

module.exports = router;