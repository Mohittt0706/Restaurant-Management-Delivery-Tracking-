const invoiceService = require('../services/invoice.service');

const getInvoice = async (req, res, next) => {
  try {
    const invoice = await invoiceService.getInvoiceByOrderId(req.params.orderId, req.user.id, req.user.role);
    res.status(200).json({ success: true, data: invoice });
  } catch (err) {
    next(err);
  }
};

const listInvoices = async (req, res, next) => {
  try {
    const invoices = await invoiceService.listInvoices();
    res.status(200).json({ success: true, data: invoices });
  } catch (err) {
    next(err);
  }
};

module.exports = { getInvoice, listInvoices };
