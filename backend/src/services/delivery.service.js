const prisma = require('../config/prisma');
const bcrypt = require('bcrypt');
const { generateInvoiceNumber } = require('../utils/generateInvoice');

const DELIVERY_FLOW = ['ASSIGNED', 'ACCEPTED', 'PICKED_UP', 'OUT_FOR_DELIVERY', 'DELIVERED'];
const ACTIVE_STATUSES = ['ASSIGNED', 'ACCEPTED', 'PICKED_UP', 'OUT_FOR_DELIVERY'];

// Real fixed location of the restaurant used as pickup point for all deliveries.
const RESTAURANT_LOCATION = {
  name: 'CULT Central Kitchen',
  address: '12th Main Rd, Indiranagar, Bengaluru, Karnataka 560038',
  latitude: 12.9716,
  longitude: 77.5946,
};

function assertTransition(currentStatus, targetStatus) {
  if (!DELIVERY_FLOW.includes(targetStatus)) {
    const error = new Error(`Invalid delivery status "${targetStatus}"`);
    error.statusCode = 400;
    throw error;
  }
  if (currentStatus === targetStatus) {
    const error = new Error(`Delivery is already in status "${currentStatus}"`);
    error.statusCode = 400;
    throw error;
  }
  const currentIndex = DELIVERY_FLOW.indexOf(currentStatus);
  const targetIndex = DELIVERY_FLOW.indexOf(targetStatus);
  if (currentIndex === -1 || targetIndex !== currentIndex + 1) {
    const error = new Error(
      `Invalid status transition from "${currentStatus}" to "${targetStatus}". Must follow: ${DELIVERY_FLOW.join(' → ')}`
    );
    error.statusCode = 400;
    throw error;
  }
}

class DeliveryService {
  async getDeliveryPartners() {
    return await prisma.user.findMany({
      where: { role: 'DELIVERY', isActive: true },
      select: { id: true, name: true, email: true, phone: true, createdAt: true },
    });
  }

  async createDeliveryPartner({ name, phone, email }) {
    if (!name || !phone) {
      const error = new Error('Name and phone are required');
      error.statusCode = 400;
      throw error;
    }

    const existing = await prisma.user.findFirst({ where: { phone } });
    if (existing) {
      const error = new Error('A user with this phone number already exists');
      error.statusCode = 409;
      throw error;
    }

    const emailToUse = email || `delivery.${phone.replace(/\D/g, '').slice(-6)}@cult.com`;
    const passwordHash = await bcrypt.hash('delivery123', 10);

    return await prisma.user.create({
      data: {
        name,
        phone,
        email: emailToUse,
        passwordHash,
        role: 'DELIVERY',
        isActive: true,
      },
      select: { id: true, name: true, email: true, phone: true, role: true, isActive: true, createdAt: true },
    });
  }

  async assignDelivery(orderId, deliveryPartnerId, managerUserId) {
    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order) {
      const error = new Error('Order not found');
      error.statusCode = 404;
      throw error;
    }

    if (order.status !== 'READY' && order.status !== 'CONFIRMED') {
      const error = new Error(`Order must be in READY state to assign delivery partner (current: "${order.status}")`);
      error.statusCode = 409;
      throw error;
    }

    const partner = await prisma.user.findFirst({
      where: { id: deliveryPartnerId, role: 'DELIVERY' },
    });

    if (!partner) {
      const error = new Error('Invalid delivery partner ID');
      error.statusCode = 400;
      throw error;
    }

