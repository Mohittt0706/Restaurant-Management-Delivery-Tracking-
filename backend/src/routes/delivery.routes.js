const express = require('express');

const deliveryController = require('../controllers/delivery.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { requireRole, ROLES } = require('../middleware/role.middleware');
const { validate } = require('../middleware/validation.middleware');
const { assignSchema, partnerSchema, deliveryStatusSchema } = require('../validators/delivery.validator');

const router = express.Router();

router.use(authenticate, requireRole(ROLES.ADMIN));

router.get('/ready', deliveryController.getReadyOrders);
router.get('/unassigned', deliveryController.getUnassignedOrders);
router.get('/partners', deliveryController.listPartners);
router.post('/partners', validate(partnerSchema), deliveryController.createPartner);
router.post('/assign', validate(assignSchema), deliveryController.assignPartner);
router.get('/active', deliveryController.getActiveDeliveries);
router.patch('/:id/status', validate(deliveryStatusSchema), deliveryController.updateDeliveryStatus);

module.exports = router;