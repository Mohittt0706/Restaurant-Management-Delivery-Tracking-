const paymentService = require('../services/payment.service');

async function listPayments(req, res, next) {
  try {
    const payments = await paymentService.listPayments({ status: req.query.status });
    res.status(200).json({ success: true, data: payments });
  } catch (error) {
    next(error);
  }
}

async function getPayment(req, res, next) {
  try {
    const payment = await paymentService.getPayment(req.params.id);
    res.status(200).json({ success: true, data: payment });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  listPayments,
  getPayment,
};