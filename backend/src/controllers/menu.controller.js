const menuService = require('../services/menu.service');

const getMenuItems = async (req, res, next) => {
  try {
    const { category, search, availableOnly } = req.query;
    const items = await menuService.getMenuItems({ category, search, availableOnly: availableOnly === 'true' });
    res.status(200).json({ success: true, data: items });
  } catch (err) {
    next(err);
  }
};

const getItemById = async (req, res, next) => {
  try {
    const item = await menuService.getItemById(req.params.id);
    res.status(200).json({ success: true, data: item });
  } catch (err) {
    next(err);
  }
};

const createMenuItem = async (req, res, next) => {
  try {
    const item = await menuService.createMenuItem(req.body);
    res.status(201).json({ success: true, data: item });
  } catch (err) {
    next(err);
  }
};

const updateMenuItem = async (req, res, next) => {
  try {
    const item = await menuService.updateMenuItem(req.params.id, req.body);
    res.status(200).json({ success: true, data: item });
  } catch (err) {
    next(err);
  }
};

const updateAvailability = async (req, res, next) => {
  try {
    const { availability } = req.body;
    const item = await menuService.updateAvailability(req.params.id, availability);
    res.status(200).json({ success: true, data: item });
  } catch (err) {
    next(err);
  }
};

const deleteMenuItem = async (req, res, next) => {
  try {
    await menuService.deleteMenuItem(req.params.id);
    res.status(200).json({ success: true, message: 'Menu item deleted successfully' });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getMenuItems,
  getItemById,
  createMenuItem,
  updateMenuItem,
  updateAvailability,
  deleteMenuItem,
};
