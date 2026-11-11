const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static assets from project root
app.use(express.static(path.join(__dirname)));

// Clean route handling for each section (allows both /projects and /projects.html)
const sections = ['education', 'expertise', 'collaborations', 'people', 'projects', 'gallery', 'news', 'partnership'];
sections.forEach(sec => {
  app.get(`/${sec}`, (req, res) => {
    res.sendFile(path.join(__dirname, `${sec}.html`));
  });
});

// 404 route
app.get('/404', (req, res) => {
  res.status(404).sendFile(path.join(__dirname, '404.html'));
});

// Robust image fallback resolver
app.get(/\.(jpg|jpeg|png|webp|gif|svg)$/i, (req, res, next) => {
  const fs = require('fs');
  const filename = path.basename(req.path);
  const possiblePaths = [
    path.join(__dirname, 'assets', 'images', filename),
    path.join(__dirname, 'public', 'assets', 'aistudio', filename),
    path.join(__dirname, 'assets', filename),
    path.join(__dirname, filename),
    path.join(__dirname, 'public', filename)
  ];
  for (const p of possiblePaths) {
    if (fs.existsSync(p)) {
      return res.sendFile(p);
    }
  }
  return res.status(404).send('Image file not found on server');
});

// SPA fallback for all remaining HTML/page routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running at http://0.0.0.0:${PORT}`);
});
