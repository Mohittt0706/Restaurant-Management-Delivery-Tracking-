const prisma = require('../config/prisma');
const { ApiError } = require('../middleware/error.middleware');

function serializeInvoice(invoice) {
  return {
    id: invoice.id,
    invoiceNumber: invoice.invoiceNumber,
    orderId: invoice.orderId,
    customerName: invoice.customer?.name || invoice.customerName,
    paymentMethod: invoice.order?.payment?.method || null,
    status: invoice.order?.payment?.status || 'PENDING',
    subtotal: invoice.subtotal.toNumber(),
    tax: invoice.tax.toNumber(),
    total: invoice.total.toNumber(),
    amount: invoice.total.toNumber(),
    createdAt: invoice.createdAt,
    order: invoice.order
      ? {
          id: invoice.order.id,
          orderNumber: invoice.order.orderNumber,
          status: invoice.order.status,
          items: invoice.order.items.map((i) => ({
            name: i.name,
            price: i.price.toNumber(),
            quantity: i.quantity,
          })),
        }
      : null,
  };
}

async function listInvoices() {
  const invoices = await prisma.invoice.findMany({
    include: {
      customer: { select: { name: true, email: true, phone: true } },
      order: { include: { items: true, payment: true } },
    },
    orderBy: { createdAt: 'desc' },
  });
  return invoices.map(serializeInvoice);
}

async function getInvoice(id) {
  const invoice = await prisma.invoice.findUnique({
    where: { id },
    include: {
      customer: { select: { name: true, email: true, phone: true } },
      order: { include: { items: true, payment: true } },
    },
  });
  if (!invoice) throw new ApiError(404, 'Invoice not found.');
  return serializeInvoice(invoice);
}

module.exports = {
  listInvoices,
  getInvoice,
};