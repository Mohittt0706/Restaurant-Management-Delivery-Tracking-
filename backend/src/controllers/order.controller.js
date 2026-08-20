const orderService = require('../services/order.service');

const createOrder = async (req, res, next) => {
  try {
    const order = await orderService.createOrder(req.user.id, req.body);
    res.status(201).json({ success: true, data: order });
  } catch (err) {
    next(err);
  }
};

const getMyOrders = async (req, res, next) => {
  try {
    const orders = await orderService.getMyOrders(req.user.id);
    res.status(200).json({ success: true, data: orders });
  } catch (err) {
    next(err);
  }
};

const getOrderById = async (req, res, next) => {
  try {
    const order = await orderService.getOrderById(req.params.id, req.user.role === 'CUSTOMER' ? req.user.id : null);
    res.status(200).json({ success: true, data: order });
  } catch (err) {
    next(err);
  }
};

const cancelOrder = async (req, res, next) => {
  try {
    const order = await orderService.cancelOrder(req.params.id, req.user.id);
    res.status(200).json({ success: true, data: order });
  } catch (err) {
    next(err);
  }
};

const getOrderTracking = async (req, res, next) => {
  try {
    const tracking = await orderService.getOrderTracking(req.params.id, req.user.id);
    res.status(200).json({ success: true, data: tracking });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
  cancelOrder,
  getOrderTracking,
};
