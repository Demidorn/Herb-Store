require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const herbRoutes = require('./routes/herbRoutes');
const { errorHandler } = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 5000;

// Define allowed origins
const allowedOrigins = [
  'http://localhost:3000',
  'https://herb-store-theta.vercel.app', // Your live Vercel URL
  process.env.FRONTEND_URL // Fallback to env variable if set
].filter(Boolean); // This removes any 'undefined' values from the array

// Middleware
app.use(helmet());
app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.json({ 
    message: '🌿 Herb Encyclopedia API is running!',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      herbs: '/api/herbs'
    }
  });
});

// Also handle HEAD requests (what Render uses)
app.head('/', (req, res) => {
  res.status(200).end();
});

// Routes
app.use('/api/herbs', herbRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🌿 Server running on port ${PORT}`);
});