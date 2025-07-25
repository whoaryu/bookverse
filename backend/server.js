const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./src/utils/db');
const authRoutes = require('./src/routes/auth');
const bookRoutes = require('./src/routes/books');
const reviewRoutes = require('./src/routes/reviews');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/books/:id/reviews', reviewRoutes);

// Test route
app.get('/api/ping', (req, res) => {
  res.json({ message: 'pong' });
});

// Connect to DB and start server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}); 