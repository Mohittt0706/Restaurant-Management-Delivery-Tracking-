const prisma = require('../config/prisma');

class OrderService {
  async createOrder(userId, { deliveryAddress, addressText, paymentMethod = 'COD', notes, items: payloadItems }) {
    let orderItemsData = [];
    let subtotal = 0;
    let cartIdToDelete = null;

    if (Array.isArray(payloadItems) && payloadItems.length > 0) {
      for (const item of payloadItems) {
        const targetId = item.menuItemId || item.productId || item.id;
        if (!targetId) continue;

        const menuItem = await prisma.menuItem.findUnique({
          where: { id: targetId },
        });

        if (!menuItem || !menuItem.availability) {
          const error = new Error(`Item "${menuItem ? menuItem.name : 'Unknown'}" is currently unavailable.`);
          error.statusCode = 400;
          throw error;
        }

        const quantity = item.quantity || 1;
        subtotal += menuItem.price * quantity;

        orderItemsData.push({
          menuItemId: menuItem.id,
          quantity,
          price: menuItem.price,
        });
      }
    } else {
      // Fetch cart with items from database
      const cart = await prisma.cart.findUnique({
        where: { userId },
        include: {
          items: {
            include: { menuItem: true },
          },
        },
      });

      if (!cart || cart.items.length === 0) {
        const error = new Error('Cart is empty. Cannot place an order.');
        error.statusCode = 400;
        throw error;
      }

      cartIdToDelete = cart.id;

      for (const cartItem of cart.items) {
        const { menuItem, quantity } = cartItem;

        if (!menuItem || !menuItem.availability) {
          const error = new Error(`Item "${menuItem ? menuItem.name : 'Unknown'}" is currently unavailable.`);
          error.statusCode = 400;
          throw error;
        }

        subtotal += menuItem.price * quantity;

        orderItemsData.push({
          menuItemId: menuItem.id,
          quantity,
          price: menuItem.price,
        });
      }
    }

    const tax = Math.round(subtotal * 0.05 * 100) / 100;
    const deliveryFee = 30.0;
    const totalAmount = Math.round((subtotal + tax + deliveryFee) * 100) / 100;

    const orderNumber = 'CULT-' + Date.now().toString().slice(-6) + Math.floor(100 + Math.random() * 900);

    // Format address string if address object provided
    let finalAddressText = addressText || '';
    if (deliveryAddress && typeof deliveryAddress === 'object') {
      finalAddressText = `${deliveryAddress.street || ''}, ${deliveryAddress.city || ''}, ${deliveryAddress.state || ''} ${deliveryAddress.zipCode || ''}`.trim();
    }

    // Execute in Prisma Transaction
    const result = await prisma.$transaction(async (tx) => {
      const newOrder = await tx.order.create({
        data: {
          userId,
          orderNumber,
          status: 'CONFIRMED', // Initial status set to CONFIRMED for kitchen queue
          totalAmount,
          addressText: finalAddressText || 'Default Customer Address',
          paymentMethod: paymentMethod === 'RAZORPAY' ? 'RAZORPAY' : 'COD',
          paymentStatus: 'PENDING',
          notes,
          items: {
            create: orderItemsData,
          },
          statusHistory: {
            create: {
              status: 'CONFIRMED',
              changedByUserId: userId,
            },
          },
        },
      });

      // Create Payment record
      await tx.payment.create({
        data: {
          orderId: newOrder.id,
          method: paymentMethod === 'RAZORPAY' ? 'RAZORPAY' : 'COD',
          amount: totalAmount,
          status: 'PENDING',
        },
      });

      // Clear DB cart if it exists
      if (cartIdToDelete) {
        await tx.cartItem.deleteMany({ where: { cartId: cartIdToDelete } });
      }

      return newOrder;
    });

    return await this.getOrderById(result.id, userId);
  }

  async getMyOrders(userId) {
    return await prisma.order.findMany({
      where: { userId },
      include: {
        items: { include: { menuItem: true } },
        payment: true,
        delivery: { include: { deliveryPartner: { select: { id: true, name: true, phone: true } } } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getOrderById(id, userId = null) {
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, name: true, email: true, phone: true } },
        items: { include: { menuItem: true } },
        payment: true,
        invoice: true,
        delivery: { include: { deliveryPartner: { select: { id: true, name: true, phone: true } } } },
        statusHistory: { orderBy: { createdAt: 'asc' } },
      },
    });

    if (!order) {
      const error = new Error('Order not found');
      error.statusCode = 404;
      throw error;
    }

    if (userId && order.userId !== userId) {
      const error = new Error('Access forbidden');
      error.statusCode = 403;
      throw error;
    }

    return order;
  }

  async cancelOrder(id, userId) {
    const order = await this.getOrderById(id, userId);

    if (['PREPARING', 'READY', 'ASSIGNED', 'OUT_FOR_DELIVERY', 'DELIVERED'].includes(order.status)) {
      const error = new Error(`Order cannot be cancelled in state "${order.status}"`);
      error.statusCode = 409;
      throw error;
    }

    return await prisma.order.update({
      where: { id },
      data: {
        status: 'CANCELLED',
        statusHistory: {
          create: {
            status: 'CANCELLED',
            changedByUserId: userId,
          },
        },
      },
      include: { items: { include: { menuItem: true } }, payment: true },
    });
  }

  async getOrderTracking(id, userId) {
    const order = await this.getOrderById(id, userId);

    return {
      orderId: order.id,
      orderNumber: order.orderNumber,
      orderStatus: order.status,
      paymentStatus: order.paymentStatus,
      paymentMethod: order.paymentMethod,
      totalAmount: order.totalAmount,
      addressText: order.addressText,
      createdAt: order.createdAt,
      deliveryPartner: order.delivery ? {
        name: order.delivery.deliveryPartner.name,
        phone: order.delivery.deliveryPartner.phone,
        status: order.delivery.status,
        assignedAt: order.delivery.assignedAt,
        pickedUpAt: order.delivery.pickedUpAt,
        deliveredAt: order.delivery.deliveredAt,
      } : null,
    };
  }

  async updateStatus(id, status, changedByUserId) {
    const validStatuses = ['PLACED', 'CONFIRMED', 'PREPARING', 'READY', 'ASSIGNED', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED'];
    if (!validStatuses.includes(status)) {
      const error = new Error('Invalid order status');
      error.statusCode = 400;
      throw error;
    }

    const order = await prisma.order.findUnique({ where: { id } });
    if (!order) {
      const error = new Error('Order not found');
      error.statusCode = 404;
      throw error;
    }

    return await prisma.order.update({
      where: { id },
      data: {
        status,
        statusHistory: { create: { status, changedByUserId } },
      },
      include: {
        user: { select: { id: true, name: true, phone: true } },
        items: { include: { menuItem: true } },
        payment: true,
        delivery: { include: { deliveryPartner: { select: { id: true, name: true, phone: true } } } },
      },
    });
  }
}

module.exports = new OrderService();
