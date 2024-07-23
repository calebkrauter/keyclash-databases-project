const express = require('express');
const path = require('path');
const app = express();

// Serve static files from the Vue app build directory in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'dist')));

  // Handle SPA routing
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist/index.html'));
  });
} else {
  // In development, we'll just send a message
  app.get('*', (req, res) => {
    res.send('Server is running in development mode. Use Vite for serving the frontend.');
  });
}

const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0', () => {
  console.log(`Server is running on port ${port}`);
});