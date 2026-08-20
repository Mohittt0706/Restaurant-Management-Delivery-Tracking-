const { ApiError } = require('./error.middleware');

const ROLES = {
  CUSTOMER: 'CUSTOMER',
  ADMIN: 'ADMIN',
  KITCHEN: 'KITCHEN',
  DELIVERY: 'DELIVERY',
};

function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return next(new ApiError(401, 'Authentication required.'));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(new ApiError(403, 'You do not have permission to perform this action.'));
    }

    next();
  };
}

module.exports = {
  ROLES,
  requireRole,
};
