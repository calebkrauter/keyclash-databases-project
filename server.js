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
  console.log(`Server is running on port ${port}`);
});

module.exports = {
  express,
  app,
  port,
};