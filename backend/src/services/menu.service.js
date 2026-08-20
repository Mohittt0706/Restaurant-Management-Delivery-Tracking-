const prisma = require('../config/prisma');
const { ApiError } = require('../middleware/error.middleware');

async function listMenu({ categoryId, available, search } = {}) {
  const where = {};
  if (categoryId) where.categoryId = categoryId;
  if (available !== undefined) where.isAvailable = available === 'true' || available === true;
  if (search) where.name = { contains: search, mode: 'insensitive' };

  const items = await prisma.menuItem.findMany({
    where,
    include: { category: true },
    orderBy: { name: 'asc' },
  });

  return items.map((item) => ({ ...item, price: item.price.toNumber() }));
}

async function getMenu(id) {
  const item = await prisma.menuItem.findUnique({
    where: { id },
    include: { category: true },
  });
  if (!item) throw new ApiError(404, 'Menu item not found.');
  return { ...item, price: item.price.toNumber() };
}

async function createMenu(data) {
  const category = await prisma.menuCategory.findUnique({ where: { id: data.categoryId } });
  if (!category) throw new ApiError(404, 'Category not found.');

  const item = await prisma.menuItem.create({
    data: {
      name: data.name,
      description: data.description || null,
      price: data.price,
      categoryId: data.categoryId,
      image: data.image || null,
      isAvailable: data.isAvailable !== undefined ? data.isAvailable : true,
      isVeg: data.isVeg ?? null,
      spiceLevel: data.spiceLevel ?? 0,
    },
    include: { category: true },
  });

  return { ...item, price: item.price.toNumber() };
}

async function updateMenu(id, data) {
  const existing = await prisma.menuItem.findUnique({ where: { id } });
  if (!existing) throw new ApiError(404, 'Menu item not found.');

  if (data.categoryId) {
    const category = await prisma.menuCategory.findUnique({ where: { id: data.categoryId } });
    if (!category) throw new ApiError(404, 'Category not found.');
  }

  const item = await prisma.menuItem.update({
    where: { id },
    data: {
      name: data.name ?? existing.name,
      description: data.description !== undefined ? data.description : existing.description,
      price: data.price !== undefined ? data.price : existing.price,
      categoryId: data.categoryId ?? existing.categoryId,
      image: data.image !== undefined ? data.image : existing.image,
      isAvailable: data.isAvailable !== undefined ? data.isAvailable : existing.isAvailable,
      isVeg: data.isVeg !== undefined ? data.isVeg : existing.isVeg,
      spiceLevel: data.spiceLevel !== undefined ? data.spiceLevel : existing.spiceLevel,
    },
    include: { category: true },
  });

  return { ...item, price: item.price.toNumber() };
}

async function deleteMenu(id) {
  const existing = await prisma.menuItem.findUnique({ where: { id } });
  if (!existing) throw new ApiError(404, 'Menu item not found.');
  await prisma.menuItem.delete({ where: { id } });
  return { id };
}

async function listCategories() {
  return prisma.menuCategory.findMany({
    include: { _count: { select: { items: true } } },
    orderBy: { name: 'asc' },
  });
}

async function createCategory(data) {
  try {
    return await prisma.menuCategory.create({
      data: { name: data.name, description: data.description || null },
    });
  } catch (error) {
    if (error.code === 'P2002') throw new ApiError(409, 'A category with this name already exists.');
    throw error;
  }
}

async function updateCategory(id, data) {
  const existing = await prisma.menuCategory.findUnique({ where: { id } });
  if (!existing) throw new ApiError(404, 'Category not found.');
  try {
    return await prisma.menuCategory.update({
      where: { id },
      data: {
        name: data.name ?? existing.name,
        description: data.description !== undefined ? data.description : existing.description,
      },
    });
  } catch (error) {
    if (error.code === 'P2002') throw new ApiError(409, 'A category with this name already exists.');
    throw error;
  }
}

async function deleteCategory(id) {
  const existing = await prisma.menuCategory.findUnique({ where: { id } });
  if (!existing) throw new ApiError(404, 'Category not found.');

  const items = await prisma.menuItem.count({ where: { categoryId: id } });
  if (items > 0) throw new ApiError(409, 'Cannot delete a category that still has menu items.');

  await prisma.menuCategory.delete({ where: { id } });
  return { id };
}

module.exports = {
  listMenu,
  getMenu,
  createMenu,
  updateMenu,
  deleteMenu,
  listCategories,
  createCategory,
  updateCategory,
  deleteCategory,
};