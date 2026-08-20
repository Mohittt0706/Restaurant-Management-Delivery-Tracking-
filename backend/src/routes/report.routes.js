const express = require('express');

const reportController = require('../controllers/report.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { requireRole, ROLES } = require('../middleware/role.middleware');

const router = express.Router();

router.use(authenticate, requireRole(ROLES.ADMIN));

router.get('/sales', reportController.salesReport);
router.get('/revenue', reportController.revenueReport);
router.get('/orders', reportController.ordersReport);
router.get('/delivery-performance', reportController.deliveryPerformanceReport);

module.exports = router;