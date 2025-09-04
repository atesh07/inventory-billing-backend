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
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/inventory_billing';

mongoose.connect(MONGODB_URI).then(() => {
  console.log('MongoDB connected');
  app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
}).catch(err => {
  console.error('MongoDB connection error:', err.message);
  process.exit(1);
});
