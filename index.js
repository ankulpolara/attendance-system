require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const attendanceRoutes = require('./routes/attendanceRoutes');
const db = require('./config/db');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 1433;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Test database connection
if (db.pool) {
  db.getConnection()
    .then(connection => {
      console.log('Database connected successfully');
      connection.release();
    })
    .catch(err => {
      console.error('Database connection error:', err.message);
      console.log('API will run without database functionality');
    });
} else {
  console.log('Database connection not available, API will run with limited functionality');
}

// Routes
app.use('/api/v1', attendanceRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Employee Attendance API' });
});

app.get('/test', (req, res) => {
  res.json({ message: 'successfully done brother ggggggggggggggggggggggg'});
});

// Database status route
app.get('/api/status', async (req, res) => {
  try {
    if (!db.pool) {
      return res.status(503).json({
        success: false,
        message: 'Database connection not available',
        dbStatus: 'disconnected'
      });
    }
    
    const connection = await db.getConnection();
    connection.release();
    
    res.json({
      success: true,
      message: 'API is running correctly',
      dbStatus: 'connected'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'API is running but database connection failed',
      dbStatus: 'error',
      error: error.message
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
}); 