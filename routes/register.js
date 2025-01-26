const express = require('express');
const bcrypt = require('bcrypt');
const db = require('../server');
const router = express.Router();

router.post('/register', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required!' });
    }

    try {
        // Şifreyi hash'le
        const hashedPassword = await bcrypt.hash(password, 10);

        // Kullanıcıyı veritabanına ekle
        await db.query('INSERT INTO users (username, password) VALUES (?, ?)', [
            username,
            hashedPassword,
        ]);

        return res.status(201).json({ message: 'User registered successfully!' });
    } catch (error) {
        console.error('Error during registration:', error);
        return res.status(500).json({ error: 'An error occurred during registration.' });
    }
});

module.exports = router;
