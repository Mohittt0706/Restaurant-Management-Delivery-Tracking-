const menuService = require('../services/menu.service');

async function listMenu(req, res, next) {
  try {
    const items = await menuService.listMenu(req.query);
    res.status(200).json({ success: true, data: items });
  } catch (error) {
    next(error);
  }
}

async function getMenu(req, res, next) {
  try {
    const item = await menuService.getMenu(req.params.id);
    res.status(200).json({ success: true, data: item });
  } catch (error) {
    next(error);
  }
}

async function createMenu(req, res, next) {
  try {
    const item = await menuService.createMenu(req.body);
    res.status(201).json({ success: true, data: item });
  } catch (error) {
    next(error);
  }
}

async function updateMenu(req, res, next) {
  try {
    const item = await menuService.updateMenu(req.params.id, req.body);
    res.status(200).json({ success: true, data: item });
  } catch (error) {
    next(error);
  }
}

async function deleteMenu(req, res, next) {
  try {
    const result = await menuService.deleteMenu(req.params.id);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  listMenu,
  getMenu,
  createMenu,
  updateMenu,
  deleteMenu,
};