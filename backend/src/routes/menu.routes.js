const express = require('express');
const router = express.Router();
const menuController = require('../controllers/menu.controller');
const authMiddleware = require('../middleware/auth.middleware');
const roleMiddleware = require('../middleware/role.middleware');

// Public routes
router.get('/', menuController.getMenuItems);
router.get('/:id', menuController.getItemById);

// Manager-only routes
router.post('/', authMiddleware, roleMiddleware('MANAGER'), menuController.createMenuItem);
router.put('/:id', authMiddleware, roleMiddleware('MANAGER'), menuController.updateMenuItem);
router.patch('/:id/availability', authMiddleware, roleMiddleware('MANAGER'), menuController.updateAvailability);
router.delete('/:id', authMiddleware, roleMiddleware('MANAGER'), menuController.deleteMenuItem);

module.exports = router;
