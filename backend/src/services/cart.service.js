const prisma = require('../config/prisma');

class CartService {
  async getOrCreateCart(userId) {
    let cart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: { menuItem: { include: { category: true } } },
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId },
        include: {
          items: {
            include: { menuItem: { include: { category: true } } },
          },
        },
      });
    }

    // Calculate server-side totals
    const subtotal = cart.items.reduce((sum, item) => sum + item.menuItem.price * item.quantity, 0);
    const tax = Math.round(subtotal * 0.05 * 100) / 100;
    const deliveryFee = cart.items.length > 0 ? 30.0 : 0.0;
    const total = Math.round((subtotal + tax + deliveryFee) * 100) / 100;

    return {
      id: cart.id,
      userId: cart.userId,
      items: cart.items,
      subtotal,
      tax,
      deliveryFee,
      total,
    };
  }

  async addItem(userId, { menuItemId, quantity = 1, notes }) {
    if (quantity <= 0) {
      const error = new Error('Quantity must be greater than 0');
      error.statusCode = 400;
      throw error;
    }

    const menuItem = await prisma.menuItem.findUnique({ where: { id: menuItemId } });
    if (!menuItem) {
      const error = new Error('Menu item not found');
      error.statusCode = 404;
      throw error;
    }

    if (!menuItem.availability) {
      const error = new Error('Menu item is currently unavailable');
      error.statusCode = 400;
      throw error;
    }

    const cart = await this.getOrCreateCart(userId);

    const existingItem = await prisma.cartItem.findFirst({
      where: { cartId: cart.id, menuItemId },
    });

    if (existingItem) {
      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: {
          quantity: existingItem.quantity + quantity,
          ...(notes !== undefined && { notes }),
        },
      });
    } else {
      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          menuItemId,
          quantity,
          notes,
        },
      });
    }

    return await this.getOrCreateCart(userId);
  }

  async updateItemQuantity(userId, itemId, quantity, notes) {
    const cart = await this.getOrCreateCart(userId);

    const cartItem = await prisma.cartItem.findFirst({
      where: { id: itemId, cartId: cart.id },
    });

    if (!cartItem) {
      const error = new Error('Cart item not found');
      error.statusCode = 404;
      throw error;
    }

    if (quantity <= 0) {
      await prisma.cartItem.delete({ where: { id: itemId } });
    } else {
      await prisma.cartItem.update({
        where: { id: itemId },
        data: {
          quantity: parseInt(quantity, 10),
          ...(notes !== undefined && { notes }),
        },
      });
    }

    return await this.getOrCreateCart(userId);
  }

  async removeItem(userId, itemId) {
    const cart = await this.getOrCreateCart(userId);

    const cartItem = await prisma.cartItem.findFirst({
      where: { id: itemId, cartId: cart.id },
    });

    if (!cartItem) {
      const error = new Error('Cart item not found');
      error.statusCode = 404;
      throw error;
    }

    await prisma.cartItem.delete({ where: { id: itemId } });
    return await this.getOrCreateCart(userId);
  }

  async clearCart(userId) {
    const cart = await this.getOrCreateCart(userId);
    await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
    return await this.getOrCreateCart(userId);
  }
}

module.exports = new CartService();
