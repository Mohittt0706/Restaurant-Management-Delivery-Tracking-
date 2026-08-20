const PAYMENT_STATUSES = ['PENDING', 'PAID', 'FAILED', 'COD'];

function isPaymentStatus(value) {
  return PAYMENT_STATUSES.includes(value);
}

module.exports = {
  PAYMENT_STATUSES,
  isPaymentStatus,
};