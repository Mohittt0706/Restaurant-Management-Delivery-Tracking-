const Razorpay = require('razorpay');
const prisma = require('../config/prisma');
const crypto = require('crypto');
const { RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET } = require('../config/env');

let razorpayInstance = null;
if (RAZORPAY_KEY_ID && RAZORPAY_KEY_SECRET && RAZORPAY_KEY_SECRET !== 'mock_secret_456') {
  try {
    razorpayInstance = new Razorpay({
      key_id: RAZORPAY_KEY_ID,
      key_secret: RAZORPAY_KEY_SECRET,
    });
  } catch (err) {
    console.error('Failed to initialize Razorpay SDK:', err);
  }
}

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

    const amountInPaise = Math.round(order.totalAmount * 100);
    let razorpayOrderId = null;
    const isMock = !razorpayInstance;

    if (razorpayInstance) {
      try {
        const rpOrder = await razorpayInstance.orders.create({
          amount: amountInPaise,
          currency: 'INR',
          receipt: `rcpt_${order.id.slice(0, 8)}_${Date.now().toString().slice(-4)}`,
        });
        razorpayOrderId = rpOrder.id;
      } catch (err) {
        console.error('Razorpay Order API error:', err);
        const errMsg = err?.error?.description || err.message || 'Failed to create order on Razorpay servers';
        const error = new Error(errMsg);
        error.statusCode = 400;
        throw error;
      }
    } else {
      razorpayOrderId = 'rzp_mock_' + Date.now() + Math.floor(100 + Math.random() * 900);
    }

    await prisma.payment.upsert({
      where: { orderId },
      update: {
        method: 'RAZORPAY',
        provider: 'RAZORPAY',
        transactionId: razorpayOrderId,
      },
      create: {
        orderId,
        method: 'RAZORPAY',
        amount: order.totalAmount,
        provider: 'RAZORPAY',
        transactionId: razorpayOrderId,
        status: 'PENDING',
      },
    });

    if (isMock) {
      await prisma.$transaction(async (tx) => {
        await tx.payment.update({
          where: { orderId },
          data: { status: 'PAID', transactionId: razorpayOrderId },
        });
        await tx.order.update({
          where: { id: orderId },
          data: { paymentStatus: 'PAID', status: 'CONFIRMED' },
        });
      });
    }

    return {
      razorpayOrderId,
      amount: amountInPaise,
      currency: 'INR',
      keyId: RAZORPAY_KEY_ID,
      isMock,
    };
  }

  async verifyRazorpayPayment({ orderId, razorpayOrderId, razorpayPaymentId, razorpaySignature }) {
    const payment = await prisma.payment.findUnique({ where: { orderId } });
    if (!payment) {
      const error = new Error('Payment record not found');
      error.statusCode = 404;
      throw error;
    }

    let isValid = true;
    if (razorpayOrderId && razorpayPaymentId && razorpaySignature && RAZORPAY_KEY_SECRET && RAZORPAY_KEY_SECRET !== 'mock_secret_456') {
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
