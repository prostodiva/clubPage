const express = require('express');
const { register, login, getAllUsers } = require('../../api/service/userService');

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

router.post('/login', async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const token = await login(email, password);
        res.status(200).json(token);
    } catch (error) {
        next(error);
    }
});

router.get('/all', async (req, res) => {
    try {
        const users = await getAllUsers();
        res.status(200).json(users);
    } catch (error) {
        next(error);
    }
});


module.exports = router;
