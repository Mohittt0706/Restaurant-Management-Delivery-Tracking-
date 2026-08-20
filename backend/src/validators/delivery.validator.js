const { DELIVERY_STATUSES } = require('../utils/deliveryStatus');

function requireId(value, field, errors, out) {
  if (typeof value !== 'string' || value.length === 0) {
    errors.push({ field, message: `${field} is required.` });
  } else {
    out[field] = value;
  }
}

const assignSchema = {
  validate(body = {}) {
    const errors = [];
    const value = {};
    requireId(body.orderId, 'orderId', errors, value);
    requireId(body.partnerId, 'partnerId', errors, value);
    return { errors, value };
  },
};

const partnerSchema = {
  validate(body = {}) {
    const errors = [];
    const value = {};

    if (typeof body.name !== 'string' || body.name.trim().length < 2) {
      errors.push({ field: 'name', message: 'Partner name is required and must be at least 2 characters.' });
    } else {
      value.name = body.name.trim();
    }

    if (typeof body.phone !== 'string' || body.phone.trim().length < 7) {
      errors.push({ field: 'phone', message: 'A valid contact number is required.' });
    } else {
      value.phone = body.phone.trim();
    }

    if (body.vehicle !== undefined) value.vehicle = body.vehicle;

    return { errors, value };
  },
};

const deliveryStatusSchema = {
  validate(body = {}) {
    const errors = [];
    const value = {};

    if (typeof body.status !== 'string' || !DELIVERY_STATUSES.includes(body.status)) {
      errors.push({
        field: 'status',
        message: `Status must be one of: ${DELIVERY_STATUSES.join(', ')}.`,
      });
    } else {
      value.status = body.status;
    }

    return { errors, value };
  },
};

module.exports = {
  assignSchema,
  partnerSchema,
  deliveryStatusSchema,
};