function isNumber(value) {
  return typeof value === 'number' && Number.isFinite(value);
}

const menuItemSchema = {
  validate(body = {}) {
    const errors = [];
    const value = {};

    if (typeof body.name !== 'string' || body.name.trim().length < 2) {
      errors.push({ field: 'name', message: 'Name is required and must be at least 2 characters.' });
    } else {
      value.name = body.name.trim();
    }

    if (body.categoryId !== undefined) {
      if (typeof body.categoryId !== 'string' || body.categoryId.length === 0) {
        errors.push({ field: 'categoryId', message: 'A valid category is required.' });
      } else {
        value.categoryId = body.categoryId;
      }
    }

    if (body.price !== undefined) {
      if (!isNumber(body.price) || body.price <= 0) {
        errors.push({ field: 'price', message: 'Price must be a positive number.' });
      } else {
        value.price = body.price;
      }
    }

    if (body.description !== undefined) value.description = body.description;
    if (body.image !== undefined) value.image = body.image;
    if (body.isAvailable !== undefined) value.isAvailable = Boolean(body.isAvailable);
    if (body.isVeg !== undefined) value.isVeg = Boolean(body.isVeg);
    if (body.spiceLevel !== undefined) {
      if (!isNumber(body.spiceLevel) || body.spiceLevel < 0 || body.spiceLevel > 5) {
        errors.push({ field: 'spiceLevel', message: 'Spice level must be between 0 and 5.' });
      } else {
        value.spiceLevel = body.spiceLevel;
      }
    }

    return { errors, value };
  },
};

const categorySchema = {
  validate(body = {}) {
    const errors = [];
    const value = {};

    if (typeof body.name !== 'string' || body.name.trim().length < 2) {
      errors.push({ field: 'name', message: 'Category name is required and must be at least 2 characters.' });
    } else {
      value.name = body.name.trim();
    }

    if (body.description !== undefined) value.description = body.description;

    return { errors, value };
  },
};

module.exports = {
  menuItemSchema,
  categorySchema,
};