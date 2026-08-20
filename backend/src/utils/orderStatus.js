const ORDER_STATUSES = [
  'PENDING',
  'PLACED',
  'PREPARING',
  'READY',
  'ASSIGNED',
  'OUT_FOR_DELIVERY',
  'DELIVERED',
  'CANCELLED',
];

const KITCHEN_STATUSES = ['PENDING', 'PLACED', 'PREPARING', 'READY'];

function isOrderStatus(value) {
  return ORDER_STATUSES.includes(value);
}

module.exports = {
  ORDER_STATUSES,
  KITCHEN_STATUSES,
  isOrderStatus,
};