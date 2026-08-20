const express = require('express');
const router = express.Router();
const managerController = require('../controllers/manager.controller');
const authMiddleware = require('../middleware/auth.middleware');
const roleMiddleware = require('../middleware/role.middleware');

router.use(authMiddleware);
router.use(roleMiddleware('MANAGER'));

router.get('/dashboard', managerController.getDashboardData);
router.get('/orders', managerController.getManagerOrders);
router.get('/delivery-partners', managerController.getDeliveryPartners);
router.post('/deliveries/:id/assign', managerController.assignDelivery);

module.exports = router;
