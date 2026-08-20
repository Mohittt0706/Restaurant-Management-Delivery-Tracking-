const express = require('express');
const cors = require('cors');

const env = require('./config/env');
const authRoutes = require('./routes/auth.routes');
const customerRoutes = require('./routes/customer.routes');
const { notFoundHandler, errorHandler } = require('./middleware/error.middleware');

const app = express();

app.use(cors({
  origin: env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));

app.use(express.json());

app.get('/health', (req, res) => {
  res.status(200).json({ success: true, data: { status: 'ok' } });
});

app.use('/api/auth', authRoutes);
app.use('/api/customer', customerRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;