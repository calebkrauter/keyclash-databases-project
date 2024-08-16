const express = require("express");
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.JWT_SECRET_KEY;
const saltRounds = 10; 
const {
  insertUser,
  getUser,
  getLeaderboard,
  getUserIdByEmail,
  insertAttempt,
} = require("../controller/queries");
const { body, validationResult } = require("express-validator");

router.post('/login', async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await getUser(email, password);
      
      // If authentication is successful, create a token
      const token = jwt.sign(
        { userId: user.id, email: user.email },
        process.env.JWT_SECRET_KEY,
        { expiresIn: '1h' }
      );
  
      res.status(200).json({ 
        message: 'Login successful', 
        user: { id: user.id, username: user.username, email: user.email },
        token: token
      });
    } catch (err) {
      console.error("Login error:", err);
      if (err.message === "User not found" || err.message === "Incorrect password") {
        res.status(401).json({ error: err.message });
      } else {
        res.status(500).json({ error: "An error occurred during login. Please try again later." });
      }
    }
  });
router.get("/leaderboard", async (req, res) => {
  try {
    const result = await getLeaderboard();
    res.status(200).json(result);
  } catch (err) {
    console.error("Leaderboard error:", err);
    res.status(500).json({ error: "Can't fetch leaderboard. " + err.message });
  }
});

// Function for registering new user and adding to DB.

router.post(
  "/register",
  [
    body("username")
      .trim()
      .isLength({ min: 3, max: 30 })
      .withMessage("Username must be between 3 and 30 characters")
      .matches(/^[a-zA-Z0-9_]+$/)
      .withMessage(
        "Username can only contain letters, numbers, and underscores"
      ),
    body("email")
      .trim()
      .isEmail()
      .withMessage("Invalid email address")
      .normalizeEmail(),
    body("password")
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 characters long")
      .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])/)
      .withMessage(
        "Password must include at least one uppercase letter, one lowercase letter, one number, and one special character"
      ),
  ],
  async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, email, password } = req.body;

    try {
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      console.log("Generated hash:", hashedPassword);

      const result = await insertUser(username, email, hashedPassword);

      if (result.error) {
        return res.status(409).json({ error: result.error });
      }

      // Registration successful
      res.status(201).json({
        message: "Registration successful",
        user: { id: result.id, username: result.username, email: result.email },
      });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({ error: "An error occurred during registration" });
    }
  }
);

router.post("/attempt", async (req, res) => {
  try {
    const { characters_attempted, characters_missed, wpm, email } = req.body;
    const getUserId = await getUserIdByEmail(email);
    const result = insertAttempt(
      getUserId,
      characters_attempted,
      characters_missed,
      wpm
    );
    res.status(200).json(result);
  } catch (err) {
    console.error("Attempt insertion error:", err);
    res.status(500).json({ error: "Can't insert attempt. " + err.message });
  }
});
module.exports = router;
