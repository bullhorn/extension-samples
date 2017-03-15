const express = require('express');
const path = require('path');
const http = require('http');

const app = express();
app.use(express.static(path.resolve('dist')));

app.set('views', path.resolve('dist'));
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

// Catch all other routes and return the index file
app.get('*', (req, res, next) => {
  // Check for session!
  // Redirect if no session!
  next();
}, (req, res) => {
  res.render('novo.html', {
    settings: {},
    entitlements: {},
    ulUrl: '',
    ulLoginPage: '',
    environment: 'development'
  });
});

const port = process.env.PORT || '3000';
app.set('port', port);

const server = http.createServer(app);
server.listen(port, () => console.log(`UI Loaded on: http://localhost:${port}`));