    return await prisma.$transaction(async (tx) => {
      // Upsert Delivery record
      const delivery = await tx.delivery.upsert({
        where: { orderId },
        update: {
          deliveryPartnerId,
          status: 'ASSIGNED',
          assignedAt: new Date(),
        },
        create: {
          orderId,
          deliveryPartnerId,
          status: 'ASSIGNED',
          assignedAt: new Date(),
          estimatedDistance: 3.8,
          estimatedDuration: 15,
        },
        include: {
          deliveryPartner: { select: { id: true, name: true, phone: true } },
          order: true,
        },
      });

      // Update Order Status to ASSIGNED
      await tx.order.update({
        where: { id: orderId },
        data: {
          status: 'ASSIGNED',
          statusHistory: {
            create: {
              status: 'ASSIGNED',
              changedByUserId: managerUserId,
            },
          },
        },
      });

      return delivery;
    });
  }

  async getAssignedDeliveries(deliveryPartnerId) {
    return await prisma.delivery.findMany({
      where: { deliveryPartnerId },
      include: {
        order: {
          include: {
            user: { select: { id: true, name: true, phone: true } },
            items: { include: { menuItem: true } },
            payment: true,
          },
        },
      },
      orderBy: { assignedAt: 'desc' },
    });
  }

  // --- DELIVERY PARTNER DASHBOARD ---

  async getDashboard(deliveryPartnerId) {
    const [assignedOrders, activeDeliveries, outForDelivery, deliveredOrders] = await Promise.all([
      prisma.delivery.count({ where: { deliveryPartnerId } }),
      prisma.delivery.count({ where: { deliveryPartnerId, status: { in: ACTIVE_STATUSES } } }),
      prisma.delivery.count({ where: { deliveryPartnerId, status: 'OUT_FOR_DELIVERY' } }),
      prisma.delivery.count({ where: { deliveryPartnerId, status: 'DELIVERED' } }),
    ]);

    return { assignedOrders, activeDeliveries, outForDelivery, deliveredOrders };
  }

  async getMyOrders(deliveryPartnerId) {
    return await prisma.delivery.findMany({
      where: { deliveryPartnerId },
      include: {
        order: {
          include: {
            user: { select: { id: true, name: true, phone: true } },
            items: { include: { menuItem: true } },
            payment: true,
          },
        },
      },
      orderBy: { assignedAt: 'desc' },
    });
  }

  async getMyOrder(orderId, deliveryPartnerId) {
    const delivery = await prisma.delivery.findFirst({
      where: { orderId, deliveryPartnerId },
      include: {
        deliveryPartner: { select: { id: true, name: true, phone: true } },
        order: {
          include: {
            user: { select: { id: true, name: true, phone: true } },
            items: { include: { menuItem: true } },
            payment: true,
            deliveryAddress: true,
            statusHistory: { orderBy: { createdAt: 'desc' } },
          },
        },
      },
    });

    if (!delivery) {
      const error = new Error('Order not found or not assigned to you');
      error.statusCode = 404;
      throw error;
    }

    return { ...delivery, restaurantLocation: RESTAURANT_LOCATION };
  }

  async getMyActive(deliveryPartnerId) {
    const delivery = await prisma.delivery.findFirst({
      where: { deliveryPartnerId, status: { in: ACTIVE_STATUSES } },
      include: {
        deliveryPartner: { select: { id: true, name: true, phone: true } },
        order: {
          include: {
            user: { select: { id: true, name: true, phone: true } },
            items: { include: { menuItem: true } },
            payment: true,
            deliveryAddress: true,
          },
        },
      },
      orderBy: { assignedAt: 'desc' },
    });

    if (!delivery) return null;

    return { ...delivery, restaurantLocation: RESTAURANT_LOCATION };
  }

  async updateMyDeliveryStatus(orderId, deliveryPartnerId, targetStatus) {
    const delivery = await prisma.delivery.findFirst({
      where: { orderId, deliveryPartnerId },
      include: { order: true },
    });

    if (!delivery) {
      const error = new Error('Order not found or not assigned to you');
      error.statusCode = 404;
      throw error;
    }

    return this._applyStatusUpdate(delivery, deliveryPartnerId, targetStatus);
  }

  async updateDeliveryStatus(deliveryId, deliveryPartnerId, targetStatus) {
    const delivery = await prisma.delivery.findUnique({
      where: { id: deliveryId },
      include: { order: true },
    });

    if (!delivery) {
      const error = new Error('Delivery record not found');
      error.statusCode = 404;
      throw error;
    }

    if (delivery.deliveryPartnerId !== deliveryPartnerId) {
      const error = new Error('You are not assigned to this delivery');
      error.statusCode = 403;
      throw error;
    }

    return this._applyStatusUpdate(delivery, deliveryPartnerId, targetStatus);
  }

  async _applyStatusUpdate(delivery, deliveryPartnerId, targetStatus) {
    assertTransition(delivery.status, targetStatus);

    const now = new Date();
    const updateData = { status: targetStatus };

    let targetOrderStatus = delivery.order.status;

    if (targetStatus === 'ACCEPTED') {
      updateData.acceptedAt = now;
    } else if (targetStatus === 'PICKED_UP') {
      updateData.pickedUpAt = now;
    } else if (targetStatus === 'OUT_FOR_DELIVERY') {
      updateData.outForDeliveryAt = now;
      targetOrderStatus = 'OUT_FOR_DELIVERY';
    } else if (targetStatus === 'DELIVERED') {
      updateData.deliveredAt = now;
      targetOrderStatus = 'DELIVERED';
    }

    return await prisma.$transaction(async (tx) => {
      // Update delivery record
      const updatedDelivery = await tx.delivery.update({
        where: { id: delivery.id },
        data: updateData,
        include: {
          order: {
            include: {
              user: { select: { id: true, name: true, phone: true } },
              items: { include: { menuItem: true } },
              payment: true,
            },
          },
        },
      });

      // Update Order status
      await tx.order.update({
        where: { id: delivery.orderId },
        data: {
          status: targetOrderStatus,
          ...(targetStatus === 'DELIVERED' && { paymentStatus: 'PAID' }),
          statusHistory: {
            create: {
              status: targetOrderStatus,
              changedByUserId: deliveryPartnerId,
            },
          },
        },
      });

      // Update payment record to PAID on delivery
      if (targetStatus === 'DELIVERED') {
        await tx.payment.updateMany({
          where: { orderId: delivery.orderId },
          data: { status: 'PAID' },
        });

        // Auto-generate invoice if not exists
        const existingInvoice = await tx.invoice.findUnique({
          where: { orderId: delivery.orderId },
        });

        if (!existingInvoice) {
          const subtotal = delivery.order.totalAmount - 30.0;
          const tax = Math.round(subtotal * 0.05 * 100) / 100;
          await tx.invoice.create({
            data: {
              orderId: delivery.orderId,
              invoiceNumber: generateInvoiceNumber(),
              subtotal: Math.max(0, subtotal),
              tax: Math.max(0, tax),
              deliveryFee: 30.0,
              totalAmount: delivery.order.totalAmount,
            },
          });
        }
      }

      return updatedDelivery;
    });
  }
}

module.exports = new DeliveryService();