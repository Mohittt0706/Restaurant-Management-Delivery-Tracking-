const jwt = require('jsonwebtoken');

const env = require('../config/env');
const { ApiError } = require('./error.middleware');

function authenticate(req, res, next) {
  const header = req.headers.authorization || '';

  const [scheme, token] = header.split(' ');

  if (scheme !== 'Bearer' || !token) {
    return next(new ApiError(401, 'Authentication required.'));
  }

  let payload;
  try {
    payload = jwt.verify(token, env.JWT_SECRET);
  } catch (error) {
    const message =
      error.name === 'TokenExpiredError'
        ? 'Session has expired. Please log in again.'
        : 'Invalid or expired token.';
    return next(new ApiError(401, message));
  }

  req.user = {
    userId: payload.userId,
    role: payload.role,
  };

  next();
}

module.exports = {
  authenticate,
};
