const weatherService = require('../services/weather.service');

const getWeather = async (req, res, next) => {
  try {
    const weather = await weatherService.getWeatherImpact(req.query.location);
    res.status(200).json({ success: true, data: weather });
  } catch (err) {
    next(err);
  }
};

module.exports = { getWeather };
