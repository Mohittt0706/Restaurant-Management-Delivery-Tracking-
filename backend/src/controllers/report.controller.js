const reportService = require('../services/report.service');

const getSalesReport = async (req, res, next) => {
  try {
    const report = await reportService.getSalesReport();
    res.status(200).json({ success: true, data: report });
  } catch (err) {
    next(err);
  }
};

module.exports = { getSalesReport };
