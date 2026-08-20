const express = require('express');
const router = express.Router();
const reportController = require('../controllers/report.controller');
const authMiddleware = require('../middleware/auth.middleware');
const roleMiddleware = require('../middleware/role.middleware');

router.use(authMiddleware);
router.use(roleMiddleware('MANAGER'));

router.get('/sales', reportController.getSalesReport);
router.get('/revenue', reportController.getRevenueReport);
router.get('/orders', reportController.getOrdersReport);
router.get('/delivery-performance', reportController.getDeliveryPerformanceReport);

module.exports = router;
