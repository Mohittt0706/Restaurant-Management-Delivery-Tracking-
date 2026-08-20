const TAX_RATE = 0.05;

function calculateTotal(subtotal, { taxRate = TAX_RATE, deliveryFee = 0 } = {}) {
  const subtotalNum = Number(subtotal) || 0;
  const tax = Math.round(subtotalNum * taxRate * 100) / 100;
  const total = Math.round((subtotalNum + tax + deliveryFee) * 100) / 100;
  return { subtotal: subtotalNum, tax, deliveryFee, total };
}

module.exports = {
  calculateTotal,
  TAX_RATE,
};