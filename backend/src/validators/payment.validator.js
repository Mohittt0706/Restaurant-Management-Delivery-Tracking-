const { PAYMENT_STATUSES } = require('../utils/paymentStatus');

const paymentStatusSchema = {
  validate(body = {}) {
    const errors = [];
    const value = {};

    if (typeof body.status !== 'string' || !PAYMENT_STATUSES.includes(body.status)) {
      errors.push({
        field: 'status',
        message: `Status must be one of: ${PAYMENT_STATUSES.join(', ')}.`,
      });
    } else {
      value.status = body.status;
    }

    return { errors, value };
  },
};

module.exports = {
  paymentStatusSchema,
};