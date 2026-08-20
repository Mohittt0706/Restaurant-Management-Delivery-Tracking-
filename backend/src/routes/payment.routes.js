const express = require('express');

const paymentController = require('../controllers/payment.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { requireRole, ROLES } = require('../middleware/role.middleware');

const router = express.Router();

router.use(authenticate, requireRole(ROLES.ADMIN));

router.get('/', paymentController.listPayments);
router.get('/:id', paymentController.getPayment);

module.exports = router;