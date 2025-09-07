// backend/db.js
const sqlite3 = require('sqlite3').verbose();

// Connect to the SQLite database. A new file `users.db` will be created if it doesn't exist.
const db = new sqlite3.Database('./users.db', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
    if (err) {
        console.error("Error connecting to the database:", err.message);
    } else {
        console.log('Connected to the SQLite database.');
    }
});

// Create the users table if it doesn't exist
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL
    )`, (err) => {
        if (err) {
            console.error("Error creating table:", err.message);
        }
    });
});

module.exports = db;