const kitchenService = require('../services/kitchen.service');

const getNewOrders = async (req, res, next) => {
  try {
    const orders = await kitchenService.getNewOrders();
    res.status(200).json({ success: true, data: orders });
  } catch (err) {
    next(err);
  }
};

const getPreparingOrders = async (req, res, next) => {
  try {
    const orders = await kitchenService.getPreparingOrders();
    res.status(200).json({ success: true, data: orders });
  } catch (err) {
    next(err);
  }
};

const getReadyOrders = async (req, res, next) => {
  try {
    const orders = await kitchenService.getReadyOrders();
    res.status(200).json({ success: true, data: orders });
  } catch (err) {
    next(err);
  }
};

const getKitchenOrderById = async (req, res, next) => {
  try {
    const order = await kitchenService.getKitchenOrderById(req.params.id);
    res.status(200).json({ success: true, data: order });
  } catch (err) {
    next(err);
  }
};

const acceptOrder = async (req, res, next) => {
  try {
    const order = await kitchenService.acceptOrder(req.params.id, req.user.id);
    res.status(200).json({ success: true, data: order });
  } catch (err) {
    next(err);
  }
};

const markReady = async (req, res, next) => {
  try {
    const order = await kitchenService.markReady(req.params.id, req.user.id);
    res.status(200).json({ success: true, data: order });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getNewOrders,
  getPreparingOrders,
  getReadyOrders,
  getKitchenOrderById,
  acceptOrder,
  markReady,
};
