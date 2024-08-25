const express = require('express');
const mysql = require('mysql');
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files
app.use(express.static('public'));

// Database connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'your_password',
    database: 'clique_db'
});

db.connect(err => {
    if (err) throw err;
    console.log('Database connected...');
});

// Signup route
app.post('/signup', (req, res) => {
    const { full_name, email, password } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 8);

    const sql = `INSERT INTO users (full_name, email, password) VALUES (?, ?, ?)`;
    db.query(sql, [full_name, email, hashedPassword], (err, result) => {
        if (err) return res.status(500).send('Server error');
        res.send('User registered successfully');
    });
});

// Login route
app.post('/login', (req, res) => {
    const { email, password } = req.body;

    const sql = `SELECT * FROM users WHERE email = ?`;
    db.query(sql, [email], (err, results) => {
        if (err) return res.status(500).send('Server error');
        if (results.length === 0) return res.status(404).send('User not found');

        const user = results[0];
        const passwordIsValid = bcrypt.compareSync(password, user.password);
        if (!passwordIsValid) return res.status(401).send('Invalid password');

        res.send('Login successful');
    });
});

// Start server
app.listen(3000, () => {
    console.log('Server running on port 3000');
});
