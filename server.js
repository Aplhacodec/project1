const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

// Middleware setup
app.use(bodyParser.json()); // Parse JSON bodies
app.use(cors()); // Enable CORS for frontend-backend communication

// MySQL Database Configuration
const db = mysql.createConnection({
  host: 'localhost',       // MySQL server host
  user: 'root',            // Your MySQL username
  password: 'kinshu', // REPLACE WITH YOUR MYSQL PASSWORD
  database: 'hospital_db'  // Your database name
});

// Connect to MySQL
db.connect((err) => {
  if (err) {
    console.error('❌ Error connecting to MySQL:', err.stack);
    return;
  }
  console.log('✅ Connected to MySQL database');
});

// ------------------------
// USER REGISTRATION ROUTE
// ------------------------
app.post('/register', (req, res) => {
  const { mobile, password } = req.body;

  // Validate input
  if (!mobile || !password) {
    return res.status(400).json({ 
      error: 'Mobile number and password are required' 
    });
  }

  // Check if user already exists
  const checkUserQuery = 'SELECT * FROM users WHERE mobile = ?';
  db.query(checkUserQuery, [mobile], (err, results) => {
    if (err) {
      console.error('🔥 Database error:', err);
      return res.status(500).json({ error: 'Database error' });
    }

    if (results.length > 0) {
      return res.status(409).json({ error: 'User already exists' });
    }

    // Insert new user
    const insertUserQuery = 'INSERT INTO users (mobile, password) VALUES (?, ?)';
    db.query(insertUserQuery, [mobile, password], (err, result) => {
      if (err) {
        console.error('🔥 Insert error:', err);
        return res.status(500).json({ error: 'Failed to register user' });
      }
      
      res.status(201).json({ 
        message: 'User registered successfully!',
        userId: result.insertId
      });
    });
  });
});

// --------------------
// USER LOGIN ROUTE
// --------------------
app.post('/login', (req, res) => {
  const { mobile, password } = req.body;

  // Validate input
  if (!mobile || !password) {
    return res.status(400).json({ 
      error: 'Mobile number and password are required' 
    });
  }

  // Find user in database
  const loginUserQuery = 'SELECT * FROM users WHERE mobile = ? AND password = ?';
  db.query(loginUserQuery, [mobile, password], (err, results) => {
    if (err) {
      console.error('🔥 Database error:', err);
      return res.status(500).json({ error: 'Database error' });
    }

    if (results.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Successful login
    res.status(200).json({ 
      message: 'Login successful!',
      user: results[0] // Return user data (exclude sensitive info in production)
    });
  });
});

// --------------------
// START SERVER
// --------------------
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});