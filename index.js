const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const express = require('express');
const app = express();
const dotenv = require('dotenv');
dotenv.config();
const PORT = process.env.PORT || 4000;
const mongoose = require('mongoose');
const path = require('path');
const db = require('./config/db'); // Import database connection
const userSchema = require('./models/userModel'); // Import user model
const sessionMiddleware = require('./sessions/userSession'); // Your session setup
const authenticateUser = require('./middleware/authenticateUser')
app.use(sessionMiddleware);
// Middleware to parse JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const cookieParser = require('cookie-parser');
app.use(cookieParser());
const cors = require('cors');
app.use(cors({
    origin: 'http://localhost:3000', 
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

// Import routes
const userRoutes = require('./routes/userRoutes');

app.use('/api', userRoutes);
app.use(express.static('public'));



// sample route
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'))
});

app.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'server.html'))
});

app.get('/dashboard', authenticateUser, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

//Post route to handle JSON data
app.post('/test', (req, res) => {
    console.log('Received JSON data:', req.body);
    res.send('JSON data received successfully!');
})

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
