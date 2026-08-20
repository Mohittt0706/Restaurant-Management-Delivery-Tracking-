const deliveryService = require('../services/delivery.service');

async function getReadyOrders(req, res, next) {
  try {
    const orders = await deliveryService.getReadyOrders();
    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    next(error);
  }
}

async function getUnassignedOrders(req, res, next) {
  try {
    const orders = await deliveryService.getUnassignedOrders();
    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    next(error);
  }
}

async function listPartners(req, res, next) {
  try {
    const partners = await deliveryService.listPartners();
    res.status(200).json({ success: true, data: partners });
  } catch (error) {
    next(error);
  }
}

async function createPartner(req, res, next) {
  try {
    const partner = await deliveryService.createPartner(req.body);
    res.status(201).json({ success: true, data: partner });
  } catch (error) {
    next(error);
  }
}

async function assignPartner(req, res, next) {
  try {
    const assignment = await deliveryService.assignPartner(req.body.orderId, req.body.partnerId);
    res.status(200).json({ success: true, data: assignment });
  } catch (error) {
    next(error);
  }
}

async function getActiveDeliveries(req, res, next) {
  try {
    const deliveries = await deliveryService.getActiveDeliveries();
    res.status(200).json({ success: true, data: deliveries });
  } catch (error) {
    next(error);
  }
}

async function updateDeliveryStatus(req, res, next) {
  try {
    const delivery = await deliveryService.updateDeliveryStatus(req.params.id, req.body.status);
    res.status(200).json({ success: true, data: delivery });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getReadyOrders,
  getUnassignedOrders,
  listPartners,
  createPartner,
  assignPartner,
  getActiveDeliveries,
  updateDeliveryStatus,
};