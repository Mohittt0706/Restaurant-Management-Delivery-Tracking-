const express = require('express');
const router = express.Router();
const kitchenController = require('../controllers/kitchen.controller');
const authMiddleware = require('../middleware/auth.middleware');
const roleMiddleware = require('../middleware/role.middleware');

router.use(authMiddleware);
router.use(roleMiddleware('KITCHEN', 'MANAGER'));

router.get('/orders', kitchenController.getActiveOrders);
router.patch('/orders/:id/accept', kitchenController.acceptOrder);
router.patch('/orders/:id/preparing', kitchenController.markPreparing);
router.patch('/orders/:id/ready', kitchenController.markReady);

module.exports = router;
