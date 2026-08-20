const express = require('express');
const router = express.Router();
const invoiceController = require('../controllers/invoice.controller');
const authMiddleware = require('../middleware/auth.middleware');
const roleMiddleware = require('../middleware/role.middleware');

router.use(authMiddleware);

router.get('/', roleMiddleware('MANAGER'), invoiceController.listInvoices);
router.get('/:orderId', invoiceController.getInvoice);

module.exports = router;
