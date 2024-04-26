const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const pool = require('../database/db'); // Assuming your database connection
const { generateToken, verifyToken } = require('../auth/auth'); // Importing authentication functions

// Get all courses
router.get('/courses', verifyToken, async (req, res) => {
    try {
        const { rows } = await pool.query('SELECT * FROM course');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Get a specific course by ID
router.get('/courses/:course_id', verifyToken, async (req, res) => {
    const { course_id } = req.params;
    try {
        const { rows } = await pool.query('SELECT * FROM course WHERE course_id = $1', [course_id]);
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Create a new course
router.post('/courses', verifyToken, async (req, res) => {
    const { course_code, course_name } = req.body;
    try {
        await pool.query('INSERT INTO course (course_code, course_name) VALUES ($1, $2)', [course_code, course_name]);
        res.status(201).json({ message: 'Course created successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Update a course by ID
router.put('/courses/:course_id', verifyToken, async (req, res) => {
    const { course_id } = req.params;
    const { course_code, course_name } = req.body;
    try {
        await pool.query('UPDATE course SET course_code = $1, course_name = $2 WHERE course_id = $3', [course_code, course_name, course_id]);
        res.json({ message: 'Course updated successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Delete a course by ID
router.delete('/courses/:course_id', verifyToken, async (req, res) => {
    const { course_id } = req.params;
    try {
        await pool.query('DELETE FROM course WHERE course_id = $1', [course_id]);
        res.json({ message: 'Course deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
