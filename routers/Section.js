const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const pool = require('../database/db'); // Assuming your database connection
const { generateToken, verifyToken } = require('../auth/auth'); // Importing authentication functions

// Get all sections with subject and teacher details
router.get('/sections', verifyToken, async (req, res) => {
    try {
        const query = `
      SELECT s.section_id, s.section_name, s.room, s.capacity, s.is_archived,
             sub.subject_id, sub.subject_code, sub.subject_description, sub.subject_schedule, sub.subject_units,
             u.user_id as teacher_id, u.username as teacher_username, u.first_name as teacher_first_name, u.last_name as teacher_last_name
      FROM section s
      JOIN subject sub ON s.subject_id = sub.subject_id
      JOIN "users" u ON s.teacher_id = u.user_id;
    `;
        const { rows } = await pool.query(query);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Get a specific section by ID with subject and teacher details
router.get('/sections/:section_id', verifyToken, async (req, res) => {
    const { section_id } = req.params;
    try {
        const query = `
      SELECT s.section_id, s.section_name, s.room, s.capacity, s.is_archived,
             sub.subject_id, sub.subject_code, sub.subject_description, sub.subject_schedule, sub.subject_units,
             u.user_id as teacher_id, u.username as teacher_username, u.first_name as teacher_first_name, u.last_name as teacher_last_name
      FROM section s
      JOIN subject sub ON s.subject_id = sub.subject_id
      JOIN "users" u ON s.teacher_id = u.user_id
      WHERE s.section_id = $1;
    `;
        const { rows } = await pool.query(query, [section_id]);
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Create a new section
router.post('/sections', verifyToken, async (req, res) => {
    const { section_name, subject_id, teacher_id, room, capacity } = req.body;
    try {
        await pool.query('INSERT INTO section (section_name, subject_id, teacher_id, room, capacity) VALUES ($1, $2, $3, $4, $5)', [section_name, subject_id, teacher_id, room, capacity]);
        res.status(201).json({ message: 'Section created successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Update a section by ID
router.put('/sections/:section_id', verifyToken, async (req, res) => {
    const { section_id } = req.params;
    const { section_name, subject_id, teacher_id, room, capacity } = req.body;
    try {
        await pool.query('UPDATE section SET section_name = $1, subject_id = $2, teacher_id = $3, room = $4, capacity = $5 WHERE section_id = $6', [section_name, subject_id, teacher_id, room, capacity, section_id]);
        res.json({ message: 'Section updated successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Delete a section by ID
router.delete('/sections/:section_id', verifyToken, async (req, res) => {
    const { section_id } = req.params;
    try {
        await pool.query('DELETE FROM section WHERE section_id = $1', [section_id]);
        res.json({ message: 'Section deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Archive a section by ID
router.put('/sections/:section_id/archive', verifyToken, async (req, res) => {
    const { section_id } = req.params;
    try {
        await pool.query('UPDATE section SET is_archived = TRUE WHERE section_id = $1', [section_id]);
        res.json({ message: 'Section archived successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Get archived sections
router.get('/sections/archived', verifyToken, async (req, res) => {
    try {
        const query = `
      SELECT s.section_id, s.section_name, s.room, s.capacity, s.is_archived,
             sub.subject_id, sub.subject_code, sub.subject_description, sub.subject_schedule, sub.subject_units,
             u.user_id as teacher_id, u.username as teacher_username, u.first_name as teacher_first_name, u.last_name as teacher_last_name
      FROM section s
      JOIN subject sub ON s.subject_id = sub.subject_id
      JOIN "users" u ON s.teacher_id = u.user_id
      WHERE s.is_archived = TRUE;
    `;
        const { rows } = await pool.query(query);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Get active sections
router.get('/sections/active', verifyToken, async (req, res) => {
    try {
        const query = `
      SELECT s.section_id, s.section_name, s.room, s.capacity, s.is_archived,
             sub.subject_id, sub.subject_code, sub.subject_description, sub.subject_schedule, sub.subject_units,
             u.user_id as teacher_id, u.username as teacher_username, u.first_name as teacher_first_name, u.last_name as teacher_last_name
      FROM section s
      JOIN subject sub ON s.subject_id = sub.subject_id
      JOIN "users" u ON s.teacher_id = u.user_id
      WHERE s.is_archived = FALSE;
    `;
        const { rows } = await pool.query(query);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
