const prisma = require('../config/prisma');

function startOfToday() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

async function getDashboard() {
  const [totalOrders, todayOrders, pendingOrders, preparingOrders, deliveredOrders, activeDeliveries, paidToday] =
    await Promise.all([
      prisma.order.count(),
      prisma.order.count({ where: { createdAt: { gte: startOfToday() } } }),
      prisma.order.count({ where: { status: { in: ['PENDING', 'PLACED'] } } }),
      prisma.order.count({ where: { status: 'PREPARING' } }),
      prisma.order.count({ where: { status: 'DELIVERED' } }),
      prisma.order.count({
        where: {
          deliveryAssignment: { status: { not: 'DELIVERED' } },
        },
      }),
      prisma.order.findMany({
        where: {
          paymentStatus: 'PAID',
          createdAt: { gte: startOfToday() },
        },
        select: { total: true },
      }),
    ]);

  const todayRevenue = paidToday.reduce((sum, o) => sum + o.total.toNumber(), 0);

  return {
    totalOrders,
    todayOrders,
    todayRevenue: Math.round(todayRevenue * 100) / 100,
    pendingOrders,
    preparingOrders,
    deliveredOrders,
    activeDeliveries,
  };
}

module.exports = {
  getDashboard,
};