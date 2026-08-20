const prisma = require('../config/prisma');

const fallbackCategories = [
  { id: 'cat-1', name: 'Starters', description: 'Handcrafted appetizers to ignite your palate', image: '/assets/images/dish-1.jpg' },
  { id: 'cat-2', name: 'Mains', description: 'Signature flame-grilled and wood-fired delicacies', image: '/assets/images/dish-2.jpg' },
  { id: 'cat-3', name: 'Desserts', description: 'Decadent sweet endings', image: '/assets/images/dish-3.jpg' },
];

const fallbackMenuItems = [
  {
    id: 'item-1',
    categoryId: 'cat-1',
    category: { id: 'cat-1', name: 'Starters' },
    name: 'Truffle Flame Wings',
    shortDescription: 'Crispy wings coated in dark truffle glaze',
    description: 'Double-fried chicken wings tossed in black truffle butter, smoked chili glaze, and garlic chips.',
    price: 18.5,
    availability: true,
    preparationTime: 15,
    image: '/assets/images/dish-1.jpg',
  },
  {
    id: 'item-2',
    categoryId: 'cat-1',
    category: { id: 'cat-1', name: 'Starters' },
    name: 'Charred Burrata',
    shortDescription: 'Wood-fired burrata with balsamic reduction',
    description: 'Fresh Italian burrata lightly seared, served with heirloom cherry tomatoes, roasted garlic, and sourdough.',
    price: 16.0,
    availability: true,
    preparationTime: 12,
    image: '/assets/images/dish-4.jpg',
  },
  {
    id: 'item-3',
    categoryId: 'cat-2',
    category: { id: 'cat-2', name: 'Mains' },
    name: 'Cult Dry-Aged Ribeye',
    shortDescription: '45-day dry-aged beef with bone marrow butter',
    description: '14oz Prime ribeye, wood-grilled over oak charcoal, finished with bone marrow jus and sea salt.',
    price: 48.0,
    availability: true,
    preparationTime: 25,
    image: '/assets/images/hero-bg.jpg',
  },
  {
    id: 'item-4',
    categoryId: 'cat-2',
    category: { id: 'cat-2', name: 'Mains' },
    name: 'Smoked Salmon Tagliatelle',
    shortDescription: 'Handmade pasta with dill cream and pink pepper',
    description: 'Fresh egg tagliatelle, house-smoked Atlantic salmon, capers, Meyer lemon zest, and velvety cream.',
    price: 28.0,
    availability: true,
    preparationTime: 20,
    image: '/assets/images/dish-2.jpg',
  },
  {
    id: 'item-5',
    categoryId: 'cat-3',
    category: { id: 'cat-3', name: 'Desserts' },
    name: 'Dark Chocolate Lava Cake',
    shortDescription: 'Molten Valrhona chocolate with bourbon vanilla ice cream',
    description: 'Rich 70% dark chocolate sponge with a warm flowing center, served with house-spun bourbon ice cream.',
    price: 14.0,
    availability: true,
    preparationTime: 15,
    image: '/assets/images/dish-3.jpg',
  },
];

class MenuService {
  async getMenuItems({ category, search, availableOnly = false } = {}) {
    try {
      const where = {};

      if (availableOnly) {
        where.availability = true;
      }

      if (category && category !== 'All') {
        where.OR = [
          { categoryId: category },
          { category: { name: { contains: category, mode: 'insensitive' } } },
        ];
      }

      if (search) {
        where.AND = [
          {
            OR: [
              { name: { contains: search, mode: 'insensitive' } },
              { description: { contains: search, mode: 'insensitive' } },
              { shortDescription: { contains: search, mode: 'insensitive' } },
            ],
          },
        ];
      }

      const items = await prisma.menuItem.findMany({
        where,
        include: { category: true },
        orderBy: { createdAt: 'desc' },
      });

      if (items && items.length > 0) {
        return items;
      }
    } catch (error) {
      console.warn('Prisma DB query failed, serving fallback menu items:', error.message);
    }

    // Fallback logic
    let result = fallbackMenuItems;
    if (availableOnly) {
      result = result.filter((i) => i.availability);
    }
    if (category && category !== 'All') {
      result = result.filter((i) => i.category.name.toLowerCase() === category.toLowerCase() || i.categoryId === category);
    }
    if (search) {
      const query = search.toLowerCase();
      result = result.filter((i) => i.name.toLowerCase().includes(query) || i.description.toLowerCase().includes(query));
    }
    return result;
  }

  async getItemById(id) {
    try {
      const item = await prisma.menuItem.findUnique({
        where: { id },
        include: { category: true },
      });

      if (item) {
        return item;
      }
    } catch (error) {
      console.warn('Prisma DB getItemById failed, using fallback:', error.message);
    }

    const fallbackItem = fallbackMenuItems.find((i) => i.id === id || String(i.id) === String(id));
    if (fallbackItem) {
      return fallbackItem;
    }

    const error = new Error('Menu item not found');
    error.statusCode = 404;
    throw error;
  }

  async getCategories() {
    try {
      const categories = await prisma.category.findMany({
        include: {
          _count: { select: { menuItems: true } },
        },
        orderBy: { name: 'asc' },
      });

      if (categories && categories.length > 0) {
        return categories;
      }
    } catch (error) {
      console.warn('Prisma DB getCategories failed, serving fallback categories:', error.message);
    }

    return fallbackCategories;
  }

  async createMenuItem(data) {
    const { categoryId, name, image, shortDescription, description, price, availability, preparationTime } = data;

    if (!categoryId || !name || price === undefined) {
      const error = new Error('Category, name, and price are required');
      error.statusCode = 400;
      throw error;
    }

    return await prisma.menuItem.create({
      data: {
        categoryId,
        name,
        image,
        shortDescription,
        description,
        price: parseFloat(price),
        availability: availability !== undefined ? Boolean(availability) : true,
        preparationTime: preparationTime ? parseInt(preparationTime, 10) : null,
      },
      include: { category: true },
    });
  }

  async updateMenuItem(id, data) {
    return await prisma.menuItem.update({
      where: { id },
      data: {
        ...(data.categoryId && { categoryId: data.categoryId }),
        ...(data.name && { name: data.name }),
        ...(data.image !== undefined && { image: data.image }),
        ...(data.shortDescription !== undefined && { shortDescription: data.shortDescription }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.price !== undefined && { price: parseFloat(data.price) }),
        ...(data.availability !== undefined && { availability: Boolean(data.availability) }),
        ...(data.preparationTime !== undefined && { preparationTime: parseInt(data.preparationTime, 10) }),
      },
      include: { category: true },
    });
  }

  async updateAvailability(id, availability) {
    return await prisma.menuItem.update({
      where: { id },
      data: { availability: Boolean(availability) },
    });
  }

  async deleteMenuItem(id) {
    return await prisma.menuItem.delete({ where: { id } });
  }

  async createCategory(data) {
    const { name, description, image } = data;
    if (!name) {
      const error = new Error('Category name is required');
      error.statusCode = 400;
      throw error;
    }

    return await prisma.category.create({
      data: { name, description, image },
    });
  }

  async updateCategory(id, data) {
    return await prisma.category.update({
      where: { id },
      data,
    });
  }

  async deleteCategory(id) {
    return await prisma.category.delete({ where: { id } });
  }
}

module.exports = new MenuService();
