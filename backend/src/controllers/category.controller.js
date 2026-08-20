const menuService = require('../services/menu.service');

async function listCategories(req, res, next) {
  try {
    const categories = await menuService.listCategories();
    res.status(200).json({ success: true, data: categories });
  } catch (error) {
    next(error);
  }
}

async function createCategory(req, res, next) {
  try {
    const category = await menuService.createCategory(req.body);
    res.status(201).json({ success: true, data: category });
  } catch (error) {
    next(error);
  }
}

async function updateCategory(req, res, next) {
  try {
    const category = await menuService.updateCategory(req.params.id, req.body);
    res.status(200).json({ success: true, data: category });
  } catch (error) {
    next(error);
  }
}

async function deleteCategory(req, res, next) {
  try {
    const result = await menuService.deleteCategory(req.params.id);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  listCategories,
  createCategory,
  updateCategory,
  deleteCategory,
};