const prisma = require('../config/prisma');

class ReportService {
  async getDashboardData() {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const totalOrders = await prisma.order.count();
    const todayOrders = await prisma.order.findMany({
      where: { createdAt: { gte: startOfDay } },
    });

    const todayRevenue = todayOrders
      .filter((o) => o.paymentStatus === 'PAID')
      .reduce((sum, o) => sum + o.totalAmount, 0);

    const ordersByStatus = await prisma.order.groupBy({
      by: ['status'],
      _count: { id: true },
    });

    const activeDeliveries = await prisma.delivery.count({
      where: { status: { in: ['ASSIGNED', 'ACCEPTED', 'PICKED_UP', 'OUT_FOR_DELIVERY'] } },
    });

    const inventoryItems = await prisma.inventoryItem.findMany();
    const lowStockItems = inventoryItems.filter((item) => item.currentStock <= item.lowStockThreshold);

    return {
      totalOrders,
      todayRevenue: Math.round(todayRevenue * 100) / 100,
      todayOrdersCount: todayOrders.length,
      ordersByStatus: ordersByStatus.reduce((acc, curr) => {
        acc[curr.status] = curr._count.id;
        return acc;
      }, {}),
      activeDeliveries,
      lowStockCount: lowStockItems.length,
      lowStockItems,
    };
  }

  async getSalesReport() {
    const orders = await prisma.order.findMany({
      where: { paymentStatus: 'PAID' },
      include: { items: { include: { menuItem: true } } },
    });

    const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);

    // Calculate top selling menu items
    const itemSales = {};
    for (const order of orders) {
      for (const item of order.items) {
        const name = item.menuItem ? item.menuItem.name : 'Item';
        if (!itemSales[name]) {
          itemSales[name] = { quantity: 0, revenue: 0 };
        }
        itemSales[name].quantity += item.quantity;
        itemSales[name].revenue += item.price * item.quantity;
      }
    }

    const topItems = Object.entries(itemSales)
      .map(([name, data]) => ({ name, ...data }))
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5);

    return {
      totalPaidOrders: orders.length,
      totalRevenue: Math.round(totalRevenue * 100) / 100,
      averageOrderValue: orders.length > 0 ? Math.round((totalRevenue / orders.length) * 100) / 100 : 0,
      topSellingItems: topItems,
    };
  }

  async getManagerOrders(status) {
    const where = {};
    if (status) {
      where.status = status;
    }

    return await prisma.order.findMany({
      where,
      include: {
        user: { select: { id: true, name: true, phone: true } },
        items: { include: { menuItem: true } },
        payment: true,
        delivery: { include: { deliveryPartner: { select: { id: true, name: true, phone: true } } } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getRevenueReport() {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const paidOrders = await prisma.order.findMany({ where: { paymentStatus: 'PAID' } });
    const totalRevenue = paidOrders.reduce((sum, o) => sum + o.totalAmount, 0);
    const todayRevenue = paidOrders.filter((o) => o.createdAt >= startOfDay).reduce((sum, o) => sum + o.totalAmount, 0);

    const paymentGroups = await prisma.payment.groupBy({
      by: ['method'],
      _sum: { amount: true },
    });

    const dailyRevenue = [];
    for (let i = 6; i >= 0; i--) {
      const dayStart = new Date();
      dayStart.setDate(dayStart.getDate() - i);
      dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date(dayStart);
      dayEnd.setDate(dayEnd.getDate() + 1);
      const sum = paidOrders.filter((o) => o.createdAt >= dayStart && o.createdAt < dayEnd).reduce((s, o) => s + o.totalAmount, 0);
      dailyRevenue.push({ date: dayStart.toISOString().slice(0, 10), revenue: Math.round(sum * 100) / 100 });
    }

    return {
      totalRevenue: Math.round(totalRevenue * 100) / 100,
      todayRevenue: Math.round(todayRevenue * 100) / 100,
      byPaymentMethod: paymentGroups.map((g) => ({ method: g.method, amount: Math.round((g._sum.amount || 0) * 100) / 100 })),
      dailyRevenue,
    };
  }

  async getOrdersReport() {
    const totalOrders = await prisma.order.count();
    const statusGroups = await prisma.order.groupBy({
      by: ['status'],
      _count: { id: true },
    });

    const dailyOrders = [];
    for (let i = 6; i >= 0; i--) {
      const dayStart = new Date();
      dayStart.setDate(dayStart.getDate() - i);
      dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date(dayStart);
      dayEnd.setDate(dayEnd.getDate() + 1);
      const count = await prisma.order.count({ where: { createdAt: { gte: dayStart, lt: dayEnd } } });
      dailyOrders.push({ date: dayStart.toISOString().slice(0, 10), count });
    }

    return {
      totalOrders,
      byStatus: statusGroups.map((g) => ({ status: g.status, count: g._count.id })),
      dailyOrders,
    };
  }

  async getDeliveryPerformanceReport() {
    const deliveries = await prisma.delivery.findMany({
      include: { deliveryPartner: { select: { id: true, name: true } } },
    });

    const completed = deliveries.filter((d) => d.status === 'DELIVERED' && d.assignedAt && d.deliveredAt);

    const avgAll = completed.length
      ? completed.reduce((sum, d) => sum + (d.deliveredAt - d.assignedAt) / 60000, 0) / completed.length
      : 0;

    const byPartnerMap = {};
    for (const d of completed) {
      const name = d.deliveryPartner?.name || 'Unknown';
      if (!byPartnerMap[name]) byPartnerMap[name] = { partner: name, deliveries: 0, totalMinutes: 0 };
      byPartnerMap[name].deliveries += 1;
      byPartnerMap[name].totalMinutes += (d.deliveredAt - d.assignedAt) / 60000;
    }

    return {
      totalDeliveries: deliveries.length,
      completedDeliveries: completed.length,
      averageDeliveryMinutes: Math.round(avgAll * 100) / 100,
      byPartner: Object.values(byPartnerMap).map((p) => ({
        partner: p.partner,
        deliveries: p.deliveries,
        avgMinutes: Math.round((p.totalMinutes / p.deliveries) * 100) / 100,
      })),
    };
  }
}

module.exports = new ReportService();
