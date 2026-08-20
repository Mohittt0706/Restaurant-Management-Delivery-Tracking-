const authService = require('../services/auth.service');

const getProfile = async (req, res, next) => {
  try {
    const user = await authService.getMe(req.user.id);
    res.status(200).json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
};

module.exports = { getProfile };
