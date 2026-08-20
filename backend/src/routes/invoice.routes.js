const express = require('express');

const invoiceController = require('../controllers/invoice.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { requireRole, ROLES } = require('../middleware/role.middleware');

const router = express.Router();

router.use(authenticate, requireRole(ROLES.ADMIN));

router.get('/', invoiceController.listInvoices);
router.get('/:id', invoiceController.getInvoice);

module.exports = router;