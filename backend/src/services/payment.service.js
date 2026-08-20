const prisma = require('../config/prisma');
const crypto = require('crypto');
const { RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET } = require('../config/env');

class PaymentService {
  async createRazorpayOrder(orderId, userId) {
    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order) {
      const error = new Error('Order not found');
      error.statusCode = 404;
      throw error;
    }

    if (order.userId !== userId) {
      const error = new Error('Access forbidden');
      error.statusCode = 403;
      throw error;
    }

    const mockRazorpayOrderId = 'rzp_order_' + Date.now() + Math.floor(100 + Math.random() * 900);

    await prisma.payment.upsert({
      where: { orderId },
      update: {
        method: 'RAZORPAY',
        provider: 'RAZORPAY',
        transactionId: mockRazorpayOrderId,
      },
      create: {
        orderId,
        method: 'RAZORPAY',
        amount: order.totalAmount,
        provider: 'RAZORPAY',
        transactionId: mockRazorpayOrderId,
        status: 'PENDING',
      },
    });

    return {
      razorpayOrderId: mockRazorpayOrderId,
      amount: order.totalAmount * 100, // Amount in paise
      currency: 'INR',
      keyId: RAZORPAY_KEY_ID,
    };
  }

  async verifyRazorpayPayment({ orderId, razorpayOrderId, razorpayPaymentId, razorpaySignature }) {
    const payment = await prisma.payment.findUnique({ where: { orderId } });
    if (!payment) {
      const error = new Error('Payment record not found');
      error.statusCode = 404;
      throw error;
    }

    // Verify signature if secret provided, else simulate verification
    let isValid = true;
    if (razorpayOrderId && razorpayPaymentId && razorpaySignature && RAZORPAY_KEY_SECRET !== 'mock_secret_456') {
      const body = razorpayOrderId + '|' + razorpayPaymentId;
      const expectedSignature = crypto
        .createHmac('sha256', RAZORPAY_KEY_SECRET)
        .update(body.toString())
        .digest('hex');
      isValid = expectedSignature === razorpaySignature;
    }

    if (!isValid) {
      await prisma.payment.update({
        where: { orderId },
        data: { status: 'FAILED' },
      });
      const error = new Error('Payment verification failed. Invalid signature.');
      error.statusCode = 400;
      throw error;
    }

    return await prisma.$transaction(async (tx) => {
      const updatedPayment = await tx.payment.update({
        where: { orderId },
        data: {
          status: 'PAID',
          transactionId: razorpayPaymentId || razorpayOrderId || 'TXN_' + Date.now(),
        },
      });

      await tx.order.update({
        where: { id: orderId },
        data: {
          paymentStatus: 'PAID',
          status: 'CONFIRMED',
        },
      });

      return updatedPayment;
    });
  }
}

module.exports = new PaymentService();
