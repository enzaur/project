const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const pool = require('../database/db'); // Assuming your database connection
const { generateToken, verifyToken } = require('../auth/auth'); // Importing authentication functions

// Get all enrollments with student and section details
router.get('/enrollments', verifyToken, async (req, res) => {
    try {
        const query = `
      SELECT e.enrollment_id, e.student_id, u.username as student_username, u.first_name as student_first_name, u.last_name as student_last_name,
             e.section_id, s.section_name, s.room, s.capacity, e.semester, e.school_year, e.status
      FROM enrollment e
      JOIN "users" u ON e.student_id = u.user_id
      JOIN section s ON e.section_id = s.section_id;
    `;
        const { rows } = await pool.query(query);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Get a specific enrollment by ID with student and section details
router.get('/enrollments/:enrollment_id', verifyToken, async (req, res) => {
    const { enrollment_id } = req.params;
    try {
        const query = `
      SELECT e.enrollment_id, e.student_id, u.username as student_username, u.first_name as student_first_name, u.last_name as student_last_name,
             e.section_id, s.section_name, s.room, s.capacity, e.semester, e.school_year, e.status
      FROM enrollment e
      JOIN "users" u ON e.student_id = u.user_id
      JOIN section s ON e.section_id = s.section_id
      WHERE e.enrollment_id = $1;
    `;
        const { rows } = await pool.query(query, [enrollment_id]);
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Get enrollments by student ID with section details
router.get('/students/:student_id/enrollments', verifyToken, async (req, res) => {
    const { student_id } = req.params;
    try {
        const query = `
      SELECT e.enrollment_id, e.student_id, u.username as student_username, u.first_name as student_first_name, u.last_name as student_last_name,
             e.section_id, s.section_name, s.room, s.capacity, e.semester, e.school_year, e.status
      FROM enrollment e
      JOIN "users" u ON e.student_id = u.user_id
      JOIN section s ON e.section_id = s.section_id
      WHERE e.student_id = $1;
    `;
        const { rows } = await pool.query(query, [student_id]);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Get enrollments by section ID with student details
router.get('/sections/:section_id/enrollments', verifyToken, async (req, res) => {
    const { section_id } = req.params;
    try {
        const query = `
      SELECT e.enrollment_id, e.student_id, u.username as student_username, u.first_name as student_first_name, u.last_name as student_last_name,
             e.section_id, s.section_name, s.room, s.capacity, e.semester, e.school_year, e.status
      FROM enrollment e
      JOIN "users" u ON e.student_id = u.user_id
      JOIN section s ON e.section_id = s.section_id
      WHERE e.section_id = $1;
    `;
        const { rows } = await pool.query(query, [section_id]);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Create a new enrollment
router.post('/enrollments', verifyToken, async (req, res) => {
    const { student_id, section_id, semester, school_year } = req.body;
    try {
        await pool.query('INSERT INTO enrollment (student_id, section_id, semester, school_year) VALUES ($1, $2, $3, $4)', [student_id, section_id, semester, school_year]);
        res.status(201).json({ message: 'Enrollment created successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Update an enrollment by ID
router.put('/enrollments/:enrollment_id', verifyToken, async (req, res) => {
    const { enrollment_id } = req.params;
    const { student_id, section_id, semester, school_year, status } = req.body;
    try {
        await pool.query('UPDATE enrollment SET student_id = $1, section_id = $2, semester = $3, school_year = $4, status = $5 WHERE enrollment_id = $6', [student_id, section_id, semester, school_year, status, enrollment_id]);
        res.json({ message: 'Enrollment updated successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Delete an enrollment by ID
router.delete('/enrollments/:enrollment_id', verifyToken, async (req, res) => {
    const { enrollment_id } = req.params;
    try {
        await pool.query('DELETE FROM enrollment WHERE enrollment_id = $1', [enrollment_id]);
        res.json({ message: 'Enrollment deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
