const paymentService = require('../services/payment.service');

const createRazorpayOrder = async (req, res, next) => {
  try {
    const { orderId } = req.body;
    const result = await paymentService.createRazorpayOrder(orderId, req.user.id);
    res.status(200).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

const verifyRazorpayPayment = async (req, res, next) => {
  try {
    const result = await paymentService.verifyRazorpayPayment(req.body);
    res.status(200).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createRazorpayOrder,
  verifyRazorpayPayment,
};
