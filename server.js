const express = require('express');
const cors = require('cors');
const { insertUser, getUser, getLeaderboard } = require('./src/api/controller/queries');
const app = express();
const port = process.env.PORT || 5001;
app.use(cors());
app.use(express.json());

app.post('/api/login', async (req, res) => {

  try {
    const { email, password_hash } = req.body;

    const result = await getUser(email, password_hash);

    res.status(200).json({ message: 'Login successful', user: result });

  } catch (err) {
    console.log("ERROR")
    throw err + " can't login."
  }

});

app.get('/api/leaderboard', async (req, res) => {
  try {
    const result = await getLeaderboard();
    res.status(200).json(result);
  } catch (err) {
    console.error("Leaderboard error:", err);
    res.status(500).json({ error: "Can't fetch leaderboard. " + err.message });
  }
});

app.post('/api/register', async (req, res) => {
  console.log('Received registration request:', req.body);

  const { username, email, password_hash } = req.body;
  if (!username || !email || !password_hash) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const result = await insertUser(username, email, password_hash);
    res.status(200).json({ message: 'Registration successful', user: result });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
});

// app.post('/api/achievement', async (req, res) => {
//   console.log("It's alive!");
//   res.status(200).json({ message: 'Achievement successful' });
// });

app.post('/api/attempt', async (req, res) => {
  try {
    const { characters_attempted, characters_missed, wpm, email } = req.body;
    // const getUserId = await getUserId(email);
    const result = await insertAttempt(email, characters_attempted, characters_missed, wpm);
    res.status(200).json(result);
  } catch (err) {
    console.error("Attempt insertion error:", err);
    res.status(500).json({ error: "Can't insert attempt. " + err.message });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
module.exports = {
  express,
  app,
  port,
}