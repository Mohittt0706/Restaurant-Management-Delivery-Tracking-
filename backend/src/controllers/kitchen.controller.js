const kitchenService = require('../services/kitchen.service');

async function listKitchenOrders(req, res, next) {
  try {
    const orders = await kitchenService.listKitchenOrders();
    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    next(error);
  }
}

async function getKitchenOrder(req, res, next) {
  try {
    const order = await kitchenService.getKitchenOrder(req.params.id);
    res.status(200).json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
}

async function updateKitchenStatus(req, res, next) {
  try {
    const order = await kitchenService.updateKitchenStatus(req.params.id, req.body.status);
    res.status(200).json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  listKitchenOrders,
  getKitchenOrder,
  updateKitchenStatus,
};