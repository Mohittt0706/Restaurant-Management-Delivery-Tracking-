const prisma = require('../config/prisma');
const bcrypt = require('bcrypt');
const { generateInvoiceNumber } = require('../utils/generateInvoice');

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
        where: { id: deliveryId },
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
