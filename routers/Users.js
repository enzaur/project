const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const pool = require('../database/db'); // Assuming your database connection
const { generateToken, verifyToken } = require('../auth/auth'); // Importing authentication functions

// Helper function for hashing passwords securely
const hashPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
};

// Login endpoint
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        // Fetch the user from the database by username
        const { rows } = await pool.query('SELECT * FROM "users" WHERE username = $1', [username]);
        if (rows.length === 0) {
            return res.status(400).json({ error: 'Invalid username or password' });
        }

        const user = rows[0];

        // Compare the provided password with the hashed password from the database
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ error: 'Invalid username or password' });
        }

        // Generate and return a JWT token
        const token = generateToken(user.user_id);

        res.json({ token });

    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Get all users with role details
router.get('/users', verifyToken, async (req, res) => {
    try {
        const query = `
            SELECT u.user_id, u.role_id, r.role_name, r.role_code,
                   u.username, u.email, u.first_name, u.last_name
            FROM "users" u
            JOIN role r ON u.role_id = r.role_id;
        `;
        const { rows } = await pool.query(query);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Get a specific user by ID with role details
router.get('/users/:user_id', verifyToken, async (req, res) => {
    const { user_id } = req.params;
    try {
        const query = `
            SELECT u.user_id, u.role_id, r.role_name, r.role_code,
                   u.username, u.email, u.first_name, u.last_name
            FROM "users" u
            JOIN role r ON u.role_id = r.role_id
            WHERE u.user_id = $1;
        `;
        const { rows } = await pool.query(query, [user_id]);
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Create a new user
router.post('/users', async (req, res) => {
    const { role_id, username, password, email, first_name, last_name } = req.body;
    try {
        const hashedPassword = await hashPassword(password);
        await pool.query('INSERT INTO "users" (role_id, username, password, email, first_name, last_name) VALUES ($1, $2, $3, $4, $5, $6)', [role_id, username, hashedPassword, email, first_name, last_name]);
        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Update a user by ID
router.put('/users/:user_id', verifyToken, async (req, res) => {
    const { user_id } = req.params;
    const { role_id, username, password, email, first_name, last_name } = req.body;
    try {
        const hashedPassword = await hashPassword(password);
        await pool.query('UPDATE "users" SET role_id = $1, username = $2, password = $3, email = $4, first_name = $5, last_name = $6 WHERE user_id = $7', [role_id, username, hashedPassword, email, first_name, last_name, user_id]);
        res.json({ message: 'User updated successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Change password for a user by ID
router.put('/users/:user_id/change-password', verifyToken, async (req, res) => {
    const { user_id } = req.params;
    const { currentPassword, newPassword } = req.body;
    try {
        // Fetch the user's current password from the database
        const { rows } = await pool.query('SELECT password FROM "users" WHERE user_id = $1', [user_id]);
        if (rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        const currentHashedPassword = rows[0].password;

        // Verify the current password
        const isPasswordValid = await bcrypt.compare(currentPassword, currentHashedPassword);
        if (!isPasswordValid) {
            return res.status(400).json({ error: 'Invalid current password' });
        }

        // Hash the new password
        const hashedNewPassword = await hashPassword(newPassword);

        // Update the password in the database
        await pool.query('UPDATE "user" SET password = $1 WHERE user_id = $2', [hashedNewPassword, user_id]);
        res.json({ message: 'Password updated successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Delete a user by ID
router.delete('/users/:user_id', verifyToken, async (req, res) => {
    const { user_id } = req.params;
    try {
        await pool.query('DELETE FROM "users" WHERE user_id = $1', [user_id]);
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
