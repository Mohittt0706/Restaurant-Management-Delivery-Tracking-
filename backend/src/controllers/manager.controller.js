const reportService = require('../services/report.service');
const deliveryService = require('../services/delivery.service');

const getDashboardData = async (req, res, next) => {
  try {
    const data = await reportService.getDashboardData();
    res.status(200).json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

const getManagerOrders = async (req, res, next) => {
  try {
    const orders = await reportService.getManagerOrders(req.query.status);
    res.status(200).json({ success: true, data: orders });
  } catch (err) {
    next(err);
  }
};

const getDeliveryPartners = async (req, res, next) => {
  try {
    const partners = await deliveryService.getDeliveryPartners();
    res.status(200).json({ success: true, data: partners });
  } catch (err) {
    next(err);
  }
};

const assignDelivery = async (req, res, next) => {
  try {
    const { deliveryPartnerId } = req.body;
    const delivery = await deliveryService.assignDelivery(req.params.id, deliveryPartnerId, req.user.id);
    res.status(200).json({ success: true, data: delivery });
  } catch (err) {
    next(err);
  }
};

const createDeliveryPartner = async (req, res, next) => {
  try {
    const partner = await deliveryService.createDeliveryPartner(req.body);
    res.status(201).json({ success: true, data: partner });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getDashboardData,
  getManagerOrders,
  getDeliveryPartners,
  assignDelivery,
  createDeliveryPartner,
};
