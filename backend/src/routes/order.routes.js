const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.controller');
const authMiddleware = require('../middleware/auth.middleware');
const roleMiddleware = require('../middleware/role.middleware');

router.use(authMiddleware);

// Allow any authenticated user (Customer, Manager, Kitchen, Delivery) to place, view, track, or cancel their own orders
router.post('/', orderController.createOrder);
router.get('/my', orderController.getMyOrders);
router.get('/:id/tracking', orderController.getOrderTracking);
router.get('/:id', orderController.getOrderById);
router.patch('/:id/cancel', orderController.cancelOrder);

// Only Manager can manually override order status via this endpoint
router.patch('/:id/status', roleMiddleware('MANAGER'), orderController.updateOrderStatus);

module.exports = router;
