const managerService = require('../services/manager.service');

async function getDashboard(req, res, next) {
  try {
    const data = await managerService.getDashboard();
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getDashboard,
};