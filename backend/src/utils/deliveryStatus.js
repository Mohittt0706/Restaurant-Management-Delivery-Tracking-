const DELIVERY_STATUSES = ['ASSIGNED', 'PICKED_UP', 'OUT_FOR_DELIVERY', 'DELIVERED'];

function isDeliveryStatus(value) {
  return DELIVERY_STATUSES.includes(value);
}

module.exports = {
  DELIVERY_STATUSES,
  isDeliveryStatus,
};