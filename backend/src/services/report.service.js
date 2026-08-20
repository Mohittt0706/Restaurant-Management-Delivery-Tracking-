const prisma = require('../config/prisma');

function toNumber(value) {
  return value ? value.toNumber() : 0;
}

function startOfDay(offsetDays = 0) {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - offsetDays);
  return d;
}

async function salesReport() {
  const paidOrders = await prisma.order.findMany({
    where: { paymentStatus: 'PAID' },
    include: { items: true },
  });

  const totalSales = paidOrders.reduce((sum, o) => sum + o.total.toNumber(), 0);
  const totalOrders = paidOrders.length;
  const avgOrderValue = totalOrders ? Math.round((totalSales / totalOrders) * 100) / 100 : 0;

  const salesByDay = [];
  for (let i = 6; i >= 0; i -= 1) {
    const from = startOfDay(i);
    const to = startOfDay(i - 1);
    const dayOrders = paidOrders.filter((o) => o.createdAt >= from && o.createdAt < to);
    salesByDay.push({
      date: from.toISOString().slice(0, 10),
      orders: dayOrders.length,
      sales: Math.round(dayOrders.reduce((s, o) => s + o.total.toNumber(), 0) * 100) / 100,
    });
  }

  const itemCounts = {};
  for (const order of paidOrders) {
    for (const item of order.items) {
      itemCounts[item.name] = (itemCounts[item.name] || 0) + item.quantity;
    }
  }
  const topItems = Object.entries(itemCounts)
    .map(([name, quantity]) => ({ name, quantity }))
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 5);

  return { totalSales, totalOrders, avgOrderValue, salesByDay, topItems };
}

async function revenueReport() {
  const paidOrders = await prisma.order.findMany({ where: { paymentStatus: 'PAID' } });

  const totalRevenue = paidOrders.reduce((sum, o) => sum + o.total.toNumber(), 0);

  const revenueByDay = [];
  for (let i = 6; i >= 0; i -= 1) {
    const from = startOfDay(i);
    const to = startOfDay(i - 1);
    const dayOrders = paidOrders.filter((o) => o.createdAt >= from && o.createdAt < to);
    revenueByDay.push({
      date: from.toISOString().slice(0, 10),
      revenue: Math.round(dayOrders.reduce((s, o) => s + o.total.toNumber(), 0) * 100) / 100,
    });
  }

  const payments = await prisma.payment.groupBy({
    by: ['method'],
    _sum: { amount: true },
  });
  const byPaymentMethod = payments.map((p) => ({
    method: p.method,
    amount: toNumber(p._sum.amount),
  }));

  return { totalRevenue, revenueByDay, byPaymentMethod };
}

async function ordersReport() {
  const total = await prisma.order.count();
  const today = startOfDay(0);
  const week = startOfDay(6);

  const [todayOrders, weekOrders, byStatus] = await Promise.all([
    prisma.order.count({ where: { createdAt: { gte: today } } }),
    prisma.order.count({ where: { createdAt: { gte: week } } }),
    prisma.order.groupBy({ by: ['status'], _count: true }),
  ]);

  const ordersByDay = [];
  for (let i = 6; i >= 0; i -= 1) {
    const from = startOfDay(i);
    const to = startOfDay(i - 1);
    const count = await prisma.order.count({ where: { createdAt: { gte: from, lt: to } } });
    ordersByDay.push({ date: from.toISOString().slice(0, 10), orders: count });
  }

  return {
    totalOrders: total,
    todayOrders,
    weekOrders,
    byStatus: byStatus.map((s) => ({ status: s.status, count: s._count })),
    ordersByDay,
  };
}

async function deliveryPerformanceReport() {
  const [delivered, active, byPartner, avg] = await Promise.all([
    prisma.deliveryAssignment.count({ where: { status: 'DELIVERED' } }),
    prisma.deliveryAssignment.count({ where: { status: { not: 'DELIVERED' } } }),
    prisma.deliveryAssignment.groupBy({
      by: ['partnerId'],
      _count: true,
    }),
    prisma.deliveryAssignment.findMany({
      where: { status: 'DELIVERED', deliveredAt: { not: null } },
      include: { partner: true },
    }),
  ]);

  const partnerRows = await Promise.all(
    byPartner.map(async (row) => {
      const partner = await prisma.deliveryPartner.findUnique({ where: { id: row.partnerId } });
      return { partnerName: partner?.name || 'Unknown', deliveries: row._count };
    }),
  );

  let avgDeliveryMinutes = 0;
  if (avg.length) {
    const totalMinutes = avg.reduce(
      (sum, a) => sum + (a.deliveredAt.getTime() - a.assignedAt.getTime()) / 60000,
      0,
    );
    avgDeliveryMinutes = Math.round(totalMinutes / avg.length);
  }

  return { totalDeliveries: delivered, activeDeliveries: active, avgDeliveryMinutes, byPartner: partnerRows };
}

module.exports = {
  salesReport,
  revenueReport,
  ordersReport,
  deliveryPerformanceReport,
};