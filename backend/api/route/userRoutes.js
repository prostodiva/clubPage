const express = require('express');
const { register } = require('../../api/service/userService');

const router = express.Router();

router.post('/register', async (req, res, next) => {
    try {
        const { email, password, name } = req.body;
        const userId = await register(email, password, name );
        res.status(201).send(userId);
    } catch (error) {
        next(error);
    }
});


module.exports = router;
