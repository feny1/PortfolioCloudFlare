const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

// Serve static assets from project root
app.use(express.static(path.join(__dirname)));

// 404 route
app.get('/404', (req, res) => {
  res.status(404).sendFile(path.join(__dirname, '404.html'));
});

// SPA fallback for all routes as defined in _redirects
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running at http://0.0.0.0:${PORT}`);
});
