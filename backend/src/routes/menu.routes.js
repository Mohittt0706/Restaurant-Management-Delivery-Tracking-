const express = require('express');

const menuController = require('../controllers/menu.controller');
const categoryController = require('../controllers/category.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { requireRole, ROLES } = require('../middleware/role.middleware');
const { validate } = require('../middleware/validation.middleware');
const { menuItemSchema, categorySchema } = require('../validators/menu.validator');

const router = express.Router();

const categoryRouter = express.Router();

categoryRouter.get('/', categoryController.listCategories);
categoryRouter.post('/', authenticate, requireRole(ROLES.ADMIN), validate(categorySchema), categoryController.createCategory);
categoryRouter.put('/:id', authenticate, requireRole(ROLES.ADMIN), validate(categorySchema), categoryController.updateCategory);
categoryRouter.delete('/:id', authenticate, requireRole(ROLES.ADMIN), categoryController.deleteCategory);

router.use('/categories', categoryRouter);

router.get('/', menuController.listMenu);
router.get('/:id', menuController.getMenu);

router.post('/', authenticate, requireRole(ROLES.ADMIN), validate(menuItemSchema), menuController.createMenu);
router.put('/:id', authenticate, requireRole(ROLES.ADMIN), validate(menuItemSchema), menuController.updateMenu);
router.delete('/:id', authenticate, requireRole(ROLES.ADMIN), menuController.deleteMenu);

module.exports = router;