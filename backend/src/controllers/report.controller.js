const reportService = require('../services/report.service');

async function salesReport(req, res, next) {
  try {
    const data = await reportService.salesReport();
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
}

async function revenueReport(req, res, next) {
  try {
    const data = await reportService.revenueReport();
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
}

async function ordersReport(req, res, next) {
  try {
    const data = await reportService.ordersReport();
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
}

async function deliveryPerformanceReport(req, res, next) {
  try {
    const data = await reportService.deliveryPerformanceReport();
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  salesReport,
  revenueReport,
  ordersReport,
  deliveryPerformanceReport,
};