const invoiceService = require('../services/invoice.service');

async function listInvoices(req, res, next) {
  try {
    const invoices = await invoiceService.listInvoices();
    res.status(200).json({ success: true, data: invoices });
  } catch (error) {
    next(error);
  }
}

async function getInvoice(req, res, next) {
  try {
    const invoice = await invoiceService.getInvoice(req.params.id);
    res.status(200).json({ success: true, data: invoice });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  listInvoices,
  getInvoice,
};