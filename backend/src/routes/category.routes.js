const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/category.controller');
const authMiddleware = require('../middleware/auth.middleware');
const roleMiddleware = require('../middleware/role.middleware');

// Public routes
router.get('/', categoryController.getCategories);

// Manager-only routes
router.post('/', authMiddleware, roleMiddleware('MANAGER'), categoryController.createCategory);
router.put('/:id', authMiddleware, roleMiddleware('MANAGER'), categoryController.updateCategory);
router.delete('/:id', authMiddleware, roleMiddleware('MANAGER'), categoryController.deleteCategory);

module.exports = router;
