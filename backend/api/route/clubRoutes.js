const express = require('express');
const clubService = require('../../api/service/clubService');

const router = express.Router();

router.get('/all', async (req, res, next) => {
    try {
        const clubs = await clubService.getAllClubs();
        res.status(200).json(clubs);
    } catch (error) {
        next(error);
    }
});

module.exports = router;