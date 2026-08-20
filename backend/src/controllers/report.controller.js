const reportService = require('../services/report.service');

const getSalesReport = async (req, res, next) => {
  try {
    const report = await reportService.getSalesReport();
    res.status(200).json({ success: true, data: report });
  } catch (err) {
    next(err);
  }
};

const getRevenueReport = async (req, res, next) => {
  try {
    const report = await reportService.getRevenueReport();
    res.status(200).json({ success: true, data: report });
  } catch (err) {
    next(err);
  }
};

const getOrdersReport = async (req, res, next) => {
  try {
    const report = await reportService.getOrdersReport();
    res.status(200).json({ success: true, data: report });
  } catch (err) {
    next(err);
  }
};

const getDeliveryPerformanceReport = async (req, res, next) => {
  try {
    const report = await reportService.getDeliveryPerformanceReport();
    res.status(200).json({ success: true, data: report });
  } catch (err) {
    next(err);
  }
};

module.exports = { getSalesReport, getRevenueReport, getOrdersReport, getDeliveryPerformanceReport };
