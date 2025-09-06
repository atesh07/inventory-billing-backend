require('dotenv').config({
  path: process.env.NODE_ENV === 'production' ? '.env' : '.env.local'
});
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');

const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const contactRoutes = require('./routes/contacts');
const transactionRoutes = require('./routes/transactions');
const reportRoutes = require('./routes/reports');
const { authRequired } = require('./middleware/auth');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Health check
app.get('/', (req, res) => res.json({ status: 'ok' }));

// MongoDB status check
app.get('/status', (req, res) => {
  let dbStatus;
  switch (mongoose.connection.readyState) {
    case 0: dbStatus = "disconnected"; break;
    case 1: dbStatus = "connected"; break;
    case 2: dbStatus = "connecting"; break;
    case 3: dbStatus = "disconnecting"; break;
    default: dbStatus = "unknown";
  }

  res.json({
    status: "ok",
    db: dbStatus,
    dbHost: mongoose.connection.host,
    dbName: mongoose.connection.name
  });
});

// Routes (auth routes are public)
app.use('/api', authRoutes);

// Protected routes
app.use('/api', authRequired, productRoutes);
app.use('/api', authRequired, contactRoutes);
app.use('/api', authRequired, transactionRoutes);
app.use('/api', authRequired, reportRoutes);

// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || 'Server error' });
});

const PORT = process.env.PORT || 4000;
const MONGODB_URI = process.env.MONGODB_URI;
console.log("📌 Mongo URI from .env:", MONGODB_URI);  // Debug line

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log("✅ Connected to MongoDB Atlas:", mongoose.connection.host);
  app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
})
.catch(err => {
  console.error("❌ MongoDB connection error:", err.message);
  process.exit(1);
});
