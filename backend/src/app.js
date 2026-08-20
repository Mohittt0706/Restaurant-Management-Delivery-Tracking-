const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth.routes');
const customerRoutes = require('./routes/customer.routes');
const menuRoutes = require('./routes/menu.routes');
const categoryRoutes = require('./routes/category.routes');
const cartRoutes = require('./routes/cart.routes');
const orderRoutes = require('./routes/order.routes');
const kitchenRoutes = require('./routes/kitchen.routes');
const deliveryRoutes = require('./routes/delivery.routes');
const paymentRoutes = require('./routes/payment.routes');
const invoiceRoutes = require('./routes/invoice.routes');
const inventoryRoutes = require('./routes/inventory.routes');
const staffRoutes = require('./routes/staff.routes');
const managerRoutes = require('./routes/manager.routes');
const reportRoutes = require('./routes/report.routes');
const mapsRoutes = require('./routes/maps.routes');
const weatherRoutes = require('./routes/weather.routes');

const errorMiddleware = require('./middleware/error.middleware');

const app = express();

app.use(cors());
app.use(express.json());

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'UP', message: 'Cult Restaurant Backend is healthy', timestamp: new Date() });
});

// API Routes (with singular and plural aliases for full compatibility)
app.use('/api/auth', authRoutes);
app.use('/api/customer', customerRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/category', categoryRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/order', orderRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/kitchen', kitchenRoutes);
app.use('/api/delivery', deliveryRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/invoice', invoiceRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/staff', staffRoutes);
app.use('/api/manager', managerRoutes);
app.use('/api/report', reportRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/maps', mapsRoutes);
app.use('/api/weather', weatherRoutes);

// Error Middleware
app.use(errorMiddleware);

module.exports = app;
