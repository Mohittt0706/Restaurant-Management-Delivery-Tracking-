const deliveryService = require('../services/delivery.service');

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

const getAssignedDeliveries = async (req, res, next) => {
  try {
    const deliveries = await deliveryService.getAssignedDeliveries(req.user.id);
    res.status(200).json({ success: true, data: deliveries });
  } catch (err) {
    next(err);
  }
};

const acceptDelivery = async (req, res, next) => {
  try {
    const delivery = await deliveryService.updateDeliveryStatus(req.params.id, req.user.id, 'ACCEPTED');
    res.status(200).json({ success: true, data: delivery });
  } catch (err) {
    next(err);
  }
};

const pickupDelivery = async (req, res, next) => {
  try {
    const delivery = await deliveryService.updateDeliveryStatus(req.params.id, req.user.id, 'PICKED_UP');
    res.status(200).json({ success: true, data: delivery });
  } catch (err) {
    next(err);
  }
};

const outForDelivery = async (req, res, next) => {
  try {
    const delivery = await deliveryService.updateDeliveryStatus(req.params.id, req.user.id, 'OUT_FOR_DELIVERY');
    res.status(200).json({ success: true, data: delivery });
  } catch (err) {
    next(err);
  }
};

const markDelivered = async (req, res, next) => {
  try {
    const delivery = await deliveryService.updateDeliveryStatus(req.params.id, req.user.id, 'DELIVERED');
    res.status(200).json({ success: true, data: delivery });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getDeliveryPartners,
  assignDelivery,
  getAssignedDeliveries,
  acceptDelivery,
  pickupDelivery,
  outForDelivery,
  markDelivered,
};
