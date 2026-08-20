const prisma = require('../config/prisma');

class KitchenService {
  async getActiveOrders() {
    return await prisma.order.findMany({
      where: {
        status: { in: ['CONFIRMED', 'PREPARING', 'READY'] },
      },
      include: {
        user: { select: { id: true, name: true, phone: true } },
        items: { include: { menuItem: true } },
      },
      orderBy: { createdAt: 'asc' },
    });
  }

  async acceptOrder(orderId, kitchenUserId) {
    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order) {
      const error = new Error('Order not found');
      error.statusCode = 404;
      throw error;
    }

    if (order.status !== 'CONFIRMED' && order.status !== 'PLACED') {
      const error = new Error(`Cannot accept order in status "${order.status}"`);
      error.statusCode = 409;
      throw error;
    }

    return await prisma.order.update({
      where: { id: orderId },
      data: {
        status: 'PREPARING',
        statusHistory: {
          create: {
            status: 'PREPARING',
            changedByUserId: kitchenUserId,
          },
        },
      },
      include: { items: { include: { menuItem: true } } },
    });
  }

  async markReady(orderId, kitchenUserId) {
    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order) {
      const error = new Error('Order not found');
      error.statusCode = 404;
      throw error;
    }

    if (order.status !== 'PREPARING') {
      const error = new Error(`Order must be in PREPARING state to mark as READY (current: "${order.status}")`);
      error.statusCode = 409;
      throw error;
    }

    return await prisma.order.update({
      where: { id: orderId },
      data: {
        status: 'READY',
        statusHistory: {
          create: {
            status: 'READY',
            changedByUserId: kitchenUserId,
          },
        },
      },
      include: { items: { include: { menuItem: true } } },
    });
  }
}

module.exports = new KitchenService();
