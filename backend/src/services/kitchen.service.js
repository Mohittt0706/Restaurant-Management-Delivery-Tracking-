const prisma = require('../config/prisma');

class KitchenService {
  async getNewOrders() {
    return await prisma.order.findMany({
      where: {
        status: { in: ['PLACED', 'CONFIRMED'] },
      },
      include: {
        user: { select: { id: true, name: true, phone: true } },
        items: { include: { menuItem: true } },
        payment: { select: { method: true, status: true, amount: true } },
      },
      orderBy: { createdAt: 'asc' }, // Oldest first
    });
  }

  async getPreparingOrders() {
    const orders = await prisma.order.findMany({
      where: {
        status: 'PREPARING',
      },
      include: {
        user: { select: { id: true, name: true, phone: true } },
        items: { include: { menuItem: true } },
        payment: { select: { method: true, status: true, amount: true } },
      },
      orderBy: { preparationStartedAt: 'asc' },
    });

    const now = new Date();
    return orders.map((order) => {
      const elapsedMinutes = order.preparationStartedAt
        ? Math.max(0, Math.floor((now - new Date(order.preparationStartedAt)) / 60000))
        : 0;

      return {
        ...order,
        specialRequirements: order.specialRequirements || order.notes,
        elapsedMinutes,
      };
    });
  }

  async getReadyOrders() {
    const orders = await prisma.order.findMany({
      where: {
        status: 'READY',
      },
      include: {
        user: { select: { id: true, name: true, phone: true } },
        items: { include: { menuItem: true } },
        payment: { select: { method: true, status: true, amount: true } },
      },
      orderBy: { updatedAt: 'desc' },
    });

    return orders.map((order) => {
      let durationMinutes = 0;
      if (order.preparationStartedAt && order.preparationCompletedAt) {
        durationMinutes = Math.max(0, Math.round((new Date(order.preparationCompletedAt) - new Date(order.preparationStartedAt)) / 60000));
      }

      return {
        ...order,
        specialRequirements: order.specialRequirements || order.notes,
        preparationDurationMinutes: durationMinutes,
      };
    });
  }

  async getKitchenOrderById(orderId) {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        user: { select: { id: true, name: true, phone: true } },
        items: { include: { menuItem: true } },
        payment: { select: { method: true, status: true, amount: true } },
        statusHistory: { orderBy: { createdAt: 'asc' } },
      },
    });

    if (!order) {
      const error = new Error('Order not found');
      error.statusCode = 404;
      throw error;
    }

    let durationMinutes = null;
    if (order.preparationStartedAt && order.preparationCompletedAt) {
      durationMinutes = Math.max(0, Math.round((new Date(order.preparationCompletedAt) - new Date(order.preparationStartedAt)) / 60000));
    }

    return {
      ...order,
      specialRequirements: order.specialRequirements || order.notes,
      preparationDurationMinutes: durationMinutes,
    };
  }

  async acceptOrder(orderId, kitchenUserId) {
    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order) {
      const error = new Error('Order not found');
      error.statusCode = 404;
      throw error;
    }

    if (order.status !== 'CONFIRMED' && order.status !== 'PLACED') {
      const error = new Error(`Order is not in a valid state for acceptance (current status: "${order.status}")`);
      error.statusCode = 409; // Conflict
      throw error;
    }

    const now = new Date();

    return await prisma.$transaction(async (tx) => {
      const updatedOrder = await tx.order.update({
        where: { id: orderId },
        data: {
          status: 'PREPARING',
          preparationStartedAt: now,
          statusHistory: {
            create: {
              status: 'PREPARING',
              changedByUserId: kitchenUserId,
            },
          },
        },
        include: {
          user: { select: { id: true, name: true, phone: true } },
          items: { include: { menuItem: true } },
          payment: { select: { method: true, status: true, amount: true } },
        },
      });

      return {
        ...updatedOrder,
        specialRequirements: updatedOrder.specialRequirements || updatedOrder.notes,
      };
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
      const error = new Error(`Order must be in PREPARING state to mark as READY (current status: "${order.status}")`);
      error.statusCode = 409; // Conflict
      throw error;
    }

    const now = new Date();

    return await prisma.$transaction(async (tx) => {
      const updatedOrder = await tx.order.update({
        where: { id: orderId },
        data: {
          status: 'READY',
          preparationCompletedAt: now,
          statusHistory: {
            create: {
              status: 'READY',
              changedByUserId: kitchenUserId,
            },
          },
        },
        include: {
          user: { select: { id: true, name: true, phone: true } },
          items: { include: { menuItem: true } },
          payment: { select: { method: true, status: true, amount: true } },
        },
      });

      let durationMinutes = 0;
      if (updatedOrder.preparationStartedAt && updatedOrder.preparationCompletedAt) {
        durationMinutes = Math.max(0, Math.round((new Date(updatedOrder.preparationCompletedAt) - new Date(updatedOrder.preparationStartedAt)) / 60000));
      }

      return {
        ...updatedOrder,
        specialRequirements: updatedOrder.specialRequirements || updatedOrder.notes,
        preparationDurationMinutes: durationMinutes,
      };
    });
  }
}

module.exports = new KitchenService();
