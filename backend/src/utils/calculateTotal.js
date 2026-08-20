const calculateTotal = (items = [], taxRate = 0.05, deliveryFee = 30) => {
  const subtotal = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const tax = subtotal * taxRate;
  const total = subtotal + tax + deliveryFee;
  return { subtotal, tax, deliveryFee, total };
};

module.exports = { calculateTotal };
