const inventoryService = require('../services/inventory.service');

const getInventory = async (req, res, next) => {
  try {
    const list = await inventoryService.getInventoryList();
    res.status(200).json({ success: true, data: list });
  } catch (err) {
    next(err);
  }
};

const createInventoryItem = async (req, res, next) => {
  try {
    const item = await inventoryService.createInventoryItem(req.body);
    res.status(201).json({ success: true, data: item });
  } catch (err) {
    next(err);
  }
};

const updateInventoryItem = async (req, res, next) => {
  try {
    const item = await inventoryService.updateInventoryItem(req.params.id, req.body);
    res.status(200).json({ success: true, data: item });
  } catch (err) {
    next(err);
  }
};

const deleteInventoryItem = async (req, res, next) => {
  try {
    await inventoryService.deleteInventoryItem(req.params.id);
    res.status(200).json({ success: true, message: 'Inventory item deleted successfully' });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getInventory,
  createInventoryItem,
  updateInventoryItem,
  deleteInventoryItem,
};
