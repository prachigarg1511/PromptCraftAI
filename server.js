const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcryptjs');

const app = express();
const PORT = process.env.PORT || 3000;
const DB_PATH = path.join(__dirname, 'promptcraft.db');

// Middleware
app.use(express.json());
// Serve static files with support for clean URLs (e.g. /auth serves auth.html)
app.use(express.static(__dirname, { extensions: ['html'] }));

// Initialize Database
const db = new sqlite3.Database(DB_PATH, (err) => {
    if (err) {
        console.error('Error connecting to SQLite database:', err.message);
    } else {
        console.log('Connected to SQLite database.');
        createTables();
    }
});

function createTables() {
    db.run(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `, (err) => {
        if (err) {
            console.error('Error creating users table:', err.message);
        } else {
            console.log('Users table ready.');
        }
    });
}

// API Endpoints

// Register Endpoint
app.post('/api/auth/register', async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return res.status(400).json({ error: 'Name, email, and password are required' });
    }
    const cleanEmail = email.trim().toLowerCase();
    
    try {
        // Hash password securely
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Insert user into SQLite database
        db.run(
            `INSERT INTO users (name, email, password) VALUES (?, ?, ?)`,
            [name.trim(), cleanEmail, hashedPassword],
            function (err) {
                if (err) {
                    if (err.message.includes('UNIQUE constraint failed')) {
                        return res.status(400).json({ error: 'An account with this email address already exists.' });
                    }
                    return res.status(500).json({ error: 'Database error: ' + err.message });
                }
                res.status(201).json({
                    success: true,
                    user: {
                        name: name.trim(),
                        email: cleanEmail
                    }
                });
            }
        );
    } catch (e) {
        res.status(500).json({ error: 'Server error: ' + e.message });
    }
});

// Login Endpoint
app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }
    const cleanEmail = email.trim().toLowerCase();

    db.get(
        `SELECT * FROM users WHERE email = ?`,
        [cleanEmail],
        async (err, user) => {
            if (err) {
                return res.status(500).json({ error: 'Database error: ' + err.message });
            }
            if (!user) {
                return res.status(400).json({ error: 'Invalid email or password. Please verify credentials.' });
            }

            try {
                // Compare password with hashed database record
                const match = await bcrypt.compare(password, user.password);
                if (!match) {
                    return res.status(400).json({ error: 'Invalid email or password. Please verify credentials.' });
                }

                res.json({
                    success: true,
                    user: {
                        name: user.name,
                        email: user.email
                    }
                });
            } catch (e) {
                res.status(500).json({ error: 'Server error: ' + e.message });
            }
        }
    );
});

// Default fallback route (handles SPA routing if needed)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
