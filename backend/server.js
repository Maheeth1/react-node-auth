// backend/server.js
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const path = require('path');
const authRoutes = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
    origin: [
        process.env.CLIENT_URL,
        'http://localhost:3000', // For local development
        'https://react-node-auth-ten.vercel.app' // For Vercel deployment
    ].filter(Boolean), // Filter out undefined values
    credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

// Session Configuration
app.use(session({
    secret: 'your_secret_key', // Replace with a strong secret key
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production', // ✅ true in production (HTTPS)
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
    }
}));

// API Routes
app.use('/api/auth', authRoutes);

// ✅ Remove static file serving since frontend is deployed separately on Vercel
// app.use(express.static(path.join(__dirname, '../frontend/build')));

// ✅ Remove fallback route since frontend is deployed separately
// app.get(/^(?!\/api).*/, (req, res) => {
//   res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
// });


// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
