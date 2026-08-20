const express = require('express');
const router = express.Router();
const deliveryController = require('../controllers/delivery.controller');
const authMiddleware = require('../middleware/auth.middleware');
const roleMiddleware = require('../middleware/role.middleware');

router.use(authMiddleware);

// Delivery Partner Routes
router.get('/orders', roleMiddleware('DELIVERY'), deliveryController.getAssignedDeliveries);
router.patch('/:id/accept', roleMiddleware('DELIVERY'), deliveryController.acceptDelivery);
router.patch('/:id/pickup', roleMiddleware('DELIVERY'), deliveryController.pickupDelivery);
router.patch('/:id/out-for-delivery', roleMiddleware('DELIVERY'), deliveryController.outForDelivery);
router.patch('/:id/delivered', roleMiddleware('DELIVERY'), deliveryController.markDelivered);

module.exports = router;
