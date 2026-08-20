let sequence = 0;

function generateInvoiceNumber() {
  sequence += 1;
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const random = Math.floor(Math.random() * 9000 + 1000);
  return `INV-${date}-${random}${sequence}`;
}

module.exports = {
  generateInvoiceNumber,
};