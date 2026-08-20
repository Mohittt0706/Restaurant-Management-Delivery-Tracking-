const { ApiError } = require('./error.middleware');

function validate(validator) {
  return (req, res, next) => {
    const { errors, value } = validator.validate(req.body);

    if (errors && errors.length > 0) {
      return next(new ApiError(400, 'Validation failed.', errors));
    }

    req.body = value || req.body;
    next();
  };
}

module.exports = {
  validate,
};
