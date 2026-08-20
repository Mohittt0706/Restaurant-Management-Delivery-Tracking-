const express = require('express');
const router = express.Router();
const kitchenController = require('../controllers/kitchen.controller');
const authMiddleware = require('../middleware/auth.middleware');
const roleMiddleware = require('../middleware/role.middleware');

router.use(authMiddleware);
router.use(roleMiddleware('KITCHEN', 'MANAGER'));

router.get('/orders/new', kitchenController.getNewOrders);
router.get('/orders/preparing', kitchenController.getPreparingOrders);
router.get('/orders/ready', kitchenController.getReadyOrders);
router.get('/orders/:id', kitchenController.getKitchenOrderById);

router.patch('/orders/:id/accept', kitchenController.acceptOrder);
router.patch('/orders/:id/ready', kitchenController.markReady);

module.exports = router;
