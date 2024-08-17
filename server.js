const express = require('express');
const cors = require('cors');
const routes = require('./src/api/routes/routes.js');

const app = express();
const port = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

// Use the routes
app.use('/api', routes);

app.listen(port, () => {
  console.log(`Server is running on port [${port}]`);
});

// app.post('/api/achievement', async (req, res) => {
//   console.log("It's alive!");
//   res.status(200).json({ message: 'Achievement successful' });
// });

app.get('/api/leaderboard', async (req, res) => {
  try {
    const result = await getLeaderboard();
    res.status(200).json(result.data);
  } catch (error) {
    console.error('Leaderboard error:', error);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
});

module.exports = {
  express,
  app,
  port,
};