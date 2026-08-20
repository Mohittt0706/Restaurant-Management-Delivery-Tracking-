const mapsService = require('../services/maps.service');

const getRoute = async (req, res, next) => {
  try {
    const route = await mapsService.calculateRoute(req.query.origin, req.query.destination);
    res.status(200).json({ success: true, data: route });
  } catch (err) {
    next(err);
  }
};

module.exports = { getRoute };
