const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const pool = require('../database/db'); // Assuming your database connection
const { generateToken, verifyToken } = require('../auth/auth'); // Importing authentication functions

// Get all roles
router.get('/roles', verifyToken, async (req, res) => {
    try {
        const { rows } = await pool.query('SELECT * FROM role');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Get a specific role by ID
router.get('/roles/:role_id', verifyToken, async (req, res) => {
    const { role_id } = req.params;
    try {
        const { rows } = await pool.query('SELECT * FROM role WHERE role_id = $1', [role_id]);
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Create a new role
router.post('/roles', verifyToken, async (req, res) => {
    const { role_name, role_code } = req.body;
    try {
        await pool.query('INSERT INTO role (role_name, role_code) VALUES ($1, $2)', [role_name, role_code]);
        res.status(201).json({ message: 'Role created successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Update a role by ID
router.put('/roles/:role_id', verifyToken, async (req, res) => {
    const { role_id } = req.params;
    const { role_name, role_code } = req.body;
    try {
        await pool.query('UPDATE role SET role_name = $1, role_code = $2 WHERE role_id = $3', [role_name, role_code, role_id]);
        res.json({ message: 'Role updated successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Delete a role by ID
router.delete('/roles/:role_id', verifyToken, async (req, res) => {
    const { role_id } = req.params;
    try {
        await pool.query('DELETE FROM role WHERE role_id = $1', [role_id]);
        res.json({ message: 'Role deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
