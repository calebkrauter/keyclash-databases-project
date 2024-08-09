const express = require("express");
const router = express.Router();
const { insertUser } = require("../controllers/keyClashQs");

router.post("/register", async (req, res, next) => {
  try {
    console.log('Received registration request:', req.body);
    const { username, email, password_hash } = req.body;
    if (!username || !email || !password_hash) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    const result = await insertUser(username, email, password_hash);
    res.status(200).json({ message: 'Registration successful', user: result });
  } catch (error) {
    console.error('Registration error:', error);
    next(error);
  }
});

module.exports = router;