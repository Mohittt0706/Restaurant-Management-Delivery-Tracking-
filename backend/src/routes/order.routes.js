const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.controller');
const authMiddleware = require('../middleware/auth.middleware');
const roleMiddleware = require('../middleware/role.middleware');

router.use(authMiddleware);

router.post('/', roleMiddleware('CUSTOMER'), orderController.createOrder);
router.get('/my', roleMiddleware('CUSTOMER'), orderController.getMyOrders);
router.get('/:id/tracking', roleMiddleware('CUSTOMER'), orderController.getOrderTracking);
router.get('/:id', orderController.getOrderById);
router.patch('/:id/status', roleMiddleware('MANAGER'), orderController.updateOrderStatus);
router.patch('/:id/cancel', roleMiddleware('CUSTOMER'), orderController.cancelOrder);

module.exports = router;
