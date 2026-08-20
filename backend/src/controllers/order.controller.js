const orderService = require('../services/order.service');

async function listOrders(req, res, next) {
  try {
    const orders = await orderService.listOrders({
      status: req.query.status,
      limit: req.query.limit,
      offset: req.query.offset,
    });
    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    next(error);
  }
}

async function getOrder(req, res, next) {
  try {
    const order = await orderService.getOrder(req.params.id);
    res.status(200).json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
}

async function updateOrderStatus(req, res, next) {
  try {
    const order = await orderService.updateOrderStatus(req.params.id, req.body.status);
    res.status(200).json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  listOrders,
  getOrder,
  updateOrderStatus,
};