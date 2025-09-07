// backend/routes/auth.js
const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('../db');
const router = express.Router();

const saltRounds = 10;

// POST /api/auth/register
router.post('/register', (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required." });
    }

    // Check if user already exists
    db.get(`SELECT email FROM users WHERE email = ?`, [email], (err, row) => {
        if (err) return res.status(500).json({ message: "Database error", error: err.message });
        if (row) return res.status(409).json({ message: "Email already exists." });

        // Hash password and insert new user
        bcrypt.hash(password, saltRounds, (err, hash) => {
            if (err) return res.status(500).json({ message: "Error hashing password." });

            db.run(`INSERT INTO users (email, password) VALUES (?, ?)`, [email, hash], function(err) {
                if (err) return res.status(500).json({ message: "Could not register user.", error: err.message });
                res.status(201).json({ message: "User registered successfully!", userId: this.lastID });
            });
        });
    });
});

// POST /api/auth/login
router.post('/login', (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required." });
    }

    db.get(`SELECT * FROM users WHERE email = ?`, [email], (err, user) => {
        if (err) return res.status(500).json({ message: "Database error." });
        if (!user) return res.status(401).json({ message: "Invalid credentials." });

        bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) return res.status(500).json({ message: "Error comparing passwords." });
            if (!isMatch) return res.status(401).json({ message: "Invalid credentials." });

            // Set user session
            req.session.userId = user.id;
            res.status(200).json({ message: "Logged in successfully.", user: { id: user.id, email: user.email }});
        });
    });
});

// POST /api/auth/logout
router.post('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).json({ message: "Could not log out." });
        }
        res.clearCookie('connect.sid'); // The default session cookie name
        return res.status(200).json({ message: "Logged out successfully." });
    });
});

// GET /api/auth/check-session
router.get('/check-session', (req, res) => {
    if (req.session.userId) {
        db.get(`SELECT id, email FROM users WHERE id = ?`, [req.session.userId], (err, user) => {
            if (err || !user) {
                return res.status(404).json({ loggedIn: false });
            }
            res.status(200).json({ loggedIn: true, user });
        });
    } else {
        res.status(200).json({ loggedIn: false });
    }
});


module.exports = router;