const express = require('express');

const managerController = require('../controllers/manager.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { requireRole, ROLES } = require('../middleware/role.middleware');

const router = express.Router();

router.use(authenticate, requireRole(ROLES.ADMIN));

router.get('/dashboard', managerController.getDashboard);

module.exports = router;