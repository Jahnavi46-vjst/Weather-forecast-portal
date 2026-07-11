const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS and JSON parsing middleware
app.use(cors());
app.use(express.json());

// Serve static frontend files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Connect to SQLite Database (creates file if it doesn't exist)
const db = new sqlite3.Database(path.join(__dirname, 'database.sqlite'), (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to the SQLite database.');
    initializeDatabase();
  }
});

// Initialize database schema
function initializeDatabase() {
  db.serialize(() => {
    // Create the table to store user settings
    db.run(`
      CREATE TABLE IF NOT EXISTS user_settings (
        id INTEGER PRIMARY KEY CHECK (id = 1),
        temp_unit TEXT DEFAULT 'C',
        theme TEXT DEFAULT 'dark',
        favorite_city TEXT DEFAULT ''
      )
    `, (err) => {
      if (err) {
        console.error('Error creating table:', err.message);
        return;
      }

      // Pre-populate with default settings if the table is empty
      db.get('SELECT COUNT(*) as count FROM user_settings', [], (err, row) => {
        if (err) {
          console.error('Error checking user_settings row count:', err.message);
          return;
        }
        if (row.count === 0) {
          db.run(
            'INSERT INTO user_settings (id, temp_unit, theme, favorite_city) VALUES (1, ?, ?, ?)',
            ['C', 'dark', 'London'],
            (err) => {
              if (err) console.error('Error inserting default settings:', err.message);
              else console.log('Default settings initialized.');
            }
          );
        }
      });
    });
  });
}

// API Routes

// 1. Get user settings
app.get('/api/settings', (req, res) => {
  db.get('SELECT temp_unit, theme, favorite_city FROM user_settings WHERE id = 1', [], (err, row) => {
    if (err) {
      console.error('Error fetching settings:', err.message);
      return res.status(500).json({ error: 'Database read failed' });
    }
    // Return row or default if not found
    res.json(row || { temp_unit: 'C', theme: 'dark', favorite_city: 'London' });
  });
});

// 2. Update user settings
app.post('/api/settings', (req, res) => {
  const { temp_unit, theme, favorite_city } = req.body;
  
  // Basic validation
  if (!temp_unit || !theme) {
    return res.status(400).json({ error: 'temp_unit and theme are required fields' });
  }

  db.run(
    `INSERT OR REPLACE INTO user_settings (id, temp_unit, theme, favorite_city)
     VALUES (1, ?, ?, ?)`,
    [temp_unit, theme, favorite_city || ''],
    function (err) {
      if (err) {
        console.error('Error updating settings:', err.message);
        return res.status(500).json({ error: 'Database update failed' });
      }
      res.json({ message: 'Settings saved successfully', settings: { temp_unit, theme, favorite_city } });
    }
  );
});

// Start Express Server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
