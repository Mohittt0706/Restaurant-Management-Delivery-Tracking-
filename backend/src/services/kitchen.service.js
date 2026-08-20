const prisma = require('../config/prisma');
const { ApiError } = require('../middleware/error.middleware');
const { KITCHEN_STATUSES } = require('../utils/orderStatus');
const { serializeOrder, ORDER_INCLUDE } = require('./order.service');

function withPreparationTime(order) {
  const start = order.createdAt.getTime();
  const end = order.status === 'READY' ? order.updatedAt.getTime() : Date.now();
  return {
    ...order,
    preparationMinutes: Math.max(0, Math.round((end - start) / 60000)),
  };
}

async function listKitchenOrders() {
  const orders = await prisma.order.findMany({
    where: { status: { in: KITCHEN_STATUSES } },
    include: ORDER_INCLUDE,
    orderBy: { createdAt: 'asc' },
  });

  return orders.map((o) => withPreparationTime(serializeOrder(o)));
}

async function getKitchenOrder(id) {
  const order = await prisma.order.findUnique({
    where: { id },
    include: ORDER_INCLUDE,
  });
  if (!order) throw new ApiError(404, 'Order not found.');
  return withPreparationTime(serializeOrder(order));
}

async function updateKitchenStatus(id, status) {
  if (!['PREPARING', 'READY'].includes(status)) {
    throw new ApiError(400, 'Kitchen can only move orders to PREPARING or READY.');
  }

  const existing = await prisma.order.findUnique({ where: { id } });
  if (!existing) throw new ApiError(404, 'Order not found.');
  if (!KITCHEN_STATUSES.includes(existing.status)) {
    throw new ApiError(409, 'Order is no longer in the kitchen queue.');
  }

  const order = await prisma.order.update({
    where: { id },
    data: { status },
    include: ORDER_INCLUDE,
  });

  return withPreparationTime(serializeOrder(order));
}

module.exports = {
  listKitchenOrders,
  getKitchenOrder,
  updateKitchenStatus,
};