const express = require('express');

const kitchenController = require('../controllers/kitchen.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { requireRole, ROLES } = require('../middleware/role.middleware');
const { validate } = require('../middleware/validation.middleware');
const { orderStatusSchema } = require('../validators/order.validator');

const router = express.Router();

router.use(authenticate, requireRole(ROLES.ADMIN));

router.get('/orders', kitchenController.listKitchenOrders);
router.get('/orders/:id', kitchenController.getKitchenOrder);
router.patch('/orders/:id/status', validate(orderStatusSchema), kitchenController.updateKitchenStatus);

module.exports = router;