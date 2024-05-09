const express = require('express');
const pool = require('../db_conn');
const userinfo = require('../db_query/userinfo');

const user = pool.userinfo;

const authenticateUser = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;
        const query = 'SELECT * FROM userinfo WHERE username = $1 AND email = $2 AND password = $3';
        const result = await pool.query(query, [username, email, password]);

        if (result.rows.length > 0) {
            req.user = result.rows[0];
            next();
        } else {
            res.status(401).json({ error: 'Unauthorized' });
        }
    } catch (error) {
        console.error('Authentication error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = authenticateUser;
