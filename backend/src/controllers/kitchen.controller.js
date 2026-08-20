const kitchenService = require('../services/kitchen.service');

const getActiveOrders = async (req, res, next) => {
  try {
    const orders = await kitchenService.getActiveOrders();
    res.status(200).json({ success: true, data: orders });
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

const markPreparing = async (req, res, next) => {
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
  getActiveOrders,
  acceptOrder,
  markPreparing,
  markReady,
};
