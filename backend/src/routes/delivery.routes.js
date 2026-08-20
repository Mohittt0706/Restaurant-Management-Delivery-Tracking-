const express = require('express');
const router = express.Router();
const deliveryController = require('../controllers/delivery.controller');
const authMiddleware = require('../middleware/auth.middleware');
const roleMiddleware = require('../middleware/role.middleware');

router.use(authMiddleware);

// Delivery Partner Dashboard
router.get('/dashboard', roleMiddleware('DELIVERY'), deliveryController.getDashboard);

// Delivery Partner Assigned Orders (order-id based)
router.get('/my-orders', roleMiddleware('DELIVERY'), deliveryController.getMyOrders);
router.get('/my-orders/:id', roleMiddleware('DELIVERY'), deliveryController.getMyOrderDetails);
router.patch('/my-orders/:id/accept', roleMiddleware('DELIVERY'), deliveryController.acceptMyDelivery);
router.patch('/my-orders/:id/pickup', roleMiddleware('DELIVERY'), deliveryController.pickupMyDelivery);
router.patch('/my-orders/:id/out-for-delivery', roleMiddleware('DELIVERY'), deliveryController.outForDeliveryMyDelivery);
router.patch('/my-orders/:id/deliver', roleMiddleware('DELIVERY'), deliveryController.deliverMyDelivery);
router.patch('/my-orders/:id/cod-payment', roleMiddleware('DELIVERY'), deliveryController.confirmCodPayment);

// Delivery Partner Active Delivery (Route & ETA)
router.get('/my-active', roleMiddleware('DELIVERY'), deliveryController.getMyActive);

// Existing Delivery Partner Routes (delivery-id based)
router.get('/orders', roleMiddleware('DELIVERY'), deliveryController.getAssignedDeliveries);
router.patch('/:id/accept', roleMiddleware('DELIVERY'), deliveryController.acceptDelivery);
router.patch('/:id/pickup', roleMiddleware('DELIVERY'), deliveryController.pickupDelivery);
router.patch('/:id/out-for-delivery', roleMiddleware('DELIVERY'), deliveryController.outForDelivery);
router.patch('/:id/delivered', roleMiddleware('DELIVERY'), deliveryController.markDelivered);
router.patch('/:id/cod-payment', roleMiddleware('DELIVERY'), deliveryController.confirmCodPayment);

// Manager Assign Delivery
router.post('/assign/:id', roleMiddleware('MANAGER'), deliveryController.assignDelivery);
router.post('/:id/assign', roleMiddleware('MANAGER'), deliveryController.assignDelivery);

module.exports = router;
