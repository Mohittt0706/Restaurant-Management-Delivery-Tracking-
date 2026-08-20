const { ORDER_STATUSES } = require('../utils/orderStatus');

const orderStatusSchema = {
  validate(body = {}) {
    const errors = [];
    const value = {};

    if (typeof body.status !== 'string' || !ORDER_STATUSES.includes(body.status)) {
      errors.push({
        field: 'status',
        message: `Status must be one of: ${ORDER_STATUSES.join(', ')}.`,
      });
    } else {
      value.status = body.status;
    }

    return { errors, value };
  },
};

module.exports = {
  orderStatusSchema,
};