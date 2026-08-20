const prisma = require('../config/prisma');
const { ApiError } = require('../middleware/error.middleware');
const { isDeliveryStatus } = require('../utils/deliveryStatus');
const { serializeOrder, ORDER_INCLUDE } = require('./order.service');

async function getReadyOrders() {
  const orders = await prisma.order.findMany({
    where: { status: 'READY' },
    include: ORDER_INCLUDE,
    orderBy: { updatedAt: 'asc' },
  });
  return orders.map(serializeOrder);
}

async function getUnassignedOrders() {
  const orders = await prisma.order.findMany({
    where: { status: 'READY', deliveryAssignment: null },
    include: ORDER_INCLUDE,
    orderBy: { updatedAt: 'asc' },
  });
  return orders.map(serializeOrder);
}

async function listPartners() {
  return prisma.deliveryPartner.findMany({
    include: { _count: { select: { assignments: true } } },
    orderBy: { createdAt: 'asc' },
  });
}

async function createPartner({ name, phone, vehicle }) {
  try {
    return await prisma.deliveryPartner.create({
      data: { name, phone, vehicle: vehicle || null },
    });
  } catch (error) {
    if (error.code === 'P2002') throw new ApiError(409, 'A partner with this phone number already exists.');
    throw error;
  }
}

async function assignPartner(orderId, partnerId) {
  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order) throw new ApiError(404, 'Order not found.');
  if (order.status !== 'READY') {
    throw new ApiError(409, 'Only READY orders can be assigned to a delivery partner.');
  }

  const partner = await prisma.deliveryPartner.findUnique({ where: { id: partnerId } });
  if (!partner) throw new ApiError(404, 'Delivery partner not found.');
  if (partner.status === 'OFFLINE') throw new ApiError(409, 'This partner is offline.');

  const existing = await prisma.deliveryAssignment.findUnique({ where: { orderId } });
  if (existing) throw new ApiError(409, 'This order is already assigned.');

  const assignment = await prisma.$transaction([
    prisma.deliveryAssignment.create({
      data: { orderId, partnerId },
    }),
    prisma.order.update({ where: { id: orderId }, data: { status: 'ASSIGNED' } }),
    prisma.deliveryPartner.update({ where: { id: partnerId }, data: { status: 'BUSY' } }),
  ]);

  return assignment[0];
}

async function getActiveDeliveries() {
  const assignments = await prisma.deliveryAssignment.findMany({
    where: { status: { not: 'DELIVERED' } },
    include: {
      order: { include: ORDER_INCLUDE },
      partner: true,
    },
    orderBy: { assignedAt: 'desc' },
  });

  return assignments.map((a) => ({
    id: a.id,
    order: serializeOrder(a.order),
    partner: a.partner,
    status: a.status,
    assignedAt: a.assignedAt,
  }));
}

async function updateDeliveryStatus(id, status) {
  if (!isDeliveryStatus(status)) throw new ApiError(400, 'Invalid delivery status.');

  const assignment = await prisma.deliveryAssignment.findUnique({
    where: { id },
    include: { order: true, partner: true },
  });
  if (!assignment) throw new ApiError(404, 'Delivery assignment not found.');

  const orderStatusMap = {
    ASSIGNED: 'ASSIGNED',
    PICKED_UP: 'OUT_FOR_DELIVERY',
    OUT_FOR_DELIVERY: 'OUT_FOR_DELIVERY',
    DELIVERED: 'DELIVERED',
  };

  const updated = await prisma.$transaction([
    prisma.deliveryAssignment.update({
      where: { id },
      data: {
        status,
        deliveredAt: status === 'DELIVERED' ? new Date() : null,
      },
    }),
    prisma.order.update({
      where: { id: assignment.orderId },
      data: { status: orderStatusMap[status] },
    }),
    prisma.deliveryPartner.update({
      where: { id: assignment.partnerId },
      data: { status: status === 'DELIVERED' ? 'AVAILABLE' : 'BUSY' },
    }),
  ]);

  const fresh = await prisma.deliveryAssignment.findUnique({
    where: { id },
    include: { order: { include: ORDER_INCLUDE }, partner: true },
  });

  return {
    id: fresh.id,
    order: serializeOrder(fresh.order),
    partner: fresh.partner,
    status: fresh.status,
    assignedAt: fresh.assignedAt,
    deliveredAt: fresh.deliveredAt,
  };
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