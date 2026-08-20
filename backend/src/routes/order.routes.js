const express = require('express');

const orderController = require('../controllers/order.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { requireRole, ROLES } = require('../middleware/role.middleware');
const { validate } = require('../middleware/validation.middleware');
const { orderStatusSchema } = require('../validators/order.validator');

const router = express.Router();

router.use(authenticate, requireRole(ROLES.ADMIN));

router.get('/', orderController.listOrders);
router.get('/:id', orderController.getOrder);
router.patch('/:id/status', validate(orderStatusSchema), orderController.updateOrderStatus);

module.exports = router;