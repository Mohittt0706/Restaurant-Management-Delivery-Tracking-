const prisma = require('../config/prisma');
const { ApiError } = require('../middleware/error.middleware');
const { isOrderStatus } = require('../utils/orderStatus');

const ORDER_INCLUDE = {
  customer: { select: { id: true, name: true, email: true, phone: true } },
  items: true,
  payment: true,
  invoice: true,
  deliveryAssignment: { include: { partner: true } },
};

function serializeOrder(order) {
  if (!order) return null;
  return {
    ...order,
    subtotal: order.subtotal.toNumber(),
    tax: order.tax.toNumber(),
    deliveryFee: order.deliveryFee.toNumber(),
    total: order.total.toNumber(),
    items: (order.items || []).map((item) => ({
      ...item,
      price: item.price.toNumber(),
    })),
    payment: order.payment
      ? { ...order.payment, amount: order.payment.amount.toNumber() }
      : null,
  };
}

async function listOrders({ status, limit = 100, offset = 0 } = {}) {
  const where = {};
  if (status) {
    if (!isOrderStatus(status)) throw new ApiError(400, 'Invalid order status.');
    where.status = status;
  }

  const orders = await prisma.order.findMany({
    where,
    include: ORDER_INCLUDE,
    orderBy: { createdAt: 'desc' },
    take: Number(limit) || 100,
    skip: Number(offset) || 0,
  });

  return orders.map(serializeOrder);
}

async function getOrder(id) {
  const order = await prisma.order.findUnique({
    where: { id },
    include: ORDER_INCLUDE,
  });
  if (!order) throw new ApiError(404, 'Order not found.');
  return serializeOrder(order);
}

async function updateOrderStatus(id, status) {
  if (!isOrderStatus(status)) throw new ApiError(400, 'Invalid order status.');

  const existing = await prisma.order.findUnique({ where: { id } });
  if (!existing) throw new ApiError(404, 'Order not found.');

  const order = await prisma.order.update({
    where: { id },
    data: { status },
    include: ORDER_INCLUDE,
  });

  return serializeOrder(order);
}

module.exports = {
  listOrders,
  getOrder,
  updateOrderStatus,
  serializeOrder,
  ORDER_INCLUDE,
};