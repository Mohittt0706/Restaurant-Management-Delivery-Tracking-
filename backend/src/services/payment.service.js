const prisma = require('../config/prisma');
const { ApiError } = require('../middleware/error.middleware');
const { isPaymentStatus } = require('../utils/paymentStatus');

function serializePayment(payment) {
  return {
    ...payment,
    amount: payment.amount.toNumber(),
  };
}

async function listPayments({ status } = {}) {
  const where = {};
  if (status) {
    if (!isPaymentStatus(status)) throw new ApiError(400, 'Invalid payment status.');
    where.status = status;
  }

  const payments = await prisma.payment.findMany({
    where,
    include: {
      order: {
        include: { customer: { select: { id: true, name: true, email: true, phone: true } } },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return payments.map(serializePayment);
}

async function getPayment(id) {
  const payment = await prisma.payment.findUnique({
    where: { id },
    include: {
      order: {
        include: {
          customer: { select: { id: true, name: true, email: true, phone: true } },
          items: true,
        },
      },
    },
  });
  if (!payment) throw new ApiError(404, 'Payment not found.');
  return serializePayment(payment);
}

module.exports = {
  listPayments,
  getPayment,
};