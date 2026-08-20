const prisma = require('../config/prisma');

class InventoryService {
  async getInventoryList() {
    const items = await prisma.inventoryItem.findMany({
      orderBy: { name: 'asc' },
    });

    return items.map((item) => ({
      ...item,
      isLowStock: item.currentStock <= item.lowStockThreshold,
    }));
  }

  async createInventoryItem(data) {
    const { name, unit, currentStock, lowStockThreshold } = data;
    if (!name || !unit || currentStock === undefined) {
      const error = new Error('Name, unit, and current stock are required');
      error.statusCode = 400;
      throw error;
    }

    return await prisma.inventoryItem.create({
      data: {
        name,
        unit,
        currentStock: parseFloat(currentStock),
        lowStockThreshold: lowStockThreshold ? parseFloat(lowStockThreshold) : 5.0,
      },
    });
  }

  async updateInventoryItem(id, data) {
    return await prisma.inventoryItem.update({
      where: { id },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.unit && { unit: data.unit }),
        ...(data.currentStock !== undefined && { currentStock: parseFloat(data.currentStock) }),
        ...(data.lowStockThreshold !== undefined && { lowStockThreshold: parseFloat(data.lowStockThreshold) }),
        ...(data.isActive !== undefined && { isActive: Boolean(data.isActive) }),
      },
    });
  }

  async deleteInventoryItem(id) {
    return await prisma.inventoryItem.delete({ where: { id } });
  }
}

module.exports = new InventoryService();
