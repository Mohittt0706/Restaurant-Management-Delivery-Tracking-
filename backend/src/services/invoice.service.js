const prisma = require('../config/prisma');

class InvoiceService {
  async getInvoiceByOrderId(orderId, userId, userRole) {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        user: { select: { id: true, name: true, email: true, phone: true } },
        items: { include: { menuItem: true } },
        payment: true,
        invoice: true,
      },
    });

    if (!order) {
      const error = new Error('Order not found');
      error.statusCode = 404;
      throw error;
    }

    if (userRole === 'CUSTOMER' && order.userId !== userId) {
      const error = new Error('Access forbidden');
      error.statusCode = 403;
      throw error;
    }

    const subtotal = order.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const tax = Math.round(subtotal * 0.05 * 100) / 100;
    const deliveryFee = 30.0;

    return {
      invoiceNumber: order.invoice ? order.invoice.invoiceNumber : `INV-${order.orderNumber}`,
      orderId: order.id,
      orderNumber: order.orderNumber,
      createdAt: order.createdAt,
      customer: {
        name: order.user.name,
        email: order.user.email,
        phone: order.user.phone,
        address: order.addressText,
      },
      items: order.items.map((i) => ({
        name: i.menuItem.name,
        quantity: i.quantity,
        unitPrice: i.price,
        total: i.price * i.quantity,
      })),
      subtotal,
      tax,
      deliveryFee,
      totalAmount: order.totalAmount,
      paymentMethod: order.paymentMethod,
      paymentStatus: order.paymentStatus,
    };
  }
}

module.exports = new InvoiceService();
