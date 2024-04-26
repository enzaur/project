const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const pool = require('../database/db'); // Assuming your database connection
const { generateToken, verifyToken } = require('../auth/auth'); // Importing authentication functions

// Get all subjects
router.get('/subjects', verifyToken, async (req, res) => {
    try {
        const { rows } = await pool.query('SELECT * FROM subject');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Get a specific subject by ID
router.get('/subjects/:subject_id', verifyToken, async (req, res) => {
    const { subject_id } = req.params;
    try {
        const { rows } = await pool.query('SELECT * FROM subject WHERE subject_id = $1', [subject_id]);
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Create a new subject
router.post('/subjects', verifyToken, async (req, res) => {
    const { subject_code, subject_description, subject_schedule, subject_units, course_id } = req.body;
    try {
        await pool.query('INSERT INTO subject (subject_code, subject_description, subject_schedule, subject_units, course_id) VALUES ($1, $2, $3, $4, $5)', [subject_code, subject_description, subject_schedule, subject_units, course_id]);
        res.status(201).json({ message: 'Subject created successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Update a subject by ID
router.put('/subjects/:subject_id', verifyToken, async (req, res) => {
    const { subject_id } = req.params;
    const { subject_code, subject_description, subject_schedule, subject_units, course_id } = req.body;
    try {
        await pool.query('UPDATE subject SET subject_code = $1, subject_description = $2, subject_schedule = $3, subject_units = $4, course_id = $5 WHERE subject_id = $6', [subject_code, subject_description, subject_schedule, subject_units, course_id, subject_id]);
        res.json({ message: 'Subject updated successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Delete a subject by ID
router.delete('/subjects/:subject_id', verifyToken, async (req, res) => {
    const { subject_id } = req.params;
    try {
        await pool.query('DELETE FROM subject WHERE subject_id = $1', [subject_id]);
        res.json({ message: 'Subject deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
