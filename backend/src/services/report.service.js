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
}

module.exports = new ReportService();
