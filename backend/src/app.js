const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const leaveRoutes = require('./routes/leaveRoutes');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.json({ message: 'Leave Management API is operational' });
});

app.use('/api/auth', authRoutes);
app.use('/api/leaves', leaveRoutes);

app.use((req, res) => {
  res.status(404).json({ message: 'Requested resource not found' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'production' ? {} : err.message
  });
});

module.exports = app;
