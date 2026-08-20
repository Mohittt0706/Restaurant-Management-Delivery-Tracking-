const prisma = require('../config/prisma');
const { toSafeUser } = require('../services/auth.service');
const { ApiError } = require('../middleware/error.middleware');

async function getCurrentUser(req, res, next) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
    });

    if (!user) {
      throw new ApiError(404, 'User not found.');
    }

    res.status(200).json({ success: true, data: { user: toSafeUser(user) } });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getCurrentUser,
};