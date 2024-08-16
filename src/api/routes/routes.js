const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { insertUser, getUser, getLeaderboard, getUserIdByEmail, insertAttempt } = require('../controller/queries');

router.post('/login', async (req, res) => {
    try {
        const { email, password_hash } = req.body;
        const result = await getUser(email, password_hash);
        res.status(200).json({ message: 'Login successful', user: result });
    } catch (err) {
        console.error("Login error:", err);
        res.status(500).json({ error: "Can't login. " + err.message });
    }
});

router.get('/leaderboard', async (req, res) => {
    try {
        const result = await getLeaderboard();
        res.status(200).json(result);
    } catch (err) {
        console.error("Leaderboard error:", err);
        res.status(500).json({ error: "Can't fetch leaderboard. " + err.message });
    }
});

// Function for registering new user and adding to DB.
router.post('/register', async (req, res) => {
    const { username, email, password_hash } = req.body;
    if (!username || !email || !password_hash) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        const result = await insertUser(username, email, password_hash);
        res.status(201).json({ message: 'Registration successful', user: result });
    } catch (error) {
        if (error.message === 'Email has already been taken' || error.message === 'Username has already been taken') {
            res.status(409).json({ error: error.message });
        } else {
            console.error('Registration error:', error);
            res.status(500).json({ error: 'An error occurred during registration' });
        }
    }
});

router.post('/attempt', async (req, res) => {
    try {
        const { characters_attempted, characters_missed, wpm, email } = req.body;
        const getUserId = await getUserIdByEmail(email);
        const result = insertAttempt(getUserId, characters_attempted, characters_missed, wpm);
        res.status(200).json(result);
    } catch (err) {
        console.error("Attempt insertion error:", err);
        res.status(500).json({ error: "Can't insert attempt. " + err.message });
    }
});

module.exports = router;